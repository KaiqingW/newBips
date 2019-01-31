import { Component, OnInit, EventEmitter, Output,Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {
  public date = moment();
  public daysArr;
  selectedDay;
  @Output() changeDate = new EventEmitter<any>();
  @Output() changeMonth = new EventEmitter<any>();
  @Input() shippings;

  constructor() {
    this.daysArr = this.createCalendar(this.date);
  }

  ngOnInit() {
  }

  ngOnChanges(){
    if(this.shippings){
      this.count();
    }
  }

  public createCalendar(month) {
    let firstDay = moment(month).startOf('M');
    let days = Array.apply(null, { length: month.daysInMonth() })
      .map(Number.call, Number)
      .map(n => {
        return moment(firstDay).add(n, 'd');
      });
    for (let n = 0; n < firstDay.weekday(); n++) {
      days.unshift(null);
    }
    return days;
  }

  public nextMonth() {
    this.date.add(1, 'M');
    this.daysArr = this.createCalendar(this.date);
    let dayFormatted = this.date.format('YYYY-MM-DD');

    this.changeMonth.emit(dayFormatted);

  }

  public previousMonth() {
    this.date.subtract(1, 'M');
    this.daysArr = this.createCalendar(this.date);
    let dayFormatted = this.date.format('YYYY-MM-DD');
    this.changeMonth.emit(dayFormatted);
  }

  public todayCheck(day) {
    if (!day) {
      return false;
    }
    return moment().format('L') === day.format('L');
  }

  public selectedDate(day) {
    let dayFormatted = day.format('MM/DD/YYYY');
    this.selectedDay = day;
    this.onSendDate(dayFormatted);
  }

  onSendDate(date){
    this.changeDate.emit(date);
  }

  count(){
    let set = new Set<string>();
    for(var i = 0; i < this.shippings.length; i++){
      let ship_day;
      if(!set.has(this.shippings[i].container_number)){
        set.add(this.shippings[i].container_number);
      } else {
        continue;
      }

      // this.shippings[i].eta_date is a date doesnt reconized by mobile,
      // so need to split it. And recreate a new date.
      let arr = this.shippings[i].eta_date.split(/[- :]/);
      let date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
      ship_day = new Date(date).getDate();

      for(var j =0; j < this.daysArr.length; j++){
        if(this.daysArr[j] != null){
          let calendar_day = new Date(this.daysArr[j]).getDate();
          // alert(calendar_day);
          if(ship_day == calendar_day){
            if(!this.daysArr[j].hasOwnProperty('count')){
              this.daysArr[j]['count'] = 1;
            } else {
              this.daysArr[j]['count']++;
            }
          } else if (ship_day < calendar_day){
            continue;
          } 
        }
        
      }
    }
  }

  public isSelected(day) {
    if (!day) {
      return false;
    }
    if(day == this.selectedDay){
      return true;
    }
  }
}
