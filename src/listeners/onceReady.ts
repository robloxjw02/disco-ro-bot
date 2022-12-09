import { Client, ActivityType} from "discord.js";

export default (client: Client): void => {
    client.once("ready", async () => {
        if (client !== null && client.user !== null) {
            client.user.setPresence({
                activities: [{ name: `Corps of Engineers`, type: ActivityType.Watching }],
            });
        }
    });
};