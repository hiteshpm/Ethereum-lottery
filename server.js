var express = require('express');
var bodyparser = require('body-parser');
var fs = require('fs');

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const InputDataDecoder = require('ethereum-input-data-decoder');

const provider = new HDWalletProvider(
     'rival industry know wolf happy sick west road middle dash cover kind',
     //'https://rinkeby.infura.io/OiB3jZ1VSrPlkkU19akk'
      'https://mainnet.infura.io/OiB3jZ1VSrPlkkU19akk'
);

const web3 = new Web3(provider);



var app =express();
const port = process.env.PORT || 3000;

app.use(bodyparser.json());

 //api to get transaction detail and address change   
app.get('/eth/api/v1/transaction/:txid', (req,res) => {
  var txid =req.params.txid;
  web3.eth.getTransaction(txid, function(err, result) { 
    
    if (!err) {
    
      res.send({
        "block":{  
          "blockHeight":result.blockNumber
       },
       "outs":[  
          {  
             "address":result.to,
             "value":(web3.utils.fromWei(result.value, 'wei'))
          }
       ],
       "ins":[  
          {  
             "address":result.from,
             "value":"-"+(web3.utils.fromWei(result.value, 'wei'))
          }
       ],
       "hash":result.hash,
       "currency":"ETH",
       "chain":"ETH.main",
       "state":"confirmed",
       "depositType":"account"


      });
 
    } else {
        console.log('Error!', err);
    }
});

})


//erc20 transaction details

app.get('/eth/api/v1/erctransaction/:erctxid', (req,res) => {
  var erctxid =req.params.erctxid;
  web3.eth.getTransaction(erctxid, function(err, ercresult) { 
    
    if (!err) {
      var inputData= ercresult.input;
      var str = inputData.toString(16);      

      var toAddress = str.slice(34,74);
      var value = str.slice(75,138);
       
      res.send({
        "block": {
          "blockHeight": ercresult.blockNumber
          },
          "outs": [
          {
          "address":'0x' + toAddress ,
          "value": (web3.utils.fromWei(value, 'wei')),
          "type": "token",
          "coinspecific": {
          "tokenAddress": ercresult.to
          }
          }
          ],
          "ins": [
          {
          "address": ercresult.from,
         "value": "-"+(web3.utils.fromWei(value, 'wei')),
          "type": "token",
          "coinspecific": {
          "tokenAddress": ercresult.to
          }
          }
          ],
          "hash":ercresult.hash,
          "currency": "ETH",
          "state": "confirmed",
          "depositType": "Contract",
          "chain": "ETH.main",
     });
 
    } else {
        console.log('Error!', err);
    }
});

})


//contract execution transaction details

app.get('/eth/api/v1/ctetransaction/:ctetxid', (req,res) => {
  var ctetxid =req.params.ctetxid;
  web3.eth.getTransaction(ctetxid, function(err, cteresult) { 
    
    if (!err) {
      var inputDatacte = cteresult.input;
      var str = inputDatacte.toString(16);      

      var toAddress = str.slice(34,74);
      var value = str.slice(75,138);
      
      res.send({
        "block": {
          "blockHeight": cteresult.blockNumber
          },
          "outs": [
          {
          "address":'0x' + toAddress ,
          "value": (web3.utils.fromWei(value, 'wei')),
          "type": "token",
          "coinspecific": {
            "tracehash": cteresult.hash
          }
          }
          ],
          "ins": [
          {
          "address": cteresult.to,
         "value": "-"+(web3.utils.fromWei(value, 'wei')),
          "type": "token",
          "coinspecific": {
          "tracehash": cteresult.hash
          }
          }
          ],
          "hash":cteresult.hash,
          "currency": "ETH",
          "state": "confirmed",
          "depositType": "Contract",
          "chain": "ETH.main",
     });
 
    } else {
        console.log('Error!', err);
    }
});

})


app.listen(port,() => {
  console.log(`Started up at port ${port}`);
});