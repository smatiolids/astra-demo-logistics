import { Card, CardContent, CardHeader } from "@mui/material";
import TrackingDeviceMap from "../../components/TrackingDeviceMap";
import { useParams } from "react-router-dom";

const TrackingDevice = (props) => {
  const { device_id } = useParams();
  console.log("device_id", device_id);
  return (
    <Card>
      <CardHeader title="Real Time Tracking" />
      <CardContent>
        <div style={{ height: "100vh" }}>
          <TrackingDeviceMap device_id={device_id} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingDevice;
