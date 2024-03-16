import { Command } from "@sapphire/framework";
import { ActionRowBuilder } from "discord.js";
import { Cocktail } from "./Cocktail";
import { CocktailSelectMenuBuilder } from "./CocktailSelectMenuBuilder";

/**
 * Class to handle all interactions from the user.
 */
export class Server {
  /**
   * Search for and select a cocktail by name.
   * @param interaction The current slash command interaction
   * @returns Interaction response message
   */
  public async searchCocktail(interaction: Command.ChatInputCommandInteraction): Promise<void> {
    // Prepare cocktail select menu
    let select = new CocktailSelectMenuBuilder().setCustomId("cocktail").setPlaceholder("Make a selection!");
    // Get cocktails from search string
    // @ts-ignore: name is a required input field
    const searchString = interaction.options.getString("name").trim();
    const cocktails = await Cocktail.search(searchString);
    if (cocktails.length) {
      // Add all cocktail results as options on the select menu
      select.addCocktailOptions(cocktails);

      const row = new ActionRowBuilder<CocktailSelectMenuBuilder>().addComponents(select);
      const response = await interaction.editReply({
        content: "Choose a cocktail...",
        components: [row],
      });

      // TODO 
      // Get user selection
      // Update message to show cocktail recipe and ingredients
    } else {
      // No cocktails were found matching the search string
      await interaction.editReply({
        content: "No cocktails found",
        components: [],
      });
    }
  }
}
