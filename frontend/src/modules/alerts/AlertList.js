import {
  List,
  Datagrid,
  TextField,
  DateField
} from "react-admin";

export const AlertList = () => (
  <List queryOptions={{key:['organization_id','device_id']}}>
    <Datagrid isRowSelectable={false} >
      <TextField source="device_id" />
      <TextField source="key" />
      <TextField source="value" />
      <TextField source="alert_message" />
      <DateField showTime={true} source="ts" />
    </Datagrid>
  </List>
);
