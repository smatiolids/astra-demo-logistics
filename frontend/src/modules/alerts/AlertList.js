import {
  List,
  Datagrid,
  TextField,
  DateField
} from "react-admin";

export const AlertList = (props) => (
  <List queryOptions={{key:props.pk}}>
    <Datagrid isRowSelectable={false} >
      <TextField source="device_id" />
      <TextField source="key" />
      <TextField source="value" />
      <TextField source="alert_message" />
      <DateField showTime={true} source="ts" />
    </Datagrid>
  </List>
);
