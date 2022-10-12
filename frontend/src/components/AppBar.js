import { ToggleThemeButton, AppBar } from "react-admin";
import { Typography } from "@mui/material";
import { DarkTheme, LightTheme } from "../themes";
import { ReactComponent as AppLogo } from "./images/truck.svg";

const AppBarCustom = (props) => (
  <AppBar {...props}>
    <Typography flex="1" variant="h6" id="react-admin-title">
      Astra Log
    </Typography>
    <ToggleThemeButton lightTheme={LightTheme} darkTheme={DarkTheme} />
  </AppBar>
);

export default AppBarCustom;
