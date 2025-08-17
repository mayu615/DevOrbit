import { useAuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useAuthContext(); // keep the whole context

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
