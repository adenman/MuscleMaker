import { Card } from "flowbite-react";
import { useState, useEffect } from "react";
import { useWorkout } from './context';
import ReadMoreReact from 'read-more-react';


function WorkoutCards() {
  const [exercises, setExercises] = useState([]);
  const [muscle, setMuscle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const { setSelectedExercise } = useWorkout();

  useEffect(() => {
    fetchExercises();
  }, [muscle]);

  const fetchExercises = async () => {
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}${difficulty ? `&difficulty=${difficulty}` : ''}`,
        {
          headers: {
            'X-Api-Key': 'O0ZirOlVcXTxpgXYb45k7Q==Z5yJOywTfrqP9CVv'
          }
        }
      );
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleAddWorkout = (exercise) => {
    setSelectedExercise(exercise);
  };


  const muscleGroups = [
    'biceps', 'triceps', 'chest', 'lower_back', 
    'middle_back', 'traps', 'abdominals', 'abductors', 'adductors', 'calves', 'forearms', 'glutes',
    'hamstrings', 'lats', 'quadriceps'
  ];

  const difficulties = ['beginner', 'intermediate', 'expert'];

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-4 mb-8 mt-4">
        <input
          type="text"
          placeholder="Search exercises..."
          className="p-2 test2 border-2 rounded w-64 placeholder-white"
          
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-4">
          <select 
            className="p-2 test2 border-2 rounded"
            value={muscle} 
            onChange={(e) => setMuscle(e.target.value)}
          >
            <option value="">All Muscles</option>
            {muscleGroups.map(group => (
              <option key={group} value={group}>
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </option>
            ))}
          </select>

          <select 
            className="p-2 test2 border-2 rounded"
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">All Difficulties</option>
            {difficulties.map(level => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        
      </div>

      <div className="grid gap-6 md:w-3/4 lg:w-1/2 mx-auto t  ">
        {filteredExercises.map((exercise, index) => (
          <Card 
          key={index} 
          className="border-4 test2"
          style={{ 
            backgroundColor: '#445b5f',  // Light gray background

          }}
        >
            <div className="flex flex-col rounded-sm test2">
              <h5 className="text-2xl font-medium text-center mb-4">
                {exercise.name}
              </h5>
              <p className="text-center">Difficulty: {exercise.difficulty  }</p>
              <p className="text-center">Type: {exercise.type}</p>
              <p className="text-center">Equipment: {exercise.equipment}</p>
              <div className="flex flex-col md:flex-row items-center gap-6 mx-3">
                
                <div className="flex-grow">
                  <p className="text-base">
                  <ReadMoreReact className='t' text={exercise.instructions}
                          min={80}
                          ideal={100}
                          max={200}
                          readMoreText="More..." style={{
                            color: '#333',
                            fontSize: '16px',
                            lineHeight: '1.5',
                          }}/>
                  </p>
                </div>
              </div>
              <button className="text-2xl accent rounded-b text-black" 
              onClick={() => handleAddWorkout(exercise)}>+</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default WorkoutCards;