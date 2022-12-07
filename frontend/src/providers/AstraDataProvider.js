import { fetchUtils } from "react-admin";
import { stringify } from "query-string";
import { AstraResources as resources } from "../AstraResources";

const apiUrl = `https://${process.env.REACT_APP_ASTRA_DB_ID}-${process.env.REACT_APP_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2`;

const API = {
  REST: {
    getBase: (resource, query) =>
      `${apiUrl}/keyspaces/${process.env.REACT_APP_ASTRA_DB_KEYSPACE}/${resource}`,
    getList: (resource, query) =>
      `${apiUrl}/keyspaces/${
        process.env.REACT_APP_ASTRA_DB_KEYSPACE
      }/${resource}/rows?${stringify(query)}`,
    getOne: (resource, id) =>
      `${apiUrl}/keyspaces/${
        process.env.REACT_APP_ASTRA_DB_KEYSPACE
      }/${resource}/${IdToRecord(resource, id)}`,
  },
  DOCUMENT: {
    getBase: (resource, query) =>
      `${apiUrl}/namespaces/${process.env.REACT_APP_ASTRA_DB_KEYSPACE}/collections/${resource}`,
    getList: (resource, query) =>
      `${apiUrl}/namespaces/${
        process.env.REACT_APP_ASTRA_DB_KEYSPACE
      }/collections/${resource}?${stringify(query)}`,
    getOne: (resource, id) =>
      `${apiUrl}/namespaces/${
        process.env.REACT_APP_ASTRA_DB_KEYSPACE
      }/${resource}/collections/${IdToRecord(resource, id)}`,
  },
};

const tranformData = (resource, data) => {
  // REST API
  if (Array.isArray(data))
    return data.map((r) => ({
      id: RecordId(resource, r),
      ...r,
    }));

  // DOCUMENT API
  return Object.keys(data).map((k) => {
    return {
      id: k,
      ...data[k],
    };
  });
};

const apiOptions = {
  headers: new Headers({
    "x-cassandra-token": process.env.REACT_APP_ASTRA_DB_APPLICATION_TOKEN,
  }),
};

const httpClient = fetchUtils.fetchJson;

const SEPARATOR = "_";
const RecordId = (resource, record) => {
  return resources[resource].key.map((k) => record[k]).join(SEPARATOR);
};

const IdToRecord = (resource, id) => {
  return id.split(SEPARATOR).join("/");
};

const AstraDataProvider = {
  getList: (resource, params) => {
    const { perPage } = params.pagination;

    /**
     * TO-DO: Handle filter, order and pagination
     */
    // const { page, perPage } = params.pagination;
    // const { field, order } = params.sort;

    const query = {
      "page-size": perPage,
    };

    if (params.meta && params.meta.fields) {
      query.fields = JSON.stringify(params.meta.fields.filter((f) => f !== "id"));
    }

    const url = API[resources[resource].API].getList(resource, query);

    return httpClient(url, apiOptions).then(({ json }) => {
      return {
        data: tranformData(resource, json.data),
        total: json.count,
      };
    });
  },

  getOne: (resource, params) => {
    const url = API[resources[resource].API].getOne(resource, params.id);

    return httpClient(url, apiOptions).then(({ json }) => ({
      data: {
        id: RecordId(resource, json.data[0]),
        ...json.data[0],
      },
    }));
  },

  getMany: (resource, params) => {
    const url = API[resources[resource].API].getOne(resource, params.id);
    return httpClient(url, apiOptions).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource, params) => {
    /**
     * TO-DO: Adjust for Astra
     */

    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json,
      total: parseInt(headers.get("content-range").split("/").pop(), 10),
    }));
  },

  update: (resource, params) => {
    const url = API[resources[resource].API].getOne(resource, params.id);

    // Not allowed to send id and pk fields in body
    const body = params.data;
    resources[resource].key.concat("id").forEach((k) => delete body[k]);

    return httpClient(url, {
      ...apiOptions,
      method: "PUT",
      body: JSON.stringify(body),
    }).then(({ json }) => ({
      data: {
        id: RecordId(resource, json.data),
        ...json.data,
      },
    }));
  },

  updateMany: (resource, params) => {
    /**
     * TO-DO: Adjust for Astra
     */
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource, params) => {
    const url = API[resources[resource].API].getBase(resource);

    // Not allowed to send id field in body
    let body = params.data;
    ["id"].forEach((k) => delete body[k]);

    return httpClient(url, {
      ...apiOptions,
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: RecordId(resource, json) },
    }));
  },

  delete: (resource, params) => {
    const url = API[resources[resource].API].getOne(resource, params.id);
    return httpClient(url, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },

  deleteMany: (resource, params) => {
    /**
     * TO-DO: Adjust for Astra
     */

    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },
};

export default AstraDataProvider;
