import Channels, { ObjectStoreAPI } from '../../Channels';

async function set(key: string, value: any): Promise<boolean> {
  return window.electron.ipcRenderer.asyncRequest(Channels.OBJECT_STORE_API, [
    ObjectStoreAPI.SET,
    key,
    value
  ]);
}

async function get(key: string): Promise<any> {
  return await window.electron.ipcRenderer.asyncRequest(Channels.OBJECT_STORE_API, [
    ObjectStoreAPI.GET,
    key
  ]);
}

const ObjectStoreService = {
  set,
  get
};

export default ObjectStoreService;
