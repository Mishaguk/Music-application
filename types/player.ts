import { TrackT } from "./track";

export type PlayerState = {
  active: null | TrackT;
  volume: number;
  duration: number;
  currentTime: number;
  isPaused: boolean;
};
