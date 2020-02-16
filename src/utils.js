import axios from './httpClient';
import config from './config';
import Compressor from 'compressorjs';
import facebookFeed from './assets/images/facebook.svg';
import messengerIcon from './assets/images/messenger.svg';
import viberIcon from './assets/images/viber.svg';
import defaultPlatform from './assets/images/default_platform.svg';

const getUpdatedButtonElement = (buttons, data) => {
  const { id, buttonIndex, title, type, value, messenger_extensions } = data;
  const newData = { id, title, type, value, messenger_extensions };
  return buttons.map((button, i) => {
    if (buttonIndex === i) {
      return { ...button, ...newData };
    }
    return { ...button };
  });
};

export const getUpdatedBlocks = (blocks, payload, type) => {
  return blocks.map((block) => {
    if (block.id === payload.id) {
      const supportedKeys = ['title', 'subtitle', 'url', 'image'];

      if (type === 'buttons') {
        if (payload.changeKey === 'buttons') {
          const newButtons = getUpdatedButtonElement(
            block.data.buttons,
            payload.data
          );
          block.data.buttons = newButtons;
        } else if (payload.changeKey === 'text') {
          block.data[payload.changeKey] = payload.data;
        }
      } else if (type === 'gallery') {
        const newGalleries = block.data.elements.map((elem, i) => {
          if (i === payload.galleryIndex) {
            if (payload.changeKey === 'buttons') {
              const newButtons = getUpdatedButtonElement(
                elem.buttons,
                payload.data
              );
              return { ...elem, buttons: newButtons };
            } else if (supportedKeys.includes(payload.changeKey)) {
              elem[payload.changeKey] = payload.data;
              return { ...elem };
            }
          }
          return { ...elem };
        });
        block.data.elements = newGalleries;
      }
      block.save = false;
    }
    return block;
  });
};

export const handleImageUpload = (file, callback) => {
  if (file.type === 'image/gif') {
    const formData = new FormData();
    formData.append('file', file, file.name);
    axios
      .post(config.image, formData)
      .then((res) => {
        callback(res.data.url);
      })
      .catch((err) => console.log(err));
  } else {
    new Compressor(file, {
      quality: 0.7,
      maxHeight: 1000,
      success(result) {
        const formData = new FormData();
        formData.append('file', result, result.name);
        axios
          .post(config.image, formData)
          .then((res) => {
            callback(res.data.url);
          })
          .catch((err) => console.log(err));
      },
      error(err) {
        console.log(err.message);
      },
    });
  }
};

export const handleFileUpload = (file, callback) => {
  const formData = new FormData();
  formData.append('file', file, file.name);
  axios
    .post(config.file, formData)
    .then((res) => {
      callback(res.data.url);
    })
    .catch((err) => console.log(err));
};

export const updateOnChangeText = (
  value,
  setShowAttribute,
  setShowAPI,
  setText
) => {
  let currentValue = value;
  let lastTwoChar = currentValue.slice(
    currentValue.length - 2,
    currentValue.length
  );
  if (lastTwoChar === '{{') {
    setShowAttribute(true);
  } else if (lastTwoChar === '<<') {
    !!setShowAPI && setShowAPI(true);
  } else {
    setShowAttribute(false);
    !!setShowAPI && setShowAPI(false);
  }
  setText(value);
};

export const updateOnChangeAttribute = (
  value,
  setShowAttributeField,
  setVariable
) => {
  if (value.length < 3) {
    setShowAttributeField(true);
  } else {
    setShowAttributeField(false);
  }
  setVariable(value);
};

export const updateOnSelectAttribute = (
  intent,
  showAttribute,
  showAPI,
  setShowAttribute,
  setShowAPI,
  setText,
  text,
  apiList
) => {
  if (showAttribute) {
    let currentValue = text + intent + '}}';
    setShowAttribute(false);
    setText(currentValue);
  } else {
    let currentAPI = apiList.filter((apis) => apis.title === intent)[0];
    let currentValue = text + currentAPI.title + '|' + currentAPI.id + '>>';
    setShowAPI(false);
    setText(currentValue);
  }
};

export const reorderList = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const getUpdatedPlatformName = (type) => {
  switch (type) {
    case 'facebook_messenger':
      return 'Facebook Messenger';
    case 'facebook_feed':
      return 'Facebook Feed';
    case 'viber_messenger':
      return 'Viber';
    default:
      return type;
  }
};

export const getUpdatedPlatformIcon = (type) => {
  switch (type) {
    case 'facebook_messenger':
      return messengerIcon;
    case 'facebook_feed':
      return facebookFeed;
    case 'viber_messenger':
      return viberIcon;
    default:
      return defaultPlatform;
  }
};

export const validateInputFields = (data, fields) => {
  const requiredFields = fields.filter((f) => f.is_required).map((f) => f.id);
  const dataKeys = Object.keys(data).map((k) => parseInt(k));
  const validated = requiredFields.every((val) => {
    return dataKeys.includes(val);
  });

  const fieldsObj = fields.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.id]: { ...cur },
    }),
    {}
  );

  if (validated) {
    const ignore = ['id', 'lab_id', 'creator_id', 'source'];
    const dataPair = Object.entries(data).filter((d) => !ignore.includes(d[0]));

    const isValid = dataPair.every(([key, value]) => {
      const field = fieldsObj[key];
      if (
        field.is_required &&
        (value === '' || value === null || value === undefined)
      ) {
        return false;
      }
      return true;
    });

    return isValid;
  }

  return false;
};

export const copyClipboard = (text) => {
  let input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  let result = document.execCommand('copy');
  document.body.removeChild(input);
  return result;
};

export const isValidEmail = (text) => {
  const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi;
  return email.test(text);
};

export const isValidUsername = (text) => {
  const username = /^[a-zA-Z0-9@.\-_]{5,50}$/gi;
  return username.test(text);
};

export const isValidUrl = (text) => {
  const url = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gi;
  if (!!text) {
    return url.test(text);
  }
  return true;
};

export const generateRandomString = (length) => {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const settingsNavData = [
  {
    title: 'User Settings',
    data: [
      {
        id: 0,
        title: 'User Information',
        link: '/settings/profile#user-settings',
        icon: 'user',
      },
      {
        id: 1,
        title: 'Change Password',
        link: '/settings/profile#password',
        icon: 'key',
      },
    ],
  },
  {
    title: 'Project Settings',
    data: [
      {
        id: 2,
        title: 'Project',
        link: '/settings/projects#project-settings',
        icon: 'projects',
      },
      {
        id: 3,
        title: 'Facebook Platform',
        link: '/settings/projects#facebook',
        icon: 'chat',
      },
      {
        id: 4,
        title: 'Viber Platform',
        link: '/settings/projects#viber',
        icon: 'chat',
      },
      {
        id: 5,
        title: 'NLP Settings',
        link: '/settings/projects#nlp-settings',
        icon: 'layers',
      },
    ],
  },
];
