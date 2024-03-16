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
            console.log("No cocktail");
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
}
