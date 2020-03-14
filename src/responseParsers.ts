import {
  HSApiResponse,
  HealthCareDistrict,
  Case,
  ConfirmedCase,
} from './types/hsApiResponse';
import { CountryCode, countries } from './types/countries';

export type CaseAmounts = {
  confirmed: number;
  deaths: number;
  recovered: number;
};

export const getTotalCounts = (data: HSApiResponse): CaseAmounts => {
  return {
    confirmed: data.confirmed.length,
    deaths: data.deaths.length,
    recovered: data.recovered.length,
  };
};

type CaseAmountByRegion = {
  [region in HealthCareDistrict]?: number;
};

const countCasesByRegion = (data: Case[]): CaseAmountByRegion =>
  data.reduce(
    (result: CaseAmountByRegion, current) => ({
      ...result,
      [current.healthCareDistrict]:
        (result[current.healthCareDistrict] || 0) + 1,
    }),
    {},
  );

type CaseAmountByInfectionCountry = {
  [country in CountryCode]?: number;
} & { unknown?: number };

// We don't really care about recoveries / deaths based on infection country,
// only about the counts where the infection was from
const countCasesByInfectionCountry = (
  data: ConfirmedCase[],
): CaseAmountByInfectionCountry =>
  data.reduce((result: CaseAmountByInfectionCountry, current) => {
    let infectionSourceCountry: CountryCode | 'unknown';
    if (!current.infectionSourceCountry) {
      infectionSourceCountry = 'unknown';
    } else if (countries[current.infectionSourceCountry] === undefined) {
      // Special case: data is invalid, and does not contain valid alpha-3
      // country code. During testing, there was one case like this. Let's log
      // them so reporting issue is easier.
      console.warn(
        'DATA ISSUE: Unknown country code: ' + current.infectionSourceCountry,
      );
      infectionSourceCountry = 'unknown';
    } else {
      infectionSourceCountry = current.infectionSourceCountry;
    }

    return {
      ...result,
      [infectionSourceCountry]: (result[infectionSourceCountry] || 0) + 1,
    };
  }, {});

type NewCasesByDate = { [date: string]: number };

const countNewCasesByDate = (data: ConfirmedCase[]): NewCasesByDate =>
  data
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .reduce((result: NewCasesByDate, current) => {
      // Let's ignore times and just take the date part. They are in UTC, but
      // none of the cases seem to be near midnight, so I think there's enough
      // accuracy even if we ignore timezones.
      const date = current.date.split('T')[0];

      return {
        ...result,
        [date]: (result[date] || 0) + 1,
      };
    }, {});

export type CaseStatistics = {
  amountByRegion: {
    confirmed: CaseAmountByRegion;
    deaths: CaseAmountByRegion;
    recovered: CaseAmountByRegion;
  };
  amountByInfectionCountry: CaseAmountByInfectionCountry;
  newCasesByDate: NewCasesByDate;
};

export const parseStatisticsFromData = (
  data: HSApiResponse,
): CaseStatistics => ({
  amountByRegion: {
    confirmed: countCasesByRegion(data.confirmed),
    deaths: countCasesByRegion(data.deaths),
    recovered: countCasesByRegion(data.recovered),
  },
  amountByInfectionCountry: countCasesByInfectionCountry(data.confirmed),
  newCasesByDate: countNewCasesByDate(data.confirmed),
});
