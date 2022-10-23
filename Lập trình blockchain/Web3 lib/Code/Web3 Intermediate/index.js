// # Tạo instance web3 từ provider

// Tạo instance gắn với 1 tk bằng private key / Dùng package @truffle/hdwallet-provider
const Web3 = require("web3");
const MyContract = require("./build/contracts/MyContract.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const address = "0x01abea4e43cac4b1529f6f82922d4ec0d4aea9ba";
const privateKey = "b727579ba7ad2a1223fd226e3ef8ff0706534e7a6d540795b97b132a994ce836";

const init = async () => {
    // Tương tác với ganache
    // Ganache đơn giản chỉ cần provider tự dùng account đầu tiên, ở đây ta dùng 1 account chỉ định cơ
    const provider = new HDWalletProvider(
        privateKey, // Có thể truyền vào mảng các key, có thể dùng mnemonic thay thế
        "http://localhost:9545"
    )
    // Lưu ý là ta dùng hdwalletprovider để nhận key trả ra provider liên kết tk đó trên network. Nhưng ở đây ta dùng
    // ganache => tài khoản này chỉ có 0 ether nên chả làm được gì => ta có thể chuyển tiền cho nó từ 1 tk sẵn có ok 
    // luôn trong file migration

    const web3 = new Web3(provider);
    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );
    await contract.methods.setData(10).send({from: address});
    const result = await contract.methods.getData().call();
    console.log(result);
}
init();
