import { List, Datagrid, TextField, EditButton } from "react-admin";

export const ResourceList = ({key}) => (
  <List queryOptions={{ key: key }}>
    <Datagrid>
      <TextField source="resource_id" />
      <TextField source="name" />
      <TextField source="role" />
      <EditButton />
    </Datagrid>
  </List>
);
