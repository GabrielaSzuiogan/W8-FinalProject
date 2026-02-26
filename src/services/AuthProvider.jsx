import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "./supabase";
import { setUser } from "../store/authSlice";
import { fetchUserLibrary, clearLibrary } from "../store/userLibrarySlice";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  const handleUserLogin = useCallback(
    async (user) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      // upd user
      dispatch(
        setUser({
          user: user,
          role: profile?.role || "user",
        }),
      );

      // fetch lib data
      dispatch(fetchUserLibrary(user.id));
    },
    [dispatch],
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserLogin(session.user);
      }
    });

    // listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleUserLogin(session.user);
      } else {
        // logout cleanup
        dispatch(setUser({ user: null, role: "visitor" }));
        dispatch(clearLibrary());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, handleUserLogin]);

  return children;
}
