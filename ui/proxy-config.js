apiUrl = process.env.BACKEND_URL || "http://simple.k8s"

const PROXY_CONFIG = {
  "/monkey": {
    "target": apiUrl,
    "secure": false,
    "logLevel": "debug",
    "bypass": function (req, res, proxyOptions) {
      switch (req.url) {
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
      }
  }
  }
}


module.exports = PROXY_CONFIG;
