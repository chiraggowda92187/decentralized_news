import { ArrowRight } from "lucide-react"

const CTA = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Future of News?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Be part of the revolution in decentralized journalism. Start publishing, voting, and earning rewards today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
  href="/decentralized_news"
  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 shadow-sm"
>
  <span className="pointer-events-none">Launch App</span>
  <ArrowRight className="ml-2 h-5 w-5 pointer-events-none" />
</a>

            <a
              href="https://x.com/ChiragG11071954"
                target="_blank"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-purple-700 hover:bg-opacity-20"
            >
              Join Community
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">10k+</p>
              <p className="text-purple-200">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">50k+</p>
              <p className="text-purple-200">Articles Published</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">1M+</p>
              <p className="text-purple-200">Votes Cast</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">5k SOL</p>
              <p className="text-purple-200">Rewards Distributed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
