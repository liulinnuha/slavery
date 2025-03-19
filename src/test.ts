import FormData from "form-data";
import axios from "axios";

async function main() {
    const formData = new FormData();
    const url =
        "https://www.tiktok.com/@nisrinaroehani/video/7422345947591544070?is_from_webapp=1&sender_device=pc";
    formData.append("url", url);
    const response = await axios.post(
        "https://api.tikmate.app/api/lookup",
        formData,
        {
            headers: {
                ...formData.getHeaders(),
                origin: "https://tikmate.app",
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/133.0.0.0 Safari/537.36",
            },
        },
    );

    if (!response.data.success) {
        console.error("Failed to fetch TikTok video information");
        return;
    }

    const videoUrl = () => {
        const videoId = response.data.id;
        const token = response.data.token;
        return `https://tikmate.app/download/${token}/${videoId}.mp4?hd=1`;
    };

    console.log(videoUrl());
}
main();
