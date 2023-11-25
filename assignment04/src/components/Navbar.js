import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

import "./nav.css";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="MuiAppBar-root">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog Site
          </Typography>

          <Button color="inherit">
            <Link to="/" className="button"> Home </Link>
          </Button>

          <Button color="inherit">
            <Link to="/login" className="button"> Log In </Link>
          </Button>

          <Button color="inherit">
            <Link to="/signup" className="button">Sign Up</Link>
          </Button>

        </Toolbar>
      </AppBar>
    </Box>
  );
}
