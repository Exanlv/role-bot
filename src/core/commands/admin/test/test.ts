import { AdminCommand } from "../_admin";
import { BaseCommandInterface } from "../../../base-command";

export class Test extends AdminCommand implements BaseCommandInterface{
	public runCommand() {
		this.sendMessage(`\`\`\`${JSON.stringify(this.serverConfig.selfAssign.getAllReactions())}\`\`\``);
	}
}