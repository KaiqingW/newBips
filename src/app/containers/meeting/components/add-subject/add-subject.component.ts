import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import { MeetingService } from 'app/core/services/meeting.service';
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

@Component({
    selector: 'add-subject',
    templateUrl: 'add-subject.component.html',
    styleUrls: ['add-subject.component.scss']
})

export class AddSubjectComponent implements OnInit {

    // @ViewChild('subjectInput') subjectInput;
    // form for add new subject or note
    // noteForm: FormGroup;

    // all the subjects including personal and shared subjects
    // subjectList;

    // for angular material mat-autocomplete
    // filteredSubjects: Observable<any[]>;

    isLoading: Boolean = false;
    saveOnce: Boolean = true;

    // check whether it is uploading images
    // isUploadingImg = false;

    // current subject if necessary
    subject;

    // current subject id if necessary
    subjectId;
    companyId = 0;
    sharedUser;
    prevNoteId;

    addSubjectForm : FormGroup;
    imgsMap = new Map<number, string>();
    selectedImgIndex : number;
    selectedFile = null;
    modalOpen = false;
    prevNoteSubjectName;
    
    meetingTime = [
        "	6:00	"	,
        "	6:15	"	,
        "	6:30	"	,
        "	6:45	"	,
        "	7:00	"	,
        "	7:15	"	,
        "	7:30	"	,
        "	7:45	"	,
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
        "	21:15	"	,
        "	21:30	"	,
        "	21:45	"	,
        "	22:00	"	,
        "	22:15	"	,
        "	22:30	"	,
        "	22:45	"	,
        "	23:00	"	,
        "	23:15	"	,
        "	23:30	"	,
        "	23:45	"	,
        "	0:00	"	,
        "	0:15	"	,
        "	0:30	"	,
        "	6:00	"	,
        "	6:15	"	,
        "	6:30	"	,
        "	6:45	"	,
        "	7:00	"	,
        "	7:15	"	,
        "	7:30	"	,
        "	7:45	"	,
        "	8:00	"	,
        "	8:15	"	,
        "	8:30	"	,
        "	8:45	"	,
        
        
    ];


    constructor(
        private meetingService: MeetingService,
        private fb: FormBuilder,
        private router: Router,
        private toasterService: ToasterService,
        private location: Location,
        private userService: UserService,
        private route: ActivatedRoute,
        private imageService: ImageService,
        private dialogService: DialogService) {
            this.subjectId = +this.route.snapshot.paramMap.get('subId');
            this.sharedUser = this.route.snapshot.paramMap.get('sharedUser');
            this.prevNoteId = this.route.snapshot.paramMap.get('prevNoteId') ? +this.route.snapshot.paramMap.get('prevNoteId') : null;
            console.log(this.prevNoteId);
            console.log(this.sharedUser);
            this.companyId = +localStorage.getItem("currentLoginCompanyId");
            this.createAddSubjectForm();



            // **************************************************************************************
            // folowing code is used to add subject using editor, not used at this time
            // **************************************************************************************
            // need to create in constructor to avoid error
            // this.createForm();
            // this.isLoading = true;
            
            // get list of all the subjects related to current user
            // then add listener to filter subject name.
            // this.meetingService.getSubjectList('company_id', this.companyId).subscribe(
            //     res => {
            //         this.subjectList = res.data;
            //         this.meetingService.getSharedSubjectList('company_id', this.companyId).subscribe(res1 => {
            //             this.subjectList.push(...res1.data);

            //             this.filteredSubjects = this.noteForm.controls.subject.valueChanges
            //             .pipe(
            //                 startWith(''),
            //                 map(subject => subject ? this.filterSubject(subject) : this.subjectList.slice())
            //             );
            //         });
            //     }
            // );
    }

