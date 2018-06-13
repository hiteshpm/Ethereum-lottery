const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode} = require('./compile');


let gwei;
const provider = new HDWalletProvider(
     'rival industry know wolf happy sick west road middle dash cover kind',
     'https://rinkeby.infura.io/OiB3jZ1VSrPlkkU19akk'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account',accounts[0]);

    const result = await new  web3.eth.Contract(JSON.parse(interface))
    .deploy({ 
        data : '0x' + bytecode
    })
    .send({ 
        gas : 1000000, 
        //gasPrice : web3.utils.toWei('2',gwei),
        from : accounts[0]
    });

    //we will take both blow two things interface and address where contract deployed and add them in our react app.
    console.log(interface);   
    console.log('Contract deployed to',result.options.address);

};
deploy();