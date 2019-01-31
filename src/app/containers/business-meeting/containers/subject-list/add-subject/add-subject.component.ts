import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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
    selector: 'add-subject',
    templateUrl: 'add-subject.component.html',
    styleUrls: ['add-subject.component.scss']
})

export class AddSubjectComponent implements OnInit {

    @ViewChild('fileInput')
    myFileInput: ElementRef;

    isLoading: Boolean = false;
    saveOnce: Boolean = true;

    // current subject if necessary
    subject;

    // current subject id if necessary
    subjectId;
    companyId;
    sharedUser;
    prevProjectId;

    addSubjectForm : FormGroup;
    imgsMap = new Map<number, string>();
    selectedImgIndex : number;
    selectedFile = null;
    processedFile = null;
    modalOpen = false;
    prevProjectSubjectName;

    meetingTime = [
        // "	6:00	"	,
        // "	6:15	"	,
        // "	6:30	"	,
        // "	6:45	"	,
        // "	7:00	"	,
        // "	7:15	"	,
        // "	7:30	"	,
        // "	7:45	"	,
        "	8:00	"	,
        "	8:15	"	,
        "	8:30	"	,
        "	8:45	"	,
        "	9:00	"	,
        "	9:15	"	,
        "	9:30	"	,
        "	9:45	"	,
        "	10:00	"	,
        "	10:15	"	,
        "	10:30	"	,
        "	10:45	"	,
        "	11:00	"	,
        "	11:15	"	,
        "	11:30	"	,
        "	11:45	"	,
        "	12:00	"	,
        "	12:15	"	,
        "	12:30	"	,
        "	12:45	"	,
        "	13:00	"	,
        "	13:15	"	,
        "	13:30	"	,
        "	13:45	"	,
        "	14:00	"	,
        "	14:15	"	,
        "	14:30	"	,
        "	14:45	"	,
        "	15:00	"	,
        "	15:15	"	,
        "	15:30	"	,
        "	15:45	"	,
        "	16:00	"	,
        "	16:15	"	,
        "	16:30	"	,
        "	16:45	"	,
        "	17:00	"	,
        "	17:15	"	,
        "	17:30	"	,
        "	17:45	"	,
        "	18:00	"	,
        "	18:15	"	,
        "	18:30	"	,
        "	18:45	"	,
        "	19:00	"	,
        "	19:15	"	,
        "	19:30	"	,
        "	19:45	"	,
        "	20:00	"	,
        "	20:15	"	,
        "	20:30	"	,
        "	20:45	"	,
        "	21:00	"	,
        // "	21:15	"	,
        // "	21:30	"	,
        // "	21:45	"	,
        // "	22:00	"	,
        // "	22:15	"	,
        // "	22:30	"	,
        // "	22:45	"	,
        // "	23:00	"	,
        // "	23:15	"	,
        // "	23:30	"	,
        // "	23:45	"	,
        // "	0:00	"	,
        // "	0:15	"	,
        // "	0:30	"	,
        // "	6:00	"	,
        // "	6:15	"	,
        // "	6:30	"	,
        // "	6:45	"	,
        // "	7:00	"	,
        // "	7:15	"	,
        // "	7:30	"	,
        // "	7:45	"	,
        // "	8:00	"	,
        // "	8:15	"	,
        // "	8:30	"	,
        // "	8:45	"	,       
    ];


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
          
            this.subjectId = +this.route.snapshot.paramMap.get('subjectId');
            this.sharedUser = this.route.snapshot.paramMap.get('sharedUser');
            this.prevProjectId = this.route.snapshot.paramMap.get('prevProjectId') ? +this.route.snapshot.paramMap.get('prevProjectId') : null;
            this.companyId = +localStorage.getItem("currentLoginCompanyId");
            this.createAddSubjectForm();
    }

    ngOnInit() {
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
            // sometimes both addSubjectForm.invalid and addSubjectForm.valid are false;

              if (!this.addSubjectForm.invalid) {
                this.onSave();
              } else {
                let message = "Please fill all fields!";                
                this.dialogService.openAlertDialog(message);
              }
            });
          }, 0);

        if (this.prevProjectId != null) {
            this.businessMeetingService.getProject(this.companyId, this.prevProjectId).subscribe(
                res => {
                    this.prevProjectSubjectName = res.name;
                   
                }
            )
        }
    }

    createAddSubjectForm() {
        this.addSubjectForm = this.fb.group({
            name: [""],
            description: this.fb.array([
                this.initSubNote()
            ]),
            meeting_date: [''],
            meeting_time: [''],
            meeting_frequency: ['']
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
        value.text = value.text.replace(/(\n)+/g, '<br>')
        return value;
    }

    onSave() {
        if (this.addSubjectForm.valid && this.saveOnce) {
            this.isLoading = true;
            this.saveOnce = false;
            this.setImgInfoToFormData();
            
            // replace \n using <br>, editted by yali
            let description;
            description = this.addSubjectForm.value.description.map(this.replaceLinbeBreak);

            // add subject
            description = JSON.stringify(description);

            var request = {
                'name': this.addSubjectForm.value.name, 
                'description' : description,
                'subject_type' : 'meeting',
                'prev_meeting_project' : this.prevProjectId,
                'meeting_date' : this.addSubjectForm.value.meeting_date,
                'meeting_time' : this.addSubjectForm.value.meeting_time,
                'meeting_frequency' : this.addSubjectForm.value.meeting_frequency
            };
            
            this.businessMeetingService.addSubject(this.companyId, request).subscribe(
                
                res => {
                  this.location.back();
                },
                err => {
                    console.log("Add Subject Error!");
                }
            );
        }
    }

    setImgInfoToFormData(){
        this.imgsMap.forEach((imgUrl, index) => {
          this.addSubjectForm.value.description[index].img = imgUrl;
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
                    
                    this.myFileInput.nativeElement.value = '';
                    
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
        const control = <FormArray>this.addSubjectForm.controls['description'];
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
        if(this.addSubjectForm.controls.description['controls'].length > 1){
          const control = <FormArray>this.addSubjectForm.controls['description'];
          control.removeAt(i);
          this.imgsMap.delete(i);
        }
      }    
}
