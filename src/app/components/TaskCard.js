export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
    return (
        <div className="bg-light-bg p-5 rounded-xl text-white mb-5 shadow-lg border border-dark-border transition-all hover:shadow-xl">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-xl text-white">{task.title}</h4>
                <span className={`text-xs font-medium px-3 py-1 rounded-full border border-dark-border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>

            {task.description && (
                <p className="text-sm text-white/80 mb-4 italic">{task.description}</p>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                  {task.dueDays && (
                    <div className="inline-flex items-center gap-2 text-xs text-white/70 bg-dark-bg border border-dark-border px-3 py-1 rounded">
                        <span>⏰</span>
                        <span>{task.dueDays} day{task.dueDays > 1 ? "s" : ""} left</span>
                    </div>
                )}

                <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                    className="text-sm border border-dark-border rounded px-4 py-1 text-white outline-none cursor-pointer"
                >
                    <option value="To Do">🟢 To Do</option>
                    <option value="In Progress">🟡 In Progress</option>
                    <option value="Done">✅ Done</option>
                </select>
              </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-sm text-red-400 hover:text-red-300 cursor-pointer"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
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