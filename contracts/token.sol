// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "hardhat/console.sol";

contract Token{

    string public name = "HardHat Token";
    string public sym = "HHT";
    uint public totalSupply = 10000;
    address public owner;

    mapping (address => uint) balances;


    constructor(){
        owner = msg.sender;
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to,uint amount) external {
        // debug
        console.log("Total balance of the snder is %s",balances[msg.sender]);
        require(balances[msg.sender] >= amount,"Not Enough tokens");
        console.log("Token Transfer to %s and amount is %s",to,amount);
        
        balances[msg.sender] -= amount; // deduct amount from sender account 
        // balances[msg.sender] = balances[msg.sender] - amount

        balances[to] += amount; // add amount to the reciever account
    }

    function balanceOf(address account) view external returns(uint256){
        return balances[account];
    }

}
