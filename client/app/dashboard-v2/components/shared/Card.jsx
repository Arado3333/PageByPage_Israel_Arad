export default function Card({ title, actionLabel, children, className }) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-4 lg:p-5 xl:p-6 2xl:p-8 3xl:p-10 ${className}`}
    >
      <div className="mb-4 2xl:mb-6 3xl:mb-8 flex items-center justify-between">
        <h2 className="font-serif text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-[#0F1A2E]">
          {title}
        </h2>
        {actionLabel && (
          <button className="text-sm 2xl:text-base 3xl:text-lg text-[#0F1A2E] hover:opacity-80">
            {actionLabel} →
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
