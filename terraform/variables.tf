# Load variables com the .env in the upper
# locals {
#   envs = { for tuple in regexall("(.*)=(.*)", file("../.env")) : trim(tuple[0]," ") => trim(trim(tuple[1]," "),"\"") }
# }

# output "envs" {
#   description = "Astra DB Organization ID"
#   value = local.envs["ASTRA_DB_ORG_ID"]
# }


variable "ASTRA_ORG_ID" {
  type = string
}

variable "ASTRA_TOKEN" {
  type = string
}

data "astra_available_regions" "regions" {
}

locals {
    regions = ["europe-west1"]
    cloud_provider = "gcp"
    keyspace = "app"
    database_name = "logistics"
    streaming_tenant = "logistics-st"
    telemetry_topic = "telemetry"
    alert_topic = "alert"
    user_email = "samuel.matioli@datastax.com"
}

output "envs" {
  description = "Astra DB Organization ID"
  value = var.ASTRA_ORG_ID
}

data astra_secure_connect_bundle_url "logistics-scb" {
  database_id = astra_database.app.id
}

output "bundle" {
  description = "Astra DB bundle"
  value = data.astra_secure_connect_bundle_url.logistics-scb
}
