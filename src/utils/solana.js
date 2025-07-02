import bs58 from 'bs58';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

// Replace with your actual vault address
const VAULT_WALLET = new PublicKey(''); // <--- Replace this


const RPC_ENDPOINT = 'https://rpc.gorbagana.wtf';
const CACHE_DURATION = 5000;

const balanceCache = {};
let balanceRequestInProgress = false;

/**
 * Transfers GOR from a wallet to a target address
 * 
 * @param {Connection} connection - Solana connection
 * @param {PublicKey} from - Sender's public key
 * @param {Function} sendTransaction - Function to send signed transaction (e.g., from wallet)
 * @param {PublicKey} to - Receiver's public key
 * @param {number} amount - Amount in SOL (e.g., 0.1)
 * @returns {Promise<string>} - Transaction signature
 */
async function transferGOR(connection, from, sendTransaction, to, amount) {
  if (!from) throw new Error('Sender wallet is not connected');

  const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: from,
    toPubkey: to,
    lamports,
  });

  const transaction = new Transaction().add(transferInstruction);
  const latestBlockhash = await connection.getLatestBlockhash();

  transaction.recentBlockhash = latestBlockhash.blockhash;
  transaction.feePayer = from;

  const signature = await sendTransaction(transaction, connection);

  const confirmation = await connection.getSignatureStatus(signature, {
    searchTransactionHistory: true,
  });

  const result = confirmation.value;

  if (
    result?.confirmationStatus !== 'confirmed' &&
    result?.confirmationStatus !== 'finalized'
  ) {
    throw new Error(`Transaction not confirmed: ${JSON.stringify(result)}`);
  }

  if (result?.err) {
    throw new Error(`Transaction failed: ${JSON.stringify(result.err)}`);
  }

  // Clear balance cache after successful transfer
  Object.keys(balanceCache).forEach(key => delete balanceCache[key]);

  return signature;
}

/**
 * Gets the GOR balance of a wallet
 * 
 * @param {Connection} connection - Solana connection
 * @param {PublicKey} wallet - Wallet public key
 * @returns {Promise<number>} - Balance in SOL
 */
async function getGORBalance(connection, wallet) {
  if (!wallet) return 0;

  const key = wallet.toBase58();
  const now = Date.now();
  const cached = balanceCache[key];

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.balance;
  }

  if (balanceRequestInProgress) {
    return cached?.balance || 0;
  }

  balanceRequestInProgress = true;

  try {
    const lamports = await connection.getBalance(wallet);
    const balance = lamports / LAMPORTS_PER_SOL;

    balanceCache[key] = {
      balance,
      timestamp: now,
    };

    return balance;
  } catch (err) {
    console.error('Balance fetch failed:', err);
    return cached?.balance || 0;
  } finally {
    balanceRequestInProgress = false;
  }
}

/**
 * Claim winnings by transferring SOL from the vault to the winner
 * 
 * @param {string} vaultPrivateKeyBase58 - Base58-encoded private key string of vault
 * @param {string} winnerAddress - Base58 address of the winner
 * @param {number} amountGor - Total amount in GOR to transfer (e.g., wager * 2)
 * @param {string} rpcUrl - Solana RPC endpoint (default = Gorbagana)
 * @returns {Promise<{ signature: string, lamports: number }>}
 */
async function claimWinnings(winnerAddress, amountGor, rpcUrl = 'https://rpc.gorbagana.wtf') {
  const vaultPrivateKeyBase58 = import.meta.env.VAULT_PRIVATE_KEY;
  if (!vaultPrivateKeyBase58) throw new Error('Vault private key not provided');
  if (!winnerAddress) throw new Error('Winner address not provided');
  if (!amountGor || amountGor <= 0) throw new Error('Invalid amount');

  // Setup
  const vaultKeypair = Keypair.fromSecretKey(bs58.decode(vaultPrivateKeyBase58));
  const connection = new Connection(rpcUrl, 'confirmed');
  const winnerPublicKey = new PublicKey(winnerAddress);
  const lamports = Math.floor(amountGor * LAMPORTS_PER_SOL);

  // Transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: vaultKeypair.publicKey,
      toPubkey: winnerPublicKey,
      lamports
    })
  );

  transaction.feePayer = vaultKeypair.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  // Sign and send
  transaction.sign(vaultKeypair);
  const rawTx = transaction.serialize();
  const signature = await connection.sendRawTransaction(rawTx, { skipPreflight: false });

  // Confirm
  const confirmation = await connection.getSignatureStatus(signature, { searchTransactionHistory: true });
  const result = confirmation.value;

  if (!result || (result.confirmationStatus !== 'confirmed' && result.confirmationStatus !== 'finalized')) {
    throw new Error(`Transaction not confirmed: ${JSON.stringify(result)}`);
  }

  if (result.err) {
    throw new Error(`Transaction failed: ${JSON.stringify(result.err)}`);
  }

  return {
    signature,
    lamports
  };
}

export {
  claimWinnings,
  transferGOR,
  getGORBalance,
  VAULT_WALLET,
};
