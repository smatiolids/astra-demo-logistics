import {
  List,
  Datagrid,
  TextField
} from "react-admin";

export const AlertList = () => (
  <List queryOptions={{key:['organization_id','device_id']}}>
    <Datagrid isRowSelectable={false} >
      <TextField source="device_id" />
      <TextField source="key" />
      <TextField source="value" />
      <TextField source="alert_message" />
      <TextField source="ts" />
    </Datagrid>
  </List>
);
