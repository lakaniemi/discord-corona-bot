import { CountryCode } from './countries';

// https://github.com/HS-Datadesk/koronavirus-avoindata

export type HealthCareDistrict =
  | 'Etelä-Karjala'
  | 'Etelä-Pohjanmaa'
  | 'Etelä-Savo'
  | 'HUS'
  | 'Itä-Savo'
  | 'Kainuu'
  | 'Kanta-Häme'
  | 'Keski-Pohjanmaa'
  | 'Keski-Suomi'
  | 'Lappi'
  | 'Länsi-Pohja'
  | 'Pirkanmaa'
  | 'Pohjois-Karjala'
  | 'Pohjois-Pohjanmaa'
  | 'Pohjois-Savo'
  | 'Päijät-Häme'
  | 'Satakunta'
  | 'Vaasa'
  | 'Varsinais-Suomi';

export type Case = {
  id: number;
  date: string;
  healthCareDistrict: HealthCareDistrict;
};

export type ConfirmedCase = Case & {
  infectionSource: number | 'unknown' | 'related to earlier';
  infectionSourceCountry: CountryCode | null;
};

export type HSApiResponse = {
  confirmed: ConfirmedCase[];
  deaths: Case[];
  recovered: Case[];
};
