import { formatFileSize, validateYoutubeUrl } from "@utils/helpers";
import youtubeDl, { Payload } from "youtube-dl-exec";

export const youtube = async (url: string, type: "mp3" | "mp4") => {
    // Pilih format berdasarkan tipe
    const format =
        type === "mp3" ? "bestaudio[ext=webm]" : "bestvideo[ext=mp4]";

    try {
        const result = (await youtubeDl(url, {
            dumpSingleJson: true,
            format,
        })) as Payload;

        const selectedFormat = result.formats.filter(
            (f) =>
                f.ext &&
                f.format_note &&
                f.acodec != "none" &&
                (type === "mp3"
                    ? f.format_note === "medium" && f.ext === "webm"
                    : f.ext === "mp4" && f.protocol != "m3u8_native"),
        );

        return {
            title: result.title,
            link: selectedFormat[0].url.trim(), // Direct video/audio URL
            thumbnail: result.thumbnail,
            size: formatFileSize(selectedFormat[0].filesize),
            filename: `${result.title}.${type}`,
        };
    } catch (error) {
        console.error("Error fetching video:", error);
        return null;
    }
};
