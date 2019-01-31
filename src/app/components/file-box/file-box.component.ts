import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-box',
  templateUrl: './file-box.component.html',
  styleUrls: ['./file-box.component.scss']
})
export class FileBoxComponent implements OnInit {
  showNum : number = 2;
  constructor() { }

  ngOnInit() {
  }

  switchShowBtn(){
    if(this.showNum == 2){
      this.showNum = 0;
    } else {
      this.showNum = 2;
    }
  }
}
