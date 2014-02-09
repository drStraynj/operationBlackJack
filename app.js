process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var mtgox = require('mtgox'),
  client = mtgox.connect(),
  formatting = require('./node_modules/mtgox/console-formatting'),
  tradeFormat = formatting.getTradeFormat,
  priceFormat = formatting.getPriceFormat,
  tickerFormat = formatting.getTickerFormat,
  depthFormat = formatting.getDepthFormat,
  timeFormat = formatting.getTimeFormat;

var lastTradePrice = -1,
  lastTickerPrice = -1,
  lastTickerVolume = -1;

client.on('connect', function() {
  // client.unsubscribe(mtgox.Channel('trade').key);
  // client.unsubscribe(mtgox.Channel('depth').key);
  // client.unsubscribe(mtgox.Channel('ticker').key);
});

client.on('subscribe', function(message) {
  var format = 'Subscribed to channel:'.green;
  console.log(timeFormat(), format, channelFormat(message));
});

client.on('unsubscribe', function(message) {
  var format = 'Unsubscribed from channel:'.red;
  console.log(timeFormat(), format, channelFormat(message));
});

client.on('trade', function(trade) {
  console.log(trade)
  console.log(timeFormat(), tradeFormat(trade, lastTradePrice));
  lastTradePrice = trade.price;
});

client.on('depth', function(depth) {
  console.log(timeFormat(), depthFormat(depth));
});

client.on('ticker', function(ticker) {
  console.log(timeFormat(), tickerFormat(ticker, lastTickerPrice));
  lastTickerPrice = ticker.last;
  lastTickerVolume = ticker.vol;
});

client.on('result', function(result) {
  console.log(timeFormat(), result);
});

process.on('exit', function() {
  console.log('Goodbye!'.bold);
  client.close();
});

function channelFormat(message) {
   return (mtgox.Channel(message.channel) || message.channel).name.magenta;
};
