'use client';
import Link from 'next/link';
import { buttonClass } from './components/ui';

export default function Home() {
  return (
      <div className="mx-auto w-full max-w-lg space-y-6 rounded-xl border border-light-border bg-light-bg p-6 text-center shadow-custom-shadow backdrop-blur-sm">
        <h1 className="text-2xl font-bold">Welcome to Your Productivity Hub</h1>
        <p className="text-sm opacity-80">
          Choose between quick Todos for simple tasks or dive into full-featured Task Management with priorities, statuses, and deadlines.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/todos" className={buttonClass.primary}>
            Go to Todos
          </Link>
          <Link href="/tasks" className={buttonClass.quiet}>
            Go to Tasks
          </Link>
        </div>
      </div>
  );
}
