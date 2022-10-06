import * as React from "react";
import { Card, CardContent, CardHeader } from '@mui/material';
import { LiveMap } from "../../components/LiveMap"


const Dashboard = () => (
    <Card>
        <CardHeader title="Welcome to the administration" />
        <CardContent>Lorem ipsum sic dolor amet...</CardContent>
        <LiveMap/>
    </Card>
);

export default Dashboard;