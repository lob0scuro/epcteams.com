import styles from "./Home.module.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { getTeamLabel, getSundaysInMonth } from "../../utils/Helpers";
import { handleDelete } from "../../utils/ApiCalls";
import VolunteerForm from "../../components/Forms/VolunteerForm";
import Calendar from "../../components/Calendar/Calendar";
import toast from "react-hot-toast";

const Home = () => {
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [vControls, setVControls] = useState([]);
  const [volunteers, setVolunteers] = useState(user.volunteers || []);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const sundays = getSundaysInMonth(now.getFullYear(), month).map((d) =>
    d.toLocaleDateString()
  );
  const currentMonth = now.toLocaleString("default", { month: "long" });

  useEffect(() => {
    setVolunteers(user.volunteers || []);
  }, []);

  useEffect(() => {
    setVControls(Array(volunteers.length).fill(false));
  }, [volunteers]);

  const deleteVolunteer = async (id) => {
    if (!confirm("Are you sure you want to delete this volunteer?")) return;
    const response = await handleDelete("delete_volunteer", id);
    if (!response.success) {
      toast.error(response.message);
    }
    setVolunteers((prev) => prev.filter((volunteer) => volunteer.id !== id));
    toast.success(response.message);
  };

  return (
    <div className={styles.homeDashboard}>
      {adding && (
        <VolunteerForm
          func={setAdding}
          onAdd={(newVolunteer) =>
            setVolunteers((prev) => [...prev, newVolunteer])
          }
        />
      )}
      <h1>Hello, {user.first_name}</h1>
      <p>Team: {getTeamLabel(user.team)}</p>
      <div className={styles.volunteerList}>
        <div className={styles.volunteerListHeader}>
          <p>Volunteers</p>
        </div>
        <ul>
          {volunteers.length !== 0 &&
            volunteers.map(({ first_name, last_name, id }, index) => (
              <li
                key={id}
                onClick={() => {
                  const updated = [...vControls];
                  updated[index] = !updated[index];
                  setVControls(updated);
                }}
              >
                <span>
                  {first_name} {last_name}
                </span>
                {vControls[index] && (
                  <span className={styles.vControlsButtons}>
                    <button>edit</button>
                    <button onClick={() => deleteVolunteer(id)}>delete</button>
                  </span>
                )}
              </li>
            ))}
          <li className={styles.addLiButton} onClick={() => setAdding(true)}>
            Add Volunteer
          </li>
        </ul>
      </div>
      <div className={styles.dashboardSchedule}>
        <Calendar volunteers={volunteers} />
      </div>
    </div>
  );
};

export default Home;
