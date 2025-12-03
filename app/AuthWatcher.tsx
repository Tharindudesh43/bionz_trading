"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/src/store/userSlice";

export default function AuthWatcher() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function checkSession() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      console.log("AuthWatcher - User session data:", data.loggedIn, data.user , data);
      if (data.loggedIn) {
        // This will now receive the filtered { uid, email } object
        dispatch(
          setUser({ role: data.role, ...data.user }));
      } else {
        dispatch(clearUser());
      }
    }

    checkSession();
  }, []); // Runs once on client mount

  return null;
}