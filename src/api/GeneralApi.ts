import { AxiosResponse } from 'axios';
import { GetVersion } from '../bloben-interface/version/version';
import Axios from '../lib/Axios';

export default {
  getVersion: async (): Promise<AxiosResponse<GetVersion>> => {
    return Axios.get('/v1/version');
  },
  getSync: async (): Promise<AxiosResponse<any>> => {
    return Axios.get('/v1/sync');
  },
};
