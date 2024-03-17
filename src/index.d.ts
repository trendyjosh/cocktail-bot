declare module "@sapphire/framework" {
  interface Preconditions {
    HasServer: never;
  }
}

declare module "@sapphire/pieces" {
  interface Container {
    controller: Controller;
  }
}

declare global {
  interface CocktailApiParams {
    name?: string;
    ingredients?: string;
  }
}

export default undefined;
