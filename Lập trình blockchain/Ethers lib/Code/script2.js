const { ethers } = require("ethers");

const MyContractArtifact = require("./build/contracts/MyContract.json");
const provider = new ethers.providers.JsonRpcProvider("http://localhost:9545");

const main = async () => {
  // # Basic
  // Các hàm basic
  const balance = await provider.getBalance(provider.getSigner(0).getAddress());
  console.log(balance.toString());
  // Inspect block
  const block = await provider.getBlockNumber();
  const blockInfo = await provider.getBlock(block);
  console.log(blockInfo);
  const { transactions } = await provider.getBlockWithTransactions(block);
  console.log(transactions[0]); // Lấy thông tin mọi transaction có trong 1 block

  // # Tạo instance ethers từ provider / Tạo provider
  // Provider kèm account từ mnemonic or private key
  const privateKey = "966f767890d97fc5a4fe0aa9d013569e1f72eea890bf468ae7d5b3b8cfcbfd73";
  const accountProvider = new ethers.Wallet(privateKey, provider);
  console.log(accountProvider);

  // # Tương tác với contract
  // Tạo instance của contract
  const CONTRACT_ADDRESS = MyContractArtifact.networks["5777"].address;
  const ABI = [
    "function data() view returns(uint)",
    "function setData(uint _data) external",
    "event DataChange(uint data)"
  ];
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, accountProvider);
  // Tạo được instance của contract gắn với 1 tk từ signer của provider(nếu provider đã gắn với signer rồi VD như ví
  // metamask) or provider tự tạo gắn liền với pivkey như trên
  // Or tạo instance của contract gắn với provider global rồi connect với provider account
  const contract2 = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  contract2.connect(accountProvider);

  // # Thao tác với event
  const txResponse = await contract.setData(2); // Thực hiện 1 trans để lấy event
  const txReceipt = await txResponse.wait();
  console.log(txReceipt);
  const catchEvent = await contract.queryFilter("DataChange", 0, block);
  console.log(catchEvent);

  // # Tạo instance ethers từ provider
  // Provider kèm account từ mnemonic or private key / Tương tác với mnemonic và pivkey
  let mnemonic = "announce room limb pattern dry unit scale effort smooth jazz weasel alcohol"
  const walletMnemonic = new ethers.Wallet.fromMnemonic(mnemonic)
  const walletPrivateKey = new ethers.Wallet(walletMnemonic.privateKey); // master pivkey

  console.log(await walletMnemonic.getAddress());
  console.log(walletMnemonic.address);
  console.log(walletMnemonic.privateKey);
  console.log(walletMnemonic.publicKey);
  console.log(walletMnemonic.mnemonic);

  console.log(walletPrivateKey.mnemonic); // Wallet từ pivkey chỉ gắn 1 tk, k có mnemonic
  console.log(walletMnemonic.address === walletPrivateKey.address); // true vì pivkey được tạo từ mnemonic này

  // # Sign
  console.log(await walletMnemonic.signMessage("Hello World")); // Signing a message
  const tx = {
    to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    value: ethers.utils.parseEther("1.0")
  }
  await walletMnemonic.signTransaction(tx); // Signing a transaction

  // # Tạo instance ethers từ provider / Tạo provider / Provider kèm account từ mnemonic or private key
  // Mnemonic or pivkey được thay thế bằng 1 instance của ethers.Wallet, ta có thể tạo ra nó rồi connect với 
  // provider global sau như này
  wallet = walletMnemonic.connect(provider)

  // provider của truffle có sẵn tk nhưng nếu connect với ví ngoài như trên thì tk nó ưu tiên dùng ví ngoài
  console.log(await wallet.getBalance()); // 0
  console.log(await wallet.getTransactionCount()); // 0
};
main();