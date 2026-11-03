"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS, ADD_TASK, DELETE_TASK, UPDATE_TASK } from "@/graphql/operations/taskOperations";
import Modal from "../components/Modal";
import Filters from "../components/Filters";
import StatusColumn from "../components/StatusColumn";
import { buttonClass, fieldClass } from "../components/ui";

const initialState = { title: "", description: "", status: "To Do", priority: "Low", assignee: "", dueDays: "" };
const priorityRank = { High: 0, Medium: 1, Low: 2 };

const taskInput = (task, overrides = {}) => ({
  title: task.title?.trim() ?? "",
  description: task.description ?? "",
  status: task.status,
  priority: task.priority,
  assignee: task.assignee ?? "",
  dueDays: task.dueDays ?? "",
  ...overrides,
});

export default function Tasks() {
  const [formState, setFormState] = useState(initialState);
  const [edit, setEdit] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [sortKey, setSortKey] = useState("");
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_TASKS);
  const [addTask, addState] = useMutation(ADD_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateTask, updateState] = useMutation(UPDATE_TASK);
  const saving = addState.loading || updateState.loading;

  const closeModal = () => {
    setIsOpen(false);
    setFormState(initialState);
    setEdit(null);
    setFormError("");
  };

  const openCreate = () => {
    setEdit(null);
    setFormState(initialState);
    setFormError("");
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const input = taskInput(formState);
    if (!input.title) {
      setFormError("Title is required.");
      return;
    }

    try {
      setFormError("");
      if (edit) {
        await updateTask({ variables: { id: edit.id, ...input } });
      } else {
        await addTask({ variables: input });
      }
      closeModal();
      refetch();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dueDays" && value !== "" && !/^\d+$/.test(value)) return;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (task) => {
    setEdit(task);
    setFormState(taskInput(task));
    setFormError("");
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setActionError("");
    try {
      await deleteTask({ variables: { id } });
      refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    const task = data?.getTasks?.find((item) => item.id === id);
    if (!task) return;
    setActionError("");
    try {
      await updateTask({ variables: { id, ...taskInput(task, { status }) } });
      refetch();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleFilterChange = (key, value) => setFilters({ ...filters, [key]: value });
  const handleSortChange = (value) => setSortKey(value);

  const applyFiltersAndSort = (tasks) => {
    let result = tasks;
    if (filters.status) result = result.filter((task) => task.status === filters.status);
    if (filters.priority) result = result.filter((task) => task.priority === filters.priority);
    if (sortKey === "priority") {
      result = [...result].sort(
        (a, b) => (priorityRank[a.priority] ?? 3) - (priorityRank[b.priority] ?? 3)
      );
    }
    if (sortKey === "dueDays") {
      const dueValue = (task) => {
        if (task.dueDays === "" || task.dueDays == null) return Number.POSITIVE_INFINITY;
        const value = Number(task.dueDays);
        return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
      };
      result = [...result].sort((a, b) => dueValue(a) - dueValue(b));
    }
    return result;
  };

  const loadedTasks = data?.getTasks;
  const visibleTasks = loadedTasks ? applyFiltersAndSort(loadedTasks) : [];
  const waiting = loading && !loadedTasks;
  const filtersActive = Boolean(filters.status || filters.priority);
  const emptyLabel = filtersActive && loadedTasks?.length
    ? "No tasks match these filters."
    : "No tasks yet. Add one to get started.";

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      {actionError && <p className="mb-4 text-sm text-rose-300">{actionError}</p>}
      <StatusColumn
        toolbar={
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            setIsOpen={openCreate}
          />
        }
        tasks={visibleTasks}
        loading={waiting}
        error={error}
        emptyLabel={emptyLabel}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        deletingId={deletingId}
      />

      <Modal isOpen={isOpen} onClose={closeModal}>
        <h2 className="mb-1 pr-8 text-xl font-semibold">{edit ? "Edit task" : "Add task"}</h2>
        <p className="mb-5 text-sm text-white/60">Title, status, and priority are required.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Title" name="title" value={formState.title} onChange={handleChange} className={fieldClass} />
          <input type="text" placeholder="Description" name="description" value={formState.description} onChange={handleChange} className={fieldClass} />
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="Due days"
            name="dueDays"
            value={formState.dueDays}
            onChange={handleChange}
            onWheel={(e) => e.currentTarget.blur()}
            className={fieldClass}
          />
          <select value={formState.priority} name="priority" onChange={handleChange} className={fieldClass}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select value={formState.status} name="status" onChange={handleChange} className={fieldClass}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <input type="text" placeholder="Assignee" name="assignee" value={formState.assignee} onChange={handleChange} className={fieldClass} />
          {formError && <p className="text-sm text-rose-300">{formError}</p>}
          <button type="submit" disabled={saving} className={buttonClass.primary}>
            {saving ? "Saving..." : edit ? "Update task" : "Add task"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
