import { ICommand } from "@constants";
import { modifyData, checkData } from "@utils/settings";

export default {
    name: "welcomewarm",
    aliases: ["welcome"],
    category: "group",
    description: "Setting warm welcome message in your group",
    use:
        "_options_ _value_\n\n" +
        "*Options*\n~ on - turned on warm welcome message\n" +
        "~ off - turned off warm welcome message\n" +
        "~ message - set custom message\n\n" +
        "Ex:\n!welcome on\n!welcome off\n\n" +
        "For custom message:\n%member - tag new member\n%group - group name\n%desc - group description\n\n" +
        "Ex: !welcome message Hello %member, welcome to %group. Don't forget read our %desc",
    adminGroup: true,
    execute: async ({ msg, client, args }) => {
        const { from, isGroup, sender } = msg;
        // console.log(msg);
        if (!isGroup) return await msg.reply(`Only can be executed in group.`);
        if (args.length < 0)
            return await msg.reply("Please check *#help welcome*");

        // Command
        let opt = args[0];
        let filename = from.split("@")[0];
        let dataOn;
        switch (opt) {
            case "on":
                dataOn = checkData(filename, "on/join");
                if (dataOn === "active") {
                    return await msg.reply("```Already active/Sudah aktif```");
                } else if (dataOn === "no_file" || dataOn === "inactive") {
                    modifyData(filename, "on/join", null);
                    return await msg.reply("```Activated/Telah diaktifkan```");
                }
                break;
            case "off":
                dataOn = checkData(filename, "on/join");
                if (dataOn === "inactive") {
                    return await msg.reply(
                        "```Never active/Tidak pernah aktif```",
                    );
                } else if (dataOn === "no_file") {
                    return await msg.reply(
                        "```Please actived this feature first/Harap aktifkan fitur ini dahulu```",
                    );
                } else if (dataOn === "active") {
                    modifyData(filename, "on/join", null);
                    return await msg.reply(
                        "```Success deactivated/Berhasil di nonaktifkan```",
                    );
                }
                break;
            case "message":
                modifyData(filename, "join", args.slice(1).join(" "));
                await msg.reply(
                    "```Custom message edited successfully/Pesan custom berhasil di edit```",
                );
                break;
            default:
                let t =
                    `How to use: \n\n` +
                    "_options_ _value_\n\n" +
                    "*Options*\n~ on - turned on warm welcome message\n" +
                    "~ off - turned off warm welcome message\n" +
                    "~ message - set custom message\n\n" +
                    "Ex:\n!welcome on\n!welcome off\n\n" +
                    "For custom message:\n%member - tag new member\n%group - group name\n%desc - group description\n\n" +
                    "Ex: !welcome message Hello %member, welcome to %group. Don't forget read our %desc";
                msg.reply(t);
        }
    },
} as ICommand;
