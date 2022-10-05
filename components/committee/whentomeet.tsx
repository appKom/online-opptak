import React from 'react'
import W2MRow from './w2mrow';
import arrayOfLength from './arrayoflength';
import W2MRowHeader from './w2mrowheader';
import { useState } from 'react';
import styles from "../../styles/committee.module.css";

interface Props {
  removeCell: Function;
  addCell: Function;
}

function Whentomeet(props: Props) {
  const [mouseDown, setMouseDown] = useState(0);

  function minutesToTimeString(m: number): string {
    // ex: 120 -> 2:00, 620 -> 10:20
    let hour: number = Math.floor(m/60);
    let minute: number = m%60;
    return (minute == 0) ? `${hour}:00` : `${hour}:${minute.toString()}`;
  }


  return (
    <div className={styles.w2m_maincontainer} onMouseDown={()=>setMouseDown(1)} onMouseUp={()=>setMouseDown(0)}>
      
        <W2MRowHeader/>
        {
          arrayOfLength(8*3-1).map(i => {
            let time: number = 20+8*60+i*20 // 8:20;
            return <W2MRow removeCell={(cell: string[])=>(props.removeCell(cell))} addCell={(cell: string[])=>(props.addCell(cell))} mouseDown={mouseDown} time={`${minutesToTimeString(time)} - ${minutesToTimeString(time+20)}`} key={i.toString()}/>
          })
        }
       
    </div>
  )
}

export default Whentomeet
