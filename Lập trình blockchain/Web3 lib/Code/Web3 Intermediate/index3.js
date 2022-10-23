// # Basic / Dùng utils

const Web3 = require('web3');
const web3 = new Web3("http://localhost:9545");
// Có thể dùng luôn Web3.utils mà k cần instance web3 provider nhưng thường là dùng web3

const value = 10;
web3.utils.toWei(value.toString(), 'gwei'); // 1 có thể là String|BN, 2 mặc định là 'ether'
web3.utils.fromWei('1000000000', 'gwei'); // 2 mặc định là 'ether' và thường hiển thị cho người dùng dạng ether

web3.utils.toBN('1000'); // BN khác string ở chỗ ta có thể tính toán
web3.utils.BN(1234); // số 1234 dạng BN
web3.utils.isBN(10);

// Trong solidity, bytes32 ưa dùng hơn string vì tốn ít bộ nhớ hơn nhưng trong JS ta phải hiển thị cho người dùng
// string nếu k họ chỉ nhìn thấy số kỳ quặc => ta phải convert string <-> bytes32 khi tương tác với SM
web3.utils.hexToAscii('0xc1912');
web3.utils.asciiToHex("normalString")
web3.utils.isHex('0xc1912');
web3.utils.toHex("Hello"); // Chuyển bất cứ cái gì sang hex
web3.utils.randomHex(32); // Sinh số bytes32 ngẫu nhiên 32 bytes

web3.utils.padLeft('Hello', 20); // Tương tự padRight. Vì ta tạo ra hex string và muốn compare với SM nhưng 
// length nó khác nhau thì compare luôn khác => ta phải padLeft, padRight như nào cho nó cùng length
// 3 là ký tự pad, mặc định là 0

web3.utils.isAddress('0x0');
web3.utils.toChecksumAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d');
// "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d" => mọi address lower hay upper case như nào của address này khi gọi hàm
// này đều quy về duy nhất address này. Đây cũng là cách viết address chuẩn, nếu address tương tự có upper, lower case
// khác thì nó vẫn là address này thôi nhưng address không chuẩn, address chuẩn gọi là Checksum Adress
web3.utils.checkAddressChecksum("0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d");
// true => check 1 address có phải là checksum address không

web3.utils.sha3("hello");
web3.utils.soliditySha3("Hello", 1, "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d");
web3.utils.soliditySha3(
    {type: "uint8", value: 8},
    {t: "string", v: "Hello"},
    "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d"
);
