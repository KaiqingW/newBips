import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
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

import { error } from 'util';

@Component({
    selector: 'add-note',
    templateUrl: 'add-note.component.html',
    styleUrls: ['add-note.component.scss']
})

export class AddNoteComponent implements OnInit {

    // @ViewChild('subjectInput') subjectInput;

    // form for add new subject or note
    // noteForm: FormGroup;
    
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

    // add note
    addNoteForm: FormGroup;
    imgsMap = new Map<number, string>();
    selectedImgIndex : number;
    selectedFile = null;
    modalOpen = false;

    saveOnce: Boolean = true;

    constructor(
        private meetingService: MeetingService,
        private fb: FormBuilder,
        private router: Router,
        private toasterService: ToasterService,
        private location: Location,
        private userService: UserService,
        private route: ActivatedRoute,
        private dialogService: DialogService,
        private imageService: ImageService) {
        this.subjectId = +this.route.snapshot.paramMap.get('subId');
        this.sharedOrNot =localStorage.getItem('meeting_key_switch');
        this.companyId = +localStorage.getItem("currentLoginCompanyId");
        
        console.log(this.subjectId);
        this.isLoading = true;
        this.createAddNoteForm();
        

         // **************************************************************************************
        // folowing code is used to add subject using editor, not used at this time
        // ***************************************************************************************
        // need to create in constructor to avoid error
        // this.createForm();
        
        // // get list of all the subjects related to current user
        // // then add listener to filter subject name.
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
        // add listener to the save button in the header tool bar
        setTimeout(() => {
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                if (!this.addNoteForm.invalid) {
                    this.onSave();
                } else {
                    let message = "Please fill all fields!";                    
                    this.dialogService.openAlertDialog(message);
                }

                // sometimes both noteForm.invalid and noteForm.valid are false;
                // if (!this.noteForm.invalid && !this.isUploadingImg) {
                //     this.onSave();
                // }
            });
        }, 0);

        // if this.id exists, then only adding notes within this subject is allowed
        // else create new form to add new subject and new notes
        if (!this.subjectId) {
            this.isLoading = false;
        } else {
            this.meetingService.getSubject(this.subjectId).subscribe(res => {
                this.subjectName = res.name;
                // this.createForm();
    
                this.isLoading = false;
            }, err => {console.log(err); this.isLoading = false; });
        }
    }

    createAddNoteForm() {
        this.addNoteForm = this.fb.group({
            name : [''],
            description: this.fb.array([
                this.initSubNote()
            ]),
            target_date : ['']
        });
    }

    initSubNote() {
        return this.fb.group({
            img: [''],
            text: ['']
        })
    }

    onSave() {
        if (this.addNoteForm.valid && this.saveOnce) {
            this.isLoading = true;
            this.saveOnce = false;
            this.setImgInfoToFormData();
            this.addNoteForm.value.description = JSON.stringify(this.addNoteForm.value.description);
            var request = {
                'subject_id' : this.subjectId,
                'name' : this.addNoteForm.value.name,
                'body' : this.addNoteForm.value.description,
                'company_id' : this.companyId,
                'type' : 'project',
                'target_date' : this.addNoteForm.value.target_date
            };
            this.meetingService.addNote(request).subscribe(
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
          this.addNoteForm.value.description[index].img = imgUrl;
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
        const control = <FormArray>this.addNoteForm.controls['description'];
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
        if(this.addNoteForm.controls.description['controls'].length > 1){
          const control = <FormArray>this.addNoteForm.controls['description'];
          control.removeAt(i);
          this.imgsMap.delete(i);
        }
      }
    
}




// **************************************************************************************
// folowing code is used to add subject using editor, not used at this time
// **************************************************************************************
//     createForm() {
//         const v = this.subject ? this.subject.name : '';
//         this.noteForm = new FormGroup({
//             subject: new FormControl({value: v, disabled: this.subjectId}, Validators.required)
//         });
//     }

//     filterSubject(name: string) {
//         return this.subjectList.filter(subject =>
//             subject.name.toLowerCase().indexOf(
//                 name.toLowerCase()) === 0);
//     }

//     // save subject and note
//     onSave() {
//         const body = document.getElementById('quill').children[1].children[0].innerHTML;
//         const newBody = this.changeBody(body);
//         // if the subject is set, then only adding notes within this subject is allowed
//         if (this.subjectId) {
//             this.meetingService.addNote({'subject_id': this.subjectId, 'body': newBody, 'company_id' : this.companyId, 'type': 'project'}).subscribe(res => {
//                 if (this.sharedOrNot == 'myMeeting') {
//                     if (this.companyId > 0) {
//                         this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject/${this.subjectId}`).then(() => {
//                             this.toasterService.showToaster('Created Successfully!', '', 3000);
//                         });
//                     } else if (this.companyId == 0) {
//                         this.router.navigateByUrl(`/personal-meeting/meeting/subject/${this.subjectId}`).then(() => {
//                             this.toasterService.showToaster('Created Successfully!', '', 3000);
//                         });
//                     }
//                 } else if (this.sharedOrNot == 'sharedMeeting') {
//                     if (this.companyId > 0) {
//                         this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject_shared/${this.subjectId}`).then(() => {
//                             this.toasterService.showToaster('Created Successfully!', '', 3000);
//                         });
//                     } else if (this.companyId == 0) {
//                         this.router.navigateByUrl(`/personal-meeting/meeting/subject_shared/${this.subjectId}`).then(() => {
//                             this.toasterService.showToaster('Created Successfully!', '', 3000);
//                         });
//                     }
//                 }
//             });
//         // } else {
//         //     const subject = this.subjectInput.nativeElement.value;

//         //     const idx = this.subjectList.findIndex(sub => sub.name === subject);

//         //     if (idx > -1) {
//         //     // if the subject the user types is an existing subject
//         //         const subject_id = this.subjectList[idx].id;
//         //         this.meetingService.addNote({'subject_id': subject_id, 'body': newBody}).subscribe(res => {
//         //             if (this.sharedOrNot == 'myMeeting') {
//         //                 this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject/${this.subjectId}`).then(() => {
//         //                     this.toasterService.showToaster('Created Successfully!', '', 3000);
//         //                 });
//         //             } else if (this.sharedOrNot == 'sharedMeeting') {
//         //                 this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject_shared/${this.subjectId}`).then(() => {
//         //                     this.toasterService.showToaster('Created Successfully!', '', 3000);
//         //                 });
//         //             }
//         //         });
//         //     } else {
//         //     // if it is a new subject
//         //         this.meetingService.addSubject({'name': subject}).subscribe(res => {
//         //             this.meetingService.addNote({'subject_id': res.id, 'body': newBody}).subscribe(res1 => {
//         //                 if (this.sharedOrNot == 'myMeeting') {
//         //                     this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject/` + res.id).then(() => {
//         //                         this.toasterService.showToaster('Created Successfully!', '', 3000);
//         //                     });
//         //                 } else if (this.sharedOrNot == 'sharedMeeting') {
//         //                     this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject_shared/` + res.id).then(() => {
//         //                         this.toasterService.showToaster('Created Successfully!', '', 3000);
//         //                     });
//         //                 }
//         //             });
//         //         });
//         //     }
//          }

//     }

//     // change the html of the note body when saving
//     changeBody(body: string) {
//         return body.replace(/<p><img .+? src=".+?"><\/p>(<p>.*?<\/p>){6,6}/g, x => `<div class="picture">` + x + `</div>`);
//     }

//     // Cancel the editing
//     onCancel() {
//         this.location.back();
//     }

//     // runs every time quill's content changes
//     logChange($event: any) {
//         const ops = $event.delta.ops;
//         // if insert an image, then change the html to float it to the left and add six paragraph on the right
//         // then upload the image and change the src value.
//         if (ops[ops.length - 1].insert && ops[ops.length - 1].insert.image) {
//           const url = ops[ops.length - 1].insert.image;
//           const formData = this.imageService.urltoFormData(url);
//           let html = document.querySelector('.ql-editor').innerHTML;
//           html = html.replace(/<img src=".+?">/g, x => x.substring(0, 5) + 'alt="no image" align="left" width="50" height="54" '
//                     + x.substring(5)) + '<p></p><p></p><p></p>';
//           document.getElementById('quill').children[1].children[0].innerHTML = html;
//           // upload the img and replace its src
//           this.isUploadingImg = true;
//           this.imageService.uploadImage(formData)
//           .subscribe(data => {
//             const html1 = document.getElementById('quill').children[1].children[0].innerHTML.replace(url,
//             data.url);
//             document.getElementById('quill').children[1].children[0].innerHTML = html1;
//             this.isUploadingImg = false;
//           }, err => {
//               console.log('-----------------------error--------------------');
//               console.log(err);
//               this.isUploadingImg = false;
//           });
//         }
//     }
// }
