/**
 * For modeling the queries for Stargate some metadata is needed
 * The information for tables and collection primary keys
 */

export const AstraResources = {
  devices: {
    API: "REST",
    key: ["organization_id", "device_id"],
  },
  alert: {
    API: "REST",
    key: ["organization_id", "device_id"],
  },
  resources: {
    API: "REST",
    key: ["organization_id", "resource_id"],
  },
  invoices: {
    API: "DOCUMENT",
    key: ["docuement_id"],
  },
};
