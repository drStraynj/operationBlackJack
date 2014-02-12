var colors = require('colors'),
  datetime = require('datetime');

exports.getTradeFormat = getTradeFormat;
exports.getPriceFormat = getPriceFormat;
exports.getTickerFormat = getTickerFormat;
exports.getDepthFormat = getDepthFormat;
exports.getTimeFormat = getTimeFormat;

function getTimeFormat() {
  var now = new Date(),
    time = '[' + datetime.format(now, '%T') + ']';
  return time.blue;
};

function getPriceFormat(currentPrice, lastPrice, currency) {
  var format = currentPrice + (currency ? ' ' + currency : '');
  if (lastPrice < 0) return format;

  var delta = currentPrice - lastPrice,
    percent = (lastPrice > 0) ? (delta / lastPrice) * 100 : 100;

  if (delta > 0)
    format += (' \u25b2 +' + round(delta) + ' +' + round(percent) + '%').green;
  else if (delta < 0)
    format += (' \u25bc -' + round(delta) + ' -' + round(percent) + '%').red;

  return format;
  function round(n) { return Math.round(Math.abs(n) * 100) / 100; };
};

function getTradeFormat(trade, lastPrice) {
  var format = getTimeFormat(trade.dateObject) + ' $ ';
  if (trade.trade_type == 'ask') format += 'Ask: '.bold;
  else if (trade.trade_type == 'bid') format += 'Bid: '.bold;

  format += (trade.amount + ' ' + trade.item).yellow + ' @ ';
  format += getPriceFormat(trade.price, lastPrice, trade.price_currency);
  return format;
};

function getDepthFormat(depth) {
  var format = '';

  if (depth.volume < 0) format += '+ '.grey;
  else format += '- '.grey;

  if (depth.type_str == 'ask') format += 'Ask: '.grey.bold;
  else if (depth.type_str == 'bid') format += 'Bid: '.grey.bold;

  var amount = Math.abs(depth.volume);
  var price = Math.abs(depth.price);

  format += (amount + ' ' + depth.item).yellow + ' @ ';
  format += getPriceFormat(price, price, depth.currency);

  return format;
};

function getTickerFormat(ticker, lastPrice) {
  var format = '> ',
    last = 'Last: '.bold;
    high = 'High: '.bold;
    low = 'Low: '.bold;
    vol = 'Vol: '.bold;
    avg = 'Avg: '.bold;

  last += getPriceFormat(ticker.last.display, lastPrice);
  high += ticker.high.display;
  low += ticker.low.display;
  vol += ticker.vol.display;
  avg += ticker.vwap.display;

  return format + [vol, high, low, avg, last].join(' ');
};
