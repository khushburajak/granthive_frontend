import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  {
    /**
     * Custom hook to use AuthContext.
     *
     * This hook uses React's `useContext` to retrieve the current value of
     * `AuthContext`, which typically includes the user's authentication state
     * and related functions (such as login, logout, and managing tokens).
     *
     * It simplifies accessing the authentication context in components by
     * avoiding the need to call `useContext(AuthContext)` directly in ea   ch one.
     *
     * @returns {object} The value of the `AuthContext`, which may include the
     * user's authentication state and associated methods.
     */
  }

  return useContext(AuthContext);
};

export default useAuth;
