enum Channels {
  // IPC_EXAMPLE = 'ipc-example',
  WINDOW_API = 'window-api',
  OBJECT_STORE_API = 'object-store-api',
}

enum WindowAPI {
  MINIMIZE = 'minimize-window',
  MAXIMIZE = 'maximize-window',
  UNMAXIMIZE = 'unmaximize-window',
  CLOSE = 'close-window',
  MOVE = 'move-window',
}

enum ObjectStoreAPI {
  SET = 'set-object-store',
  GET = 'get-object-store',
}

export default Channels;

export { WindowAPI, ObjectStoreAPI };
