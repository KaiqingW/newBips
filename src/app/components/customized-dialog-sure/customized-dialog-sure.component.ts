import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'customized-dialog-sure',
  templateUrl: './customized-dialog-sure.component.html',
  styleUrls: ['./customized-dialog-sure.component.scss']
})
export class CustomizedDialogSureComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CustomizedDialogSureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
        
  }

  ngOnInit() {
  }

}
