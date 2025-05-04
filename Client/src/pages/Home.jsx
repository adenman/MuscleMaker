// // src/pages/Home.jsx

// import React from 'react'; // Import React
// import { useNavigate } from 'react-router-dom';
// import { useQuery } from '@apollo/client';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure this is needed and installed
// import Auth from "./../utils/auth";
// import { GET_REGIMENTS, GET_USER_BY_ID } from '../utils/queries'; // Combined imports

// export default function Home() {
//   // --- Determine variables BEFORE hooks --
//   const isLoggedIn = Auth.loggedIn();
//   const profile = isLoggedIn ? Auth.getProfile() : null;
//   const userId = profile?.data?._id; // Get userId safely
//   // --- End Variable Determination ---

//   // --- Top Level Hook Calls ---
//   // Query 1: Get User Data (for last workout/streak)
//   const { loading: lastWorkoutLoading, error: lastWorkoutError, data: lastWorkout } = useQuery(GET_USER_BY_ID, {
//     variables: { userId: userId }, // Use pre-calculated userId
//     skip: !isLoggedIn, // Skip if not logged in
//   });

//   // Query 2: Get User Regiments
//   const { loading: regimentsLoading, error: regimentsError, data: regimentsData } = useQuery(GET_REGIMENTS, {
//     variables: { userId: userId }, // Use pre-calculated userId
//     skip: !isLoggedIn, // Skip if not logged in
//   });

//   const navigate = useNavigate();
//   // --- End Top Level Hook Calls ---

//   // --- Early Returns for Loading/Error States ---
//   // Check loading state AFTER hooks
//   // Note: If !isLoggedIn, skip is true, and loading will be false.
//   if (isLoggedIn && (regimentsLoading || lastWorkoutLoading)) {
//      return <p className="text-center mt-10">Loading...</p>; // Show loading only if logged in and queries are running
//   }

//   // Check error state AFTER hooks
//   if (isLoggedIn && regimentsError) {
//       console.error("Error loading regiments:", regimentsError);
//       return <p className="text-center mt-10 text-red-500">Error loading regiments.</p>;
//   }
//   if (isLoggedIn && lastWorkoutError) {
//       console.error("Error loading last workout data:", lastWorkoutError);
//       return <p className="text-center mt-10 text-red-500">Error loading user data.</p>;
//   }
//   // --- End Early Returns ---

//   // --- Logic & Data Processing (Only if Logged In) ---
//   let mostRecentRegiment = null;
//   if (isLoggedIn && lastWorkout?.oneUser?.completedRegiments) {
//     const sortedRegiments = lastWorkout.oneUser.completedRegiments
//       ?.filter(regiment => regiment && regiment.date && !isNaN(new Date(regiment.date)))
//       ?.sort((a, b) => new Date(b.date) - new Date(a.date));
//     mostRecentRegiment = sortedRegiments?.[0];
//   }
//   // ---

//   // --- Conditional Rendering ---
//   if (isLoggedIn) {
//     // --- Logged-in View ---
//     return (
//       <div className="container mx-auto px-4 py-8"> {/* Added container and padding */}

//         {/* Last Workout Section */}
//         {mostRecentRegiment ? (
//           <div className="mb-8">
//             <h2 className='text-xl font-semibold text-center mb-3'>Last Workout</h2>
//             <div className="w-full max-w-md mx-auto"> {/* Centered and max width */}
//               {/* Made non-interactive as it just displays info */}
//               <div className="workout-card test2 border-2 rounded-lg p-4 my-2 t back text-center">
//                  <h3 className="text-lg font-bold">
//                     {mostRecentRegiment.name}
//                  </h3>
//                  {/* Format date for better readability */}
//                  <p className="text-sm mt-1">{new Date(mostRecentRegiment.date).toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
//         ) : (
//            // Optional: Message if no workouts completed yet
//            <p className="text-center text-gray-400 mb-8">No workouts logged yet!</p>
//         )}

