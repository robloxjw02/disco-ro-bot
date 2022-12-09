import { Client, GatewayIntentBits, Partials, ChannelType } from 'discord.js';
const config = require('../config.json')
import ready from './listeners/ready';
import onceReady from './listeners/onceReady';

const { Guilds, GuildMessages, GuildMembers, GuildVoiceStates, DirectMessages, MessageContent } = GatewayIntentBits;
const { Channel } = Partials


const client = new Client({
    intents: [Guilds, GuildMessages, GuildMembers, DirectMessages, GuildVoiceStates],
    partials: [Channel]
})

onceReady(client)
ready(client)
client.login(config.token) //If you didn't make a config.json file, please insert your bot token here as a string.