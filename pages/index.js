import AmountPts from "../components/AmountPts";
import CardActivitie from "../components/CardActivitie";
import Layout from "../components/Layout";
import { activities }  from '../data/data'

export default function Home() {
  return (
    <div>
      <Layout>
        <div>
          {activities.map((activitie) => (
            <CardActivitie key={activitie} activitie={activitie} />
          ))}
        </div>
        <AmountPts activities={activities}/>
      </Layout>
    </div>
  )
}
