import { Edit,  SimpleForm, TextInput, useRecordContext } from "react-admin";
const DeviceTitle = () => {
  const record = useRecordContext();
  return <span>Device {record ? `"${record.name}"` : ""}</span>;
};

export const DeviceEdit = () => (
  <Edit title={<DeviceTitle />}>
    <SimpleForm>
      <TextInput disabled source="device_id" />
      <TextInput source="name" fullWidth/>
      <TextInput multiline source="description" fullWidth/>
    </SimpleForm>
  </Edit>
);
