import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./features/Auth/authSlice";
import darkModeReducer from "./features/DarkMode/darkModeSlice"; // Import the dark mode reducer

// store variable is a global variable.
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: AuthSlice,
      darkMode: darkModeReducer, // Add dark mode reducer to the store
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
