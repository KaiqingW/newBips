import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessQuotaComponnet } from './business-quota.component';
import { AddQuoteComponent } from './add-quote/add-quote.component';
import { QuoteDetailsComponent } from './quote-details/quote-details.component';
import { EditSalesentityComponent } from './edit-salesentity/edit-salesentity.component';
import { NotesSubjectDetailComponent } from 'app/components/business-notes/notes-subject-detail/notes-subject-detail.component';
import { quotasHeader,addQuoteHeader,quoteDetailsHeader, slaesOrderHeader, editQuoteHeader, 
         addSalesOrderHeader, salesDetailsHeader, businessSubjectListHeader,
         invoiceHeader, addInvoiceHeader, invoiceDetailsHeader }  from 'app/core/models/header';

const businessQuotaRoutes: Routes = [
    //quote
    
    
    // {
    //     path:'quote',
    //     component: BusinessQuotaComponnet,
    //     data: quotasHeader
    // },
    {
        path:'quote/draft',
        component: BusinessQuotaComponnet,
        data: quotasHeader
    },

    {
        path:'quote/processing',
        component: BusinessQuotaComponnet,
        data: quotasHeader
    },

    {
        path:'quote/send',
        component: BusinessQuotaComponnet,
        data: quotasHeader
    },
// for add 
    {
        path:'quote/draft/add-quote',
        component: AddQuoteComponent,
        data: addQuoteHeader
    },
    {
        path:'quote/processing/add-quote',
        component: AddQuoteComponent,
        data: addQuoteHeader
    },
    {
        path:'quote/send/add-quote',
        component: AddQuoteComponent,
        data: addQuoteHeader
    },
// for details with id
    {
        path:'quote/draft/:seid',
        component:QuoteDetailsComponent,
        data: quoteDetailsHeader
    },
    {
        path:'quote/processing/:seid',
        component:QuoteDetailsComponent,
        data: quoteDetailsHeader
    },
    {
        path:'quote/send/:seid',
        component:QuoteDetailsComponent,
        data: quoteDetailsHeader
    },
// quote noteSubject and notes note
    {
        path:'quote/draft/:seid/notes/:nsId',
        component:NotesSubjectDetailComponent,
        data: businessSubjectListHeader
    },

    {
        path:'quote/processing/:seid/notes/:nsId',
        component:NotesSubjectDetailComponent,
        data: businessSubjectListHeader
    },
   
    {
        path:'quote/send/:seid/notes/:nsId',
        component:NotesSubjectDetailComponent,
        data: businessSubjectListHeader
    },

    // {
    //     path:'quote/:seid',
    //     component:QuoteDetailsComponent,
    //     data: quoteDetailsHeader
    // },
    {
        path: 'quote/draft/:seid/edit',
        component: EditSalesentityComponent,
        data: editQuoteHeader
    },
    {
        path: 'quote/processing/:seid/edit',
        component: EditSalesentityComponent,
        data: editQuoteHeader
    },
    {
        path: 'quote/send/:seid/edit',
        component: EditSalesentityComponent,
        data: editQuoteHeader
    },

    {
        path: 'quote/draft/add-quote/notes',
        loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
        data: businessSubjectListHeader
    },

    //salesorder
    {
        path:'salesorder/new',
        component: BusinessQuotaComponnet,
        data: slaesOrderHeader
    },
    {
        path:'salesorder/confirmed',
        component: BusinessQuotaComponnet,
        data: slaesOrderHeader
    },
    {
        path:'salesorder/pickedup',
        component: BusinessQuotaComponnet,
        data: slaesOrderHeader
    },
    {
        path:'salesorder/delivered',
        component: BusinessQuotaComponnet,
        data: slaesOrderHeader
    },
    // salesorder add 
    {
        path:'salesorder/new/add-salesorder',
        component: AddQuoteComponent,
        data: addSalesOrderHeader
    },
    {
        path:'salesorder/confirmed/add-salesorder',
        component: AddQuoteComponent,
        data: addSalesOrderHeader
    },
    {
        path:'salesorder/pickedup/add-salesorder',
        component: AddQuoteComponent,
        data: addSalesOrderHeader
    },
    {
        path:'salesorder/delivered/add-salesorder',
        component: AddQuoteComponent,
        data: addSalesOrderHeader
    },

    // {
    //     path:'salesorder/add-salesorder',
    //     component: AddQuoteComponent,
    //     data: addSalesOrderHeader
    // },
    // for details with id
    {
        path:'salesorder/new/:seid',
        component: QuoteDetailsComponent,
        data: salesDetailsHeader
    },
    {
        path:'salesorder/confirmed/:seid',
        component: QuoteDetailsComponent,
        data: salesDetailsHeader
    },
    {
        path:'salesorder/pickedup/:seid',
        component: QuoteDetailsComponent,
        data: salesDetailsHeader
    },
    {
        path:'salesorder/delivered/:seid',
        component: QuoteDetailsComponent,
        data: salesDetailsHeader
    },

    // {
    //     path:'salesorder/:seid',
    //     component:QuoteDetailsComponent,
    //     data: salesDetailsHeader
    // },
    
    // invoice
    {
        path:'invoice/needinvoice',
        component: BusinessQuotaComponnet,
        data: invoiceHeader
    },
    {
        path:'invoice/invoiced',
        component: BusinessQuotaComponnet,
        data: invoiceHeader
    },
    {
        path:'invoice/paid',
        component: BusinessQuotaComponnet,
        data: invoiceHeader
    },

    //invoice add
    {
        path:'invoice/needinvoice/add-invoice',
        component: BusinessQuotaComponnet,
        data: invoiceHeader
    },
    {
        path:'invoice/invoiced/add-invoice',
        component: BusinessQuotaComponnet,
        data: invoiceHeader
    },
    {
        path:'invoice/paid/add-invoice',
        component: BusinessQuotaComponnet,
        data: invoiceHeader
    },

    //for invoice with id
 
    {
        path:'invoice/needinvoice/:seid',
        component: BusinessQuotaComponnet,
        data: invoiceHeader
    },
    {
        path:'invoice/invoiced/:seid',
        component: BusinessQuotaComponnet,
        data: invoiceHeader
    },
    {
        path:'invoice/paid/:seid',
        component: BusinessQuotaComponnet,
        data: invoiceHeader
    },



    // {
    //     path:'invoice/add-invoice',
    //     component: AddQuoteComponent,
    //     data: addInvoiceHeader
    // },
    // {
    //     path:'invoice/:seid',
    //     component:QuoteDetailsComponent,
    //     data: invoiceDetailsHeader
    // }

]

@NgModule({
    imports: [
        RouterModule.forChild(businessQuotaRoutes)
    ],
    exports:[
        RouterModule
    ],
    providers:[

    ]
})

export class BusinessQuotaRoutingModule{

}