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
     * Get the name of this cocktail.
     * @returns The cocktail name
     */
    public getName(): string {
        return this.name;
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
}