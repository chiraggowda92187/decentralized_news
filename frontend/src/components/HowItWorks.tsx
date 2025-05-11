const HowItWorks = () => {
    const steps = [
      {
        number: "01",
        title: "Connect Wallet",
        description: "Connect your Solana wallet to the platform to start publishing or interacting with content.",
      },
      {
        number: "02",
        title: "Publish News",
        description: "Create and publish news articles by staking a small amount of SOL as a quality commitment.",
      },
      {
        number: "03",
        title: "Community Votes",
        description: "Readers upvote or downvote content based on quality, accuracy, and relevance.",
      },
      {
        number: "04",
        title: "Earn Rewards",
        description: "Receive SOL rewards when your content gets upvoted by the community.",
      },
    ]
  
    return (
      <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How thrive10xSol_News Works</h2>
            <p className="text-xl text-gray-600">
              Our platform makes it easy to publish, discover, and reward quality journalism on the blockchain.
            </p>
          </div>
  
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-purple-200 transform -translate-x-1/2 hidden md:block"></div>
  
            <div className="space-y-12 relative">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md relative z-10">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center justify-center font-bold text-lg mb-4">
                        {step.number}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-center">
                    <div className="h-48 w-48 rounded-full bg-purple-100 flex items-center justify-center relative z-10">
                      <div className="h-40 w-40 rounded-full bg-gradient-to-r from-purple-200 to-purple-300 flex items-center justify-center">
                        <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center">
                          {/* <img
                            src={`/placeholder.svg?height=100&width=100&text=Step ${index + 1}`}
                            alt={`Step ${index + 1}`}
                            className="h-24 w-24 object-cover"
                          /> */}
                          <h1 className="text-5xl text-[#DBB4FF]">{index + 1}</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default HowItWorks
  