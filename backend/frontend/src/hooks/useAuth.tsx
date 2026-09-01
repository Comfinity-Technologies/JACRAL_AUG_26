import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginApi,
  register as registerApi,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from "../api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("jacral_user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem("jacral_user");
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("jacral_access_token")
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
    }
  }, [token]);

  async function login(
    data: LoginRequest
  ): Promise<User> {
    setLoading(true);

    try {
      const response = await loginApi(data);

      localStorage.setItem(
        "jacral_access_token",
        response.access_token
      );

      localStorage.setItem(
        "jacral_user",
        JSON.stringify(response.user)
      );

      setToken(response.access_token);
      setUser(response.user);

      return response.user;
    } finally {
      setLoading(false);
    }
  }

  async function register(
    data: RegisterRequest
  ): Promise<User> {
    setLoading(true);

    try {
      const newUser = await registerApi(data);

      return newUser;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("jacral_access_token");
    localStorage.removeItem("jacral_user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(token && user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}