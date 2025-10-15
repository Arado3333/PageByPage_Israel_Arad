import { BookDashed } from "lucide-react";

export default function ListItem({
  title,
  titleDir = "auto",
  meta,
  tag,
  onEdit,
  onOpen,
}) {
  return (
    <div className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-5 2xl:p-6 3xl:p-8 mb-3 2xl:mb-4 3xl:mb-6 flex items-center gap-3 2xl:gap-4 3xl:gap-6 hover:ring-1 hover:ring-[#D6B778] dark:hover:ring-indigo-400 cursor-pointer">
      <div
        className="h-8 w-8 2xl:h-10 2xl:w-10 3xl:h-12 3xl:w-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center"
        aria-hidden
      >
        <BookDashed className="w-6 h-6 text-slate-600 dark:text-slate-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div
          dir={titleDir}
          className="truncate font-medium text-slate-800 dark:text-slate-200 text-base lg:text-lg 2xl:text-xl 3xl:text-2xl mb-1 2xl:mb-2"
        >
          {title}
        </div>
        <div className="text-sm 2xl:text-base 3xl:text-lg text-slate-500 dark:text-slate-400 flex items-center gap-2 2xl:gap-3">
          <span>{meta}</span>
          {tag && (
            <span className="inline-flex items-center rounded-full px-2 py-1 2xl:px-3 2xl:py-1.5 3xl:px-4 3xl:py-2 text-sm 2xl:text-base 3xl:text-lg font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
              {tag}
            </span>
          )}
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 2xl:gap-3">
        <button
          onClick={onOpen}
          className="rounded-lg border border-slate-300 dark:border-slate-600 px-2 py-1 2xl:px-3 2xl:py-2 3xl:px-4 3xl:py-3 text-sm 2xl:text-base 3xl:text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
        >
          Open
        </button>
        <button
          onClick={onEdit}
          className="rounded-lg border border-slate-300 dark:border-slate-600 px-2 py-1 2xl:px-3 2xl:py-2 3xl:px-4 3xl:py-3 text-sm 2xl:text-base 3xl:text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
