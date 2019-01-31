import {Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector : 'contact-bar',
    templateUrl : './contact-bar.component.html',
    styleUrls: ["./contact-bar.component.scss"]
})


export class ContactBarComponent{
    @Input() account;
    @Output() sendNavTo = new EventEmitter<any>();
    constructor(){
        // console.log(this.account);
    }

    navTo(event, account, type){
        event.stopPropagation();
        this.sendNavTo.emit({
            account,
            type
        });
    }
}

