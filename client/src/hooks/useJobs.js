import { useJobContext } from "../contexts/JobContext";

export const useJobs = () => {
  return useJobContext();
};
