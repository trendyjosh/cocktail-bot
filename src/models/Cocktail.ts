import axios, { AxiosResponse } from 'axios';
import { APIEmbedField, EmbedBuilder } from 'discord.js';
import { v1 as uuidv1 } from 'uuid';

/**
 * Class to handle actions performed on a Cocktail.
 * It also provides static methods for interacting with the API
 * to receive instances of itself.
 * It will generate a unique id for each instance because the api has 
 * no ids for each cocktail, this allows cocktails to be referenced directly
 * from an unindexed list without needing to call the api again.
 */
export class Cocktail {
    protected id: string = uuidv1();
    protected name: string = "";
    protected ingredients: Array<string> = Array<string>();
    protected instructions: string = "";

    /**
     * Get the uuid of this cocktail.
     * @returns The cocktail uuid
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Get the name of this cocktail converted to title case.
     * @returns The cocktail name
     */
    public getName(): string {
        const nameParts = this.name.split(' ');
        const upperNameParts = nameParts.map((word: string) => {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        });
        return upperNameParts.join(' ');
    }

    /**
     * Get the ingredients for this cocktail.
     * @returns The cocktail ingredients
     */
    public getIngredients(): Array<string> {
        return this.ingredients;
    }

    /**
     * Get the instructions for this cocktail.
     * @returns The cocktail instructions
     */
    public getInstructions(): string {
        return this.instructions;
    }

    /**
     * Find all cocktail recipes by name or ingredients.
     * @param params axios request params for name or ingredients
     * @returns Array of Cocktail instances
     */
    public static async search(params: CocktailApiParams): Promise<Array<Cocktail>> {
        const cocktails: Array<Cocktail> = Array<Cocktail>();
        await axios
            .get('', {
                params: params
            })
            .then((response: AxiosResponse<any, any>) => {
                response.data.forEach((cocktail: any) => {
                    // Cast each anonymous object to a new Cocktail class instance
                    const newCocktail: Cocktail = Object.assign(new Cocktail(), cocktail);
                    // Add to return array
                    cocktails.push(newCocktail);
                });
            })
            .catch(function (error: any) {
                console.log(error);
            });
        return cocktails;
    }

    /**
     * Search for cocktails by name.
     * @param cocktailName Name of cocktail to search
     * @returns Array of Cocktail instances
     */
    public static async searchName(cocktailName: string): Promise<Array<Cocktail>> {
        const params: CocktailApiParams = {
            name: cocktailName
        };
        return await this.search(params);
    }

    /**
     * Search for cocktails by list of ingredients.
     * @param cocktailIngredients Comma-separated list of ingredients
     * @returns Array of Cocktail instances
     */
    public static async searchIngredients(cocktailIngredients: string): Promise<Array<Cocktail>> {
        const params: CocktailApiParams = {
            ingredients: cocktailIngredients
        };
        return await this.search(params);
    }

    /**
     * Find a cocktail by id in an array of cocktails.
     * @param cocktails Haystack of cocktails to search in
     * @param id Needle id of cocktail
     * @returns The first cocktail matching specified id
     */
    public static inArray(cocktails: Array<Cocktail>, id: string): Cocktail | undefined {
        return cocktails.find(cocktail => {
            return cocktail.getId() == id;
        })
    }

    /**
     * Get the cocktail ingredients and method formatted in a
     * message embed object.
     * @returns Embed containing cocktail ingredients and instructions
     */
    public toEmbed(): EmbedBuilder {
        // Initialise embed
        const embed: EmbedBuilder = new EmbedBuilder().setColor(0x274437);

        // Set title
        embed.setTitle(this.getName());

        // Prepare ingredients
        const ingredientsField: APIEmbedField = {
            name: "Ingredients",
            value: ""
        };
        this.getIngredients().forEach((ingredient: string, index: number) => {
            if (index > 0) {
                ingredientsField.value += "\n";
            }
            // Add each ingredient to the list
            ingredientsField.value += ingredient;
        });

        // Prepare instructions
        const instructionsField: APIEmbedField = {
            name: "Instructions",
            value: this.getInstructions()
        };

        // Set ingredients and instructions
        embed.addFields([
            ingredientsField,
            instructionsField
        ]);

        return embed;
    }
}