export class ReactionConf {
	public emoteIdentifier: string;
	public roleId: string;

	constructor(emoteIdentifier: string, roleId: string) {
		this.emoteIdentifier = emoteIdentifier;
		this.roleId = roleId;
	}
}
