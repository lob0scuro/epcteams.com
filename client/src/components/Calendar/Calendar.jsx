import styles from "./Calendar.module.css";
import React, { useState, useEffect } from "react";
import { getSundaysInMonth, formatDate } from "../../utils/Helpers";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const Calendar = ({ volunteers = [] }) => {
  const { user } = useAuth();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [assigning, setAssigning] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [monthName, setMonthName] = useState(
    today.toLocaleString("default", { month: "long" })
  );

  const sundays = getSundaysInMonth(year, month).map((t) =>
    t.toLocaleDateString()
  );

  // Reset assigning when month changes
  useEffect(() => {
    setAssigning(Array(sundays.length).fill(false));
  }, [sundays]);

  // Fetch scheduled volunteers for this team & month
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          `/api/read/get_schedule/${user.team_id}?month=${
            month + 1
          }&year=${year}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setScheduled(data.schedule);
      } catch (err) {
        toast.error("Failed to fetch schedule");
        console.error(err);
      }
    };
    fetchSchedule();
  }, [user.team_id, month, year]);

  // Assign volunteer
  const handleSubmit = async (volunteer_id, assigned_date) => {
    // Prevent duplicates
    const alreadyScheduled = scheduled.some(
      (s) =>
        s.volunteer.id === volunteer_id &&
        formatDate(s.scheduled_date) === formatDate(assigned_date)
    );
    if (alreadyScheduled) {
      toast.error("This volunteer is already assigned to this date!");
      return;
    }

    const v = volunteers.find((v) => v.id === volunteer_id);
    if (!confirm(`Add ${v.first_name} to ${assigned_date}?`)) return;

    const response = await fetch(
      `/api/create/schedule_volunteer/${volunteer_id}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sunday: assigned_date }),
      }
    );
    const data = await response.json();

    if (!data.success) {
      setAssigning(Array(sundays.length).fill(false));
      toast.error(data.message);
      return;
    }

    setAssigning(Array(sundays.length).fill(false));
    setScheduled((prev) => [...prev, data.schedule]);
    toast.success(`${v.first_name} added to ${assigned_date}`);
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setMonth(newMonth);
    setYear(newYear);
    setMonthName(
      new Date(newYear, newMonth).toLocaleString("default", { month: "long" })
    );
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
    setMonthName(
      new Date(newYear, newMonth).toLocaleString("default", { month: "long" })
    );
  };

  return (
    <div className={styles.calendarContainer}>
      <h2>
        <span>
          <button onClick={handlePrevMonth}>prev</button>
        </span>
        <span>
          {monthName} {year}
        </span>
        <span>
          <button onClick={handleNextMonth}>next</button>
        </span>
      </h2>

      <div className={styles.weeklyColumn}>
        {sundays.map((date, index) => (
          <div className={styles.volunteersForThisWeek} key={index}>
            <button
              className={styles.assignVolunteer}
              onClick={() => {
                const updated = [...assigning];
                updated[index] = !updated[index];
                setAssigning(updated);
              }}
            >
              {assigning[index] ? "Cancel" : "Assign"}
            </button>

            {assigning[index] && (
              <select
                name="volunteer_id"
                onChange={(e) => handleSubmit(Number(e.target.value), date)}
                className={styles.vSelect}
              >
                <option value="">--select volunteer--</option>
                {volunteers.map(({ id, first_name, last_name }) => (
                  <option value={id} key={id}>
                    {first_name} {last_name}
                  </option>
                ))}
              </select>
            )}

            <h3>{date}</h3>

            <ul className={styles.listBody}>
              {scheduled
                ?.filter(
                  (s) => formatDate(s.scheduled_date) === formatDate(date)
                )
                .map((s) => (
                  <li key={s.id}>{s.volunteer_name}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
