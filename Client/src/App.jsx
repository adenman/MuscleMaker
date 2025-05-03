// src/App.jsx (Layout component - Keep this simple)

// import './App.css';
// import './index.css';
// import { Outlet } from 'react-router-dom';
// import Nav from './components/NavTabs';
// import { WorkoutProvider } from './components/context';

// function App() {
//   return (
//     <WorkoutProvider>
//       {/* <Nav /> */}
//       <main className="flex-column justify-center align-center min-100-vh g mx-3">
//         <Outlet /> {/* Renders child routes defined in index.js */}
//       </main>
//     </WorkoutProvider>
//   );
// }

// export default App;
// src/App.jsx (Testing without NavTabs & WorkoutProvider)

// src/App.jsx (Testing with WorkoutProvider)

// src/App.jsx (Restoring NavTabs)

// src/App.jsx (Fetching User Data)

import './App.css';
import './index.css';
import { Outlet } from 'react-router-dom';
import Nav from './components/NavTabs';
import { WorkoutProvider } from './components/context';

// Imports needed for the query
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from './utils/queries'; // Adjust path if needed
import Auth from './utils/auth'; // Adjust path if needed

function App() {
  // Determine login status and userId here
  const isLoggedIn = Auth.loggedIn();
  const profile = isLoggedIn ? Auth.getProfile() : null;
  const userId = profile?.data?._id;

  // Fetch user data here
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId },
    skip: !isLoggedIn, // Skip if not logged in
  });

  console.log("App.jsx: userLoading:", userLoading, "userError:", !!userError, "userData:", !!userData);

  // Handle potential error at this level if needed, or pass it down
  if (userError) {
      console.error("Apollo Error fetching user data in App.jsx:", userError);
      // Decide how to handle error globally - maybe render an error message instead of Nav/Outlet?
  }

  return (
    <WorkoutProvider>
       {/* Pass fetched data and status down to Nav */}
      <Nav
        isLoggedIn={isLoggedIn}
        userId={userId}
        userLoading={userLoading}
        userError={userError}
        userData={userData}
      />

      <main className="flex-column justify-center align-center min-100-vh g mx-3">
        <Outlet /> {/* Renders child routes */}
      </main>
    </WorkoutProvider>
  );
}

export default App;



