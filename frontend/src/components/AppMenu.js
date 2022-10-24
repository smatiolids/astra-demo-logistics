import { Menu } from 'react-admin';
import HelpIcon from '@mui/icons-material/Help';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningIcon from "@mui/icons-material/Warning";

export const AppMenu = (props) => (
    <Menu {...props}>
        <Menu.DashboardItem />
        <Menu.Item to="/devices" primaryText="Devices" leftIcon={<LocalShippingIcon />}/>
        <Menu.Item to="/alerts" primaryText="Alerts" leftIcon={<WarningIcon />}/>
        <Menu.Item to="/about" primaryText="About" leftIcon={<HelpIcon />}/>
    </Menu>
);