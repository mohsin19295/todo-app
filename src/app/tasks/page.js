"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS, ADD_TASK, DELETE_TASK, UPDATE_TASK } from "@/graphql/operations/taskOperations";
import Modal from "../components/Modal";
import Filters from "../components/Filters";
import StatusColumn from "../components/StatusColumn";

const initialState = { title: "", description: "", status: "To Do", priority: "Low", assignee: "", dueDays: "" };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  return (
    <div className="p-6 w-full max-w-[1280px] mx-auto">
    <Filters filters={filters} onFilterChange={handleFilterChange} onSortChange={handleSortChange} setIsOpen={setIsOpen} />
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <input type="text" placeholder="Title" name="title" value={formState.title} onChange={handleChange} className="bg-dark-bg border border-black/50 px-4 py-2 rounded-md text-black outline-none focus:ring-1 focus:ring-black/40 shadow-sm" />
          <input type="text" placeholder="Description" name="description" value={formState.description} onChange={handleChange} className="bg-dark-bg border border-black/50 px-4 py-2 rounded-md text-black outline-none focus:ring-1 focus:ring-black/40 shadow-sm" />
          <input type="text" placeholder="Due days" name="dueDays" value={formState.dueDays} onChange={handleChange} className="bg-dark-bg border border-black/50 px-4 py-2 rounded-md text-black outline-none focus:ring-1 focus:ring-black/40 shadow-sm" />
          <select value={formState.priority} name="priority" onChange={handleChange} className="bg-dark-bg border border-black/50 px-4 py-2 rounded-md text-black outline-none focus:ring-1 focus:ring-black/40 shadow-sm">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select value={formState.status} name="status" onChange={handleChange} className="bg-dark-bg border border-black/50 px-4 py-2 rounded-md text-black outline-none focus:ring-1 focus:ring-black/40 shadow-sm">
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <input type="text" placeholder="Assignee" name="assignee" value={formState.assignee} onChange={handleChange} className="bg-dark-bg border border-black/50 px-4 py-2 rounded-md text-black outline-none focus:ring-1 focus:ring-black/40 shadow-sm" />
          <button type="submit" className="bg-gradient-to-br from-[#203a43] via-[#0f2027] to-[#2c5364] hover:from-[#2c5364] hover:via-[#0f2027] hover:to-[#203a43] px-4 py-2 rounded-md text-blue-600 outline-none shadow-sm cursor-pointer">
            {edit ? "Update" : "Add Task"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
