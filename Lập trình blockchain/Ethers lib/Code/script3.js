const { ethers } = require("ethers");

const MyContractArtifact = require("./build/contracts/MyContract.json");
const provider = new ethers.providers.JsonRpcProvider("http://localhost:9545");

const main = async () => {

  // # Tương tác với contract
  // Truyền vào struct cho contract dưới dạng mảng
  const CONTRACT_ADDRESS = MyContractArtifact.networks["5777"].address;
  const contract = new ethers.Contract(CONTRACT_ADDRESS, MyContractArtifact.abi, provider);
  const res = await contract.test([[CONTRACT_ADDRESS.toLowerCase(), 2]]);
  console.log(res);
  // Trong contract hàm return phải viết rõ tên biến trả về thì ta mới lấy được giống kiểu object như dưới
  console.log(res.a2);

  // Khi gọi hàm từ contract của solidity mà phải truyền vào bytes hay lấy ra bytes ta có thể lấy ra như string or
  // số bth mà k cần phải chuyển đổi gì cả. VD bytes trong params truyền vào hàm thì trong SM ta phải truyền 0x... 
  // vào chứ truyền số như 1 vào sẽ bị lỗi. Nhưng ở đây ta truyền số 1 vào thoải mái vì nó tự chuyển sang bytes cho ta
  // hết mà. Tuy nhiên khi dùng struct thì phải truyền params vào dạng mảng []

  // Dùng interface trong ethers
  const interf = new ethers.utils.Interface(MyContractArtifact.abi);
  const params = interf.encodeFunctionData("test", [[[CONTRACT_ADDRESS.toLowerCase(), 2]]]); // ("hàm", [params])
  console.log(params);
  // Cái này cần thiết nếu cần truyền vào bytes cho hàm biểu diễn 1 hàm số để trong hàm solidity dùng kiểu
  // <address>.call(<bytes>); tức contract tại <address> gọi hàm biểu diễn bởi <bytes> thì params bên trên dùng
  // để biểu diễn gọi hàm test với 2 tham số kia

  // Tương tự gọi call kiểu trên nó trả ra kiểu bytes. VD ta lấy trong solidity kiểu:
  // (bool success, bytes memory ret) = <address>.call(<bytes>); thì cái ret kia là kết quả trả về của hàm khi được
  // gọi bằng call nhưng k đọc được, ta return kiểu bytes ra để lấy với hàm decodeFunctionResult:
  // console.log(interf.decodeFunctionResult("<hàm>", ret));
};
main();