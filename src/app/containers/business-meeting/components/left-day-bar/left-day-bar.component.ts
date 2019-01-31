import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'left-day-bar',
  templateUrl: './left-day-bar.component.html',
  styleUrls: ['./left-day-bar.component.scss']
})
export class LeftDayBarComponent implements OnInit {

  @Input() requireDate;
  @Input() durationTime;
  POSSIBILITY;
  possibility;
  totalTime;
  leftTime;
  
  ngOnInit(){

    this.getLeftTime(this.requireDate);
    
    this.possibility = this.leftTime / this.durationTime;
    this.POSSIBILITY = (this.roundFun((100*this.possibility),0)+'%');
   
  }
  //Float to 5
  roundFun(value, n) {
      return Math.round(value*Math.pow(10,n))/Math.pow(10,n);      
  }

  getLeftTime(value) {
    let startDate = new Date();
    let endDate = new Date(value);
    let newEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59);
    if((newEndDate.getTime() - startDate.getTime())< 0){
      return this.leftTime =0;
    }else{
      let diffTime = Math.abs(newEndDate.getTime() - startDate.getTime()); 
      this.leftTime = Math.ceil(diffTime / (1000*60*60*24));
      return this.leftTime;
    }
  }

}
