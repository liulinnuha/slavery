import ytdl, { Payload } from "youtube-dl-exec";
import axios from "axios";

export const getImages = async (url: string) => {
    try {
        const payload = {
            url: url,
            new: "2",
            lang: "en",
            app: "",
        };

        const response = await axios.post(
            "https://snapinsta.app/get-data.php",
            payload,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.15; rv:135.0) Gecko/20100101 Firefox/135.0",
                    Referer: "https://snapinsta.app/",
                    Origin: "https://snapinsta.app",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );

        if (
            !response.data ||
            !response.data.files ||
            response.data.files.length === 0
        ) {
            throw new Error("Failed to retrieve media.");
        }

        const urls = response.data.files.map((file) => file.preview_url);

        return {
            urls: urls,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getVideos = async (url: string) => {
    try {
        const response = (await ytdl(url, {
            dumpSingleJson: true,
        })) as Payload;

        if (!response.formats) throw new Error("Failed to retrieve media.");

        return {
            title: response.title?.replace(/[<>:"/\\|?*]+/g, ""),
            thumbnail: response.thumbnail,
            duration: response.duration,
            url: (response as any)?.url || response.formats?.[0]?.url,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
};
