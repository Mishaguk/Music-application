export type CommentT = {
  _id: string;
  username: string;
  text: string;
};

export type TrackT = {
  _id: string;
  name: string;
  artist: string;
  text: string;
  listens: number;
  picture: string;
  audio: string;
  duration: number;
  authorId: string;
  isPublic: boolean;
};

export type TrackState = {
  tracks: TrackT[];
  error: string;
  totalCount: number;
  pending: boolean;
};
