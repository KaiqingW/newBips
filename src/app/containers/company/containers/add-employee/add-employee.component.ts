import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { NotesService } from 'app/core/services/notes.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { CompanyService } from 'app/core/services/company.service';
import { CommonService } from 'app/core/services/common.service';
import { DialogService } from 'app/core/services/dialog.service';


@Component({
    selector: 'add-employee',
    templateUrl: 'add-employee.component.html',
    styleUrls: ['add-employee.component.scss']
})

export class AddEmployeeComponent implements OnInit{
    @ViewChild('personInput') personInput;
    isLoading = false;

// for angular material mat-chip-list and input
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

//all the shared employee list to this company
  addEmployeeList;

// for angular material mat-autocomplete
  filteredEmails: Observable<any[]>;

// check whether user input is valid email address
  emailCtrl: FormControl;
  finalInput;
  
// this company's id
  id;
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
//
  currentCompanyUserLevel;

//position
selected = "Manager" ;
//show note send email modal
showSendEmailModal:boolean;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notesService: NotesService,
    private toasterService: ToasterService,
    private dialogService: DialogService,
    private companyService : CompanyService,
    private commonService : CommonService
    ){
        this.id = +this.route.snapshot.paramMap.get('cid');
        this.currentCompanyUserLevel = +this.route.snapshot.paramMap.get('currentCompanyUserLevel');
        this.isLoading = true;
        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
          (term)=>{
            this.onSearch(term);
            this.finalInput = term;
          }
        )
    }

    ngOnInit(){


        this.companyService.getCompany(this.id).subscribe(res1 => {
            this.company = res1;
            //get current company employee infomation
            this.companyService.getCompanyEmployee(this.id).subscribe(
              res2=>{
                  this.companyEmployee = res2;
                  // console.log(this.companyEmployee);
                  this.isLoading = false;
              }
            )
        }, err => {this.isLoading = false; console.log(err); });
    }
    //search input string
    onSearch(value){
        this.notesService.getUserEmailList(value).subscribe(
          res=>{
            this.filteredEmails = res;
          }
        )
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
  }

    onSave(personInput) {
      this.isLoading = true;
        // getting personInput.value seems to be async, so use settimeout to change the event loop
        this.addHelper(personInput.value);
        setTimeout(() => {
          // for every email in email list
          for (let i = 0; i < this.emailList.length; i++) {

            // search the user according to the email.
            // if the user exists, then share with this user
            // if not exists, send email to notice this employee
            this.notesService.getUserList(this.emailList[i]).subscribe(res => {

              //check this use exist or not
              if (res.data.length !== 0) {
                this.companyService.addEmployee(this.id, res.data[0].id).subscribe(
                  res1 => {
                    this.companyService.getCompanyEmployee(this.id).subscribe(
                      res2=>{
                          this.companyEmployee = res2;
                          this.remove(this.emailList[i]);
                          this.isLoading = false;
                      }
                    )
                },
                err=>{
                  // console.log(err.error.message);
                  this.dialogService.openAlertDialog('This User Already in Employee List').subscribe(
                    res=>{
                      this.isLoading = false;
                      this.remove(this.emailList[i]);
                    }
                  )
                });
              } else {
                this.isLoading = false;
                //email content
                let emialValue={
                          "emails":[this.emailList[i]],
                          "content":"HR watn add you to the system, Please sign up",
                           "subject":"Join us"
                          };
                //dialog message infomation
                let message = "This email not register, Do you want notice this employee via this Email.";
                this.dialogService.openCustomizedYesDialog(message).subscribe(
                  res=>{
                    if(res){
                          this.sendEmailNoticeEmployee(emialValue);
                          this.remove(this.emailList[i]);
                    }else{
                      this.remove(this.emailList[i]);
                    }
                  }
                )
                
                
              }
            });
          }
        //   this.router.navigateByUrl('/notes/subject/' + this.id).then(() => {
        //     this.toasterService.showToaster('Finished Sharing');
        //   });
        }, 0);
      }
      //send email to notice this employee
      sendEmailNoticeEmployee(value){
        this.commonService.sendEmialtoNoticeEmployee(value).subscribe(
          res=>{
            this.isLoading = false;
          }
        )
      }

      //delete the emploee from the company
      deleteEmployee(employee){
        this.dialogService.openDialog().subscribe(result=>{
          if(result){
            this.isLoading = true;
            this.companyService.deleteEmployee(this.id, employee.id).subscribe(res=>{
              const idx = this.companyEmployee.findIndex(n => n.id === employee.id);
              if (idx > -1) {
                this.companyEmployee.splice(idx, 1);
                this.isLoading = false;
              }
            })
          }
        })
      
      }
      // promote this employee
      promoteEmployee(employee){
        this.dialogService.openSureDialog().subscribe(result=>{
          if(result){
              this.isLoading = true;
              this.companyService.promoteEmployee(this.id, employee.id).subscribe(res=>{
                this.companyService.getCompanyEmployee(this.id).subscribe(
                  res2=>{
                      this.companyEmployee = res2;
                      this.toasterService.showToaster('Promote Success');
                      this.isLoading = false;
                  }
                )
            })
          }
        }) 
      }

      demoteEmployee(employee){
        this.dialogService.openSureDialog().subscribe(result=>{
          if(result){
            this.isLoading = true;
            this.companyService.demoteEmployee(this.id, employee.id).subscribe(res=>{
              this.companyService.getCompanyEmployee(this.id).subscribe(
                res2=>{
                    this.companyEmployee = res2;
                    this.toasterService.showToaster('Promote Success');
                    this.isLoading = false;
                }
              )
            })

          }
        })
      }

        // In default, add function add runs before selectOption.
  // To change the event order, set timeout in add function and use selectedEmail to pass the clicked value from autocomplete list
  selectOption(event) {
    this.selectedEmail = event.option.value;
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  getFullName(first_name, last_name){
    return first_name + " " + last_name;
  }
}