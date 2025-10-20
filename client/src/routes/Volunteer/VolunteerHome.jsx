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
  const [team, setTeam] = useState({});

  return (
    <>
      <h1>
        Schedules for {monthName} {currentYear}
      </h1>

      <Schedule team={team} />
    </>
  );
};

export default VolunteerHome;
