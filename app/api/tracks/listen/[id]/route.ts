import connectionToDatabase from "@/lib/mongoose";
import Track from "@/models/track";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectionToDatabase();

    const params = context.params;

    const { id } = await params;

    const track = await Track.findById(id);

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    track.listens += 1;
    await track.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
