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
  const timestamp = Math.floor(Date.now() / 1000) - 180; // Subtract 180 seconds (3 minutes) to simulate that voting has ended
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

  it("Rewards the news after 3 minutes (simulated by timestamp adjustment)", async () => {
    // Derive reward account PDA
    const [rewardPda] = await PublicKey.findProgramAddress(
      [Buffer.from("reward"), newsPdaAccount.toBuffer()],
      program.programId
    );
  
    // Log the reward address and the creator address
    console.log("Reward Account Address:", rewardPda.toString());
    console.log("News Creator Address:", wallet.publicKey.toString());
  
    // Get the creator's balance before the reward transfer
    const creatorBalanceBefore = await provider.connection.getBalance(wallet.publicKey);
    console.log("Creator's balance before reward transfer:", creatorBalanceBefore);
  
    // Simulate the passing of 3 minutes by adjusting the timestamp
    const timestampPlusThreeMinutes = new BN(timestamp + 180); // Add 180 seconds (3 minutes) to the timestamp
  
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
  
    // Get the creator's balance after the reward transfer
    const creatorBalanceAfter = await provider.connection.getBalance(wallet.publicKey);
    console.log("Creator's balance after reward transfer:", creatorBalanceAfter);
  
    // Check the difference in balance
    const balanceDifference = creatorBalanceBefore - creatorBalanceAfter;
    console.log("Balance difference:", balanceDifference);
  
    // Calculate the expected reward
    const rewardAmount = 10; // 1 upvote * 10
  
    // Verify the creator received the reward (balance should have increased by rewardAmount)
    expect(creatorBalanceAfter).to.be.greaterThan(creatorBalanceBefore);
    expect(creatorBalanceAfter - creatorBalanceBefore).to.equal(rewardAmount);
  
    const reward = await program.account.rewardData.fetch(rewardPda);
    expect(reward.amount.toNumber()).to.equal(10); // 1 upvote * 10
  });
  
});
