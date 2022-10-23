// ## Solidity / # Dùng truffle / # Viết test trong truffle

// Viết test bằng file sol
pragma solidity >=0.4.21 <0.7.0;

// Sau khi deploy thì trong contract solidity, có thể import 2 file này của truffle hỗ trợ test
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";

contract TestSimpleStorage {
  function testItStoresAValue() public {
    SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

    simpleStorage.set(89);
    uint expected = 89;
    
    Assert.equal(simpleStorage.get(), expected, "It should store the value 89.");
  }
}
