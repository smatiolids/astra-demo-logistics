import { Admin, CustomRoutes, Resource } from "react-admin";
import { DeviceList } from "./modules/devices/DeviceList";
import { DeviceEdit } from "./modules/devices/DeviceEdit";
import { DeviceCreate } from "./modules/devices/DeviceCreate";
import AppLayout from "./components/AppLayout";
import { DarkTheme } from "./themes";
import { Route } from "react-router-dom";
import Dashboard from "./modules/dashboard/Dashboard";
//import authProvider from "./providers/authProvider";
import AstraDataProvider from "./providers/AstraDataProvider";
import TrackingDevice from "./modules/tracking/TrackingDevice";
import About from "./modules/about";
import { AlertList } from "./modules/alerts/AlertList";
import { ResourceList } from "./modules/resources/ResourceList";
import { ResourceEdit } from "./modules/resources/ResourceEdit";
import { ResourceCreate } from "./modules/resources/ResourceCreate";

const App = () => (
  <Admin
    dashboard={Dashboard}
    // authProvider={authProvider}
    dataProvider={AstraDataProvider}
    layout={AppLayout}
    theme={DarkTheme}
  >
    <Resource
      name="devices"
      list={DeviceList}
      edit={DeviceEdit}
      create={DeviceCreate}
      options={{ pk: ["organization_id", "device_id"], label: "Devices" }}
    />
    <Resource
      name="resources"
      list={ResourceList}
      edit={ResourceEdit}
      create={ResourceCreate}
      options={{ pk: ["organization_id", "device_id"], label: "Team" }}
    />
    <Resource
      name="alert"
      list={AlertList}
      options={{ pk: ["organization_id", "device_id"], label: "Alerts" }}
    />
    <CustomRoutes>
      <Route path="/tracking/:device_id" element={<TrackingDevice />} />
      <Route path="/about" element={<About />} />
    </CustomRoutes>
  </Admin>
);
export default App;
