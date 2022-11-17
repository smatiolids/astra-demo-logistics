import { Edit,  SimpleForm, TextInput, useRecordContext } from "react-admin";
const ResourceTitle = () => {
  const record = useRecordContext();
  return <span>Team Member {record ? `"${record.name}"` : ""}</span>;
};

export const ResourceEdit = () => (
  <Edit title={<ResourceTitle />}>
    <SimpleForm>
      <TextInput disabled source="resource_id" />
      <TextInput source="name" fullWidth/>
      <TextInput source="role" fullWidth/>
      <TextInput source="picture_url" fullWidth/>
    </SimpleForm>
  </Edit>
);
