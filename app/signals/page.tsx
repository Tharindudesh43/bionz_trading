"use client";

import SignalCard from '@/components/AdminComponents/AdminSignalCard';
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/FirebaseClient"; // client Firestore
import type { SignalModel } from '@/types/signal_models';
export default function Signal() {

   const [signals, setSignals] = useState<SignalModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true; // Prevent state updates after unmount

  const loadSignals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signals`);
      const data = await res.json();
      if (isMounted) {
        setSignals(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  loadSignals();

  // Polling every 5 seconds
  const interval = setInterval(loadSignals, 5000);

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);



  return (
    // Updated container class:
    // 1. Removed min-h-screen so the container only takes up the necessary height.
    // 2. Added 'flex-col' to stack the cards vertically.
    // 3. Added 'gap-y-6' for vertical spacing between the cards.
    // 4. Added 'py-8' to ensure spacing at the top and bottom of the content.
   <div className="flex flex-col items-center bg-gray-50 p-4 py-8 gap-y-6 min-h-screen">
        {/* {signals.map((signal) => (
          <SignalCard signal={signal} key={signal.id} />
        ))} */}
    </div>
  );
}