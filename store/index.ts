import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./slices/playerSlice";
import trackReducer from "./slices/trackSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      player: playerReducer,
      track: trackReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
