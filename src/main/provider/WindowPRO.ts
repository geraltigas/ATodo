import { ipcMain, screen } from 'electron';
import { mainWindow } from '../main';
import Channels, { WindowAPI } from '../../Channels';

let widthO: number | undefined;
let heightO: number | undefined;
let positionXO: number | undefined;
let positionYO: number | undefined;
let xO: number | undefined;
let yO: number | undefined;

function registerWindowAPI() {
  ipcMain.on(Channels.WINDOW_API, async (event, arg) => {
    switch (arg[0]) {
      case WindowAPI.MINIMIZE:
        console.log(`ipcMain.on(Channels.WINDOW_API) ${arg}`);
        mainWindow?.minimize();
        break;
      case WindowAPI.MAXIMIZE:
        console.log(`ipcMain.on(Channels.WINDOW_API) ${arg}`);
        const primaryDisplay = screen.getPrimaryDisplay();
        const dimensions = primaryDisplay.workAreaSize;
        const { width, height } = dimensions;
        // get former window size
        widthO = mainWindow?.getSize()[0];
        heightO = mainWindow?.getSize()[1];
        // get former window position
        positionXO = mainWindow?.getPosition()[0];
        positionYO = mainWindow?.getPosition()[1];
        mainWindow?.setSize(width, height);
        mainWindow?.setPosition(0, 0);
        break;
      case WindowAPI.UNMAXIMIZE:
        console.log(`ipcMain.on(Channels.WINDOW_API) ${arg}`);
        if (typeof widthO === 'number') {
          if (heightO != null) {
            mainWindow?.setSize(widthO, heightO);
          }
        }
        if (positionXO != null) {
          if (positionYO != null) {
            mainWindow?.setPosition(positionXO, positionYO);
          }
        }
        mainWindow?.unmaximize();
        break;
      case WindowAPI.CLOSE:
        console.log(`ipcMain.on(Channels.WINDOW_API) ${arg}`);
        mainWindow?.close();
        break;
      case WindowAPI.MOVE:
        const { x, y } = arg[1];
        if (x == 0 && y == 0) {
          break;
        }
        xO = mainWindow?.getPosition()[0];
        yO = mainWindow?.getPosition()[1];
        mainWindow?.setPosition(xO + x, yO + y);
        break;
      default:
        break;
    }
  });
}

export default registerWindowAPI;
