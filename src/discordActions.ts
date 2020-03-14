import discord from 'discord.js';

export const handleMessage = (
  message: discord.Message | discord.PartialMessage,
): void => {
  console.log(message);
};
