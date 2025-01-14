import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  items: string[];
}

const initialState: UserState = {
  items: [],
};

export const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    add: (state, action) => {
      // Magic
      // Immer will handle the mutation
      state.items.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { add } = userSlice.actions;

export default userSlice.reducer;
