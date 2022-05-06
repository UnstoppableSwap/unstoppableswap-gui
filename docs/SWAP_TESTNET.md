# Swap on Testnet/Stagenet

The GUI is currently defaulting to testnet until we feel it is safe enough to use on mainnet. This means that `testnet3` bitcoin will be swapped for `stagenet` Monero. You will need to set up two wallets to perform a swap:

- A Testnet3 Electrum Wallet (Bitcoin)
- A Stagenet Monero GUI Wallet

## Electrum

Download Electrum from the official [site](https://electrum.org/#download) and then start the wallet with the `--testnet` flag.

### Linux

```
./electrum --testnet
```

### Mac OS:

```
open -n /Applications/Electrum.app --args --testnet
```

### Windows:

If you install Electrum on Windows, you will have two programs you can start. One of them is called "Electrum Testnet".

### Getting testnet coins

To get some free Testnet coins visit a faucet like [this](https://testnet-faucet.mempool.co) one.

## Monero

If you use the `monero-wallet-cli` you simply need to start it with the `--stagenet` flag. If you use the GUI you can follow [this](https://www.youtube.com/watch?v=5E4aO3UAqJo) tutorial by the COMIT guys.

You can use this remote note:

```
stagenet.melo.tools:38081
```

## Installing the GUI

Please download the GUI from the [GitHub release page](https://github.com/UnstoppableSwap/unstoppableswap-gui/releases). Choose your respective version (.dmg for Mac, .AppImage for Linux and .exe for Windows). You may need to [manually allow the opening of the GUI](https://support.apple.com/en-us/HT202491) on Mac OS.

## Making a swap

#### Select a swap provider you would like to swap with (in this case, our testnet provider), click "Swap" and then input your redeem and refund address from Electrum and your Monero wallet respectively.

![Main Screen](https://user-images.githubusercontent.com/86064887/152649336-3d2f727b-b003-443c-a1bb-60b1b826e2ef.png)
![Input address](https://user-images.githubusercontent.com/86064887/152649587-d5351c29-4a61-4add-9deb-4f0f4b59fa46.png)

#### You will be greeted with an offer and an address for the deposit. Send an amount between the minimum and maximum shown. Please note that you will need to send slightly more than the minimum amount to account for network fees.

![Quote](https://user-images.githubusercontent.com/86064887/152649633-9ae29f79-8041-476c-be45-ef3441f4dee1.png)

#### Once you have deposited enough, the first bitcoin transaction will be published and the funds will be locked in a multisignature address that belongs to you and the swap provider. You will now have to wait for some time until the provider locks his Monero. This can really take a long time. Most providers will wait for two bitcoin confirmations (about 20 minutes, will soon change to one confirmation) and then a Monero transaction confirmation (2 minutes) before sending you the information needed for the next step.

![Lock Tx](https://user-images.githubusercontent.com/86064887/152649738-5661ebaf-affd-4172-ae60-5e3f63c85fe9.png)

#### As soon as the provider locks their Monero, you will be shown the transaction and you will have to wait for 10 confirmations on this transaction before proceeding to the next step that will ultimately enable you to redeem the Monero.

![](https://user-images.githubusercontent.com/86064887/152677904-c84837fc-4fde-4b94-87bc-dfbb648b856e.png)

#### The provider will then be sent some information that will allow them to redeem the Bitcoin. After they have redemeed the Bitcoin, you will be able to redeem the Monero which will then be sent to the address have specificed.

![Bildschirmfoto 2022-02-06 um 12 27 31](https://user-images.githubusercontent.com/86064887/152678741-1aed0ce1-a6d1-4d22-b70d-512e9a94cd8c.png)
![Bildschirmfoto 2022-02-06 um 12 27 57](https://user-images.githubusercontent.com/86064887/152678743-b86f395e-01dc-43c5-ba71-b27962a4a6ba.png)

### Please consider [giving some feedback](https://unstoppableswap.aidaform.com/feedback), it is truly valuable for us to improve the overall usability of this project

## Donate

We rely on generous donors like you to keep development moving forward. To bring Atomic Swaps to life, we need resources. If you have the possibility, please consider making a donation to the project. All funds will be used to support contributors and critical infrastructure.

```
XMR: 87jS4C7ngk9EHdqFFuxGFgg8AyH63dRUoULshWDybFJaP75UA89qsutG5B1L1QTc4w228nsqsv8EjhL7bz8fB3611Mh98mg
BTC: bc1q8hj4aq59fucrhz59rxpqnwgy8y6spxxvq4wcj2
```
