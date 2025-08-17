import React, { createContext, useState, useEffect, useContext } from "react";
import { getJobs } from "../services/jobApi"; 
import { useAuth } from "../hooks/useAuth";

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchJobs = async (pageNumber = 1) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getJobs(pageNumber, limit, token);

      if (pageNumber === 1) {
        setJobs(res || []);
      } else {
        setJobs((prev) => [...prev, ...(res || [])]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page, token]);

  const loadMoreJobs = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        error,
        fetchJobs,
        loadMoreJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobContext must be used within a JobProvider");
  }
  return context;
};
