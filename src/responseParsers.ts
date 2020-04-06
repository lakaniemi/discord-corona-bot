import {
  HSApiResponse,
  HealthCareDistrict,
  Case,
  ConfirmedCase,
  DeathCase,
} from './types/hsApiResponse';

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

type DeathAmountByRegion = {
  [area: string]: number;
};

// TODO: this is kind of duplicate of countCasesByRegion in terms of code, but
// typing it to be more general seemed quite troublesome. Therefore, let's just
// use a separate function for now.
const countDeathsByRegion = (data: DeathCase[]): DeathAmountByRegion =>
  data.reduce(
    (result: DeathAmountByRegion, current) => ({
      ...result,
      [current.area]: (result[current.area] || 0) + 1,
    }),
    {},
  );

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
    deaths: DeathAmountByRegion;
    recovered: CaseAmountByRegion;
  };
  newCasesByDate: NewCasesByDate;
};

export const parseStatisticsFromData = (
  data: HSApiResponse,
): CaseStatistics => ({
  amountByRegion: {
    confirmed: countCasesByRegion(data.confirmed),
    deaths: countDeathsByRegion(data.deaths),
    recovered: countCasesByRegion(data.recovered),
  },
  newCasesByDate: countNewCasesByDate(data.confirmed),
});
