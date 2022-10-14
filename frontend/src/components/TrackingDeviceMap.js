import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { latLngBounds } from "leaflet";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { GET_TELEMETRY } from "../graphQL/queries";
import { telemetry_keys } from "../globals";
import CarMarker from "./CarMarker";

function Path({ polyline, device_id, latest_position }) {
  const pathOptions = { color: "red" };
  const map = useMap();
  let markerBounds = latLngBounds([]);
  if (polyline && polyline.length > 0) {
    polyline.forEach((marker) => {
      markerBounds.extend([marker[0], marker[1]]);
    });
    map.fitBounds(markerBounds);
  }
  console.log("latest_position", latest_position);
  return (
    <>
      {latest_position[0] && (
        <CarMarker
          device_id={device_id}
          data={{ lat: latest_position[0], lng: latest_position[1] } ?? {}}
        />
      )}
      <Polyline pathOptions={pathOptions} positions={polyline} />
    </>
  );
}

const TrackingDeviceMap = (props) => {
  const [polyline, setPolyline] = useState([]);
  const [config, setConfig] = useState({
    lastTS: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
    latestPosition: [],
    pooling: 0,
  });

  const { data } = useQuery(GET_TELEMETRY, {
    variables: {
      org: process.env.REACT_APP_ORG_ID,
      dev: props.device_id,
      key: telemetry_keys.LATLONG,
      lastTS: config.lastTS,
      lastDay: config.lastTS.substring(0, 10),
    },
    pollInterval: config.pooling,
    fetchPolicy: "network-only",

    onCompleted: (data) => {
      console.log("onCompleted", data);
    },
  });

  useEffect(() => {
    if (
      data &&
      data.telemetry &&
      data.telemetry.values &&
      data.telemetry.values[0]
    ) {


      setPolyline((p) =>
        p.concat(data.telemetry.values.reverse().map((e) => [e.lat, e.lng]))
      );

      setConfig((l) => ({
        latestPosition: [
          data.telemetry.values[data.telemetry.values.length-1].lat,
          data.telemetry.values[data.telemetry.values.length-1].lng,
        ],
        lastTS: data.telemetry.values[data.telemetry.values.length-1]["ts"],
        firstPosition: l.firstPosition
          ? l.firstPosition
          : [data.telemetry.values[data.telemetry.values.length-1].lat, data.telemetry.values[data.telemetry.values.length-1].lng],
        pooling: 5000,
      }));
    }
  }, [data]);

  console.log("config", config);

  return (
    <MapContainer
      className="h-full w-full"
      center={config.initialPosition || [0, 0]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Path
        polyline={polyline}
        device_id={props.device_id}
        latest_position={config.latestPosition}
      />
    </MapContainer>
  );
};

export default TrackingDeviceMap;
