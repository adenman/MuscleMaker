// src/components/NavTabs.jsx (Custom Slide-in Menu)

import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth'; // Ensure Auth utility is correctly imported
// Removed import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { GET_USER_BY_ID } from '../utils/queries'; // Ensure query is correctly imported

// Helper function to calculate the streak (remains the same)
const calculateStreak = (completedRegiments) => {
  if (!completedRegiments || completedRegiments.length === 0) return 0;
  const sortedRegiments = [...completedRegiments]
    .filter(regiment => regiment && regiment.date && !isNaN(new Date(regiment.date)))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sortedRegiments.length === 0) return 0;
  let streak = 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const mostRecentDate = new Date(sortedRegiments[0].date); mostRecentDate.setHours(0, 0, 0, 0);
  const diffTime = today - mostRecentDate;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0 || diffDays === 1) { streak = 1; } else { return 0; }
  for (let i = 0; i < sortedRegiments.length - 1; i++) {
    const currentDate = new Date(sortedRegiments[i].date); currentDate.setHours(0,0,0,0);
    const previousDate = new Date(sortedRegiments[i + 1].date); previousDate.setHours(0,0,0,0);
    const dayDifference = Math.round((currentDate - previousDate) / (1000 * 60 * 60 * 24));
    if (dayDifference === 1) { streak++; } else if (dayDifference > 1) { break; }
  }
  return streak;
};


function NavTabs() {
  // --- Determine variables BEFORE hooks ---
  const isLoggedIn = Auth.loggedIn();
  const profile = isLoggedIn ? Auth.getProfile() : null;
  const userId = profile?.data?._id;
  let name = profile?.data?.userName || 'Guest';
  // --- End Variable Determination ---

  // --- Top Level Hook Calls ---
  const navigate = useNavigate();
  // State for the custom menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State for manual fetch
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [userData, setUserData] = useState(null);
  // Get Apollo client instance
  const client = useApolloClient();
  // --- End Top Level Hook Calls ---

  // --- Manual Fetch Logic in useEffect (remains the same) ---
  useEffect(() => {
    let isMounted = true;
    if (isLoggedIn && userId) {
      const fetchUserData = async () => {
        if (!isMounted) return;
        setUserLoading(true); setUserError(null);
        try {
          const { data, error } = await client.query({ query: GET_USER_BY_ID, variables: { userId: userId }, fetchPolicy: 'network-only' });
          if (error) throw error;
          if (isMounted) { setUserData(data); setUserError(null); }
        } catch (err) {
          if (isMounted) { console.error("Apollo Error manual fetch:", err); setUserError(err); }
        } finally {
          if (isMounted) { setUserLoading(false); }
        }
      };
      fetchUserData();
    } else {
      setUserLoading(false); setUserError(null); setUserData(null);
    }
    return () => { isMounted = false; };
  }, [isLoggedIn, userId, client]);
  // --- End useEffect ---

  // Handlers for the custom menu
  const handleMenuClose = () => setIsMenuOpen(false);
  const handleMenuShow = () => setIsMenuOpen(true);

  // --- Early Return for Error ---
  if (userError) {
    console.error("NavTabs Error state:", userError);
    return <div className="pt-20 text-center text-red-500">Error loading user data!</div>;
  }
  // ---

  // Update name if userData is available
  if (isLoggedIn && userData?.oneUser?.userName && name !== userData.oneUser.userName) {
      name = userData.oneUser.userName;
  }

  // Calculate streak
  const streak = isLoggedIn && userData?.oneUser?.completedRegiments
    ? calculateStreak(userData.oneUser.completedRegiments)
    : 0;

  return (
    <> {/* Use Fragment to avoid extra div */}
      {/* Header */}
      <div className="g pb-16 fixed top-0 left-0 right-0 z-40 "> {/* Make header fixed */}
        <header className="test2"> {/* Removed absolute positioning */}
          <nav aria-label="Global" className="flex items-center justify-between p-4">
            <div className="flex">
              {/* Menu Button */}
              <button onClick={handleMenuShow} aria-label="Open menu" className="text-white bg-black p-1 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
              </button>
            </div>
            {/* Streak Display */}
            <div className="text-white">
              {isLoggedIn && userLoading && (<div className="text-xs">Loading...</div>)}
              {isLoggedIn && !userLoading && streak > 0 && (
                <div className="flex flex-col items-center justify-center text-center">
                  <img src="/flame.png" alt="Streak flame" className="h-8 w-auto mb-1" />
                  <span className="font-bold text-xs">{streak} Day Streak</span>
                </div>
              )}
            </div>
          </nav>
        </header>
      </div>

      {/* Custom Slide-in Menu */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleMenuClose} // Close menu when clicking overlay
        aria-hidden={!isMenuOpen}
      ></div>

      {/* Menu Content */}
      <div
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-black text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        {/* Menu Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 id="menu-title" className="text-lg font-semibold">Hello {name}</h2>
          <button onClick={handleMenuClose} aria-label="Close menu" className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>

        {/* Menu Body */}
        {isLoggedIn ? (
          <div className="py-4 px-2 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => { navigate('/'); handleMenuClose(); }} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16"><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/></svg>
                  <span className="ms-3">Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => { if (userId) navigate(`/profile/${userId}`); handleMenuClose(); }} disabled={!userId} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left disabled:opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                </button>
              </li>
              <li>
                <button onClick={() => { Auth.logout(); handleMenuClose(); }} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-white transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/></svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        ) : (
          // Menu items for logged-out users
          <div className="py-4 px-2 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => { navigate('/'); handleMenuClose(); }} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left">
                  <span className="flex-1 ms-3 whitespace-nowrap">Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => { navigate('/LogIn'); handleMenuClose(); }} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left">
                  <span className="flex-1 ms-3 whitespace-nowrap">Log In</span>
                </button>
              </li>
               <li>
                <button onClick={() => { navigate('/SignUp'); handleMenuClose(); }} className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group w-full text-left">
                  <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default NavTabs;
