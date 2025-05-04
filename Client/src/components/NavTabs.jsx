// src/components/NavTabs.jsx (Testing Bare Minimum with useState)

import React, { useState, useEffect } from 'react'; // Keep useState/useEffect for test
import Auth from '../utils/auth';
// import Offcanvas from 'react-bootstrap/Offcanvas'; // Commented out Offcanvas
// import { useNavigate } from 'react-router-dom';
// import { useQuery } from '@apollo/client';
// import { GET_USER_BY_ID } from '../utils/queries';

// Helper function (can be kept or commented out)
// const calculateStreak = (completedRegiments) => { ... };


function NavTabs() {
  // --- Determine variables BEFORE hooks ---
  const isLoggedIn = Auth.loggedIn();
  const profile = isLoggedIn ? Auth.getProfile() : null;
  // const userId = profile?.data?._id; // Not needed for this test
  const name = profile?.data?.userName || 'Guest';
  // --- End Variable Determination ---

  // --- Top Level Hook Calls ---
  // const navigate = useNavigate();
  const [testState, setTestState] = useState(0); // Keep ONLY useState for testing
  // const [show, setShow] = useState(false); // Commented out state for Offcanvas

  // --- useEffect (kept from previous test) ---
  useEffect(() => {
    console.log("NavTabs: useEffect hook is running. Test State:", testState);
  }, [testState]); // Depend on testState

  // Mock Apollo state variables
  // const userLoading = false;
  // const userError = null;
  // const userData = null;
  // --- End Hook Replacement ---

  // Commented out handlers for Offcanvas
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // --- Calculate streak (will be 0) ---
  const streak = 0;
  // ---

  // Mock navigate function (not used)
  // const navigate = (path) => console.log(`Mock navigate to: ${path}`);

  console.log("Rendering NavTabs (Bare Minimum Test)"); // Add log

  return (
    // Simplified JSX - No Offcanvas, minimal structure
    <div className="g pb-16 pt-20">
      <header className="absolute inset-x-0 top-0 z-50 test2">
        <nav aria-label="Global" className="flex items-center justify-between p-4">
          <div className="flex">
            {/* Simplified Button */}
            <button onClick={() => setTestState(c => c + 1)} aria-label="Test Button">
              Test Button (Clicks: {testState})
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
              </svg> */}
            </button>
          </div>
          <div>
             {/* Simplified Content */}
             Hello {name}
          </div>
        </nav>
      </header>
      {/* Removed Offcanvas Component */}
    </div>
  );
}

export default NavTabs;

