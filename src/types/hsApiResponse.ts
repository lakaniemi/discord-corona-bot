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
  // In V2 data format, ID is of form "Lappi_2020-01-29T15:00:00.000Z_1"
  id: string;
  date: string;
  healthCareDistrict: HealthCareDistrict;
};

export type ConfirmedCase = Case & {
  // Infection source and source country no longer available in V2 data, but
  // let's keep in mind that the fields are still there.
  infectionSource: null;
  infectionSourceCountry: null;
};

export type DeathCase = Case & {
  // Basically HYKS, KYS, OYS, TAYS, and TYKS, but typing this more properly
  // does not make sense, because the data sometimes contains some weird cases.
  area: string;
};

export type HSApiResponse = {
  confirmed: ConfirmedCase[];
  deaths: DeathCase[];
  recovered: Case[];
};
