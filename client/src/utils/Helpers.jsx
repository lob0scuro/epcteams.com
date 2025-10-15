import { TEAMS } from "./Schemas";

export const getTeamLabel = (val) => {
  const team = TEAMS.find((t) => t.val === val);
  return team ? team.label : val;
};

export function getSundaysInMonth(year, month) {
  const sundays = [];
  const date = new Date(year, month, 1); // first day of month

  // find the first Sunday
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1);
  }

  // add all Sundays
  while (date.getMonth() === month) {
    sundays.push(new Date(date)); // copy the date
    date.setDate(date.getDate() + 7); // next Sunday
  }

  return sundays;
}

export const formatDate = (d) => {
  const dateObj = new Date(d);
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${month}/${day}/${year}`; // MM/DD/YYYY
};
