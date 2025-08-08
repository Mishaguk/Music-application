import mongoose from "mongoose";

const { Schema } = mongoose;

const trackSchema = new Schema({
  name: String,
  artist: String,
  text: String,
  listens: Number,
  picture: String,
  audio: String,
  duration: Number,
  authorId: String,
  isPublic: Boolean,
});

const Track = mongoose.models.Track || mongoose.model("Track", trackSchema);

export default Track;
