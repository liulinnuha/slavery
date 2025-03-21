import ytdl, { Payload } from "youtube-dl-exec";

export const facebook = async (url: string, quality: "hd" | "sd" = "hd") => {
    try {
        const format = quality === "hd" ? "best" : "worst";

        const result = (await ytdl(url, {
            format: format,
            dumpSingleJson: true,
        })) as Payload;

        const selectedFormat = result.formats?.find(
            (f) => f.ext === "mp4" && f.url,
        );

        if (!selectedFormat) throw new Error("Format MP4 tidak ditemukan!");

        return {
            title: result.title,
            desc: result.description,
            thumbnail: result.thumbnail,
            link: selectedFormat.url,
        };
    } catch (error) {
        console.error("Error fetching video:", error);
        return null;
    }
};
