let parser = require('../../../parser/grammar');
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

exports.replaceAllOccurrences = function (oldValue,newValue,state){
  let nodeRegex1 = new RegExp("^"+oldValue + "[,]{1}", "g");
  let nodeRegex2 = new RegExp("[,]{1}"+oldValue+"$", "g");
  let nodeRegex3 = new RegExp("^"+oldValue+"$", "g");
  let nodeRegex4 = new RegExp("[,]{1}"+oldValue+"[,]{1}", "g");

  if(newValue === ""){
    state = state.replace(nodeRegex1, "");
    state = state.replace(nodeRegex2, "");
    state = state.replace(nodeRegex3, "");
    state = state.replace(nodeRegex4, ",");
  }

  else{
    state = state.replace(nodeRegex1, newValue+",");
    state = state.replace(nodeRegex2, ","+newValue);
    state = state.replace(nodeRegex3, newValue);
    state = state.replace(nodeRegex4, ","+newValue+",");
  }
  return state;
};