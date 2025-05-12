import { ArrowRight } from "lucide-react"

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-20 lg:pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              <span className="block">Decentralized News</span>
              <span className="block bg-gradient-to-r from-purple-600 to-green-400 bg-clip-text text-transparent">
                Powered by Solana
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Publish news, earn rewards, and participate in a truly decentralized news ecosystem. thrive10xSol_News empowers
              journalists and readers through blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
  href="/decentralized_news"
  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-purple-600 text-white hover:bg-purple-900 shadow-sm"
>
  Start publishing 
  
</a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="relative lg:h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-green-100 rounded-2xl opacity-30 transform rotate-3"></div>
            <div className="relative z-10 bg-white p-6 rounded-xl shadow-xl transform -rotate-2 w-full max-w-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">JD</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Jane Doe</h3>
                  <p className="text-xs text-gray-500">Verified Journalist</p>
                </div>
                <div className="ml-auto flex items-center text-sm text-green-600">
                  <span>+24.5 SOL</span>
                </div>
              </div>
              <h2 className="text-lg font-bold mb-2">Breaking: New Solana Ecosystem Fund Announced</h2>
              <p className="text-sm text-gray-600 mb-4">
                The Solana Foundation has announced a $100M fund to support developers building on the Solana
                blockchain...
              </p>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-green-600">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    1.2k
                  </span>
                  <span className="flex items-center text-red-600">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 16.586V13z"
                        clipRule="evenodd"
                      />
                    </svg>
                    245
                  </span>
                </div>
                <span className="text-gray-500">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 transform -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-purple-200 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-[400px] h-[400px] rounded-full bg-green-200 opacity-20 blur-3xl"></div>
    </section>
  )
}

export default Hero
