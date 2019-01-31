import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector:'note-card',
    templateUrl:'note-card.component.html',
    styleUrls:['note-card.component.scss']
})

export class NoteCardCompoennt implements OnInit{
    @Input() value;

    constructor(){

    }
    ngOnInit(){
    // console.log(this.value);
    }

    getContentFromText(value){
        // console.log(JSON.parse(value.description)[0].text);
        return JSON.parse(value.description)[0].text;
      

    }  
    getImgFromContent(value){
        let result = JSON.parse(value.description);
        return result[0].img;

    }
}