import { Card, CardContent, CardHeader } from "@mui/material";

const About = (props) => {
  return (
    <Card>
      <CardHeader title="About Astra for Logistics" />
      <CardContent>
        <p className="py-2">
          The Logistics App uses features from DataStax Astra to provide
          real-time data to developers and users
        </p>
        <img src="architecture.png" alt="Logo" />
        <p className="py-2">
          The data from device are sent using a Golang Producer. Any type of
          sensor data can be sent with the producer, but in this app we are focusing on
          the latitude/longitude and speed
        </p>
        <p className="py-2">
          The data from the sensor are received by a topic "telemetry". 
        </p>
        <p className="py-2">
          Then, two sinks receive the data from the topic and persists them into tables.
        </p>

      </CardContent>
    </Card>
  );
};

export default About;
