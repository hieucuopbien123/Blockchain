// SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.8.0;

contract MyContract {
    uint data;
    event MyEvent(uint indexed data, uint date, string indexed value);
    function getData() external view returns(uint) {
        return data;
    }
    function setData(uint _data, string calldata value) external {
        data = _data;
        emit MyEvent(data, block.timestamp, value);
    }
    function setDataPrivate(uint _data) private {
        data = _data + 10;
    }
    string public functionCalled;
    function sendEther() external payable {
        functionCalled = "sendEther";
    }
    fallback() external payable {
        functionCalled = "fallback";
    }
    receive() external payable {
        functionCalled = "receive";
    }
}