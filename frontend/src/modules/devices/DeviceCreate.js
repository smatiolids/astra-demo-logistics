import { Divider, Typography } from "@mui/material";
import { Create, SimpleForm, TextInput } from "react-admin";

export const DeviceCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <Typography variant="h4">Create device</Typography>
      <Divider/>
      <TextInput source="organization_id" label="Organization ID"/>
      <TextInput source="device_id" label="Device ID"/>
      <TextInput source="name" fullWidth/>
      <TextInput multiline source="description" fullWidth/>
    </SimpleForm>
  </Create>
);
