import { DetailTrackInfo } from "@/components/DetailTrackInfo";

import { api } from "@/lib/api";
import { TrackT } from "@/types/track";

import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: track } = await api.get<TrackT>(`api/tracks/${id}`);

  return {
    title: `${track.name} - ${track.artist}`,
    description: "Browsing track",
  };
}

const Page = async ({ params }: Props) => {
  const { id } = await params;

  let res;
  try {
    res = await api.get<TrackT>(`api/tracks/${id}`);
  } catch (err) {
    console.error(err);
  }

  if (!res?.data) {
    return <h1>Error getting detail track info</h1>;
  }

  return <DetailTrackInfo track={res.data} />;
};
export default Page;
