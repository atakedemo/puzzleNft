import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import "@nomicfoundation/hardhat-verify";
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_URL_MCH = process.env.API_URL_MCH;
const API_URL_ZKKATANA = process.env.API_URL_ZKKATANA;
const API_URL_MUMBAI = process.env.API_URL_MUMBAI;
const API_KEY = process.env.API_KEY;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      viaIR: true,
      optimizer: {
        runs: 200,
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    local: {
      url: 'http://127.0.0.1:8545/',
      gas: 2100000,
      gasPrice: 8000000000,
      chainId: 31337,
    },
    mchTest: {
      url: API_URL_MCH,
      chainId: 420,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    astarZkKatana: {
      url: API_URL_ZKKATANA,
      chainId: 1261120,
      gas: 2100000,
      gasPrice: 80000000000,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    mumbai: {
      url: API_URL_MUMBAI,
      chainId: 80001,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
  },
  etherscan: {
    apiKey: API_KEY,
  }
};

export default config;