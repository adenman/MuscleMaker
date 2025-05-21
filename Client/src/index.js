import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import Routes, Route

// Apollo Client Imports
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// CSS Imports
import './index.css';
import './App.css';

// Component Imports
import App from './App.jsx';
import Error from "./pages/Error.jsx";
import Home from "./pages/Home.jsx";
import LogIn from "./pages/LogIn.jsx";
import SignUp from "./pages/SignUp.jsx"; // Changed from 'signUp' and './pages/signup.jsx'
import Profile from "./pages/Profile.jsx";
import NewWorkout from "./pages/newWorkout.jsx"; // Ensured .jsx, though original was likely okay
import Regiment from "./pages/Regiment.jsx";
import Log from "./pages/Log.jsx";
import reportWebVitals from './reportWebVitals.js';

// --- Apollo Client Setup ---
const httpLink = createHttpLink({ uri: '/graphql' });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: { ...headers, authorization: token ? `Bearer ${token}` : '' },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink), cache: new InMemoryCache(),
});
// --- End Apollo Client Setup ---

// --- Render Application ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        {/* Define Routes here, using App as the layout for '/' path */}
        <Routes>
          <Route path="/" element={<App />} errorElement={<Error />}> {/* Layout Route */}
            {/* Children rendered in App's Outlet */}
            <Route index element={<Home />} />
            <Route path="newWorkout" element={<NewWorkout />} />
            <Route path="workout/:regimentId" element={<Regiment />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="Log/:userId" element={<Log />} />
            {/* Add other routes intended for the main layout */}
          </Route>

          {/* Routes outside the main layout (no Nav bar) */}
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/SignUp" element={<SignUp />} /> {/* Changed element to use SignUp */}

          {/* Catch-all for unmatched routes */}
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();