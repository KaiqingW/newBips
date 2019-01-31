import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotesService } from 'app/core/services/notes.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';

@Component({
    selector:'add-comment',
    templateUrl:'add-comment.component.html',
    styleUrls:['add-comment.component.scss']
})

export class AddCommentComponent implements OnInit{
    //form for add new comment for a note
    commentForm: FormGroup;

    isLoading;

    //check whether it is uploading images
    isUploadingImg = false;

    isReply;
    
    subjectNote:any;

    noteComment:any;
    //current note id 
    noteId;
    subjectId;
    commentId;
    //replied to someone
    replied_to_id:number = 0;

    sharedOrNot;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        private imageService: ImageService,
        private notesService: NotesService,
        private toasterService: ToasterService
    ){
        this.noteId = +this.route.snapshot.paramMap.get('notesNoteId');
        this.subjectId = +this.route.snapshot.paramMap.get('notesSubId');
        this.commentId = +this.route.snapshot.paramMap.get('notesComId');
        this.sharedOrNot =localStorage.getItem('key_switch');        
        this.isReply = this.route.routeConfig.path;
        console.log(this.route);
        this.createForm();
        this.isLoading = true;
    }

    ngOnInit(){
        //add listener to the save button in the header toolbar
        setTimeout(() => {
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                // sometimes both noteForm.invalid and noteForm.valid are false;
                if (!this.commentForm.invalid && !this.isUploadingImg) {
                    this.onSave();
                }
            });
        }, 0);

        if(this.isReply === "subject/:notesSubId/note/:notesNoteId/comment/create/:notesNoteId" || this.isReply === "subject_shared/:notesSubId/note/:notesNoteId/comment/create/:notesNoteId"){
            this.notesService.getSubjectNote(this.noteId).subscribe(res => {
                this.subjectNote = res;
                this.isLoading = false;
            }, err =>{console.log(err); this.isLoading = false;})
        }else{
            this.notesService.getComment(this.commentId).subscribe(res =>{
                this.noteComment = res;
                this.replied_to_id = this.noteComment.created.by.id;
                this.isLoading = false;
            }, err =>{console.log(err); this.isLoading = false;})
        }
        
    }

    createForm() {
        this.commentForm= this.fb.group({
            note_id:[''],
            body:[''],
            replied_to_id:['']
         })

    }

    onSave(){
        const body = document.getElementById('quill').children[1].children[0].innerHTML;
        const newBody = this.changeBody(body);
        if(this.isReply === "subject/:notesSubId/note/:notesNoteId/comment/create/:notesNoteId" || this.isReply === "subject_shared/:notesSubId/note/:notesNoteId/comment/create/:notesNoteId"){
            this.notesService.addComment({'note_id':this.noteId, 'body': newBody}).subscribe(res => {
                if (this.sharedOrNot == 'mysubject') {
                    this.router.navigateByUrl(`/notes/subject/${this.subjectId}/note/${this.noteId}`).then(() => {
                        this.toasterService.showToaster('Created Successfully!', '',3000);
                    });
                } else if (this.sharedOrNot == 'subjectshared') {
                    this.router.navigateByUrl(`/notes/subject_shared/${this.subjectId}/note/${this.noteId}`).then(() => {
                        this.toasterService.showToaster('Created Successfully!', '',3000);
                    });
                }
            })
        }else{
            this.notesService.addComment({'note_id':this.noteComment.note.id, 'body': newBody, 'replied_to_id':this.replied_to_id}).subscribe(res => {
                if (this.sharedOrNot == 'mysubject') {
                    this.router.navigateByUrl(`/notes/subject/${this.subjectId}/note/${this.noteComment.note.id}`).then(() => {
                        this.toasterService.showToaster('Created Successfully!', '',3000);
                    });
                } else if (this.sharedOrNot == 'subjectshared') {
                    this.router.navigateByUrl(`/notes/subject_shared/${this.subjectId}/note/${this.noteComment.note.id}`).then(() => {
                        this.toasterService.showToaster('Created Successfully!', '',3000);
                    });
                }
            })
        }
    }

    //change the html of the note body when saving
    changeBody(body: string) {
        return body.replace(/<p><img .+? src=".+?"><\/p>(<p>.*?<\/p>){6,6}/g, x => `<div class="picture">` + x + `</div>`);
    }

    // Cancel the editing
    onCancel() {
        this.location.back();
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
          html = html.replace(/<img src=".+?">/g, x => x.substring(0, 5) + 'alt="no image" align="left" width="50" height="54" '
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
