import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Wallet,
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  BadgeCheck,
} from "lucide-react";
import ProfileOnboardingModal from "./ProfileOnboardingModal";

// 2. Utility Functions
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidIndianMobile = (phone) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(phone);
};

export const calculateAgeOverlap = (
  creatorMin,
  creatorMax,
  campMin,
  campMax,
) => {
  if (campMin == null || campMax == null) return true;

  const overlapMin = Math.max(creatorMin, campMin);
  const overlapMax = Math.min(creatorMax, campMax);
  const campSpan = campMax - campMin;

  if (campSpan === 0) {
    return creatorMin <= campMin && creatorMax >= campMax;
  }

  const overlap = Math.max(0, overlapMax - overlapMin);
  const percentage = overlap / campSpan;

  return percentage >= 0.6;
};

export const sortCampaigns = (fetchedCampaigns, creatorInterests) => {
  return [...fetchedCampaigns].sort((a, b) => {
    // Primary: Highest number of matching interests
    const aInterests = Array.isArray(a.interests) ? a.interests : [];
    const bInterests = Array.isArray(b.interests) ? b.interests : [];

    const aMatchCount = aInterests.filter((i) =>
      creatorInterests.includes(i),
    ).length;
    const bMatchCount = bInterests.filter((i) =>
      creatorInterests.includes(i),
    ).length;

    if (aMatchCount !== bMatchCount) {
      return bMatchCount - aMatchCount; // Descending
    }

    // Secondary: Highest saved_count (or random if missing/equal)
    const aSaved = a.saved_count || 0;
    const bSaved = b.saved_count || 0;

    if (aSaved !== bSaved) {
      return bSaved - aSaved; // Descending
    }

    // Random tie-breaker
    return Math.random() - 0.5;
  });
};

const formatRupees = (value) => {
  const num = Number(value) || 0;
  return `\u20B9${num.toLocaleString("en-IN")}`;
};

