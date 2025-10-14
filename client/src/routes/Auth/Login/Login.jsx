import styles from "./Login.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import { useAuth } from "../../../Context/AuthContext";

const Login = () => {
  const { setUser, setLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/read/get_users", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        setUsers([]);
      }
      setUsers(data.users);
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/auth/login/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setLoading(false);
      setUser(data.user);
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div>
          <select
            name="id"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          >
            <option value="">--Select User--</option>
            {users?.map(({ first_name, last_name, id }) => (
              <option key={id} value={id}>
                {first_name} {last_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </div>
        <Button label={"Submit"} type="submit" />
      </form>
    </>
  );
};

export default Login;
