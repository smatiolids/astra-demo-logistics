import { useEffect, useState } from "react";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import L from "leaflet";

import carIcon from "./images/car.png";

const icon = L.icon({
  iconSize: [50, 25],
  popupAnchor: [2, -20],
  iconUrl: carIcon
});

export default function CarMarker({ data }) {
  const { lat, lng } = data;
  console.log("car position:", lat , '-', lng)
  const [prevPos, setPrevPos] = useState([lat, lng]);

  useEffect(() => {
    if (prevPos[1] !== lng && prevPos[0] !== lat) setPrevPos([lat, lng]);
  }, [lat, lng, prevPos]);

  return (
    <LeafletTrackingMarker
      icon={icon}
      position={[lat, lng]}
      previousPosition={prevPos}
      duration={1000}
      eventHandlers={{
        click: () => {
          console.log('marker clicked')
          alert("You Stop the car!");
        },
      }}
    />
  );
}
