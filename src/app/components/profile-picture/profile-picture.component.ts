import { Component, OnInit, Input, HostListener, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit {

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
