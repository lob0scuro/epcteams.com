import styles from "./Button.module.css";
import React, { useState } from "react";

const Button = ({
  label,
  onClick,
  type = "button",
  loadingText = "Processing",
  className,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    if (onClick) {
      try {
        setLoading(true);
        await onClick(e);
      } catch (error) {
        console.error("Error in button action: ", error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={loading}
      className={className}
      {...props}
    >
      {loading ? loadingText : label}
    </button>
  );
};

export default Button;
