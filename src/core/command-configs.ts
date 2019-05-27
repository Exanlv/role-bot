import { CommandConfigs } from '../shared/classes/commands-config';
import { CommandConfig } from '../shared/classes/command-config';

export const COMMANDCONFIGS: CommandConfigs = {
	dev: [
		new CommandConfig(
			['EVAL', 'E'],
			'EvalCommand',
			'eval-command'
		)
	],
	admin: [
		new CommandConfig(
			['HELP'],
			'HelpCommand',
			'help-command'
		),
		new CommandConfig(
			['SELF-ASSIGN', 'SA'],
			'ListRoleCommand',
			'roles/role/list',
			[
				new CommandConfig(
					['ROLE', 'R'],
					'ListRoleCommand',
					'roles/role/list',
					[
						new CommandConfig(
							['ADD', 'A'],
							'AddRoleCommand',
							'roles/role/add'
						),
						new CommandConfig(
							['REMOVE', 'R'],
							'RemoveRoleCommand',
							'roles/role/remove'
						),
						new CommandConfig(
							['LIST', 'L'],
							'ListRoleCommand',
							'roles/role/list'
						)
					]
				),
				new CommandConfig(
					['EMOTE', 'E'],
					'ListEmoteCommand',
					'roles/emote/list',
					[
						new CommandConfig(
							['ADD', 'A'],
							'AddEmoteCommand',
							'roles/emote/add'
						),
						new CommandConfig(
							['REMOVE', 'R'],
							'RemoveEmoteCommand',
							'roles/emote/remove'
						),
						new CommandConfig(
							['LIST', 'L'],
							'ListEmoteCommand',
							'roles/emote/list'
						)
					]
				),
				new CommandConfig(
					['CATEGORY', 'C'],
					'ListCategoryCommand',
					'roles/category/list',
					[
						new CommandConfig(
							['ADD', 'A'],
							'AddCategoryCommand',
							'roles/category/add'
						),
						new CommandConfig(
							['REMOVE', 'R'],
							'RemoveCategoryCommand',
							'roles/category/remove'
						),
						new CommandConfig(
							['LIST', 'L'],
							'ListCategoryCommand',
							'roles/category/list'
						),
						new CommandConfig(
							['CHANGE', 'C'],
							'ChangeCategoryNameCommand',
							'roles/category/change-name'
						),
						new CommandConfig(
							['SWAP', 'S'],
							'CategorySwapCommand',
							'roles/category/swap'
						)
					]
				)
			]
		),
		new CommandConfig(
			['ACTIVE-CHANNELS', 'AC'],
			'ListActiveChannelCommand',
			'active-channels/list',
			[
				new CommandConfig(
					['ADD', 'A'],
					'AddActiveChannelCommand',
					'active-channels/add'
				),
				new CommandConfig(
					['REMOVE', 'R'],
					'RemoveActiveChannelCommand',
					'active-channels/remove'
				),
				new CommandConfig(
					['LIST', 'L'],
					'ListActiveChannelCommand',
					'active-channels/list'
				)
			]
		),
		new CommandConfig(
			['MOD-ROLES', 'MR'],
			'ListModRoleCommand',
			'mod-roles/list',
			[
				new CommandConfig(
					['ADD', 'A'],
					'AddModRoleCommand',
					'mod-roles/add',
				),
				new CommandConfig(
					['REMOVE', 'R'],
					'RemoveModRoleCommand',
					'mod-roles/remove',
				),
				new CommandConfig(
					['LIST', 'L'],
					'ListModRoleCommand',
					'mod-roles/list',
				)
			]
		),
		new CommandConfig(
			['PREFIX', 'P'],
			'PrefixCommand',
			'prefix/prefix',
			[
				new CommandConfig(
					['SET', 'S'],
					'SetPrefixCommand',
					'prefix/set'
				)
			]
		)
	],
	public: [
		new CommandConfig(
			['ROLES'],
			'RolesCommand',
			'roles/roles'
		),
		new CommandConfig(
			['GETROLE'],
			'GetRoleCommand',
			'roles/get-role'
		),
		new CommandConfig(
			['REMOVEROLE'],
			'RemoveRoleCommand',
			'roles/remove-role'
		),
		new CommandConfig(
			['HELP'],
			'HelpCommand',
			'help-command'
		)
	]
}

export function getCommandConfig(type: 'dev' | 'admin' | 'public', args: Array<string>) {
	let CommandConfig = COMMANDCONFIGS[type].find(c => c.key.includes(args[0])) || false;

	args.splice(0, 1);

	if (!CommandConfig) {
		return false;
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
