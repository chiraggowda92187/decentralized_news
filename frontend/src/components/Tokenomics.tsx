import { PieChart, Wallet, Award, Lock } from "lucide-react"

const Tokenomics = () => {
  return (
    <section id="tokenomics" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tokenomics</h2>
          <p className="text-xl text-gray-600">
            Our platform uses SOL for all transactions, staking, and rewards, creating a sustainable ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-8">
              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                    <Wallet className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Publishing Fee</h3>
                    <p className="text-gray-600">
                      Publishers stake 0.1 SOL to publish an article. This stake is returned if the article receives
                      more upvotes than downvotes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Reward Distribution</h3>
                    <p className="text-gray-600">
                      70% of all staked SOL from downvoted content is distributed to publishers of upvoted content,
                      proportional to their upvotes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                    <Lock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Platform Treasury</h3>
                    <p className="text-gray-600">
                      30% of staked SOL from downvoted content goes to the platform treasury, used for development and
                      community initiatives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="aspect-square rounded-full bg-gradient-to-r from-purple-100 to-green-100 flex items-center justify-center">
                <div className="h-4/5 w-4/5 rounded-full bg-white flex items-center justify-center">
                  <PieChart className="h-24 w-24 text-purple-600" />
                </div>
              </div>

              {/* Annotation lines */}
              <div className="absolute top-1/4 -right-16 flex items-center">
                <div className="h-0.5 w-16 bg-purple-300"></div>
                <div className="bg-purple-50 p-2 rounded shadow-sm">
                  <p className="text-sm font-medium">Publisher Rewards</p>
                  <p className="text-xs text-purple-600 font-bold">70%</p>
                </div>
              </div>

              <div className="absolute bottom-1/4 -right-16 flex items-center">
                <div className="h-0.5 w-16 bg-green-300"></div>
                <div className="bg-green-50 p-2 rounded shadow-sm">
                  <p className="text-sm font-medium">Platform Treasury</p>
                  <p className="text-xs text-green-600 font-bold">30%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Tokenomics
