import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { NotesService } from 'app/core/services/notes.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { CompanyService } from 'app/core/services/company.service';
import { DialogService } from 'app/core/services/dialog.service';
import { AccountService } from 'app/core/services/account.service';
import { LeadService } from 'app/core/services/lead.service';
import { SearchService } from 'app/core/services/search.service';
import { defineDirective } from '@angular/core/src/render3';


@Component({
    selector:'invite-user',
    templateUrl:'invite-user.component.html',
    styleUrls:['invite-user.component.scss']
})

export class InviteUserComponent implements OnInit{

// @ViewChild('personInput') personInput;
isLoading = false;
// for angular material mat-chip-list and input
visible = true;
selectable = true;
removable = true;
addOnBlur = true;

//all the shared employee list to this company
sharedUserList;

// for angular material mat-autocomplete
  filteredEmails: Observable<any[]>;

// check whether user input is valid email address
  emailCtrl: FormControl = new FormControl();
  
// this company 
  company;

  companyEmployee;
// this variable is for change the event order of (matChipInputTokenEnd) in input and (optionSelected) in mat-autocomplete
  selectedEmail;

// separator to separate user input as chips
  separatorKeysCodes = [ENTER, COMMA];

// this email list is for view
  emailList: Array<string> = [];

// all user list in the database
  allUserList;
  currentLoginCompanyId;
  customer_id;
  employeeList;
  employeeListCopy;
  userShared:boolean = false;

  errorInput:boolean = false;

  falsedEmailList = [];

    constructor(
        private notesService: NotesService,
        private companyService: CompanyService,
        private dialogService : DialogService,
        private toasterService : ToasterService,
        private route: ActivatedRoute,
        private accountService: AccountService,
        private searchService: SearchService
    ){
      this.isLoading = true;
      this.currentLoginCompanyId = +this.route.snapshot.paramMap.get('cid');
      this.customer_id = +this.route.snapshot.paramMap.get('cusid');
      if(this.customer_id ==0){
        this.customer_id = +this.route.snapshot.paramMap.get('ven_id')
      };
      this.emailCtrl = new FormControl();
      this.emailCtrl.valueChanges.subscribe(
          (term)=> {
              this.onSearch(term);
          }
      )
    }
    ngOnInit(){
      this.companyService.getCompanyEmployee(this.currentLoginCompanyId).subscribe(
        res2=>{
            this.employeeListCopy = JSON.parse(JSON.stringify(res2));
            this.employeeList = res2;
            this.accountService.getAccount(this.currentLoginCompanyId,this.customer_id).subscribe(
              res=>{
                this.sharedUserList = res.shared_with;
                for(var i = 0; i<this.sharedUserList.length; i++){
                 const item =  this.employeeList.find(x=>x.email==this.sharedUserList[i].email);
                  const idx = this.employeeList.indexOf(item);
                  if (idx > -1) {
                    this.employeeList.splice(idx, 1);
                  }
                }
                this.isLoading = false;
              })
        }
      )
     
      // this.notesService.getSharedUserList(13).subscribe(res1 => {
      //   this.sharedUserList = res1;
      //   const ob = Observable.create(observer => {
      //     setTimeout(() => {
      //       observer.next(this.allUserList.slice());
      //     });
      //   });
      //   this.filteredEmails = ob;
      //   this.emailCtrl.valueChanges.subscribe( email => {
      //     // if email is not '', then search using search api, else return all the users
      //     this.filteredEmails = email ? this.notesService.getUserEmailList(email) : ob;
      //   });
      //   this.isLoading = false;
      // }, err => {this.isLoading = false; console.log(err); });
    }

     // if value is valid email and not included in the emailList, then add it to email list
  addHelper(value: string): void {
    if ((value || '').trim()) {
      value = value.trim().toLowerCase();
      if (this.validateEmail(value) && !this.emailList.includes(value)) {
        this.emailList.push(value);
      }
    }
  }

  // for adding new chips after input token ends
  add(event: MatChipInputEvent): void {
      setTimeout(e => {
          const input = event.input;
          const value = this.selectedEmail || event.value;
          // Add our email
          this.addHelper(value);
          // Reset the input value
          if (input) {
          input.value = '';
          }
          this.selectedEmail = '';
      }, 0);
  }

// remove email from emailList
  remove(email: any): void {

    const index = this.emailList.indexOf(email);
    if (index >= 0) {
      this.emailList.splice(index, 1);
    }

    const item = this.employeeList.find(x=>x.email==email);
    const itemInCopyList = this.employeeListCopy.find(x=>x.email==email);
    const itemShared =  this.sharedUserList.find(x=>x.email==email);
    if(item||itemShared){
      return;
    }else if(itemInCopyList&&!item){
      this.employeeList.unshift(itemInCopyList);
    }
  }
  onSearch(value){
      this.searchService.searchCompanyEmployee(value, this.currentLoginCompanyId).subscribe(
        res=>{
          // console.log(res);
          this.filteredEmails = res;
        }
      )
      // this.notesService.getUserEmailList(value).subscribe(
      //     res=>{
      //         this.filteredEmails = res;
      //         // .concat(this.employeeList);
      //     }
      // ) 
  }

