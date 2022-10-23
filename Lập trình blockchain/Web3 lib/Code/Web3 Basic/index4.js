const Web3 = require('web3');
const MyContract = require("./build/contracts/MyContract.json");

const init = async () => {
    // # Tạo instance web3 từ provider / Dùng websocket provider
    const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9545')); 
    // Dùng websocket provider mới subscribe được với event
    
    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );
    const addresses = await web3.eth.getAccounts();

    // # Basic / eth
    const txBlock = await web3.eth.getTransaction(deployedNetwork.transactionHash);
    console.log(txBlock); // Lấy transaction có hash matching the hash truyền vào, ở đây là trans deploy cái SM kia

    // # Tương tác với event / Lấy event cụ thể
    // Lấy event của transaction vừa thực hiện xong
    const receipt = await contract.methods.setData(1, "world").send({
        from: addresses[0]
    });
    console.log(receipt.events);

    // Lấy mọi event in the past
    const results = await contract.getPastEvents('MyEvent',{
        fromBlock: 0,
        // toBlock: "lastest", // mặc định cũng là "lastest"
        // Nếu k specific from to thì nó chỉ lấy event ở block cuối, nếu lấy tất cả thì nó mất tg. Nên cho fromBlock
        // là lúc nó deploy, toBlock là block mới nhất
        filter: {
            value: "hey",
            data: [10, 1], // Lọc các event có data là 1 or 10, có thể thêm nhiều trường miễn trường đó có indexed trong
            // smart contract, string thì phải chuyển đổi gì đó chứ k filter trực tiếp được
        }
    })
    console.log(results);

    // # Tương tác với event / Subscribe to event
    // contract.events.MyEvent({fromBlock: 0})
    //     .on("data", event => console.log("Events: ", event)); // Khi receive new data
    

    // Chờ 2s sau phát event để nó bắt
    await new Promise(resolve => setTimeout(() => resolve(), 2000))
    await contract.methods.setData(10, "hello").send({
        from: addresses[0]
    });
}
init();
