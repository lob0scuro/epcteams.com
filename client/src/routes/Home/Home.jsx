import styles from "./Home.module.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { getTeamLabel, getSundaysInMonth } from "../../utils/Helpers";
import VolunteerForm from "../../components/Forms/VolunteerForm";

const Home = () => {
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
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
          <p>Volunteers:</p>
          <div>
            <button className="secondary" onClick={() => setAdding(true)}>
              Add Volunteer
            </button>
          </div>
        </div>
        <ul>
          {volunteers.length !== 0 ? (
            volunteers.map(({ first_name, last_name, id }) => (
              <li key={id}>
                {first_name} {last_name}
              </li>
            ))
          ) : (
            <p style={{ alignSelf: "center", justifySelf: "center" }}>
              Add Volunteers
            </p>
          )}
        </ul>
        <p className={styles.editVolunteersButton}>Edit Volunteers</p>
      </div>
      <div className={styles.dashboardSchedule}>
        <h2>{currentMonth}</h2>
      </div>
    </div>
  );
};

export default Home;
