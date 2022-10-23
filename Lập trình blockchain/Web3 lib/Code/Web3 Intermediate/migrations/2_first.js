const MyContract = artifacts.require("MyContract");

module.exports = async function (deployer, _, accounts) {
    deployer.deploy(MyContract);
    // await web3.eth.sendTransaction({
    //     from: accounts[0],
    //     to: "0xe0b173BFfC297d9C711D78E888974d8Cd59072Ac",
    //     value: web3.utils.toWei("1", "ether")
    // });
};
