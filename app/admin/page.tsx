// "use client";
// import { GitBranchIcon, PlusIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { SetStateAction, useEffect, useState } from "react";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Slider } from "@/components/ui/slider";
// import { Input } from "@/components/ui/input";
// import SignalCard from "@/components/AdminComponents/AdminSignalCard";
// import axios from "axios";
// import type { SignalModel } from "@/types/signal_models";
// import { sign } from "crypto";
// import { Timestamp } from "firebase-admin/firestore";
// import { stat } from "fs";
// import AdminNavBar from "@/components/AdminComponents/AdminNavBar";
// import PageTabs from "@/components/AdminComponents/AdminNavBar";
// import SignalFilter from "@/components/signalFilter";
// import AdminAnalyzeCard from "@/components/AdminComponents/AdminAnlyzeCard";
// import { AnalyzeModel } from "@/types/analyze_model";
// import AdminAnalyzeRow from "@/components/AdminComponents/AdminAnlyzeCard";

// export default function Admin() {
//   const [activePage, setActivePage] = useState("Analyze");

  // const [signalid, setSignalId] = useState<string>("");
  // const [type, setType] = useState<"spot" | "futures">("spot");
  // const [side, setSide] = useState<"buy" | "sell">("buy");
  // const [leverage, setLeverage] = useState<number>(1);
  // const [pair, setPair] = useState("");
  // const [entryPrice, setEntryPrice] = useState<number>(0);
  // const [exitPrice, setExitPrice] = useState<number>(0);
  // const [stopLoss, setStopLoss] = useState<number>(0);
  // const [loading, setLoading] = useState(false);
  // const [open, setOpen] = useState(false);
  // const [edited, setEdited] = useState(false);
  // const [editedAt, setEditedAt] = useState<string>("");
  // const [createdAt, setCreatedAt] = useState<string | Timestamp>("");
  // const [win_count, setWinCount] = useState<number>(0);
  // const [loss_count, setLossCount] = useState<number>(0);
  // const [status, setStatus] = useState<string>("");
  // const [editingEnabled, setEditingEnabled] = useState(false);
  // const [pageloading, setPageLoading] = useState(false);
  // const [activateEnable, setActivateEnable] = useState<boolean>(false);

  // const [signals, setSignals] = useState<SignalModel[]>([]);
