pragma solidity ^0.4.17;

contract Lottery{
    address public  manager;
    address[] public players;  //making array of address which store only address of person who want to join contract
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender); //msg.sender give address who is calling enter() and sending moneywith it and we add that address to players array
    }
    
   function random() private view returns (uint) {
        return uint(keccak256(block.difficulty,now,players));
    }
    
    function pickWinner() public restricted {
        
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]){
        return players;
    }

     
}