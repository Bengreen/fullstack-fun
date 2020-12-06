apiUrl = process.env.BACKEND_URL || "http://simple.k8s:80"

console.log('Setting up proxy to:', apiUrl);

const PROXY_CONFIG = {
  "/backend": {
    "target": apiUrl,
    "secure": false,
    "logLevel": "debug",
    "bypass": function (req, res, proxyOptions) {
      console.log('Checking proxy for :', req.url);
      switch (req.url) {
        case '/backend/config':
          res.end(JSON.stringify({
            iamhere: 'basicConfig',
            graphqlUrl: '/backend/doo/graphql'
          }));
          return true;
        case '/api/users/authenticate':
          const objectToReturn1 = {
            value1: 1,
            value2: 'value2',
            value3: 'value3'
          };
          res.end(JSON.stringify(objectToReturn1));
          return true;
        case '/api/json2':
          const objectToReturn2 = {
            value1: 2,
            value2: 'value3',
            value3: 'value4'
          };
          res.end(JSON.stringify(objectToReturn2));
          return true;
        default:
          console.log('No bypass for:', req.url);
          // return false;
      }
  }
  }
}


module.exports = PROXY_CONFIG;
