export class Header {
    title: string;
    isEditingPage: boolean;
    isBack: boolean;
    dashboard: boolean;
    nextUrl: string;
    needSearching: boolean;
    needCart: boolean;
    showHeader: boolean;
    isHome: boolean;
    constructor(title, isEditingPage = false, isBack = false, dashboard = false, nextUrl = '', needSearching = false, needCart = false, showHeader = true, isHome = false) {
        this.title = title;
        this.isEditingPage = isEditingPage;
        this.isBack = isBack;
        this.dashboard = dashboard;
        this.nextUrl = nextUrl;
        this.needSearching = needSearching;
        this.needCart = needCart;
        this.showHeader = showHeader;
        this.isHome = isHome;
    }

}
/*
Home Header
 */
export const homeHeader: Header = new Header('Home');
export const resetPwdHeader: Header = new Header('Password Reset', false, true);
export const signUpHeader: Header = new Header('Sign Up', false, false, false, '', false, false);
export const loginHeader: Header = new Header('Login', false, false, false, '', false, false);
export const aboutmeHeader: Header = new Header('About Us', false, true);
/*
Notes Header
*/
export const subjectListHeader: Header = new Header('Subject List', false, true, false, 'Home');
export const subjectHeader: Header = new Header('Subject', false, true);
export const addSubjectHeader: Header = new Header('Add Subject', true);
export const addNoteHeader: Header = new Header('Add Note', true);
export const shareHeader: Header = new Header('Note Share', true);
export const noteHeader: Header = new Header('Subject Note', false, true);
export const commentHeader: Header = new Header('Add Comment', true);

/*
Business Notes Header
*/
export const companySubjectListHeader: Header = new Header('Company Subject List', false, true);

/*
Metting Header
*/
export const meetingListHeader: Header = new Header('Meeting List', false, true, false);
export const meetingSubjectHeader: Header = new Header('Meeting Subject', false, true);
export const meetingNoteHeader: Header = new Header('Meeting Project', false, true);
export const meetingNoteDiscussionHeader: Header = new Header('Project Discussion', false, true);
export const assignHeader: Header = new Header('Project Assign', true);
export const addProjectHeader: Header = new Header('Add Project', true);
export const commentReplyHeader: Header = new Header('Add Reply', true);

/*
Business Meeting Header
*/
export const businessMeetingSubjectHeader: Header = new Header('Business Meeting Subject', false, true, true);
export const moreSharedUserHeader: Header = new Header('Shared User List', false, true);

export const businessMeetingProjectHeader: Header = new Header('Business Meeting Project', false, true, true);
export const addStatusHeader: Header = new Header('Add Status', true);
export const addReplyHeader: Header = new Header('Add Reply', true);
export const subjectDiscussionHeader: Header = new Header('Subject Discussion', false, true);
export const projectDiscussionHeader: Header = new Header('Project Discussion', false, true);
export const subjectShareHeader: Header = new Header('Meeting Share', false, true);
export const projectAssignHeader: Header = new Header('Project Owner', false, true);
export const editSubjectHeader: Header = new Header('Edit Subject', true);
export const editProjectHeader: Header = new Header('Edit Project', true);

export const nextBusinessMeetingSubjectHeader: Header = new Header('Next Meeting Subject', false, true, true);
export const addNextSubjectHeader: Header = new Header('Add Next Meeting', true);

