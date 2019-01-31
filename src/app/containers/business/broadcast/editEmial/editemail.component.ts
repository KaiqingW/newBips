import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
    selector:'editemail',
    templateUrl:'editemail.component.html',
    styleUrls:['editemail.component.scss']
})

export class editEmailComponent implements OnInit{

    broadcastForm: FormGroup;
    contactsList;
    innerContent='100';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
    ){
        this.contactsList = this.route.snapshot.paramMap.get('contactsList');
        this.createBroadcastForm();
    }

    ngOnInit(){
        console.log(this.contactsList);
    }

    createBroadcastForm(){
        this.broadcastForm = this.fb.group({
            emails:[''],
            subject:[''],
            content:['']
        })
    }

    promoteProduct(){
        console.log(123);
    }
    
}