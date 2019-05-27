import { ListValue } from "./list-value";

export class List {
	public title?: string = null;
	public color: string = '#008CFF';
	public values: Array<ListValue> = [];
	public thumbnail?: string = 'https://www.landviz.nl/host/logogrey-small.png';
}