const {asyncIterableFetch} = require('./utils/asyncIterable');
 

async function getCurrenciesPrice() {
  const cryptoList = {};
  for await (let data of asyncIterableFetch) {
    const {status} = data;

    if (status !== 200) {
      console.log(data);
    } else {
      cryptoList[data.name] = data;
    }
  };

  return cryptoList;
}

// setInterval(getCurrenciesPrice, 10000)