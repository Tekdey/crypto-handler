const { getKeysFromValue } = require('./helper')
const axios = require("axios");

module.exports = {
    asyncIterableFetch: {
        [Symbol.asyncIterator]() {
            return {
              i: 0,
               // Feels free to put your dynamic values 
              currency: "USD",
              base: {
                doge: "DOGE",
                shib: "SHIB",
                bitcoin: "BTC",
              },
              async fetch(name) {
                const url = `https://api.coinbase.com/v2/prices/${name.toUpperCase()}-${this.currency}/buy` // coinbase endpoint
                try {
                  const {
                    status, 
                    statusText,
                    data: {
                      data: { base, currency, amount },
                    }
                  } = await axios.get(url);
                    
                  const newObj = {
                    name: name.toUpperCase() + "-" + this.currency, 
                    currency: this.currency
                  };
                  
                  return {
                    status,
                    data: {
                      status,
                      message: statusText,
                      name: getKeysFromValue(this.base, newObj),
                      base,
                      currency,
                      amount,
                    },
                  };
                } catch ({response: {status, statusText, config: { url }}, response}){
                  
                  const newObj = {
                    name: name.toUpperCase() + "-" + this.currency, 
                    currency: this.currency
                  };
        
                  return {
                    status,
                    error: {
                      status,
                      name: getKeysFromValue(this.base, newObj),
                      message: statusText,
                    },
                  };
        
                }
              },
              async next() {
                let resolvedPromise = {};
                if (this.i < Object.keys(this.base).length) {
                  /**
                   *  Data / Error Handler
                   */
                  const {
                    data: request,
                    error,
                    status,
                  } = await this.fetch(Object.values(this.base)[this.i]);
        
                  if (status !== 200) {
                    resolvedPromise = {
                      value: error,
                      id: this.i++,
                    };
                  } else {
                    resolvedPromise = {
                      value: request,
                      id: this.i++,
                    };
                  }
                  return Promise.resolve(resolvedPromise);
                }
        
                return Promise.resolve({ done: true });
              },
            };
          },
      }
    
  };