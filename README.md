# Prometheus - EVM Vanity Address Generator

Prometheus is a tool for generating Ethereum (or other EVM compatible blockchains) wallet addresses with custom prefixes and/or suffixes. It allows users to create personalized Ethereum addresses while ensuring the security of private keys.

[[LIVE DEMO]](https://prometheus-vanity.vercel.app)

## Features

- Generate Ethereum addresses with custom prefixes and/or suffixes.
- Supports case-sensitive and case-insensitive matching.
- Displays the generated address, public key, and private key.
- Includes a QR code for the private key for easy sharing or storage.
- Dynamic difficulty indicator with a progress bar based on the complexity of the prefix and suffix.
- Uses Web Workers for concurrency to prevent UI freezing during computation.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/smolgroot/prometheus-vanity-eth.git
   cd prometheus-vanity-eth
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Open the application in your browser (usually at `http://localhost:3000`).
2. Enter a custom prefix and/or suffix for the Ethereum address.
3. Toggle the "Case Sensitive" option if needed.
4. Click the "Generate ETH Wallet" button.
5. View the generated address, public key, and private key.
6. Use the QR code to easily share or store the private key.

## Security

- The private key is generated locally in your browser and is never sent to any server.
- For more security, run Prometheus offline, on a client environment (fresh OS or Virtual Machine) by cloning this repository.
- Always store your private key securely and never share it with anyone.

## Technologies Used

- **React**: For building the user interface.
- **ethers.js**: For Ethereum wallet generation.
- **qrcode.react**: For generating QR codes.
- **Web Workers**: For running address generation in parallel threads to prevent UI freezing.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for personalized Ethereum addresses.
- Built with love for the Ethereum community.

---

**Disclaimer**: Use this tool at your own risk. Generating vanity addresses with long prefixes or suffixes may take significant time and computational resources.
