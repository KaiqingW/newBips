import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ToasterService {
    constructor(private snackBar: MatSnackBar) {

    }
    showToaster(message: string, action: string = '', duration: number = 3000) {
        this.snackBar.open(message, action, {
            duration: duration
        });
    }
}
