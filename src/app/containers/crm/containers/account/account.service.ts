import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class Account{ 
    constructor(
        public id: number,
        public name: string,
        public industry: string,
        public possibility: string,
        public usage: string,
        public logo_url: string
    ){}
}

const ACCOUNTS = [
    new Account(1,"1234","Tech","0.2","20,000","assets/images/testimg/pepsi.png"),
    new Account(2,"123412","Inds","0.6","50,000","assets/images/testimg/google-logo.jpg"),
    new Account(3,"1234","Tech","0.2","200","assets/images/testimg/lego.png"),
    new Account(4,"App54235le","Tech","0.2","2000","assets/images/testimg/logo-logo.png"),
    new Account(5,"orcas1234mart USA","Tech","0.9","20,000","assets/images/testimg/b.png"),
    new Account(6,"orcas1234mart USA","Tech","0.2","20,000","assets/images/testimg/apple.png"),
];

export class Contact{
    constructor(
        public id: number,
        public name: string,
        public avatar_url: string
    ){}
};

const CONTACTS =[
    new Contact(1,"Tom","assets/images/testimg/useravatar2.png"),
    new Contact(2,"Jack","assets/images/testimg/useravatar2.png"),
    new Contact(3,"Orca","assets/images/testimg/useravatar2.png"),
    new Contact(4,"Thmos Edison","assets/images/testimg/useravatar2.png"),
    new Contact(5,"Yadong Liu asdaf","assets/images/testimg/useravatar2.png"),
    new Contact(6,"asdf asdf asdf","assets/images/testimg/useravatar2.png"),
];

export class Product{
    constructor(
        public id: number,
        public name: string,
        public img_url: string
    ){}
};

const PRODUCTS = [
    new Product(1, "Sprite Can", "assets/images/testimg/brandy-bottle.png"),
    new Product(2, "Beer Bottle", "assets/images/testimg/sprite.png"),
    new Product(3, "Chicken", "assets/images/testimg/glass-bottle.jpg"),
]

export class accountDetial{
    constructor(
        public id: number,
        public name: string,
        public industry:string,
        public possibility:string,
        public usage: string,
        public logo_url: string,
        public telephone: string,
        public fax: string,
        public email: string,
        public website: string,
        public address: string,
        public description: string,
        public contacts: Contact[],
        public products: Product[],

    ){}
}

