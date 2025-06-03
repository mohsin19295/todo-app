import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

export default mongoose.models.Todo || mongoose.model('Todo', TodoSchema);