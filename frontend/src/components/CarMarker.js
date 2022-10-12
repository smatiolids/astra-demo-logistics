import { useEffect, useState } from "react";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import {useNavigate} from 'react-router-dom';
import L from "leaflet";

import carIcon from "./images/car.png";

const icon = L.icon({
  iconSize: [50, 25],
  popupAnchor: [2, -20],
  iconUrl: carIcon
});

export default function CarMarker({ data, device_id }) {
  const { lat, lng } = data;
  const [prevPos, setPrevPos] = useState([lat, lng]);
  const navigate = useNavigate();

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
          navigate(`/tracking/${device_id}`);
        },
      }}
    />
  );
}
