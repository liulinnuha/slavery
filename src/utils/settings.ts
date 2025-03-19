import fs from "fs";
import { join } from "path";

const rootDir: string = join(__dirname, "group");

interface GroupData {
    join: { msg: string; active: boolean };
    left: { msg: string; active: boolean };
    link: { active: boolean };
}

type ModifyType = "join" | "left" | "on/join" | "on/left" | "on/link";

export function modifyData(
    filename: string,
    type: ModifyType,
    insertData: string | null = null,
): void {
    const filePath = join(rootDir, `${filename}.json`);
    const fileExists = fs.existsSync(filePath);

    let data: GroupData;

    if (fileExists) {
        data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as GroupData;
    } else {
        data = {
            join: {
                msg: "Hello, %user\nWelcome to *%group*\nHave fun with us!",
                active: false,
            },
            left: { msg: "Goodbye %user", active: false },
            link: { active: false },
        };
    }

    switch (type) {
        case "join":
            if (insertData) data.join.msg = insertData;
            break;
        case "left":
            if (insertData) data.left.msg = insertData;
            break;
        case "on/join":
            data.join.active = !data.join.active;
            break;
        case "on/left":
            data.left.active = !data.left.active;
            break;
        case "on/link":
            data.link.active = !data.link.active;
            break;
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function checkData(
    filename: string,
    type: ModifyType | null = null,
): "active" | "inactive" | "no_file" {
    const filePath = join(rootDir, `${filename}.json`);
    if (!fs.existsSync(filePath)) return "no_file";

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as GroupData;

    if (type === null) return "no_file";

    return data.join.active ? "active" : "inactive";
}

export function getData(filename: string): GroupData | "no_file" {
    const filePath = join(rootDir, `${filename}.json`);
    if (!fs.existsSync(filePath)) return "no_file";

    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as GroupData;
}

export function deleteData(filename: string): void {
    const filePath = join(rootDir, `${filename}.json`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
