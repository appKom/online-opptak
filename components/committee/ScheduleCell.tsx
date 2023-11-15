import { useState } from "react";
import styles from "./../../styles/schedule.module.css";

export default function ScheduleCell() {
  const [available, setAvailable] = useState(false);

  function handleSetAvailable() {
    setAvailable(!available);
  }

  return (
    <div
      className={available ? styles.availablecell : styles.unavailablecell}
      onMouseDown={handleSetAvailable}
    ></div>
  );
}
