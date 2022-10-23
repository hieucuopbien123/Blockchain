import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Ở bản mẫu họ chạy load đầu tiên để đảm bảo trang web được load xong và có biến window rồi
    // mới chạy để avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          // window.ethereum.enable() là bản cũ, bản mới dùng .request({ method: "eth_requestAccounts" });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers dùng window.web3 => bh hầu như k còn nên có thể bỏ case này
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3; // Ở đây nó lấy luôn có sẵn
        console.log("Injected web3 detected.");
        resolve(web3);
      } else { 
        // Th này xảy ra khi máy éo có ví thì dùng ví của ganache => éo ai làm như này
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

export default getWeb3;
