"use client";
import { Plus, Target, TrendingUp } from "lucide-react";

export default function GoalHeader({ onNewTask }) {

  
  return (
    <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg">
            ✨ Goals & Progress
          </div>
          <h1 className="mt-2 text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-serif text-[#0F1A2E]">
            Track your writing milestones
          </h1>
          <p className="mt-1 text-base sm:text-lg 2xl:text-xl 3xl:text-2xl text-slate-600">
            Manage your daily tasks and achieve your writing goals
          </p>
          <div className="mt-4 sm:mt-5 2xl:mt-8 3xl:mt-10 flex flex-wrap items-center gap-2 sm:gap-3 2xl:gap-4 3xl:gap-6">
            <button
              className="hidden lg:flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-700 text-white px-3 sm:px-4 lg:px-5 2xl:px-6 3xl:px-8 py-2 lg:py-3 2xl:py-4 3xl:py-6 text-sm lg:text-base 2xl:text-lg 3xl:text-xl shadow-sm hover:opacity-90"
              onClick={onNewTask}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNewTask();
                }
              }}
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
