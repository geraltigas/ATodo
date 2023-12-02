import fs from 'fs';

const ObjectStoreService = {

  set: async (key: string, value: any): Promise<boolean> => {
    if (!fs.existsSync('./tasks')) {
      fs.mkdirSync('./tasks');
    }
    fs.writeFileSync(`./tasks/${key}.json`, JSON.stringify(value), { flag: 'w' });
    return fs.existsSync(`./tasks/${key}.json`);
  },
  get: async (key: string): Promise<any> => {
    if (fs.existsSync(`./tasks/${key}.json`)) {
      const data = fs.readFileSync(`./tasks/${key}.json`, { encoding: 'utf-8' });
      return JSON.parse(data);
    }
    return null;
  }

};

export default ObjectStoreService;
