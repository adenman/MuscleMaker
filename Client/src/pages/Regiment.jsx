import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { REGIMENT } from '../utils/queries';
import { COMPLETED_REGIMENT, ADD_COMPLETED_REGIMENT_TO_USER } from '../utils/mutations';
import ReadMoreReact from 'read-more-react';
import Stopwatch from '../components/Stopwatch';
import DragDrop from '../components/DragDrop';
import { useState } from 'react';
import Auth from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Regiment() {
  const { regimentId } = useParams();
  const navigate = useNavigate();
  const [stopwatchTime, setstopwatchTime] = useState();
  const [finishedWorkouts, setFinishedWorkouts] = useState({});
  const [fileInfo, setFileInfo] = useState(null);
  const [addCompletedRegiment] = useMutation(COMPLETED_REGIMENT);
  const [addCompletedRegimentToUser] = useMutation(ADD_COMPLETED_REGIMENT_TO_USER);
  const { loading, error, data } = useQuery(REGIMENT, {
    variables: { regiment: regimentId },
  });

  if (loading) return <p className='t'>Loading...</p>;
  if (error) return <p className='t'>Error loading regiment</p>;

  const handleFileChange = (info) => {
    setFileInfo(info);
  };

  const handleSaveRegiment = async () => {

    if (!Auth.loggedIn()) {
      console.error('User not logged in');
      return;
    }
    
    const profile = Auth.getProfile();
    const userId = profile.data._id;
    try {
      // Compress image if it's too large
      const compressImage = async (base64Str, maxWidth = 800, maxHeight = 800) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = base64Str;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
  
            // Calculate new dimensions
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
  
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
  
            resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality
          };
        });
      };
  
      // Compress the image if it exists
      const compressedImage = fileInfo 
        ? await compressImage(fileInfo.base64) 
        : null;
  
      const regimentResponse = await addCompletedRegiment({
        variables: {
          name: data?.Regiment?.name || 'Unnamed Regiment',
          date: new Date().toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          time: stopwatchTime || '0:00:00:00',
          progressPic: compressedImage || null,
        }
      });

      const addToUser = await addCompletedRegimentToUser({
        variables: {
          userId: userId,
          completedRegimentId: regimentResponse.data.addCompletedRegiment._id, // Use the ID from the first mutation
        }
      });
  
    } catch (err) {
      console.error("Full Error Object:", err);
    }
  };

  const handleFinish = (index) => {
    setFinishedWorkouts((prev) => ({
      ...prev,
      [index]: true,
    }));
    
    // Close the modal programmatically
    const modal = document.getElementById(`workout-modal-${index}`);
    if (modal) {
      modal.classList.add('hidden');
    }
  };


  return (
    <>
      <div>
      <div className='flex flex-wrap justify-center text-4xl t'>
          {data?.Regiment?.name}
        </div>
        <div className="flex flex-wrap justify-center">
        <Stopwatch 
  onTimeUpdate={(timeString) => {
    console.log("Stopwatch Time String:", timeString);
    setstopwatchTime(timeString);
  }} 
/>
        </div>
        {data?.Regiment?.workouts?.length ? (
          <>
            {data.Regiment.workouts.map((workout, index) => (
              <div key={index}>
                <p>.{index + 1}</p>
                <div
                  className={`text-xl justify-center font-bold w-full text-center ${
                    finishedWorkouts[index] ? 'finished-card' : 'unfinished-card'} workout-card test2 rounded p-4 my-2 mx-2 t back w-full`}
                  onClick={() => document.getElementById(`workout-modal-${index}`).classList.remove('hidden')}
                >
                                <h2>
                  {workout.type} - {workout.muscle}
                </h2>
                </div>
                

                <div id={`workout-modal-${index}`} tabIndex="-1" aria-hidden="false" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                  <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative g rounded-lg shadow dark:bg-gray-700">
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold t ">
                          {workout.type} - {workout.muscle}
                        </h3>
                        <button type="button" className="t bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={() => document.getElementById(`workout-modal-${index}`).classList.add('hidden')}>
                          <svg className="w-3 h-3" aria-hidden="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>
                      <div className="p-4 md:p-5 space-y-4">
                        <p className="text-base leading-relaxed t dark:text-gray-400">
                          Difficulty: {workout.difficulty}
                        </p>
                          <p className="text-base leading-relaxed t dark:text-gray-400">
                          Equipment: {workout.equipment}
                        </p>
                        <ReadMoreReact className='t' text={workout.instructions}
                          min={80}
                          ideal={100}
                          max={200}
                          readMoreText="More..." style={{
                            color: '#333',
                            fontSize: '16px',
                            lineHeight: '1.5',
                          }}/>

                        <button
                        onClick={() => {handleFinish(index);}}
                        type="button"
                        className="text-black accent  font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                        >
                          Finish
                        </button>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            ))}
           

            <div className="flex justify-center">
              <DragDrop className="mx-2"  onFileChange={handleFileChange} showPreview={true}/>
            </div>
{fileInfo && (
              <div className="file-info-display flex justify-center" style={{ marginTop: "10px" }}>
                <p><strong>File Name:</strong> {fileInfo.name}</p>
              </div>
            )}
             <div className="flex justify-center items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                onClick={() => {handleSaveRegiment(); navigate('/');}}
                type="button"
                className="text-black accent  font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                  Finish
                </button>
              </div>

            

          </>
        ) : (
          <div className="text-center">
            <p>No workouts found in this regiment</p>
          </div>
        )}
      </div>
    </>
  );
};