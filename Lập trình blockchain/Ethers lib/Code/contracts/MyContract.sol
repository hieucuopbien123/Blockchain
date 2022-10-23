// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract MyContract {
  uint public data;
  event DataChange(uint data);
  function setData(uint _data) external {
    data = _data;
    emit DataChange(_data);
  }
  struct Call {
    address target;
    bytes callData;
  }
  function test(Call[] memory calls) public pure returns (uint256 a1, bytes memory a2){
    bytes memory b = calls[0].callData;
    // Hàm convert bytes sang uint
    uint256 number;
    for(uint i=0;i<b.length;i++){
      number = number + uint(uint8(b[i]))*(2**(8*(b.length-(i+1))));
    }
    return (number, calls[0].callData);
  }
}