//         {/* Your Workouts Section */}
//         <div className="mb-8">
//           <h3 className='text-xl font-semibold text-center mb-3'>Your Workouts</h3>
//           {regimentsData?.userRegiments?.length > 0 ? (
//             <>
//               {/* Grid layout for workout buttons */}
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
//                 {regimentsData.userRegiments.map((regiment) => (
//                   <div className="w-full" key={regiment._id}> {/* Use unique _id for key */}
//                     <button
//                       className="workout-card test2 border-2 rounded-lg p-3 t back w-full shadow-md overflow-hidden transition duration-100 ease-in-out transform active:scale-95 hover:shadow-lg text-center h-full flex flex-col justify-center" // Added more styling for consistency
//                       onClick={() => navigate(`/workout/${regiment._id}`)}
//                       aria-label={`Start workout ${regiment.name}`}
//                     >
//                        <span className="font-bold small-text break-words">{regiment.name}</span>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//              // Message if no regiments created yet
//              <p className="text-center text-gray-400">You haven't created any workout regiments yet.</p>
//           )}
//            {/* Add New Workout Button - always visible when logged in */}
//            <div className="w-full max-w-md mx-auto mt-6"> {/* Centered and max width */}
//               <button
//                 className="workout-card border-2 blue-b rounded-lg p-4 t test2 w-full font-bold text-lg transition duration-100 ease-in-out transform active:scale-95 hover:shadow-lg" // Consistent styling
//                 onClick={() => navigate(`/newWorkout`)}
//               >
//                 Add New Workout
//               </button>
//             </div>
//         </div>
//       </div>
//     );
//     // --- End Logged-in View ---

//   } else {
//     // --- Logged-out View ---
//     return (
//       <div className="flex flex-col items-center justify-center text-center px-4 py-16"> {/* Centered content */}
//         <div className='mb-6'>
//           {/* Ensure logo path is correct relative to public folder */}
//           <img src="/MuscleMakerLogo.png" alt="Muscle Maker Logo" className="max-w-xs w-full h-auto" />
//         </div>
//         <h3 className='t text-lg mb-6'>Login or Sign Up to Start Working Out!</h3>
//         <div className='flex space-x-4'> {/* Added spacing between buttons */}
//             <button className='px-6 py-2 rounded test border-2 accentb bg-transparent hover:bg-gray-700 transition' onClick={() => navigate('/LogIn')}>
//                 Log In
//             </button>
//              <button className='px-6 py-2 rounded test border-2 accentb bg-transparent hover:bg-gray-700 transition' onClick={() => navigate('/SignUp')}>
//                 Sign Up
//             </button>
//         </div>
//       </div>
//     );
//     // --- End Logged-out View ---
//   }
// }

// src/pages/Home.jsx (Simplified for Testing)

// src/App.jsx (Restoring NavTabs)

// src/pages/Home.jsx (Restored)

import React from 'react'; // Import React
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure this is needed and installed
import Auth from "./../utils/auth";
import { GET_REGIMENTS, GET_USER_BY_ID } from '../utils/queries'; // Combined imports

