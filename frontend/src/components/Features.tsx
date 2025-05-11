import { Newspaper, TrendingUp, Shield, Coins, Users, Zap } from "lucide-react"

const Features = () => {
  const features = [
    {
      icon: <Newspaper className="h-6 w-6 text-purple-600" />,
      title: "Decentralized Publishing",
      description: "Publish news directly to the blockchain without censorship or intermediaries.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      title: "Reputation System",
      description: "Build your reputation as a journalist through community validation and verification.",
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Immutable Records",
      description: "All published content is permanently stored on the Solana blockchain.",
    },
    {
      icon: <Coins className="h-6 w-6 text-purple-600" />,
      title: "Token Rewards",
      description: "Earn SOL tokens when your content receives upvotes from the community.",
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "Community Governance",
      description: "Platform decisions are made through decentralized voting by token holders.",
    },
    {
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      title: "Lightning Fast",
      description: "Built on Solana for high-speed transactions and minimal fees.",
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose thrive10xSol_News?</h2>
          <p className="text-xl text-gray-600">
            Our platform combines the power of blockchain with journalism to create a transparent, rewarding, and
            community-driven news ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
