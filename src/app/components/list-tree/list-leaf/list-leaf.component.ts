import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';

@Component({
  selector: 'app-list-leaf',
  templateUrl: './list-leaf.component.html',
  styleUrls: ['./list-leaf.component.scss']
})
export class ListLeafComponent implements OnInit {
  @Input() list;
  @Output() sendRadio = new EventEmitter<any>();
  @Output() sendCategory = new EventEmitter<any>();
  showChildren = new Set();
  category;
  // categoryForm : FormGroup;
  editItem;
  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  open(i){
    if(!this.showChildren.has(i)){
      this.showChildren.add(i);
    }
  }
  
  close(i){
    if(this.showChildren.has(i)){
      this.showChildren.delete(i);
    }
  }

  getIndent(item){
    let level = item.level;
    let indent = level * 48;
    if(item.children && item.children.length == 0){
      indent += 24;
    }
    let indentTxt = indent + 'px';
    return {
      'width': indentTxt};
  }

  getInputIndent(item){
    let level = item.level;
    if(level == 0){
      level += 2;
    } else {
      level = (level + 1) * 2;
    }
    let indent = level * 24;
    let indentTxt = indent + 'px';
    return {
      'width' : indentTxt
    } 
  }

  checkChildren(i){
    if(this.showChildren.has(i)){
      return true;
    } else {
      return false;
    }
  }

  onSelectRadio(item){
    this.sendRadio.emit(item);
  }

  onGetRadio(item){
    this.onSelectRadio(item);
  }

  onAddCategory(item, i){
    this.open(i);
    let ifAdd = true;
    item.children.forEach(
      (each) => {
        if(!each.name){
          ifAdd = false;
        }
      }
    )
    if(ifAdd){
      item.children.push(
        {
          name : '',
          parent_id : item.id,
          level: item.level + 1,
          children : null,
          action: 'add'
        }
      )
    }
 
  }

  onAddOuterCategory(){
    this.list.push(
      {
        name : '',
        level: 0,
        children : null,
        action: 'add'
      }
    )
  }

  deleteCate(i){
    this.list.splice(i , 1);
  }

  saveCate(item){ 
    item.name = this.category;
    if(item.name){
      this.sendCategory.emit(item);
    } 
  }

  onGetCate(item){
    this.sendCategory.emit(item);
  }

  onDropCategory(item){
    item.action = "drop";
    this.sendCategory.emit(item);
  }

  onEditCategory(item){
    this.createEditForm(item);
    this.editItem = item;
  }

  onSaveEditForm(item){
    if(this.editForm.valid){
      item.action = "edit";
      item.name = this.editForm.value.name;
      this.sendCategory.emit(item);
    }
  }

  createEditForm(item){
    this.editForm = this.fb.group({
      name : [item.name]
    });
  }
}
