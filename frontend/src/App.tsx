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
import { AstraResources } from "./AstraResources";
import { InvoiceList } from "./modules/invoices/InvoiceList";

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
      options={{ key: AstraResources.devices.key, label: "Devices" }}
    />
    <Resource
      name="resources"
      list={ResourceList}
      edit={ResourceEdit}
      create={ResourceCreate}
      options={{ key: AstraResources.resources.key, label: "Team" }}
    />
    <Resource
      name="alert"
      list={AlertList}
      options={{ key: AstraResources.alert.key, label: "Alerts" }}
    />
    <Resource
      name="invoices"
      list={InvoiceList}
      options={{ key: AstraResources.invoices.key, label: "Invoices" }}
    />
    <CustomRoutes>
      <Route path="/tracking/:device_id" element={<TrackingDevice />} />
      <Route path="/about" element={<About />} />
    </CustomRoutes>
  </Admin>
);
export default App;