/*
Department Opportunity Header
*/
export const departmentOpportunityListHeader: Header = new Header('Opportunity List', false, true);
export const opportunitySubjectHeader: Header = new Header('Opportunity Subject', false, true, true);
export const opportunityPersonProjectHeader: Header = new Header('Opportunity Project', false, true, true);
export const opportunityShareHeader: Header = new Header('Opportunity Share', false, true);
export const salesDepartmentOpportunityListHeader: Header = new Header('Sales Opportunity List', false, true, true);
export const addCustomerOpportunityHeader: Header = new Header('Choose Customer', true);
export const addSalesOpportunityProjectHeader: Header = new Header('Choose Sales', true);
export const crmOpportunityHeader: Header = new Header('CRM Opportunity', false, true, true);
export const setUpOpportunityHeader: Header = new Header('Setup Opportunity', false, true, true);
export const sharedOpportunityProjectListHeader: Header = new Header('Shared Opportunity', false, true, true);
export const addProcessHeader: Header = new Header('Add Process', false, true, true);
export const editMessageHeader: Header = new Header('Edit Message', false, true, true);
export const addPeopleHeader: Header = new Header('Add People', false, true, true);
export const ownerListHeader: Header = new Header('Owner List', false, true);
export const addMessageHeader: Header = new Header('Add Message', true);
export const addApprovalHeader: Header = new Header('Add Approval', true);
export const processAdministratorListHeader: Header = new Header('Process Administrator', false, true);
export const chooseHeader: Header = new Header('Choose', false, true);
export const searchInventoryHeader: Header = new Header('Search Inventory', true);

/*
Setting Header
*/
export const profileUpdateHeader: Header = new Header('Profile Edit', true);


/*
Showcase Header
*/
export const showcaseHeader: Header = new Header('Showcase', false, true);
export const showcaseListHeader: Header = new Header('Showcase List', false, true);

/*
Shop Header
*/
export const itemHeader: Header = new Header('Details', false, true, false, '', false, true);
export const cartHeader: Header = new Header('Shopping Cart', false, true, false, '', false, false);
export const checkoutHeader: Header = new Header('Checkout', false, true, false, '', false, false, true, true);
/*
Inventory Header
*/
export const inventoryHeader: Header = new Header('Inventory', false, true, false, 'dashboard', false);
export const searchItemNumHeader: Header = new Header('Search Item #', false, true, false);
export const productInfoHeader: Header = new Header('Product', false, true, true);
export const addProductHeader: Header = new Header('Add Product', true, true, true);
export const addServiceHeader: Header = new Header('Add Service', true, true, true);
export const editProductHeader: Header = new Header('Edit Product', true, true, true);
export const chooseAddTypeHeader: Header = new Header('Choose Add Type', false, true);
export const productDetailHeader: Header = new Header('Product Detail', false, true);
export const warehouseDetailHeader: Header = new Header('Warehouse Detail', false, true);
export const addWarehouseTransactionHeader: Header = new Header('Add Transaction', true, true);
export const addShowcaseHeader: Header = new Header('Add Showcase', true, true, true);


/*
Purchase Order Header
*/
export const ordersHeader: Header = new Header('Orders', false, true, false);
export const sharedOrdersHeader: Header = new Header('Shared Orders', false, true, false);
export const newOrderHeader: Header = new Header('Add Customer PO', true);
export const newOrderItemHeader: Header = new Header('Add New Order Item', true, true);
export const orderDetailsHeader: Header = new Header('Orders Detail', false, true, true);
export const orderStatusHeader: Header = new Header('Order Status', false, true, true);
export const editOrderStatusHeader: Header = new Header('Edit Order Status', true, true);
export const orderJustShowAttachemntsHeader: Header = new Header('Order Item Attachments', false, true, true);
export const newOrderNotesSubjectHeader: Header = new Header('Add New Note', true, true);
export const noteDetailHeader: Header = new Header('Note Detail', false, true, true);
export const updateArriveDateHeader: Header = new Header('', true, true);
export const companyPurchaseOrder: Header = new Header('P.O', false, true, true);
export const companySalesOrder: Header = new Header('S.O', false, true);
export const newShippedOrderHeader: Header = new Header('Add Shipped', true);

/*
People Header
*/
export const peopleProfileHeader: Header = new Header('Profile', false, true, false);

/*CRM*/
export const crmHeader: Header = new Header('CRM', false, true, false, 'dashboard');
export const leadCompanyHeader: Header = new Header('Company', false, true, true);
export const leadCompanyDetailHeader: Header = new Header('Company Info', false, true);
export const leadCompanyEditHeader: Header = new Header('Company Edit', true, false);

export const potentialCompanyHeader: Header = new Header('Company', false, true, true);
export const potentialCompanyDetailHeader: Header = new Header('Company Info', false, true);
export const potentialCompanyEditHeader: Header = new Header('company Edit', true, false);

