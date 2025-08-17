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
        `${API_BASE_URL}/jobs?page=${pageNum}&limit=20` // live remotive proxy
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
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Available Jobs {jobs.length > 0 && <span>({jobs.length})</span>}
      </h1>

      {jobs.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id || job._id || job.url} job={job} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}
