// # Tạo instance web3 từ provider / Tạo instance gắn với 1 tk bằng private key / Dùng web3 thuần 
// # Basic / eth

const Web3 = require("web3");
const MyContract = require("./build/contracts/MyContract.json");

const init = async () => {
  const privateKey = "45ca7539ccb548d938ed418f32363a579963b03347f656a78bd3503d4b00bd20";
  const web3 = new Web3("https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

  const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
  console.log(account);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address; // Gán mặc định address sử dụng

  let contract = new web3.eth.Contract(
    MyContract.abi,
  );

  // Phải set đầy đủ gasPrice, gas. Sau khi deploy nó mới trả về contract có thể thực hiện hàm và phải gán như dưới
  contract = await contract.deploy({data: MyContract.bytecode}).send({
    from: account.address,
    gas: 10000000,
    gasPrice: 35528001045,
  });

  await contract.methods.setData(10).send({
    from: account.address,
    gas: 10000000,
    gasPrice: 35528001045,
  });
  const result = await contract.methods.getData().call();
  console.log(result);
}
init();