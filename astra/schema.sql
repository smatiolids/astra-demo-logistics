CREATE TABLE logisticsdemo.devices (
  organization_id text,
  device_id text,
  name text,
  description text,
  characteristics MAP<text, text>,
  primary key (organization_id, device_id)
);

CREATE TABLE logisticsdemo.telemetry (
  organization_id text,
  device_id text,
  key text,
  day date,
  ts timestamp,
  value decimal,
  value2 decimal,
  primary key ((organization_id,device_id), key, day, ts)
) with clustering order by (key asc, day desc, ts desc);

CREATE TABLE telemetry_latest (
  organization_id text,
  device_id text,
  key text,
  day date,
  ts timestamp,
  value float,
  value2 float
  primary key ((organization_id), key, device_id )
) 

CREATE CUSTOM INDEX telemetry_latest_key ON telemetry_latest (key) 
USING 'StorageAttachedIndex' ;

CREATE CUSTOM INDEX telemetry_latest_ts ON telemetry_latest (ts) 
USING 'StorageAttachedIndex' ;


CREATE TABLE logisticsdemo.alert (
  organization_id text,
  device_id text,
  key text,
  day date,
  ts timestamp,
  value decimal,
  value2 decimal,
  alert_message text,
  primary key ((organization_id,device_id), day, ts, alert_message)
) with clustering order by (day desc, ts desc, alert_message asc);