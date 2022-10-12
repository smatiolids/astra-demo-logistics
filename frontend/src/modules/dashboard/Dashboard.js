import * as React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { LiveMap } from "../../components/LiveMap";

const Dashboard = () => (
  <Card>
    <CardHeader title="Real Time Tracking" />
    <CardContent>
      <LiveMap />
    </CardContent>
  </Card>
);

export default Dashboard;
