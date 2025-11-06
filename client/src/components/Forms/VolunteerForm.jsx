import styles from "./VolunteerForm.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { handleDelete } from "../../utils/ApiCalls";

const VolunteerForm = ({ func, onAdd, vol }) => {
  const [firstName, setFirstName] = useState(vol ? vol.first_name : "");
  const [lastName, setLastName] = useState(vol ? vol.last_name : "");

  const closeModal = () => {
    func(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inputs = {
      first_name: firstName,
      last_name: lastName,
    };
    const options = {
      method: vol ? "PATCH" : "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };

    options.body = JSON.stringify(inputs);

    const endpoint = vol
      ? `/api/edit/edit_volunteer/${vol.id}`
      : "/api/create/add_volunteer";

    try {
      const response = await fetch(endpoint, options);

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
      if (onAdd && !vol) {
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

  const deleteVolunteer = async (id) => {
    if (!confirm("Are you sure you want to delete this volunteer?")) return;
    const response = await handleDelete("delete_volunteer", id);
    if (!response.success) {
      toast.error(response.message);
    }
    // setVolunteers((prev) => prev.filter((volunteer) => volunteer.id !== id));
    func(false);
    vol = null;
    toast.success(response.message);
  };

  return (
    <form className={styles.volunteerForm}>
      <button className={styles.closeButton} onClick={closeModal}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
      <h2>{vol ? "Edit Volunteer" : "Add Volunteer"}</h2>
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
      {vol && (
        <p
          onClick={() => deleteVolunteer(vol.id)}
          className={styles.deleteVolunteerButton}
        >
          Delete Volunteer
        </p>
      )}
    </form>
  );
};

export default VolunteerForm;
