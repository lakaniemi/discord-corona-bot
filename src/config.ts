import dotenv from 'dotenv';

// Load environment variables.
dotenv.config();

const { BOT_TOKEN } = process.env;

export const config = {
  discord: {
    token: BOT_TOKEN,
  },
  // In milliseconds
  apiPollInterval: 60 * 1000,
};
