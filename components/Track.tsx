"use client";
import { TrackT } from "@/types/track";

import { Button, Card, Stack, Typography } from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { routes } from "@/constants";

import React from "react";
import { useAppDispatch } from "@/store/hooks";

import { motion } from "motion/react";

import {
  setActive,
  play as playTrack,
  pause as pauseTrack,
} from "@/store/slices/playerSlice";

type Props = {
  track: TrackT;
  active: boolean;
  isPaused: boolean;
};

const Track = ({ track, active = false, isPaused }: Props) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const play = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!active) {
      dispatch(setActive(track));
      dispatch(playTrack());
    } else {
      dispatch(isPaused ? playTrack() : pauseTrack());
    }
  };

  return (
    <motion.div whileTap={{ scale: 0.99 }} style={{ cursor: "pointer" }}>
      <Card
        onClick={() => router.push(routes.tracks + track._id)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: { xs: 450, md: 500 },
          padding: 2,
          gap: 2,
        }}
      >
        {track.picture && (
          <Stack position="relative" width="100%" height="100%" sx={{}}>
            <Image
              fill
              sizes="100%"
              src={track.picture}
              alt="track image"
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </Stack>
        )}
        <Stack gap={1} width="100%">
          <Typography fontSize={18} fontWeight={400}>
            {track.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="h4"
            fontWeight={300}
            fontSize={16}
          >
            {track.artist}
          </Typography>
        </Stack>
        <Button
          onClick={play}
          variant="contained"
          color="primary"
          startIcon={!isPaused && active ? <Pause /> : <PlayArrow />}
          sx={{
            width: 240,
            borderRadius: 2,
            textTransform: "none",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          <Typography fontWeight={500}>
            {!isPaused && active ? "Pause" : "Play"}
          </Typography>
        </Button>
      </Card>
    </motion.div>
  );
};
export default Track;
