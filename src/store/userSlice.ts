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
  loading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  loading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.loading = false;
    },

    clearUser: (state) => {
      state.currentUser = null;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;