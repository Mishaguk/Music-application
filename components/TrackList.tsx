import { TrackT } from "@/types/track";
import { Grid } from "@mui/material";
import Track from "./Track";

type Props = {
  tracks: TrackT[];
  activeId: string | undefined;
  isPaused: boolean;
};

const TrackList = ({ tracks, activeId, isPaused }: Props) => {
  return (
    <Grid container spacing={3} padding={2}>
      {tracks.map((track) => (
        <Grid key={track._id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <Track
            track={track}
            active={activeId === track._id}
            isPaused={isPaused}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TrackList;
