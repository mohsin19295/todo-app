export default function Filters({ filters, onFilterChange, onSortChange, setIsOpen }) {
  const selectStyle =
    "px-4 py-2 rounded-lg bg-dark-bg text-white border border-dark-border shadow-sm outline-none hover:bg-dark-bg/90 cursor-pointer transition-all duration-150";

  return (
    <div className="flex flex-wrap gap-4 justify-between items-center mb-8 bg-light-bg p-4 rounded-xl border border-dark-border shadow">
        <button 
          onClick={() => setIsOpen(true)}
          className="text-md text-blue-400 px-4 py-2 rounded-lg bg-dark-bg hover:bg-light-bg border border-light-border shadow-sm outline-none cursor-pointer"
          >+ Add Task</button>
      <div className="flex flex-wrap gap-4 w-full md:w-auto">

        {/* Status Filter */}
        <select
          onChange={(e) => onFilterChange("status", e.target.value)}
          value={filters.status}
          className={selectStyle}
        >
          <option value="">All Status</option>
          <option value="To Do">🟢 To Do</option>
          <option value="In Progress">🟡 In Progress</option>
          <option value="Done">✅ Done</option>
        </select>

        {/* Priority Filter */}
        <select
          onChange={(e) => onFilterChange("priority", e.target.value)}
          value={filters.priority}
          className={selectStyle}
        >
          <option value="">All Priority</option>
          <option value="Low">🟢 Low</option>
          <option value="Medium">🟡 Medium</option>
          <option value="High">🔴 High</option>
        </select>

        {/* Sort */}
        <select
          onChange={(e) => onSortChange(e.target.value)}
          className={selectStyle}
        >
          <option value="">Sort By</option>
          <option value="priority">📌 Priority</option>
        </select>
      </div>
    </div>
  );
}
