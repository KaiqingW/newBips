import { Component, OnInit, ViewChild, Pipe } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NotesService } from 'app/core/services/notes.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { DialogService } from 'app/core/services/dialog.service';
import { LoggingUserService } from 'app/core/services/logging-user.service';
import { ShowMorePipe } from '../../show-more.pipe';
import {} from "@angular/core";
// PepeTransform to capitaliza the first letter
import { PipeTransform } from "@angular/core";

@Pipe({name: 'capitalize'})

@Component({
  selector: 'subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, PipeTransform  {

  // the subject of this component
  subject;

  // subject list under My Subjects
  mySubjectList;

  //shared users information
  shareInfo;
  // max num of share
  maxShare: number = 3;

  isLoading = false;

  // for the image modal after clicking the image
  modalOpen = false;
  imgSrc = '';
  // for checking whether this subject is shared
  isShared;

  @ViewChild('nameInput') nameInput;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private notesService: NotesService,
    private toasterService: ToasterService,
    private dialogService: DialogService,
    private loggingUserService: LoggingUserService
  ) { }

  ngOnInit() {
    this.getSubject();

    setTimeout(() => {
      const buttonClick = document.getElementById('header-cancel');
      buttonClick.addEventListener('click', () => {
          this.isLoading = true;
          // this.onCancel();
      });
  }, 0);
  }
// transform will capitaliza the first letter from value
  transform(value:any) {
    if (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

  //
  showMore(){
    let max = this.maxShare;
    if(max !== Number.MAX_VALUE){
      this.maxShare = Number.MAX_VALUE;
    } else {
      this.maxShare = 3;
    }
  }


  // get this subject's id and check whether it is shared from the url param
  // get subject information including all the notes in the subject
  // use event propagation to deal with events
  getSubject() {
    const user = this.loggingUserService.user;
    const subjectId = +this.route.snapshot.paramMap.get('notesSubId');
    this.isLoading = true;
    this.notesService.getSubject(subjectId).subscribe(
      res => {
        this.subject = res;
        this.isShared = user.id !== res.created.by.id;
        this.isLoading = false;
        // setTimeout(() => {
        //   this.nameInput.nativeElement.addEventListener('click', e => {
        //     if (e.target && e.target.nodeName === 'IMG' ) {
        //       this.imgSrc = e.target.currentSrc;
        //       this.modalOpen = true;
        //     }
        //   });
        // }, 3000);

        //get
        this.getSubjectList().subscribe(
          res => {

            this.mySubjectList = res.data;

            let selectedSubject = this.mySubjectList.filter((subject, i) => {
              return subject.id === subjectId;
            });

            this.shareInfo = selectedSubject[0].share.with;
          }
        );
      }
    );

    if(subjectId){
      this.notesService.deleteUnreadSubject(subjectId).subscribe(res=>{});
    }
  }

  // get shared users which inside this subject list.
  getSubjectList(){

    let id = +this.route.snapshot.params.id;

    if(this.isShared){
      return this.notesService.getSharedSubjectList();
    } else {
      return this.notesService.getSubjectList();
    }

  }

  // delete current subject
  deleteSubject() {
    this.dialogService.openDialog().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.notesService.deleteSubject(this.subject.id).subscribe(() => {
          this.router.navigateByUrl('/notes/subject').then(() => {
            this.toasterService.showToaster('Deleted!', '', 3000);
            this.isLoading = false;
          });
        });
      }
    });
  }

  // delete selected notes.
  deleteNote(id) {
    this.dialogService.openDialog().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.notesService.deleteNote(id).subscribe(() => {
          this.toasterService.showToaster('Deleted!', '', 3000);
          // for changing the view
          const idx = this.subject.notes.findIndex(x => x.id === id);
          if (idx > -1) {
            this.subject.notes.splice(idx, 1);
          }
          this.isLoading = false;
        });
      }
    });
  }

  // close the image modal
  closeModal() {
    this.modalOpen = false;
  }

  onCancel() {
    if(localStorage.getItem('key_switch')=="subjectshared"){
    const id = +this.route.snapshot.paramMap.get('id');
    this.router.navigate([`/notes/subject_shared`]);

    }else{
      const id = +this.route.snapshot.paramMap.get('id');
      this.router.navigate([`/notes/subject`]);
    }
  }

}
