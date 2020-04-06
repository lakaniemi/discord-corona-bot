import discord from 'discord.js';
import * as storage from './storage';
import { HealthCareDistrict } from './types/hsApiResponse';

// TODO: Make this customizable per server
const COMMAND_PREFIX = '!';

const formStatusMessage = (
  apiData: storage.DataStorageApiData,
): discord.MessageEmbed => {
  const { totalCounts, statistics } = apiData;

  const summary =
    `Currently **${totalCounts.confirmed}** people have been ` +
    `diagnosed with the virus, of whom **${totalCounts.deaths}** have died ` +
    `and **${totalCounts.recovered}** recovered.`;

  const confirmedInfected = statistics.amountByRegion.confirmed;

  const infectedByRegionString = (Object.keys(
    confirmedInfected,
  ) as HealthCareDistrict[])
    .sort((a, b) =>
      (confirmedInfected[a] || 0) < (confirmedInfected[b] || 0) ? 1 : -1,
    )
    .reduce(
      (result, currentRegion) =>
        result +
        `${currentRegion}: **${
          confirmedInfected[currentRegion as HealthCareDistrict]
        }**\n`,
      '',
    );

  const confirmedDead = statistics.amountByRegion.deaths;

  const deadByRegionString = Object.keys(confirmedDead)
    .sort((a, b) =>
      (confirmedDead[a] || 0) < (confirmedDead[b] || 0) ? 1 : -1,
    )
    .reduce(
      (result, currentRegion) =>
        result + `${currentRegion}: **${confirmedDead[currentRegion]}**\n`,
      '',
    );

  return new discord.MessageEmbed()
    .setTitle('Corona status')
    .setColor(0xff0000)
    .setDescription(summary)
    .addField('Infected people by region', infectedByRegionString, true)
    .addField('Dead by region', deadByRegionString, true);
};

const formDailyMessage = (
  apiData: storage.DataStorageApiData,
): discord.MessageEmbed => {
  const { statistics } = apiData;

  const content = Object.keys(statistics.newCasesByDate)
    // Descending alphabetical order
    .sort((a, b) => (a < b ? 1 : -1))
    // Last 30 days (well, not necessarily, but let's take last 30 items from
    // the array for easiness)
    .slice(0, 30)
    .reduce(
      (result, date) =>
        result + `${date}: **${statistics.newCasesByDate[date]}**\n`,
      '',
    );

  return new discord.MessageEmbed()
    .setTitle('New confirmed infections per day (last 30 daily reports)')
    .setColor(0x0000ff)
    .setDescription(content);
};

export const handleMessage = (
  message: discord.Message | discord.PartialMessage,
): void => {
  const store = storage.getStore();

  if (!message.content || store.apiData === null) return;

  if (message.content.startsWith('!')) {
    const split = message.content.split(' ');
    const command = split[0].substring(COMMAND_PREFIX.length);
    // const args = split.slice(1);

    if (command === 'status') {
      const response = formStatusMessage(store.apiData);
      message.channel?.send(response);
    }

    if (command === 'daily') {
      const response = formDailyMessage(store.apiData);
      message.channel?.send(response);
    }
  }
};
