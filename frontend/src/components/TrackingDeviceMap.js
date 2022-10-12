import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { latLngBounds } from "leaflet";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";

const TELEMETRY_KEY = "latlong";

const GET_TRACKING = gql`
  query getTracking(
    $org: String
    $dev: String
    $key: String
    $lastDay: Date
    $lastTS: Timestamp
  ) {
    telemetry(
      options: { pageSize: 100 }
      filter: {
        organization_id: { eq: $org }
        device_id: { eq: $dev }
        key: { eq: $key }
        day: { eq: $lastDay }
        ts: { gt: $lastTS }
      }
    ) {
      values {
        lat: value
        lng: value2
        ts
      }
    }
  }
`;

function Path({ polyline }) {
  const pathOptions = { color: "red" };
  const map = useMap();
  let markerBounds = latLngBounds([]);
  if (polyline && polyline.length > 0) {
    polyline.forEach((marker) => {
      markerBounds.extend([marker[0], marker[1]]);
    });
    map.fitBounds(markerBounds);
  }
  return <Polyline pathOptions={pathOptions} positions={polyline} />;
}

const TrackingDeviceMap = (props) => {
  const [polyline, setPolyline] = useState([]);
  const [config, setConfig] = useState({
    lastTS: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
  });

  const { data } = useQuery(GET_TRACKING, {
    variables: {
      org: process.env.REACT_APP_ORG_ID,
      dev: props.device_id,
      key: TELEMETRY_KEY,
      lastTS: config.lastTS,
      lastDay: config.lastTS.substring(0, 10),
    },
    pollInterval: 5000,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (
      data &&
      data.telemetry &&
      data.telemetry.values &&
      data.telemetry.values[0]
    ) {
      setConfig((l) => ({
        lastPosition: [
          data.telemetry.values[0].lat,
          data.telemetry.values[0].lng,
        ],
        lastTS: data.telemetry.values[0]["ts"],
        firstPosition: l.firstPosition
          ? l.firstPosition
          : [data.telemetry.values[0].lat, data.telemetry.values[0].lng],
      }));

      setPolyline((p) =>
        p.concat(data.telemetry.values.reverse().map((e) => [e.lat, e.lng]))
      );
    }
  }, [data]);

  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={config.initialPosition || [0, 0]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Path polyline={polyline} />
    </MapContainer>
  );
};

export default TrackingDeviceMap;
