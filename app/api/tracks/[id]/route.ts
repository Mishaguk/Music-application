import connectionToDatabase from "@/lib/mongoose";
import Track from "@/models/track";
import { NextResponse } from "next/server";

export async function GET(
  _requset: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectionToDatabase();

    const params = context.params;

    const { id } = await params;
    const track = await Track.findById(id);

    return NextResponse.json(track, { status: 200 });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
