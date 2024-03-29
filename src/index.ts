import { SapphireClient, container } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import config from "./config.json";
import { CocktailController } from "./controllers/CocktailController";
import axios from "axios";

// Create the controller object
container.controller = new CocktailController();

// Set axios defaults
axios.defaults.headers.common["X-Api-Key"] = config.apiNinjaToken;
axios.defaults.baseURL = config.apiNinjaEndpoint;

// Initiate the Sapphire client
const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
});

// Login the bot
client.login(config.token);
