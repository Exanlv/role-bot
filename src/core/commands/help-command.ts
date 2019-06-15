import { BaseCommand } from "../base-command";
import { COMMANDCONFIGS, getCommandConfig } from "../command-configs";
import { List } from "../../shared/classes/list";
import { ListValue } from "../../shared/classes/list-value";
import { CommandConfig } from "../../shared/classes/command-config";

export class GeneralHelpCommand extends BaseCommand {
	public runCommand(mode: 'admin'|'public') {
		let commands: CommandConfig|Array<CommandConfig> = getCommandConfig(mode, this.args.join(' ').split(' '));
		let categoriesJoined = '';

		if (!commands) {
			commands = COMMANDCONFIGS[mode];
		}

		if (commands instanceof CommandConfig) {
			if (commands.subCommands) {
				commands = commands.subCommands;
			} else {
				commands = [commands]
			}
			categoriesJoined = this.args.join(' ') + ' ';
		}

		const prefix = (mode === 'admin' ? this.globalConfig.prefixes.admin : this.serverConfig.prefix);

		const list = new List;
		for (let i = 0; i < commands.length; i++) {
			const listValue = new ListValue;
			listValue.title = (prefix + categoriesJoined + commands[i].key[0]).toLowerCase();
			listValue.values.push(commands[i].commandClass.description || 'No description');

			if (commands[i].subCommands) {
				listValue.values.push(`More info: ${(`${prefix}help ${categoriesJoined} ${commands[i].key[0]}`).toLowerCase()}`);
			}

			list.values.push(listValue);
		}

		this.sendList(list);
	}
}