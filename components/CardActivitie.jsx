import React from 'react'

const CardActivitie = (props) => {

    const activitie = props.activitie

  return (
        <div  className='text-black p-5'>
          <div>{activitie.type}</div>
          <div>Pontuação: {activitie.pts}</div>
          <div>{activitie.desc}</div>
          <div>
              <span>{activitie.day} / </span>
              <span>{activitie.month} / </span>
              <span>{activitie.year}</span>
          </div>
        </div>
  )
}

export default CardActivitie