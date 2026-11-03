import { buttonClass, selectClass } from "./ui";

export default function Filters({ filters, onFilterChange, onSortChange, setIsOpen }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dark-border bg-light-bg p-4">
      <button type="button" onClick={() => setIsOpen(true)} className={buttonClass.primary}>
        + Add Task
      </button>
      <div className="flex w-full flex-wrap gap-3 md:w-auto">
        <select
          onChange={(e) => onFilterChange("status", e.target.value)}
          value={filters.status}
          className={selectClass}
        >
          <option value="">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select
          onChange={(e) => onFilterChange("priority", e.target.value)}
          value={filters.priority}
          className={selectClass}
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select onChange={(e) => onSortChange(e.target.value)} className={selectClass}>
          <option value="">Sort By</option>
          <option value="priority">📌 Priority</option>
          <option value="dueDays">⏰ Due days</option>
        </select>
      </div>
    </div>
  );
}
