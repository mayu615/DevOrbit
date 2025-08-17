import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useJobs } from "../hooks/useJobs";
import { Link } from "react-router-dom";
import formatDate from "../utils/formatDate";

const Profile = () => {
  const { user } = useAuth();
  const { jobs } = useJobs();

  const filteredJobs = user?.role === "recruiter"
    ? jobs.filter((job) => job.postedBy === user?._id)
    : jobs.filter((job) => job.applicants?.includes(user?._id));

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* User Info Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Member Since:</strong> {formatDate(user?.createdAt)}</p>
      </div>

      {/* Jobs Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          {user?.role === "recruiter" ? "My Posted Jobs" : "My Applications"}
        </h2>
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-lg p-4 hover:shadow transition"
              >
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-500 mb-2">{job.company}</p>
                <p className="text-sm text-gray-400">
                  Posted on {formatDate(job.createdAt)}
                </p>
                <Link
                  to={`/jobs/${job._id}`}
                  className="text-blue-600 hover:underline mt-2 inline-block"
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

export default Profile;
