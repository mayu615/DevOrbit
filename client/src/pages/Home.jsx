import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useJobs } from "../hooks/useJobs";
import { Link } from "react-router-dom";
import Profile from "../pages/Profile";

const Home = () => {
  const { user } = useAuth();
  const { jobs = [], fetchJobs, loading, error } = useJobs();

  useEffect(() => {
    fetchJobs().catch(err => console.error("Failed to fetch jobs:", err));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          Welcome {user?.name || "Guest"} 👋
        </h1>
        <p className="text-gray-600">
          {user
            ? "Check your profile or explore the latest jobs!"
            : "Find your dream job or register to post jobs for talented developers!"}
        </p>
      </div>

      {/* Profile Section */}
      {user && (
        <div className="mb-8">
          <Profile />
        </div>
      )}

      {/* Job List Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Latest Jobs</h2>

        {loading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load jobs. Please try again.</p>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold">{job.title}</h3>
                <p className="text-gray-500">{job.company}</p>
                <p className="text-sm text-gray-400">{job.location}</p>
                <Link
                  to={`/jobs/${job._id}`}
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
