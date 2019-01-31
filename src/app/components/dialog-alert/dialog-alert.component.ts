import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.css']
})
export class DialogAlertComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
        
  }

  ngOnInit() {
  }

}
