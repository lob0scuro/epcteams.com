import styles from "./Schedule.module.css";
import React, { useEffect, useState } from "react";
import { getSundaysInMonth, formatDate } from "../../utils/Helpers";

const Schedule = ({ team }) => {
  const [schedule, setSchedule] = useState([]);
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11
  const currentYear = today.getFullYear();

  const sundays = getSundaysInMonth(currentYear, currentMonth).map((d) =>
    d.toLocaleDateString()
  );

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!team || !team.id) {
        setSchedule([]);
        return;
      }
      const response = await fetch(`/api/read/get_schedule/${team.id}`);
      const data = await response.json();
      if (data.success) {
        setSchedule(data.schedule);
      } else {
        setSchedule([]);
      }
    };
    fetchSchedule();
  }, [team]);

  if (team === undefined) {
    return (
      <p style={{ marginTop: "2rem", fontStyle: "italic" }}>
        Team Lead has not scheduled for this month yet.
      </p>
    );
  } else if (schedule?.length === 0) {
    return (
      <p style={{ marginTop: "2rem", fontStyle: "italic" }}>
        Please select a team to view the schedule.
      </p>
    );
  }
  return (
    <div className={styles.volunteerViewContainer}>
      {sundays.map((date, index) => (
        <div className={styles.dateCard} key={index}>
          <h3>{date}</h3>
          <ul>
            {schedule?.filter(
              (s) => formatDate(s.scheduled_date) === formatDate(date)
            ).length === 0 ? (
              <li>No volunteers assigned</li>
            ) : (
              schedule
                ?.filter(
                  (s) => formatDate(s.scheduled_date) === formatDate(date)
                )
                .map((s, idx) => <li key={idx}>{s.volunteer_name}</li>)
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Schedule;
