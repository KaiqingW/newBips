import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { UserService } from 'app/core/services/user.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { DialogService } from 'app/core/services/dialog.service';
import { concat } from 'rxjs/observable/concat';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  isLoading: Boolean = false;
  saveOnce: Boolean = true;

  // current project if necessary
  project;

  // current project id if necessary
  projectId;
  companyId;

  editProjectForm : FormGroup;
  imgsMap = new Map<number, string>();
  selectedImgIndex : number;
  selectedFile = null;
  processedFile = null;
  modalOpen = false;
  
  constructor(
      private businessMeetingService: BusinessMeetingService,
      private fb: FormBuilder,
      private router: Router,
      private toasterService: ToasterService,
      private location: Location,
      private userService: UserService,
      private route: ActivatedRoute,
      private imageService: ImageService,
      private dialogService: DialogService,
      private ng2ImgMax: Ng2ImgMaxService
  ) {
          // this.companyId = +this.route.snapshot.paramMap.get('cId');
        
          this.projectId = +this.route.snapshot.paramMap.get('projectId');
          this.companyId = +localStorage.getItem("currentLoginCompanyId");
          this.createEditProjectForm();

          this.getBriefSubject();
  }

  ngOnInit() {
      setTimeout(() => {
          const buttonClick = document.getElementById("header-submit-edit");
          buttonClick.addEventListener("click", () => {
          // sometimes both addSubjectForm.invalid and addSubjectForm.valid are false;

            if (!this.editProjectForm.invalid) {
              this.onSave();
            } else {
              let message = "Please fill all fields!";                
              this.dialogService.openAlertDialog(message);
            }
          });
        }, 0);

  }

  getBriefSubject() {
      this.businessMeetingService.getBriefProject(this.companyId, this.projectId).subscribe(
          res => {
              this.project = res;
              console.log(this.project);

              this.project.description = JSON.parse(this.project.description);

              // for text of decription, replace <br> using \n
              this.project.description[0].text = this.project.description[0].text.replace(/<br>/g, '\n')

              // add the img to imgsMap, to show the img
              this.imgsMap.set(0, this.project.description[0].img);
          }
      )
  }

  createEditProjectForm() {
      this.editProjectForm = this.fb.group({
          name: [""],
          description: this.fb.array([
              this.initSubNote()
          ]),
          // meeting_date: [''],
          // meeting_time: [''],
          // meeting_frequency: ['']
      });
  }

  initSubNote() {
      return this.fb.group({
          img: [''],
          text: ['']
      });
  }

  // replace \n using <br>, editted by yali
  replaceLinbeBreak(value) {
      value.text = value.text.replace(/(\n)+/g, '<br>');
      return value;
  }

  onSave() {
      if (this.editProjectForm.valid && this.saveOnce) {
          this.isLoading = true;
          this.saveOnce = false;
          this.setImgInfoToFormData();
          
          // replace \n using <br>, editted by yali
          let description;
          description = this.editProjectForm.value.description.map(this.replaceLinbeBreak);

          // add subject
          description = JSON.stringify(description);

          var request = {
              'name': this.editProjectForm.value.name, 
              'description' : description,
              // 'prev_meeting_project' : this.prevProjectId,
              // 'meeting_date' : this.addSubjectForm.value.meeting_date,
              // 'meeting_time' : this.addSubjectForm.value.meeting_time,
              // 'meeting_frequency' : this.addSubjectForm.value.meeting_frequency
          };
          
          this.businessMeetingService.editProject(this.companyId, this.projectId, request).subscribe(
              
              res => {
                this.location.back();
              },
              err => {
                  console.log("Edit Project Error!");
              }
          );
      }
  }

  setImgInfoToFormData(){
      this.imgsMap.forEach((imgUrl, index) => {
        this.editProjectForm.value.description[index].img = imgUrl;
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

                  // show dialog if the user does not upload image
                  let message = "Please only upload image here. If you need to upload pdf, doc or excel, please upload them at attachment part.";
                  this.dialogService.openAlertDialog(message);
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
              // this.noteForm.value.description[index].img = res.url;
              this.imgsMap.set(index, res.url);
          },
          (err) => {
              this.isLoading = false;
          }
      );
  }

  onAddMore(){   
      const control = <FormArray>this.editProjectForm.controls['description'];
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
      if(this.editProjectForm.controls.description['controls'].length > 1){
          const control = <FormArray>this.editProjectForm.controls['description'];
          control.removeAt(i);
          this.imgsMap.delete(i);
      }
  }    
}
