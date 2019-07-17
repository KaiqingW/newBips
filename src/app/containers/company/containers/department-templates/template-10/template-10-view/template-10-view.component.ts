import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteService } from 'app/core/services/website.service';

@Component({
    selector: 'template-10-view',
    templateUrl: './template-10-view.component.html',
    styleUrls: ['./template-10-view.component.scss'],
})

export class Template10ViewComponent implements OnInit, OnChanges {
    @Input() row;
    @Input() isEdit: boolean = false;
    company_id: number;
    templateForm: FormGroup;

    @Output() onEditContent = new EventEmitter<any>();

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private websiteService: WebsiteService
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

    getRowBackground(row) {
        if (!row || !row.background_image || !row.background_image.url) return {};

        return {
            "background-image": `url(${row.background_image.url})`
        }
    }

    getColumnPicture(column) {
        if (column.image && column.image.url) {
            return column.image.url;
        }
        return "";
    }
}