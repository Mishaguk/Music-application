"use client";
import {
  Pause,
  PlayArrow,
  VolumeDownRounded,
  VolumeUpRounded,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import styles from "../styles/Player.module.css";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  play,
  setCurrentTime,
  setVolume,
  pause,
  setDuration,
} from "@/store/slices/playerSlice";

import { AnimatePresence, motion } from "motion/react";

import Image from "next/image";
import { formatTime } from "@/utils";
import Slider from "./Slider";
import { api } from "@/lib/api";

// TODO: REFACTOR
const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const Player = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [localAudioTime, setLocalAudioTime] = useState(0);
  const [localAudioVolume, setLocalAudioVolume] = useState(0);
  const [isOpenVolume, setIsOpenVolume] = useState(false);

  const { active, isPaused, duration } = useAppSelector(
    (state) => state.player
  );

  const handleTrackListen = useCallback(() => {
    timer.current = setTimeout(() => {
      api.get(`api/tracks/listen/${active?._id}`);
    }, 5000);
  }, [active?._id]);

  useEffect(() => {
    const savedVolume = Number(localStorage.getItem("audio_volume"));
    if (!isNaN(savedVolume) && audioRef.current) {
      audioRef.current.volume = savedVolume / 100;
      if (timer.current) {
        clearTimeout(timer.current || undefined);
      }
      setLocalAudioVolume(savedVolume);
      dispatch(setVolume(savedVolume));
      handleTrackListen();
      audioRef.current?.play();
    }
  }, [active, dispatch, handleTrackListen]);

  useEffect(() => {
    if (isPaused) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }, [isPaused]);

  const playAudio = useCallback(() => {
    if (isPaused) {
      dispatch(play());
      audioRef.current?.play();
      handleTrackListen();
    } else {
      dispatch(pause());
      clearTimeout(timer.current || undefined);
      audioRef.current?.pause();
    }
  }, [dispatch, isPaused, handleTrackListen]);

  if (!active) {
    return null;
  }

  return (
    <motion.div
      key={active.audio}
      className={styles.player}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      {isMobile && (
        <Slider
          aria-label="time-indicator"
          value={localAudioTime}
          size="small"
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => {
            const newTime = Number(value);
            if (audioRef.current) audioRef.current.currentTime = newTime;
            setLocalAudioTime(newTime);
          }}
          onChangeCommitted={(_, value) => {
            const finalTime = Number(value);
            dispatch(setCurrentTime(finalTime));
          }}
          thumbVisible={false}
          maxWidth
        />
      )}
      <Box display="flex" flexDirection="row" alignItems="center" gap={4}>
        <audio
          ref={audioRef}
          src={active.audio}
          onTimeUpdate={() => {
            setLocalAudioTime(
              Math.min(audioRef.current?.currentTime || 0, duration)
            );
          }}
          onLoadedMetadata={() =>
            dispatch(setDuration(audioRef.current?.duration || 0))
          }
          onEnded={() => dispatch(pause())}
          hidden
        />

        <Box display="flex" flexDirection="row">
          <IconButton
            onClick={playAudio}
            sx={{ alignSelf: "center", marginRight: 2 }}
          >
            {!isPaused ? <Pause /> : <PlayArrow />}
          </IconButton>

          <Image
            width={60}
            height={60}
            src={active.picture}
            alt="track image"
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              flexShrink: 0,
              objectFit: "cover",
            }}
          />

          <Box flexDirection="column" margin="0 20px">
            <Typography noWrap sx={{ letterSpacing: -0.25 }}>
              {active.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              {active.artist}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" gap={2}>
          {!isMobile && (
            <Slider
              aria-label="time-indicator"
              size="small"
              value={localAudioTime}
              min={0}
              step={1}
              max={duration}
              onChange={(_, value) => {
                const newTime = Number(value);
                if (audioRef.current) audioRef.current.currentTime = newTime;
                setLocalAudioTime(newTime);
              }}
              onChangeCommitted={(_, value) => {
                const finalTime = Number(value);
                dispatch(setCurrentTime(finalTime));
              }}
            />
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!isMobile && (
              <>
                <TinyText>{formatTime(localAudioTime)}</TinyText>
                <TinyText>/{formatTime(duration)}</TinyText>
              </>
            )}
          </Box>
        </Box>
        <Stack direction="row" gap={1} alignItems="center">
          {isMobile ? (
            <AnimatePresence>
              <Box position="relative" display="flex" justifyContent="center">
                <motion.div
                  initial={false}
                  animate={
                    isOpenVolume
                      ? { y: 0, scale: 1, opacity: 1 }
                      : { y: 50, scale: 0, opacity: 0 }
                  }
                  exit={{ y: 50, scale: 0, opacity: 0 }}
                  style={{
                    position: "absolute",
                    bottom: 50,
                    pointerEvents: isOpenVolume ? "auto" : "none",
                    background: "white",
                    padding: "10px 5px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Slider
                    defaultValue={audioRef.current?.volume}
                    min={0}
                    step={1}
                    value={localAudioVolume}
                    max={100}
                    onChange={(_, value) => {
                      const volume = Number(value);
                      if (audioRef.current)
                        audioRef.current.volume = volume / 100;
                      setLocalAudioVolume(volume);
                    }}
                    onChangeCommitted={(_, value) => {
                      const volume = Number(value);
                      localStorage.setItem("audio_volume", String(volume));
                      dispatch(setVolume(volume / 100));
                    }}
                    orientation="vertical"
                    sx={{ height: 100 }}
                  />
                </motion.div>

                <IconButton onClick={() => setIsOpenVolume((prev) => !prev)}>
                  <VolumeUpRounded />
                </IconButton>
              </Box>
            </AnimatePresence>
          ) : (
            <>
              <VolumeDownRounded />
              <Slider
                aria-label="Volume"
                defaultValue={audioRef.current?.volume}
                size="small"
                min={0}
                step={1}
                value={localAudioVolume}
                max={100}
                onChange={(_, value) => {
                  const volume = Number(value);
                  if (audioRef.current) audioRef.current.volume = volume / 100;
                  setLocalAudioVolume(volume);
                }}
                onChangeCommitted={(_, value) => {
                  const volume = Number(value);
                  localStorage.setItem("audio_volume", String(volume));
                  dispatch(setVolume(volume / 100));
                }}
                sx={{ width: 100 }}
              />
              <VolumeUpRounded />
            </>
          )}
        </Stack>
      </Box>
    </motion.div>
  );
};

export default React.memo(Player);
