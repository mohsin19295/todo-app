'use client'

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_TODO, DELETE_TODO, GET_TODOS, UPDATE_TODO } from "@/graphql/operations/todoOperations";
import { buttonClass, fieldClass, todoButton } from "../components/ui";

export default function Todos() {
  const [title, setTitle] = useState('');
  const [edit, setEdit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingSelected, setDeletingSelected] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_TODOS);
  const [addTodo, addState] = useMutation(ADD_TODO);
  const [deleteTodo, deleteState] = useMutation(DELETE_TODO);
  const [updateTodo, updateState] = useMutation(UPDATE_TODO);
  const saving = updateState.loading || addState.loading;
  const todos = data?.getTodos;
  const waiting = loading && !todos;

  useEffect(() => {
    if (!todos) return;
    setSelectedIds((current) => {
      const next = current.filter((id) => todos.some((todo) => todo.id === id));
      return next.length === current.length ? current : next;
    });
  }, [todos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;

    try {
      if (edit) {
        await updateTodo({ variables: { id: edit.id, title: nextTitle } });
        setEdit(null);
      } else {
        await addTodo({ variables: { title: nextTitle } });
      }
      setTitle('');
      refetch();
    } catch (err) {
      console.error(edit ? "Update Error:" : "Create Error:", err.message);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteTodo({ variables: { id } });
      if (edit && edit.id === id) {
        setEdit(null);
        setTitle('');
      }
      setSelectedIds((current) => current.filter((item) => item !== id));
      refetch();
    } catch (err) {
      console.error('Delete Error:', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setEdit(todo);
  };

  const handleCancel = () => {
    setEdit(null);
    setTitle('');
  };

  const toggleSelected = (id) => {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const toggleSelectAll = () => {
    if (!todos?.length) return;
    const everySelected = todos.every((todo) => selectedIds.includes(todo.id));
    setSelectedIds(everySelected ? [] : todos.map((todo) => todo.id));
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;
    setDeletingSelected(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteTodo({ variables: { id } })));
      if (edit && selectedIds.includes(edit.id)) {
        setEdit(null);
        setTitle('');
      }
      setSelectedIds([]);
      refetch();
    } catch (err) {
      console.error('Delete selected error:', err.message);
    } finally {
      setDeletingSelected(false);
    }
  };

  const selectedCount = selectedIds.length;
  const deleteSelectedLabel = deletingSelected
    ? 'Deleting...'
    : selectedCount === 1
      ? 'Delete selected (1)'
      : `Delete selected (${selectedCount})`;

  return (
    <div className='flex w-[94%] max-w-3xl flex-col rounded-2xl border border-light-border bg-light-bg p-4 shadow-custom-shadow backdrop-blur-md sm:p-6'>

      <form onSubmit={handleSubmit} className='rounded-xl border border-dark-border bg-dark-bg p-4'>
        <div className='flex w-full flex-col gap-3 sm:flex-row'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add new todo...'
            className={fieldClass}
          />
          <div className='flex gap-2'>
            <button type='submit' disabled={saving} className={buttonClass.primary}>
              {edit ? (saving ? 'Updating...' : 'Update') : (saving ? 'Adding...' : 'Add')}
            </button>
            {edit && (
              <button type='button' onClick={handleCancel} className={buttonClass.quiet}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {addState.error && <p className="mt-3 text-sm text-rose-300">Add Error: {addState.error.message}</p>}
      {updateState.error && <p className="mt-3 text-sm text-rose-300">Update Error: {updateState.error.message}</p>}
      {deleteState.error && <p className="mt-3 text-sm text-rose-300">Delete Error: {deleteState.error.message}</p>}

      {!!todos?.length && (
        <div className='mt-4 flex items-center justify-between gap-3'>
          <label className='flex items-center gap-2 text-sm text-white/80'>
            <input
              type='checkbox'
              checked={todos.every((todo) => selectedIds.includes(todo.id))}
              onChange={toggleSelectAll}
              className='h-4 w-4 accent-cyan-300'
            />
            Select all
          </label>
          <button
            type='button'
            onClick={handleDeleteSelected}
            disabled={!selectedCount || deletingSelected}
            className={todoButton.danger}
          >
            {selectedCount || deletingSelected ? deleteSelectedLabel : 'Delete selected'}
          </button>
        </div>
      )}

      <ul className='scrollbar-custom mt-3 flex max-h-[calc(100vh-20rem)] flex-col gap-2 overflow-y-auto rounded-xl border border-dark-border bg-dark-bg p-3'>
        {error && <p className="text-sm text-rose-300">{error.message}</p>}
        {waiting ? (
          <div className='space-y-2 py-2'>
            <div className='h-12 animate-pulse rounded-lg bg-white/5' />
            <div className='h-12 animate-pulse rounded-lg bg-white/5' />
            <p className='py-2 text-center text-sm text-white/60'>Loading todos...</p>
          </div>
        ) : todos?.length === 0 ? (
          <p className='py-8 text-center text-sm text-white/60'>No todos yet. Add one to get started.</p>
        ) : (
          todos?.map((todo) => (
            <li key={todo.id} className='flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-white/25 sm:flex-row sm:items-center'>
              <input
                type='checkbox'
                checked={selectedIds.includes(todo.id)}
                onChange={() => toggleSelected(todo.id)}
                aria-label={`Select ${todo.title}`}
                className='h-4 w-4 shrink-0 accent-cyan-300'
              />
              <p className={`min-w-0 flex-1 break-words text-sm sm:text-base ${todo.completed ? 'text-white/50 line-through' : ''}`}>
                {todo.title}
              </p>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => handleEdit(todo)}
                  disabled={edit && edit.id === todo.id}
                  className={todoButton.edit}
                >
                  ✏️ Edit
                </button>
                <button
                  type='button'
                  onClick={() => handleDelete(todo.id)}
                  disabled={deletingId === todo.id}
                  className={todoButton.danger}
                >
                  {deletingId === todo.id ? 'Deleting...' : '🗑️ Delete'}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
