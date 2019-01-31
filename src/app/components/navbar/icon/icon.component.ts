import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'icon',
    templateUrl: 'icon.component.html',
    styleUrls: ['icon.component.scss']
})

export class IconComponent {
    @Input() icon: String;
    @Input() name: String;
    @Input() link: String;

    constructor(
        private router: Router
    ){ }

    onClick(){
        this.router.navigate(['/' + this.link]);
    }
}