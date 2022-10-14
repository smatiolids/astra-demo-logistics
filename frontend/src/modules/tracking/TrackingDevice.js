import { Card, CardContent, CardHeader } from "@mui/material";
import TrackingDeviceMap from "../../components/TrackingDeviceMap";
import { useParams } from "react-router-dom";
import DeviceLatest from "../../components/DeviceLatest";

const TrackingDevice = (props) => {
  const { device_id } = useParams();
  return (
    <Card>
      <CardHeader title="Real Time Tracking" />
      <CardContent>
        <div className="flex ">
          <div className="h-screen w-2/3">
            <TrackingDeviceMap device_id={device_id} />
          </div>
          <div className="w-1/3">
            <DeviceLatest device_id={device_id}/>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingDevice;
