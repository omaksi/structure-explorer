let parser = require('../../../parser/grammar');
var exports = module.exports = {};

exports.parseText = function (text, textData, parserOptions) {
  let previousParsed = textData.parsed;
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
    textData.parsed = previousParsed;
  }
};