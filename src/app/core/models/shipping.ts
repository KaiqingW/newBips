export class Shipping{
    constructor(private date : string, 
                private container: string,
                private orderQty : number,
                private actualQty : number
                ){}
}