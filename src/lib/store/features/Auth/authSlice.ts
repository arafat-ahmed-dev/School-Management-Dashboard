import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define TypeScript interface for the state
interface UserState {
  userData: any | null; // Holds logged-in user data
  status: boolean; // true: logged in, false: logged out
  error: string | null; // Error messages
}

// Utility functions for sessionstorage interactions
const getUserDataFromStorage = (): any | null => {
  try {
    const rawData = sessionStorage.getItem("userData");
    return rawData && rawData !== "undefined" ? JSON.parse(rawData) : null;
  } catch (error) {
    console.error("Error parsing userData from sessionstorage:", error);
    return null;
  }
};

const saveUserDataToStorage = (data: any) => {
  try {
    sessionStorage.setItem("userData", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving userData to sessionstorage:", error);
  }
};

const clearUserDataFromStorage = () => {
  try {
    sessionStorage.removeItem("userData");
  } catch (error) {
    console.error("Error clearing userData from sessionstorage:", error);
  }
};

// Get initial state
const initialState: UserState = {
  userData: typeof window !== "undefined" ? getUserDataFromStorage() : null, // Ensure this runs on client-side
  status: typeof window !== "undefined" ? !!getUserDataFromStorage() : false,
  error: null,
};

// Create slice
export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.userData = action.payload; // Set the user data
      state.status = true; // Set status to logged in
      state.error = null; // Clear errors
      saveUserDataToStorage(action.payload); // Save to sessionstorage
    },
    logout: (state) => {
      state.userData = null; // Clear user data
      state.status = false; // Set status to logged out
      state.error = null; // Clear errors
      clearUserDataFromStorage(); // Remove from sessionstorage
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload; // Set error message
    },
    clearError: (state) => {
      state.error = null; // Clear error message
    },
  },
});

// Export actions
export const { login, logout, setError, clearError } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
