import { Component, OnInit, Inject, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { OrdersService } from 'app/core/services/orders.service';
import { BusinessNotesService } from 'app/core/services/business-notes.service';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'add-notes-note',
  templateUrl: './add-notes-note.component.html',
  styleUrls: ['./add-notes-note.component.scss']
})

export class AddNotesNoteComponent implements OnInit {

  companyId : number;
  itemId : number;
  oinId : number;
  notesSubjectId: number;
  commentForm: FormGroup;
  imgsMap = new Map<number, string>();
  imgSrc = '';
  subNotesArr = [];
  selectedFile = null;
  selectedImgIndex : number;
  modalOpen = false;
  newCommentInfoCallBack;
  onSendDataToParent = new EventEmitter();

  constructor(private fb: FormBuilder, 
              private route: ActivatedRoute,
              private location:Location,
              private imageService: ImageService,
              private ordersService: OrdersService,
              private businessNotesService: BusinessNotesService,
              @Inject(MAT_DIALOG_DATA) public data: any){
              this.createCommentForm();

  }
  
  ngOnInit(){
      this.companyId = + this.data.companyId;
      this.itemId = + this.data.itemId;
      this.oinId = + this.data.oinId;
      this.notesSubjectId = + this.data.notesSubjectId;
  }

  createCommentForm(){
      this.commentForm = this.fb.group({
        body: this.fb.array([
          this.initSubNote()
        ])
      });
    }
    
    initSubNote(){
      return this.fb.group({
          img: [''],
          text: ['']
      });
    }
  
    onSave(){
      this.setImgInfoToFormData();
      // this.commentForm.value.body = JSON.stringify(this.commentForm.value.body);

      this.commentForm.value.body = JSON.stringify(this.commentForm.value.body.map(this.replaceLinbeBreak));
      this.newCommentInfoCallBack = this.commentForm.value;
      if(this.commentForm.valid){
        console.log(this.companyId, this.notesSubjectId,  this.commentForm.value);
          this.businessNotesService.addBusinessNotesNote(this.companyId, this.notesSubjectId,  this.commentForm.value).subscribe(
              (res) => {
                  this.newCommentInfoCallBack = this.commentForm.value;
                  this.newCommentInfoCallBack.created= {};
                  this.newCommentInfoCallBack.created.at = new Date();
                  this.onSendDataToParent.emit(this.newCommentInfoCallBack);
              }
          )
      }
    
    }
  
    setImgInfoToFormData(){
      this.imgsMap.forEach((imgUrl, index) => {
        this.commentForm.value.body[index].img = imgUrl;
      });
  
    }
   
  
    onFileSelected(event, index){
      if(event.target.files[0]){
        this.selectedImgIndex = index;
        this.selectedFile = <File>event.target.files[0];
        this.onAddImg(index);
      }
    }
  
    onAddImg(index){
        const fd = new FormData();
        fd.append('image', this.selectedFile, this.selectedFile.name);
        this.imageService.uploadImage(fd).subscribe(
            (res) => {
                // this.noteForm.value.description[index].img = res.url;
                this.imgsMap.set(index, res.url);
            },
            (err) => {
            }
        );
    }
  
  //   onAddMore(){   
  //       const control = <FormArray>this.noteForm.controls['description'];
  //       control.push(this.initSubNote());
  //   }
    
    getImg(i){
      let res = this.imgsMap.get(i);
      return res;
    }
  
    openModal(){
      this.modalOpen =true;
    } 
  
    closeModal(){
      this.modalOpen =false;
    }

   // replace \n using <br>, editted by yali
   replaceLinbeBreak(value) {
    value.text = value.text.replace(/(\n)+/g, '<br>')
    return value;
  }

}
