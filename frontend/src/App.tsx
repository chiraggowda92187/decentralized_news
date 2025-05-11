import React, { useEffect, useState } from "react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  type Commitment,
  type ConfirmOptions,
} from "@solana/web3.js";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import idl from "../../target/idl/decentralized_news.json";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useAnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

const programID = new PublicKey(idl.address);
const network = WalletAdapterNetwork.Devnet;
const opts = { preflightCommitment: "processed" };
const newsSeed = "news";
const rewardSeed = "reward";
const VOTING_DURATION = 180;

interface NewsItem {
  publicKey: PublicKey;
  account: {
    content: string;
    creator: PublicKey;
    timestamp: BN;
    upvotes: BN;
    downvotes: BN;
  };
}

function AppContent() {
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();
  const [program, setProgram] = useState<Program | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [now, setNow] = useState<number>(Math.floor(Date.now() / 1000));
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const connection = new Connection("https://api.devnet.solana.com", opts.preflightCommitment as Commitment);

  useEffect(() => {
    if (!wallet) return;
    const provider = new AnchorProvider(connection, wallet, opts as ConfirmOptions);
    const program = new Program(idl as any, provider);
    setProgram(program);
    fetchNews(program);
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, [wallet]);

  const fetchNews = async (program: Program) => {
    const news = await program.account.news.all();
    setNewsList(news as NewsItem[]);
  };

  const vote = async (news: NewsItem, upvote: boolean) => {
    if (!program) return;
    await program.methods
      .vote(upvote)
      .accounts({ news: news.publicKey })
      .rpc();
    fetchNews(program);
  };

  const reward = async (news: NewsItem) => {
    if (!program || !wallet?.publicKey) return;
    const [rewardPda] = await PublicKey.findProgramAddress(
      [Buffer.from(rewardSeed), news.publicKey.toBuffer()],
      program.programId
    );
    await program.methods
      .reward()
      .accounts({
        reward: rewardPda,
        news: news.publicKey,
        newsCreator: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    alert("Reward claimed!");
  };

  const submitNews = async () => {
    if (!program || !wallet?.publicKey || content.trim() === "") return;
    try {
      setLoading(true);
      const timestamp = Math.floor(Date.now() / 1000);
      const tsBuf = Buffer.alloc(8);
      tsBuf.writeBigInt64LE(BigInt(timestamp));
      const [newsPda] = await PublicKey.findProgramAddress(
        [Buffer.from(newsSeed), wallet.publicKey.toBuffer(), tsBuf],
        program.programId
      );

      await program.methods
        .initializeNews(content, new BN(timestamp))
        .accounts({
          news: newsPda,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setContent("");
      fetchNews(program);
    } catch (err) {
      alert("Failed to submit news.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasVotingEnded = (timestamp: BN) => now > timestamp.toNumber() + VOTING_DURATION;

  const hasUserVoted = (news: NewsItem) =>
    news.account.creator.toBase58() === wallet?.publicKey?.toBase58();

  if (!wallet?.publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WalletMultiButton />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📰 Decentralized News</h1>

      {/* News Submission Form */}
      <div className="mb-6 p-4 border rounded-xl bg-gray-100">
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows={3}
          placeholder="Write your news (max 1000 chars)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
        />
        <button
          onClick={submitNews}
          disabled={loading || content.trim() === ""}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit News"}
        </button>
      </div>

      {/* News List */}
      {newsList.length === 0 ? (
        <p>No news found.</p>
      ) : (
        newsList.map((news, idx) => (
          <div
            key={idx}
            className="p-4 mb-4 border rounded-xl shadow-md bg-white"
          >
            <p className="text-lg font-semibold">{news.account.content}</p>
            <p className="text-sm text-gray-500">
              Created at:{" "}
              {new Date(news.account.timestamp.toNumber() * 1000).toLocaleString()}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => vote(news, true)}
                disabled={hasVotingEnded(news.account.timestamp)}
                className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
              >
                👍 {news.account.upvotes.toNumber()}
              </button>
              <button
                onClick={() => vote(news, false)}
                disabled={hasVotingEnded(news.account.timestamp)}
                className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
              >
                👎 {news.account.downvotes.toNumber()}
              </button>
              {hasVotingEnded(news.account.timestamp) && hasUserVoted(news) && (
                <button
                  onClick={() => reward(news)}
                  className="ml-auto px-3 py-1 bg-yellow-400 text-black rounded"
                >
                  🎁 Claim Reward
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function App() {
  const wallets = [new PhantomWalletAdapter()];
  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