export const accountCompanyHeader: Header = new Header('Company', false, true, true);
export const accountCompanyDetailsHeader: Header = new Header('Company Info', false, true);
export const accountCompanyEditHeader: Header = new Header('Company Edit', true, false);

export const addCustomerHeader: Header = new Header('Add Customer', true, false);
export const addContactHeader: Header = new Header('Add Contact', true, false);
export const addOrderContactHeader: Header = new Header('Add Customer Contact', true, false);
export const CustomerShardHeader: Header = new Header('Customer Invite', false, true);
export const contactPageHeader: Header = new Header('Contact', false, true);
export const contactListHeader: Header = new Header('Contacts', false, true);
/*Opportunity*/
export const opportunitiesHeader: Header = new Header('Opportunities', false, true);
export const opportunityDetailHeader: Header = new Header('Opportunity Detail', false, true);

export const requestInfoHeader: Header = new Header('Request Info', false, true);
export const requestPriceHeader: Header = new Header('Request Price', false, true);

/*Quote*/
export const quotasHeader: Header = new Header('Quotes', false, true, true);
export const QuoteCenterHeader: Header = new Header('Quotes Center', false, true, true);
export const addQuoteHeader: Header = new Header('Add Quote', true, false);
export const quoteDetailsHeader: Header = new Header('Quote', false, true);
export const editQuoteHeader: Header = new Header('Edit Quote', true, false);

/*salesorder*/
export const slaesOrderHeader: Header = new Header('SalesOrders', false, true);
export const addSalesOrderHeader: Header = new Header('Add SalesOrder', true, false);
export const salesDetailsHeader = new Header('SalesOrder', false, true);
/*Invoice*/
export const invoiceHeader: Header = new Header('Invoices', false, true);
export const addInvoiceHeader: Header = new Header('Add Invoice', true, false);
export const invoiceDetailsHeader: Header = new Header('Invoice', false, true);

/*HR*/
export const employeeHeader: Header = new Header('HR', false, true, false);
export const addHumanHeader: Header = new Header('Add Human', true, false);
export const humanDetailsHeader: Header = new Header('Human Details', false, true);

/*Financial*/
export const financialHeader: Header = new Header('Financial', false, true);

/*Create company*/
export const createCompanyHeader: Header = new Header('Add Company', true, false);
export const companyInfoHeader: Header = new Header('Company Info', false, true);
export const createProcessHeader: Header = new Header('Create Company', false, true);
export const searchCompanyHeader: Header = new Header('Search Company', false, true);
export const showBusinessHeader: Header = new Header('Company Info', false, true);
export const editCompanyHeader: Header = new Header('Company Edit', true, false);
export const addEmployeeHeader: Header = new Header('Add Employee', false, true);
export const fileboxHeader: Header = new Header('File Box', false, true);
export const ShopDepartmentCategoryHeader: Header = new Header('Shop Department Setting', false, true);
export const settingDashboardUpdateHeader: Header = new Header('Setting Dashboard', false, true);
export const ProductCategoryHeader: Header = new Header('Product Category Setting', false, true);
export const ServiceCategoryHeader: Header = new Header('Service Category Setting', false, true);
export const CompanyCategoryHeader: Header = new Header('Company Category Setting', false, true);
export const CompanyQuotesSettingHeader: Header = new Header('Quote Setting', false, true);

/*dashboard*/
export const dashboardHeader: Header = new Header('DashBoard', false, true, false, '/home')

/* Business Notes Header*/
export const businessSubjectListHeader: Header = new Header('Business Subject List', false, true, true);
export const businessSubjecDetailHeader: Header = new Header('Business Subject Detail', false, true);
export const addBusinessSubjectHeader: Header = new Header('Add Business Subject', true);

/*warehouse*/
export const warehouseHeader: Header = new Header('Warehouse', false, true);
export const addWarehouseInventoryHeader: Header = new Header('Add Inventory', false, true);
export const addWarehouseInventoryQtyHeader: Header = new Header('Add Inventory', true, true);
export const containerInfoHeader: Header = new Header('Container Info', false, true);
export const editContainerInfoHeader: Header = new Header('Edit Container', true, true);
export const addWarehouseHeader: Header = new Header('Add Warehouse', true, true);

