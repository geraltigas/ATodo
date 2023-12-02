import registerWindowAPI from './provider/WindowPRO';
import registerObjectStoreAPI from './provider/ObjectStorePRO';

function channelsRegister() {
  registerWindowAPI();
  registerObjectStoreAPI();
}

export default channelsRegister;
