// https://github.com/HS-Datadesk/koronavirus-avoindata

type Case = {
  id: number;
  date: string;
  healthCareDistrict: string;
};

type ConfirmedCase = Case & {
  infectionSource: number | 'unknown' | 'related to earlier';
  infectionSourceCountry: string | null;
};

type HSApiResponse = {
  confirmed: ConfirmedCase[];
  deaths: Case[];
  recovered: Case[];
};
