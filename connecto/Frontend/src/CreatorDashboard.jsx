import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Search, 
  Wallet, 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  BadgeCheck, 
  Bookmark, 
  MapPin 
} from 'lucide-react';

// 1. Supabase Initialization
// Note: We check both process.env and import.meta.env to support different bundlers.
const supabaseUrl = (typeof process !== 'undefined' && process.env.REACT_APP_SUPABASE_URL) || 
                    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '';
const supabaseKey = (typeof process !== 'undefined' && process.env.REACT_APP_SUPABASE_ANON_KEY) || 
                    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || '';

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

// 2. Utility Functions
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidIndianMobile = (phone) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(phone);
};

export const calculateAgeOverlap = (creatorMin, creatorMax, campMin, campMax) => {
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

    const aMatchCount = aInterests.filter(i => creatorInterests.includes(i)).length;
    const bMatchCount = bInterests.filter(i => creatorInterests.includes(i)).length;

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

const CreatorDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Mock Creator State
  const creatorProfile = { 
    name: "Sunil", 
    follower_count: 15000, 
    interests: ["Tech", "Gaming", "Lifestyle"], 
    age_min: 18, 
    age_max: 25 
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data, error } = await supabase.from('Campaign').select('*');
        if (error) {
          console.error('Error fetching campaigns:', error);
          setCampaigns([]);
        } else {
          setCampaigns(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const sortedCampaigns = useMemo(() => {
    return sortCampaigns(campaigns, creatorProfile.interests);
  }, [campaigns, creatorProfile.interests]);

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
            <span className="font-bold tracking-tight text-sm">₹12,500</span>
          </div>
          <div className="relative cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative shadow-sm">
              <svg className="absolute w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100, 100" />
                <path className="text-black" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="75, 100" />
              </svg>
              <img src="https://ui-avatars.com/api/?name=Sunil&background=random" alt="Profile avatar" className="w-8 h-8 rounded-full z-10 object-cover border border-white" />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 z-20 shadow-sm border border-slate-100">
                <BadgeCheck className="w-[14px] h-[14px] text-blue-500 fill-blue-500 stroke-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* 5. Left Sidebar */}
        <aside className="hidden md:block w-64 border-r border-slate-200 bg-white p-6 shrink-0 overflow-y-auto">
          <div className="space-y-2 text-sm font-bold tracking-tight">
             <div className="flex items-center text-slate-500 hover:text-black hover:bg-slate-50 rounded-md px-3 py-2.5 cursor-pointer space-x-3 transition-colors">
               <LayoutDashboard className="w-5 h-5"/>
               <span>Dashboard</span>
             </div>
             <div className="flex items-center text-black bg-slate-100 rounded-md px-3 py-2.5 cursor-pointer space-x-3">
               <Briefcase className="w-5 h-5"/>
               <span>Find Campaigns</span>
             </div>
             <div className="flex items-center text-slate-500 hover:text-black hover:bg-slate-50 rounded-md px-3 py-2.5 cursor-pointer space-x-3 transition-colors">
               <MessageSquare className="w-5 h-5"/>
               <span>Messages</span>
             </div>
             <div className="flex items-center text-slate-500 hover:text-black hover:bg-slate-50 rounded-md px-3 py-2.5 cursor-pointer space-x-3 transition-colors">
               <Wallet className="w-5 h-5"/>
               <span>Wallet</span>
             </div>
          </div>
        </aside>

        {/* 6. Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/50">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight mb-8">Available Campaigns</h1>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="border border-slate-200 bg-white rounded-xl overflow-hidden animate-pulse shadow-sm">
                     <div className="h-48 bg-slate-200" />
                     <div className="p-5 space-y-4">
                       <div className="h-5 bg-slate-200 rounded w-3/4" />
                       <div className="h-4 bg-slate-200 rounded w-1/2" />
                       <div className="flex gap-2">
                         <div className="h-6 bg-slate-200 rounded w-16" />
                         <div className="h-6 bg-slate-200 rounded w-20" />
                       </div>
                       <div className="h-10 bg-slate-200 rounded-lg mt-4 w-full" />
                     </div>
                   </div>
                 ))}
              </div>
            ) : sortedCampaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-200 bg-white rounded-xl shadow-sm">
                <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold tracking-tight mb-2">No Campaigns Found</h3>
                <p className="text-slate-500 text-sm max-w-sm font-medium">There are currently no campaigns available on the marketplace. Check back later!</p>
              </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {sortedCampaigns.map(camp => {
                   // Gating Logic Evaluation
                   const minFollowers = camp.min_followers_required || 0;
                   const hasFollowers = creatorProfile.follower_count >= minFollowers;
                   const hasAgeMatch = calculateAgeOverlap(creatorProfile.age_min, creatorProfile.age_max, camp.age_min, camp.age_max);
                   const isEligible = hasFollowers && hasAgeMatch;
                   
                   const campInterests = Array.isArray(camp.interests) ? camp.interests : [];
                   const matchedInterests = campInterests.filter(i => creatorProfile.interests.includes(i));
                   
                   return (
                      <div key={camp.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col group hover:border-slate-300 transition-colors shadow-sm hover:shadow">
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                          {camp.cover_image_url ? (
                            <img src={camp.cover_image_url} alt={camp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                              <Briefcase className="w-8 h-8 mb-2 opacity-20" />
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Campaign</span>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full cursor-pointer hover:bg-white backdrop-blur-md shadow-sm transition-transform active:scale-95">
                            <Bookmark className="w-4 h-4 text-black" />
                          </div>
                        </div>
                        
                        <div className="p-5 flex flex-col flex-1">
                           <h2 className="text-lg font-bold tracking-tight mb-1.5 leading-tight line-clamp-2">{camp.title}</h2>
                           
                           <p className="text-sm font-medium text-slate-500 mb-4 flex items-center">
                             <MapPin className="w-3.5 h-3.5 mr-1" />
                             {camp.location || 'Remote'}
                           </p>
                           
                           <div className="flex flex-wrap gap-2 mb-4">
                             {matchedInterests.length > 0 ? (
                               matchedInterests.slice(0, 2).map(i => (
                                 <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold tracking-tight uppercase">
                                   {i}
                                 </span>
                               ))
                             ) : (
                               <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold tracking-tight uppercase">
                                 Various Topics
                               </span>
                             )}
                             <span className="text-[11px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold tracking-tight uppercase border border-indigo-100">
                               {minFollowers > 0 ? `${(minFollowers/1000).toFixed(1)}k+ FLW` : 'Any FLW'}
                             </span>
                           </div>
                           
                           <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                              <div className="text-xs text-slate-500 font-medium tracking-tight">Payout</div>
                              <div className="font-bold tracking-tight text-lg text-black">
                                {camp.payout_amount ? `₹${camp.payout_amount.toLocaleString()}` : 'Variable'}
                              </div>
                           </div>
                           
                           <div className="mt-5">
                             {isEligible ? (
                               <button className="w-full bg-black text-white font-bold tracking-tight py-2.5 rounded-lg text-sm hover:bg-slate-800 transition-colors shadow-sm active:scale-[0.98]">
                                 Apply & Comment
                               </button>
                             ) : (
                               <button disabled className="w-full bg-slate-100 text-slate-400 font-bold tracking-tight py-2.5 rounded-lg text-sm cursor-not-allowed border border-slate-200/60">
                                 🔒 Criteria Not Met
                               </button>
                             )}
                           </div>
                        </div>
                      </div>
                   );
                 })}
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatorDashboard;
