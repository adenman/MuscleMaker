import { createContext, useState, useContext } from 'react';

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <WorkoutContext.Provider value={{ selectedExercise, setSelectedExercise }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  return useContext(WorkoutContext);
}