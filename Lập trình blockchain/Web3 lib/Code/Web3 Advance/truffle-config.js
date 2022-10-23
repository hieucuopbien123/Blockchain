// ## Solidity / # Dùng truffle
// # Chỉnh config truffle
// # Kết hợp truffle và ganache

const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: { // 3 trường của develop buộc phải có, nếu k sẽ k specific được network để deploy
      host: "127.0.0.1",
      network_id: "*",
      port: 8545
    }
  }
};
