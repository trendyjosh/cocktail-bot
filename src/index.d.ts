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

export default undefined;
