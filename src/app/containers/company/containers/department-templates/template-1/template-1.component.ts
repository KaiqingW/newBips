import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebsiteService } from '../../../../../core/services/website.service';

@Component({
    selector: 'template-1',
    templateUrl: './template-1.component.html',
    styleUrls: ['./template-1.component.scss'],
})

export class Template1Component implements OnInit, OnChanges {
    @Input() row;
    @Input() isEdit: boolean = false;
    templateForm: FormGroup;
    company_id: number;
    sub : Subscription
    componentStyle = {
        component: {
            //preset
            "background-repeat": "no-repeat, repeat",
            "background-size": "cover",
            " background-position": "50% center",
            "width": "100%",
            "min-height": "400px",
            display: "flex",
            "justify-content": "center",
            "box-sizing": "border-box",
            "flex-direction": "column",
            "align-items": "center",
            "padding": "1vw 13vw",
            ///////////////

            //custom
            // "background-image": "url('https://orcasmart.com/assets/images/banner/campers.jpg')",
            // "background-color": "white",
            color: "white",
            // height: "500px",


        },
        title: {
            // preset
            "padding": "1vw",

            //custom
            'font-size': "5vw",
        },
        content: {
            // preset
            "padding": "1vw",
        }
    };

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private websiteService: WebsiteService
    ) {
        this.company_id = + this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {
        // this.componentStyle.component['background-image'] = "url('https://orcasmart.com/assets/images/banner/campers.jpg')";
        this.createTemplateForm();
    }

    ngOnChanges() {
        if (this.row) {
            this.getBackgroundPicture();
            this.patchFormValue();
        }
    }

    getBackgroundPicture() {
        if (this.row.dummy_template) return;
        this.componentStyle.component["background-image"] = `url(${this.row.background_image.url})`;
    }

    createTemplateForm() {
        this.templateForm = this.fb.group({
            template_id: 1,
            title: [""],
            description: [""],
            background_image_id: [""]
        });
    }

    patchFormValue() {

    }

    onSave() {
        this.websiteService.rowSubject.next(this.templateForm.value);
    }

    onGetImageChange(imgs) {
        this.templateForm.patchValue({
            background_image_id : imgs[0].id
        });
        this.setBackgroundImg(imgs[0]);
    }

    setBackgroundImg(img){
        this.componentStyle.component["background-image"] = `url(${img.url})`;
        console.log(this.componentStyle);
    }
}