const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const authConfig = require('./src/auth_config.json');
const { error } = require('console');
const connectDB = require('./src/db');
const Todo = require('./todoModel');
const app = express();

if (
  !authConfig.domain ||
  !authConfig.authorizationParams.audience ||
  ["YOUR_API_IDENTIFIER", "{API_IDENTIFIER}"].includes(authConfig.authorizationParams.audience)
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan('dev'));
app.use(helmet());
app.use(
  cors({
    origin: authConfig.appUri,
  })
);
app.use(express.json()) 

connectDB();
app.use(cors({
  origin: ['https://todo-app-coral-alpha-92.vercel.app', 'http://localhost:4200'], // Add your Vercel deployment URL and local development URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const checkJwt = auth({
  audience: authConfig.authorizationParams.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
});

app.get('/api/external', checkJwt, (req, res) => {

console.log(req.auth.payload.sub)
  res.send({
    msg: 'Your access token was successfully validated!',
  });
}, (error, res)=>{
  if(error) {
    console.error(error)
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get('/api/todos', checkJwt, async (req, res) => {
  try {
    console.log(req)
    const userId = req.auth.payload.sub;// Get user ID from the authenticated request
    const todos = await Todo.find({ userId }); // Fetch todos for this user
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});


app.post('/api/todos', checkJwt, async (req, res) => {
  const userId = req.auth.payload.sub;
  console.log(req.body.id)
  const newTodo = new Todo({
    title: req.body.title,
    completed: req.body.completed,
    userId,
    editing: req.body.editing, // Optional
    subtasks: req.body.subtasks, // Optional array of subtasks
    priority: req.body.priority, // Optional
    id:req.body.id
  });
  await newTodo.save();
  res.status(201).json(newTodo);

});

app.patch('/api/todos/:id/toggle', checkJwt, async (req, res) => {
  try {
    const todoId = req.params.id;
    // Your toggle logic here
    const updatedTodo = await Todo.findByIdAndUpdate(
        todoId,
        [{ $set: { completed: { $not: "$completed" } } }],
        { new: true }
    );
    
    if (!updatedTodo) {
        return res.status(404).json({ message: "Todo not found" });
    }
    
    res.json(updatedTodo);
} catch (error) {
    res.status(500).json({ message: "Error updating todo" });
}

});

// api-server.js

app.delete('/api/todos/:id', checkJwt, async (req, res) => {
  const todoId = req.params.id;
  const userId = req.auth.payload.sub;

  try {
      // Find and delete the todo for the current user
      const result = await Todo.findOneAndDelete({ _id: todoId, userId });

      if (result) {
          res.status(200).json({ message: "Todo deleted successfully" });
      } else {
          res.status(404).json({ error: "Todo not found or unauthorized" });
      }
  } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({ error: "Failed to delete todo" });
  }
});


app.patch('/api/todos/:id/edit', checkJwt, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.auth.payload.sub;

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { title },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});


const port = process.env.API_SERVER_PORT || 3001;

app.listen(port, () => console.log(`Api started on port ${port}`));
