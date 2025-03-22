export const post = async (url: string, formdata: {}) => {
    return fetch(url, {
        method: "POST",
        headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: Object.keys(formdata)
            .map((key) => `${key}=${encodeURIComponent(formdata[key])}`)
            .join("&"),
    })
        .then((res) => res.json())
        .then((res) => {
            return res;
        });
};

export const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    const size = sizeInBytes / Math.pow(1024, i);

    return `${size.toFixed(2)} ${units[i]}`;
};

export const validateYoutubeUrl = (url: string): boolean => {
    const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/;
    return youtubeRegex.test(url);
};

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

export const validateFacebookUrl = (url: string): boolean => {
    const fbRegex =
        /^(https?:\/\/)?(www\.|web\.)?(facebook\.com|fb\.watch)\/(watch\?v=\d+|reel\/\w+|story\.php\?story_fbid=\d+|photo\.php\?fbid=\d+|groups\/\d+\/permalink\/\d+|share\/v\/[\w-]+)/;
    return fbRegex.test(url);
};

export const validateInstagramUrl = (
    url: string,
): { isValid: boolean; type?: "video" | "reels" | "story" | "image" } => {
    const igRegex =
        /^(https?:\/\/)?(www\.)?instagram\.com\/(reel|p|stories|tv|post)\/[\w-]+/;
    if (!igRegex.test(url)) return { isValid: false };

    let type: "video" | "reels" | "story" | "image" = "image";
    if (url.includes("/reel/")) type = "reels";
    else if (url.includes("/p/")) type = "image";
    else if (url.includes("/tv/") || url.includes("/post/")) type = "video";
    else if (url.includes("/stories/")) type = "story";

    return { isValid: true, type };
};
