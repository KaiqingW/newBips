import { Component,Input, OnInit, HostListener, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector:"warehouse-logo",
    templateUrl:"./warehouse-logo.component.html",
    styleUrls:["./warehouse-logo.component.scss"]
})

export class WarehouseLogoComponent implements OnInit{
    @Input() url:string;
    @Input() warehouseName:string;
    @Input() userId: number;
    // handler;
    warehouseNameLogo;

    constructor(
        private el: ElementRef,
        private renderer: Renderer,
        private router: Router){
    }

    ngOnInit(){
        // this.handler = this.renderer.listen(this.el.nativeElement, 'click', enent=>{
        //     event.stopPropagation();
        //     if(this.userId){
        //         this.router.navigateByUrl(`/people/profile/${this.userId}`);
        //     }
        // });

        // unsubscribe if no userId passed in, used when not to reach profile page after clicking the profile picture
        // if (!this.userId) {
        //     this.handler();
        // };

        if(!this.url){
            const companyName = this.warehouseName;
            if(companyName){
                const block = companyName.split(' ');
                if(block.length<2){
                    const companyNameFL = block[0][0];
                    this.warehouseNameLogo = companyNameFL.toUpperCase();
                }
                if(block.length>=2){
                     const companyNameFL = block[0][0];
                     const companyNameLL = block[1][0];
                     this.warehouseNameLogo = (companyNameFL + companyNameLL).toUpperCase();
                }
            }else{
                
            }
            
        }
    }

    
}