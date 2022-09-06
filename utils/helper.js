
module.exports= {
  /**
   * 
   * @param {Object} obj 
   * @param {Object} $value
   * @returns key
   */
    getKeysFromValue(obj, $value){
        const [key, _] = Object.entries(obj).find(([key, value]) => {
          if (value + "-" + $value.currency === $value.name) {
              return key;
          }
        });
        return key;
      }
}