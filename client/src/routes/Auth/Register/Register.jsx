import toast from "react-hot-toast";
import Button from "../../../components/Button/Button";
import styles from "./Register.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEAMS } from "../../../utils/Schemas";

const Register = () => {
  const [formData, setFormData] = useState({
    team_name: "",
    first_name: "",
    last_name: "",
    email: "",
    team: "",
    pw1: "",
    pw2: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }
  };
  return (
    <>
      <h1>Register</h1>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <div className={styles.teamSelect}>
          <label htmlFor="team_name">Team</label>
          <select
            name="team_name"
            id="team_name"
            value={formData.team_name}
            onChange={handleChange}
          >
            <option value="">--Select Team--</option>
            {TEAMS.map(({ val, label }) => (
              <option value={val} key={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="first_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="first_name">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="first_name">Password</label>
          <input
            type="password"
            name="pw1"
            id="pw1"
            value={formData.pw1}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="first_name">Re-Enter Password</label>
          <input
            type="password"
            name="pw2"
            id="pw2"
            value={formData.pw2}
            onChange={handleChange}
          />
        </div>
        <Button label={"Submit"} type="submit" />
      </form>
    </>
  );
};

export default Register;
