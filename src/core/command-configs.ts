import { CommandConfigs } from '../shared/classes/commands-config';
import { CommandConfig } from '../shared/classes/command-config';
import { EvalCommand } from './commands/dev/eval-command';
import { PublicHelpCommand } from './commands/public/help-command';
import { ListLogChannelCommand } from './commands/admin/log-channel/list';
import { SetLogChannelCommand } from './commands/admin/log-channel/set';
import { RemoveLogChannelCommand } from './commands/admin/log-channel/remove';
import { ListRoleCommand } from './commands/admin/roles/role/list';
import { AddRoleCommand } from './commands/admin/roles/role/add';
import { RemoveRoleCommand } from './commands/admin/roles/role/remove';
import { ListEmoteCommand } from './commands/admin/roles/emote/list';
import { AddEmoteCommand } from './commands/admin/roles/emote/add';
import { RemoveEmoteCommand } from './commands/admin/roles/emote/remove';
import { ListCategoryCommand } from './commands/admin/roles/category/list';
import { AddCategoryCommand } from './commands/admin/roles/category/add';
import { RemoveCategoryCommand } from './commands/admin/roles/category/remove';
import { ChangeCategoryNameCommand } from './commands/admin/roles/category/change-name';
import { CategorySwapCommand } from './commands/admin/roles/category/swap';
import { ListActiveChannelCommand } from './commands/admin/active-channels/list';
import { AddActiveChannelCommand } from './commands/admin/active-channels/add';
import { RemoveActiveChannelCommand } from './commands/admin/active-channels/remove';
import { ListModRoleCommand } from './commands/admin/mod-roles/list';
import { AddModRoleCommand } from './commands/admin/mod-roles/add';
import { RemoveModRoleCommand } from './commands/admin/mod-roles/remove';
import { PrefixCommand } from './commands/admin/prefix/prefix';
import { SetPrefixCommand } from './commands/admin/prefix/set';
import { RolesCommand } from './commands/public/roles/roles';
import { GetRoleCommand } from './commands/public/roles/get-role';
import { AdminHelpCommand } from './commands/admin/help-command';

export const COMMANDCONFIGS: CommandConfigs = {
	dev: [
		new CommandConfig(
			['EVAL', 'E'],
			EvalCommand
		)
	],
	admin: [
		new CommandConfig(
			['LOG-CHANNEL', 'LC'],
			ListLogChannelCommand,
			[
				new CommandConfig(
					['SET', 'S'],
					SetLogChannelCommand
				),
				new CommandConfig(
					['LIST', 'L'],
					ListLogChannelCommand
				),
				new CommandConfig(
					['REMOVE', 'R'],
					RemoveLogChannelCommand
				)
			]
		),
		new CommandConfig(
			['SELF-ASSIGN', 'SA'],
			ListRoleCommand,
			[
				new CommandConfig(
					['ROLE', 'R'],
					ListRoleCommand,
					[
						new CommandConfig(
							['ADD', 'A'],
							AddRoleCommand
						),
						new CommandConfig(
							['REMOVE', 'R'],
							RemoveRoleCommand
						),
						new CommandConfig(
							['LIST', 'L'],
							ListRoleCommand
						)
					]
				),
				new CommandConfig(
					['EMOTE', 'E'],
					ListEmoteCommand,
					[
						new CommandConfig(
							['ADD', 'A'],
							AddEmoteCommand
						),
						new CommandConfig(
							['REMOVE', 'R'],
							RemoveEmoteCommand
						),
						new CommandConfig(
							['LIST', 'L'],
							ListEmoteCommand
						)
					]
				),
				new CommandConfig(
					['CATEGORY', 'C'],
					ListCategoryCommand,
					[
						new CommandConfig(
							['ADD', 'A'],
							AddCategoryCommand
						),
						new CommandConfig(
							['REMOVE', 'R'],
							RemoveCategoryCommand
						),
						new CommandConfig(
							['LIST', 'L'],
							ListCategoryCommand
						),
						new CommandConfig(
							['CHANGE', 'C'],
							ChangeCategoryNameCommand
						),
						new CommandConfig(
							['SWAP', 'S'],
							CategorySwapCommand
						)
					]
				)
			]
		),
		new CommandConfig(
			['ACTIVE-CHANNELS', 'AC'],
			ListActiveChannelCommand,
			[
				new CommandConfig(
					['ADD', 'A'],
					AddActiveChannelCommand
				),
				new CommandConfig(
					['REMOVE', 'R'],
					RemoveActiveChannelCommand
				),
				new CommandConfig(
					['LIST', 'L'],
					ListActiveChannelCommand
				)
			]
		),
		new CommandConfig(
			['MOD-ROLES', 'MR'],
			ListModRoleCommand,
			[
				new CommandConfig(
					['ADD', 'A'],
					AddModRoleCommand
				),
				new CommandConfig(
					['REMOVE', 'R'],
					RemoveModRoleCommand
				),
				new CommandConfig(
					['LIST', 'L'],
					ListModRoleCommand
				)
			]
		),
		new CommandConfig(
			['PREFIX', 'P'],
			PrefixCommand,
			[
				new CommandConfig(
					['SET', 'S'],
					SetPrefixCommand
				)
			]
		),
		new CommandConfig(
			['HELP'],
			AdminHelpCommand
		)
	],
	public: [
		new CommandConfig(
			['ROLES'],
			RolesCommand
		),
		new CommandConfig(
			['GETROLE'],
			GetRoleCommand
		),
		new CommandConfig(
			['REMOVEROLE'],
			RemoveRoleCommand
		),
		new CommandConfig(
			['HELP'],
			PublicHelpCommand
		)
	]
}

export function getCommandConfig(type: 'dev' | 'admin' | 'public', args: Array<string>): CommandConfig {
	let CommandConfig = COMMANDCONFIGS[type].find(c => c.key.includes(args[0])) || false;

	args.splice(0, 1);

	if (!CommandConfig) {
		return;
	}

	let final = false;
	while (CommandConfig.subCommands && !final) {
		let newTrigger = CommandConfig.getSubCommand(args[0]);
		if (newTrigger) {
			CommandConfig = newTrigger as CommandConfig;
			args.splice(0, 1);
		} else {
			final = true;
		}
	}

	return CommandConfig;
}
