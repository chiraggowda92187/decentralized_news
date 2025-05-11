import { useEffect, useState } from "react"
import { Connection, PublicKey, SystemProgram, type Commitment, type ConfirmOptions } from "@solana/web3.js"
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor"
import idl from "../idl/decentralized_news.json"
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { ConnectionProvider, WalletProvider, useAnchorWallet } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import "@solana/wallet-adapter-react-ui/styles.css"
import { ArrowUp, ArrowDown, Gift, Clock, User, Send, Zap } from "lucide-react"

// const programID = new PublicKey(idl.address)
// const network = WalletAdapterNetwork.Devnet
const opts = { preflightCommitment: "processed" }
const newsSeed = "news"
// const rewardSeed = "reward"
const VOTING_DURATION = 180

interface NewsItem {
  publicKey: PublicKey
  account: {
    content: string
    creator: PublicKey
    timestamp: BN
    upvotes: BN
    downvotes: BN
  }
}

function AppContent() {
  const wallet = useAnchorWallet()
  // const { publicKey } = useWallet()
  const [program, setProgram] = useState<Program | null>(null)
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [now, setNow] = useState<number>(Math.floor(Date.now() / 1000))
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const connection = new Connection("https://api.devnet.solana.com", opts.preflightCommitment as Commitment)

  useEffect(() => {
    if (!wallet) return
    const provider = new AnchorProvider(connection, wallet, opts as ConfirmOptions)
    const program = new Program(idl as any, provider)
    setProgram(program)
    fetchNews(program)
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(interval)
  }, [wallet])

  const fetchNews = async (program: Program) => {
    // @ts-ignore
    const news = await program.account.news.all()
    setNewsList(news as NewsItem[])
  }

  const vote = async (news: NewsItem, upvote: boolean) => {
    if (!program) return
    await program.methods.vote(upvote).accounts({ news: news.publicKey }).rpc()
    fetchNews(program)
  }

  const reward = async (news: NewsItem) => {
    if (!program || !wallet?.publicKey) return

    const [vaultPda] = await PublicKey.findProgramAddress([Buffer.from("vault")], program.programId)

    try {
      await program.methods
        .reward()
        .accounts({
          vault: vaultPda,
          news: news.publicKey,
          newsCreator: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      alert("Reward claimed!")
    } catch (err) {
      console.error("Reward failed", err)
      alert("Failed to claim reward.")
    }
  }

  const submitNews = async () => {
    if (!program || !wallet?.publicKey || content.trim() === "") return
    try {
      setLoading(true)
      const timestamp = Math.floor(Date.now() / 1000)
      const tsBuf = Buffer.alloc(8)
      tsBuf.writeBigInt64LE(BigInt(timestamp))
      const [newsPda] = await PublicKey.findProgramAddress(
        [Buffer.from(newsSeed), wallet.publicKey.toBuffer(), tsBuf],
        program.programId,
      )

      await program.methods
        .initializeNews(content, new BN(timestamp))
        .accounts({
          news: newsPda,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      setContent("")
      fetchNews(program)
    } catch (err) {
      alert("Failed to submit news.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const hasVotingEnded = (timestamp: BN) => now > timestamp.toNumber() + VOTING_DURATION

  const hasUserVoted = (news: NewsItem) => news.account.creator.toBase58() === wallet?.publicKey?.toBase58()

  if (!wallet?.publicKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0118] text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=800&width=800')] opacity-5"></div>
          <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-purple-600 blur-[100px] animate-pulse"></div>
          <div
            className="absolute bottom-1/4 -right-10 w-40 h-40 rounded-full bg-green-600 blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-600 blur-[120px] opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Grid lines */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent bg-[length:100%_4px] bg-repeat-y"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/5 to-transparent bg-[length:4px_100%] bg-repeat-x"></div>
        </div>

        <div className="relative z-10 mb-8 text-center px-4">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-green-400 blur-xl opacity-70 animate-pulse"></div>
            <div className="relative bg-[#0a0118] rounded-full p-4 border border-purple-500/30">
              <Zap className="w-12 h-12 text-purple-400" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 tracking-tight">
            thrive10xSol_News
          </h1>

          <div className="max-w-md mx-auto">
            <p className="text-xl text-purple-200 mb-8 leading-relaxed">
              The Next Generation Decentralized News Platform on Solana
            </p>

            <div className="animate-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-green-400 rounded-full blur-md opacity-70"></div>
              <div className="relative">
                <p className="text-lg text-purple-300 mb-4">Connect your wallet to continue</p>
                <WalletMultiButton className="!bg-[#0a0118] !border !border-purple-500/50 !rounded-full !px-8 !py-3 !text-white !font-bold hover:!border-green-400 transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Animated circuit lines */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
        <div className="absolute bottom-4 text-purple-300 text-sm">Powered by Solana Blockchain</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0118] text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=800&width=800')] opacity-5"></div>
        <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-purple-600 blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-1/4 -right-10 w-40 h-40 rounded-full bg-green-600 blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-600 blur-[120px] opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Grid lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent bg-[length:100%_4px] bg-repeat-y"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/5 to-transparent bg-[length:4px_100%] bg-repeat-x"></div>
      </div>

      <header className="border-b border-purple-700/30 backdrop-blur-md bg-[#0a0118]/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-green-500 flex items-center justify-center relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-green-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-xl font-bold relative">tsn</span>
            </div>
            <a href="/">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400">
              thrive10xSol_News
            </h1>
            </a>
          </div>
          <WalletMultiButton className="!bg-[#0a0118] !border !border-purple-500/50 !rounded-full !px-4 !py-2 !text-white !text-sm hover:!border-green-400 transition-all duration-300" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* News Submission Form */}
        <div className="mb-10 p-6 rounded-xl bg-[#0a0118]/80 border border-purple-500/30 backdrop-blur-md shadow-xl shadow-purple-900/20 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-green-500/20 to-transparent"></div>

          <div className="relative">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Post Breaking News
            </h2>

            <textarea
              className="w-full p-4 border bg-[#0a0118]/90 border-purple-500/50 rounded-xl mb-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
              rows={3}
              placeholder="Write your news (max 1000 chars)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
            />

            <div className="flex justify-end">
              <button
                onClick={submitNews}
                disabled={loading || content.trim() === ""}
                className="relative group overflow-hidden bg-[#0a0118] border border-purple-500/50 text-white px-6 py-3 rounded-full font-medium disabled:opacity-50 hover:border-green-400 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {loading ? (
                  <span className="flex items-center gap-2 relative">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 relative">
                    <Send className="w-5 h-5" />
                    Publish News
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 mb-6 flex items-center">
            Latest News
            <div className="ml-3 w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          </h2>

          {newsList.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#0a0118]/80 border border-purple-500/30 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-green-900/10"></div>
              <p className="text-purple-300 relative">No news found. Be the first to publish!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1">
              {newsList.map((news, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-[#0a0118]/80 border border-purple-500/30 backdrop-blur-md shadow-xl shadow-purple-900/20 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300"
                >
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-500/20 to-transparent"></div>

                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative">
                    <p className="text-xl font-medium mb-4 text-white leading-relaxed">{news.account.content}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-purple-300 mb-4">
                      <div className="flex items-center gap-1 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/20">
                        <User className="w-4 h-4" />
                        <span className="text-xs truncate max-w-[100px] sm:max-w-[150px] md:max-w-[250px]">
                          {news.account.creator.toBase58()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/20">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">
                          {new Date(news.account.timestamp.toNumber() * 1000).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <button
                        onClick={() => vote(news, true)}
                        disabled={hasVotingEnded(news.account.timestamp)}
                        className="relative group overflow-hidden px-4 py-2 bg-[#0a0118] border border-green-500/50 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 hover:border-green-400 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <ArrowUp className="w-4 h-4 relative" />
                        <span className="relative">{news.account.upvotes.toNumber()}</span>
                      </button>

                      <button
                        onClick={() => vote(news, false)}
                        disabled={hasVotingEnded(news.account.timestamp)}
                        className="relative group overflow-hidden px-4 py-2 bg-[#0a0118] border border-red-500/50 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 hover:border-red-400 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <ArrowDown className="w-4 h-4 relative" />
                        <span className="relative">{news.account.downvotes.toNumber()}</span>
                      </button>

                      {hasVotingEnded(news.account.timestamp) && hasUserVoted(news) && (
                        <button
                          onClick={() => reward(news)}
                          className="relative group overflow-hidden ml-auto px-4 py-2 bg-[#0a0118] border border-yellow-500/50 text-white font-medium rounded-full flex items-center gap-1 hover:border-yellow-400 transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Gift className="w-4 h-4 relative" />
                          <span className="relative">Claim SOL Reward</span>
                        </button>
                      )}
                    </div>

                    {hasVotingEnded(news.account.timestamp) ? (
                      <div className="mt-3 text-xs text-purple-400 bg-purple-900/20 px-3 py-1 rounded-full inline-block">
                        Voting ended
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-purple-400 bg-purple-900/20 px-3 py-1 rounded-full inline-block">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse mr-1"></span>
                        Voting ends in {VOTING_DURATION - (now - news.account.timestamp.toNumber())} seconds
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-purple-700/30 text-center text-purple-400 text-sm relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
            <p>thrive10xSol_News - Decentralized News Platform</p>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-purple-500"></div>
            <p>Running on Solana Devnet</p>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-[#0a0118] border border-purple-500/30 flex items-center justify-center hover:border-purple-400 transition-all cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0a0118] border border-purple-500/30 flex items-center justify-center hover:border-purple-400 transition-all cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0a0118] border border-purple-500/30 flex items-center justify-center hover:border-purple-400 transition-all cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function MainNews() {
  const wallets = [new PhantomWalletAdapter()]
  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
