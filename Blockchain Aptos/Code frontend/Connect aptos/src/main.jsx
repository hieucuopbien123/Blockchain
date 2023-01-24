import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  WalletProvider,
  AptosWalletAdapter,
  MartianWalletAdapter,
  PontemWalletAdapter,
} from "@manahippo/aptos-wallet-adapter"

window.addEventListener('load', () => {
  const wallets = [new MartianWalletAdapter(), new AptosWalletAdapter(), new PontemWalletAdapter()]
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <WalletProvider
        wallets={wallets}
        // autoConnect={true}
        onError={(error) => {
          console.log("Handle Error Message", error)
        }}
      >
        <App />
      </WalletProvider>
    </React.StrictMode>
  )
})
