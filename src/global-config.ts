export class GlobalConfig {
	public static readonly dev: boolean = process.arch === 'x64';
	public static readonly adminPrefix: string = GlobalConfig.dev ? '!RBT ' : '!RB ';
	public static readonly dataDir: string = GlobalConfig.dev ? 'C:/Users/Max/Documents/GitHub/role-bot/data' : '/home/pi/Bureaublad/data';
	public static readonly developers: Array<string> = ['178136842405675008', '583327931959607297'];
	public static readonly developerPrefix: string =  GlobalConfig.dev ? '$DT ' : '$D ';
	public static readonly color: string = GlobalConfig.dev ? '#A50200' : '#008CFF'

	public static readonly devServer: string = '575395886117421083';
}