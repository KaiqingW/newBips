import { Address } from './index';

export class Warehouse {
      constructor(
            public name: string,
            public address : Address,
            public phone_number: number,
            public description : string,
            public capacity : number,
            public id : number,
            public pivot: any,
            public amount : number
      ){}
}
