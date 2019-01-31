import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService } from 'app/core/services/notes.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { AuthService } from 'app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { StoreState, User } from 'app/core/models';
import { UserService } from 'app/core/services/user.service';
import { Router } from '@angular/router';
import * as AuthActions from 'app/core/actions/auth.action';
import { ToasterService } from 'app/core/services/toaster.service';
import { ImageService } from 'app/core/services/image.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ZipCodeService } from 'app/core/services/zipcode.service';



import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  isLoading = false;

  // current user
  user;

  // used for first name and last name
  profileForm: FormGroup;

  // for angular img cropper
  data: any;
  cropperSettings;
  modalOpenCropImage = false;
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  // for angular material mat-chip-list and input
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  // separator to separate user input as chips
  separatorKeysCodes = [ENTER, COMMA];


  zipcodeCtrl: FormControl;
  zipcode;
  city;
  state;
  country;
  fullAddress:boolean = false;
  zipcodeError:boolean = false;
  allFieldRequied:boolean = false;

  constructor(private notesService: NotesService,
              private fb: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private store: Store<StoreState>,
              private toasterService: ToasterService,
              private imageService: ImageService,
              private zipCodeService: ZipCodeService
            ) {

                this.cropperSettings = new CropperSettings();
                this.cropperSettings.noFileInput = true;
                this.cropperSettings.width = 350;
                this.cropperSettings.height = 350;
                this.cropperSettings.dynamicSizing = true;
                this.data = {};
                this.isLoading = true;
                this.zipcodeCtrl = new FormControl();
                this.zipcodeCtrl.valueChanges.subscribe(
                    (term)=> {
                        this.onSearch(term);
                    }
                )
               }

  ngOnInit() {
    // listen to the save button in the header tool bar
    setTimeout(() => {
      const buttonClick = document.getElementById('header-submit-edit');
      buttonClick.addEventListener('click', () => {
        if(!this.profileForm.valid){
          this.allFieldRequied = true;
          alert('Please fill all address infomation');
        }
        if (this.profileForm.valid) {
          this.onSave();
        }
      });
    }, 0);

    this. getCurrentUser();
  }

  getCurrentUser(){
   
    this.authService.getCurrentUser().subscribe(res => {
      this.user = res.user;
      console.log(this.user);
      this.createForm();
      if(this.user.address !=null){
        this.profileForm.patchValue({
          address:{
            street1: this.user ? this.user.address.street1 : '',
            street2: this.user ? this.user.address.street2 : '',
            city: this.user ? this.user.address.city : '',
            state: this.user ? this.user.address.state : '',
            zipcode: this.user ? this.user.address.zipcode : '',
            country: this.user ? this.user.address.country : '', 
          }
        })
        this.profileForm.patchValue({
          address_id:this.user ? this.user.address.id : ''
        })
        this.isLoading = false;
        console.log(this.profileForm.value);
      }else{
        this.isLoading = false;
        console.log(this.profileForm.value);
      }
    });
  }


  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      const myReader: FileReader = new FileReader();
        const image = new Image();
        myReader.onloadend = (loadEvent: any) => {
          image.onload = (event) => {
            if (image.height < 3000 && image.width < 3000) {
              this.cropper.setImage(image);
            } else {
              alert(`Image too large. close this box and wait for a few seconds.`);
              this.cropper.setImage(image);
            }
          };
          image.src = loadEvent.target.result;
        };
      myReader.readAsDataURL(file);
      this.modalOpenCropImage = true;
    }
  }


  // after crop image, upload the image and replace user's avatar_url
  cropImage() {
    this.isLoading = true;
    const formData = this.imageService.urltoFormData(this.data.image);
    this.imageService.uploadImage(formData).subscribe(
        res => {
          this.user.avatar_url = res.url;
          this.isLoading = false;
          this.modalOpenCropImage = false;
        },
        err => {
          this.isLoading = false;
          this.modalOpenCropImage = false;
        }
      );
  }

  createForm() {
    this.profileForm = this.fb.group({
      first_name: [this.user ? this.user.first_name : '', [Validators.required, Validators.maxLength(20)]],
      last_name: [this.user ? this.user.last_name : '', [Validators.required, Validators.maxLength(20)]],
      middle_name: [this.user ? this.user.middle_name : ''],
      gender: [this.user ? this.user.gender : '' ],
      // email: [this.user ? this.user.email : '', [Validators.required, Validators.maxLength(200)]],
      // headline: [this.user ? this.user.headline : ''],
      experience: [this.user ? this.user.experience : ''],
      education: [this.user ? this.user.education : ''],
      skill: [this.user ? this.user.skill : ''],
      phone_number: [this.user ? this.user.phone_number : ''],
      industry: [this.user ? this.user.industry : '', ],
      // position: [this.user ? this.user.position : '', [Validators.required, Validators.maxLength(100)]],
      summary: [this.user ? this.user.summary : ''],
      address_id:[],
      
      address: this.fb.group({
          street1: [''],
          street2: [''],
          city: [''],
          state: [''],
          zipcode: [''],
          country: [''],
        })
    });
  }

  // save the user's profile and set current user in redux store
  onSave() {
    this.isLoading = true;
    const profile = this.profileForm.value;
    profile.avatar_url = this.user.avatar_url;
    profile.email = this.user.email;
    this.userService.updateProfile(profile, this.user.id).subscribe(() => {
      this.store.dispatch(new AuthActions.SetCurrentUser(profile));
      this.router.navigateByUrl(`/home`).then(() => {
        this.toasterService.showToaster('Profile updated');
      });
    });
  }


  onSearch(value){
    if(value.length>=5){
        this.zipCodeService.getZipCodeAddress(value).subscribe(
            res=>{
                // console.log(res);
                if(res.results.length>0){
                    const formatt=res.results[0].formatted_address.split(', ');
                    const stetaAndZipcode = formatt[1].split(' ');
                    // console.log(res.results);
                    // console.log(formatt);
                    this.state = stetaAndZipcode[0];
                    this.zipcode =  stetaAndZipcode[1];
                    this.city = formatt[0];
                    this.country = formatt[2];
                    this.fullAddress = true;
                    this.zipcodeError = false;
                    this.allFieldRequied = false;
                }else{
                    // console.log("err");
                    this.zipcodeError = true;
                    this.allFieldRequied = false;
                }
            },
            err=>{
                console.log(err);
            }
        )
    }
   
}



  getFirstnameErrorMessage() {
    return this.profileForm.controls.first_name.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.first_name.hasError('maxlength') ? 'Should be at most 20 characters' :
        '';
  }
  getLastnameErrorMessage() {
    return this.profileForm.controls.last_name.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.last_name.hasError('maxlength') ? 'Should be at most 20 characters' :
        '';
  }
  getMiddlenameErrorMessage() {
    return this.profileForm.controls.middle_name.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.middle_name.hasError('maxlength') ? 'Should be at most 20 characters' :
        '';
  }
  getGenderErrorMessage() {
    return this.profileForm.controls.gender.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.gender.hasError('maxlength') ? 'Should be at most 6 characters' :
        '';
  }
  getEmailErrorMessage() {
    return this.profileForm.controls.email.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.email.hasError('maxlength') ? 'Should be at most 200 characters' :
        '';
  }
  getHeadlineErrorMessage() {
    return this.profileForm.controls.headline.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.headline.hasError('maxlength') ? 'Should be at most 100 characters' :
        '';
  }
  getExperienceErrorMessage() {
    return this.profileForm.controls.experience.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.experience.hasError('maxlength') ? 'Should be at most 100 characters' :
        '';
  }

  getEducationErrorMessage() {
    return this.profileForm.controls.education.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.education.hasError('maxlength') ? 'Should be at most 100 characters' :
        '';
  }
  
  getSkillErrorMessage() {
    return this.profileForm.controls.skill.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.skill.hasError('maxlength') ? 'Should be at most 100 characters' :
        '';
  }
  getPhoneErrorMessage() {
    return this.profileForm.controls.phone.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.phone.hasError('maxlength') ? 'Should be at most 10 characters' :
        '';
  }

  getIndustryErrorMessage() {
    return this.profileForm.controls.industry.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.industry.hasError('maxlength') ? 'Should be at most 100 characters' :
        '';
  }
  
  getPositionErrorMessage() {
    return this.profileForm.controls.position.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.position.hasError('maxlength') ? 'Should be at most 100 characters' :
        '';
  }

  getSummaryErrorMessage() {
    return this.profileForm.controls.summary.hasError('required') ? 'You must enter a value' :
        this.profileForm.controls.summary.hasError('maxlength') ? 'Should be at most 1000 characters' :
        '';
  }
}
