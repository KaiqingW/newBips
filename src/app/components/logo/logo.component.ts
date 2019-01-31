import { Component, Input, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'logo',
    templateUrl: 'logo.component.html',
    styleUrls: ['logo.component.scss']
})

export class LogoComponent implements OnInit{
    @Input() url: String;
    @Input() companyName: String;
    @Input() type : Number;


    @HostBinding('style.width.px') @Input() width: Number;
    @HostBinding('style.height.px') @Input() height: Number;
    @HostBinding('style.font-size.px') @Input() fontSize: Number;

    ngOnInit(){
    }
}
