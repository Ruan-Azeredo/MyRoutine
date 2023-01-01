
const project = { name: 'project', pts: 10 }
const postLinkedin = {name: 'post linkedin', pts: 8}

export const activities = [
    { year: 2023, month: 1, day: 1, type: project.name, pts: project.pts , desc: ''},
    { year: 2023, month: 1, day: 1, type: postLinkedin.name, pts: postLinkedin.pts, desc: 'oiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii' },
    { year: 2023, month: 1, day: 2, type: project.name, pts: project.pts , desc: ''},
    { year: 2023, month: 1, day: 2, type:postLinkedin.name, pts:postLinkedin.pts, desc: 'oiiiiiiiiiiiiiiitrtrtree' }
]

export const activitiesByDay = activities.reduce((days, activity) => {
    const day = `${activity.year}-${activity.month}-${activity.day}`;
    if (!days[day]) {
      days[day] = [];
    }
    days[day].push(activity);
    return days;
}, {});



const today = new Date();
const startDate = new Date('2022-12-25');

export const activitiesByDayArray = [];
for (let date = startDate; date <= today; date.setDate(date.getDate() + 1)) {
  const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const activities = activitiesByDay[day] || [];
  activitiesByDayArray.push({ day, activities });
}