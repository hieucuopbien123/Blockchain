const { ethers } = require("ethers");

// # Tạo instance ethers từ provider / Tạo provider / Từ default provider
const MyContractArtifact = require("./build/contracts/MyContract.json");
const CONTRACT_ADDRESS = MyContractArtifact.networks["5777"].address;
const providerWS = new ethers.getDefaultProvider("http://localhost:9545"); // Tạo websocket provider

const main = async () => {
  // # Thao tác với event / Subscribe to event
  const contract = new ethers.Contract(CONTRACT_ADDRESS, MyContractArtifact.abi, providerWS);
  contract.on("DataChange", (data) => console.log("Catch: ", data));

  const contract2 = new ethers.Contract(CONTRACT_ADDRESS, MyContractArtifact.abi, providerWS.getSigner(0));
  const txResponse = await contract2.setData(2);
  const txReceipt = await txResponse.wait(); 
  console.log(txReceipt);

  // Nếu ta remove event ở đây k ổn, vì để cái event trên phát ra thì transaction phải thực hiện xong 
  // và trải qua 1 vài bước lâu hơn nữa rồi mới phát ra event để bên trên bắt. Tức là event nó phát k 
  // nhanh như là thực hiện trans nên remove event ở dưới có thể chạy trước khi data hàm call back của 
  // event được thực hiện
  // contract.removeAllListeners();
  // Ct sẽ dừng nếu như k có event listener nào còn hoạt động
};
main();