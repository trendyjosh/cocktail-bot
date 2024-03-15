import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommandDeniedPayload, Listener, UserError } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
  event: "chatInputCommandDenied",
})
export class ChatInputCommandDenied extends Listener {
  run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    if (interaction.deferred || interaction.replied) {
      return interaction.editReply({
        content: error.message,
      });
    }
    return interaction.reply({
      content: error.message,
      ephemeral: true,
    });
  }
}