export default function Home() {
  // --- Determine variables BEFORE hooks ---
  const isLoggedIn = Auth.loggedIn();
  const profile = isLoggedIn ? Auth.getProfile() : null;
  const userId = profile?.data?._id; // Get userId safely
  // --- End Variable Determination ---

  // --- Top Level Hook Calls ---
  // Query 1: Get User Data (for last workout/streak)
  const { loading: lastWorkoutLoading, error: lastWorkoutError, data: lastWorkout } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId }, // Use pre-calculated userId
    skip: !isLoggedIn, // Skip if not logged in
  });

  // Query 2: Get User Regiments
  const { loading: regimentsLoading, error: regimentsError, data: regimentsData } = useQuery(GET_REGIMENTS, {
    variables: { userId: userId }, // Use pre-calculated userId
    skip: !isLoggedIn, // Skip if not logged in
  });

  const navigate = useNavigate();
  // --- End Top Level Hook Calls ---

  // --- Early Returns for Loading/Error States ---
  // Check loading state AFTER hooks
  // Note: If !isLoggedIn, skip is true, and loading will be false.
  if (isLoggedIn && (regimentsLoading || lastWorkoutLoading)) {
     return <p className="text-center mt-10">Loading...</p>; // Show loading only if logged in and queries are running
  }

  // Check error state AFTER hooks
  if (isLoggedIn && regimentsError) {
      console.error("Error loading regiments:", regimentsError);
      return <p className="text-center mt-10 text-red-500">Error loading regiments.</p>;
  }
  if (isLoggedIn && lastWorkoutError) {
      console.error("Error loading last workout data:", lastWorkoutError);
      return <p className="text-center mt-10 text-red-500">Error loading user data.</p>;
  }
  // --- End Early Returns ---

  // --- Logic & Data Processing (Only if Logged In) ---
  let mostRecentRegiment = null;
  if (isLoggedIn && lastWorkout?.oneUser?.completedRegiments) {
    const sortedRegiments = lastWorkout.oneUser.completedRegiments
      ?.filter(regiment => regiment && regiment.date && !isNaN(new Date(regiment.date)))
      ?.sort((a, b) => new Date(b.date) - new Date(a.date));
    mostRecentRegiment = sortedRegiments?.[0];
  }
  // ---

  // --- Conditional Rendering ---
  if (isLoggedIn) {
    // --- Logged-in View ---
    return (
      <div className="container mx-auto px-4 py-8"> {/* Added container and padding */}

        {/* Last Workout Section */}
        {mostRecentRegiment ? (
          <div className="mb-8">
            <h2 className='text-xl font-semibold text-center mb-3'>Last Workout</h2>
            <div className="w-full max-w-md mx-auto"> {/* Centered and max width */}
              {/* Made non-interactive as it just displays info */}
              <div className="workout-card test2 border-2 rounded-lg p-4 my-2 t back text-center">
                 <h3 className="text-lg font-bold">
                    {mostRecentRegiment.name}
                 </h3>
                 {/* Format date for better readability */}
                 <p className="text-sm mt-1">{new Date(mostRecentRegiment.date).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
           // Optional: Message if no workouts completed yet
           <p className="text-center text-gray-400 mb-8">No workouts logged yet!</p>
        )}

        {/* Your Workouts Section */}
        <div className="mb-8">
          <h3 className='text-xl font-semibold text-center mb-3'>Your Workouts</h3>
          {regimentsData?.userRegiments?.length > 0 ? (
            <>
              {/* Grid layout for workout buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {regimentsData.userRegiments.map((regiment) => (
                  <div className="w-full" key={regiment._id}> {/* Use unique _id for key */}
                    <button
                      className="workout-card test2 border-2 rounded-lg p-3 t back w-full shadow-md overflow-hidden transition duration-100 ease-in-out transform active:scale-95 hover:shadow-lg text-center h-full flex flex-col justify-center" // Added more styling for consistency
                      onClick={() => navigate(`/workout/${regiment._id}`)}
                      aria-label={`Start workout ${regiment.name}`}
                    >
                       <span className="font-bold small-text break-words">{regiment.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
             // Message if no regiments created yet
             <p className="text-center text-gray-400">You haven't created any workout regiments yet.</p>
          )}
           {/* Add New Workout Button - always visible when logged in */}
           <div className="w-full max-w-md mx-auto mt-6"> {/* Centered and max width */}
              <button
                className="workout-card border-2 blue-b rounded-lg p-4 t test2 w-full font-bold text-lg transition duration-100 ease-in-out transform active:scale-95 hover:shadow-lg" // Consistent styling
                onClick={() => navigate(`/newWorkout`)}
              >
                Add New Workout
              </button>
            </div>
        </div>
      </div>
    );
    // --- End Logged-in View ---

  } else {
    // --- Logged-out View ---
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 py-16"> {/* Centered content */}
        <div className='mb-6'>
          {/* Ensure logo path is correct relative to public folder */}
          <img src="/MuscleMakerLogo.png" alt="Muscle Maker Logo" className="max-w-xs w-full h-auto" />
        </div>
        <h3 className='t text-lg mb-6'>Login or Sign Up to Start Working Out!</h3>
        <div className='flex space-x-4'> {/* Added spacing between buttons */}
            <button className='px-6 py-2 rounded test border-2 accentb bg-transparent hover:bg-gray-700 transition' onClick={() => navigate('/LogIn')}>
                Log In
            </button>
             <button className='px-6 py-2 rounded test border-2 accentb bg-transparent hover:bg-gray-700 transition' onClick={() => navigate('/SignUp')}>
                Sign Up
            </button>
        </div>
      </div>
    );
    // --- End Logged-out View ---
  }
}
