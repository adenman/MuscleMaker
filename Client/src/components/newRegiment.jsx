import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useWorkout } from './context';
import {ADD_REGIMENT_TO_USER, ADD_REGIMENT} from '../utils/mutations'
import Auth from '../utils/auth'
import { useNavigate } from 'react-router-dom';

const NewRegiment = () => {
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [workoutName, setWorkoutName] = useState('New Workout');
    const { selectedExercise } = useWorkout();
    const [selectedWorkouts, setSelectedWorkouts] = useState(() => {
      const savedWorkouts = localStorage.getItem('currentSetup');
      return savedWorkouts ? JSON.parse(savedWorkouts) : [];
    });
    const [addRegimentToUser] = useMutation(ADD_REGIMENT_TO_USER);
    const [addRegiment] = useMutation(ADD_REGIMENT);

    


    useEffect(() => {
      localStorage.setItem('currentSetup', JSON.stringify(selectedWorkouts));
    }, [selectedWorkouts]);

    useEffect(() => {
      if (selectedExercise) {
        setSelectedWorkouts(prev => [...prev, selectedExercise]);
      }
    }, [selectedExercise]);

    const handleDeleteWorkout = (indexToDelete) => {
      setSelectedWorkouts(prevWorkouts => 
        prevWorkouts.filter((_, index) => index !== indexToDelete)
      );
    };


    const handleSaveWorkout = async () => {
      if (!Auth.loggedIn()) {
        return;
      }
    
      const profile = Auth.getProfile();
      const userId = profile.data._id;
      console.log("User ID:", userId);
    
      if (!selectedWorkouts || selectedWorkouts.length === 0) {
        return (
          <h2 className="text-center text-xl font-bold text-white mt-4">
            No Workouts Selected
          </h2>
        );
      }
    
      const regimentData = {
        name: workoutName,
        workouts: selectedWorkouts
      };
    
      try {
        const regimentResponse = await addRegiment({
          variables: {
            name: workoutName,
            workouts: selectedWorkouts.map(workout => ({
              name: workout.name,
              instructions: workout.instructions,
              type: workout.type,
              muscle: workout.muscle,
              difficulty: workout.difficulty,
              equipment: workout.equipment
            }))
          }
        });
    
        console.log("Regiment Response:", regimentResponse);
    
        if (regimentResponse.data) {
          console.log("Regiment created successfully:", regimentResponse.data.addRegiment._id);
          const addRegimentToUserResponse = await addRegimentToUser({
            variables: {
              userId: userId,
              regimentId: regimentResponse.data.addRegiment._id
            }
          });
          console.log("Add Regiment to User Response:", addRegimentToUserResponse);
          setSelectedWorkouts([]);
        } else {
          console.error("Failed to create regiment:", regimentResponse);
        }
    
      } catch (err) {
        console.error("Error details:", err.message);
      }
    };

    
  
  
    const handleEditClick = () => {
      setIsEditing(true);
    };
  
    const handleNameChange = (e) => {
      setWorkoutName(e.target.value);
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        setIsEditing(false);
      }
    };
  
    return (
      <div>
        
        <ul className="list-group border test2 p-2">
          {isEditing ? (
            <input
              type="text"
              value={workoutName}
              onChange={handleNameChange}
              onKeyPress={handleKeyPress}
              className="text-center form-control bg-black text-white "
              autoFocus
            />
          ) : (
            <h1 className='text-white text-center rounded'>{workoutName}</h1>
          )}
          
          <button className='bg-black text-white py-2 mx-16 rounded' onClick={handleEditClick}>Edit Name</button>
          {(!selectedWorkouts || selectedWorkouts.length === 0) && (
      <h2 className="text-center text-xl font-bold text-white my-4">
        Add a workout to your regiment
      </h2>
    )}
          
          {selectedWorkouts ? selectedWorkouts.map((workout, index) => (
            <div key={index} className="workout-card border-2 bg-black blue-back rounded-xl t p-4 my-2 mx-2">
              <div className="flex justify-between items-center w-full">
                <div>
                  <h2 className="text-xl font-bold">{workout.name}</h2>
                </div>
                <button 
                  className="text-red-500 font-bold hover:text-red-700 ml-4 text-2xl" 
                  onClick={() => handleDeleteWorkout(index)}
                >
                  X
                </button>
              </div>
            </div>
          )) : (
            <h2 className="text-xl font-bold">Select a workout to add to your regiment</h2>
          )}  
            <div className="flex justify-center w-full mt-4">
            

  {selectedWorkouts.length === 0 ? (
      <h2 className="text-center text-xl font-bold text-white my-4">
        
      </h2>
    ) : (<button 
    className='accent text-white font-bold py-2 px-4 rounded mb-4' 
    onClick={() => {
      handleSaveWorkout();
      window.location.href = '/';
    }}
  >
    Save Workout
  </button>)}</div>      
        </ul>
        
      </div>
      
    );
  };
  

  export default NewRegiment;