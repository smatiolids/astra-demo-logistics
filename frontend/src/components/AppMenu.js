import { Menu } from 'react-admin';
import HelpIcon from '@mui/icons-material/Help';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningIcon from "@mui/icons-material/Warning";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";


export const AppMenu = (props) => (
    <Menu {...props}>
        <Menu.DashboardItem />
        <Menu.Item to="/alert" primaryText="Alerts" leftIcon={<WarningIcon />}/>
        <Menu.Item to="/devices" primaryText="Devices" leftIcon={<LocalShippingIcon />}/>
        <Menu.Item to="/resources" primaryText="Team" leftIcon={<GroupsIcon />}/>
        <Menu.Item to="/invoices" primaryText="Invoices" leftIcon={<DescriptionIcon />}/>
        <Menu.Item to="/about" primaryText="About" leftIcon={<HelpIcon />}/>
    </Menu>
);