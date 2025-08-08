import { api } from "@/lib/api";

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };

    audio.onerror = () => {
      reject(new Error("Failed to upload audio metadata"));
    };

    audio.src = URL.createObjectURL(file);
  });
}

export async function uploadToCloudinary(
  file: File,
  folder: "audio" | "image"
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );
  formData.append("folder", "music-app/" + folder);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiUrl = process.env.NEXT_PUBLIC_CLOUDINARY_API_URL;
  const res = await api.post(`${apiUrl}/${cloudName}/auto/upload`, formData, {
    baseURL: undefined,
  });

  if (!res || res.status !== 200) {
    throw new Error("Error uploading file to Cloudinary");
  }

  return res.data.secure_url as string;
}

export function formatListens(count: number) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
