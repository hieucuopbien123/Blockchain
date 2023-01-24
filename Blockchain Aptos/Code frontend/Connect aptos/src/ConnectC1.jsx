import { useState, useEffect } from 'react'
import './App.css'
import { AptosAccount, AptosClient, HexString } from 'aptos';

const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

// # Tương tác aptos / Connect ví / Dùng aptos thuần
function ConnectC1() {
  const [count, setCount] = useState(0)
  const [address, setAddress] = useState("0x00");

  useEffect(() => {
    testInitData();
  }, []);
  
  // Thực hiện các hàm call bth mà k cần connect ví
  const testInitData = async () => {
    const test = await client.getAccountResources("0xf173ae939aa8d8388dc359ad38e2b2cf33a2fa20210f73bb8e9c9dd6da6801e7");
    console.log(test);
  };

  const initConnection = async () => {
    await window.aptos.connect();
    if(await window.aptos.isConnected()){
        const addr = await window.aptos.account();
        setAddress(addr.address);
    } else {
        console.log("Cannot connect");
    }
  };

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>{address}</p>
        <button onClick={initConnection}>Connect</button>
      </div>
    </div>
  )
}

export default ConnectC1
