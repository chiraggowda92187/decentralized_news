import * as anchor from "@coral-xyz/anchor";
import { DecentralizedNews } from "../target/types/decentralized_news";
import "dotenv/config";


const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.DecentralizedNews as anchor.Program<DecentralizedNews>;

(async () => {
  const newsAccounts = await program.account.news.all();

  if (newsAccounts.length === 0) {
    console.log("❌ No news found on devnet.");
  } else {
    console.log(`📰 Found ${newsAccounts.length} news item(s):`);
    newsAccounts.forEach((n, i) => {
      console.log(`\n#${i + 1}`);
      console.log("  Content:", n.account.content);
      console.log("  Upvotes:", n.account.upvotes.toString());
      console.log("  Downvotes:", n.account.downvotes.toString());
      console.log("  Creator:", n.account.creator.toBase58());
    });
  }
})();