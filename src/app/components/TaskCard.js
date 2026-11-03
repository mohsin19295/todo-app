import { buttonClass, statusDot } from "./ui";

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, deleting }) {
  const daysLeft = Number(task.dueDays);

  return (
    <article className="flex h-full min-w-0 flex-col rounded-xl border border-dark-border bg-light-bg p-4 text-white shadow-lg">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h4 className="min-w-0 flex-1 break-words text-lg font-bold">{task.title}</h4>
        <span className={`inline-flex shrink-0 items-center overflow-hidden rounded-full border border-dark-border px-2.5 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 break-words text-sm italic text-white/80">{task.description}</p>
      )}

      {(task.assignee || task.dueDays) && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-white/70">
          {task.assignee && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/30 bg-sky-400/15 px-3 py-1 text-sky-100">
              <span aria-hidden>👤</span>
              {task.assignee}
            </span>
          )}
          {task.dueDays && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/15 px-3 py-1 text-amber-100">
              <span aria-hidden>⏰</span>
              {task.dueDays} day{daysLeft === 1 ? "" : "s"} left
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex w-fit items-center gap-2 rounded-lg border border-dark-border bg-dark-bg py-1 pr-1 pl-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot[task.status] || "bg-white/50"}`} />
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            style={{ width: `${task.status.length + 3}ch` }}
            className="cursor-pointer bg-transparent text-sm text-white outline-none"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </label>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onEdit(task)} className={buttonClass.edit}>
            ✏️ Edit
          </button>
          <button type="button" onClick={() => onDelete(task.id)} disabled={deleting} className={buttonClass.danger}>
            {deleting ? "Deleting..." : "🗑️ Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

function getPriorityColor(priority) {
  switch (priority) {
    case "High":
      return "bg-red-600/30 text-red-300";
    case "Medium":
      return "bg-yellow-600/30 text-yellow-300";
    case "Low":
      return "bg-green-600/30 text-green-300";
    default:
      return "bg-gray-600/30 text-gray-300";
  }
}