  onSave(personInput) {

    this.isLoading = true;
    if(this.emailList.length){
      this.addHelper(personInput.value);
      setTimeout(() => {
        // for every email in company employee list
          for(let i = 0; i < this.emailList.length; i++){
            if (this.employeeListCopy.find(x=>x.email === this.emailList[i])){

            }else{
              this.falsedEmailList.push(this.emailList[i]);
              this.emailList.splice(i, 1);
            }
            
          }
          if( this.falsedEmailList.length){
            this.isLoading = false;
            this.dialogService.openAlertDialog('Below list not in company' + ' ' + this.falsedEmailList).subscribe(
              res=>{
                this.falsedEmailList = [];
                if(res){  
                  if(this.emailList.length){
                    this.isLoading = true;
                    this.accountService.shareCustomer(this.currentLoginCompanyId,this.customer_id, this.emailList).subscribe(res1 => {
                      this.userShared = false;
                      this.accountService.getAccount(this.currentLoginCompanyId,this.customer_id).subscribe(
                        res=>{
                          this.sharedUserList = res.shared_with;
                          this.isLoading = false;
                          this.emailList = [];
                        })
                    },
                    err=>{
                     this.userShared = true;
                     this.isLoading = false;
                    }
                  )
                  }
                }
              }
            )
          }else{
            if(this.emailList.length){
              this.accountService.shareCustomer(this.currentLoginCompanyId,this.customer_id, this.emailList).subscribe(res1 => {
                this.userShared = false;
                // console.log(123);
                for(var i = 0; i<this.emailList.length; i++){
                  const item = this.employeeList.find(x=>x.email==this.emailList[i]);
                  // console.log(item);
                  if(item){
                    const idx = this.employeeList.indexOf(item);
                    // console.log(idx);
                    if (idx > -1) {
                      this.employeeList.splice(idx, 1);
                    }
                  }
                }
                
                this.accountService.getAccount(this.currentLoginCompanyId,this.customer_id).subscribe(
                  res=>{
                    this.sharedUserList = res.shared_with;
                    this.isLoading = false;
                    this.emailList = [];
                  })
              },
              err=>{
              //  console.log(err);
               this.userShared = true;
               this.isLoading = false;
              }
            )
            }
          }
        // }
      }, 0);
    }else{
      this.isLoading = false;
      this.errorInput = true;
    }
  }
/*********************************delete shared_user both front end and backend **************************************** */
  destroySharedUser(shared_user){
    this.dialogService.openDialog().subscribe(result=>{
      if(result){
        this.accountService.destroySharedUser(this.currentLoginCompanyId, this.customer_id, shared_user.id).subscribe(
          res=>{
            const idx = this.sharedUserList.indexOf(shared_user);
            if (idx > -1) {
              this.sharedUserList.splice(idx, 1);
            }
            this.toasterService.showToaster('Cancel share finished');
            const item =  this.employeeListCopy.find(x=>x.email==shared_user.email);
            this.employeeList.unshift(item);
           })
      }
    })
  }

  // remove shared user and updating the view ***************old one ****************************
  removeSharedUser(user) {
    this.dialogService.openDialog().subscribe(result => {
      if (result) {
        this.notesService.cancelShare(this.currentLoginCompanyId, user.id).subscribe(res => {
          const idx = this.sharedUserList.indexOf(user);
          if (idx > -1) {
            this.sharedUserList.splice(idx, 1);
          }
          this.toasterService.showToaster('Cancel share finished');
        });

      }
    });
  }

  selectedToSharedList(value){
    if (this.validateEmail(value.email) && !this.emailList.includes(value.email)) {
      this.emailList.push(value.email);
    }
    // console.log(value);
    const item = this.employeeList.find(x=>x.email==value.email);
    const idx = this.employeeList.indexOf(item);
    if (idx > -1) {
      this.employeeList.splice(idx, 1);
    }


  }

  selectOption(event) {
    this.selectedEmail = event.option.value;
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}