"use client";
import { routes } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { TrackT } from "@/types/track";
import { formatListens, formatTime } from "@/utils";
import {
  ArrowBackRounded,
  PauseRounded,
  PlayArrowRounded,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  setActive,
  play as playTrack,
  pause as pauseTrack,
} from "@/store/slices/playerSlice";

type Props = {
  track: TrackT;
};

export const DetailTrackInfo = ({ track }: Props) => {
  const formattedListens = new Intl.NumberFormat("uk-UA").format(track.listens);

  const dispatch = useAppDispatch();

  const { active, isPaused: pause } = useAppSelector((state) => state.player);

  const play = () => {
    if (active?._id !== track._id) {
      dispatch(setActive(track));
      dispatch(playTrack());
    } else {
      dispatch(pause ? playTrack() : pauseTrack());
    }
  };

  const router = useRouter();
  const theme = useTheme();

  return (
    <Stack
      margin={1}
      bgcolor={theme.palette.background.paper}
      borderRadius={2}
      boxShadow={3}
      sx={{ flexDirection: { xs: "column", md: "row" } }}
    >
      <Stack
        flexGrow={1}
        position="relative"
        sx={{ height: { xs: 300, md: 600 } }}
      >
        <Image
          src={track.picture}
          fill
          priority
          sizes="600px"
          alt={`${track.name} by ${track.artist}`}
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
      </Stack>
      <Stack
        justifyContent="center"
        position="relative"
        flexGrow={1}
        padding={4}
        sx={{ gap: { xs: 1, sm: 4 } }}
      >
        <Button
          onClick={() => router.push(routes.tracks)}
          sx={{
            position: { xs: "static", md: "absolute" },
            top: 30,
            marginBottom: { xs: 2, md: 0 },
            width: { xs: undefined, sm: 250 },
          }}
        >
          <ArrowBackRounded />
          Back to track list
        </Button>
        <Stack direction="row" gap={2}>
          <Chip label={formatTime(track.duration || 0)} />
          <Chip
            variant="outlined"
            label={`${formatListens(track.listens)} listens`}
          />
        </Stack>

        <Stack>
          <Typography sx={{ fontSize: { xs: 24, md: 30 } }}>
            {track.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="h4"
            fontWeight={300}
            sx={{
              fontSize: { xs: 16, md: 24 },
            }}
          >
            by {track.artist}
          </Typography>
        </Stack>

        <Button
          onClick={play}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-around" },
            width: { xs: undefined, sm: 150 },
          }}
        >
          {!pause && track._id === active?._id ? (
            <>
              <PauseRounded /> <Typography>Pause </Typography>
            </>
          ) : (
            <>
              <PlayArrowRounded /> <Typography>Play Track</Typography>
            </>
          )}
        </Button>
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Stack flexGrow={1}>
            <Typography color="textSecondary" fontWeight={400} fontSize={16}>
              Total plays
            </Typography>
            <Typography fontWeight={500}>{formattedListens}</Typography>
          </Stack>
          <Stack flexGrow={1}>
            <Typography color="textSecondary" fontWeight={400} fontSize={16}>
              Duration
            </Typography>
            <Typography fontWeight={500}>
              {formatTime(track.duration || 0)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
