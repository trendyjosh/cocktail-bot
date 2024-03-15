import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command, CommandStore, container } from "@sapphire/framework";
import { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  description: "Show available bot commands.",
})
export class HelpCommand extends Command {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
    );
  }

  /**
   * Show all available commands.
   * @param interaction The slash command interaction
   * @returns An edited response confirmation
   */
  public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<Message<boolean>> {
    const commands: CommandStore = container.stores.get("commands");
    const message = container.controller.help(commands);
    return interaction.reply(message);
  }
}
