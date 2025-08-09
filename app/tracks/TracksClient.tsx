"use client";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import TrackList from "@/components/TrackList";
import { routes, pagination_offset } from "@/constants";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTracks } from "@/store/slices/trackSlice";

import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const TracksClient = () => {
  const dispatch = useAppDispatch();
  const { tracks, error, totalCount, pending } = useAppSelector(
    (state) => state.track
  );

  const { active, isPaused } = useAppSelector((state) => state.player);

  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useTheme();

  const search = searchParams.get("search") || "";
  const page = searchParams.get("page") || 0;
  const limit = searchParams.get("limit") || pagination_offset;

  const [privateTracks, setPrivateTracks] = useState(false);

  useEffect(() => {
    dispatch(
      fetchTracks({
        page: Number(page),
        limit: Number(limit),
        search,
        privateTracks: privateTracks,
      })
    );
  }, [dispatch, page, limit, search, privateTracks]);

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <Stack
      direction="column"
      bgcolor={theme.palette.background.paper}
      borderRadius={4}
      marginBottom={{ xs: 15, xl: 0 }}
    >
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding={2}
      >
        <Typography variant="h2" sx={{ fontSize: { xs: 32 } }}>
          Listen tracks
        </Typography>

        <Button
          sx={{ fontSize: { xs: 16, md: 24 } }}
          onClick={() => router.push(routes.createTrack)}
        >
          Upload track
        </Button>
      </Stack>
      <Divider />
      <Stack
        padding={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "start", sm: "center" }}
        gap={2}
      >
        <Stack
          gap={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "start", sm: "center" }}
        >
          <Suspense>
            <Pagination totalCount={totalCount} />
          </Suspense>
          <Suspense>
            <SearchInput />
          </Suspense>
        </Stack>
        <FormControlLabel
          control={
            <Checkbox
              checked={privateTracks}
              onChange={(e) => {
                setPrivateTracks(e.target.checked);
              }}
            />
          }
          label="Show only my tracks"
        />
      </Stack>
      {pending ? (
        <Stack
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
          height={400}
        >
          <CircularProgress size={60} />
        </Stack>
      ) : tracks.length ? (
        <TrackList tracks={tracks} activeId={active?._id} isPaused={isPaused} />
      ) : (
        <Stack
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
          height={400}
        >
          <Typography fontSize={32}>No track found :(</Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default TracksClient;
