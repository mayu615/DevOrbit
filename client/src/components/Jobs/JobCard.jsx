import React from "react";

const JobCard = React.memo(({ job }) => {
  return (
    <div className="border p-4 rounded shadow bg-white">
      <div className="flex items-center gap-3">
        {job.logoUrl ? (
          <img
            src={job.logoUrl}
            alt={job.company}
            className="w-10 h-10 object-contain"
          />
        ) : null}
        <div>
          <h3 className="text-lg font-bold">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company}</p>
          <p className="text-sm">{job.location}</p>
        </div>
      </div>

      <p
        className="text-gray-700 text-sm mt-3 line-clamp-4"
        dangerouslySetInnerHTML={{
          __html: (job.description || "").substring(0, 200) + "...",
        }}
      />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs px-2 py-1 rounded bg-gray-100">
          {job.jobType || "Remote"}
        </span>
        {job.jobUrl && (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-sm hover:underline"
          >
            View ↗
          </a>
        )}
      </div>
    </div>
  );
});

export default JobCard;
