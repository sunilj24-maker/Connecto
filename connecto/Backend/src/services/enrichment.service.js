const axios = require('axios');

/**
 * Service to fetch and enrich creator profile data from social platforms using RapidAPI scrapers.
 * 
 * @param {string} handle - The social media handle (e.g., '@username' or channel ID/name).
 * @param {string} platform - The platform enum string ('INSTAGRAM' or 'YOUTUBE' etc).
 * @returns {Promise<Object>} Formatted object ready for Prisma insertion or failure payload.
 */
const enrichCreatorProfile = async (handle, platform) => {
  // We'll normalize the inputs to handle edge cases easily
  const normalizedHandle = handle.trim().replace(/^@/, '');
  const normalizedPlatform = platform.toUpperCase();

  try {
    let result = null;

    switch (normalizedPlatform) {
      case 'INSTAGRAM':
        result = await fetchInstagramData(normalizedHandle);
        break;
      case 'YOUTUBE':
        result = await fetchYoutubeData(normalizedHandle);
        break;
      case 'TWITTER':
        result = await fetchTwitterData(normalizedHandle);
        break;
      case 'TIKTOK':
        result = await fetchTikTokData(normalizedHandle);
        break;
      case 'SNAPCHAT':
        result = await fetchSnapchatData(normalizedHandle);
        break;
      case 'TELEGRAM':
        result = await fetchTelegramData(normalizedHandle);
        break;
      case 'WHATSAPP':
        result = await fetchWhatsAppData(normalizedHandle);
        break;
      case 'TWITCH':
        result = await fetchTwitchData(normalizedHandle);
        break;
      case 'OTHER':
        result = await fetchOtherData(normalizedHandle);
        break;
      default:
        return { success: false, error: 'Unsupported platform specified.' };
    }

    // Format the scraped response efficiently to match the Prisma Schema models
    // Returning both creator and social profile partials so they can be nested or 
    // inserted in a Prisma transaction.
    return {
      success: true,
      data: {
        creatorData: {
          name: result.name || normalizedHandle,
          profile_image_url: result.profile_picture_url || null,
          // Need fallback defaults for Prisma required fields
          primary_location: 'Global', 
          audience_primary_age_min: 18,
          audience_primary_age_max: 65,
          areas_of_interest: [],
          audience_top_locations: [],
          audience_top_interests: [],
        },
        socialProfileData: {
          platform: normalizedPlatform,
          handle: normalizedHandle,
          url: result.url,
          follower_count: result.follower_count || 0
        },
        metadata: {
          biography: result.biography || ''
        }
      }
    };
  } catch (error) {
    // Graceful error handling in case of rate limits or API outage
    console.error(`[Enrichment Error] Failed fetching ${normalizedPlatform} data for ${handle}:`, error.message);
    
    // We can also check for 429 Too Many Requests specifically here
    if (error.response && error.response.status === 429) {
      return { success: false, error: 'Rate limit exceeded on external API.' };
    }

    return { 
      success: false, 
      error: 'API unavailable' 
    };
  }
};

/**
 * Scrapes Instagram profile data via a RapidAPI provider (Placeholder)
 * @param {string} username 
 */
const fetchInstagramData = async (username) => {
  const options = {
    method: 'GET',
    url: `https://instagram-scraper-api2.p.rapidapi.com/v1/info`,
    params: { username_or_id_or_url: username },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'PLACEHOLDER_KEY',
      'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
    },
    timeout: 5000 // Ensure we don't hang the server indefinitely
  };

  const response = await axios.request(options);
  const data = response.data?.data; // Structure varies per scraper API

  return {
    name: data?.full_name,
    profile_picture_url: data?.profile_pic_url_hd || data?.profile_pic_url,
    follower_count: data?.follower_count,
    biography: data?.biography,
    url: `https://instagram.com/${username}`
  };
};

/**
 * Scrapes YouTube channel data via a RapidAPI provider (Placeholder)
 * @param {string} handle 
 */
const fetchYoutubeData = async (handle) => {
  const options = {
    method: 'GET',
    url: `https://youtube-v31.p.rapidapi.com/channels`,
    params: { part: 'snippet,statistics', forHandle: handle },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'PLACEHOLDER_KEY',
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
    },
    timeout: 5000
  };

  const response = await axios.request(options);
  // YouTube API typically returns an array of items
  const channel = response.data?.items?.[0]; 

  return {
    name: channel?.snippet?.title,
    profile_picture_url: channel?.snippet?.thumbnails?.high?.url,
    follower_count: parseInt(channel?.statistics?.subscriberCount || 0, 10),
    biography: channel?.snippet?.description,
    url: `https://youtube.com/@${handle}`
  };
};

/** Placeholder for Twitter data scraper */
const fetchTwitterData = async (handle) => {
  // Replace with actual API/Scraper request
  return {
    name: handle,
    profile_picture_url: null,
    follower_count: 0,
    biography: '',
    url: `https://twitter.com/${handle}`
  };
};

/** Placeholder for TikTok data scraper */
const fetchTikTokData = async (handle) => {
  // Replace with actual API/Scraper request
  return {
    name: handle,
    profile_picture_url: null,
    follower_count: 0,
    biography: '',
    url: `https://tiktok.com/@${handle}`
  };
};

/** Placeholder for Snapchat data scraper */
const fetchSnapchatData = async (handle) => {
  // Replace with actual API/Scraper request
  return {
    name: handle,
    profile_picture_url: null,
    follower_count: 0,
    biography: '',
    url: `https://snapchat.com/add/${handle}`
  };
};

/** Placeholder for Telegram data scraper */
const fetchTelegramData = async (handle) => {
  // Replace with actual API/Scraper request
  return {
    name: handle,
    profile_picture_url: null,
    follower_count: 0,
    biography: '',
    url: `https://t.me/${handle}`
  };
};

/** Placeholder for WhatsApp data (typically not scraped) */
const fetchWhatsAppData = async (handle) => {
  // WhatsApp does not have typical follower counts, so this is just generating the URL
  return {
    name: handle,
    profile_picture_url: null,
    follower_count: 0,
    biography: '',
    url: `https://wa.me/${handle}`
  };
};

/** Placeholder for Twitch data scraper */
const fetchTwitchData = async (handle) => {
  // Replace with actual API/Scraper request
  return {
    name: handle,
    profile_picture_url: null,
    follower_count: 0,
    biography: '',
    url: `https://twitch.tv/${handle}`
  };
};

/** Placeholder for generic or 'OTHER' platform data */
const fetchOtherData = async (handle) => {
  return {
    name: handle,
    profile_picture_url: null,
    follower_count: 0,
    biography: '',
    url: `https://${handle}`
  };
};

module.exports = {
  enrichCreatorProfile
};
