import discord from 'discord.js';
import fetch from 'node-fetch';

import { getTotalCounts, parseStatisticsFromData } from './responseParsers';
import { HSApiResponse } from './types/hsApiResponse';
import * as storage from './storage';
import { config } from './config';
import { handleMessage } from './discordActions';

const client = new discord.Client();

client.on('ready', () => {
  console.log('Successfully logged in to Discord');
});

client.on('message', handleMessage);

const main = async (): Promise<void> => {
  try {
    // Get old data from storage, so it can be compared with new API response
    let oldData = storage.getStore();

    // If apiData is null, it usually means the program has just started, let's
    // try to load data from file in that case.
    if (oldData.apiData === null) {
      await storage.loadStorageDataFromFile();
      oldData = storage.getStore();
    }

    const apiResponse = await fetch(
      'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2',
    );
    const result: HSApiResponse = await apiResponse.json();

    const counts = getTotalCounts(result);
    const stats = parseStatisticsFromData(result);

    // Update new data to storage
    await storage.updateAPIData(counts, stats);
  } catch (error) {
    console.error('Error in main loop: ' + error);
  }

  setTimeout(main, config.apiPollInterval);
};

// Run the software by setting up Discord and starting API call
client.login(config.discord.token);
main();
