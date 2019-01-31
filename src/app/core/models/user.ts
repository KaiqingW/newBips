import { Company } from './company';

export class User {
  id: number;
  email: string;
  avatar_url: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name : string;
  headline : string;
  experience : string;
  education : string;
  skill : string;
  phone : string;
  industry : string;
  position : string;
  summary : string;
  employed_companies: Company;
}
