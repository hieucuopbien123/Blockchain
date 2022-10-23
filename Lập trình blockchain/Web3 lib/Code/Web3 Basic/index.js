// # Tạo instance web3 từ provider

const Web3 = require('web3');

// Ở đây không hề có biến Provider sẵn mà ta dùng URI của Ganache vì Web3 mặc định convert cái URI của Ganache sang 
// HttpProvider để dùng. Url này của ganache là url fullnode gắn với tk luôn rồi.
// const web3 = new Web3("http://localhost:9545");

// Code đầy đủ:
// const provider = new Web3.providers.HttpProvider("http://localhost:9545"); // Tạo provider
// const web3 = new Web3(provider);

// Tạo custom provider
const customProvider = {
    sendAsync: (payload, cb) => {
        console.log('you called');
        console.log(payload);
        cb(undefined, 100);
        console.log('Finish');
    }
}
const web3 = new Web3(customProvider);
// Payload chỉ API blockchain mà ta muốn gọi, cb là callback sẽ gọi sau khi nhận được response từ blockchain 
// cb nhận vào 1 là error nếu có, 2 là response từ Ethereum API ở đây ta test thì cứ cho bừa là 100 

// # Basic / eth
web3.eth.getBlockNumber().then((a) => console.log('done! ', a));
// Hàm sendAsync của Provider được gọi bởi Web3: Ta gọi hàm bằng web3 -> web3 gọi vào sendAsync của Provider -> web3 chỉ
// định API nào được gọi(bằng payload) tới blockchain và khi nhận về kết quả thì gọi cb trả lại người dùng

// Ở đây API ethereum ta muốn gọi là hàm eth_blockNumber và trả ra kết quả JSON-RPC response mà
// cb ta truyền vào 100 là kết quả không hợp lệ và báo lỗi, để hợp lệ phải biến thành 1 object phức tạp
// Bản chất: Khi ta gọi trực tiếp với JSON-RPC thuần kiểu curl --data thì data chính là payload phức tạp bên trên và khi 
// dùng lib web3, ta có thể code web3.eth.getBlockNumber() rất đơn giản như trên. Dù sao cơ chế bên trong cũng chỉ là tự
// tạo lại cái data đó rồi forward tiếp tới blockchain mà thôi.
