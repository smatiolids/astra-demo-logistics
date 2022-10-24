import { useQuery } from "@apollo/client";
import { GET_DEVICE, GET_TELEMETRY_LATEST_BY_DEVICE } from "../graphQL/queries";
import Typography from "@mui/material/Typography";
import { telemetry_icons } from "../globals";

const DeviceLatest = (props) => {
  const { data } = useQuery(GET_TELEMETRY_LATEST_BY_DEVICE, {
    variables: {
      org: process.env.REACT_APP_ORG_ID,
      dev: props.device_id,
      lastTS: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
    },
    pollInterval: 5000,
    fetchPolicy: "network-only",
  });

  const { data: device } = useQuery(GET_DEVICE, {
    variables: {
      org: process.env.REACT_APP_ORG_ID,
      dev: props.device_id,
    },
    fetchPolicy: "network-only",
  });

  return (
    <div className="flex flex-col p-12">
      {device?.devices?.values[0] && (
        <div className="pb-12">
          <Typography variant="h5">Vehicle</Typography>
          <div className="flex flex-row py-2">
            <div className="font-bold w-32">Device:</div>
            {device?.devices?.values[0].name}
          </div>
          <div className="flex flex-row  py-2">
            <div className="font-bold w-32">Description:</div>
            {device?.devices?.values[0].description}
          </div>
        </div>
      )}
      {data?.telemetry_latest?.values && (
        <div className="pb-12">
          <Typography variant="h5">Latest Indicators </Typography>
          {data.telemetry_latest.values.map((e, ix) => (
            <div className="flex flex-row py-2">
              <div className="font-bold w-32">
                {<div>{telemetry_icons[e.key]}</div>}
              </div>
              {`${e["value"]}`} {e["value2"] && ` | ${e["value2"]}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceLatest;
