import React from "react";
import { useJobs } from "../hooks/useJobs";
import JobCard from "./JobCard";

const JobList = () => {
  const { jobs, loading, error, loadMoreJobs } = useJobs();

  if (loading && jobs.length === 0)
    return <p className="text-slate-500">Loading jobs...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      {/* heading with gradient text */}
      <h1
        className="
          text-2xl sm:text-3xl font-bold mb-6
          bg-clip-text text-transparent
          bg-gradient-to-r from-green-700 to-teal-600
        "
      >
        Available Jobs {jobs.length > 0 && <span>({jobs.length})</span>}
      </h1>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.map((job, index) => (
          <JobCard key={`${job._id || job.id || index}-${index}`} job={job} />
        ))}
      </div>

      {/* load more */}
      <div className="flex items-center justify-center mt-8">
        <button
          onClick={loadMoreJobs}
          disabled={loading}
          className={`
            relative inline-flex items-center justify-center
            px-5 py-2.5 rounded-xl font-medium text-white
            bg-gradient-to-r from-green-600 to-teal-600
            hover:from-green-700 hover:to-teal-700
            transition-all duration-300 disabled:opacity-60
            shadow-md hover:shadow-xl
          `}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
};

export default JobList;
