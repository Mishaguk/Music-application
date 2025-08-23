import { pagination_offset } from "@/constants";
import connectionToDatabase from "@/lib/mongoose";
import Track from "@/models/track";
import { TrackT } from "@/types/track";
import { FilterQuery } from "mongoose";
import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectionToDatabase();

    const params = req.nextUrl.searchParams;
    const userId = (await cookies()).get("userId")?.value;

    const page = Number(params.get("page")) || 0;
    const limit = Number(params.get("limit")) || pagination_offset;
    const search = params.get("search") || "";

    const privateTracks = params.get("privateTracks") || false;

    const searchRegex = new RegExp(search, "i");
    const searchFilter = {
      $or: [
        { name: { $regex: searchRegex } },
        { artist: { $regex: searchRegex } },
      ],
    };
    let filter: FilterQuery<TrackT>;

    if (privateTracks === "true" && userId) {
      filter = {
        $and: [{ authorId: userId }, searchFilter],
      };
    } else {
      const orConditions: [{ isPublic?: boolean; authorId?: string }] = [
        { isPublic: true },
      ];
      if (userId) {
        orConditions.push({ authorId: userId });
      }

      filter = {
        $and: [searchFilter, { $or: orConditions }],
      };
    }

    const [tracks, totalCount] = await Promise.all([
      Track.find(filter)
        .skip(page * limit)
        .limit(limit),
      Track.countDocuments(filter),
    ]);
    return NextResponse.json({ tracks, totalCount }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectionToDatabase();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const artist = formData.get("artist") as string;
    const text = formData.get("text") as string;
    const picture = formData.get("picture") as string;
    const audio = formData.get("audio") as string;
    const duration = formData.get("duration") as string;

    const userId = (await cookies()).get("userId")?.value;

    const isPublic = userId === process.env.PUBLIC_TRACK_KEY;

    const track = await Track.create({
      name,
      artist,
      text,
      picture,
      audio,
      listens: 0,
      duration: Number(duration),
      authorId: userId,
      isPublic,
    });

    return NextResponse.json(track, { status: 201 });
  } catch (err) {
    console.error("POST /api/tracks error:", err);
    return NextResponse.json(
      { error: "Something goes wrong" },
      { status: 500 }
    );
  }
}
