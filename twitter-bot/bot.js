import fetch from 'node-fetch';
import { TwitterApi } from 'twitter-api-v2';

// 1. Initialize Twitter API Client from Environment Variables
// These are securely passed in via GitHub Actions Secrets
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function run() {
  console.log("NexusLoot Bot: Starting daily execution...");
  try {
    // 2. Fetch the latest live giveaways from GamerPower
    const res = await fetch('https://www.gamerpower.com/api/giveaways?type=game&sort-by=popularity');
    const data = await res.json();
    
    if (!data || data.length === 0) {
      console.log("No giveaways found today.");
      return;
    }

    // Grab the top most popular free game right now
    const topGame = data[0];

    // 3. Construct an engaging Tweet promoting the site
    const tweetText = `🚨 FREE GAME ALERT 🚨\n\nGrab ${topGame.title} for FREE on ${topGame.platforms} right now! Originally worth ${topGame.worth}.\n\nCheck out the Live Loot Drop tracker at NexusLoot to claim it before it expires: https://nexusloot.innovationinnitiative.in/\n\n#FreeGames #PCGaming #GamingSetup #LootDrop`;

    console.log("Attempting to post tweet:\n", tweetText);

    // 4. Post the Tweet
    await client.v2.tweet(tweetText);
    
    console.log("✅ NexusLoot Bot: Tweet sent successfully!");
  } catch (error) {
    console.error("❌ NexusLoot Bot Error:", error);
    process.exit(1);
  }
}

run();