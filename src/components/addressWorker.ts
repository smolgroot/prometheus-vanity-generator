import { ethers } from 'ethers';
import seedrandom from 'seedrandom';

import { sha256 } from 'js-sha256';

// Function to hash the entropy array into a secure seed
const generateSeedFromEntropy = (entropy: number[]): string => {
  // Convert the entropy array to a hexadecimal string
  const entropyHex = entropy.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  // console.log(entropyHex)
  return sha256(entropyHex);
};

// Function to generate a deterministic wallet using a seeded RNG
const generateDeterministicWallet = (rng: seedrandom.PRNG): ethers.Wallet => {
  // Generate a random 32-byte private key using the RNG
  const privateKey = Array.from({ length: 32 }, () =>
    Math.floor(rng() * 256).toString(16).padStart(2, '0')
  ).join('');

  // Ensure the private key is valid
  if (!ethers.isHexString(`0x${privateKey}`, 32)) {
    throw new Error('Invalid private key generated');
  }

  // Create a wallet from the private key
  return new ethers.Wallet(`0x${privateKey}`);
};

// Worker message handler
self.onmessage = (event) => {
  const { prefix, suffix, caseSensitive, entropy } = event.data;

  const isValidHex = (value: string) => /^[0-9a-fA-F]*$/.test(value);

  if (!isValidHex(prefix) || !isValidHex(suffix)) {
    self.postMessage({ error: 'Invalid hex values' });
    return;
  }

  if (!Array.isArray(entropy) || entropy.length === 0) {
    self.postMessage({ error: 'Entropy input is required and must be a non-empty array' });
    return;
  }

  try {
    // Generate a secure seed from the entropy
    const seed = generateSeedFromEntropy(entropy);

    // Initialize the CSPRNG with the seed
    const rng = seedrandom(seed);

    let wallet;
    let matchesPrefix = false;
    let matchesSuffix = false;

    // Generate wallets until one matches the prefix and suffix
    do {
      wallet = generateDeterministicWallet(rng);
      const address = wallet.address;

      matchesPrefix = caseSensitive
        ? address.startsWith(`0x${prefix}`)
        : address.toLowerCase().startsWith(`0x${prefix.toLowerCase()}`);

      matchesSuffix = caseSensitive
        ? address.endsWith(suffix)
        : address.toLowerCase().endsWith(suffix.toLowerCase());
    } while (
      (prefix && !matchesPrefix) ||
      (suffix && !matchesSuffix)
    );

    // Send the generated wallet details back to the main thread
    self.postMessage({
      address: wallet.address,
      publicKey: wallet.privateKey,
      privateKey: wallet.privateKey,
    });
  } catch (error) {
    self.postMessage({ error: (error as Error).message });
  }
};