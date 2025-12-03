"use client";

import { useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";



export default function Home() {


  const user = useSelector((state: RootState) => state.user.currentUser);

  // useEffect(() => {
  //   console.log("Current User:", user);
  // }, [user]);

  return (
<>
<div className="min-h-screen">
 {
  user ? (
    <main className="relative z-10 text-black-50">
      USER LOGGED {
        user.role === "admin" ? "AS ADMIN" : "AS USER"
      }
    </main>
  ) : (
    <main className="relative z-10 text-black-50">
      USER NOT LOGGED
    </main>
  )
 }
 
</div>

</>
  );
}
