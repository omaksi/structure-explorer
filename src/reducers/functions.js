let parser = require('../parser/grammar');
var exports = module.exports = {};

exports.parseText = function (text, textData, parserOptions) {
  textData.value = text;
  textData.errorMessage = '';
  if (text.length === 0) {
    textData.parsed = [];
    return;
  }
  try {
    let parsedValue = parser.parse(text, parserOptions);
    if (parsedValue.items) {
      textData.parsed = parsedValue.items;
    } else {
      textData.parsed = parsedValue;
    }
  } catch (e) {
    console.error(e);
    textData.errorMessage = e.message;
    textData.parsed = null;
  }
};

exports.changeDomain = function(newValue,oldValue,domain){
  if(domain.includes(newValue)){
    console.log("yes");
    return domain;
  }
  console.log("before",domain);
  domain = domain.replace(oldValue,newValue);
  console.log("replaced",domain);
  return domain;
};