import React from 'react'
import { activities }  from '../data/data'

const AmountPts = (props) => {

    const pointsWin = activities.reduce((total, activity) => total + activity.pts, 0);

    const d1  = '2023-1-1';
    const todayDate = new Date;
    const todayForm = (todayDate.getFullYear() + "-" + ((todayDate.getMonth() + 1)) + "-" + (todayDate.getDate() )) ;

    const diffInMs   = new Date(todayForm) - new Date(d1)
    const diffInDays = parseInt(diffInMs / (1000 * 60 * 60 * 24));

    const result = pointsWin - diffInDays * 3

    return (
        <div className='card justify-between gap-5 h-fit mt-6'>
            <div>
                <div>Pontuação</div>
                <div>Total:</div>
            </div>
            <div className='font-semibold text-3xl mt-1'>
            {result}
            </div>
        </div>
    )
}

export default AmountPts