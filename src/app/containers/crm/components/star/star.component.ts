import { Component, Input, OnChanges,ElementRef,  OnInit, Renderer} from "@angular/core";
import { Router, ActivatedRoute  } from '@angular/router';
import { LeadService } from 'app/core/services/lead.service';

@Component({
    selector:'star',
    templateUrl:'star.component.html',
    styleUrls:['star.component.scss']
})

export class StarComponent implements OnInit{

    @Input() value;
    handler;
    currentLoginCompanyId;
    constructor(
        private renderer: Renderer,
        private el: ElementRef,
        private router: Router,
        private route: ActivatedRoute,
        private leadService: LeadService
    ){
        this.currentLoginCompanyId = +this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit(){
        this.handler = this.renderer.listen(this.el.nativeElement, 'click', enent=>{
            event.stopPropagation();
        });
    }

    toggleStar(){
        if(this.value.mark == 0){
            this.value.mark = 1
            this.leadService.markCustomerImportant(this.currentLoginCompanyId, this.value.id).subscribe(
                res=>{

                }
            )
        }else{
            this.value.mark = 0;
            this.leadService.markCustomerNotImportant(this.currentLoginCompanyId, this.value.id).subscribe(
                res=>{

                }
            )
        }
    }
}
