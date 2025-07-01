import Task from "@/models/Task";
import Todo from "@/models/Todo"

export const resolvers = {
    Query: {
        getTodos: async () => {
            try {
                return await Todo.find();
            } catch (error) {
                throw new Error('Failed to fetch todos');
            }
        },
        getTodo: async (_, {id}) => {
            try {
                return await Todo.findById(id);
            } catch (error) {
                throw new Error('Failed to fetch todo');
            }
        },
         getTasks: async() => {
            try {
                return await Task.find()
            } catch (error) {
                throw new Error('Failed to fetch tasks');
            }
        },
        getTask: async(_, {id}) => {
            try {
                return await Task.findById(id)
            } catch (error) {
                throw new Error('Failed to fetch task');
            }
        }
    },
    Mutation: {
        addTodo: async (_, {title}) => {
            try {
                const newTodo = new Todo({title, completed: false });
                return await newTodo.save();
            } catch (error) {
                throw new Error('Failed to add todo');
            }
        },
        deleteTodo: async (_, {id}) => {
            try {
                const deleted =  await Todo.findByIdAndDelete(id);
                return !!deleted;
            } catch (error) {
                throw new Error('Failed to delete todo');
            }
        },
        updateTodo: async (_, {id, title}) => {
            try {
                const updatedTodo = await Todo.findByIdAndUpdate(id, {title}, {new: true});
                if (!updatedTodo) throw new Error('Todo not found');
                return updatedTodo;
            } catch (error) {
                throw new Error('Failed to update todo');
            }
        },
        toggleTodo: async (_, {id}) => {
            try {
                const todo = await Todo.findById(id);
                if (!todo) throw new Error('Todo not found');

                todo.completed = !todo.completed;
                return await todo.save();
            } catch (error) {
                throw new Error('Failed to toggle todo');
            }
        },
        addTask: async (_, {title, status, description, priority, assignee}) => {
            try {
                const newTask = new Task({title, status, description, priority, assignee})
                return await newTask.save()
            } catch (error) {
                throw new Error('Failed to add task');
            }
        },
        updateTask: async (_, {id, title, status, description, priority, assignee}) => {
            try {
                const updatedTask = await Task.findByIdAndUpdate(id, {title, status, description, priority, assignee}, {new: true})
                if (!updatedTask) throw new Error('Task not found');
                return updatedTask;
            } catch (error) {
                throw new Error('Failed to update task');
            }
        },
        deleteTask: async(_, {id}) => {
            try {
                const deletedTask = await Task.findByIdAndDelete(id);
                return !!deletedTask;
            } catch (error) {
                throw new Error('Failed to delete task');
            }
        }
    }
}