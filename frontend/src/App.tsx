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
    <CustomRoutes>
      <Route path="/tracking/:device_id" element={<TrackingDevice />} />
      <Route path="/about" element={<About />} />
    </CustomRoutes>
  </Admin>
);
export default App;
