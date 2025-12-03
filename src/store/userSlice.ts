import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  uid: string;
  email: string | null;
  role: "user" | "admin";
  plan?: "free" | "paid";
  courses?: string[];
  signals?: boolean;
}

interface UserState {
  currentUser: User | null;
  currentpage: string;
}

const initialState: UserState = {
  currentUser: null,
  currentpage: "other",
};



export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.currentpage = action.payload ? "dashboard" : "other";
    },

    clearUser: (state) => {
      state.currentUser = null;
      state.currentpage = "other";
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      
      state.currentpage = action.payload;   
      console.log("Current page set to:", state.currentpage);
    },

  },
});

export const { setUser, clearUser, setCurrentPage } = userSlice.actions;
export default userSlice.reducer;