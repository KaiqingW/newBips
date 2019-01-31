import { Component, Input, OnInit, ElementRef, Renderer, Output, EventEmitter } from "@angular/core";
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";
import { LeadService } from 'app/core/services/lead.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'oppo-dollar-progress-bar',
  templateUrl: './oppo-dollar-progress-bar.component.html',
  styleUrls: ['./oppo-dollar-progress-bar.component.scss']
})
export class OppoDollarProgressBarComponent implements OnInit {

  @Input() customer_id;
  @Input() completedOpportunityDollarAmount;
  @Input() totalRequiredOpportunityDollarAmount;

  currentLoginCompanyId;
  POSSIBILITY;
  handler;
  possibility;
  
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

  }

  ngOnInit(){
      this.handler = this.renderer.listen(this.el.nativeElement, 'click', enent=>{
          event.stopPropagation();
      });

      this.possibility = this.completedOpportunityDollarAmount / this.totalRequiredOpportunityDollarAmount;  
      this.POSSIBILITY = (this.roundFun((100*this.possibility),0)+'%');

  }
  //Float to 5
  roundFun(value, n) {
      return Math.round(value*Math.pow(10,n))/Math.pow(10,n);
      
  }
  

}
