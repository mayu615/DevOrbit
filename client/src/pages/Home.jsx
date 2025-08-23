// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useJobs } from "../hooks/useJobs";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useAuth();
  const { jobs = [], fetchJobs, loading, error } = useJobs();
  const navigate = useNavigate();

    // Local state for search inputs
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchJobs().catch((err) => console.error("Failed to fetch jobs:", err));
  }, []);

   const handleSearch = () => {
    const params = new URLSearchParams();
    if (title) params.append("title", title);
    if (category) params.append("category", category);
    if (location) params.append("location", location);

    navigate(`/jobs?${params.toString()}`); // ✅ redirect with query
  };

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[80vh] flex flex-col justify-center items-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-teal-300">
            Your Dream Job is Waiting
          </h1>
          <p className="text-lg md:text-xl mb-8">
            {user
              ? "Explore jobs tailored for you 🚀"
              : "Find your dream job or post one for talented developers!"}
          </p>

          {/* ✅ Search Bar */}
<div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between max-w-3xl mx-auto p-4">
  <input
    type="text"
    placeholder="Job Title, Skills..."
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="flex-1 px-4 py-2 border rounded-lg mb-2 md:mb-0 md:mr-2 
               text-gray-800 placeholder-gray-500"
  />
  <input
    type="text"
    placeholder="Category"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="flex-1 px-4 py-2 border rounded-lg mb-2 md:mb-0 md:mr-2 
               text-gray-800 placeholder-gray-500"
  />
  <input
    type="text"
    placeholder="Location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="flex-1 px-4 py-2 border rounded-lg mb-2 md:mb-0 md:mr-2 
               text-gray-800 placeholder-gray-500"
  />
  <button
    onClick={handleSearch}
    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition"
  >
    Search
  </button>
</div>

        </motion.div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: "Millions of Jobs", desc: "Explore countless job opportunities worldwide." },
            { title: "Easy To Manage", desc: "Track and manage your job applications easily." },
            { title: "Top Careers", desc: "Discover high-paying career opportunities." },
            { title: "Expert Candidates", desc: "Hire top talent with verified skills." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-bold text-green-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Job List Section */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Latest Jobs
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            Failed to load jobs. Please try again.
          </p>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                className="border rounded-2xl p-6 bg-white shadow hover:shadow-xl transition"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold text-green-700">
                  {job.title}
                </h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-400">{job.location}</p>
                <Link
                  to={`/jobs/${job._id}`}
                  className="inline-block mt-4 text-teal-600 font-semibold hover:underline"
                >
                  View Details →
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No jobs found.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
