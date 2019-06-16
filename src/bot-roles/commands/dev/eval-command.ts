import { BaseCommand, BaseCommandInterface } from "@classes/base-command";

export class EvalCommand extends BaseCommand implements BaseCommandInterface {
	public runCommand() {
		const messageSplit = this.message.content.split(' ');
		messageSplit.splice(0, 2);
		const code = messageSplit.join(' ').trim().replace(/\`\`\`/g, '');
		try {
			eval(code);
		} catch(err) {
			this.message.member.send(err).catch(e => {});
		}
	}
}