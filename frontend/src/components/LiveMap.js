import { useQuery } from "@apollo/client";
import { latLngBounds } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { telemetry_keys } from "../globals";
import { GET_LATEST } from "../graphQL/queries";
import CarMarker from "./CarMarker";

function Markers({ markers }) {
  const map = useMap();
  let markerBounds = latLngBounds([]);
  if (markers && markers.length > 0) {
    markers.forEach((item) => {
      markerBounds.extend([item.lat, item.lng]);
    });
    map.fitBounds(markerBounds, { padding: [50, 50] });
  }
  return markers.map((item, i) => {
    return (
      <CarMarker
        key={i}
        device_id={item.device_id}
        data={{ lat: item.lat, lng: item.lng } ?? {}}
      />
    );
  });
}

export function LiveMap(props) {
  //

  const { data } = useQuery(GET_LATEST, {
    variables: {
      org: process.env.REACT_APP_ORG_ID,
      lastTS: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
      key: telemetry_keys.LATLONG,
    },
    pollInterval: 5000,
    fetchPolicy: "network-only",
    //onCompleted: (d) => console.log("completed", new Date(), d),
  });
  
  return (
    <div>
      <MapContainer
        style={{ height: "calc(100vh - 52px)" }}
        center={[20.7021094, -103.375984]}
        zoom={17}
        minZoom={5}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Markers markers={data?.telemetry_latest?.values || []} />
      </MapContainer>
    </div>
  );
}
