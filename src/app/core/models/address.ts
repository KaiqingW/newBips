export class Address {
    constructor(
        public country: string,
        public state: string,
        public city: string,
        public street1 : string,
        public street2 : string,
        public zipcode : number,
        public latitude: number,
        public longitude : number,
        public id : number
    ){}
}
