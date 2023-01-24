import React, { BaseSyntheticEvent, useState, useEffect } from "react";
import styles from "../../styles/committee.module.css";

interface Props {
  mouseDown: number;
  removeCell: Function;
  addCell: Function;
  date: string;
  fromTime: string;
  toTime: string;
}

function W2MCell(props: Props) {
  const markedColor = "rgba(0, 84, 118, 0.5)";
  const unmarkedColor = "rgba(255, 255, 255, 1)";
  const cellInterview = {
    date: props.date,
    fromTime: props.fromTime,
    toTime: props.toTime,
    applicantID: null,
    committeeID: null,
  };

  function handleMouseOver(e: BaseSyntheticEvent, ignore?: boolean) {
    if (props.mouseDown || ignore) {
      let div: HTMLDivElement = e.target;
      if (div.style.backgroundColor == markedColor) {
        div.innerText = "";
        div.style.backgroundColor = unmarkedColor;
        props.removeCell(cellInterview);
      } else {
        div.innerText = "x";
        div.style.backgroundColor = markedColor;
        props.addCell(cellInterview);
      }
    }
  }

  return (
    <div
      onMouseEnter={(e) => handleMouseOver(e)}
      onMouseDown={(e) => handleMouseOver(e, true)}
      className={`cell ${styles.cell}`}
      id={`${props.date} ${props.fromTime} ${props.toTime}`}
    ></div>
  );
}

export default W2MCell;
