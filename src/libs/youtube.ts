import { formatFileSize, validateYoutubeUrl } from "@utils/helpers";
import youtubeDl, { Payload } from "youtube-dl-exec";

export const parseYoutubeUrl = (url: string) => {
    if (!validateYoutubeUrl(url)) {
        return {
            valid: false,
            error: "Invalid YouTube URL",
            type: null,
            videoId: null,
            url: url,
        };
    }

    const urlObj = new URL(url);
    let videoId: string | null = null;
    let type: "short" | "video" | null = null;

    if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.substring(1);
        type = "video";
    } else if (urlObj.pathname.startsWith("/watch")) {
        videoId = urlObj.searchParams.get("v");
        type = "video";
    } else if (urlObj.pathname.startsWith("/shorts/")) {
        videoId = urlObj.pathname.split("/")[2];
        type = "short";
    } else if (urlObj.pathname.startsWith("/embed/")) {
        videoId = urlObj.pathname.split("/")[2];
        type = "video";
    }

    if (!videoId) {
        return {
            valid: false,
            error: "Could not extract video ID",
            type: null,
            videoId: null,
            url: url,
        };
    }

    return { valid: true, type, videoId, url };
};

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