/*vendor */
export const vrmHeader: Header = new Header('VRM', false, true, false, 'dashboard');
export const addVenderHeader: Header = new Header('Add Vendor', true, false);
export const pospectVenderHeader: Header = new Header('Vendor', false, true, true);
export const pbackupVenderHeader: Header = new Header('Vendor', false, true, true);
export const mainVenderHeader: Header = new Header('Vendor', false, true, true);
export const vendorDetailsHeader: Header = new Header('Vendor', false, true, true);
export const moreDetailsHeader: Header = new Header('Vender Info', false, true, true);
export const companyEditHeader: Header = new Header('Vender Edit', true, false);
export const vendorProductsHeader: Header = new Header('Vendor Products', false, true);

/*orcamap*/
export const orcaMapHeader: Header = new Header('OrcaMap', false, true);
export const appCenterHeader: Header = new Header('App Center', false, true);

/*broadcast*/
export const broadcastHeader: Header = new Header('Broadcast', false, true, false, 'dashboard');
export const editEmailHeader: Header = new Header('EditEmail', true, false);

/* address */
export const addressesHeader: Header = new Header('Addresses', false, true);
export const addAddressHeader: Header = new Header('Add Address', true, false);
export const EditAddressHeader: Header = new Header('Edit Address', true, false);

/* shop */
export const shopHeader: Header = new Header('Shop Management', false, true);
export const shopManagementEditHeader: Header = new Header('Product Edit', false, true);
export const addSalesPitchSubjectHeader: Header = new Header('Add Sales Pitches', true, true);
export const shopManagementAddHeader: Header = new Header('Add Shop Product', true, true);
export const shopOrderDetailHeader: Header = new Header('Order Detail', true, true);

//shop-order
export const shopOrderHeader: Header = new Header('Shop Orders', false, true);
export const yourOrderHeader: Header = new Header('Your Orders', false, true, false, '', false, false, true, true);


//cost-analysis
export const costAnalysisListHeader: Header = new Header("Cost Analysis", false, true, false, 'dashboard');
export const addCostAnalysisHeader: Header = new Header("Add New Analysis", true, false);
export const costAnalysisdetailHeader: Header = new Header("Analysis Detail", false, true);

//contacts
export const personalContactListHeader: Header = new Header('Contacts', false, true);
export const addPersonalContactHeader: Header = new Header('Add Contact', true, false);
export const personalContactDetailsHeader: Header = new Header('Contact Details', false, true);

//opportunity setting
export const opportunitySettingHeaser: Header = new Header('Opportunity', false, true);
export const addOpportunitySettingHeader: Header = new Header('Opportunity Setting', true, false);
export const addSharedUserHeader: Header = new Header('Share', true, false);
export const addOpportunityEmployeeHeader: Header = new Header('Add Employee', true, false);
export const opportunityEmployeeHeader: Header = new Header('Opportunities', false, true);
//opportunity setting sratus 
export const opportunitySettingStatusHeader: Header = new Header('Discussion', false, true);
export const opportunitySettingStatusAddHeader: Header = new Header('Add Discussion', true, false);
//opprotunity
export const sharedOpportunitiesHeader: Header = new Header('Opportunities', false, true);
export const addOpportunityHeader: Header = new Header('Add Opportunity', true, false);
export const opportunityDetailsHeader = new Header('Opportunity details', false, true);


//opportunity filter
export const allOpportunitiesHeader: Header = new Header('All Opportunities', false, true);

//opportunity status
export const oppotuntiyStatusHeader: Header = new Header('Status Details', false, true);
export const opportunityAddStatusHeader: Header = new Header('Add Status', true, false);
export const opportunityAddCommnetHeader: Header = new Header('Add Comment', true, false);
export const opporutnityAddReplyHeader: Header = new Header('Add Reply', true, false);


//crmAssgnment
export const crmAssignmentListHeader: Header = new Header('CRM Assign', false, true, false, 'dashboard');

//customer confirm page
export const customerConfirmHeader: Header = new Header('Approval', false, true, false, '/home');