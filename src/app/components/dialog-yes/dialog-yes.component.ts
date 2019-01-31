import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    selector: 'dialog-yes',
    templateUrl:'./dialog-yes.component.html',
    styleUrls: ['./dialog-yes.component.scss']
})

export class DialogYesComponent implements OnInit{
    constructor(
        public dialogRef: MatDialogRef<DialogYesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
      ) {
            
      }
    
      ngOnInit() {
      }
}