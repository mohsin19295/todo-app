import TaskCard from "./TaskCard";

export default function StatusColumn({
  toolbar,
  tasks,
  loading,
  error,
  emptyLabel,
  onEdit,
  onDelete,
  onStatusChange,
  deletingId,
}) {
  return (
    <div className="rounded-xl border border-dark-border bg-dark-bg p-4">
      {toolbar}
      <div className="scrollbar-custom mt-4 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/5" />
            <div className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/5" />
            <p className="py-2 text-center text-sm text-white/60 lg:col-span-2">Loading tasks...</p>
          </div>
        ) : error ? (
          <p className="py-8 text-center text-sm text-rose-300">{error.message}</p>
        ) : tasks.length ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                deleting={deletingId === task.id}
              />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm italic text-white/60">{emptyLabel}</p>
        )}
      </div>
    </div>
  );
}
