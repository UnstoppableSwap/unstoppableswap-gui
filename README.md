<br/>
<p align="center">
  <h3 align="center">UnstoppableSwap GUI</h3>

  <p align="center">
    Graphical User Interface (GUI) For Trustless Cross-Chain XMR<>BTC Atomic Swaps 
    <br/>
    <br/>
    <a href="https://github.com/UnstoppableSwap/unstoppableswap-gui/releases">Download</a>
    .
    <a href="https://github.com/UnstoppableSwap/unstoppableswap-gui/issues">Report Bug</a>
    .
    <a href="https://github.com/UnstoppableSwap/unstoppableswap-gui/issues">Request Feature</a>
  </p>
</p>

![Downloads](https://img.shields.io/github/downloads/UnstoppableSwap/unstoppableswap-gui/total) ![Contributors](https://img.shields.io/github/contributors/UnstoppableSwap/unstoppableswap-gui?color=dark-green) ![Issues](https://img.shields.io/github/issues/UnstoppableSwap/unstoppableswap-gui) ![License](https://img.shields.io/github/license/UnstoppableSwap/unstoppableswap-gui)

## Table Of Contents

- [About the Project](#about-the-project)
- [Built With](#built-with)
- [Documentation](#documentation)
- [Getting Started](#getting-started)
- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About The Project

![main screen](https://user-images.githubusercontent.com/86064887/152649852-4c8c6c3f-0568-4347-89d1-c291c17f2d30.png)

Atomic swaps between BTC and XMR have been one of the most discussed and anticipated developments in the field for quite some time.

While Farcaster is still working on the implementation of their protocol, the COMIT team has already delivered an MVP. Trustless cross-chain swaps are becoming a tangible reality.
However, for atomic swaps to gain widespread and adopted, the user experience needs to be drastically improved. People shouldn't have to manually type commands into a terminal or understand the protocol at a technical level to participate. That's the problem this project aims to solve.

_Make atomic swaps accessible to all!_

## Documentation

- [How to swap on testnet](/docs/SWAP_TESTNET.md)

## Built With

- [COMIT Swap CLI](https://github.com/comit-network/xmr-btc-swap)
- [Electron](https://github.com/comit-network/xmr-btc-swap)
- [React](https://reactjs.org)
- [Redux](https://redux.js.org)
- [Material UI](https://mui.com)

## Getting Started

Please download the GUI from the [release page](https://github.com/UnstoppableSwap/unstoppableswap-gui/releases). Choose your respective version (.dmg for Mac, .AppImage for Linux and .exe for Windows). You may need to [manually allow the opening](https://support.apple.com/en-us/HT202491) of the GUI on Mac OS.

## Donate

We rely on generous donors like you to keep development moving forward. To bring Atomic Swaps to life, we need resources. If you have the possibility, please consider making a donation to the project. All funds will be used to support contributors and critical infrastructure.

If you interested in a partnership or want to support the project in a way that requires coordination with the contributors, contact `@binarybaron:matrix.org` on Matrix.

```
XMR: 87jS4C7ngk9EHdqFFuxGFgg8AyH63dRUoULshWDybFJaP75UA89qsutG5B1L1QTc4w228nsqsv8EjhL7bz8fB3611Mh98mg
BTC: bc1q8hj4aq59fucrhz59rxpqnwgy8y6spxxvq4wcj2
```

## Development

To get a local copy up and running follow these simple steps.

### Prerequisites

Before proceeding you should install the following:

- [node (v16)](https://nodejs.org/en/download/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (probably bundled with your installation)

### Installation

Clone the repository, install all dependencies using npm and start the GUI on testnet.

```bash
git clone --branch main https://github.com/binarybaron/unstoppableswap-gui
cd unstoppableswap-gui
npm install
```

```bash
TESTNET=true npm start
```

## Roadmap

See the [open issues](https://github.com/UnstoppableSwap/unstoppableswap-gui/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/UnstoppableSwap/unstoppableswap-gui/issues/new) to discuss it, or directly create a pull request after you edit the _README.md_ file with necessary changes.
- Please make sure you check your spelling and grammar.
- Create individual PR for each suggestion.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](https://github.com/UnstoppableSwap/unstoppableswap-gui/blob/main/LICENSE.md) for more information.

## Acknowledgements

- [thomaseizinger (Thomas Eizinger)](https://github.com/thomaseizinger)
- [da-kami (Daniel Karzel)](https://github.com/da-kami)
- [rishflab](https://github.com/rishflab)
- [bonomat (Philipp Hoenisch)](https://github.com/bonomat)
- [luckysori (Lucas Soriano)](https://github.com/luckysori)
- [D4nte (Franck R.)](https://github.com/D4nte)
