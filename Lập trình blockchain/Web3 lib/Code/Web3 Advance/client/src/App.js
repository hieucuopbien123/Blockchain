// ## React / # React lập trình web3 / # Legacy web3 basic

import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      /*
      // Có thể viết luôn connect ở trong đây or tách file riêng
      let web3;
      if(window.ethereum){
        web3 = new Web3(window.ethereum);
        await ethereum.enable();
      } else if(window.web3){ // bỏ
        web3 = new Web3(window.web3.currentProvider);
        // Phiên bản cũ thì trang web nào nó cũng cho phép nên k cần check enable()
      }
      // Ở đây nếu người dùng đồng ý thì được dùng web3 rồi. Nếu k có extension ví thì web3 = null
      // Ở đây ta có thể check nếu web3 vẫn bằng null thì hiện pop-up yêu cầu người dùng cài
      */

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      // Nên nhớ nếu dùng phía backend thì kiểu này auto đúng vì provider truyền vào nó đúng với network ta đang
      // xét. Còn phía frontend thì network phụ thuộc vào mạng mà ví đang connect. Ta đang ở mạng này mà ví ở 
      // mạng khác thì sẽ sai. Do đó phải xử lý kèm khi đổi chain or sai chain. Ở đây làm đơn giản là coi như 
      // metamask đang connect vào đúng mạng local của truffle http://127.0.0.1:8545 và tài khoản đã có tiền thì
      // khi vào sẽ tự động thực hiện transaction

      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Tùy vào bài toán nhưng trong 1 dự án, max ta cần tương tác sử dụng là: address, web3 instance, 
      // contract instance, networkid(nếu dự án là multiple chain)
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // ## React / # React lập trình web3 / ## Pattern thiết kế / # Pattern khi nào nên fetch lại API -> điều số 4
  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(10).send({ from: accounts[0] });
    console.log("D");

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
