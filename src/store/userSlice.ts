import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  uid: string;
  email: string | null;
  role: "user" | "admin";
  plan?: "free" | "paid" | "admin";
  courses?: string[] | null;
  signals?: boolean | null;
}

interface UserState {
  currentUser: User | null;
}

const initialState: UserState = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
    },

    clearUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;