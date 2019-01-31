import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
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
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { error } from 'util';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { InventoryService } from 'app/core/services/inventory.service';

@Component({
  selector: 'edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

    // all the subjects including personal and shared subjects
    subjectList;
    
      // for angular material mat-autocomplete
      // filteredSubjects: Observable<any[]>;
  
      isLoading: Boolean = false;
  
      // check whether it is uploading images
      isUploadingImg = false;
  
      // current subject if necessary
      subjectName;

      project;
      projectId;
  
      // current subject id if necessary
      subjectId;
      companyId = 0;
  
      // sharedOrNot;
  
      // add project
      addProjectForm: FormGroup;
      imgsMap = new Map<number, string>();
      selectedImgIndex : number;
      selectedFile = null;
      processedFile = null;
      
      modalOpen = false;
  
      saveOnce: Boolean = true;
  
      // for angular material mat-chip-list and input
      visible = true;
      selectable = true;
      removable = true;
      addOnBlur = true;
  
      // for angular material mat-autocomplete
      filteredProducts: Observable<any[]>;
    
      // check whether user input is valid email address
      emailCtrl: FormControl = new FormControl();
      finalInput;
  
      // this variable is for change the event order of (matChipInputTokenEnd) in input and (optionSelected) in mat-autocomplete
      selectedUserName;
    
      // separator to separate user input as chips
      separatorKeysCodes = [ENTER, COMMA];
  
      productItemNumList: Array<string> = [];
      selectedProductId;
  
      // requireDateCtrl: FormControl;
      // updateFrequencyCtrl: FormControl;
      // durationTime = 0;
      // newDurationTime;
  
      constructor(
          private businessMeetingService: BusinessMeetingService,
          private fb: FormBuilder,
          private router: Router,
          private toasterService: ToasterService,
          private location: Location,
          private userService: UserService,
          private route: ActivatedRoute,
          private dialogService: DialogService,
          private imageService: ImageService,
          private ng2ImgMax: Ng2ImgMaxService,
          private departmentOpportunityService: DepartmentOpportunityService,
          private inventoryService: InventoryService,
  
      ) {
          this.projectId = +this.route.snapshot.paramMap.get('oppoProjectId');        
          this.subjectId = +this.route.snapshot.paramMap.get('oppoSubjectId');
          // this.sharedOrNot =localStorage.getItem('meeting_key_switch');
          this.companyId = +localStorage.getItem("currentLoginCompanyId");
          
          this.isLoading = true;
          this.createAddProjectForm();
          this.getBriefProject();
  
          // this.requireDateCtrl = new FormControl({value: '', disabled: false});        
          // this.updateFrequencyCtrl = new FormControl({value: '', disabled: false});
  
          // this.requireDateCtrl.valueChanges.subscribe(
          //     (term) => {
          //       this.getDurationTime(this.requireDateCtrl.value);
          //       this.newDurationTime = this.durationTime + " days";
          //     }
          //   );
  
          this.emailCtrl.valueChanges.subscribe(
              (term)=>{
                this.onSearch(term);
                this.finalInput = term;
              }
            )
      }
  
      ngOnInit() {
          // add listener to the save button in the header tool bar
          setTimeout(() => {
              const buttonClick = document.getElementById('header-submit-edit');
              buttonClick.addEventListener('click', () => {
                  if (!this.addProjectForm.invalid) {
                      this.onSave();
                  } else {
                      let message = "Please fill all fields!";                    
                      this.dialogService.openAlertDialog(message);
                  }
              });
          }, 0);
  
          // if this.id exists, then only adding notes within this subject is allowed
          // else create new form to add new subject and new notes
          if (!this.subjectId) {
              this.isLoading = false;
          } else {
              this.businessMeetingService.getSubject(this.companyId, this.subjectId).subscribe(res => {
                  this.subjectName = res.name;
                  // this.createForm();
      
                  this.isLoading = false;
              }, err => {console.log(err); this.isLoading = false; });
          }
      }
  
      // when user input the date, automatically calculate the duration time of the project
      // getDurationTime(value) {
      //     if (value == null) {
      //     this.durationTime = 0;
      //     return this.durationTime;
      //     }
      //     let startDate = new Date();
      //     let endDate = new Date(value);
      //     let newEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59);
      //     let diffTime = Math.abs(newEndDate.getTime() - startDate.getTime());
      //     this.durationTime = Math.ceil(diffTime / (1000*60*60*24));
      //     return this.durationTime;
      // }

      getBriefProject() {
        this.businessMeetingService.getBriefProject(this.companyId, this.projectId).subscribe(
            res => {
                this.project = res;
  
                this.project.description = JSON.parse(this.project.description);
  
                // for text of decription, replace <br> using \n
                this.project.description[0].text = this.project.description[0].text.replace(/<br>/g, '\n')
  
                // add the img to imgsMap, to show the img
                this.imgsMap.set(0, this.project.description[0].img);

                this.productItemNumList[0] = this.project.product_item_number;
                
            }
        )
    }
  
  
      // search email start
      //search input string
      onSearch(value){
          this.inventoryService.searchProductFuzzy(this.companyId, "headline", value).subscribe(
          res=>{
              this.filteredProducts = res.data;        
          }
          )
      }
  
      // for adding new chips after input token ends
      add(event: MatChipInputEvent): void {
          setTimeout(e => {
          const input = event.input;
          const value = this.selectedUserName || event.value;
          
          if ((value || '').trim()) {
              //     value = value.trim().toLowerCase();
              if (!this.productItemNumList.includes(value)) {
                  // because the array will only have one user name, when input new user, 
                  // just use the new user to replace the old one, editted by yali
                  this.productItemNumList[0] = value;
              }
          }
          
          // Reset the input value
          if (input) {
              input.value = '';
          }
          this.selectedUserName = '';
          }, 0);
      }
  
      // remove email from productItemNumList
      remove(email: any): void {
          const index = this.productItemNumList.indexOf(email);
          if (index >= 0) {
          this.productItemNumList.splice(index, 1);
          }
  
          this.selectedProductId = null;
          
      }
  
      getSlectedProductInfo(value){
          // record the contact_id of the user, sned back to backend for add share and owner
          this.selectedProductId = value.id;
  
          // if((!this.phoneNumberList.includes(value.phone))&&(value.phone !== "")){
          //     this.phoneNumberList.push(value.phone);
          // }
  
      }
  
      // In default, add function add runs before selectOption.
      // To change the event order, set timeout in add function and use selectedUserName  to pass the clicked value from autocomplete list
      selectOption(event) {
          this.selectedUserName = event.option.value;
      }
  
      // search end
  
      createAddProjectForm() {
          this.addProjectForm = this.fb.group({
              name : [''],            
              duration_time : [''],
              description: this.fb.array([
                  this.initSubNote()
              ]),
              // target_date : ['']
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
          if (this.addProjectForm.valid && this.saveOnce) {
              this.isLoading = true;
              this.saveOnce = false;
              this.setImgInfoToFormData();
  
              // replace \n using <br>, editted by yali
              let description;
              description = this.addProjectForm.value.description.map(this.replaceLinbeBreak);
  
              // convert to string
              description = JSON.stringify(description);
  
              var request = {
                  // for add sales-project
                //   'company_meeting_subject_id' : this.subjectId,
                  'name' : this.addProjectForm.value.name,
                  'product_item_number' : this.productItemNumList[0],
                  'product_id' : this.selectedProductId,
                  'description' : description,
                
  
                  // for add owner and share
                  // 'owner_contact_id' : this.selectedUserContactId,
                  // "require_date" : this.requireDateCtrl.value,
                  // "update_frequency" : this.updateFrequencyCtrl.value,
                  // "duration_time" : this.durationTime
              };
              this.businessMeetingService.editProject(this.companyId, this.projectId, request).subscribe(
                  res => {
                      this.isLoading = false;
                      this.location.back();
                  },
                  err => {
                      this.isLoading = false;      
                      this.location.back();                   
                      
                  }
              );
          }
      }
  
      setImgInfoToFormData(){
          this.imgsMap.forEach((imgUrl, index) => {
              this.addProjectForm.value.description[index].img = imgUrl;
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
                  
                  // this.noteForm.value.description[index].img = res.url;
                  this.imgsMap.set(index, res.url);
              },
              (err) => {
                  this.isLoading = false;
                  
              }
          );
      }
      
      onAddMore(){   
          const control = <FormArray>this.addProjectForm.controls['description'];
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
          if(this.addProjectForm.controls.description['controls'].length > 1){
              const control = <FormArray>this.addProjectForm.controls['description'];
              control.removeAt(i);
              this.imgsMap.delete(i);
          }
      }
  
  }
    
  