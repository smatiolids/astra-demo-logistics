import { List, Datagrid, TextField, DateField } from "react-admin";

export const InvoiceList = (props) => (
  <List queryOptions={{ key: props.key, meta:{ fields: ["customer", "shippingDate"] }}}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="customer.name" />
      <DateField source="shippingDate" showTime/>
      {/* <EditButton /> */}
    </Datagrid>
  </List>
);
