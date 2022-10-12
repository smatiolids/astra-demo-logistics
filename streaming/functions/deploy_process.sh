# Add apache-pulsar/bin to you PATH

./pulsar-admin functions create \
  --py ./uppercase.py \
  --classname uppercase \
  --tenant cdcdemo-streams \
  --namespace default \
  --inputs raw-data \
  --output 