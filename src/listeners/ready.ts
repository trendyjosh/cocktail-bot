import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, SapphireClient } from "@sapphire/framework";
import { ActivityType } from "discord.js";

@ApplyOptions<Listener.Options>({
  once: true,
  event: Events.ClientReady,
})
export class ReadyListener extends Listener<typeof Events.ClientReady> {
  run(client: SapphireClient) {
    // client.user?.setActivity("cool games", { type: ActivityType.Playing });
  }
}
