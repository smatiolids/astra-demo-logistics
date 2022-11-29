resource "astra_table" "devices" {
  table       = "devices"
  keyspace = local.keyspace
  database_id = astra_database.app.id
  region = local.regions[0]
  clustering_columns = "device_id"
  partition_keys = "organization_id"
  column_definitions= [
    {
      Name: "organization_id"
      TypeDefinition: "text"
    },
    {
      Name: "device_id"
      TypeDefinition: "text"
    },
    {
      Name: "name"
      TypeDefinition: "text"
    },
    {
      Name: "description"
      TypeDefinition: "text"
    }
  ]
}

resource "astra_table" "telemetry" {
  table       = "telemetry"
  keyspace = local.keyspace
  database_id = astra_database.app.id
  region = local.regions[0]
  clustering_columns = "key:day:ts"
  partition_keys = "organization_id:device_id"
  column_definitions= [
    {
      Name: "organization_id"
      TypeDefinition: "text"
    },
    {
      Name: "device_id"
      TypeDefinition: "text"
    },
    {
      Name: "key"
      TypeDefinition: "text"
    },
    {
      Name: "day"
      TypeDefinition: "date"
    },
    {
      Name: "ts"
      TypeDefinition: "timestamp"
    },
    {
      Name: "value"
      TypeDefinition: "decimal"
    },
    {
      Name: "value2"
      TypeDefinition: "decimal"
    }
  ]
}


resource "astra_table" "telemetry_latest" {
  table       = "telemetry_latest"
  keyspace = local.keyspace
  database_id = astra_database.app.id
  region = local.regions[0]
  clustering_columns = "key:device_id"
  partition_keys = "organization_id"
  column_definitions= [
    {
      Name: "organization_id"
      TypeDefinition: "text"
    },
    {
      Name: "device_id"
      TypeDefinition: "text"
    },
    {
      Name: "key"
      TypeDefinition: "text"
    },
    {
      Name: "day"
      TypeDefinition: "date"
    },
    {
      Name: "ts"
      TypeDefinition: "timestamp"
    },
    {
      Name: "value"
      TypeDefinition: "decimal"
    },
    {
      Name: "value2"
      TypeDefinition: "decimal"
    }
  ]
}


resource "astra_table" "alert" {
  table       = "alert"
  keyspace = local.keyspace
  database_id = astra_database.app.id
  region = local.regions[0]
  clustering_columns = "day:ts:alert_message"
  partition_keys = "organization_id:device_id"
  column_definitions= [
    {
      Name: "organization_id"
      TypeDefinition: "text"
    },
    {
      Name: "device_id"
      TypeDefinition: "text"
    },
    {
      Name: "key"
      TypeDefinition: "text"
    },
    {
      Name: "day"
      TypeDefinition: "date"
    },
    {
      Name: "ts"
      TypeDefinition: "timestamp"
    },
    {
      Name: "value"
      TypeDefinition: "decimal"
    },
    {
      Name: "value2"
      TypeDefinition: "decimal"
    },
    {
      Name: "alert_message"
      TypeDefinition: "text"
    }
  ]
}