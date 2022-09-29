import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserList } from "./modules/users/UserList";
import { DeviceList } from "./modules/devices/DeviceList";
import { DeviceEdit } from "./modules/devices/DeviceEdit";
import { DeviceCreate } from "./modules/devices/DeviceCreate";
import AppLayout from "./components/AppLayout";
import { DarkTheme } from "./themes";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import UserIcon from "@mui/icons-material/Group";
import Dashboard from "./modules/dashboard/Dashboard";
import authProvider from "./providers/authProvider";
import AstraDataProvider from "./providers/AstraDataProvider";

// const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const App = () => (
  <Admin
    dashboard={Dashboard}
    authProvider={authProvider}
    dataProvider={AstraDataProvider}
    layout={AppLayout}
    theme={DarkTheme}
  >
    {/* <Resource
      name="users"
      list={UserList}
      icon={UserIcon}
      recordRepresentation="name"
    /> */}
    <Resource
      name="devices"
      list={DeviceList}
      icon={LocalShippingIcon}
      edit={DeviceEdit}
      create={DeviceCreate}
      options={{ pk: ["organization_id", "device_id"], label: 'Devices' }}
    />
  </Admin>
);
export default App;
