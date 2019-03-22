import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

import { Router, ActivatedRoute } from '@angular/router';

import { InventoryService } from 'app/core/services/inventory.service';
// import { timingSafeEqual } from 'crypto';

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
  description;
  imgId;
  // categoryForm : FormGroup;
  editItem;
  editForm: FormGroup;
  cropper: ImageCropperComponent;
  modalOpenCropImage = false;
  companyId;
  colors = [];
  getImg;
  // options: Object = {
  //   placeholderText: 'Edit Your Content Here!',
  //   charCounterCount: false
  // };
  editorContent: string = 'My Document\'s Title';

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
  ) {
    // this.companyId = this.route.snapshot.paramMap.get('cid');
    // let letters = '0123456789ABCDEF';
    // let color = '#';
    // for (var i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    //   console.log(color);
    // }
    // this.colors.push(color);
    // console.log(this.colors);
  }

  ngOnInit() {
    console.log(this.list);
  }

  open(i) {
    if (!this.showChildren.has(i)) {
      this.showChildren.add(i);
    }
  }

  close(i) {
    if (this.showChildren.has(i)) {
      this.showChildren.delete(i);
    }
  }

  getIndent(item) {
    let level = item.level;
    let indent = level * 48;
    if (item.children && item.children.length == 0) {
      indent += 24;
    }
    let indentTxt = indent + 'px';
    return {
      'width': indentTxt
    };
  }

  getLevelColor(level) {
    let colors = ["black", "blue", "red", "orange", "green", "pink", "yellow", "brown", "purple"];

    switch (level) {
      case level:
        // return { 'color': this.colors[0] };
      return  {'color' : colors[level]};
      // return { 'color': color };
    }
  }

  getInputIndent(item) {
    let level = item.level;
    if (level == 0) {
      level += 2;
    } else {
      level = (level + 1) * 2;
    }
    let indent = level * 24;
    let indentTxt = indent + 'px';
    return {
      'width': indentTxt
    }
  }

  checkChildren(i) {
    if (this.showChildren.has(i)) {
      return true;
    } else {
      return false;
    }
  }

  onSelectRadio(item) {
    this.sendRadio.emit(item);
  }

  onGetRadio(item) {
    this.onSelectRadio(item);
  }

  onAddCategory(item, i) {
    this.open(i);
    let ifAdd = true;
    item.children.forEach(
      (each) => {
        if (!each.name) {
          ifAdd = false;
        }
      }
    )
    if (ifAdd) {
      item.children.push(
        {
          name: '',
          parent_id: item.id,
          level: item.level + 1,
          children: null,
          action: 'add'
        }
      )
    }

  }

  onAddOuterCategory() {
    this.list.push(
      {
        name: '',
        level: 0,
        children: null,
        action: 'add'
      }
    )
  }

  deleteCate(i) {
    this.list.splice(i, 1);
  }

  saveCate(item) {
    let data = {
      "name": this.category,
      "description": this.description,
      "type": "product",
      // "parent_id" : 1,
      "image_id": this.imgId
    }
    item.name = this.category;
    item.description = this.description;
    item.type = 'product';
    // item.parent_id = 3;
    item.image_id = this.imgId ? this.imgId[0] : "";
    console.log(item);
    if (item.name) {
      this.sendCategory.emit(item);
    }
    console.log(data);
    // this.inventoryService.addCategory(this.companyId, data);
  }

  onGetCate(item) {
    this.sendCategory.emit(item);
    console.log(item);
  }

  onDropCategory(item) {
    item.action = "drop";
    this.sendCategory.emit(item);
  }

  onEditCategory(item) {
    this.createEditForm(item);
    this.editItem = item;
    console.log(item);
    this.getImg = item.image;
    console.log(this.getImg);
  }

  onSaveEditForm(item) {
    if (this.editForm.valid) {
      item.action = "edit";
      item.name = this.editForm.value.name;
      item.description = this.editForm.value.description;
      item.image_id = this.imgId ? this.imgId[0] : "";
      this.sendCategory.emit(item);
      console.log(item);
    }
  }

  createEditForm(item) {
    this.editForm = this.fb.group({
      name: [item.name],
      description: [item.description]
    });
  }

  // onFileChange(event) {
  //   if(event.target.files.length > 0) {
  //       let file = event.target.files[0];
  //       const myReader: FileReader = new FileReader();
  //       const image = new Image();
  //       myReader.onloadend = (loadEvent: any) => {
  //           // image.onload = (event) => {
  //           //     if(image.height < 3000 && image.width < 3000) {
  //           //         this.cropper.setImage(image);
  //           //     }else {
  //           //         alert(`Image too large. close this box and wait for a few seconds.`);
  //           //         this.cropper.setImage(image);
  //           //     }
  //           // };
  //           image.src = loadEvent.target.result;
  //           console.log(image.src);
  //           this.imgId = image.id;
  //       };
  //       myReader.readAsDataURL(file);
  //       this.modalOpenCropImage = true;
  //   }
  // }
  onReceiveImgs(imgs) {
    imgs = imgs.map((img) => {
      return img['id'];
    })
    this.imgId = imgs;
  }

}
