import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = `https://${process.env.REACT_APP_ASTRA_DB_ID}-${process.env.REACT_APP_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${process.env.REACT_APP_ASTRA_DB_KEYSPACE}`;
const apiOptions = {
  headers: new Headers({
    "x-cassandra-token": process.env.REACT_APP_ASTRA_DB_APPLICATION_TOKEN,
  }),
};
const httpClient = fetchUtils.fetchJson;

const resources = {
  devices: {
    keys: ["organization_id", "device_id"],
  },
};

const SEPARATOR = "_";
const RecordId = (resource, record) => {
  return resources[resource].keys.map((k) => record[k]).join(SEPARATOR);
};

const IdToRecord = (resource, id) => {
  return id.split(SEPARATOR).join("/");
};

const AstraDataProvider = {
  getList: (resource, params) => {
    const { perPage } = params.pagination;
    // const { page, perPage } = params.pagination;
    // const { field, order } = params.sort;
    const query = {
      "page-size": perPage,
    };
    const url = `${apiUrl}/${resource}/rows?${stringify(query)}`;
    console.log(params);

    return httpClient(url, apiOptions).then(({ json }) => ({
      data: json.data.map((r) => ({
        id: RecordId(resource, r),
        ...r,
      })),
      total: json.count,
    }));
  },

  getOne: (resource, params) =>
    httpClient(
      `${apiUrl}/${resource}/${IdToRecord(resource, params.id)}`,
      apiOptions
    ).then(({ json }) => ({
      data: {
        id: RecordId(resource, json.data[0]),
        ...json.data[0],
      },
    })),

  getMany: (resource, params) => {
    const url = `${apiUrl}/${resource}/${IdToRecord(resource, params.id)}`;
    return httpClient(url, apiOptions).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource, params) => {
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
    let body = params.data;
    // Not allowed to send id and pk fields in body
    resources[resource].keys.concat("id").forEach((k) => delete body[k]);
    return httpClient(
      `${apiUrl}/${resource}/${IdToRecord(resource, params.id)}`,
      {
        ...apiOptions,
        method: "PUT",
        body: JSON.stringify(body),
      }
    ).then(({ json }) => ({
      data: {
        id: RecordId(resource, json.data),
        ...json.data,
      },
    }));
  },

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource, params) => {
    let body = params.data;
    // Not allowed to send id field in body
    ["id"].forEach((k) => delete body[k]);

    return httpClient(`${apiUrl}/${resource}`, {
      ...apiOptions,
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: RecordId(resource, json) },
    }));
  },

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },
};

export default AstraDataProvider;
