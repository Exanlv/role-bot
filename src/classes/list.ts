import { ListValue } from "@classes/list-value";

export class List {
	public title?: string = null;
	public color: string;
	public values: Array<ListValue> = [];
	public thumbnail?: string = 'https://www.landviz.nl/host/logogrey-small.png';
}