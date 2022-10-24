# Astra-demo-logistics

# Environment Variables

Copy the .env_sample to .env and define your local variables
# Producer

The producer will receive a file path, an organization_id and a device_id

````
go run main.go <file path>
````

## How to generate path files

- Go to the url https://www.keene.edu/campus/maps/tool/[https://www.keene.edu/campus/maps/tool/] and create a path.
- Copy the lat-long part separated by comma to a file with the following pattern <organization_id>-<device-id>-<data_or_key>.txt
- The producer will send a line every 3 seconds with the current timestamp.

# Frontend

Built on react-admin (https://marmelab.com/react-admin/).
The data provider is adapted to woth with Astra Stargate.

ATTENTION: Variables for the React App have to be defined in the .env file inside the "/frontend" folder

To run, just use the following command:

````
cd frontend
npm install
npm start
````

