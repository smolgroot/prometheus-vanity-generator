// addressWorker.js
self.onmessage = (event) => {
    const { prefix, suffix, caseSensitive } = event.data;
  
    const isValidHex = (value) => /^[0-9a-fA-F]*$/.test(value);
  
    if (!isValidHex(prefix) || !isValidHex(suffix)) {
      self.postMessage({ error: 'Invalid hex values' });
      return;
    }
  
    const { ethers } = require('ethers'); // Import ethers.js in the worker
  
    let wallet;
    let matchesPrefix = false;
    let matchesSuffix = false;
  
    try {
      do {
        wallet = ethers.Wallet.createRandom();
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
  
      self.postMessage({
        address: wallet.address,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
      });
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  };