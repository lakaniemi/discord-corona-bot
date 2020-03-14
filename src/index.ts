import fetch from 'node-fetch';

import { totalCounts, parseStatisticsFromData } from './responseParsers';
import { HSApiResponse } from './types/hsApiResponse';

const main = async (): Promise<void> => {
  const apiResponse = await fetch(
    'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData',
  );
  const result: HSApiResponse = await apiResponse.json();

  console.log(totalCounts(result));
  console.log(parseStatisticsFromData(result));

  //setTimeout(main, 30000);
};

main();
