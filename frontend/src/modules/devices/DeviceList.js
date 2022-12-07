import { List, Datagrid, TextField, EditButton } from "react-admin";

export const DeviceList = (props) => (
  <List queryOptions={{ key: props.key }}>
    <Datagrid>
      <TextField source="device_id" />
      <TextField source="name" />
      <TextField source="description" />
      <EditButton />
    </Datagrid>
  </List>
);