//   const [analyzes, setAnalyzes] = useState<AnalyzeModel[]>([]);

  // const handleAddSignal = async () => {
  //   setLoading(true);
  //   const Data: SignalModel = {
  //     type,
  //     side,
  //     pair,
  //     leverage,
  //     entryPrice,
  //     exitPrice,
  //     stopLoss,
  //     signal_id: crypto.randomUUID(),
  //     edited: false,
  //     editedAt: new Date().toISOString(),
  //     createdAt: new Date().toISOString(),
  //     win_count: 0,
  //     loss_count: 0,
  //     status: "Active",
  //   };
  //   try {
  //     const response = await fetch("/api/admin/addsignal", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ data: Data }),
  //     });

  //     if (response.ok) {
  //       console.log("Signal added successfully");
  //     }

  //     setType("spot");
  //     setSide("buy");
  //     setPair("");
  //     setEntryPrice(0);
  //     setExitPrice(0);
  //     setStopLoss(0);
  //     setLoading(false);
  //     setOpen(false);

  //     setPageLoading(!pageloading);
  //   } catch (error) {
  //     console.error("Error adding signal:", error);
  //     setLoading(false);
  //     setPageLoading(!pageloading);
  //   }
  // };

  // const fetchSignals = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signals`
  //     );
  //     const data = res.data;
  //     setSignals(data.data);
  //     console.log("Fetched signals:", data.data);
  //   } catch (err) {
  //     setLoading(false);
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchanalyze = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/getAnalyzeBydate`
  //     );
  //     const data = res.data;
  //     setAnalyzes(data.data);
  //     console.log("Fetched analyze:", data.data);
  //   } catch (err) {
  //     setLoading(false);
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (activePage == "signal") {
  //     fetchSignals();
  //   } else if (activePage == "Analyze") {
  //     fetchanalyze();
  //   }
  // }, [pageloading]);

  // function openEditModal(signal: SignalModel) {
  //   setOpen(true);
  //   setSignalId(signal.signal_id);
  //   setEditingEnabled(true);
  //   setEntryPrice(signal.entryPrice);
  //   setExitPrice(signal.exitPrice);
  //   setStopLoss(signal.stopLoss);
  //   setType(signal.type);
  //   setSide(signal.side);
  //   setPair(signal.pair);
  //   setLeverage(signal.leverage);
  //   setCreatedAt(signal.createdAt);
  //   setWinCount(signal.win_count || 0);
  //   setLossCount(signal.loss_count || 0);
  //   setEdited(true);
  //   setEditedAt(new Date().toISOString());
  // }

  // async function handleEdit() {
  //   setLoading(true);
  //   const Data: SignalModel = {
  //     type,
  //     side,
  //     pair,
  //     leverage,
  //     entryPrice,
  //     exitPrice,
  //     stopLoss,
  //     signal_id: signalid,
  //     edited: true,
  //     editedAt: new Date().toISOString(),
  //     createdAt: createdAt,
  //     win_count: win_count,
  //     loss_count: loss_count,
  //     status: "Active",
  //   };
  //   try {
  //     const response = await axios("/api/admin/editsignal", {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       data: { data: Data },
  //     });

  //     if (response.status === 200) {
  //       console.log("Signal Edited successfully");
  //     }

  //     setType("spot");
  //     setSide("buy");
  //     setPair("");
  //     setLeverage(1);
  //     setEntryPrice(0);
  //     setExitPrice(0);
  //     setStopLoss(0);
  //     setEdited(false);
  //     setEditingEnabled(false);
  //     setEditedAt("");
  //     setLoading(false);
  //     setOpen(false);

  //     setPageLoading(!pageloading);
  //   } catch (error) {
  //     console.error("Error adding signal:", error);
  //     setLoading(false);
  //     setPageLoading(!pageloading);
  //   }
  // }

//   function ClearFormData() {
//     setType("spot");
//     setSide("buy");
//     setPair("");
//     setLeverage(1);
//     setEntryPrice(0);
//     setExitPrice(0);
//     setStopLoss(0);
//   }

  // function StatusModel(signal: SignalModel) {
  //   setStatus(signal.status?.toString() || "");
  //   setSignalId(signal.signal_id);
  //   setActivateEnable(true);
  //   console.log("Current Status:", signalid, status);
  // }

  // async function ChangeStatus() {
  //   setLoading(true);

  //   const Data = {
  //     signal_id: signalid,
  //     status: status,
  //   };

  //   try {
  //     const response = await axios.patch(
  //       "/api/admin/changesignalstatus",
  //       Data,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       console.log("Status updated:", response.data.message);
  //     } else {
  //       console.error("Error:", response.data.message);
  //     }

  //     setStatus("");
  //     setLoading(false);
  //     setPageLoading(!pageloading);
  //     setActivateEnable(false);
  //   } catch (error) {
  //     console.error("Error changing status:", error);
  //     setLoading(false);
  //     setActivateEnable(false);
  //     setPageLoading(!pageloading);
  //   }
  // }

//   async function loadSignalsByDate(date: string) {
//     if (!date) return;

//     const res = await fetch(`/api/admin/getSignalsByDate?date=${date}`);
//     const data = await res.json();

//     setSignals(data);
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <AdminNavBar onPageChange={(pageId) => setActivePage(pageId)} />

//       {/* Secondary Navigation below top nav */}
//       <div className=" pt-35 px-6">
//         {/* Home Page Content */}
//         {activePage === "home" && (
//           <div>
//             <h2 className="text-2xl font-semibold text-gray-800">Home</h2>
//             <p className="mt-2 text-gray-700">
//               Welcome to the admin dashboard. This is the home page where you
//               can view an overview of your system.
//             </p>
//           </div>
//         )}

      //   {activePage === "signal" && (
      //     <div className="relative">
      //       {/* Top-right button */}
      //       <div className="absolute top-0 right-0">
      //         {/* {
      //   signals.length > 0 &&(
      //     <SignalFilter onFilter={loadSignalsByDate} />
      //   )
      // } */}
      //         <Button
      //           className="bg-blue-900 cursor-pointer text-white hover:bg-blue-400 transition rounded-b-md"
      //           onClick={() => setOpen(true)}
      //         >
      //           <PlusIcon />
      //           Add Signal
      //         </Button>
      //       </div>

      //       {/* Main Content */}
      //       <div className="flex flex-col items-center p-4 py-8 gap-y-6 min-h-screen">
      //         {/* 🟦 Loading state */}
      //         {loading && (
      //           <div className="text-gray-600 text-lg animate-pulse">
      //             Loading signals...
      //           </div>
      //         )}

      //         {/* 🟨 No data found */}
      //         {!loading && signals.length === 0 && (
      //           <div className="text-gray-500 text-lg">
      //             No signals available. Click{" "}
      //             <span className="font-semibold">"Add Signal"</span> to create
      //             one.
      //           </div>
      //         )}

      //         {/* 🟩 Render all signals */}
      //         {!loading &&
      //           signals.length > 0 &&
      //           signals.map((signal: SignalModel, index) => (
      //             <SignalCard
      //               onActivity={() => {
      //                 StatusModel(signal);
      //               }}
      //               onEdit={() => openEditModal(signal)}
      //               signal={signal}
      //               key={index}
      //             />
      //           ))}
      //       </div>
      //     </div>
      //   )}

        // {open && (
        //   <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        //     <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        //       {editingEnabled ? (
        //         <h2 className="text-xl font-semibold mb-5">Edit Signal</h2>
        //       ) : (
        //         <h2 className="text-xl font-semibold mb-5">Add Signal</h2>
        //       )}

        //       {/* Type */}
        //       <div className="mb-4">
        //         <label className="font-medium text-gray-700 block mb-1">
        //           Type
        //         </label>
        //         <RadioGroup
        //           value={type}
        //           onValueChange={(val: string) =>
        //             setType(val as "spot" | "futures")
        //           }
        //           className="flex gap-4 "
        //         >
        //           <div className="flex items-center gap-2">
        //             <RadioGroupItem
        //               value="spot"
        //               id="spot"
        //               className="cursor-pointer"
        //             />
        //             <label htmlFor="spot">Spot</label>
        //           </div>
        //           <div className="flex items-center gap-2">
        //             <RadioGroupItem
        //               value="futures"
        //               id="futures"
        //               className="cursor-pointer"
        //             />
        //             <label htmlFor="futures">Futures</label>
        //           </div>
        //         </RadioGroup>
        //       </div>

        //       {/* Pair */}
        //       <div className="mb-4">
        //         <label className="font-medium text-gray-700 block mb-1">
        //           Pair (e.g., XRP/USD)
        //         </label>
        //         <Input
        //           value={pair}
        //           onChange={(e) => setPair(e.target.value)}
        //           placeholder="Enter pair"
        //         />
        //       </div>

        //       {/* Mode */}
        //       <div className="mb-4">
        //         <label className="font-medium text-gray-700 block mb-1">
        //           Mode
        //         </label>
        //         <div className="flex gap-4">
        //           <Button
        //             variant={side === "buy" ? "default" : "outline"}
        //             className={`text-black cursor-pointer hover:bg-green-600 ${
        //               side === "buy" ? "bg-green-500 text-white" : ""
        //             }`}
        //             onClick={() => setSide("buy")}
        //           >
        //             Buy
        //           </Button>
        //           <Button
        //             variant={side === "sell" ? "default" : "outline"}
        //             className={` cursor-pointer text-black hover:bg-red-600 ${
        //               side === "sell" ? "bg-red-500 text-white" : ""
        //             }`}
        //             onClick={() => setSide("sell")}
        //           >
        //             Sell
        //           </Button>
        //         </div>
        //       </div>

        //       {/* Leverage */}
        //       <div className="mb-4">
        //         <label className="font-medium text-gray-700 block mb-2">
        //           Leverage: {leverage}x
        //         </label>
        //         <Slider
        //           className="cursor-pointer"
        //           value={[leverage]}
        //           max={300}
        //           min={1}
        //           step={1}
        //           onValueChange={(val: number[]) => setLeverage(val[0])}
        //         />
        //       </div>

        //       {/* Prices */}
        //       <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        //         <div>
        //           <label className="font-medium text-gray-700 block mb-1">
        //             Entry Price
        //           </label>
        //           <Input
        //             type="number"
        //             value={entryPrice}
        //             onChange={(e) => setEntryPrice(Number(e.target.value))}
        //           />
        //         </div>
        //         <div>
        //           <label className="font-medium text-gray-700 block mb-1">
        //             Exit Price
        //           </label>
        //           <Input
        //             type="number"
        //             value={exitPrice}
        //             onChange={(e) => setExitPrice(Number(e.target.value))}
        //           />
        //         </div>
        //         <div>
        //           <label className="font-medium text-gray-700 block mb-1">
        //             Stop Loss
        //           </label>
        //           <Input
        //             type="number"
        //             value={stopLoss}
        //             onChange={(e) => setStopLoss(Number(e.target.value))}
        //           />
        //         </div>
        //       </div>

        //       {/* Actions */}
        //       <div className="flex justify-end gap-2">
        //         <Button
        //           onClick={() => {
        //             ClearFormData();
        //             setEditingEnabled(false);
        //             setOpen(false);
        //           }}
        //           disabled={loading}
        //           className="cursor-pointer"
        //         >
        //           Cancel
        //         </Button>
        //         {editingEnabled ? (
        //           <>
        //             <Button
        //               onClick={handleEdit}
        //               disabled={loading}
        //               className="cursor-pointer"
        //             >
        //               {loading ? "Editing..." : "Edit Signal"}
        //             </Button>
        //           </>
        //         ) : (
        //           <>
        //             <Button
        //               onClick={handleAddSignal}
        //               disabled={loading}
        //               className="cursor-pointer"
        //             >
        //               {loading ? "Adding..." : "Create Signal"}
        //             </Button>
        //           </>
        //         )}
        //       </div>
        //     </div>
        //   </div>
        // )}

//         {activateEnable && (
          // <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          //   <div className="bg-white rounded-lg p-6 w-72 shadow-lg flex flex-col gap-4">
          //     <h2 className="text-lg font-bold text-gray-800">
          //       Do you want to change the status?
          //     </h2>

          //     <div className="flex items-center justify-between">
          //       {/* Toggle Switch */}
          //       <div className="flex flex-col gap-3">
          //         {/* Active */}
          //         <label className="flex items-center gap-2 cursor-pointer">
          //           <input
          //             type="radio"
          //             name="status"
          //             value="Active"
          //             checked={status === "Active" ? true : false}
          //             onChange={() => setStatus("Active")}
          //             className="w-4 h-4 cursor-pointer"
          //           />
          //           <span className="text-sm">Active</span>
          //         </label>

          //         {/* Inactive */}
          //         <label className="flex items-center gap-2 cursor-pointer">
          //           <input
          //             type="radio"
          //             name="status"
          //             value="Inactive"
          //             checked={status === "Inactive" ? true : false}
          //             onChange={() => setStatus("Inactive")}
          //             className="w-4 h-4 cursor-pointer"
          //           />
          //           <span className="text-sm">Inactive</span>
          //         </label>
          //       </div>
          //     </div>
          //     <div className="flex justify-end gap-3">
          //       <Button
          //         variant="outline"
          //         onClick={() => {
          //           setStatus("");
          //           setActivateEnable(false);
          //         }}
          //         disabled={loading}
          //         className="cursor-pointer"
          //       >
          //         Cancel
          //       </Button>
          //       <Button
          //         onClick={ChangeStatus}
          //         disabled={loading}
          //         className={`cursor-pointer text-amber-300 bg-blue-800`}
          //       >
          //         Change
          //       </Button>
          //     </div>
          //   </div>
          // </div>
//         )}

//         {activePage === "profile" && (
//           <div>
//             <h2 className="text-2xl font-semibold text-gray-800">
//               Profile Settings
//             </h2>
//             <p className="mt-2 text-gray-700">
//               Update your profile and settings.
//             </p>

//             <form className="mt-4 bg-white p-6 rounded shadow-md w-full max-w-md">
//               <label className="font-medium text-gray-700">Username</label>
//               <input
//                 type="text"
//                 className="w-full mt-1 px-3 py-2 border rounded mb-4"
//               />

//               <label className="font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 className="w-full mt-1 px-3 py-2 border rounded mb-4"
//               />

//               <button
//                 type="submit"
//                 className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
//               >
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         )}
// {activePage === "Analyze" && (
//   <>
//     {/* Header Button */}
//     <div className="w-full p-4 flex justify-end">
//       <Button
//         className="bg-blue-900 cursor-pointer text-white hover:bg-blue-400 transition rounded-md flex items-center gap-2"
//         onClick={() => {}}
//       >
//         <PlusIcon />
//         Add Analyze
//       </Button>
//     </div>

