resource "astra_streaming_sink" "sink-telemetry" {
  depends_on     = [astra_streaming_tenant.streaming_tenant-1]
  tenant_name    = astra_streaming_tenant.streaming_tenant-1.tenant_name
  topic          = "persistent://${astra_streaming_tenant.streaming_tenant-1.tenant_name}/default/${local.telemetry_topic}"
  region         = local.regions[0]
  cloud_provider = local.cloud_provider
  sink_name      = "cassandra-enhanced"
  #sink_name = "sink_telemetry_lat"

  retain_ordering       = false
  processing_guarantees = "ATLEAST_ONCE"
  parallelism           = 1
  namespace             = "default"
  sink_configs = jsonencode({
    "name" : "sink_telemetry",
    "auth" : {
      "gssapi" : {
        "service" : "dse"
      },
      "password" : var.ASTRA_TOKEN,
      "provider" : "None",
      "username" : "token"
    },
    "cloud.secureConnectBundle" : "${data.astra_secure_connect_bundle_url.logistics-scb.url}"
    "compression" : "None",
    "connectionPoolLocalSize" : 4,
    "ignoreErrors" : "None",
    "jmx" : true,
    "maxConcurrentRequests" : 500,
    "maxNumberOfRecordsInBatch" : 32,
    "queryExecutionTimeout" : 30,
    "task.max" : 1,
    "tasks.max" : 1,
    "topic" : {
      "${astra_streaming_tenant.streaming_tenant-1.topic}" : {
        "codec" : {
          "date" : "ISO_LOCAL_DATE",
          "locale" : "en_US",
          "time" : "ISO_LOCAL_TIME",
          "timeZone" : "UTC",
          "timestamp" : "CQL_TIMESTAMP",
          "unit" : "MILLISECONDS"
        },
        "${local.keyspace}" : {
          "${astra_table.telemetry.table}" : {
            "consistencyLevel" : "LOCAL_QUORUM",
            "deletesEnabled" : true,
            "mapping" : "organization_id=value.organization_id, device_id=value.device_id, key=value.key, day=value.day, ts=value.ts, value=value.value, value2=value.value2",
            "nullToUnset" : true,
            "timestampTimeUnit" : "MICROSECONDS",
            "ttl" : -1,
            "ttlTimeUnit" : "SECONDS"
          }
        }
      }
    }
  })
  auto_ack = false
}

resource "astra_streaming_sink" "sink-telemetry-latest" {
  count          = 0 // While this issue still opened (https://github.com/datastax/terraform-provider-astra/issues/193) cannot create more than one sink
  depends_on     = [astra_streaming_tenant.streaming_tenant-1]
  tenant_name    = astra_streaming_tenant.streaming_tenant-1.tenant_name
  topic          = "persistent://${astra_streaming_tenant.streaming_tenant-1.tenant_name}/default/${local.telemetry_topic}"
  region         = local.regions[0]
  cloud_provider = local.cloud_provider
  sink_name      = "cassandra-enhanced"
  #sink_name             = "sink_telemetry_lat"
  retain_ordering       = false
  processing_guarantees = "ATLEAST_ONCE"
  parallelism           = 1
  namespace             = "default"
  sink_configs = jsonencode({
    "name" : "sink_latest",
    "auth" : {
      "gssapi" : {
        "service" : "dse"
      },
      "password" : var.ASTRA_TOKEN,
      "provider" : "None",
      "username" : "token"
    },
    "cloud.secureConnectBundle" : "${data.astra_secure_connect_bundle_url.logistics-scb.url}"
    "compression" : "None",
    "connectionPoolLocalSize" : 4,
    "ignoreErrors" : "None",
    "jmx" : true,
    "maxConcurrentRequests" : 500,
    "maxNumberOfRecordsInBatch" : 32,
    "queryExecutionTimeout" : 30,
    "task.max" : 1,
    "tasks.max" : 1,
    "topic" : {
      "${astra_streaming_tenant.streaming_tenant-1.topic}" : {
        "codec" : {
          "date" : "ISO_LOCAL_DATE",
          "locale" : "en_US",
          "time" : "ISO_LOCAL_TIME",
          "timeZone" : "UTC",
          "timestamp" : "CQL_TIMESTAMP",
          "unit" : "MILLISECONDS"
        },
        "${local.keyspace}" : {
          "${astra_table.telemetry_latest.table}" : {
            "consistencyLevel" : "LOCAL_QUORUM",
            "deletesEnabled" : true,
            "mapping" : "organization_id=value.organization_id, device_id=value.device_id, key=value.key, day=value.day, ts=value.ts, value=value.value, value2=value.value2",
            "nullToUnset" : true,
            "timestampTimeUnit" : "MICROSECONDS",
            "ttl" : -1,
            "ttlTimeUnit" : "SECONDS"
          }
        }
      }
    }
  })
  auto_ack = false
}
