"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS, ADD_TASK, DELETE_TASK, UPDATE_TASK } from "@/graphql/operations/taskOperations";
import Modal from "../components/Modal";
import Filters from "../components/Filters";
import StatusColumn from "../components/StatusColumn";

const initialState = { title: "", description: "", status: "To Do", priority: "Low", assignee: "" };

export default function Tasks() {
  const [formState, setFormState] = useState(initialState);
  const [edit, setEdit] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [sortKey, setSortKey] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const variables = { ...formState };
    if (edit) variables.id = edit.id;
    try {
      await (edit ? updateTask({ variables }) : addTask({ variables }));
      setIsOpen(false);
      setFormState(initialState);
      setEdit(null);
      refetch();
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  const handleEdit = (task) => {
    setEdit(task);
    setFormState(task);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteTask({ variables: { id } });
    refetch();
  };

  const handleStatusChange = async (id, status) => {
    const task = data.getTasks.find((t) => t.id === id);
    await updateTask({ variables: { ...task, status } });
    refetch();
  };

  const handleFilterChange = (key, value) => setFilters({ ...filters, [key]: value });
  const handleSortChange = (value) => setSortKey(value);

  const applyFiltersAndSort = (tasks) => {
    let result = tasks;
    if (filters.status) result = result.filter((t) => t.status === filters.status);
    if (filters.priority) result = result.filter((t) => t.priority === filters.priority);
    if (sortKey) {
      result = [...result].sort((a, b) => {
        if (sortKey === "priority") return a.priority.localeCompare(b.priority);
        return 0;
      });
    }
    return result;
  };

  const groupedTasks = (data?.getTasks ? applyFiltersAndSort(data.getTasks) : []).reduce((acc, task) => {
    acc[task.status] = acc[task.status] || [];
    acc[task.status].push(task);
    return acc;
  }, {});

  return (
    <div className="p-6 w-full max-w-[1280px] mx-auto">
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsOpen(true)} className="text-sm text-blue-400 hover:text-blue-300">
          + Add Task
        </button>
      </div>

      <Filters filters={filters} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />

      <div className="mt-6">
          <StatusColumn
          status="Tasks"
          tasks={applyFiltersAndSort(data?.getTasks || [])}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          />
      </div>

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setFormState(initialState); setEdit(null); }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Title" value={formState.title} onChange={(e) => setFormState({ ...formState, title: e.target.value })} className="bg-dark-bg border border-dark-border px-4 py-2 rounded-md text-white" />
          <input type="text" placeholder="Description" value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} className="bg-dark-bg border border-dark-border px-4 py-2 rounded-md text-white" />
          <select value={formState.priority} onChange={(e) => setFormState({ ...formState, priority: e.target.value })} className="bg-dark-bg border border-dark-border px-4 py-2 rounded-md text-white">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select value={formState.status} onChange={(e) => setFormState({ ...formState, status: e.target.value })} className="bg-dark-bg border border-dark-border px-4 py-2 rounded-md text-white">
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <input type="text" placeholder="Assignee" value={formState.assignee} onChange={(e) => setFormState({ ...formState, assignee: e.target.value })} className="bg-dark-bg border border-dark-border px-4 py-2 rounded-md text-white" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-white">
            {edit ? "Update" : "Add Task"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
