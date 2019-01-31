import { Contact, Showcase } from './index';

export class LeadDetail

{
         id: number;
         name: string;
         industry:string;
         possibility:string;
         usage: string;
         logo_url: string;
         telephone: string;
         fax: string;
         email: string;
         website: string;
         address: string;
         description: string;
         contacts: Contact[];
         showcases: Showcase[];
}
