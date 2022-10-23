const { ethers } = require("ethers");
const MyContractArtifact = require("./build/contracts/MyContract.json");

const CONTRACT_ADDRESS = MyContractArtifact.networks["5777"].address;

// # Tạo instance ethers từ provider / Tạo provider
// Từ url liên kết với node
const provider = new ethers.providers.JsonRpcProvider("http://localhost:9545"); // Dùng url global ok
/*
Phía frontend, connect ví như metamask bth:
const provider = new ethers.providers.Web3Provider(window.ethereum / or provider từ bất cứ ví nào);

Từ default provider
const provider = new ethers.providers.getDefaultProvider();
getDefaultProvider() dùng để connect với ethereum mainnet, nó trả ra cái gọi là fallback provider phức tạp nhưng 
under the hood, nó cũng chỉ connect với các node lk với mạng ethereum như infura, alchemy để tương tác với blockchain
Từ đó mỗi khi send request, nó sẽ so sánh kết quả trả về của các API khác nhau để đảm bảo trả về cùng 1 kết quả. 
Nhưng rõ ràng ở đây ta k hề truyền vào API_KEY mà vẫn dùng được vì nó dùng các default account có sẵn bởi đội ngũ của 
ethersjs Đó là các account chung mà ai cài ethersjs cũng dùng được nên đôi khi đạt tới maximum usage limit nên thỉnh 
thoảng gặp lỗi kiểu fail to reach hoặc too many request
=> Kiểu này chỉ dùng để test nhanh có luôn provider chứ k dùng trong production. Trong production, ta nên dùng riêng
api key của ta và tk trả phí để k bị giới hạn số lượng người. VD:
const provider = new ethers.providers.getDefaultProvider({infura: INFURA_KEY, alchemy: ALCHEMY_KEY,....});

Connect vào testnet public nhanh
const provider = new ethers.getDefaultProvider("kovan");
Cơ chế tương tự như trên nhưng testnet ta phải truyền rõ tên là testnet nào ra

Cách khác tạo từ url liên kết với node
Tương tự connect vào bất cứ mạng nào bằng key riêng của ta:
const provider = new ethers.providers.InfuraProvider/AlchemyProvider("kovan", API_KEY);

Provider kèm account từ mnemonic or private key
const wallet = new ethers.Wallet.fromMnemonic("mnemonic here", provider);
const signer = wallet.getSigner(); // 1 ví có nhiều account
*/


async function main() {
  // # Tương tác với contract
  
  // Tạo instance của contract
  // Trong web3 nó dùng abi trong file json, trong ethers ta vẫn có thể dùng như v nhưng còn 1 cách nữa là cung
  // vào mảng interface của contract là từng cục string
  const ABI = [
    "function data() view returns(uint)",
    "function setData(uint _data) external"
  ];
  // const readOnlylContract = new ethers.Contract(CONTRACT_ADDRESS, MyContractArtifact.abi, provider);
  const readOnlylContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  // Call getter function
  const value = await readOnlylContract.data();
  console.log(value); // Dữ liệu số lấy trực tiếp từ SM là 1 bignumber object
  console.log(value.toString());

  // Send transactions
  // Gửi tiền vào địa chỉ nào
  // Gửi tiền vào địa chỉ của EOA nào: phải lấy được signer 
  const signer0 = provider.getSigner(0);
  const signer = provider.getSigner(1);
  const tx = await signer.sendTransaction({
    to: signer0.getAddress(),
    value: 1000 // wei => thường dùng ethers.utils.parseEther
  })
  await tx.wait();
  console.log(tx);
  // Gửi coin vào địa chỉ contract cũng được nhưng tham số sẽ khác

  // Thực hiện 1 transaction của SM: phải lấy được contract object gắn với signer
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const txResponse = await contract.setData(2); // Chờ send tới network
  const txReceipt = await txResponse.wait(); // Chờ trans được mine xong
  console.log(txReceipt);

  // Deploy rồi thực hiện trans luôn
  const contractFactory = new ethers.ContractFactory(
    MyContractArtifact.abi,
    MyContractArtifact.bytecode,
    signer0
  );
  const contractInstance = await contractFactory.deploy(); // Nên try catch xem deploy có lỗi k
  // Có thể truyền tham số vào constructor là deploy
  await contractInstance.deployTransaction.wait();
  console.log("Address of deployed contract: ", contract.address);
  await contractInstance.setData(5, {from: signer0.getAddress()});
  const res = await contractInstance.data();
  console.log(res.toString());

  // # Basic / Dùng utils
  console.log(ethers.utils.formatEther(1000)); // In 1000 wei dưới dạng ether
  console.log(ethers.utils.parseEther("1.2")); // Convert từ ether sang wei => đương nhiên là BigNumber object.
  // Dùng toString để đơn giản hiển thị kiểu wei cho data dạng string
  console.log(ethers.utils.formatUnits("1000", 18));
  console.log(ethers.utils.parseUnits("2.3", 18)); // 2 cái này tương tự trên nhưng truyền được số lượng số thập phân
}
main();