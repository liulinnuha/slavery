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
