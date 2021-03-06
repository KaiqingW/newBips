import { Component, OnInit, OnChanges, Input, HostListener, Output, ElementRef, Renderer, EventEmitter } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";

@Component({
  selector: 'app-select-bar',
  templateUrl: './select-bar.component.html',
  styleUrls: ['./select-bar.component.scss']
})
export class SelectBarComponent implements OnInit {
  @Input() selects;
  @Input() placeholder;
  @Input() default;
  @Output() sendSelect = new EventEmitter<any>();
  statusForm: FormGroup;

  constructor(private fb : FormBuilder) { }

  ngOnInit() {
    this.createStatusForm();

    this.statusForm.valueChanges.subscribe(
      (res) => {
        this.sendSelect.emit(this.statusForm.value);
      }
    )
  }

 

  createStatusForm(){
    this.statusForm = this.fb.group({
      status: [this.default]
    })
  }
}
