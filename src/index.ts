import fetch from 'node-fetch';

import { getTotalCounts, parseStatisticsFromData } from './responseParsers';
import { HSApiResponse } from './types/hsApiResponse';
import * as storage from './storage';

// In milliseconds
const API_POLL_INTERVAL = 60 * 1000;

const main = async (): Promise<void> => {
  // Get old data from storage, so it can be compared with new API response
  let oldData = storage.getStore();

  // If apiData is null, it usually means the program has just started, let's
  // try to load data from file in that case.
  if (oldData.apiData === null) {
    await storage.loadStorageDataFromFile();
    oldData = storage.getStore();
  }

  const apiResponse = await fetch(
    'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData',
  );
  const result: HSApiResponse = await apiResponse.json();

  const counts = getTotalCounts(result);
  const stats = parseStatisticsFromData(result);

  // Update new data to storage
  await storage.updateAPIData(counts, stats);

  setTimeout(main, API_POLL_INTERVAL);
};

main();
