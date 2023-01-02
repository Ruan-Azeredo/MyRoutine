
const project = { name: 'Project', pts: 10 }
const postLinkedin = { name: 'Post linkedin', pts: 8 }
const testLinkedin = { name: 'Teste linkedin', pts: 1 }

export const activities = [
  { year: 2023, month: 1, day: 1, type: postLinkedin.name, pts: postLinkedin.pts, desc: 'Postei no linkedin MyBooks' },
  { year: 2023, month: 1, day: 1, type: testLinkedin.name, pts: testLinkedin.pts, desc: 'Teste de JavaScript' },
  { year: 2023, month: 1, day: 2, type: testLinkedin.name, pts: testLinkedin.pts, desc: 'Teste de Front End' },
  { year: 2023, month: 1, day: 2, type: testLinkedin.name, pts: testLinkedin.pts, desc: 'Teste de HTML' },
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
const startDate = new Date('2023-1-1');

export const activitiesByDayArray = [];
for (let date = startDate; date <= today; date.setDate(date.getDate() + 1)) {
  const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const activities = activitiesByDay[day] || [];
  activitiesByDayArray.push({ day, activities });
}