import { useAuth } from "../../Context/AuthContext";
import styles from "./Footer.module.css";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <footer>
      {user ? (
        <>
          <Link
            to="/volunteer"
            style={{ color: "var(--blue)", textDecoration: "underline" }}
          >
            Schedule View
          </Link>
          <p className="logoutLink" onClick={handleLogout}>
            Logout
          </p>
        </>
      ) : (
        <p>
          Team Lead{" "}
          <Link
            to="/login"
            style={{
              color: "var(--blue)",
              textDecoration: "underline",
              fontWeight: "600",
            }}
          >
            Login
          </Link>
        </p>
      )}
      <p>Eastwood Pentecostal Church, Lake Charles, LA</p>
    </footer>
  );
};

export default Footer;
