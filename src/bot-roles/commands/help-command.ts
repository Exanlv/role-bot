import { COMMANDCONFIGS, getCommandConfig } from '@bot-roles/command-configs';
import { BaseCommand } from '@classes/base-command';
import { CommandConfig } from '@classes/command-config';
import { List } from '@classes/list';
import { ListValue } from '@classes/list-value';

export class GeneralHelpCommand extends BaseCommand {
	public static description: string = 'Brings up this menu';

	public runCommand(mode: 'admin'|'public'): void {
		let commands: CommandConfig|CommandConfig[] = getCommandConfig(mode, this.args.join(' ').split(' '));
		let categoriesJoined = '';

		if (!commands) {
			commands = COMMANDCONFIGS[mode];
		}

		if (commands instanceof CommandConfig) {
			if (commands.subCommands) {
				commands = commands.subCommands;
			} else {
				commands = [commands];
			}
			categoriesJoined = this.args.join(' ') + ' ';
		}

		const prefix = (mode === 'admin' ? this.globalConfig.prefixes.admin : this.serverConfig.prefix);

		const list = new List();
		for (let i = 0; i < commands.length; i++) {
			const listValue = new ListValue();
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
