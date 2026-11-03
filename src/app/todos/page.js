'use client'

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_TODO, DELETE_TODO, GET_TODOS, TOGGLE_TODO, UPDATE_TODO } from "@/graphql/operations/todoOperations";
import Modal from "../components/Modal";
import { buttonClass, fieldClass, todoButton } from "../components/ui";

const filters = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "finished", label: "Finished" },
];

export default function Todos() {
  const [title, setTitle] = useState('');
  const [edit, setEdit] = useState(null);
  const [filter, setFilter] = useState('all');
  const [removingId, setRemovingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [bulk, setBulk] = useState('');
  const [confirmClear, setConfirmClear] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_TODOS);
  const [addTodo, addState] = useMutation(ADD_TODO);
  const [deleteTodo, deleteState] = useMutation(DELETE_TODO);
  const [updateTodo, updateState] = useMutation(UPDATE_TODO);
  const [toggleTodo, toggleState] = useMutation(TOGGLE_TODO);
  const saving = updateState.loading || addState.loading;
  const todos = data?.getTodos || [];
  const waiting = loading && !data?.getTodos;
  const pendingCount = todos.filter((todo) => !todo.completed).length;
  const finishedCount = todos.length - pendingCount;
  const visibleTodos = todos.filter((todo) => {
    if (filter === "pending") return !todo.completed;
    if (filter === "finished") return todo.completed;
    return true;
  });

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

  const handleToggle = async (todo) => {
    setTogglingId(todo.id);
    try {
      await toggleTodo({ variables: { id: todo.id } });
      refetch();
    } catch (err) {
      console.error('Toggle Error:', err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleRemove = async (id) => {
    setRemovingId(id);
    try {
      await deleteTodo({ variables: { id } });
      if (edit?.id === id) {
        setEdit(null);
        setTitle('');
      }
      refetch();
    } catch (err) {
      console.error('Remove Error:', err.message);
    } finally {
      setRemovingId(null);
    }
  };

  const handleMarkAllComplete = async () => {
    const pending = todos.filter((todo) => !todo.completed);
    if (!pending.length) return;
    setBulk('complete');
    try {
      await Promise.all(pending.map((todo) => toggleTodo({ variables: { id: todo.id } })));
      refetch();
    } catch (err) {
      console.error('Mark all complete error:', err.message);
    } finally {
      setBulk('');
    }
  };

  const handleClear = async (onlyFinished) => {
    const targets = onlyFinished ? todos.filter((todo) => todo.completed) : todos;
    if (!targets.length) return;
    setBulk(onlyFinished ? 'finished' : 'all');
    try {
      await Promise.all(targets.map((todo) => deleteTodo({ variables: { id: todo.id } })));
      if (edit && targets.some((todo) => todo.id === edit.id)) {
        setEdit(null);
        setTitle('');
      }
      refetch();
    } catch (err) {
      console.error('Clear error:', err.message);
    } finally {
      setBulk('');
    }
  };

  const emptyLabel = filter === "pending"
    ? "Nothing is pending."
    : filter === "finished"
      ? "No finished todos yet."
      : "No todos yet. Add one to get started.";

  return (
    <div className='flex h-full min-h-0 w-full flex-col'>
      <div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-dark-border bg-dark-bg p-4 shadow-custom-shadow'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3 rounded-xl bg-light-bg p-4 sm:flex-row'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={edit ? 'Update this todo...' : 'Add a new todo...'}
            className={fieldClass}
          />
          <div className='flex shrink-0 gap-2'>
            <button type='submit' disabled={saving} className={buttonClass.primary}>
              {edit ? (saving ? 'Updating...' : 'Update') : (saving ? 'Adding...' : '+ Add Todo')}
            </button>
            {edit && (
              <button type='button' onClick={() => { setEdit(null); setTitle(''); }} className={buttonClass.quiet}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className='scrollbar-custom mt-4 flex items-center gap-2 overflow-x-auto pb-1'>
          {filters.map((item) => {
            const count = item.id === "pending" ? pendingCount : item.id === "finished" ? finishedCount : todos.length;
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type='button'
                onClick={() => setFilter(item.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? 'border-cyan-200/50 bg-white/15 text-white'
                    : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
                <span className='ml-2 text-xs text-white/50'>{count}</span>
              </button>
            );
          })}
          <span className='mx-1 h-6 w-px shrink-0 bg-white/20' />
          <button type='button' onClick={handleMarkAllComplete} disabled={!pendingCount || bulk === 'complete'} className={`${todoButton.edit} shrink-0`}>
            {bulk === 'complete' ? 'Finishing...' : 'Mark all complete'}
          </button>
          <button type='button' onClick={() => setConfirmClear('finished')} disabled={!finishedCount || bulk === 'finished'} className={`${buttonClass.quiet} shrink-0`}>
            {bulk === 'finished' ? 'Clearing...' : 'Clear finished'}
          </button>
          <button type='button' onClick={() => setConfirmClear('all')} disabled={!todos.length || bulk === 'all'} className={`${todoButton.danger} shrink-0`}>
            {bulk === 'all' ? 'Clearing...' : 'Clear all'}
          </button>
        </div>

        {addState.error && <p className="mt-3 text-sm text-rose-300">Add Error: {addState.error.message}</p>}
        {updateState.error && <p className="mt-3 text-sm text-rose-300">Update Error: {updateState.error.message}</p>}
        {deleteState.error && <p className="mt-3 text-sm text-rose-300">Remove Error: {deleteState.error.message}</p>}
        {toggleState.error && <p className="mt-3 text-sm text-rose-300">Update Error: {toggleState.error.message}</p>}
        {error && <p className="mt-3 text-sm text-rose-300">{error.message}</p>}

        <ul className='scrollbar-custom mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1'>
          {waiting ? (
            <li className='space-y-2'>
              <div className='h-16 animate-pulse rounded-xl bg-white/5' />
              <div className='h-16 animate-pulse rounded-xl bg-white/5' />
              <p className='py-2 text-center text-sm text-white/60'>Loading todos...</p>
            </li>
          ) : visibleTodos.length === 0 ? (
            <li className='py-8 text-center text-sm italic text-white/60'>{emptyLabel}</li>
          ) : (
            visibleTodos.map((todo) => {
              const editing = edit?.id === todo.id;
              return (
                <li
                  key={todo.id}
                  className={`flex items-center gap-3 rounded-xl border bg-light-bg px-3 py-3 ${
                    editing ? 'border-cyan-200/60' : 'border-dark-border'
                  }`}
                >
                  <button
                    type='button'
                    onClick={() => handleToggle(todo)}
                    disabled={togglingId === todo.id}
                    aria-pressed={todo.completed}
                    aria-label={todo.completed ? 'Mark as pending' : 'Mark as finished'}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      todo.completed ? 'border-emerald-300 bg-emerald-400/25' : 'border-white/35 bg-transparent hover:border-white/70'
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${todo.completed ? 'bg-emerald-200' : 'bg-transparent'}`} />
                  </button>
                  <p className={`min-w-0 flex-1 break-words text-base ${todo.completed ? 'text-white/45 line-through' : 'text-white'}`}>
                    {todo.title}
                  </p>
                  <div className='flex shrink-0 gap-2'>
                    <button type='button' onClick={() => { setTitle(todo.title); setEdit(todo); }} disabled={editing} className={todoButton.edit}>
                      ✏️ Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => handleRemove(todo.id)}
                      disabled={removingId === todo.id}
                      className={todoButton.danger}
                    >
                      {removingId === todo.id ? 'Removing...' : '🗑️ Remove'}
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <Modal isOpen={confirmClear !== null} onClose={() => setConfirmClear(null)}>
        <h2 className="pr-8 text-xl font-semibold">
          {confirmClear === 'all' ? 'Clear all todos?' : 'Clear finished todos?'}
        </h2>
        <p className="mt-2 text-sm text-white/70">
          {confirmClear === 'all'
            ? todos.length === 1
              ? 'This removes 1 todo. It cannot be undone.'
              : `This removes all ${todos.length} todos. Pending and finished items are both deleted.`
            : `This removes ${finishedCount} finished ${finishedCount === 1 ? 'todo' : 'todos'}. Pending items stay.`}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => setConfirmClear(null)} className={buttonClass.quiet}>
            Cancel
          </button>
          <button
            type="button"
            disabled={bulk === 'finished' || bulk === 'all'}
            onClick={() => {
              const onlyFinished = confirmClear === 'finished';
              setConfirmClear(null);
              handleClear(onlyFinished);
            }}
            className={todoButton.danger}
          >
            {confirmClear === 'all' ? 'Clear all' : 'Clear finished'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
