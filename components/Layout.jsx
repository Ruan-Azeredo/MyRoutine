import React from 'react'
import styles from '../styles/Layout.module.css'
import { Cube } from './icons'

const Sidebar = (props) => {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <button className={styles.button}>
          {Cube} Gameficação
        </button>
      </div>
      <div className={styles.body}>
        {props.children}
      </div>
    </div>
  )
}

export default Sidebar