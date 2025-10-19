import styles from "./VolunteerForm.module.css";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const VolunteerForm = ({ func, onAdd }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const closeModal = () => {
    func(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inputs = {
      first_name: firstName,
      last_name: lastName,
    };
    try {
      const response = await fetch("/api/create/add_volunteer", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      if (!response.ok) {
        throw new Error(
          "There was an error when submitting request to server."
        );
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      if (onAdd) {
        onAdd({
          id: data.volunteer.id,
          first_name: data.volunteer.first_name,
          last_name: data.volunteer.last_name,
        });
      }
      func(false);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }
  };

  return (
    <form className={styles.volunteerForm}>
      <button className={styles.closeButton} onClick={closeModal}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
      <h2>Add Volunteer</h2>
      <div>
        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          name="first_name"
          id="first_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          name="last_name"
          id="last_name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit} type="submit">
        Submit
      </button>
    </form>
  );
};

export default VolunteerForm;
