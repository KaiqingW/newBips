import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotesService } from 'app/core/services/notes.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { UserService } from 'app/core/services/user.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';

@Component({
    selector: 'add-subject',
    templateUrl: 'add-subject.component.html',
    styleUrls: ['add-subject.component.scss']
})

export class AddSubjectComponent implements OnInit {

    @ViewChild('subjectInput') subjectInput;
    // form for add new subject or note
    noteForm: FormGroup;

    // all the subjects including personal and shared subjects
    subjectList;

    // for angular material mat-autocomplete
    filteredSubjects: Observable<any[]>;

    isLoading;

    // check whether it is uploading images
    isUploadingImg = false;

    // current subject if necessary
    subject;

    // current subject id if necessary
    id;

    constructor(
        private notesService: NotesService,
        private fb: FormBuilder,
        private router: Router,
        private toasterService: ToasterService,
        private location: Location,
        private userService: UserService,
        private route: ActivatedRoute,
        private imageService: ImageService) {
        this.id = +this.route.snapshot.paramMap.get('id');
        // need to create in constructor to avoid error
        this.createForm();
        this.isLoading = true;
        // get list of all the subjects related to current user
        // then add listener to filter subject name.
        this.notesService.getSubjectList().subscribe(
            res => {
                this.subjectList = res.data;
                this.notesService.getSharedSubjectList().subscribe(res1 => {
                    this.subjectList.push(...res1.data);

                    this.filteredSubjects = this.noteForm.controls.subject.valueChanges
                    .pipe(
                        startWith(''),
                        map(subject => subject ? this.filterSubject(subject) : this.subjectList.slice())
                    );
                });
            }
        );
    }

    ngOnInit() {
        // add listener to the save button in the header tool bar
        setTimeout(() => {
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                // sometimes both noteForm.invalid and noteForm.valid are false;
                if (!this.noteForm.invalid && !this.isUploadingImg) {
                    this.onSave();
                }
            });
        }, 0);

        // if this.id exists, then only adding notes within this subject is allowed
        // else create new form to add new subject and new notes
        if (!this.id) {
            this.isLoading = false;
        } else {
            this.notesService.getSubject(this.id).subscribe(res => {
                this.subject = res;
                this.createForm();
                this.isLoading = false;
            }, err => {console.log(err); this.isLoading = false; });
        }
    }

    createForm() {
        const v = this.subject ? this.subject.name : '';
        this.noteForm = new FormGroup({
            subject: new FormControl({value: v, disabled: this.id}, Validators.required)
        });
    }

    filterSubject(name: string) {
        return this.subjectList.filter(subject =>
            subject.name.toLowerCase().indexOf(
                name.toLowerCase()) === 0);
    }

    htmlToPlaintext(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }

    // save subject and note
    onSave() {
        const body = document.getElementById('quill').children[1].children[0].innerHTML;
        const newBody = this.changeBody(body);
        // if the subject is set, then only adding notes within this subject is allowed
            const subject = this.subjectInput.nativeElement.value;
            var description;
            const idx = this.subjectList.findIndex(sub => sub.name === subject);
            if(newBody=="<p><br></p>"){
                description = this.htmlToPlaintext(newBody);
            }
            else{
                description = newBody;
            }
            this.notesService.addSubject({'name': subject, 'description' : description}).subscribe(res => {
                this.router.navigateByUrl('/notes/subject/' + res.id).then(() => {
                    this.toasterService.showToaster('Created Successfully!', '', 3000);
                  });
            });
    }

    // change the html of the note body when saving
    changeBody(body: string) {
        return body.replace(/<p><img .+? src=".+?"><\/p>(<p>.*?<\/p>){6,6}/g, x => `<div class="picture">` + x + `</div>`);
    }

    // Cancel the editing
    onCancel() {
        this.location.back();
    }

    getMaxInputErrorMessage(){
        var stringLength = (<HTMLInputElement>document.getElementById('subject_name')).value.length;
        if(stringLength > 27)
            {return 'Should be at most 27 characters';}
    }
    // runs every time quill's content changes
    logChange($event: any) {
        const ops = $event.delta.ops;
        // if insert an image, then change the html to float it to the left and add six paragraph on the right
        // then upload the image and change the src value.
        if (ops[ops.length - 1].insert && ops[ops.length - 1].insert.image) {
          const url = ops[ops.length - 1].insert.image;
          const formData = this.imageService.urltoFormData(url);
          let html = document.querySelector('.ql-editor').innerHTML;
          html = html.replace(/<img src=".+?">/g, x => x.substring(0, 5) + 'alt="no image" align="left" width="54" height="54" '
                    + x.substring(5)) + '<p></p><p></p><p></p>';
          document.getElementById('quill').children[1].children[0].innerHTML = html;
  
          // upload the img and replace its src
          this.isUploadingImg = true;
          this.imageService.uploadImage(formData)
          .subscribe(data => {
            const html1 = document.getElementById('quill').children[1].children[0].innerHTML.replace(url,
            data.url);
            document.getElementById('quill').children[1].children[0].innerHTML = html1;
            this.isUploadingImg = false;
          }, err => {
              console.log('-----------------------error--------------------');
              console.log(err);
              this.isUploadingImg = false;
          });
        }
    }
}
