// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
contract RandomAssignment{
    mapping(address => uint) public valueOf;
    event Assign(address indexed addr, uint indexed value);
    function assignValueFor(address addr) public {
        uint val = block.timestamp%15;
        valueOf[addr] = val;
        emit Assign(addr, val);
    }
}
