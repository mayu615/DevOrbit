import React, { useEffect, useState } from "react";
import JobCard from "../components/Jobs/JobCard.jsx";
import Loader from "../components/Shared/Loader.jsx";
import { API_BASE_URL } from "../constants";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function fetchJobs(pageNum = 1) {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/jobs?page=${pageNum}&limit=20`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();

      if (Array.isArray(data.jobs)) {
        if (pageNum === 1) {
          setJobs(data.jobs);
        } else {
          setJobs((prev) => [...prev, ...data.jobs]);
        }
        setHasMore(pageNum < (data.pages || 1));
      } else {
        setJobs([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage);
  };

  if (loading && jobs.length === 0) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-teal-700">
        Available Jobs{" "}
        {jobs.length > 0 && (
          <span className="text-gray-500 text-lg">({jobs.length})</span>
        )}
      </h1>

      {jobs.length > 0 ? (
        <>
          {/* Job Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id || job._id || job.url} job={job} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500">No jobs found.</p>
      )}
    </div>
  );
}
