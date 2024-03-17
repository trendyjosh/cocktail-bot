import { Command } from "@sapphire/framework";
import { ActionRowBuilder, EmbedBuilder, InteractionUpdateOptions, StringSelectMenuInteraction } from "discord.js";
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
  public async selectCocktail(interaction: Command.ChatInputCommandInteraction, cocktails: Array<Cocktail>): Promise<void> {
    // Prepare cocktail select menu
    let select = new CocktailSelectMenuBuilder().setCustomId("cocktail").setPlaceholder("Make a selection!");
    if (cocktails.length) {
      // Add all cocktail results as options on the select menu
      select.addCocktailOptions(cocktails);

      // Update message with select menu of cocktail results
      const row = new ActionRowBuilder<CocktailSelectMenuBuilder>().addComponents(select);
      const response = await interaction.editReply({
        content: "Choose a cocktail...",
        components: [row],
      });

      // Only allow the user that made the request to select the cocktail
      const filter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
      try {
        // Allow 2 minutes to retrieve the select reponse
        const confirmation = await response.awaitMessageComponent({ filter, time: 120_000 });
        if (confirmation instanceof StringSelectMenuInteraction && confirmation.customId === "cocktail") {
          // The correct select response was received
          const selectedCocktail: Cocktail | undefined = Cocktail.inArray(cocktails, confirmation.values[0]);

          let reply: InteractionUpdateOptions;
          if (selectedCocktail) {
            // Respond with the cocktail details
            const cocktailEmbed: EmbedBuilder = selectedCocktail.toEmbed();
            reply = { embeds: [cocktailEmbed], content: null, components: [] };
          } else {
            // Cocktail doesn't exist in the array
            reply = { content: "Invalid selection", components: [] };
          }
          // Update the message with outcome
          await confirmation.update(reply);
        }
      } catch (e) {
        // No selection was made within the time limit
        await response.edit({ content: "Selection not received within 2 minutes.", components: [] });
      }
    } else {
      // No cocktails were found matching the search string
      await interaction.editReply({
        content: "No cocktails found",
        components: [],
      });
    }
  }

  /**
   * Search for and select a cocktail by name or ingredients.
   * @param interaction The current slash command interaction
   * @param inputString The name of the input field
   * @returns Interaction response message
   */
  public async searchCocktail(interaction: Command.ChatInputCommandInteraction, inputString: string): Promise<void> {
    // Get cocktails search string
    // @ts-ignore: string input is a required field
    const searchString = interaction.options.getString(inputString).trim();
    let cocktails;
    if (inputString == "name") {
      // Get cocktails by name
      cocktails = await Cocktail.searchName(searchString);
    } else {
      // Get cocktails by ingredients
      cocktails = await Cocktail.searchIngredients(searchString);
    }
    this.selectCocktail(interaction, cocktails);
  }
}
