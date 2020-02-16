import axios from 'axios';
import config from '../../../config';

const initialState = {
  userList: '',
};

export const homePage = {
  state: {
    ...initialState,
  },
  reducers: {
    updateContent(state, payload) {
      return { ...state, userList: payload };
    },
    clearState() {
      return { ...initialState };
    },
  },
  effects: (dispatch) => ({
    async fetchGithubUser(payload) {
      try {
        const res = await axios.post(config.user, payload);
        console.log(res);
        dispatch.homePage.updateContent(res.data);
      } catch (err) {
       console.log(err.response);
      }
    },
  }),
};
