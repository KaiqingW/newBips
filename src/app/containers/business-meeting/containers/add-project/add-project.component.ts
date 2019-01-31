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

import { error } from 'util';

@Component({
  selector: 'add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {  
    // all the subjects including personal and shared subjects
    subjectList;

    // for angular material mat-autocomplete
    // filteredSubjects: Observable<any[]>;

    isLoading: Boolean = false;

    // check whether it is uploading images
    isUploadingImg = false;

    // current subject if necessary
    subjectName;

    // current subject id if necessary
    subjectId;
    companyId = 0;

    sharedOrNot;

    // add project
    addProjectForm: FormGroup;
    imgsMap = new Map<number, string>();
    selectedImgIndex : number;
    selectedFile = null;
    processedFile = null;
    
    modalOpen = false;

    saveOnce: Boolean = true;

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
        private ng2ImgMax: Ng2ImgMaxService
    ) {
        this.subjectId = +this.route.snapshot.paramMap.get('subjectId');
        this.sharedOrNot =localStorage.getItem('meeting_key_switch');
        this.companyId = +localStorage.getItem("currentLoginCompanyId");
        
        this.isLoading = true;
        this.createAddProjectForm();
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

    createAddProjectForm() {
        this.addProjectForm = this.fb.group({
            name : [''],
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
                'company_meeting_subject_id' : this.subjectId,
                'name' : this.addProjectForm.value.name,
                'description' : description,
                'type' : 'project',
                'target_date' : ""
            };
            this.businessMeetingService.addProject(this.companyId, request).subscribe(
                res => {
                    this.location.back();
                },
                err => {
                    console.log("add project error");
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

                    // show dialog if the user does not upload image
                    let message = "Please only upload image here. If you need to upload pdf, doc or excel, please upload them at attachment part.";
                    this.dialogService.openAlertDialog(message);
                }
            );
            // end
        }
    }
    
    // add processedFile
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
