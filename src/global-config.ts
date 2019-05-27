export class GlobalConfig {
	public static readonly dev: boolean = process.arch === 'x64';
	public static readonly token: string = GlobalConfig.dev ? 'NTczMDY3MDczNzYxMzEyNzg3.XNHYyA.2YfNv0mPPMg76KbXiKAwRf6HFUk' : 'NTM0ODQwMTczNzM3ODAzODA2.Dx_cUg.pxQcRg9DVBzunPovzygCBTwpbpw';
	public static readonly adminPrefix: string = GlobalConfig.dev ? '!RBT ' : '!RB ';
	public static readonly basedir: string = __dirname;
	public static readonly dataDir: string = GlobalConfig.dev ? 'C:/Users/Max/Workspace/Typescript/bot/data' : '/home/pi/Bureaublad/data';
	public static readonly developers: Array<string> = ['178136842405675008'];
	public static readonly developerPrefix: string =  GlobalConfig.dev ? '$DT ' : '$D ';

	public static readonly devServer: string = '575395886117421083';
}