const devUrl = 'https://api.github.com';
const stagingUrl = 'YOUR STAGE URL HERE';
const productionUrl = 'YOUR LIVE URL HERE';
const status = 'dev';

const url =
  status === 'production'
    ? productionUrl
    : status === 'staging'
    ? stagingUrl
    : devUrl;

const config = () => {
  return {
    user: `${url}/users`,
  };
};

export default config();
