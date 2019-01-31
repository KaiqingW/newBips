import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'deadline-bar',
  templateUrl: './deadline-bar.component.html',
  styleUrls: ['./deadline-bar.component.scss']
})
export class DeadlineBarComponent implements OnInit {

  @Input() leftTime;
  @Input() durationTime;
  POSSIBILITY;
  possibility;
  totalTime;
  
  ngOnInit(){

    this.possibility = this.leftTime / this.durationTime;
    this.POSSIBILITY = (this.roundFun((100*this.possibility),0)+'%');
    // console.log(this.possibility);
    // console.log(this.POSSIBILITY);
    // console.log(this.leftTime);
    // console.log(+this.durationTime);
  }
  //Float to 5
  roundFun(value, n) {
      return Math.round(value*Math.pow(10,n))/Math.pow(10,n);
      
  }

}
