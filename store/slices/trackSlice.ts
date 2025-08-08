import { TrackState } from "@/types/track";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTracks = createAsyncThunk(
  "tracks/fetchTracks",
  async ({
    page,
    limit,
    search,
    privateTracks,
  }: {
    page: number;
    limit: number;
    search: string;
    privateTracks: boolean;
  }) => {
    const response = await axios.get("/api/tracks", {
      params: { page, limit, search, privateTracks },
    });

    return response.data;
  }
);

const initialState: TrackState = {
  tracks: [],
  error: "",
  totalCount: 0,
  pending: false,
};

export const trackSlice = createSlice({
  name: "track",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.fulfilled, (_, action) => ({
        tracks: action.payload.tracks,
        totalCount: action.payload.totalCount,
        error: "",
        pending: false,
      }))
      .addCase(fetchTracks.rejected, () => ({
        tracks: [],
        error: "Failed to fetch tracks",
        totalCount: 0,
        pending: false,
      }))
      .addCase(fetchTracks.pending, () => ({
        tracks: [],
        error: "",
        totalCount: 0,
        pending: true,
      }));
  },
});

export default trackSlice.reducer;
