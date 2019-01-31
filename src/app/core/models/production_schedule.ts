export class Production_Schedule {
    constructor(
        public ifFinish : boolean,
        public ets_time : string,
        public etf_time : string,
        public prod_rate : number,
        public production_qty : number,
        public comment: string = '',
        public createAt: any
    ){}
}