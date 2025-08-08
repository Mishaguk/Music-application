export const routes = {
  home: "/",
  tracks: "/tracks/",
  createTrack: "/tracks/create/",
};

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const pagination_offset = 9;
