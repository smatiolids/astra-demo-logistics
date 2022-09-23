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
