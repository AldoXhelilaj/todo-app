const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const connectDB = require('../src/db');
const Todo = require('../todoModel');

const checkJwt = auth({
  audience: `${process.env.AUTH0_AUDIENCE}`,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
});

// CORS configuration
const corsOptions = {
  origin: ['https://todo-app-coral-alpha-92.vercel.app', 'http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


// Main handler for the API
const handler = async (req, res) => {
  try {
    await connectDB(); // Ensure DB connection is established

    cors(corsOptions)(req, res, async () => {
      checkJwt(req, res, async () => {

        if (!req.auth || !req.auth.payload) {
          return res.status(401).json({ error: 'Unauthorized: No valid token provided' });
      }
        const userId = req.auth?.payload?.sub;
        

        const path = req.url.split('?')[0]; // Get path without query params
        const method = req.method;

        try {
          if (path === '/api/todos' && method === 'GET') {
            const todos = await Todo.find({ userId });
            return res.json(todos);
          }

          if (path === '/api/todos' && method === 'POST') {
            const newTodo = new Todo({ ...req.body, userId });
            await newTodo.save();
            return res.status(201).json(newTodo);
          }

          // Handle other routes...

          return res.status(404).json({ error: 'Not Found' });
        } catch (error) {
          console.error('Error processing request:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
      });
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ error: 'Failed to connect to database' });
  }
};

module.exports = handler;
