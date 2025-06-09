'use client'

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_TODO, DELETE_TODO, GET_TODOS, TOGGLE_TODO, UPDATE_TODO } from "@/graphql/operations/todoOperations";

export default function Todos() {
  const [title, setTitle] = useState('');
  const [edit, setEdit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_TODOS);
  const [addTodo, addState] = useMutation(ADD_TODO);
  const [deleteTodo, deleteState] = useMutation(DELETE_TODO);
  const [updateTodo, updateState] = useMutation(UPDATE_TODO);
  const [toggleTodo, toggleState] = useMutation(TOGGLE_TODO);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!title.trim()) return;

    if (edit) {
      try {
        await updateTodo({ variables: { id: edit.id, title, completed: edit.completed } });
        setTitle('');
        setEdit(null);
        refetch()
      } catch (err) {
        console.error("Update Error:", err.message);
      }
      } else {
        try {
          await addTodo({ variables: { title, completed: false } });
          refetch()
          setTitle('');
        } catch (err) {
          console.error("Create Error:", err.message);
        }
      }
    };


  const handleDelete =  async (id) => {
    setDeletingId(id)
    try {
      await deleteTodo({variables: {id}});
      refetch();
      console.log(`Todo for id: ${id} has been deleted!`);
      if (edit && edit.id === id) {
        setEdit(null);
        setTitle('');
      }
    } catch (err) {
        console.error('Delete Error:', err.message)
    } finally{
      setDeletingId(null);
    }
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setEdit(todo);
    console.log(`Todo for id: ${todo.id} is trying to edit!`);
  };

  return (
    <main className="flex justify-center items-center w-full h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      <div className='border border-light-border bg-light-bg hover:bg-dark-bg shadow-custom-shadow w-[94%] max-w-[768px] h-[90%] sm:p-6 p-4 rounded-xl backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300'>
        <form onSubmit={handleSubmit} className='mb-4'>
        <div className='sm:w-1/2 w-full flex m-auto gap-4'>
          <input 
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add new task...'
            className='w-full px-4 py-2 rounded-md outline-none bg-dark-bg transition-all border border-dark-border focus:ring-1 focus:ring-white/50 focus:border-white/40 shadow-sm'
            />
            <button 
              disabled={updateState.loading || addState.loading}
              className={`border border-dark-border bg-dark-bg hover:bg-btn-hover transition-all px-4 py-2 rounded-md ${updateState.loading || addState.loading ? 'cursor-wait animate-pulse' : 'cursor-pointer'}`}>
              {edit ? (updateState.loading ? 'Updating...' : 'Update') : (addState.loading ? 'Adding...' : 'Add')}
            </button>
        </div>
        </form>

        {addState.error && <p style={{ color: 'red' }}>Add Error: {addState.error.message}</p>}
        {updateState.error && <p style={{ color: 'red' }}>Update Error: {updateState.error.message}</p>}
        {deleteState.error && <p style={{ color: 'red' }}>Delete Error: {deleteState.error.message}</p>}
        <ul className={`scrollbar-custom border border-dark-border bg-dark-bg hover:bg-light-bg transition-all w-full max-h-[89%] m-auto sm:p-4 p-2 rounded-md flex flex-col gap-2 overflow-y-auto`}>
          {(error) && <p style={{ color: 'red' }}>{error.message}</p>}
          {
            loading ? <div className='text-center text-sm opacity-60'><p>Loading...</p></div> :
            data?.getTodos?.length === 0 ? <p className='text-center text-sm opacity-60'>No data available.</p> :
            data?.getTodos?.map((todo, index)=> {
              return (
                <li key={todo.id} className='flex justify-between items-start'>
                  <p className={`w-full mr-4 px-2 py-2 rounded-md text-md ${index % 2 === 1 ? 'bg-light-bg' : ''}`}>{todo.title}</p>
                  <div className='flex gap-2 [&_*]:border [&_*]:border-dark-border [&_*]:bg-dark-bg [&_*]:transition-all [&_*]:px-2 [&_*]:py-1 [&_*]:rounded-md'>
                    <button onClick={() => handleEdit(todo)}
                      className={`${edit && edit.id === todo.id ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} hover:bg-btn-hover`}
                      disabled={edit && edit.id === todo.id}
                      >Edit</button>
                    <button 
                      onClick={() => handleDelete(todo.id)}
                      disabled={deletingId === todo.id}
                      className={`${deletingId === todo.id ? 'cursor-wait animate-pulse' : 'cursor-pointer'} hover:bg-btn-hover`} 
                      >
                      {deletingId === todo.id ? 'Deleting...' : 'Delete'}
                      </button>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
     </main>
  );
}