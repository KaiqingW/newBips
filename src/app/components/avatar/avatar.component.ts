import { Component, Input, OnInit } from '@angular/core';

declare var jquery: any;
declare var $: any;

@Component({
    selector: 'avatar',
    templateUrl: 'avatar.component.html',
    styleUrls: ['avatar.component.scss']
})

export class AvatarComponent implements OnInit {
    @Input() url: String;

    ngOnInit() {
    }
}
