import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogComponent } from 'app/components/dialog/dialog.component';
import { DialogSureComponent } from 'app/components/dialog-sure/dialog-sure.component';
import { DialogAlertComponent } from 'app/components/dialog-alert/dialog-alert.component';
import { CustomizedDialogSureComponent } from 'app/components/customized-dialog-sure/customized-dialog-sure.component';
import { DialogYesComponent } from 'app/components/dialog-yes/dialog-yes.component';
@Injectable()
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
    });

    return dialogRef.afterClosed();
  }

  openSureDialog() {
    const dialogRef = this.dialog.open(DialogSureComponent, {
      width: '600px',
    });

    return dialogRef.afterClosed();
  }

  openAlertDialog(message) {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: '600px',
      data: {
        message: message
      }
    });

    return dialogRef.afterClosed();
  }

  openCustomizedSureDialog(message) {
    const dialogRef = this.dialog.open(CustomizedDialogSureComponent, {
      width: '600px',
      data: {
        message: message
      }
    });

    return dialogRef.afterClosed();
  }

  openCustomizedYesDialog(message){
    const dialogRef = this.dialog.open(DialogYesComponent, {
      width: '600px',
      data: {
        message: message
      }
    });

    return dialogRef.afterClosed();
  }

  openErrorDialog(message) {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: '600px',
      data: {
        message: message
      }
    });

    return dialogRef.afterClosed();
  }
}
