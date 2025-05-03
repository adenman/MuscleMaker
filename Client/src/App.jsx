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

import './App.css';
import './index.css';
import { Outlet } from 'react-router-dom';
import Nav from './components/NavTabs'; // Uncommented Nav import
import { WorkoutProvider } from './components/context'; // Keep Provider

function App() {
  return (
    <WorkoutProvider>
      {/* Removed placeholder, restored Nav component */}
      <Nav />

      <main className="flex-column justify-center align-center min-100-vh g mx-3">
        {/* Outlet will render the restored Home.jsx */}
        <Outlet />
      </main>
    </WorkoutProvider>
  );
}

export default App;


