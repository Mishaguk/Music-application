import connectionToDatabase from "@/lib/mongoose";
import Track from "@/models/track";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  _requset: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectionToDatabase();

    const params = context.params;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const track = await Track.findById(id);

    return NextResponse.json(track, { status: 200 });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
