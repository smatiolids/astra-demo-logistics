resource "astra_database" "app" {
  name           = local.database_name
  keyspace       = local.keyspace
  cloud_provider = local.cloud_provider
  regions        = local.regions
}