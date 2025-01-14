import { createSlice } from "@reduxjs/toolkit";

// Define TypeScript interface for the state
interface UserState {
  userData: any | null; // Holds logged-in user data
  status: boolean; // true: logged in, false: logged out
  error: string | null; // Error messages
}

// Utility functions for localStorage interactions
const getUserDataFromStorage = (): any | null => {
  try {
    const rawData = localStorage.getItem("userData");
    return rawData && rawData !== "undefined" ? JSON.parse(rawData) : null;
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
    return null;
  }
};

const saveUserDataToStorage = (data: any) => {
  try {
    localStorage.setItem("userData", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving userData to localStorage:", error);
  }
};

const clearUserDataFromStorage = () => {
  try {
    localStorage.removeItem("userData");
  } catch (error) {
    console.error("Error clearing userData from localStorage:", error);
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
    login: (state, action) => {
      state.userData = action.payload; // Set the user data (replace with new user data)
      state.status = true; // Set status to logged in
      state.error = null; // Clear errors
      saveUserDataToStorage(action.payload); // Save to localStorage
    },
    logout: (state) => {
      state.userData = null; // Clear user data
      state.status = false; // Set status to logged out
      state.error = null; // Clear errors
      clearUserDataFromStorage(); // Remove from localStorage
    },
    setError: (state, action) => {
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
