import { ListValue } from "./list-value";
import { GlobalConfig } from "../../global-config";

export class List {
	public title?: string = null;
	public color: string = GlobalConfig.color;
	public values: Array<ListValue> = [];
	public thumbnail?: string = 'https://www.landviz.nl/host/logogrey-small.png';
}