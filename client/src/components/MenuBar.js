import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const MenuBar = () => {
  const { user, logout } = useContext(AuthContext);
  //this gets the current url path, checks if it / or /login or any other thing
  //if it is not /, then it uses the substr function, to remove string from the second character
  const pathname = window.location.pathname;

  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menu = user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item name={user.username} active as={Link} to="/" />

      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
      </Menu.Menu>
    </Menu>
  );
  return <div>{menu}</div>;
};

export default MenuBar;
