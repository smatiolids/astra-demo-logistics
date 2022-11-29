resource "astra_streaming_tenant" "streaming_tenant-1" {
  tenant_name    = local.streaming_tenant
  topic          = local.telemetry_topic
  region         = local.regions[0]
  cloud_provider = local.cloud_provider
  user_email     = local.user_email
}

resource "astra_streaming_topic" "topic_alert" {
  depends_on = [
    astra_streaming_tenant.streaming_tenant-1
  ]
  tenant_name    = local.streaming_tenant
  topic          = local.alert_topic
  region         = local.regions[0]
  cloud_provider = local.cloud_provider
  namespace = "default"
}
