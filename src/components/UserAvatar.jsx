import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function UserAvatar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = Cookies.get("ui");
      const response = await fetch(`http://localhost:5000/user?id=${userId}`);
      const data = await response.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <Avatar alt={user?.name} src={user?.image} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>{user?.name}</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}