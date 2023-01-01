import React from 'react'
import { activities }  from '../data/data'

const AmountPts = (props) => {

    const pointsWin = activities.reduce((total, activity) => total + activity.pts, 0);

    const d1  = '2022-12-25';
    const todayDate = new Date;
    const todayForm = (todayDate.getFullYear() + "-" + ((todayDate.getMonth() + 1)) + "-" + (todayDate.getDate() )) ;

    const diffInMs   = new Date(todayForm) - new Date(d1)
    const diffInDays = parseInt(diffInMs / (1000 * 60 * 60 * 24));

    const result = pointsWin - diffInDays * 3

    return (
        <div className='text-black p-5'>Pontuação total: {result}</div>
    )
}

export default AmountPts