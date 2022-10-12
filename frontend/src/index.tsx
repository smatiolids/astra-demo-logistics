import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: `https://${process.env.REACT_APP_ASTRA_DB_ID}-${process.env.REACT_APP_ASTRA_DB_REGION}.apps.astra.datastax.com/api/graphql/${process.env.REACT_APP_ASTRA_DB_KEYSPACE}`,
  cache: new InMemoryCache(),
  headers: {
    "x-cassandra-token": process.env.REACT_APP_ASTRA_DB_APPLICATION_TOKEN!,
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
