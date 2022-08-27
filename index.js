require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

// fetch

const asyncIterableFetch = {
  [Symbol.asyncIterator]() {
    return {
      i: 0,
      currency: "USD",
      base: {
        doge: "DOGE",
        shib: "SHIB",
        bitcoin: "BTC",
      },
      async fetch(name) {
        // console.log(name);
        try {
          return await axios.get(
            `https://api.coinbase.com/v2/prices/${name.toUpperCase()}-${
              this.currency
            }/buy`
          );
        } catch ({ response }) {
          //TODO:   fs.appendFile(); créer les logs sous forme de txt dans le serveur
          return {
            error: {
              status: response.status,
              message: response.statusText,
            },
          };
        }
      },
      async next() {
        let resolvedPromise = {};
        if (this.i < Object.keys(this.base).length) {
          const { data: request, error } = await this.fetch(
            Object.values(this.base)[this.i]
          );
          if (error) {
            resolvedPromise = {
              value: { error: error },
              id: this.i++,
            };
          } else {
            resolvedPromise = {
              value: {
                [Object.keys(this.base)[this.i]]: request.data,
              },
              id: this.i++,
            };
          }

          return Promise.resolve(resolvedPromise);
        }

        return Promise.resolve({ done: true });
      },
    };
  },
};

// async output
const cryptoList = [1, 2, 3, 4, 5, 6];

(async function () {
  for await (let crypto of asyncIterableFetch) {
    if (crypto.error) {
      console.log(error);
    } else {
      console.log(Object.values(crypto));
      //TODO: destructuration de crypto et valeur dynamique (bitcoin, doge, shiba) pour les lister avec un status
    }
  }
})();
