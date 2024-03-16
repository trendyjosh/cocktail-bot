import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { Cocktail } from "./Cocktail";

/**
 * Class to extend the base functionality of the StringSelectMenuBuilder
 * class to handle interactions with Cocktail objects.
 */
export class CocktailSelectMenuBuilder extends StringSelectMenuBuilder {
    /**
     * Search for and select from top 5 search query results.
     * @param cocktails Array of cocktail objects to add options for
     */
    public addCocktailOptions(cocktails: Array<Cocktail>): void {
        cocktails.forEach((cocktail: Cocktail) => {
            // Add each cocktail as a dropdown option on select menu
            const title: string = cocktail.getName(),
                description: string = cocktail.getIngredients().length + " ingredients",
                value: string = cocktail.getId();
            this.addOptions(new StringSelectMenuOptionBuilder().setLabel(title).setDescription(description).setValue(value));
        });
    }
}