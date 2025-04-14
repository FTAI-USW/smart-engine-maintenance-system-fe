
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { getCurrentUser, getUserById, setCurrentUser } from "@/lib/storage";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  error: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage on component mount
    try {
      const userId = getCurrentUser();
      if (userId) {
        const user = getUserById(userId);
        if (user) {
          setUser(user);
        }
      }
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Failed to load user information");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userId: string) => {
    try {
      const user = getUserById(userId);
      if (user) {
        setCurrentUser(userId);
        setUser(user);
        setError(null);
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Failed to login");
    }
  };

  const logout = () => {
    setCurrentUser("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
