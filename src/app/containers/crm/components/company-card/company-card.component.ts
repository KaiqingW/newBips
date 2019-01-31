import { Component, Input, OnChanges,ElementRef,  OnInit, Renderer} from "@angular/core";
import { Router } from '@angular/router';

@Component({
    selector:"company-card",
    templateUrl:"company-card.component.html",
    styleUrls:["company-card.component.scss"]
})

export class CompanyCardComponent implements OnInit{
    @Input() url:string;
    @Input() name:string;
    @Input() industry:string;
    @Input() usage :string;
    @Input() possibility:string;
    @Input() orderCapacity:string;
    @Input() type: number;
    @Input() value;
    currentDateTime;
    handler;

    constructor(
        private renderer: Renderer,
        private el: ElementRef,
        private router: Router
    ){
        this.currentDateTime = new Date().valueOf();
    }
    ngOnChanges(){
        this.getLevelTwoCategory(this.industry);
    }

    ngOnInit(){
        
    }

    getLevelTwoCategory(value){
        // console.log(value);
        if(!value){
            return;
        }
        if(value&&!value.includes('=>')&&!value.includes('["')){
            return value;
        }

        if(value.includes('=>')){
            if(value){
                let target = value;
                let num = target.indexOf('=>');
                if(num > 0){
                return  this.industry = target.substring(num + 2);
                }else{
                return;
                }
            }
        }

        if(typeof(JSON.parse(value))=='object'){
            // console.log('array');
            // console.log(value);
            // console.log(JSON.parse(this.industry).length);
                if(JSON.parse(this.industry).length >= 3){
                    return this.industry = JSON.parse(value)[2];
                }else if(JSON.parse(this.industry).length == 2){
                    return this.industry = JSON.parse(value)[1];
                }else if(JSON.parse(this.industry).length == 1){
                    return this.industry = JSON.parse(value)[0];
                }else{
                    return this.industry = '';
                }
        } 
    }

    assignAtTime(){
        return new Date(this.value.assign_at).valueOf()+365*24*60*60*1000; 
    }
    
  
}