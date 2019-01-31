import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
// import 'rxjs/add/operator/map';
// import { Http } from "@angular/http";

@Injectable()
export class UpsService {

  constructor(private http: HttpClient) { }

  // got json from yahoo weather API
  // public getShippingFee(value): Observable<any>{
  //   return this.http.post(`https://wwwcie.ups.com/rest/Rate`, value);
  // }

  // got json from yahoo weather API
  public getZip(lat, lng): Observable<any> {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDreddPJLSQbrjQD9r4kTtmGlvdd0ZNsXA`);
  }

  public getShippingFee(value): Observable<any> {
    return this.http.post(environment.ORCA_API + `ups/rating`, value);
  }

  public getUpsCountries(){
    return this.ups_countries;
  }

  ups_countries = [
    { name: 'Albania', code: 'AL' },
    { name: 'Algeria', code: 'DZ' },
    { name: 'American Samoa', code: 'AS' },
    { name: 'Andorra', code: 'AD' },
    { name: 'Angola', code: 'AO' },
    { name: 'Anguilla', code: 'AI' },
    { name: 'Antigua & Barbuda', code: 'AG' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Aruba', code: 'AW' },
    { name: 'Australia', code: 'AU' },
    { name: 'Austria', code: 'AT' },
    { name: 'Azerbaijan', code: 'AZ' },
    { name: 'Azores', code: 'PT' },
    { name: 'Bahamas', code: 'BS' },
    { name: 'Bahrain', code: 'BH' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'Barbados', code: 'BB' },
    { name: 'Belarus', code: 'BY' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Belize', code: 'BZ' },
    { name: 'Benin', code: 'BJ' },
    { name: 'Bermuda', code: 'BM' },
    { name: 'Bhutan', code: 'BT' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Bonaire', code: 'BQ' },
    { name: 'Bosnia and Herzegovina', code: 'BA' },
    { name: 'Botswana', code: 'BW' },
    { name: 'Brazil', code: 'BR' },
    { name: 'British Virgin Isles', code: 'VG' },
    { name: 'Brunei', code: 'BN' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Burkina Faso', code: 'BF' },
    { name: 'Burundi', code: 'BI' },
    { name: 'Cambodia', code: 'KH' },
    { name: 'Cameroon', code: 'CM' },
    { name: 'Canada', code: 'CA' },
    { name: "Canary Islands", code: 'IC' },
    { name: "Cape Verde", code: 'CV' },
    { name: "Cayman Islands", code: 'KY' },
    { name: 'Central African Rep', code: 'CF' },
    { name: 'Chad', code: 'TD' },
    { name: 'Chile', code: 'CL' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Congo', code: 'CG' },
    { name: 'Congo, Democratic Rep', code: 'CD' },
    { name: 'Cook Islands', code: 'CK' },
    { name: 'Costa Rica', code: 'CR' },
    { name: 'Cote d Ivoire', code: 'CI' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Curacao', code: 'CB' },
    { name: 'Cyprus', code: 'CY' },
    { name: 'Czech Republic', code: 'CZ' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Djibouti', code: 'DJ' },
    { name: 'Dominica', code: 'DM' },
    { name: 'Dominican Republic', code: 'DO' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'East Timor', code: 'TL' },
    { name: 'Egypt', code: 'EG' },
    { name: 'El Salvador', code: 'SV' },
    { name: 'England', code: 'EN' },
    { name: 'Equatorial Guinea', code: 'GQ' },
    { name: 'Eritrea', code: 'ER' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Ethiopia', code: 'ET' },
    { name: 'Faeroe Islands', code: 'FO' },
    { name: 'Fiji', code: 'FJ' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'French Guiana', code: 'GF' },
    { name: 'French Polynesia', code: 'PF' },
    { name: 'Gabon', code: 'GA' },
    { name: 'Gambia', code: 'GM' },
    { name: 'Georgia', code: 'GE' },
    { name: 'Germany', code: 'DE' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Gibraltar', code: 'GI' },
    { name: 'Greece', code: 'GR' },
    { name: 'Greenland', code: 'GL' },
    { name: 'Grenada', code: 'GD' },
    { name: 'Guadeloupe', code: 'GP' },
    { name: 'Guam', code: 'GU' },
    { name: 'Guatemala', code: 'GT' },
    { name: 'Guernsey', code: 'GG' },
    { name: 'Guinea', code: 'GN' },
    { name: 'Guinea - Bissau', code: 'GW' },
    { name: 'Guyana', code: 'GY' },
    { name: 'Haiti', code: 'HT' },
    { name: 'Holland', code: 'NL' },
    { name: 'Honduras', code: 'HN' },
    { name: 'Hong Kong', code: 'HK' },
    { name: 'Hungary', code: 'HU' },
    { name: 'Iceland', code: 'IS' },
    { name: 'India', code: 'IN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'Israel', code: 'IL' },
    { name: 'Italy', code: 'IT' },
    { name: 'Jamaica', code: 'JM' },
    { name: 'Japan', code: 'JP' },
    { name: 'Jersey', code: 'JE' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Kazakhstan', code: 'KZ' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Kiribati', code: 'KI' },
    { name: 'Kosrae', code: 'FM' },
    { name: 'Kuwait', code: 'KW' },
    { name: 'Kyrgyzstan', code: 'KG' },
    { name: 'Laos', code: 'LA' },
    { name: 'Latvia', code: 'LV' },
    { name: 'Lebanon', code: 'LB' },
    { name: 'Lesotho', code: 'LS' },
    { name: 'Liberia', code: 'LR' },
    { name: 'Liechtenstein', code: 'LI' },
    { name: 'Lithuania', code: 'LT' },
    { name: 'Luxembourg', code: 'LU' },
    { name: 'Macau', code: 'MO' },
    { name: 'Macedonia', code: 'MK' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Madeira', code: 'PT' },
    { name: 'Malawi', code: 'MW' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Maldives', code: 'MV' },
    { name: 'Mali', code: 'ML' },
    { name: 'Malta', code: 'MT' },
    { name: 'Marshall Islands', code: 'MH' },
    { name: 'Martinique', code: 'MQ' },
    { name: 'Mauritania', code: 'MR' },
    { name: 'Mauritius', code: 'MU' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Micronesia', code: 'FM' },
    { name: 'Moldova', code: 'MD' },
    { name: 'Monaco', code: 'MC' },
    { name: 'Mongolia', code: 'MN' },
    {
      name: 'Montenegro', code: 'ME'
    }, {
      name: 'Montserrat', code: 'MS'
    }, {
      name: 'Morocco', code: 'MA'
    }, {
      name: 'Mozambique', code: 'MZ'
    }, {
      name: 'Namibia', code: 'NA'
    }, {
      name: 'Nepal', code: 'NP'
    }, {
      name: 'Netherlands', code: 'NL'
    }, {
      name: 'Netherlands Antilles', code: 'AN'
    }, {
      name: 'New Caledonia', code: 'NC'
    }, {
      name: 'New Zealand', code: 'NZ'
    }, {
      name: 'Nicaragua', code: 'NI'
    }, {
      name: 'Niger', code: 'NE'
    }, {
      name: 'Nigeria', code: 'NG'
    }, {
      name: 'Norfolk Island', code: 'NF'
    }, {
      name: 'Northern Ireland', code: 'NB'
    }, {
      name: 'N.Mariana Islands', code: 'MP'
    }, {
      name: 'Norway', code: 'NO'
    }, {
      name: 'Oman', code: 'OM'
    }, {
      name: 'Pakistan', code: 'PK'
    }, {
      name: 'Palau', code: 'PW'
    }, {
      name: 'Panama', code: 'PA'
    }, {
      name: 'Papua New Guinea', code: 'PG'
    }, {
      name: 'Paraguay', code: 'PY'
    }, {
      name: 'Peoples Rep of China', code: 'CN'
    }, {
      name: 'Peru', code: 'PE'
    }, {
      name: 'Philippines', code: 'PH'
    }, {
      name: 'Poland', code: 'PL'
    }, {
      name: 'Ponape', code: 'FM'
    }, {
      name: 'Portugal', code: 'PT'
    }, {
      name: 'Puerto Rico', code: 'PR'
    }, {
      name: 'Qatar', code: 'QA'
    }, {
      name: 'Republic of Congo', code: 'CG'
    }, {
      name: 'Republic of Ireland', code: 'IE'
    }, {
      name: 'Republic of Yemen', code: 'YE'
    }, {
      name: 'Reunion', code: 'RE'
    }, {
      name: 'Romania', code: 'RO'
    }, {
      name: 'Rota', code: 'MP'
    }, {
      name: 'Russia', code: 'RU'
    }, {
      name: 'Rwanda', code: 'RW'
    }, {
      name: 'Saba', code: 'AN'
    }, {
      name: 'Saipan', code: 'MP'
    }, {
      name: 'Samoa', code: 'WS'
    }, {
      name: 'San Marino', code: 'SM'
    }, {
      name: 'Saudi Arabia', code: 'SA'
    }, {
      name: 'Scotland', code: 'GB'
    }, {
      name: 'Senegal', code: 'SN'
    }, {
      name: 'Serbia', code: 'RS'
    }, {
      name: 'Seychelles', code: 'SC'
    }, {
      name: 'Sierra Leone', code: 'SL'
    }, {
      name: 'Singapore', code: 'SG'
    }, {
      name: 'Slovakia', code: 'SK'
    }, {
      name: 'Slovenia', code: 'SI'
    }, {
      name: 'Solomon Islands', code: 'SB'
    }, {
      name: 'South Africa', code: 'ZA'
    }, {
      name: ' South Korea', code: 'KR'
    }, {
      name: 'Spain', code: 'ES'
    }, {
      name: 'Sri Lanka', code: 'LK'
    }, {
      name: ' St.Barthelemy', code: 'AN'
    }, {
      name: 'St.Christopher', code: 'KN'
    }, {
      name: 'St.Croix', code: 'VI'
    }, {
      name: 'St.Eustatius', code: 'AN'
    }, {
      name: 'St.John', code: 'VI'
    }, {
      name: 'St.Kitts & Nevis', code: 'KN'
    }, {
      name: 'St.Lucia', code: 'LC'
    }, {
      name: 'St.Maarten', code: 'AN'
    }, {
      name: 'St.Martin', code: 'GP'
    }, {
      name: 'St.Thomas', code: 'VI'
    }, {
      name: 'St Vincent/Grenadine', code: 'VC'
    }, {
      name: 'Suriname', code: 'SR'
    }, {
      name: 'Swaziland', code: 'SZ'
    }, {
      name: 'Sweden', code: 'SE'
    }, {
      name: 'Switzerland', code: 'CH'
    }, {
      name: 'Tahiti', code: 'PF'
    }, {
      name: 'Taiwan', code: 'TW'
    }, {
      name: 'Tajikistan', code: 'TJ'
    }, {
      name: 'Tanzania', code: 'TZ'
    }, {
      name: 'Thailand', code: 'TH'
    }, {
      name: 'Tinian', code: 'MP'
    }, {
      name: 'Togo', code: 'TG'
    }, {
      name: 'Tonga', code: 'TO'
    }, {
      name: 'Tortola', code: 'VG'
    }, {
      name: "Trinidad & Tobago", code: 'TT'
    }, {
      name: 'Truk', code: 'FM'
    }, {
      name: 'Tunisia', code: 'TN'
    }, {
      name: 'Turkey', code: 'TR'
    }, {
      name: 'Turkmenistan', code: 'TM'
    }, {
      name: "Turks & Caicos Isles", code: 'TC'
    }, {
      name: 'Tuvalu', code: 'TV'
    }, {
      name: 'Uganda', code: 'UG'
    }, {
      name: 'Ukraine', code: 'UA'
    }, {
      name: "Union Island", code: 'VC'
    }, {
      name: "United Arab Emirates", code: 'AE'
    }, {
      name: "United Kingdom", code: 'GB'
    }, { name: 'United States', code: 'US' },
    { name: 'Uruguay', code: 'UY' },
    { name: 'US Virgin Islands', code: 'VI' },
    { name: 'Uzbekistan', code: 'UZ' },
    { name: 'Vanuatu', code: 'VU' },
    { name: 'Vatican City State', code: 'VA' },
    {
      name: 'Venezuela', code: 'VE'
    }, { name: 'Vietnam', code: 'VN' },
    {
      name: 'Virgin Gorda', code: 'VG'
    }, {
      name: 'Wales', code: 'GB'
    }, {
      name: 'Wallis & Futuna Isle', code: 'WF'
    }, {
      name: 'Yap', code: 'FM'
    }, {
      name: 'Zambia', code: 'ZM'
    }, {
      name: 'Zimbabwe', code: 'ZW'
    }
  ];

}
