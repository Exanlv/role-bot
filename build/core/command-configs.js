"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_config_1 = require("../shared/classes/command-config");
exports.COMMANDCONFIGS = {
    dev: [
        new command_config_1.CommandConfig(['EVAL', 'E'], 'EvalCommand', 'eval-command')
    ],
    admin: [
        new command_config_1.CommandConfig(['HELP'], 'HelpCommand', 'help-command'),
        new command_config_1.CommandConfig(['LOG-CHANNEL', 'LC'], 'ListLogChannelCommand', 'log-channel/list', [
            new command_config_1.CommandConfig(['SET', 'S'], 'SetLogChannelCommand', 'log-channel/set'),
            new command_config_1.CommandConfig(['LIST', 'L'], 'ListLogChannelCommand', 'log-channel/list'),
            new command_config_1.CommandConfig(['REMOVE', 'R'], 'RemoveLogChannelCommand', 'log-channel/remove')
        ]),
        new command_config_1.CommandConfig(['SELF-ASSIGN', 'SA'], 'ListRoleCommand', 'roles/role/list', [
            new command_config_1.CommandConfig(['ROLE', 'R'], 'ListRoleCommand', 'roles/role/list', [
                new command_config_1.CommandConfig(['ADD', 'A'], 'AddRoleCommand', 'roles/role/add'),
                new command_config_1.CommandConfig(['REMOVE', 'R'], 'RemoveRoleCommand', 'roles/role/remove'),
                new command_config_1.CommandConfig(['LIST', 'L'], 'ListRoleCommand', 'roles/role/list')
            ]),
            new command_config_1.CommandConfig(['EMOTE', 'E'], 'ListEmoteCommand', 'roles/emote/list', [
                new command_config_1.CommandConfig(['ADD', 'A'], 'AddEmoteCommand', 'roles/emote/add'),
                new command_config_1.CommandConfig(['REMOVE', 'R'], 'RemoveEmoteCommand', 'roles/emote/remove'),
                new command_config_1.CommandConfig(['LIST', 'L'], 'ListEmoteCommand', 'roles/emote/list')
            ]),
            new command_config_1.CommandConfig(['CATEGORY', 'C'], 'ListCategoryCommand', 'roles/category/list', [
                new command_config_1.CommandConfig(['ADD', 'A'], 'AddCategoryCommand', 'roles/category/add'),
                new command_config_1.CommandConfig(['REMOVE', 'R'], 'RemoveCategoryCommand', 'roles/category/remove'),
                new command_config_1.CommandConfig(['LIST', 'L'], 'ListCategoryCommand', 'roles/category/list'),
                new command_config_1.CommandConfig(['CHANGE', 'C'], 'ChangeCategoryNameCommand', 'roles/category/change-name'),
                new command_config_1.CommandConfig(['SWAP', 'S'], 'CategorySwapCommand', 'roles/category/swap')
            ])
        ]),
        new command_config_1.CommandConfig(['ACTIVE-CHANNELS', 'AC'], 'ListActiveChannelCommand', 'active-channels/list', [
            new command_config_1.CommandConfig(['ADD', 'A'], 'AddActiveChannelCommand', 'active-channels/add'),
            new command_config_1.CommandConfig(['REMOVE', 'R'], 'RemoveActiveChannelCommand', 'active-channels/remove'),
            new command_config_1.CommandConfig(['LIST', 'L'], 'ListActiveChannelCommand', 'active-channels/list')
        ]),
        new command_config_1.CommandConfig(['MOD-ROLES', 'MR'], 'ListModRoleCommand', 'mod-roles/list', [
            new command_config_1.CommandConfig(['ADD', 'A'], 'AddModRoleCommand', 'mod-roles/add'),
            new command_config_1.CommandConfig(['REMOVE', 'R'], 'RemoveModRoleCommand', 'mod-roles/remove'),
            new command_config_1.CommandConfig(['LIST', 'L'], 'ListModRoleCommand', 'mod-roles/list')
        ]),
        new command_config_1.CommandConfig(['PREFIX', 'P'], 'PrefixCommand', 'prefix/prefix', [
            new command_config_1.CommandConfig(['SET', 'S'], 'SetPrefixCommand', 'prefix/set')
        ])
    ],
    public: [
        new command_config_1.CommandConfig(['ROLES'], 'RolesCommand', 'roles/roles'),
        new command_config_1.CommandConfig(['GETROLE'], 'GetRoleCommand', 'roles/get-role'),
        new command_config_1.CommandConfig(['REMOVEROLE'], 'RemoveRoleCommand', 'roles/remove-role'),
        new command_config_1.CommandConfig(['HELP'], 'HelpCommand', 'help-command')
    ]
};
function getCommandConfig(type, args) {
    let CommandConfig = exports.COMMANDCONFIGS[type].find(c => c.key.includes(args[0])) || false;
    args.splice(0, 1);
    if (!CommandConfig) {
        return;
    }
    let final = false;
    while (CommandConfig.subCommands && !final) {
        let newTrigger = CommandConfig.getSubCommand(args[0]);
        if (newTrigger) {
            CommandConfig = newTrigger;
            args.splice(0, 1);
        }
        else {
            final = true;
        }
    }
    return CommandConfig;
}
exports.getCommandConfig = getCommandConfig;
