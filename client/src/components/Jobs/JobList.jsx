import React from "react";
import { useJobs } from "../hooks/useJobs";
import JobCard from "./JobCard";

const JobList = () => {
  const { jobs, loading, error, loadMoreJobs } = useJobs();

  if (loading && jobs.length === 0) return <p>Loading jobs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job, index) => (
          <JobCard key={`${job._id}-${index}`} job={job} />
        ))}
      </div>
      {loading && <p>Loading more...</p>}
      <button
        onClick={loadMoreJobs}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Load More
      </button>
    </div>
  );
};

export default JobList;
