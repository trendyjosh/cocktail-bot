import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command, container } from "@sapphire/framework";

@ApplyOptions<Command.Options>({
    description: "Search for cocktail by name.",
    preconditions: ["HasServer"],
})
export class SearchCommand extends Command {
    private stringOptionName: string = "name";

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((option) =>
                    option //
                        .setName(this.stringOptionName)
                        .setDescription("Enter the name of a cocktail")
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