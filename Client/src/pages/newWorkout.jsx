import WorkoutCards from "../components/WorkoutCards";
import NewRegiment from "../components/newRegiment";

const NewWorkout = () => {


  return (
    <div>
      <h1 className='t text-center rounded mb-4'>Create New Regiment!</h1>
      <NewRegiment />

      <h1 className="text-center t mt-10">Workouts</h1>
      
      <WorkoutCards />
    </div>
  );
};

export default NewWorkout;