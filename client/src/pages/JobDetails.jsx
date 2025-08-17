import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Shared/Loader.jsx";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    async function fetchJob() {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 800)); // simulate delay
      // mock data
      setJob({
        id,
        title: "Frontend Developer",
        company: "TechCorp",
        location: "Remote",
        type: "Full-time",
        description:
          "We are looking for a skilled frontend developer with experience in React, Tailwind, and Vite.",
        requirements: [
          "Proficiency in JavaScript, HTML, CSS",
          "Experience with React.js and Tailwind CSS",
          "Understanding of REST APIs",
        ],
        postedAt: "2025-08-10",
      });
      setLoading(false);
    }
    fetchJob();
  }, [id]);

  if (loading) return <Loader />;

  if (!job) return <p>Job not found.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded-lg">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-slate-600">{job.company}</p>
      <p>{job.location}</p>
      <span className="inline-block mt-2 text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded">
        {job.type}
      </span>
      <p className="text-xs text-slate-500 mt-1">
        Posted on {new Date(job.postedAt).toLocaleDateString()}
      </p>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Job Description</h2>
        <p>{job.description}</p>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Requirements</h2>
        <ul className="list-disc list-inside">
          {job.requirements.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </div>

      <Link
        to="/jobs"
        className="inline-block mt-6 text-teal-600 hover:underline"
      >
        ← Back to Jobs
      </Link>
    </div>
  );
}
