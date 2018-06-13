const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} =require('../compile');

let lottery;     //hold instance of our contract
let accounts;   //hold list of accout thatgenerated automatically unlock for us as a part of ganache cli


beforeEach(async () =>{

    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy( { data : bytecode})
    .send( { from : accounts[0], gas : '1000000'});
});


describe('lottery contract', () => {
    it('deploy a lottery contract', () => {
       assert.ok(lottery.options.address); 
    });




    it('allows one account to enter', async () =>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02','ether')
        });

        
        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });

        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);   //assertion that there are three players and should be euual to players.length

        });



    it('allows multiple account to enter', async () =>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02','ether')
        });

        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02','ether')
        });

        await lottery.methods.enter().send({
            from : accounts[2],
            value : web3.utils.toWei('0.02','ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });

        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);

        assert.equal(3,players.length);   //assertion that there are three players and should be euual to players.length

        });

     it('requires a minimum amount of ether to enter', async () => {
 
          try {
              await lottery.methods.enter().send({
                  from :accounts[0],
                  value : 0                 //give any value which caused it should fail to test error
              });
              assert(false);

          } catch (err){
              assert(err);
          }
        });

          it('only manager can call pickWinner', async () => {

            try {
                await lottery.methods.pickWinner().send({
                    from : accounts[1],       //we gave account[1] means this is not manager so test will give error
                    value : 0                 //give any value which caused it should fail to test error
                });
                assert(false);
  
            } catch (err){
                assert(err);
            }
  
          });
  
          it('sends money to winner and reset the player array',async () => {

            await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('2', 'ether')
            });

            const initialBalance =await web3.eth.getBalance(accounts[0]);

            await lottery.methods.pickWinner().send({ from : accounts[0] });

            const finalBalance = await web3.eth.getBalance(accounts[0]);

            const difference = finalBalance-initialBalance;
            console.log(difference);

            assert(difference > web3.utils.toWei('1.8', 'ether'));    //1.8 becasue some amount of gas spent approximately we are taking close to 2 but less than 2
          });

    });