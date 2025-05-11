import { PublicKey } from "@solana/web3.js";

// Replace with your actual program ID
const programId = new PublicKey("5ovZoJEY3eFKhFGZ7ZaT5jVKftyyfQGBUQ7m6DX11agc");

const getVaultPDA = async () => {
  const [vaultPda] = await PublicKey.findProgramAddress(
    [Buffer.from("vault")],
    programId
  );
  console.log("Vault PDA:", vaultPda.toBase58());
};

getVaultPDA();
