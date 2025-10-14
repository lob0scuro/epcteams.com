import styles from "./Header.module.css";
import React from "react";
import LOGO from "../../assets/eastwood-logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <Link>
        <img
          src={LOGO}
          alt="Eastwood Pentecostal Church Logo"
          className="header-logo"
        />
      </Link>
    </header>
  );
};

export default Header;
