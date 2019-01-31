import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { AuthService } from 'app/core/services/auth.service';
import { DialogService } from 'app/core/services/dialog.service';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  currentLoginCompanyId;
  projectId;
  isLoading;
  briefProject;

  sharedOrNot;
  addCommentForm;
  saveOnce: Boolean = true;
  imgsMap = new Map<number, string>();
  selectedImgIndex : number;
  selectedFile = null;
  processedFile = null;
  
  modalOpen = false;
  
  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private imageService: ImageService,
    private authService: AuthService,
    private location: Location,
    private ng2ImgMax: Ng2ImgMaxService
    
      
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('oppoProjectId');
    this.sharedOrNot =localStorage.getItem('meeting_key_switch');
    
    this.isLoading = true;
    this.getBriefProject();
    this.createAddStatusForm();    
   }

  ngOnInit() {
    // add listener to the save button in the header tool bar
    setTimeout(() => {
        const buttonClick = document.getElementById('header-submit-edit');
        buttonClick.addEventListener('click', () => {
            if (!this.addCommentForm.invalid) {
                this.onSave();
            }else {
                let message = "Please fill all fields!";                    
                this.dialogService.openAlertDialog(message);
            }
        });
    }, 0);
  }

  getBriefProject() {
    this.businessMeetingService.getBriefProject(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.briefProject = res;        
        this.isLoading = false;
      }
    )
  }

  createAddStatusForm() {
    this.addCommentForm = this.fb.group({
        body: this.fb.array([
            this.initSubNote()
        ]),
        complete : ['']
    });
  }

  initSubNote() {
      return this.fb.group({
          img: [''],
          text: ['']
      })
  }

  // replace \n using <br>, editted by yali
  replaceLinbeBreak(value) {
    value.text = value.text.replace(/(\n)+/g, '<br>')
    return value;
  }

  onSave() {
      if (this.addCommentForm.valid && this.saveOnce) {
          this.isLoading = true;
          this.saveOnce = false;
          this.setImgInfoToFormData();

          // replace \n using <br>, editted by yali
          let body;
          body = this.addCommentForm.value.body.map(this.replaceLinbeBreak);

          // convert to string
          body = JSON.stringify(body);

          var request = {
              'company_meeting_project_id' : this.projectId,
              'body' : body,
              'type' : 'comment',
              // 'complete' : this.addStatusForm.value.complete
          };
          this.businessMeetingService.addStatus(this.currentLoginCompanyId, request).subscribe(
              res => {
                  this.location.back();
              },
              err => {
                  console.log("add comment error");
              }
          );
      }
  }

  setImgInfoToFormData(){
      this.imgsMap.forEach((imgUrl, index) => {
          this.addCommentForm.value.body[index].img = imgUrl;
      });
  }

  onFileSelected(event, index){
      if(event.target.files[0]){
        this.isLoading = true;
        
          this.selectedImgIndex = index;
          this.selectedFile = <File>event.target.files[0];
          
          // resize the image, set width to 600, and height resized accordingly to keep the aspect ratio the same. editted by yali
          this.ng2ImgMax.resizeImage(this.selectedFile, 600, 10000).subscribe(
            (res) => {
                this.isLoading = false;
                this.processedFile = new File([res], res.name);
                
                this.onAddImg(index);             
            },
            (err) => {
                this.isLoading = false;                    
                console.log('😢 Oh no!', err);
            }
        );
      }
  }

  onAddImg(index){
    this.isLoading = true;
    
      const fd = new FormData();
      fd.append('image', this.processedFile, this.processedFile.name);

      this.imageService.uploadImage(fd).subscribe(
          (res) => {
            this.isLoading = false;
            
              this.imgsMap.set(index, res.url);
          },
          (err) => {
            this.isLoading = false;
            
          }
      );
  }

  onAddMore(){   
      const control = <FormArray>this.addCommentForm.controls['body'];
      control.push(this.initSubNote());
  }

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

  onDelete(i){
      if(this.addCommentForm.controls.body['controls'].length > 1){
          const control = <FormArray>this.addCommentForm.controls['body'];
          control.removeAt(i);
          this.imgsMap.delete(i);
      }
  }

}
