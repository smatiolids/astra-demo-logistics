# Astra-demo-logistics

# Environment Variables

Copy the .env_sample to .env and define your local variables

# Run Docker Containers

At the project root folder, run:

```

docker-compose up

```

# Producer

All the messages can be triggered via APIs.

- GET /ping
  - Endpoint to troubleshoot communication with the backend. If it responds, communictaion is ok
- GET /files
  - Returns all files uplaoded and available at the tmp folder to be produced
- POST /upload
  - Upload multiple files to be produced
- DELETE /files
  - Delete all the files in the tmp folder.
- POST /produce
  - Starts the producers for all files. Messages are sent with a 3 second interval.
- POST /produce-file
  - Start the producer for the specified file

> You can import the file "DataStax Logistics Demo.postman_collection.json" in Postman to interact with the backend

### Attention

Once the producer is triggered, it is not possible to stop it. If needed, stop the container and then clean the data.

## How to generate path files

- Go to the url https://www.keene.edu/campus/maps/tool/[https://www.keene.edu/campus/maps/tool/] and create a path.

- Copy the lat-long part separated by comma to a file with the following pattern <organization_id>-<device-id>-<data_or_key>.txt

- The producer will send a line every 3 seconds with the current timestamp.

# Frontend

To run the frontend locally for development purposes follow the instructions:

Built on react-admin (https://marmelab.com/react-admin/).

The data provider is adapted to woth with Astra Stargate.

ATTENTION: Variables for the React App have to be defined in the .env file inside the "/frontend" folder

To run, just use the following command:

```

cd frontend

npm install

npm start

```