    ngOnInit() {
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
            // sometimes both addSubjectForm.invalid and addSubjectForm.valid are false;

            console.log(this.addSubjectForm);
              if (!this.addSubjectForm.invalid) {
                this.onSave();
              } else {
                let message = "Please fill all fields!";                
                this.dialogService.openAlertDialog(message);
              }
            });
          }, 0);

        if (this.prevNoteId != null) {
            this.meetingService.getSubjectNote(this.prevNoteId).subscribe(
                res => {
                    this.prevNoteSubjectName = res.name;
                   
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

    onSave() {
        if (this.addSubjectForm.valid && this.saveOnce) {
            this.isLoading = true;
            this.saveOnce = false;
            this.setImgInfoToFormData();
            this.addSubjectForm.value.description = JSON.stringify(this.addSubjectForm.value.description);
            var request = {
                'name': this.addSubjectForm.value.name, 
                'description' : this.addSubjectForm.value.description,
                'prev_meeting_note' : this.prevNoteId,
                'shared_user' : this.sharedUser,
                'company_id' : this.companyId,
                'meeting_date' : this.addSubjectForm.value.meeting_date,
                'meeting_time' : this.addSubjectForm.value.meeting_time,
                'meeting_frequency' : this.addSubjectForm.value.meeting_frequency
            };
            console.log(request);
            this.meetingService.addSubject(request).subscribe(
                res => {
                    let noteRequest = {
                        'subject_id': res.id, 
                        'name': 'Discussion', 
                        'body': 'Discussion', 
                        'type': 'discussion',
                        'company_id' : this.companyId,                
                        'target_date': ""
                    };
                    console.log(noteRequest);
                    this.meetingService.addNote(noteRequest).subscribe(
                        res => {
                            this.location.back();
                        },
                        error => {console.log("add discussin error")}
                        );
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

        // **************************************************************************************
        // folowing code is used to add subject using editor, not used at this time
        // **************************************************************************************

        // add listener to the save button in the header tool bar
        // setTimeout(() => {
        //     const buttonClick = document.getElementById('header-submit-edit');
        //     buttonClick.addEventListener('click', () => {
        //         // sometimes both noteForm.invalid and noteForm.valid are false;
        //         if (!this.noteForm.invalid && !this.isUploadingImg) {
        //             this.onSave();
        //         }
        //     });
        // }, 0);

        // if this.id exists, then only adding notes within this subject is allowed
        // else create new form to add new subject and new notes
        // if (!this.subjectId) {
        //     this.isLoading = false;
        // } else {
        //     this.meetingService.getSubject(this.subjectId).subscribe(res => {
        //         this.subject = res;
        //         this.createForm();
        //         this.isLoading = false;
        //     }, err => {console.log(err); this.isLoading = false; });
        // }
    // }

    // createForm() {
    //     const v = this.subject ? this.subject.name : '';
    //     this.noteForm = new FormGroup({
    //         subject: new FormControl({value: v, disabled: this.subjectId}, Validators.required)
    //     });
    // }

    // filterSubject(name: string) {
    //     return this.subjectList.filter(subject =>
    //         subject.name.toLowerCase().indexOf(
    //             name.toLowerCase()) === 0);
    // }

    // htmlToPlaintext(text) {
    //     return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    // }

    // save subject and note
    // onSave() {
    //     const body = document.getElementById('quill').children[1].children[0].innerHTML;
    //     const newBody = this.changeBody(body);
    //     // if the subject is set, then only adding notes within this subject is allowed
    //         const subject = this.subjectInput.nativeElement.value;
    //         var description;
    //         const idx = this.subjectList.findIndex(sub => sub.name === subject);
    //         if(newBody=="<p><br></p>"){
    //             description = this.htmlToPlaintext(newBody);
    //         }
    //         else{
    //             description = newBody;
    //         }
    //         var request = {
    //             'name': subject, 
    //             'description' : description,
    //             'prev_meeting_note' : this.prevNoteId,
    //             'shared_user' : this.sharedUser,
    //             'company_id' : this.companyId
    //         };
    //         this.meetingService.addSubject(request).subscribe(res => {
    //             console.log(res);
    //             this.meetingService.addNote({'subject_id': res.id, 'body': 'Discussion', 'company_id': this.companyId, 'type': 'discussion'}).subscribe(
    //                 res => {
    //                 },
    //                 error => {}
    //               );

    //             if (this.companyId > 0) {
    //                 this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject/` + res.id).then(() => {
    //                     this.toasterService.showToaster('Created Successfully!', '', 3000);
    //                 });
    //             } else if (this.companyId == 0) {
    //                 this.router.navigateByUrl(`/personal-meeting/meeting/subject/` + res.id).then(() => {
    //                     this.toasterService.showToaster('Created Successfully!', '', 3000);
    //                 });
    //             }
    //         });
    // }

    // change the html of the note body when saving
    // changeBody(body: string) {
    //     return body.replace(/<p><img .+? src=".+?"><\/p>(<p>.*?<\/p>){6,6}/g, x => `<div class="picture">` + x + `</div>`);
    // }

    // Cancel the editing
    // onCancel() {
    //     this.location.back();
    // }

    // getMaxInputErrorMessage(){
    //     var stringLength = (<HTMLInputElement>document.getElementById('subject_name')).value.length;
    //     if(stringLength > 27)
    //         {return 'Should be at most 27 characters';}
    // }
    // runs every time quill's content changes
    // logChange($event: any) {
    //     const ops = $event.delta.ops;
    //     // if insert an image, then change the html to float it to the left and add six paragraph on the right
    //     // then upload the image and change the src value.
    //     if (ops[ops.length - 1].insert && ops[ops.length - 1].insert.image) {
    //       const url = ops[ops.length - 1].insert.image;
    //       const formData = this.imageService.urltoFormData(url);
    //       let html = document.querySelector('.ql-editor').innerHTML;
    //       html = html.replace(/<img src=".+?">/g, x => x.substring(0, 5) + 'alt="no image" align="left" width="54" height="54" '
    //                 + x.substring(5)) + '<p></p><p></p><p></p>';
    //       document.getElementById('quill').children[1].children[0].innerHTML = html;
  
    //       // upload the img and replace its src
    //       this.isUploadingImg = true;
    //       this.imageService.uploadImage(formData)
    //       .subscribe(data => {
    //         const html1 = document.getElementById('quill').children[1].children[0].innerHTML.replace(url,
    //         data.url);
    //         document.getElementById('quill').children[1].children[0].innerHTML = html1;
    //         this.isUploadingImg = false;
    //       }, err => {
    //           console.log('-----------------------error--------------------');
    //           console.log(err);
    //           this.isUploadingImg = false;
    //       });
    //     }
    // }
// }
