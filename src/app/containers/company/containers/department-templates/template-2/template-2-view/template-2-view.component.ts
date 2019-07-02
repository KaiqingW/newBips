import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'template-2-view',
    templateUrl: './template-2-view.component.html',
    styleUrls: ['./template-2-view.component.scss'],
})

export class Template2ViewComponent implements OnInit, OnChanges {
    @Input() row;
    @Input() isEdit: boolean = false;
    company_id: number;
    templateForm: FormGroup;

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.company_id = + this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {


    }

    ngOnChanges() {
    }

    getBackground(column) {
        if (!column || !column.background_image || !column.background_image.url) return {};
        return {
            "background-image": `linear-gradient(0deg, rgba(60, 65, 60, 0.4), rgba(77, 75, 75, 0.4)), url(${column.background_image.url})`
        }
    }

    onNavTo(url) {
        // this.router.navigate([url])
        window.location.href = url;
    }

    getBackgroundColor() {
        return this.isEdit ? 'grey' : 'white';
    }

}