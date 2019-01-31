import { Attachment, Warehouse } from './index';

export class Product {
      id: number;
      name: string;
      headline: string;
      images: string[];
      description: string;
      category:string;
      as_showcase: boolean;

      attachments: Attachment[];
      style: string;
      shape: string;
      weight: number;
      material: string;
      warehouses: Warehouse[];

}