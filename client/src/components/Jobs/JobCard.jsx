import React from "react";

const JobCard = React.memo(({ job }) => {
  return (
    <div
      className="
        group relative rounded-2xl p-[1px]
        bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600
        animate-gradient bg-[length:200%_200%]
        shadow-sm hover:shadow-xl transition-shadow duration-300
      "
    >
      {/* inner card */}
      <div
        className="
          bg-white rounded-2xl h-full p-4
          transition-transform duration-300 ease-out group-hover:-translate-y-1
        "
      >
        {/* header */}
        <div className="flex items-center gap-3">
          {job.logoUrl ? (
            <img
              src={job.logoUrl}
              alt={job.company || 'Company logo'}
              className="w-10 h-10 object-contain rounded-md ring-2 ring-emerald-100"
            />
          ) : null}

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500">{job.company}</p>
            <p className="text-xs text-slate-400">{job.location}</p>
          </div>
        </div>

        {/* description */}
        <p
          className="text-slate-700 text-sm mt-3 line-clamp-4"
          dangerouslySetInnerHTML={{
            __html: (job.description || '').substring(0, 200) + '...',
          }}
        />

        {/* footer */}
        <div className="mt-3 flex items-center justify-between">
          <span
            className="
              text-xs px-2 py-1 rounded-full
              bg-emerald-50 text-emerald-700 border border-emerald-200
              font-medium
            "
          >
            {job.jobType || 'Remote'}
          </span>

          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="
                text-sm font-medium
                text-emerald-600 hover:text-green-600
                transition-colors
              "
              aria-label="View job"
            >
              View ↗
            </a>
          )}
        </div>
      </div>

      {/* soft glow on hover */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          blur-[10px] bg-gradient-to-r from-emerald-400/40 via-green-400/40 to-emerald-500/40
        "
      />
    </div>
  );
});

export default JobCard;
