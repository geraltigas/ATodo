import { ipcMain } from 'electron';
import Channels, { ObjectStoreAPI } from '../../Channels';
import ObjectStoreService from '../service/ObjectStoreService';


function registerObjectStoreAPI() {
  ipcMain.on(Channels.OBJECT_STORE_API, async (event, args: any[]) => {
    console.log('ipcMain.on', Channels.OBJECT_STORE_API, args[0]);
    try {
      switch (args[0]) {
        case ObjectStoreAPI.SET:
          let bool = await ObjectStoreService.set(args[1], args[2]);
          event.reply(`${Channels.OBJECT_STORE_API}-reply`, bool);
          break;
        case ObjectStoreAPI.GET:
          const result = await ObjectStoreService.get(args[1]);
          event.reply(`${Channels.OBJECT_STORE_API}-reply`, result);
          break;
        default:
          break;
      }
    } catch (error) {
      event.reply(`${Channels.OBJECT_STORE_API}-reply`, error);
    }
  });
}

export default registerObjectStoreAPI;
