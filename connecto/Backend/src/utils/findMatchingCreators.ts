import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Finds creators whose audience demographics overlap with the campaign's target demographics.
 * 
 * Overlap logic:
 * 1. Age: The creator's primary audience age range must overlap with the campaign's target age range.
 * 2. Interests: The creator's top audience interests must include AT LEAST ONE of the campaign's target interests.
 * 
 * @param campaignId - The UUID of the campaign to match against.
 * @returns Array of matching CreatorProfiles.
 */
export async function findMatchingCreators(campaignId: string) {
  // 1. Fetch the Campaign and its target demographics
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: {
      target_audience_age_min: true,
      target_audience_age_max: true,
      target_audience_interests: true,
    },
  });

  if (!campaign) {
    throw new Error(`Campaign with ID ${campaignId} not found.`);
  }

  // 2. Query creators matching the criteria
  const matchingCreators = await prisma.creatorProfile.findMany({
    where: {
      // Age Overlap Check: 
      // Creator's audience min age is less than or equal to Campaign's target max
      // AND Creator's audience max age is greater than or equal to Campaign's target min
      audience_primary_age_min: {
        lte: campaign.target_audience_age_max,
      },
      audience_primary_age_max: {
        gte: campaign.target_audience_age_min,
      },
      
      // Interest Check: 
      // The creator's audience_top_interests array contains at least ONE of the elements 
      // in the campaign's target_audience_interests array.
      audience_top_interests: {
        hasSome: campaign.target_audience_interests,
      },
    },
  });

  return matchingCreators;
}

// Example usage:
// findMatchingCreators("abc-123-uuid").then(console.log).catch(console.error);