const ACCOUNTDETIALS =[
    new accountDetial(1,"orcasmart","Tech","20%","20,000","assets/images/testimg/useravatar2.png",
                "5169747088","123-123-1234","simon@gmial.com","www.orcasmart.com","35 Engel street, Hicksville, NY 11801","Whats the reason behind 127.0.0.1 this is just unnecessary most people probably want to test their apps on mobile too. And accessing the dev environment over lan is the easiest way to do so. Can we make the 0.0.0.0 to be the default please? ",
                [
                    new Contact(1,"Tom","assets/images/testimg/useravatar2.png"),
                    new Contact(13,"Jack","assets/images/testimg/useravatar2.png")
                ],
                [
                    new Product(1, "Sprite Can", "assets/images/testimg/brandy-bottle.png"),
                    new Product(2, "Beer Bottle", "assets/images/testimg/sprite.png"),
                    new Product(3, "Mount", "assets/images/testimg/glass-bottle.jpg"),

                ]),
    new accountDetial(2,"Glopak","Inds","30%","50,000","assets/images/testimg/useravatar2.png",
                "123-123-1234","123-123-1234","simon@gmial.com","www.orcasmart.com","35 Engel street, Hicksville, NY 11801","Whats the reason behind 127.0.0.1 this is just unnecessary most people probably want to test their apps on mobile too. And accessing the dev environment over lan is the easiest way to do so. Can we make the 0.0.0.0 to be the default please? ",
                [
                    new Contact(3,"Orca","assets/images/testimg/useravatar2.png"),
                     new Contact(4,"Thmos Edison","assets/images/testimg/useravatar2.png")
                ],
                [
                    new Product(1, "Sprite Can", "assets/images/testimg/glass-bottle.jpg"),
                    new Product(3, "cup", "assets/images/testimg/coffee.png")
                ]),
    new accountDetial(3,"Google","Tech","50%","200","assets/images/testimg/useravatar2.png",
                "123-123-1234","123-123-1234","simon@gmial.com","www.orcasmart.com","35 Engel street, Hicksville, NY 11801","Whats the reason behind 127.0.0.1 this is just unnecessary most people probably want to test their apps on mobile too. And accessing the dev environment over lan is the easiest way to do so. Can we make the 0.0.0.0 to be the default please? ",
                [ 
                    new Contact(3,"Orca","assets/images/testimg/useravatar2.png"),
                    new Contact(4,"Thmos Edison","assets/images/testimg/useravatar2.png")
                ],
                [
                    new Product(1, "Sprite Can", "assets/images/testimg/brandy-bottle.png"),
                    new Product(2, "Beer Bottle", "assets/images/testimg/sprite.png"),
                    new Product(3, "Mount", "assets/images/testimg/glass-bottle.jpg"),
                ]),
    new accountDetial(4,"Google","Tech","50%","200","assets/images/testimg/useravatar2.png",
                "123-123-1234","123-123-1234","simon@gmial.com","www.orcasmart.com","35 Engel street, Hicksville, NY 11801","Whats the reason behind 127.0.0.1 this is just unnecessary most people probably want to test their apps on mobile too. And accessing the dev environment over lan is the easiest way to do so. Can we make the 0.0.0.0 to be the default please? ",
                [ 
                    new Contact(3,"Orca","assets/images/testimg/useravatar2.png"),
                    new Contact(4,"Thmos Edison","assets/images/testimg/useravatar2.png")
                ],
                [
                    new Product(1, "Sprite Can", "assets/images/testimg/brandy-bottle.png"),
                    new Product(2, "Beer Bottle", "assets/images/testimg/sprite.png"),
                    new Product(3, "Mount", "assets/images/testimg/glass-bottle.jpg"),
                ]),
    new accountDetial(5,"Google","Tech","50%","200","assets/images/testimg/useravatar2.png",
                "123-123-1234","123-123-1234","simon@gmial.com","www.orcasmart.com","35 Engel street, Hicksville, NY 11801","Whats the reason behind 127.0.0.1 this is just unnecessary most people probably want to test their apps on mobile too. And accessing the dev environment over lan is the easiest way to do so. Can we make the 0.0.0.0 to be the default please? ",
                [ 
                    new Contact(3,"Orca","assets/images/testimg/useravatar2.png"),
                    new Contact(4,"Thmos Edison","assets/images/testimg/useravatar2.png")
                ],
                [
                    new Product(1, "Sprite Can", "assets/images/testimg/brandy-bottle.png"),
                    new Product(2, "Beer Bottle", "assets/images/testimg/sprite.png"),
                    new Product(3, "Mount", "assets/images/testimg/glass-bottle.jpg"),
                ]),
    new accountDetial(6,"Google","Tech","50%","200","assets/images/testimg/useravatar2.png",
                "123-123-1234","123-123-1234","simon@gmial.com","www.orcasmart.com","35 Engel street, Hicksville, NY 11801","Whats the reason behind 127.0.0.1 this is just unnecessary most people probably want to test their apps on mobile too. And accessing the dev environment over lan is the easiest way to do so. Can we make the 0.0.0.0 to be the default please? ",
                [ 
                    new Contact(3,"Orca","assets/images/testimg/useravatar2.png"),
                    new Contact(4,"Thmos Edison","assets/images/testimg/useravatar2.png")
                ],
                [
                    new Product(1, "Sprite Can", "assets/images/testimg/brandy-bottle.png"),
                    new Product(2, "Beer Bottle", "assets/images/testimg/sprite.png"),
                    new Product(3, "Mount", "assets/images/testimg/glass-bottle.jpg"), 
                ]),

];

@Injectable()
export class AccountService{
    getAccountList() {return Observable.of(ACCOUNTS); }

    getAccountdetials() {return Observable.of(ACCOUNTDETIALS); }

    getAccount(id:number | string){
        return this.getAccountdetials()
        .map(accountlist =>accountlist.find(account => account.id === + id));
    }
}