require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const { ApolloServer } = require('@apollo/server');
const { authMiddleware } = require('./utils/auth');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');



const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  bodyParser: {
    json: {
      limit: '50mb'
    },
    urlencoded: {
      limit: '50mb',
      extended: true
    }
  }
});

const allowedOrigins = [
  'http://localhost:3000', // Allow your local React dev server (if it runs on 3000)
  'http://localhost:3001', // Allow local access if needed
  // Add your deployed frontend URL here! Replace with your actual Render URL
  'https://musclemaker.onrender.com' // Example - Replace with your frontend service URL on Render
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(express.json({ limit: '50mb' }));

  // Serve up static assets
  app.use('/images', express.static(path.join(__dirname, '../client/images')));

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Corrected way in server.js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

  db.once('open', () => {
    app.listen(PORT, HOST, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`API server listening on ${HOST}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call to start Apollo Server
startApolloServer();