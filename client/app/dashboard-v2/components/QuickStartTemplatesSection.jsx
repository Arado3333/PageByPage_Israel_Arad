"use client";

import { use } from "react";
import Card from "./shared/Card";

export default function QuickStartTemplatesSection({ templatesPromise }) {
  // Use the promise directly - errors will be handled by Suspense/Error Boundary
  const templates = use(templatesPromise);

  return (
    <div className="w-full">
      <Card title="Quick Start Templates" actionLabel="Browse all">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 2xl:gap-6 3xl:gap-8">
          {templates && templates.length > 0 ? (
            templates.map((template, i) => (
              <div
                key={typeof template === "string" ? template : template.id || i}
                className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 2xl:p-6 3xl:p-8 hover:ring-1 hover:ring-violet-400 cursor-pointer"
              >
                <div
                  className={`h-12 sm:h-16 lg:h-20 2xl:h-24 3xl:h-28 w-full rounded-lg mb-2 sm:mb-3 2xl:mb-4 3xl:mb-6 bg-gradient-to-r ${
                    [
                      "from-indigo-300 to-indigo-500",
                      "from-pink-300 to-rose-500",
                      "from-emerald-300 to-teal-500",
                      "from-violet-300 to-purple-500",
                    ][i % 4]
                  }`}
                />
                <div className="text-sm sm:text-base lg:text-lg 2xl:text-xl 3xl:text-2xl font-medium text-center">
                  {typeof template === "string"
                    ? template
                    : template.name || template.title}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-500 italic py-8">
              No templates available
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
