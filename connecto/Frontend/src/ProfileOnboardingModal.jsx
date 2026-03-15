import React, { useState, useEffect } from "react";

const AREAS_OF_INTEREST = [
  "Beauty",
  "Fashion",
  "Yoga",
  "Gym & Fitness",
  "Bodybuilding",
  "Cricket",
  "Football",
  "Tennis",
  "Tech & Gadgets",
  "Software & Coding",
  "Food & Drink",
  "Finance",
  "Travel",
  "Comedy",
  "Education",
];

const PLATFORMS = [
  "TWITTER",
  "INSTAGRAM",
  "YOUTUBE",
  "TIKTOK",
  "SNAPCHAT",
  "TELEGRAM",
  "WHATSAPP",
  "TWITCH",
  "OTHER",
];

const GENDER_SPLIT_OPTIONS = ["Majority Male", "Majority Female", "Even Split"];

export default function ProfileOnboardingModal({
  isOpen,
  onClose,
  currentUserEmail,
  currentUserId,
  existingData = {},
}) {
  const [profileData, setProfileData] = useState({
    name: existingData?.name || "",
    creator_location: existingData?.creator_location || "",
    audience_top_locations: existingData?.audience_top_locations || "",
    areas_of_interest: existingData?.areas_of_interest || [],
    audience_primary_age_min: existingData?.audience_primary_age_min || "",
    audience_primary_age_max: existingData?.audience_primary_age_max || "",
    audience_gender_split: existingData?.audience_gender_split || "",
  });

  const [socialData, setSocialData] = useState({
    platform: existingData?.platform || "",
    handle: existingData?.handle || "",
    follower_count: existingData?.follower_count || "",
    profile_image_url: existingData?.profile_image_url || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Update state when existingData changes
  useEffect(() => {
    if (existingData && Object.keys(existingData).length > 0) {
      setProfileData({
        name: existingData.name || "",
        creator_location: existingData.creator_location || "",
        audience_top_locations: existingData.audience_top_locations || "",
        areas_of_interest: existingData.areas_of_interest || [],
        audience_primary_age_min: existingData.audience_primary_age_min || "",
        audience_primary_age_max: existingData.audience_primary_age_max || "",
        audience_gender_split: existingData.audience_gender_split || "",
      });
      setSocialData({
        platform: existingData.platform || "",
        handle: existingData.handle || "",
        follower_count: existingData.follower_count || "",
        profile_image_url: existingData.profile_image_url || "",
      });
    }
  }, [existingData, isOpen]);

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field, value) => {
    setSocialData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAreaOfInterest = (area) => {
    setProfileData((prev) => {
      const current = prev.areas_of_interest || [];
      if (current.includes(area)) {
        return {
          ...prev,
          areas_of_interest: current.filter((a) => a !== area),
        };
      } else {
        return {
          ...prev,
          areas_of_interest: [...current, area],
        };
      }
    });
  };

  const validateForm = () => {
    if (!profileData.name.trim()) {
      setErrorMessage("Full Name is required");
      return false;
    }
    if (!profileData.creator_location.trim()) {
      setErrorMessage("Your Location is required");
      return false;
    }
    if (!socialData.platform) {
      setErrorMessage("Platform is required");
      return false;
    }
    if (!socialData.handle.trim()) {
      setErrorMessage("Handle is required");
      return false;
    }
    if (!socialData.follower_count || socialData.follower_count < 0) {
      setErrorMessage("Follower Count must be a valid number");
      return false;
    }
    if (!profileData.audience_top_locations.trim()) {
      setErrorMessage("Top Audience Location is required");
      return false;
    }
    if (
      !profileData.audience_primary_age_min ||
      !profileData.audience_primary_age_max
    ) {
      setErrorMessage("Audience Age Range is required");
      return false;
    }
    if (
      parseInt(profileData.audience_primary_age_min) >
      parseInt(profileData.audience_primary_age_max)
    ) {
      setErrorMessage("Min age cannot be greater than max age");
      return false;
    }
    if (!profileData.audience_gender_split) {
      setErrorMessage("Audience Gender Split is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl =
        (typeof process !== "undefined" && process.env.REACT_APP_API_URL) ||
        (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
        "http://localhost:5000";

      // Call backend API to save profile and social data
      const token =
        localStorage.getItem("auth_token") ||
        localStorage.getItem("authToken") ||
        "";

      const response = await fetch(`${apiUrl}/api/profile/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email: currentUserEmail,
          userId: currentUserId,
          profileData: {
            name: profileData.name,
            creator_location: profileData.creator_location,
            audience_top_locations: profileData.audience_top_locations,
            areas_of_interest: profileData.areas_of_interest,
            audience_primary_age_min: parseInt(
              profileData.audience_primary_age_min,
            ),
            audience_primary_age_max: parseInt(
              profileData.audience_primary_age_max,
            ),
            audience_gender_split: profileData.audience_gender_split,
          },
          socialData: {
            platform: socialData.platform,
            handle: socialData.handle,
            follower_count: parseInt(socialData.follower_count),
            profile_image_url: socialData.profile_image_url || null,
          },
        }),
      });

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
          result?.message || `HTTP error! status: ${response.status}`,
        );
      }

      setSuccessMessage("Profile saved successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMessage(
        error.message || "Failed to save profile. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans text-black animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative animate-in zoom-in-95 duration-200 border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Complete Your Profile
        </h1>

        {/* Section 1: About You */}
        <div className="mb-8">
          <h2 className="text-lg font-bold tracking-tight mb-6">About You</h2>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
            </div>

            {/* Your Location */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Your Location
              </label>
              <input
                type="text"
                value={profileData.creator_location}
                onChange={(e) =>
                  handleProfileChange("creator_location", e.target.value)
                }
                placeholder="Where you are based (e.g., Jodhpur, Mumbai)"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Your Social Presence */}
        <div className="mb-8">
          <h2 className="text-lg font-bold tracking-tight mb-6">
            Your Social Presence
          </h2>

          <div className="space-y-5">
            {/* Platform */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Platform
              </label>
              <select
                value={socialData.platform}
                onChange={(e) => handleSocialChange("platform", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              >
                <option value="">Select a platform</option>
                {PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            {/* Handle */}
            <div>
              <label className="block text-sm font-semibold mb-2">Handle</label>
              <input
                type="text"
                value={socialData.handle}
                onChange={(e) => handleSocialChange("handle", e.target.value)}
                placeholder="E.g., @username"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
            </div>

            {/* Follower Count */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Follower Count
              </label>
              <input
                type="number"
                value={socialData.follower_count}
                onChange={(e) =>
                  handleSocialChange("follower_count", e.target.value)
                }
                placeholder="E.g., 50000"
                min="0"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
              <p className="text-xs text-slate-500 mt-1">
                We will verify this later.
              </p>
            </div>

            {/* Profile Image URL */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Profile Image URL
              </label>
              <input
                type="text"
                value={socialData.profile_image_url}
                onChange={(e) =>
                  handleSocialChange("profile_image_url", e.target.value)
                }
                placeholder="Optional: URL to your profile image"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Audience Demographics */}
        <div className="mb-8">
          <h2 className="text-lg font-bold tracking-tight mb-6">
            Audience Demographics
          </h2>

          <div className="space-y-5">
            {/* Top Audience Location */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Top Audience Location
              </label>
              <input
                type="text"
                value={profileData.audience_top_locations}
                onChange={(e) =>
                  handleProfileChange("audience_top_locations", e.target.value)
                }
                placeholder="E.g., Jodhpur, Maharashtra, India"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
              <p className="text-xs text-slate-500 mt-1">
                If your audience is highly local, enter your city/district
                (e.g., Jodhpur). If they are widespread, enter your state or
                'India'.
              </p>
            </div>

            {/* Areas of Interest */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Areas of Interest
              </label>
              <p className="text-xs text-slate-500 mb-3">
                What topics does your audience care about?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {AREAS_OF_INTEREST.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleAreaOfInterest(area)}
                    className={`px-3 py-2 rounded-lg border font-medium text-sm transition-all ${
                      profileData.areas_of_interest.includes(area)
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience Age Range */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Audience Age Range
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    value={profileData.audience_primary_age_min}
                    onChange={(e) =>
                      handleProfileChange(
                        "audience_primary_age_min",
                        e.target.value,
                      )
                    }
                    placeholder="Min"
                    min="0"
                    max="120"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
                <div className="flex items-center text-slate-400">−</div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={profileData.audience_primary_age_max}
                    onChange={(e) =>
                      handleProfileChange(
                        "audience_primary_age_max",
                        e.target.value,
                      )
                    }
                    placeholder="Max"
                    min="0"
                    max="120"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Audience Gender Split */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Audience Gender Split
              </label>
              <select
                value={profileData.audience_gender_split}
                onChange={(e) =>
                  handleProfileChange("audience_gender_split", e.target.value)
                }
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              >
                <option value="">Select gender split</option>
                {GENDER_SPLIT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {successMessage}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-black text-white font-bold tracking-tight py-2.5 rounded-lg hover:bg-slate-900 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading && (
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isLoading ? "Saving..." : "Save & Complete Profile"}
        </button>
      </div>
    </div>
  );
}
