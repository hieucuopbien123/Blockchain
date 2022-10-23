// # Tạo instance web3 từ provider 

// Tạo instance gắn với 1 tk bằng private key / Dùng package @truffle/hdwallet-provider
const Web3 = require("web3");
const MyContract = require("./build/contracts/MyContract.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const address = "0xe0b173BFfC297d9C711D78E888974d8Cd59072Ac"; // Phải faucet nó
const privateKey = "45ca7539ccb548d938ed418f32363a579963b03347f656a78bd3503d4b00bd20";

const init = async () => {
    // Tương tác với public testnet
    /* Khi dùng mnemonic nên truyền vào dạng object
    const provider = new HDWalletProvider({
        mnemonic: {
            phrase: "<>"
        },
        providerOrUrl: "<>",
        numberOfAddress: <>,
        addressIndex: <>
    }); Vì dùng mnemonic nó có thể generate bao nhiêu key và thao tác với key thứ bnh ta phải nói. Mnemonic là gắn
    với 1 wallet sinh ra nhiều tk, còn private key chỉ gắn với 1 tk trong wallet mà thôi. Thực tế master private key
    ta học nó cũng giống mnemonic vì mnemonic sinh ra từ đó nhưng ở đây nó vẫn coi là như v. */
    const provider = new HDWalletProvider(
        privateKey,
        "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        // Thay url localhost của ganache là url của node trên infura gắn với public net
    )

    // # Tương tác với contract / Send transaction / Deploy contract
    const web3 = new Web3(provider);
    let contract = new web3.eth.Contract(
        MyContract.abi,
    );
    // Ta phải viết code deploy lên pubnet smart contract 1 lần để tương tác chứ k dùng lệnh của truffle được

    contract = await contract.deploy({data: MyContract.bytecode}).send({from: address});

    await contract.methods.setData(10).send({from: address});
    const result = await contract.methods.getData().call();
    console.log(result);
}
init();
// Chạy lâu vì chơi 2 trans cơ mà. run scripts này chứ éo cần truffle deploy hay cái gì hết vì ropstent chả liên quan
// gì đến truffle nx, truffle chỉ là 1 layer hỗ trợ và bổ sung local net mà thôi
// Ta cũng có thể cấu hình file config cho truffle dùng public network nào và từ đó dùng lệnh của truffle thao tác với 
// pubnet tương tự thao tác với ganache
