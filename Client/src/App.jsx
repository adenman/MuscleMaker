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

// src/App.jsx (Padding for Fixed Header)

import './App.css';
import './index.css';
import { Outlet } from 'react-router-dom';
import Nav from './components/NavTabs.jsx'; // Added .jsx
import { WorkoutProvider } from './components/context.jsx'; // Added .jsx

function App() {
  // Fetch logic might be here if you moved it previously

  return (
    <WorkoutProvider>
      <Nav className=""
        // Pass props if fetch logic is here
      />

      {/* Add top padding here (e.g., pt-16 or pt-20) */}
      <main className="flex-column justify-center align-center min-100-vh g mx-3 pt-40"> {/* <-- ADD PADDING HERE */}
        <Outlet /> {/* Renders child routes */}
      </main>
    </WorkoutProvider>
  );
}

export default App;



