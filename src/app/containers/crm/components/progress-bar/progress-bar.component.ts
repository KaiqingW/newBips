import { Component, Input, OnInit, ElementRef, Renderer, Output, EventEmitter } from "@angular/core";
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";
import { LeadService } from 'app/core/services/lead.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector:"progress-bar",
    templateUrl:"progress-bar.component.html",
    styleUrls:["progress-bar.component.scss"]
})

export class ProgressBarComponent implements OnInit{ 

    @Input() possibility;
    @Output() sendSelect = new EventEmitter<any>();
    @Input() customer_id;
    currentLoginCompanyId
    POSSIBILITY;
    handler;
    showSelect:boolean = false;;
    selects = ['10%','20%','30%', '40%', '50%', '60%','70%', '80%', '90%', '100%'];
    constructor(
        private el: ElementRef,
        private renderer: Renderer,
        private route: ActivatedRoute,
        private leadService: LeadService
  ){
      this.currentLoginCompanyId = +this.route.snapshot.paramMap.get('cid');
      if(!this.currentLoginCompanyId){
        //   this.currentLoginCompanyId = +this.route.snapshot.paramMap.get('vid')
      }
    //   console.log(this.currentLoginCompanyId);
    }

    ngOnInit(){
        this.handler = this.renderer.listen(this.el.nativeElement, 'click', enent=>{
            event.stopPropagation();
        });
        this.POSSIBILITY = (this.roundFun((100*this.possibility),0)+'%');
    }
    //Float to 5
    roundFun(value, n) {
        return Math.round(value*Math.pow(10,n))/Math.pow(10,n);
        
    }
    clickPossibility(){
        this.showSelect = true;
    }

    selectPossibility(value){
        this.POSSIBILITY = value;
        this.possibility = parseFloat(this.POSSIBILITY) / 100.0;
        this.showSelect = true;
        this.leadService.changeCustomerPossibility(this.currentLoginCompanyId, this.customer_id, this.possibility).subscribe(
            res=>{
            }
        )
    }

}