import Channels, { WindowAPI } from '../../Channels';

function minimizeWindow() {
  window.electron.ipcRenderer.sendMessage(Channels.WINDOW_API, [
    WindowAPI.MINIMIZE
  ]);
}

function maximizeWindow() {
  window.electron.ipcRenderer.sendMessage(Channels.WINDOW_API, [
    WindowAPI.MAXIMIZE
  ]);
}

function unmaximizeWindow() {
  window.electron.ipcRenderer.sendMessage(Channels.WINDOW_API, [
    WindowAPI.UNMAXIMIZE
  ]);
}

function closeWindow() {
  window.electron.ipcRenderer.sendMessage(Channels.WINDOW_API, [
    WindowAPI.CLOSE
  ]);
}

function moveWindow(x: number, y: number) {
  window.electron.ipcRenderer.sendMessage(Channels.WINDOW_API, [
    WindowAPI.MOVE,
    { x, y }
  ]);
}

export { minimizeWindow, maximizeWindow, unmaximizeWindow, closeWindow, moveWindow };
