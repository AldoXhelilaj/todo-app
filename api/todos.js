// api/todos.js
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const connectDB = require('../src/db');
const Todo = require('../todoModel');

const checkJwt = auth({
  audience: 'https://dev-xkp8v214xycxwk2f.us.auth0.com/api/v2/',
  issuerBaseURL: `https://dev-xkp8v214xycxwk2f.us.auth0.com`,
});

// CORS configuration
const corsOptions = {
  origin: [ 'http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Main handler for the API
const handler = async (req, res) => {
  // Connect to the database
  await connectDB();

  // Apply CORS
  cors(corsOptions)(req, res, async () => {
    // Verify JWT token
    checkJwt(req, res, async () => {
      const userId = req.auth.payload.sub;
      const path = req.url.split('?')[0]; // Get path without query params
      const method = req.method;

      try {
        // GET /api/todos
        if (path === '/api/todos' && method === 'GET') {
          const todos = await Todo.find({ userId });
          return res.json(todos);
        }

        // POST /api/todos
        if (path === '/api/todos' && method === 'POST') {
          const newTodo = new Todo({
            title: req.body.title,
            completed: req.body.completed,
            userId,
            editing: req.body.editing,
            subtasks: req.body.subtasks,
            priority: req.body.priority,
            id: req.body.id
          });
          await newTodo.save();
          return res.status(201).json(newTodo);
        }

        // PATCH /api/todos/:id/toggle
        if (path.match(/^\/api\/todos\/[^/]+\/toggle$/) && method === 'PATCH') {
          const todoId = path.split('/')[3];
          const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, userId },
            [{ $set: { completed: { $not: "$completed" } } }],
            { new: true }
          );

          if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
          }

          return res.json(updatedTodo);
        }

        // Handle other routes or methods here...

        // If no matching route found
        return res.status(404).json({ error: "Not Found" });

      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
  });
};

module.exports = handler;