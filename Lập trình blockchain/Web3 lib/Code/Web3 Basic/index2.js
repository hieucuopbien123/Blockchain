// # Basic / eth

const Web3 = require('web3');
const MyContract = require("./build/contracts/MyContract.json");

const init = async () => {
    const web3 = new Web3('http://localhost:9545');

    const id = await web3.eth.net.getId();

    // # Tương tác với contract / Liên kết contract
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi, // required
        deployedNetwork.address // optional
    );
    
    // # Tương tác với contract / Call function
    // VD: contract.methods.getData(<params>).call/send({ from: , gasPrice: , gas(là gasLimit) }, cb);
    // Cái object gasPrice, gasLimit chỉ khi send ms có
    const result = await contract.methods.getData().call();
    console.log(result);

    // # Tương tác với contract
    // Send transaction / Dùng hàm send
    const addresses = await web3.eth.getAccounts(); // List address của mạng or ví thì là address của ví
    const receipt = await contract.methods.setData(10, "test").send({ 
        from: addresses[0],
        gas: 100000,
        gasPrice: 100, // 100 gas quá nhỏ -> 355281045
        // gasPrice và gas k cần set cũng được vì kiểu gì user cũng override đè lên khi dùng ví của họ còn set ở đây
        // thì coi như web3 tự động tính lượng gas cần dùng và default các params cho ta. Chỉ cần biết nếu thiếu gas
        // thì ta có thể customize nó như này. Thực tế đây là code backend k có ví nên vc set như này mới có ý nghĩa
    })
    /*
        Ta gọi hàm send xong thì nó sẽ gửi trans vào blockchain network nhưng nó chưa được mine mà phải chờ 15s với 
        ethereum. Hàm send kết thúc tức là đã broadcast xong vào blockchain network và vẫn chưa được xử lý nên receipt 
        nhận về là 1 object có nhiều params lạ: 
        transactionHash -> có thể dùng nó tạo link tới etherscan link cho người dùng vào đó xem trạng thái
        to: address người nhận ở đây là smart contract
        v,r,s: là params hình thành signature của transaction này
        event: list event có trong transaction này
        blockHash, from,..
    */

    // Ở đây ta có 4 cách để send trans đó là: async await, .then().catch() khi cần bắt error nhưng thật ra async await
    // đi với try catch cũng bắt error được, callback: function(receipt) => {}, event emitter thì có 3 sự kiện là:
    // .on('receipt', receipt => {}) và .on('confirmation, (confirmationNumber, receipt) => {}) với confirmationNumber 
    // là số node confirm cho trans của ta, nếu càng nhiều thì trans càng dễ được included trong blockchain
    // và on('error',(error, receipt) => {}) => cách hay nhất là async await và event emitter

    // Ở blockchain test nó thực hiện tức thì nên lấy được như dưới, trong thực tế phải dùng event emitter để bắt xem 
    // trans thực hiện đến đâu r
    console.log(receipt);
    const data = await contract.methods.getData().call();
    console.log(data);
}
init();