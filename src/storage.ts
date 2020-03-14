import { CaseAmounts, CaseStatistics } from './responseParsers';
import { promises as fs } from 'fs';
import cloneDeep from 'lodash.clonedeep';

// File, where JSON containing all the data is dumped, so it can be loaded next
// time the software starts. This is basically a lightweight database without
// any benefits of real databases :D For a small project, it's probably enough.
// TODO: if this gets bigger, consider using a real database.
const saveFile = `${process.cwd()}/data.json`;

type DataStorageFormat = {
  apiData: {
    totalCounts: CaseAmounts;
    statistics: CaseStatistics;
  } | null;
};

let store: DataStorageFormat = {
  apiData: null,
};

// Let's not expose mutable store to avoid mistakes. Therefore, return a deep
// clone of the store when needed.
export const getStore = (): DataStorageFormat => cloneDeep(store);

const saveData = async (): Promise<void> => {
  try {
    await fs.writeFile(saveFile, JSON.stringify(store));
  } catch (error) {
    console.error('Storage: Could not save to file: ' + error);
  }
};

export const updateAPIData = async (
  totalCounts: CaseAmounts,
  statistics: CaseStatistics,
): Promise<void> => {
  store = {
    ...store,
    apiData: {
      totalCounts,
      statistics,
    },
  };

  await saveData();
};

export const loadStorageDataFromFile = async (): Promise<void> => {
  try {
    const data = await fs.readFile(saveFile, { encoding: 'utf8' });
    store = JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(
        'Storage: could not load from file, as nothing has been saved yet.',
      );
    } else {
      console.error('Unknown eror: Could not load storage from file: ' + error);
    }
  }
};
