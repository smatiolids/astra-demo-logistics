pulsar-admin functions create \
  --jar /Users/samuel.matioli/work/astra-demo-logistics/streaming-functions/java/streamingfunction/target/streamingfunction-1.0-SNAPSHOT.jar \
  --classname com.astra.logisticsdemo.CheckSpeedFunction \
  --tenant cdcdemo-streams \
  --namespace default \
  --name checkspeed \
  --auto-ack true \
  --inputs persistent://cdcdemo-streams/default/telemetry \
  --output persistent://cdcdemo-streams/default/alert \
  --log-topic persistent://cdcdemo-streams/default/test-log 