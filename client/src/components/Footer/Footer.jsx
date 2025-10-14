import { useAuth } from "../../Context/AuthContext";
import styles from "./Footer.module.css";
import React from "react";

const Footer = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <footer>
      {user && (
        <p className="logoutLink" onClick={handleLogout}>
          Logout
        </p>
      )}
      <p>Eastwood Pentecostal Church, Lake Charles, LA</p>
    </footer>
  );
};

export default Footer;
