import { Directive, Input, HostListener, ElementRef, Renderer, OnChanges } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';

@Directive({
    selector: '[oneClick]'
})

export class OneClickDirective implements OnChanges {
    @Input() isLoading : boolean;

    constructor(private el: ElementRef,
        private renderer: Renderer) { }

    ngOnChanges() {
        if(this.isLoading){
            this.renderer.setElementAttribute(this.el.nativeElement, 'disabled', 'disabled');
        } else {
            this.renderer.setElementAttribute(this.el.nativeElement, 'disabled', null);
        }
    }

}