import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DecentralizedNews } from "../target/types/decentralized_news";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { expect } from "chai";

describe("decentralized_news", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.decentralizedNews as Program<DecentralizedNews>;
  const wallet = provider.wallet;

  const newsContent = "Solana is awesome!";
  const timestamp = Math.floor(Date.now() / 1000);
  let newsPdaAccount: PublicKey;

  it("Initializes news with valid content", async () => {
    const timestampBuffer = Buffer.alloc(8);
    timestampBuffer.writeBigInt64LE(BigInt(timestamp));

    // Derive PDA for the news
    [newsPdaAccount] = await PublicKey.findProgramAddress(
      [
        Buffer.from("news"),
        wallet.publicKey.toBuffer(),
        timestampBuffer
      ],
      program.programId
    );

    await program.methods
      .initializeNews(newsContent, new BN(timestamp))
      .accounts({
        news: newsPdaAccount,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([wallet.payer])
      .rpc();

    const news = await program.account.news.fetch(newsPdaAccount);
    expect(news.content).to.equal(newsContent);
    expect(news.upvotes.toNumber()).to.equal(0);
    expect(news.downvotes.toNumber()).to.equal(0);
    expect(news.timestamp.toNumber()).to.equal(timestamp);
  });

  it("Upvotes the news", async () => {
    await program.methods
      .vote(true) // upvote = true
      .accounts({
        news: newsPdaAccount,
      })
      .rpc();

    const news = await program.account.news.fetch(newsPdaAccount);
    expect(news.upvotes.toNumber()).to.equal(1);
    expect(news.downvotes.toNumber()).to.equal(0);
  });

  it("Rewards the news after 3 minutes", async () => {
    console.log("Waiting 180 seconds for reward test to pass voting period...");
    await new Promise((resolve) => setTimeout(resolve, 180 * 1000)); // 3 minutes

    // Derive reward account PDA
    const [rewardPda] = await PublicKey.findProgramAddress(
      [Buffer.from("reward"), newsPdaAccount.toBuffer()],
      program.programId
    );

    await program.methods
      .reward()
      .accounts({
        reward: rewardPda,
        news: newsPdaAccount,
        newsCreator: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([wallet.payer])
      .rpc();

    const reward = await program.account.rewardData.fetch(rewardPda);
    expect(reward.amount.toNumber()).to.equal(10); // 1 upvote * 10
  });
});
