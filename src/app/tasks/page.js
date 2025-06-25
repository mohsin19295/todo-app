'use client'

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_TASK, DELETE_TASK, GET_TASKS, UPDATE_TASK } from "@/graphql/operations/taskOperations";

const initialState = {
  title: '',
  description: '',
  status: 'To Do',
  priority: 'Low',
  dueDate: '',
  assignee: ''
};

export default function Tasks() {
  const [formState, setFormState] = useState(initialState);
  const [edit, setEdit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_TASKS);
  const [addTask, addState] = useMutation(ADD_TASK);
  const [deleteTask, deleteState] = useMutation(DELETE_TASK);
  const [updateTask, updateState] = useMutation(UPDATE_TASK);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formState.title.trim()) return;

    if (edit) {
      try {
        await updateTask({ 
            variables: { 
              id: edit.id,
              title: formState.title,
              description: formState.description,
              status: formState.status,
              priority: formState.priority,
              dueDate: formState.dueDate,
              assignee: formState.assignee  
            } 
        });
        setFormState(initialState);
        setEdit(null);
        refetch()
      } catch (err) {
        console.error("Update Error:", err.message);
      }
      } else {
        try {
          await addTask({ 
            variables: { 
              title: formState.title,
              description: formState.description,
              status: formState.status,
              priority: formState.priority,
              dueDate: formState.dueDate,
              assignee: formState.assignee 
            } 
          });
          refetch()
          setFormState(initialState);
        } catch (err) {
          console.error("Create Error:", err.message);
        }
      }
    };


  const handleDelete =  async (id) => {
    setDeletingId(id)
    try {
      await deleteTask({variables: {id}});
      refetch();
      console.log(`Task for id: ${id} has been deleted!`);
      if (edit && edit.id === id) {
        setEdit(null);
        setFormState(initialState);
      }
    } catch (err) {
        console.error('Delete Error:', err.message)
    } finally{
      setDeletingId(null);
    }
  };

  const handleEdit = (task) => {
    setFormState((pre) => ({...pre, title: task.title}));
    setEdit(task);
    console.log(`Task for id: ${task.id} is trying to edit!`);
  };

  console.log(formState)

  return (
      <div className='border border-light-border bg-light-bg hover:bg-dark-bg shadow-custom-shadow w-[94%] max-w-[768px] h-[90%] sm:p-6 p-4 rounded-xl backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300'>
        <form onSubmit={handleSubmit} className='mb-4'>
        <div className='sm:w-1/2 w-full flex-col border border-red-500'>
          <input 
            type='text'
            value={formState.title}
            onChange={(e) => setFormState((pre) => ({...pre, title: e.target.value}))}
            placeholder='Add new task...'
            className='w-full px-4 py-2 rounded-md outline-none bg-dark-bg transition-all border border-dark-border focus:ring-1 focus:ring-white/50 focus:border-white/40 shadow-sm'
            />
             <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">Priority:</span>
                <select
                  value={formState.priority}
                  onChange={(e) => setFormState((pre) => ({...pre, priority: e.target.value}))}
                  className="bg-dark-bg border border-dark-border text-white text-sm rounded-md px-3 py-1 focus:ring-white/50 focus:border-white/40 transition"
                >
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>

             <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">Status:</span>
                <select
                  value={formState.status}
                  onChange={(e) => setFormState((pre) => ({...pre, status: e.target.value}))}
                  className="bg-dark-bg border border-dark-border text-white text-sm rounded-md px-3 py-1 focus:ring-white/50 focus:border-white/40 transition"
                >
                  <option value="To Do">🟢 To Do</option>
                  <option value="In Progresss">🟡 In Progress</option>
                  <option value="Done">🔴 Done</option>
                </select>
              </div>
            <button 
              type="submit"
              disabled={updateState.loading || addState.loading}
              className={`border border-dark-border bg-dark-bg hover:bg-btn-hover transition-all px-4 py-2 rounded-md ${updateState.loading || addState.loading ? 'cursor-wait animate-pulse' : 'cursor-pointer'}`}>
              {edit ? (updateState.loading ? 'Updating...' : 'Update') : (addState.loading ? 'Adding...' : 'Add')}
            </button>
        </div>
        </form>

        {addState.error && <p className="text-red-500">Add Error: {addState.error.message}</p>}
        {updateState.error && <p className="text-red-500">Update Error: {updateState.error.message}</p>}
        {deleteState.error && <p className="text-red-500">Delete Error: {deleteState.error.message}</p>}
        {/* <ul className={`scrollbar-custom border border-dark-border bg-dark-bg hover:bg-light-bg transition-all w-full max-h-[89%] m-auto sm:p-4 p-2 rounded-md flex flex-col gap-2 overflow-y-auto`}>
          {(error) && <p className="text-red-500">{error.message}</p>}
          {
            loading ? <div className='text-center text-sm opacity-60'><p>Loading...</p></div> :
            data?.getTasks?.length === 0 ? <p className='text-center text-sm opacity-60'>No data available.</p> :
            data?.getTasks?.map((task, index)=> {
              return (
                <li key={task.id} className='flex justify-between items-start'>
                  <p className={`w-full mr-4 px-2 py-2 rounded-md text-md ${index % 2 === 1 ? 'bg-light-bg' : ''}`}>{task.title}</p>
                  <div className='flex gap-2 [&_*]:border [&_*]:border-dark-border [&_*]:bg-dark-bg [&_*]:transition-all [&_*]:px-2 [&_*]:py-1 [&_*]:rounded-md'>
                    <button 
                      onClick={() => handleEdit(task)}
                      className={`${edit && edit.id === task.id ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} hover:bg-btn-hover`}
                      disabled={edit && edit.id === task.id}
                      >
                        Edit
                      </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                      className={`${deletingId === task.id ? 'cursor-wait animate-pulse' : 'cursor-pointer'} hover:bg-btn-hover`} 
                      >
                      {deletingId === task.id ? 'Deleting...' : 'Delete'}
                      </button>
                  </div>
                </li>
              )
            })
          }
        </ul> */}
      </div>
  );
}