const CHANNEL_ID = "UCCfXQvHnQuyx9TfI-djUNSw";

// YouTube publishes a free, no-auth RSS feed of a channel's recent uploads,
// newest first — no API key/quota needed, unlike the Data API.
module.exports = async function () {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
    if (!res.ok) throw new Error(`feed responded ${res.status}`);

    const xml = await res.text();
    const entry = xml.split("<entry>")[1];
    if (!entry) throw new Error("no entries in feed");

    const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>(.*?)<\/title>/)?.[1];
    const thumbnail = entry.match(/<media:thumbnail url="(.*?)"/)?.[1];

    if (!videoId || !title || !thumbnail) throw new Error("missing fields in feed entry");

    return { videoId, title, thumbnail, url: `https://www.youtube.com/watch?v=${videoId}` };
  } catch (err) {
    // Build must not fail just because YouTube's feed hiccuped — fall back to
    // whatever's hardcoded in the content files that reference this data.
    console.warn(`[latestSermon] could not fetch latest video, using fallback content — ${err.message}`);
    return null;
  }
};
