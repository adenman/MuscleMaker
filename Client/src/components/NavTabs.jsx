// src/components/NavTabs.jsx (Manual Fetch with Full UI)

import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth'; // Ensure Auth utility is correctly imported
import Offcanvas from 'react-bootstrap/Offcanvas'; // Restore Offcanvas
import { useNavigate } from 'react-router-dom';
// Import useApolloClient to get the client instance
import { useApolloClient } from '@apollo/client';
import { GET_USER_BY_ID } from '../utils/queries'; // Ensure query is correctly imported

// Helper function to calculate the streak
const calculateStreak = (completedRegiments) => {
  if (!completedRegiments || completedRegiments.length === 0) return 0;
  // Filter out invalid dates before sorting
  const sortedRegiments = [...completedRegiments]
    .filter(regiment => regiment && regiment.date && !isNaN(new Date(regiment.date)))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sortedRegiments.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to midnight

  const mostRecentDate = new Date(sortedRegiments[0].date);
  mostRecentDate.setHours(0, 0, 0, 0); // Normalize most recent date

  const diffTime = today - mostRecentDate;
  // Use Math.round for day difference calculation after normalizing
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Streak starts only if the last workout was today or yesterday
  if (diffDays === 0 || diffDays === 1) {
      streak = 1;
  } else {
      return 0; // Streak broken if last workout was before yesterday
  }

  // Iterate through the rest to extend the streak
  for (let i = 0; i < sortedRegiments.length - 1; i++) {
    const currentDate = new Date(sortedRegiments[i].date);
    currentDate.setHours(0,0,0,0); // Normalize date
    const previousDate = new Date(sortedRegiments[i + 1].date);
    previousDate.setHours(0,0,0,0); // Normalize date

    const dayDifference = Math.round((currentDate - previousDate) / (1000 * 60 * 60 * 24));

    if (dayDifference === 1) {
      streak++; // Increment if consecutive days
    } else if (dayDifference > 1) {
      break; // Break if gap is more than 1 day
    }
    // If dayDifference is 0, continue (multiple workouts same day)
  }
  return streak;
};


function NavTabs() {
  // console.log("NavTabs: Component rendering START (Manual Fetch - Full UI)");

  // --- Determine variables BEFORE hooks ---
  const isLoggedIn = Auth.loggedIn();
  const profile = isLoggedIn ? Auth.getProfile() : null;
  const userId = profile?.data?._id;
  // Determine name here, potentially updated by fetched data later if needed
  let name = profile?.data?.userName || 'Guest';
  // --- End Variable Determination ---

  // --- Top Level Hook Calls ---
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  // State for manual fetch
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [userData, setUserData] = useState(null);
  // Get Apollo client instance
  const client = useApolloClient();
  // --- End Top Level Hook Calls ---

  // --- Manual Fetch Logic in useEffect ---
  useEffect(() => {
    // console.log("NavTabs: useEffect for manual fetch running.");
    let isMounted = true; // Flag to prevent state updates if component unmounts

    if (isLoggedIn && userId) {
      const fetchUserData = async () => {
        if (!isMounted) return;
        // console.log("NavTabs: Attempting manual query for userId:", userId);
        setUserLoading(true);
        setUserError(null);
        // Don't necessarily reset userData here, keep previous if available during refetch?
        // setUserData(null);
        try {
          const { data, error } = await client.query({
            query: GET_USER_BY_ID,
            variables: { userId: userId },
            fetchPolicy: 'network-only', // Or 'cache-first'
          });
          if (error) throw error;
          if (isMounted) {
            // console.log("NavTabs: Manual query successful. Data:", data);
            setUserData(data);
            setUserError(null);
          }
        } catch (err) {
          if (isMounted) {
             console.error("Apollo Error during manual fetch in NavTabs:", err);
             setUserError(err);
          }
        } finally {
          if (isMounted) {
            setUserLoading(false);
          }
        }
      };
      fetchUserData();
    } else {
      setUserLoading(false);
      setUserError(null);
      setUserData(null);
      // console.log("NavTabs: Skipping manual fetch (not logged in or no userId).");
    }
    return () => { isMounted = false; }; // Cleanup
  }, [isLoggedIn, userId, client]);
  // --- End useEffect ---


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // --- Early Return for Error (using manual state) ---
  if (userError) {
    // You might want a less intrusive error display in the header
    // return <div className="pt-20 text-center text-red-500">Error!</div>;
    console.error("NavTabs Error state:", userError); // Log error but try to render rest
  }
  // ---

  // Update name if userData is available and differs from initial profile
  if (isLoggedIn && userData?.oneUser?.userName && name !== userData.oneUser.userName) {
      name = userData.oneUser.userName;
  }

  // Calculate streak using manually fetched data
  const streak = isLoggedIn && userData?.oneUser?.completedRegiments
    ? calculateStreak(userData.oneUser.completedRegiments)
    : 0;
  // console.log("NavTabs: Streak calculated:", streak);

  // console.log("NavTabs: Component rendering RETURN (Manual Fetch - Full UI)");
  return (
    // Restore full JSX structure
    <div className="g pb-16 pt-20"> {/* Adjust padding as needed */}
      <header className="absolute inset-x-0 top-0 z-50 test2">
        <nav aria-label="Global" className="flex items-center justify-between p-4">
          <div className="flex">
            {/* Restore original menu button */}
            <button onClick={handleShow} aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
              </svg>
            </button>
          </div>
          {/* Restore Streak Display */}
          <div>
            {isLoggedIn && userLoading && (
                <div className="text-xs text-white">Loading...</div>
            )}
            {/* Display streak only if logged in, not loading, and streak > 0 */}
            {isLoggedIn && !userLoading && streak > 0 && (
              <div className="flex flex-col items-center justify-center text-center">
                <img src="/flame.png" alt="" className="h-8 w-auto mb-1" />
                <span className="font-bold text-xs text-white">{streak} Day Streak</span>
              </div>
            )}
             {/* Optionally display error state */}
             {isLoggedIn && userError && (
                 <div className="text-xs text-red-500">Error</div>
             )}
          </div>
        </nav>
      </header>
      {/* Restore Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} placement="start" backdrop="static" className="g" style={{ backgroundColor: '#000000', color: 'white' }}>
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Hello {name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {isLoggedIn ? (
            // Restore full logged-in menu
            <div className="py-4 overflow-y-auto">
              <ul className="space-y-2 font-medium">
                <li>
                  <button onClick={() => { navigate('/'); handleClose(); }} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
                    </svg>
                    <span className="ms-3">Home</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { if (userId) navigate(`/profile/${userId}`); handleClose(); }} disabled={!userId} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                       <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { Auth.logout(); handleClose(); }} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-white transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            // Restore full logged-out menu
            <div className="py-4 overflow-y-auto">
              <ul className="space-y-2 font-medium">
                <li>
                  <button onClick={() => { navigate('/'); handleClose(); }} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left">
                    <span className="flex-1 ms-3 whitespace-nowrap">Home</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { navigate('/LogIn'); handleClose(); }} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left">
                    <span className="flex-1 ms-3 whitespace-nowrap">Log In</span>
                  </button>
                </li>
                 <li>
                  <button onClick={() => { navigate('/SignUp'); handleClose(); }} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left">
                    <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default NavTabs;
