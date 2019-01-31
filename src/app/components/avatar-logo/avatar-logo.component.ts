import { Component, OnInit, Input, HostListener, ElementRef, Renderer, OnChanges } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'avatar-logo',
  templateUrl: './avatar-logo.component.html',
  styleUrls: ['./avatar-logo.component.scss']
})
export class AvatarLogoComponent implements OnInit {
  @Input() url: String;
  @Input() userFirstName: String;
  @Input() userLastName: String;

  // for showing this user's profile page
  @Input() userId: number;

  handler;

  constructor(private el: ElementRef,
              private renderer: Renderer,
              private router: Router) { }


  ngOnInit() {
    
  }

  ngOnChanges() {

    // subscribe
    this.handler = this.renderer.listen(this.el.nativeElement, 'click', event => {
      event.stopPropagation();
      // go into the user profile page
      if(this.userId){
        this.router.navigateByUrl(`/people/profile/${this.userId}`);
      }
      
    });

    // unsubscribe if no userId passed in, used when not to reach profile page after clicking the profile picture
    if (!this.userId) {
      this.handler();
    }
  }

}
