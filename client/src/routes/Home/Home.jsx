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
  const [volunteers, setVolunteers] = useState(user.volunteers || []);
  const [vol, setVol] = useState(null);
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
    adding === false && setVol(null);
  }, [adding]);

  return (
    <div className={styles.homeDashboard}>
      {adding && (
        <VolunteerForm
          func={setAdding}
          onAdd={(newVolunteer) =>
            setVolunteers((prev) => [...prev, newVolunteer])
          }
          vol={vol}
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
                  setVol({ id, first_name, last_name });
                  setAdding(true);
                }}
              >
                <span>
                  {first_name} {last_name}
                </span>
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
