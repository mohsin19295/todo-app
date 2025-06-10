'use client';
import Link from 'next/link';

export default function Home() {
  return (
      <div className="border border-light-border bg-light-bg hover:bg-dark-bg shadow-custom-shadow w-[94%] max-w-[500px] h-auto p-6 rounded-xl backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 text-center space-y-6">
        <h1 className="text-2xl font-bold">Welcome to Your Productivity Hub</h1>
        <p className="text-sm opacity-80">
          Choose between quick Todos for simple tasks or dive into full-featured Task Management with priorities, statuses, and deadlines.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/todos"
            className="border border-dark-border bg-dark-bg hover:bg-btn-hover transition-all px-6 py-3 rounded-md text-white font-medium"
          >
            Go to Todos
          </Link>
          <Link
            href="/tasks"
            className="border border-dark-border bg-dark-bg hover:bg-btn-hover transition-all px-6 py-3 rounded-md text-white font-medium"
          >
            Go to Tasks
          </Link>
        </div>
      </div>
  );
}
