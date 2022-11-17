import {
  List,
  Datagrid,
  TextField,
  EditButton,
} from "react-admin";

export const ResourceList = () => (
  <List queryOptions={{key:['organization_id','resource_id']}}>
    <Datagrid >
      <TextField source="resource_id" />
      <TextField source="name" />
      <TextField source="role" />
      <EditButton />
    </Datagrid>
  </List>
);
