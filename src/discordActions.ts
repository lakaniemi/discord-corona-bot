import discord from 'discord.js';
import * as storage from './storage';
import { HealthCareDistrict } from './types/hsApiResponse';
import { CountryCode } from './types/countries';

// TODO: Make this customizable per server
const COMMAND_PREFIX = '!';

const formStatusMessage = (
  store: storage.DataStorageFormat,
): discord.MessageEmbed | null => {
  if (store.apiData === null) return null;
  const { totalCounts, statistics } = store.apiData;

  const summary =
    `Currently **${totalCounts.confirmed}** people have been ` +
    `diagnosed with the virus, of whom **${totalCounts.deaths}** have died ` +
    `and **${totalCounts.recovered}** recovered.`;

  const confirmedInfected = statistics.amountByRegion.confirmed;

  const infectedByRegionString = Object.keys(confirmedInfected)
    .sort((a, b) =>
      // This is kind of awkward... But did not manage to quiet down TS any
      // other way. TODO: fix?
      (confirmedInfected[a as HealthCareDistrict] || 0) <
      (confirmedInfected[b as HealthCareDistrict] || 0)
        ? 1
        : -1,
    )
    .reduce(
      (result, currentRegion) =>
        result +
        `${currentRegion}: **${
          confirmedInfected[currentRegion as HealthCareDistrict]
        }**\n`,
      '',
    );

  const infectionSourceCountryString = Object.keys(
    statistics.amountByInfectionCountry,
  )
    .sort((a, b) => {
      if (a === 'unknown' || b === 'unknown') {
        return a === 'unknown' ? 1 : -1;
      }

      // This is kind of awkward... But did not manage to quiet down TS any
      // other way. TODO: fix?
      return (statistics.amountByInfectionCountry[a as CountryCode] || 0) <
        (statistics.amountByInfectionCountry[b as CountryCode] || 0)
        ? 1
        : -1;
    })
    .reduce(
      (result, currentCountry) =>
        result +
        `${currentCountry}: **${
          statistics.amountByInfectionCountry[currentCountry as CountryCode]
        }**\n`,
      '',
    );

  const embed = new discord.MessageEmbed()
    .setTitle('Corona status')
    .setColor(0xff0000)
    .setDescription(summary)
    .addField('Infected people by region', infectedByRegionString, true)
    .addField('Infection source (country)', infectionSourceCountryString, true);

  return embed;
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
      const response = formStatusMessage(store);
      if (response) message.channel?.send(response);
    }
  }
};
