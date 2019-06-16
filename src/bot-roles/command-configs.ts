import { AddActiveChannelCommand } from '@bot-roles/commands/admin/active-channels/add';
import { ListActiveChannelCommand } from '@bot-roles/commands/admin/active-channels/list';
import { RemoveActiveChannelCommand } from '@bot-roles/commands/admin/active-channels/remove';
import { AdminHelpCommand } from '@bot-roles/commands/admin/help-command';
import { ListLogChannelCommand } from '@bot-roles/commands/admin/log-channel/list';
import { RemoveLogChannelCommand } from '@bot-roles/commands/admin/log-channel/remove';
import { SetLogChannelCommand } from '@bot-roles/commands/admin/log-channel/set';
import { AddModRoleCommand } from '@bot-roles/commands/admin/mod-roles/add';
import { ListModRoleCommand } from '@bot-roles/commands/admin/mod-roles/list';
import { RemoveModRoleCommand } from '@bot-roles/commands/admin/mod-roles/remove';
import { PrefixCommand } from '@bot-roles/commands/admin/prefix/prefix';
import { SetPrefixCommand } from '@bot-roles/commands/admin/prefix/set';
import { AddCategoryCommand } from '@bot-roles/commands/admin/roles/category/add';
import { ChangeCategoryNameCommand } from '@bot-roles/commands/admin/roles/category/change-name';
import { ListCategoryCommand } from '@bot-roles/commands/admin/roles/category/list';
import { RemoveCategoryCommand } from '@bot-roles/commands/admin/roles/category/remove';
import { CategorySwapCommand } from '@bot-roles/commands/admin/roles/category/swap';
import { AddEmoteCommand } from '@bot-roles/commands/admin/roles/emote/add';
import { ListEmoteCommand } from '@bot-roles/commands/admin/roles/emote/list';
import { RemoveEmoteCommand } from '@bot-roles/commands/admin/roles/emote/remove';
import { AddRoleCommand } from '@bot-roles/commands/admin/roles/role/add';
import { ListRoleCommand } from '@bot-roles/commands/admin/roles/role/list';
import { RemoveRoleCommand } from '@bot-roles/commands/admin/roles/role/remove';
import { EvalCommand } from '@bot-roles/commands/dev/eval-command';
import { PublicHelpCommand } from '@bot-roles/commands/public/help-command';
import { GetRoleCommand } from '@bot-roles/commands/public/roles/get-role';
import { RolesCommand } from '@bot-roles/commands/public/roles/roles';
import { CommandConfig } from '@classes/command-config';
import { CommandConfigs } from '@classes/commands-config';

export const COMMANDCONFIGS: CommandConfigs = {
	dev: [
		new CommandConfig(
			['EVAL', 'E'],
			EvalCommand,
		),
	],
	admin: [
		new CommandConfig(
			['LOG-CHANNEL', 'LC'],
			ListLogChannelCommand,
			[
				new CommandConfig(
					['SET', 'S'],
					SetLogChannelCommand,
				),
				new CommandConfig(
					['REMOVE', 'R'],
					RemoveLogChannelCommand,
				),
				new CommandConfig(
					['LIST', 'L'],
					ListLogChannelCommand,
				),
			],
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
							AddRoleCommand,
						),
						new CommandConfig(
							['REMOVE', 'R'],
							RemoveRoleCommand,
						),
						new CommandConfig(
							['LIST', 'L'],
							ListRoleCommand,
						),
					],
				),
				new CommandConfig(
					['EMOTE', 'E'],
					ListEmoteCommand,
					[
						new CommandConfig(
							['ADD', 'A'],
							AddEmoteCommand,
						),
						new CommandConfig(
							['REMOVE', 'R'],
							RemoveEmoteCommand,
						),
						new CommandConfig(
							['LIST', 'L'],
							ListEmoteCommand,
						),
					],
				),
				new CommandConfig(
					['CATEGORY', 'C'],
					ListCategoryCommand,
					[
						new CommandConfig(
							['ADD', 'A'],
							AddCategoryCommand,
						),
						new CommandConfig(
							['REMOVE', 'R'],
							RemoveCategoryCommand,
						),
						new CommandConfig(
							['LIST', 'L'],
							ListCategoryCommand,
						),
						new CommandConfig(
							['SWAP', 'S'],
							CategorySwapCommand,
						),
						new CommandConfig(
							['CHANGE', 'C'],
							ChangeCategoryNameCommand,
						),
					],
				),
			],
		),
		new CommandConfig(
			['ACTIVE-CHANNELS', 'AC'],
			ListActiveChannelCommand,
			[
				new CommandConfig(
					['ADD', 'A'],
					AddActiveChannelCommand,
				),
				new CommandConfig(
					['REMOVE', 'R'],
					RemoveActiveChannelCommand,
				),
				new CommandConfig(
					['LIST', 'L'],
					ListActiveChannelCommand,
				),
			],
		),
		new CommandConfig(
			['MOD-ROLES', 'MR'],
			ListModRoleCommand,
			[
				new CommandConfig(
					['ADD', 'A'],
					AddModRoleCommand,
				),
				new CommandConfig(
					['REMOVE', 'R'],
					RemoveModRoleCommand,
				),
				new CommandConfig(
					['LIST', 'L'],
					ListModRoleCommand,
				),
			],
		),
		new CommandConfig(
			['PREFIX', 'P'],
			PrefixCommand,
			[
				new CommandConfig(
					['SET', 'S'],
					SetPrefixCommand,
				),
			],
		),
		new CommandConfig(
			['HELP'],
			AdminHelpCommand,
		),
	],
	public: [
		new CommandConfig(
			['ROLES'],
			RolesCommand,
		),
		new CommandConfig(
			['GETROLE'],
			GetRoleCommand,
		),
		new CommandConfig(
			['REMOVEROLE'],
			RemoveRoleCommand,
		),
		new CommandConfig(
			['HELP'],
			PublicHelpCommand,
		),
	],
};

export function getCommandConfig(type: 'dev' | 'admin' | 'public', args: string[]): CommandConfig {
	let commandConfig = COMMANDCONFIGS[type].find((c: CommandConfig) => c.key.includes(args[0])) || false;

	args.splice(0, 1);

	if (!commandConfig) {
		return;
	}

	let final = false;
	while (commandConfig.subCommands && !final) {
		const newTrigger = commandConfig.getSubCommand(args[0]);
		if (newTrigger) {
			commandConfig = newTrigger as CommandConfig;
			args.splice(0, 1);
		} else {
			final = true;
		}
	}

	return commandConfig;
}
