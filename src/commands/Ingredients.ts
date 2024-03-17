import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command, container } from "@sapphire/framework";

@ApplyOptions<Command.Options>({
    description: "Search for cocktail by ingredients.",
    preconditions: ["HasServer"],
})
export class SelectWorkspaceCommand extends Command {
    private stringOptionName: string = "ingredients";

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((option) =>
                    option //
                        .setName(this.stringOptionName)
                        .setDescription("Enter the ingredients separated by commas (',')")
                        .setRequired(true)
                )
        );
    }

    /**
     * Add a new task to the provided space.
     * @param interaction The slash command interaction
     */
    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        await container.controller.searchCocktail(interaction, this.stringOptionName);
    }
}