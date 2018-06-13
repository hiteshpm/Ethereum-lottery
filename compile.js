const path =require('path');
const fs = require('fs');
const solc =require ('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath,'utf8');

module.exports = solc.compile(source,1)  //it will take two agrs first is source code to compile ans second is how many contracts also it fully expots all data

module.exports = solc.compile(source,1).contracts[':Lottery'];  //export only required property like here Inbox contract's property(byte code and interface)
