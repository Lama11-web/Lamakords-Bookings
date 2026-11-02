import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Review, Listing } from '../types';
import { 
  Star, 
  ThumbsUp, 
  CornerDownRight, 
  Send, 
  ShieldCheck, 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  X,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface CustomerReviewsProps {
  listingId?: string;
  showListingSelector?: boolean;
  onClose?: () => void;
}

const HIGHLIGHT_TAGS = [
  '24/7 Solar Backup',
  'Warm Zambian Hospitality',
  'Scenic Wildlife View',
  'Clean Borehole Water',
  'Delicious Local Dining',
  'Fast WiFi',
  'Near Victoria Falls',
  'Peaceful & Safe'
];

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ 
  listingId, 
  showListingSelector = false,
  onClose 
}) => {
  const { 
    reviews, 
    listings, 
    addReview, 
    isGuest, 
    setShowAuthModal 
  } = useApp();

  // Selected listing for posting or filtering
  const [activeListingId, setActiveListingId] = useState<string>(
    listingId || listings[0]?.id || ''
  );

  // New review form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter & Sort states
  const [filterStar, setFilterStar] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [helpfulMap, setHelpfulMap] = useState<{ [reviewId: string]: number }>({});
  const [userVotedHelpful, setUserVotedHelpful] = useState<{ [reviewId: string]: boolean }>({});

  const targetListing = listings.find(l => l.id === (listingId || activeListingId));

  // Filter reviews matching listing and star filter
  const filteredReviews = useMemo(() => {
    let list = reviews.filter(r => {
      const matchListing = listingId ? r.listingId === listingId : (activeListingId === 'all' || r.listingId === activeListingId);
      const matchStar = 
        filterStar === 'all' 
          ? true 
          : filterStar === '5' 
          ? r.rating === 5 
          : filterStar === '4' 
          ? r.rating === 4 
          : r.rating <= 3;
      return matchListing && matchStar;
    });

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating);
    }

    return list;
  }, [reviews, listingId, activeListingId, filterStar, sortBy]);

  // Aggregate Statistics
  const stats = useMemo(() => {
    const relevant = listingId 
      ? reviews.filter(r => r.listingId === listingId) 
      : (activeListingId === 'all' ? reviews : reviews.filter(r => r.listingId === activeListingId));
    
    const count = relevant.length;
    if (count === 0) {
      return { average: 5.0, count: 0, starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }

    const sum = relevant.reduce((acc, r) => acc + r.rating, 0);
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    relevant.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      starCounts[star] = (starCounts[star] || 0) + 1;
    });

    return {
      average: Number((sum / count).toFixed(1)),
      count,
      starCounts
    };
  }, [reviews, listingId, activeListingId]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleHelpfulClick = (revId: string) => {
    if (userVotedHelpful[revId]) {
      setUserVotedHelpful(prev => ({ ...prev, [revId]: false }));
      setHelpfulMap(prev => ({ ...prev, [revId]: Math.max(0, (prev[revId] || 1) - 1) }));
    } else {
      setUserVotedHelpful(prev => ({ ...prev, [revId]: true }));
      setHelpfulMap(prev => ({ ...prev, [revId]: (prev[revId] || 0) + 1 }));
    }
  };

  const getRatingDescription = (r: number) => {
    switch (r) {
      case 5: return '5 Stars - Exceptional Zambian Stay';
      case 4: return '4 Stars - Very Good Experience';
      case 3: return '3 Stars - Satisfactory & Decent';
      case 2: return '2 Stars - Needs Improvement';
      case 1: return '1 Star - Disappointing Experience';
      default: return '';
    }
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (isGuest) {
      setShowAuthModal(true);
      return;
    }

    if (!comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Append highlight tags if any to comment
      const finalComment = selectedTags.length > 0 
        ? `${comment.trim()}\n\n[Highlights: ${selectedTags.join(', ')}]`
        : comment.trim();

      const targetId = listingId || activeListingId;
      addReview(targetId, rating, finalComment);

      setComment('');
      setSelectedTags([]);
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      setTimeout(() => setIsSubmittedSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Listing Selector (if standalone view) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            <span>Customer Reviews & Guest Ratings (FR-05)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified guest feedback, star ratings, and direct host responses
          </p>
        </div>

        {/* Optional Close or Selector */}
        <div className="flex items-center gap-2">
          {(!listingId || showListingSelector) && (
            <select
              value={activeListingId}
              onChange={(e) => setActiveListingId(e.target.value)}
              className="text-xs font-semibold p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">All Accommodations</option>
              {listings.map(l => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Rating Scorecard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        
        {/* Left Column: Big Average Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700/80">
          <span className="text-5xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
            {stats.average.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 my-2 text-amber-500">
            {[1, 2, 3, 4, 5].map(s => (
              <Star 
                key={s} 
                className={`w-4 h-4 ${s <= Math.round(stats.average) ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-600'}`} 
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Based on {stats.count} verified guest review{stats.count === 1 ? '' : 's'}
          </p>
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Verified Stays</span>
          </div>
        </div>

        {/* Right Column: Star Rating Distribution Progress Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2 text-xs">
          {[5, 4, 3, 2, 1].map(num => {
            const count = (stats.starCounts as any)[num] || 0;
            const pct = stats.count > 0 ? Math.round((count / stats.count) * 100) : 0;
            return (
              <div key={num} className="flex items-center gap-3">
                <button
                  onClick={() => setFilterStar(filterStar === String(num) ? 'all' : String(num))}
                  className="w-12 text-left font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 flex items-center gap-1"
                >
                  <span>{num}</span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </button>

                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <span className="w-10 text-right font-mono text-[11px] text-slate-400 tabular-nums">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Post a Review Form */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Write a Review for {targetListing ? targetListing.title : 'this stay'}
          </h4>
          {isGuest && (
            <span className="text-[11px] text-amber-600 font-medium">
              Guest mode: sign-in required on submit (FR-28)
            </span>
          )}
        </div>

        {isSubmittedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thank you! Your review and star rating have been published to the platform.</span>
          </div>
        )}

        <form onSubmit={handlePostReview} className="space-y-4">
          
          {/* Interactive Star Rating Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your Overall Rating
              </span>
              <span className="text-xs font-bold text-amber-600">
                {getRatingDescription(hoverRating || rating)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map(s => {
                const isLit = (hoverRating || rating) >= s;
                return (
                  <button
                    type="button"
                    key={s}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    className="p-1 rounded-lg hover:scale-110 active:scale-95 transition-transform focus:outline-none"
                    aria-label={`Rate ${s} stars`}
                  >
                    <Star 
                      className={`w-7 h-7 transition-colors ${
                        isLit 
                          ? 'fill-amber-500 text-amber-500 drop-shadow-xs' 
                          : 'text-slate-300 dark:text-slate-600'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Highlight Tags */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Tag Trip Highlights (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {HIGHLIGHT_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      isSelected
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Comment Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your Detailed Review
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {comment.length} / 500 characters
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="Tell other travelers about your stay: room cleanliness, solar/power backup, staff hospitality, food quality, or proximity to local sights..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-relaxed"
              required
            />
          </div>

          {/* Submit Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Posting as: <strong className="text-slate-700 dark:text-slate-200">{isGuest ? 'Guest User' : 'Mubiana Lamaswala'}</strong>
            </span>

            <button
              type="submit"
              disabled={!comment.trim() || isSubmitting}
              className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Submit Review'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400">Filter:</span>
          {['all', '5', '4', '3'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStar(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterStar === f
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'All Stars' : `${f} Stars`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-3.5">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-40" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No reviews found</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Be the first to share your experience for this stay!</p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const stay = listings.find(l => l.id === rev.listingId);
            const helpfulCount = (helpfulMap[rev.id] || 0) + 4; // base helpful count
            const hasVoted = userVotedHelpful[rev.id];

            return (
              <div 
                key={rev.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-xs space-y-3"
              >
                {/* Author row & rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {rev.customerName}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified Stay
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                        <span>{rev.date}</span>
                        {stay && (
                          <>
                            <span>·</span>
                            <span className="text-amber-600 dark:text-amber-400 font-sans font-medium">{stay.title}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 px-2 py-1 rounded-lg">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-600'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 ml-1">
                      {rev.rating}.0
                    </span>
                  </div>
                </div>

                {/* Comment Prose */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {rev.comment}
                </p>

                {/* FR-4: Business Owner Official Response */}
                {rev.ownerResponse && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border-l-4 border-amber-600 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="flex items-center justify-between font-bold text-[11px] text-amber-900 dark:text-amber-200">
                      <span className="flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Response from {rev.ownerResponse.author}</span>
                      </span>
                      <span className="font-mono text-slate-400 text-[10px]">{rev.ownerResponse.date}</span>
                    </div>
                    <p className="italic pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
                      "{rev.ownerResponse.text}"
                    </p>
                  </div>
                )}

                {/* Helpful voting button */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      hasVoted
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span>Helpful ({helpfulCount})</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
