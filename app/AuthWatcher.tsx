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

      console.log("AuthWatcher -> Session data:", data.loggedIn );
      console.log("AuthWatcher -> User Data:", data.user );
      if (data.loggedIn) {
        // This will now receive the filtered { uid, email } object
        dispatch(
          setUser({ role: data.role, ...data.user }));
      } else {
        dispatch(clearUser());
      }
    }

    checkSession();
  }, []); 

  return null;
}