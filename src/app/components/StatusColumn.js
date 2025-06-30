// "use client";
import TaskCard from "./TaskCard";

export default function StatusColumn({ status, tasks, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="bg-dark-bg p-4 rounded-xl border border-dark-border h-full min-h-[200px]">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">{status}</h3>

      {tasks?.length ? (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))
      ) : (
        <div className="flex-1 flex justify-center">
          <p className="text-sm text-white/60 italic">No data available.</p>
        </div>
      )}
    </div>
  );
}
