import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "edit-text",
  templateUrl: "./editText.html",
  styleUrls: ["./editText.scss"]
})
export class EditTextComponent implements OnInit {
  @Input() hasContent: boolean;
  @Output() onSaveChange = new EventEmitter<any>();

  content;
  editMode = false;
  defaultContent;

  constructor() {}

  ngOnInit() {}

  onAdd() {
    this.editMode = true;
  }

  onContentChanged(event) {
    this.content = event;
  }

  onEdit(event) {
    this.defaultContent = event.target.parentNode.parentNode.getElementsByClassName(
      "textContent"
    )[0].innerHTML;
    this.editMode = true;
  }

  onSave() {
    this.onSaveChange.emit(this.content);
    this.hasContent = true;
    this.editMode = false;
  }

  onCancel() {
    this.editMode = false;
  }
}
