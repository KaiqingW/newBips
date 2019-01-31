import { Component, OnInit, ViewChild, Pipe } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NotesService } from 'app/core/services/notes.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { DialogService } from 'app/core/services/dialog.service';
import { LoggingUserService } from 'app/core/services/logging-user.service';


@Component({
    selector: 'subject-note',
    templateUrl: './subject-note.component.html',
    styleUrls: ['./subject-note.component.scss']
})

export class SubjectNoteComponent implements OnInit{

    //the note of this component
    subjectNote;
    isLoading = false;
    
    imgSrc = '';
    //for checking whether this subject is shared
    isShared;
    modalOpen = false;


    @ViewChild('nameInput') nameInput;

    constructor(
        private router:Router,
        private route: ActivatedRoute,
        private location : Location,
        private notesService: NotesService,
        private dialogService: DialogService,
        private toasterService: ToasterService,
        private loggingUserService: LoggingUserService
    ){}

    ngOnInit(){
        this.getSubjectNote();

        setTimeout(() => {
            const buttonClick = document.getElementById('header-cancel');
            buttonClick.addEventListener('click', () => {
                this.isLoading = true;
                // this.onCancel();
            });
        }, 0);
        
    }

    getSubjectNote() {
        const user = this.loggingUserService.user;
        const noteId = +this.route.snapshot.paramMap.get('notesNoteId');
        this.isLoading = true;
        this.notesService.getSubjectNote(noteId).subscribe(
            res => {
                this.subjectNote = res;
                this.isShared = user.id !== res.created.by.id;
                this.isLoading = false;

            setTimeout(() => {
                this.nameInput.nativeElement.addEventListener('click', e => {
                    if (e.target && e.target.nodeName === 'IMG' ) {
                    this.imgSrc = e.target.currentSrc;
                    this.modalOpen = true;
                    }
                });
                },0);
            }
        );
        if(noteId){
            this.notesService.deleteUnreadNote(noteId).subscribe(res=>{});
            this.notesService.deleteUnreadComment(noteId).subscribe(res=>{
                this.isLoading = false;
            });
        }
    }

    deleteComment(id){
        this.dialogService.openDialog().subscribe(result => {
            if (result) {
                this.isLoading = true;
                this.notesService.deleteComment(id).subscribe(() =>{
                    this.toasterService.showToaster('Deleted', '', 3000);
                    const idx = this.subjectNote.comments.findIndex(x =>x.id ===id);
                    if (idx > -1) {
                        this.subjectNote.comments.splice(idx, 1);
                    }
                    this.isLoading = false;
                })
            }
            
        })
    }

    closeModal() {
        this.modalOpen = false;
      }
    
    // onCancel() {
    //     const id = +this.route.snapshot.paramMap.get('id');
    //     this.isLoading = true;
    //     this.notesService.deleteUnreadComment(id).subscribe(res=>{
    //         this.router.navigate([`/notes/subject/${this.subjectNote.subject.id}`], { skipLocationChange: true });
    //         this.isLoading = false;
    //     })        
    // }
        

}