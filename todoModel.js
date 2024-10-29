// todoModel.js
const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true }, // Reference to the user's ID
  editing: { type: Boolean, default: false }, // Optional field for editing state
  subtasks: [subtaskSchema], // Array of subtasks
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }, // Priority levels
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
