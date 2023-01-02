import React from 'react'
import styles from '../styles/CardActivitie.module.css'

const CardActivitie = (props) => {

    const activitie = props.activitie

  return (
        <div className={`card ${styles.card}`}>
          <div>
            <div className={styles.type}>{activitie.type}</div>
            <div className={styles.pts}>{activitie.pts} pts</div>
            <div>{activitie.desc}</div>
          </div>
          <div>
              <span>{activitie.day}/</span>
              <span>{activitie.month}/</span>
              <span>{activitie.year}</span>
          </div>
        </div>
  )
}

export default CardActivitie