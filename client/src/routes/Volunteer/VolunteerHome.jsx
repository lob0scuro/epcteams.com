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

  return (
    <div className={styles.volunteerHomeContainer}>
      <h1>
        Schedules for {monthName} {currentYear}
      </h1>
      <select
        name="team_name"
        id="team_name"
        onChange={(e) => setTeam(teams.find((t) => t.name === e.target.value))}
      >
        <option value="">--Select a team--</option>
        {TEAMS.map(({ val, label }, index) => (
          <option value={val} key={index}>
            {label}
          </option>
        ))}
      </select>
      <Schedule team={team} />
    </div>
  );
};

export default VolunteerHome;
