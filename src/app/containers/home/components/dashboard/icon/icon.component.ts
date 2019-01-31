import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'icon',
    templateUrl: 'icon.component.html',
    styleUrls: ['icon.component.scss']
})

export class IconComponent {
    @Input() icon: String;
    @Input() name: String;
    @Input() link: String;
    @Input() url : string;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ){ }

    onClick(){
        if(this.link == 'company/237/vrm/main-vendor/1'){
            this.router.navigate(['/' + this.link], { queryParams: { company: 'PPI'}});
        }else{
            this.router.navigate(['/' + this.link]);
        }
           
    }
}