const CampaignCard = ({ campaign }) => {
  const title = campaign.title || "Untitled Campaign";
  const coverImage = campaign.cover_image_url;
  const ageMin = campaign.target_audience_age_min ?? campaign.age_min ?? "N/A";
  const ageMax = campaign.target_audience_age_max ?? campaign.age_max ?? "N/A";
  const location =
    campaign.target_audience_location || campaign.location || "N/A";
  const followers = campaign.min_followers_required ?? 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      <div className="bg-black text-white p-4 text-center font-bold text-xl">
        {title}
      </div>

      {coverImage ? (
        <img
          src={coverImage}
          alt={title}
          className="w-full h-48 object-cover bg-slate-100"
        />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-slate-100 text-slate-400">
          <Briefcase className="w-10 h-10" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-3">Audience Interest</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-700">
          <li>
            age: {ageMin} - {ageMax}
          </li>
          <li>location: {location}</li>
          <li>followers: {followers}+</li>
        </ul>
      </div>

      <div className="border-t border-slate-200 mt-auto pt-4 mx-5 mb-5">
        <button
          type="button"
          className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-slate-800 transition"
        >
          Apply For ({formatRupees(campaign.payout_amount)})
        </button>
      </div>
    </div>
  );
};

const CampaignCardSkeleton = () => (
  <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col animate-pulse">
    <div className="h-14 bg-slate-300 w-full" />
    <div className="h-48 bg-slate-200 w-full" />
    <div className="p-5 space-y-3 flex-1">
      <div className="h-6 bg-slate-200 w-1/2 rounded" />
      <div className="h-4 bg-slate-100 w-3/4 rounded" />
      <div className="h-4 bg-slate-100 w-3/4 rounded" />
      <div className="h-4 bg-slate-100 w-3/4 rounded" />
    </div>
    <div className="p-5 border-t border-slate-200 mt-auto">
      <div className="h-12 bg-slate-300 w-full rounded-lg" />
    </div>
  </div>
);

const PAGE_SIZE = 6;

const CreatorDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState({
    name: null,
    creator_location: "",
    audience_top_locations: "",
    areas_of_interest: [],
    audience_primary_age_min: "",
    audience_primary_age_max: "",
    audience_gender_split: "",
    platform: "",
    handle: "",
    follower_count: 0,
    profile_image_url: "",
    // summary fields
    interests: [],
    age_min: 18,
    age_max: 25,
    profile_completion: 0,
  });
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const loaderRef = useRef(null);

  const apiUrl =
    (typeof process !== "undefined" && process.env.REACT_APP_API_URL) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    "http://localhost:5000";

  const fetchCampaigns = async (pageToLoad = 0, authToken = "") => {
    const start = pageToLoad * PAGE_SIZE;

    if (pageToLoad === 0) {
      setIsLoading(true);
      setHasMore(true);
      setFetchError("");
    } else {
      setLoadingMore(true);
    }

    try {
      const token =
        authToken ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("authToken") ||
        "";

      if (!token) {
        setFetchError("Please log in to view campaigns.");
        if (pageToLoad === 0) setCampaigns([]);
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/campaigns?offset=${start}&limit=${PAGE_SIZE}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const contentType = response.headers.get("content-type") || "";
      let result = null;
      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) {
          throw new Error(
            `Server returned non-JSON (${response.status}): ${text.slice(0, 200)}`,
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            `HTTP error! status: ${response.status}`,
        );
      }

      const fetchedCampaigns = result?.data || [];

      if (pageToLoad === 0) {
        setCampaigns(fetchedCampaigns);
      } else {
        setCampaigns((prev) => [...prev, ...fetchedCampaigns]);
      }

      if (fetchedCampaigns.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Unexpected error fetching campaigns:", err);
      setFetchError(
        err?.message || "Unable to load campaigns right now.",
      );
      if (pageToLoad === 0) setCampaigns([]);
    } finally {
      if (pageToLoad === 0) setIsLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const token =
          localStorage.getItem("auth_token") ||
          localStorage.getItem("authToken") ||
          "";

        if (!token) {
          setFetchError("Please log in to view campaigns.");
          setIsLoading(false);
          return;
        }

        await fetchCampaigns(0, token);

        const profileResponse = await fetch(`${apiUrl}/api/profile/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = profileResponse.headers.get("content-type") || "";
        let profileResult = null;
        if (contentType.includes("application/json")) {
          profileResult = await profileResponse.json();
        } else {
          const text = await profileResponse.text();
          if (!profileResponse.ok) {
            throw new Error(
              `Server returned non-JSON (${profileResponse.status}): ${text.slice(0, 200)}`,
            );
          }
        }

        if (!profileResponse.ok) {
          throw new Error(
            profileResult?.error ||
              profileResult?.message ||
              `HTTP error! status: ${profileResponse.status}`,
          );
        }

        const profileData = profileResult?.data || null;
        if (profileData) {
          const social = Array.isArray(profileData.social_profiles)
            ? profileData.social_profiles[0]
            : null;

          setCurrentUserEmail(profileData.email || "");
          setCurrentUserId(profileData.id || "");

          setCreatorProfile({
            name: profileData.name,
            creator_location: profileData.creator_location || "",
            audience_top_locations:
              Array.isArray(profileData.audience_top_locations) &&
              profileData.audience_top_locations.length > 0
                ? profileData.audience_top_locations[0]
                : "",
            areas_of_interest: profileData.areas_of_interest || [],
            audience_primary_age_min:
              profileData.audience_primary_age_min || "",
            audience_primary_age_max:
              profileData.audience_primary_age_max || "",
            audience_gender_split: profileData.audience_gender_split || "",
            platform: social?.platform || "",
            handle: social?.handle || "",
            follower_count: social?.follower_count || 0,
            profile_image_url: social?.profile_image_url || "",
            interests: profileData.areas_of_interest || [],
            age_min: profileData.audience_primary_age_min || 18,
            age_max: profileData.audience_primary_age_max || 25,
            profile_completion: profileData.profile_completion || 0,
          });

          // Auto-open modal if profile is incomplete
          if (!profileData.name || profileData.profile_completion < 100) {
            setIsProfileModalOpen(true);
          }
        } else {
          setIsProfileModalOpen(true);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (page === 0) return;
    fetchCampaigns(page);
  }, [page]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadingMore && !isLoading && hasMore) {
            setPage((prev) => prev + 1);
          }
        });
      },
      { rootMargin: "200px" },
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadingMore, isLoading]);

  const sortedCampaigns = useMemo(() => {
    return sortCampaigns(campaigns, creatorProfile.interests);
  }, [campaigns, creatorProfile.interests]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user_id");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-black">
      {/* 4. Top Nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="font-bold tracking-tight text-xl">ConnectHub</div>

        <div className="hidden md:flex bg-slate-100 rounded-full px-4 py-2 w-1/3 items-center border border-transparent focus-within:border-slate-300 transition-colors">
          <Search className="w-4 h-4 text-slate-500 mr-2" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400 font-medium"
          />
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Wallet className="w-4 h-4 text-slate-500" />
            <span className="font-bold tracking-tight text-sm">
              {"\u20B9"} 000
            </span>
          </div>
          <div
            className="relative cursor-pointer"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative shadow-sm">
              <svg
                className="absolute w-full h-full transform -rotate-90 pointer-events-none"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="100, 100"
                />
                <path
                  className="text-black"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="75, 100"
                />
              </svg>
              <img
                src="https://ui-avatars.com/api/?name=Sunil&background=random"
                alt="Profile avatar"
                className="w-8 h-8 rounded-full z-10 object-cover border border-white"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 z-20 shadow-sm border border-slate-100">
                <BadgeCheck className="w-[14px] h-[14px] text-blue-500 fill-blue-500 stroke-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* 5. Left Sidebar */}
        <aside className="hidden md:flex w-64 border-r border-slate-200 bg-white p-6 shrink-0 overflow-y-auto flex-col">
          <div className="space-y-2 text-sm font-bold tracking-tight">
            <div className="flex items-center text-slate-500 hover:text-black hover:bg-slate-50 rounded-md px-3 py-2.5 cursor-pointer space-x-3 transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </div>
            <div className="flex items-center text-black bg-slate-100 rounded-md px-3 py-2.5 cursor-pointer space-x-3">
              <Briefcase className="w-5 h-5" />
              <span>Find Campaigns</span>
            </div>
            <div className="flex items-center text-slate-500 hover:text-black hover:bg-slate-50 rounded-md px-3 py-2.5 cursor-pointer space-x-3 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </div>
            <div className="flex items-center text-slate-500 hover:text-black hover:bg-slate-50 rounded-md px-3 py-2.5 cursor-pointer space-x-3 transition-colors">
              <Wallet className="w-5 h-5" />
              <span>Wallet</span>
            </div>
          </div>
          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={() => setIsLogoutConfirmOpen(true)}
              className="w-full text-left text-base font-bold tracking-tight text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md px-3 py-3 transition-colors border border-red-100"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* 6. Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/50">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight mb-8">
              Available Campaigns
            </h1>

            {fetchError && campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-red-200 bg-white rounded-xl shadow-sm">
                <Briefcase className="w-12 h-12 text-red-300 mb-4" />
                <h3 className="text-lg font-bold tracking-tight mb-2">
                  Couldn&apos;t load campaigns
                </h3>
                <p className="text-slate-600 text-sm max-w-sm font-medium">
                  {fetchError}
                </p>
              </div>
            ) : isLoading && campaigns.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                  <CampaignCardSkeleton key={idx} />
                ))}
              </div>
            ) : campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-200 bg-white rounded-xl shadow-sm">
                <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold tracking-tight mb-2">
                  No Campaigns Found
                </h3>
                <p className="text-slate-500 text-sm max-w-sm font-medium">
                  There are currently no campaigns available on the marketplace.
                  Check back later!
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCampaigns.map((camp) => (
                    <CampaignCard key={camp.id} campaign={camp} />
                  ))}
                </div>

                <div ref={loaderRef} className="mt-6">
                  {loadingMore ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <CampaignCardSkeleton key={idx} />
                      ))}
                    </div>
                  ) : !hasMore && campaigns.length > 0 ? (
                    <div className="text-center text-slate-500 py-8 font-medium">
                      You've reached the end! No more campaigns left.
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <ProfileOnboardingModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUserEmail={currentUserEmail}
        currentUserId={currentUserId}
        existingData={creatorProfile}
        onProfileSaved={(updatedProfile) => {
          setCreatorProfile((prev) => ({
            ...prev,
            ...updatedProfile,
            interests: updatedProfile.areas_of_interest || prev.interests,
            age_min:
              updatedProfile.audience_primary_age_min !== undefined
                ? updatedProfile.audience_primary_age_min
                : prev.age_min,
            age_max:
              updatedProfile.audience_primary_age_max !== undefined
                ? updatedProfile.audience_primary_age_max
                : prev.age_max,
            profile_completion:
              updatedProfile.profile_completion || prev.profile_completion,
          }));
        }}
      />

      {isLogoutConfirmOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold tracking-tight text-black">
              Confirm logout
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="text-sm font-bold tracking-tight text-slate-600 hover:text-black px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-bold tracking-tight text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CreatorDashboard;
