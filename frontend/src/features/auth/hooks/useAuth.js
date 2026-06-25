import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthProvider not found");
  }

  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
      const data = await register({ username, email, password });

      setUser(data.user);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(data.user);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();

        if (data) {
          setUser(data.user);
        }
      } catch (err) {
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, []);

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};

// import { useContext } from "react";
// import { AuthContext } from "../auth.context";

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   console.log("CONTEXT =", context);

//   if (!context) {
//     throw new Error("AuthProvider not found");
//   }

//   return context;
// };
