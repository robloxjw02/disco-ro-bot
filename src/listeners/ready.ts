import { Client, ChannelType, EmbedBuilder } from "discord.js";
import path from 'path';
const express = require('express');
const config = require('../../config.json')

const application = express()

application.set('views', path.join(__dirname, '/public'))
application.set('view engine', 'ejs')

application.use(express.static(__dirname + '/public'))
application.use(express.urlencoded({
    extended: true
}))

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    console.log(`${client.user.username} is online`);

    application.get("/get/guild", async (req: any, res: any) => {
      // function for retrieving all guild/server info
      let guild = await client.guilds.fetch(config.guild_id);
      res.send(guild);
    });

    application.get("/get/members", async (req: any, res: any) => {
      let guild = await client.guilds.fetch(config.guild_id);
      let members = await guild.members.fetch()
      let userNameList : any = [];

      let addUser = await members.forEach((m) => {
        userNameList.push(m.user)
      })

      res.send(userNameList);
    });

    application.get("/get/channels", async (req: any, res: any) => {
      // function for retrieving channels of the guild/server
      let guild = await client.guilds.fetch(config.guild_id);
      res.send(guild.channels);
    });

    application.get("/get/guildchannel/:id", async (req: any, res: any) => {
      // function for retrieving channel info of a specific channel, by id
      const { id } = req.params;
      let guild = await client.guilds.fetch(config.guild_id);
      let channel = await guild.channels.fetch(id);
      res.send(channel);
    });

    application.get("/get/channel/:id", async (req: any, res: any) => {
      // function for retrieving channel info of a specific channel, by id
      const { id } = req.params;

      let channel = await client.channels.fetch(id);
      res.send(channel);
    });

    application.get("/get/channelmessages/:id", async (req: any, res: any) => {
      // function for retrieving messages from a specific channel, by id
      const { id } = req.params;
      console.log("getting channel messages from channel" + id);

      let channel = await client.channels.fetch(id);

      if (channel !== null && channel.type === ChannelType.GuildText) {
        let messages = await channel.messages.fetch();
        res.send(messages);
      }
    });

    application.get(
      "/get/messageauthor/:channelid/:messageid",
      async (req: any, res: any) => {
        // function for retrieving data about who sent a message, by channel and message id
        let { channelid, messageid } = req.params;
        let channel = await client.channels.fetch(channelid);
        if (channel !== null && channel.type === ChannelType.GuildText) {
          let message = await channel.messages.fetch(messageid);
          res.send(message.author);
        }
      }
    );

    application.get(
      "/post/message/:name/:channelid/:content",
      async (req: any, res: any) => {
        // function for posting messages, params: roblox username, channel id, message content
        let { name, channelid, content } = req.params;
        let channel = await client.channels.fetch(channelid);

        // let messagecontent = `**${name} says:** ${content}`;
        if (channel !== null && channel.type === ChannelType.GuildText) {
          let messageEmbed = new EmbedBuilder()
          .setTitle(`${name}`)
          .setDescription(`${content}`)
          .setTimestamp()
          .setFooter({ text: 'RoDisco Cross Messaging', iconURL: 'https://cdn.discordapp.com/attachments/1036659618979524648/1050594857908981861/Ro-Disco.png'});


          channel
          .send({ embeds: [messageEmbed]})
          .then(() => {
            res.send("success")
          })
          .catch(() => {
            console.error
          })
          // channel
          //   .send(`${messagecontent}`)
          //   .then(() => {
          //     res.send("success");
          //   })
          //   .catch(() => {
          //     console.error;
          //   });
        }
      }
    );

    let PORT = process.env.PORT || 3000; // change 3000 to any localhost:<port> that you'd like to host it on when hosting locally
    application.listen(PORT, () => {
      console.log(`Login`);
      console.log(`listening on ${PORT}`);
    });
  });
};
