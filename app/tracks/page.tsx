import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Music App - Track list",
  description: "Listening tracks",
};

const TracksClient = dynamic(() => import("./TracksClient"));

const Tracks = async () => {
  return (
    <Suspense>
      <TracksClient />
    </Suspense>
  );
};
export default Tracks;
