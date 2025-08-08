import { PlayerState } from "@/types/player";
import { TrackT } from "@/types/track";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PlayerState = {
  active: null,
  volume: 100,
  duration: 0,
  currentTime: 0,
  isPaused: true,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    pause: (state) => {
      state.isPaused = true;
    },
    play: (state) => {
      state.isPaused = false;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setActive: (state, action: PayloadAction<TrackT>) => {
      state.active = action.payload;
      if (state.active._id !== action.payload._id) {
        state.currentTime = 0;
        state.duration = 0;
      }
    },
  },
});

export const {
  pause,
  play,
  setCurrentTime,
  setDuration,
  setVolume,
  setActive,
} = playerSlice.actions;

export default playerSlice.reducer;
