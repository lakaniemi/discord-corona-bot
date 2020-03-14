import { HSApiResponse, HealthCareDistrict, Case } from './types/hsApiResponse';

export type CaseAmounts = {
  confirmed: number;
  deaths: number;
  recovered: number;
};

export const totalCounts = (data: HSApiResponse): CaseAmounts => {
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
  data.reduce((result: CaseAmountByRegion, current) => {
    return {
      ...result,
      [current.healthCareDistrict]:
        (result[current.healthCareDistrict] || 0) + 1,
    };
  }, {});

export type AllCaseTypesByRegion = {
  confirmed: CaseAmountByRegion;
  deaths: CaseAmountByRegion;
  recovered: CaseAmountByRegion;
};

export const casesByRegion = (data: HSApiResponse): AllCaseTypesByRegion => ({
  confirmed: countCasesByRegion(data.confirmed),
  deaths: countCasesByRegion(data.deaths),
  recovered: countCasesByRegion(data.recovered),
});
