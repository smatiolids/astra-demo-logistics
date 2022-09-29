import {
  List,
  Datagrid,
  TextField,
  EditButton,
} from "react-admin";

export const DeviceList = () => (
  <List queryOptions={{key:['organization_id','device_id']}}>
    <Datagrid >
      <TextField source="device_id" />
      <TextField source="name" />
      <TextField source="description" />
      <EditButton />
    </Datagrid>
  </List>
);
