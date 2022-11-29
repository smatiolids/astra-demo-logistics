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
  default = "41940237-476e-46b6-9971-1615fcb28048s"
}

variable "ASTRA_TOKEN" {
  type = string
  default = "AstraCS:oYvsBhsoBJZcnUOUZoLgvaJm:f289162b0e13ba62f8146acc4f7c7ecc7477deca73b85f2946d471f118dcf8e5"
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

# output "regions" {
#   description = "regions"
#   value = data.astra_available_regions.regions
# }