import { Divider, Typography } from "@mui/material";
import { Create, SimpleForm, TextInput } from "react-admin";

export const ResourceCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <Typography variant="h4">Create Team Member</Typography>
      <Divider/>
      <TextInput source="organization_id" label="Organization ID"/>
      <TextInput source="resource_id" label="Team Member ID"/>
      <TextInput source="name" fullWidth/>
      <TextInput source="role" fullWidth/>
      <TextInput source="picture_url" fullWidth/>
    </SimpleForm>
  </Create>
);