//     {/* Main Content */}
//     <div className="flex flex-col items-center p-4 py-8 gap-y-6 min-h-screen">
//       {loading && (
//         <div className="text-gray-600 text-lg animate-pulse">
//           Loading analyzes...
//         </div>
//       )}

//       {!loading && analyzes.length === 0 && (
//         <div className="text-gray-500 text-lg">
//           No analyzes available. Click{" "}
//           <span className="font-semibold">"Add Analyze"</span> to create one.
//         </div>
//       )}

//       {!loading && analyzes.length > 0 && (
//        <div className="w-full overflow-x-auto">
//   <div className="max-h-[600px] overflow-y-auto border rounded-md">
//     <table className="w-full border-collapse">
//       <thead className="bg-gray-200 sticky top-0 z-10">
//         <tr>
//           <th className="px-4 py-3">Pair</th>
//           <th className="px-4 py-3">Type</th>
//           <th className="px-4 py-3">Preview</th>
//           <th className="px-4 py-3">Time Ago</th>
//           <th className="px-4 py-3">Created Date</th>
//           <th className="px-4 py-3">Info</th>
//           <th className="px-4 py-3">Actions</th>
//         </tr>
//       </thead>

//       <tbody>
//         {analyzes.map((item) => (
//           <AdminAnalyzeRow key={item.analyze_id} {...item} />
//         ))}
//       </tbody>
//     </table>
//   </div>
// </div>

//       )}
//     </div>
//   </>
// )}
//       </div>
//     </div>
//   );
// }
export default function AdminHome() {
  return (
    <div className="text-2xl font-semibold">
      Welcome to Admin Dashboard
    </div>
  );
}
