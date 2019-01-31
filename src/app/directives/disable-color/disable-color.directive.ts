import { Directive, Input, HostListener, ElementRef, Renderer, OnChanges } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';

@Directive({
    selector: '[disableColor]'
})

export class DiableColorDirective implements OnChanges {
    @Input() data : any;
    @Input() styleProperty : string;
    @Input() styleValue : string;

    constructor(private el: ElementRef,
        private renderer: Renderer) { }

    ngOnChanges() {
        if(!this.data){
            this.renderer.setElementStyle(this.el.nativeElement, this.styleProperty, this.styleValue);
        } 
    }

}