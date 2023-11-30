import { ipcMain } from 'electron';
import Channels, { WindowAPI } from '../../Channels';
import WindowService from '../service/WindowService';


function registerWindowAPI() {
  ipcMain.on(Channels.WINDOW_API, async (event, arg) => {
    switch (arg[0]) {
      case WindowAPI.MINIMIZE:
        WindowService.minimize(arg);
        break;
      case WindowAPI.MAXIMIZE:
        WindowService.maximize(arg);
        break;
      case WindowAPI.UNMAXIMIZE:
        WindowService.unmaximize(arg);
        break;
      case WindowAPI.CLOSE:
        WindowService.close(arg);
        break;
      case WindowAPI.MOVE:
        WindowService.move(arg);
        break;
      default:
        break;
    }
  });
}

export default registerWindowAPI;
