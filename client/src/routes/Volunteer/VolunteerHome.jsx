import styles from "./VolunteerHome.module.css";
import React, { useEffect, useState } from "react";
import Schedule from "../../components/Schedule/Schedule";
import {
  formatDate,
  getSundaysInMonth,
  getTeamLabel,
} from "../../utils/Helpers";
import { TEAMS } from "../../utils/Schemas";
import toast from "react-hot-toast";

const VolunteerHome = () => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11
  const currentYear = today.getFullYear();
  const monthName = today.toLocaleString("default", { month: "long" });
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState({});
  const [schedule, setSchedule] = useState([]);

  const sundays = getSundaysInMonth(currentYear, currentMonth).map((d) =>
    d.toLocaleDateString()
  );

  useEffect(() => {
    const getTeams = async () => {
      try {
        const response = await fetch("/api/read/get_teams");
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch teams");
        }
        setTeams(data.teams);
      } catch (error) {
        toast.error(`Error fetching teams: ${error.message}`);
        console.error(error);
      }
    };
    getTeams();
  }, []);

  const getSchedule = async (team_name) => {
    if (team_name === "") return;
    const team_id = teams.find((t) => t.name === team_name);
    if (!team_id) {
      toast.error("Team Schedule unavailable");
      setSchedule([]);
      return;
    }
    try {
      const response = await fetch(`/api/read/get_schedule/${team_id.id}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      if (!data.schedule) {
        toast.error("Team Schedule unavailable");
        setSchedule([]);
        return;
      }
      setSchedule(data.schedule);
    } catch (error) {
      console.error("[ERROR]: ", error);
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.volunteerHomeContainer}>
      <h1>
        Schedules for {monthName} {currentYear}
      </h1>
      <select
        name="team_name"
        id="team_name"
        onChange={(e) => getSchedule(e.target.value)}
      >
        <option value="">--Select a team--</option>
        {TEAMS.map(({ val, label }, index) => (
          <option value={val} key={index}>
            {label}
          </option>
        ))}
      </select>
      <div className={styles.volunteerHomeScheduleBlock}>
        {schedule?.length === 0 ? (
          <p style={{ marginTop: "1rem" }}>Select a Team to get schedule</p>
        ) : (
          sundays.map((date, index) => (
            <div
              key={index}
              className={styles.volunteerHomeScheduleSundayBlock}
            >
              <h3>{date}</h3>
              <div>
                {schedule
                  ?.filter(
                    (s) => formatDate(s.scheduled_date) === formatDate(date)
                  )
                  .map(({ id, volunteer_name }) => (
                    <p key={id}>- {volunteer_name}</p>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VolunteerHome;
