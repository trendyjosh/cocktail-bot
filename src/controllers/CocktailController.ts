import { Command, CommandStore } from "@sapphire/framework";
import { Server } from "../models/Server";
import { EmbedBuilder, InteractionReplyOptions } from "discord.js";

export class CocktailController {
  private servers: Map<string, Server> = new Map<string, Server>();

  /**
   * Create a new server mapping.
   * @param serverId The guild id
   */
  public addServer(serverId: string): void {
    this.servers.set(serverId, new Server());
  }

  /**
   * Print out the application commands.
   * @param commands All bot commands
   * @returns Message embed
   */
  public help(commands: CommandStore): InteractionReplyOptions {
    const embed = new EmbedBuilder().setColor(0x274437).setTitle("All commands");
    let commandsString: string = "";
    commands.each((command: Command) => {
      commandsString += `/${command.name} - ${command.description}`;
      if (!Object.is(commands.last(), command)) {
        commandsString += "\n";
      }
    });
    embed.setDescription(commandsString);
    return { embeds: [embed] };
  }

  /**
   * Search for and select a cocktail by name.
   * @param interaction Input command
   * @param inputString The name of the input field
   */
  public async searchCocktail(interaction: Command.ChatInputCommandInteraction, inputString: string): Promise<void> {
    // @ts-ignore: HasServer precondition checks if guild is null
    const serverId: string = interaction.guild.id;
    // Get available workspaces
    // @ts-ignore: HasServer precondition confirms server exists
    await this.servers.get(serverId).searchCocktail(interaction, inputString);
  }
}
