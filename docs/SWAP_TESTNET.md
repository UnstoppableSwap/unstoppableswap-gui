
# Swap on Testnet/Stagenet
The GUI currently defaults to testnet until we deem it safe enough for people to use on mainnet. This means that `testnet3` Bitcoin is swapped for `stagenet` Monero. You need to setup two wallets two perform a swap:
- Testnet3 Electrum Wallet (Bitcoin)
- Stagenet Monero GUI Wallet

## Electrum
Download Electrum from the official [site](https://electrum.org/#download) and then start the wallet with the `--testnet` flag.

**Linux**
```
./electrum --testnet
```

**Mac OS:**
```
open -n /Applications/Electrum.app --args --testnet
```

**Windows:**
If you install Electrum on Windows, you will have two programs you can start. One of them is called "Electrum Testnet".

### Getting testnet coins
To get some free Testnet coins visit a faucet like [this](https://testnet-faucet.mempool.co) one.

## Monero
If you use the `monero-wallet-cli` you simply need to execute it with the `--stagenet`flag. If you use the GUI you can follow [this](https://www.youtube.com/watch?v=5E4aO3UAqJo) tutorial by the COMIT guys. 

You can use this remote note:
```
stagenet.melo.tools:38081
```

## Installing the GUI
Please download the GUI from the [GitHub release page](https://github.com/UnstoppableSwap/unstoppableswap-gui/releases). Choose your respective version (.dmg for Mac, .AppImage for Linux and .exe for Windows). You may need to [manually allow the opening of the GUI](https://support.apple.com/en-us/HT202491) on Mac OS.

## Making a swap

Select a swap provider you want to swap with (our testnet provider in this case), click swap, and then input your redeem and refund address from Electrum and your Monero wallet respectively.
![Main Screen](https://user-images.githubusercontent.com/86064887/152649336-3d2f727b-b003-443c-a1bb-60b1b826e2ef.png)
![Input address](https://user-images.githubusercontent.com/86064887/152649587-d5351c29-4a61-4add-9deb-4f0f4b59fa46.png)

You will be greeted with a quote and a deposit address. Send an amount between the minimum and maximum displayed. Please note that you must sent some more than the minimum to account for network fees.
![Quote](https://user-images.githubusercontent.com/86064887/152649633-9ae29f79-8041-476c-be45-ef3441f4dee1.png)

Once you have deposited enough, the first Bitcoin transaction is published, locking the funds in a multisignature address owned by you and the swap provider. You will now have to wait for some time for the provider to lock their Monero. This really might take a long time. Most providers will wait for two Bitcoin confirmations (approx. 20min, will soon be changed to one confirmation) and then wait for one confirmation on the Monero transaction (2min) before sending you the information neccessary for the next step.
![Lock Tx](https://user-images.githubusercontent.com/86064887/152649738-5661ebaf-affd-4172-ae60-5e3f63c85fe9.png)

