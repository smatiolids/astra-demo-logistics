import { gql, useQuery } from "@apollo/client";
import { latLngBounds } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import CarMarker from "./CarMarker";

const TELEMETRY_KEY = "latlong";

const GET_CURRENT_POSITION = gql`
  query getLatestLatLong($org: String, $lastTS: Timestamp) {
    telemetry_latest(
      options: { pageSize: 100 }
      filter: {
        organization_id: { eq: $org }
        key: { eq: "latlong" }
        ts: { gt: $lastTS }
      }
    ) {
      values {
        lat: val
        lng: val2
        device_id
        ts
      }
    }
  }
`;

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

  const { data } = useQuery(GET_CURRENT_POSITION, {
    variables: {
      org: process.env.REACT_APP_ORD_ID,
      key: TELEMETRY_KEY,
      lastTS: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
    },
    pollInterval: 5000,
    fetchPolicy: "network-only",
    //onCompleted: (d) => console.log("completed", new Date(), d),
  });

  // useEffect(() => {
  //   console.log("start pooling");
  //   startPolling(1000);
  // }, []);

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
