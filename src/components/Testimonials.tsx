"use client";

import { Star } from "lucide-react";
import { useState } from "react";

const reviews = [
  { reviewer: "Luis salas", reviews_count: 3, time: "2 months ago", review: "Mobile janitorial is the best supplier in socal if your a looking for top quality janitorial supplies. Very friendly staff and has everything in stock . Highly recommended ." },
  { reviewer: "Ana Pinon", reviews_count: 1, time: "3 months ago", review: "Mobile Janitorial is a trustworthy and professional supplier. Great customer service, everyone is always very friendly and helpful. The prices are the best prices on the market. Really recommend this place for all janitorial supplies." },
  { reviewer: "Slavic Tuniyants", reviews_count: 39, time: "4 months ago", review: "Excellent service and top-quality janitorial supplies! Orders are always delivered on time, and the staff is super friendly and knowledgeable. My experiece with Ryan was nothing short of perfect. They carry everything I need to keep my business clean and stocked. Highly recommend!" },
  { reviewer: "Eliana Guo", reviews_count: 2, time: "5 months ago", review: "Mobile Janitorial Supply is a trustworthy and professional supplier with excellent service and strong expertise in the cleaning and hygiene industry. Communication has always been smooth and pleasant. I truly appreciate the professionalism of their team and look forward to future cooperation." },
  { reviewer: "Brianda Lemus", reviews_count: 2, time: "6 months ago", review: "I can't say enough good things about Mobile Janitorial Supply! I order supplies for our school, and they consistently provide the best products along with excellent service. David has been a real gem, always ready to assist and ensure I get exactly what I need." },
  { reviewer: "Doug Newgass", reviews_count: 2, time: "7 months ago", review: "David and Zack are the best. Can always count on them to deliver quality products at a great price. Can't recommend them enough!" },
  { reviewer: "Theresa Alonso", reviews_count: 22, time: "7 months ago", review: "I can count on Mobile Janitorial supply for good prices and quality products! Best customer service!" },
  { reviewer: "Larissa Torres", reviews_count: 1, time: "7 months ago", review: "Excellent service, good prices. They have sold their products to me for over 10 years and I have never had any problems. I highly recommend them." },
  { reviewer: "Yaya G.", reviews_count: 4, time: "7 months ago", review: "My experience with David from Mobile Janitorial Supply has been excellent. The company is reliable, customer-focused, and proactive, consistently communicating well and offering quality products at fair prices. I highly recommend them to anyone seeking a reliable supplier partner in the janitorial industry." },
  { reviewer: "All Saints' Episcopal Church", reviews_count: 2, time: "7 months ago", review: "Orders are delivered on time, and staff members are friendly and helpful." },
  { reviewer: "Deanna Beck", reviews_count: 4, time: "7 months ago", review: "Great pricing and quick delivery time, along with excellent customer service makes Mobile Janitorial the best! Nick and Dave are awesome to work with. Highly recommend." },
  { reviewer: "Carlos Alberto Ramírez Lara", reviews_count: 2, time: "7 months ago", review: "Excellent customer service" },
  { reviewer: "Foolme Once", reviews_count: 3, time: "8 months ago", review: "Always in stock. Always great service!" },
  { reviewer: "Michelle Hayden", reviews_count: 57, time: "9 months ago", review: "Great prices! Great bunch of guys! Quick shippers!" },
  { reviewer: "Steve Coutts", reviews_count: 4, time: "9 months ago", review: "Great service and wide selection. Amazing store." },
  { reviewer: "Anthony Morales", reviews_count: 2, time: "11 months ago", review: "The place was great. They have a free coffee machine that has everything." },
  { reviewer: "Omar Diaz", reviews_count: 1, time: "11 months ago", review: "Great janitorial supply store & prices!!! And excellent customer service." },
  { reviewer: "Steve Gardner", reviews_count: 18, time: "a year ago", review: "We have found a reputable janitorial supply store. Not only is it accessable online and easy to order, they are cloose to our facility and easy to do business with." },
  { reviewer: "Chris Mills", reviews_count: 5, time: "a year ago", review: "Excellent service (prompt, friendly, informative), very competitive pricing and orders are fulfilled next day. Very happy with Nick and his team at Mobile Janitorial!" },
  { reviewer: "James Brown", reviews_count: 2, time: "a year ago", review: "Always great prices and fast delivery" },
  { reviewer: "D Bros Portables", reviews_count: 59, time: "a year ago", review: "I highly recommend Mobile Janitorial Supply, David, Nick and Zack, it is our pleasure to do business with you and your team. You have been providing all what we need. Thank you for your great service." },
  { reviewer: "Austin Ferron", reviews_count: 2, time: "a year ago", review: "They are great to work with!" },
  { reviewer: "ElaineY ShuraCouncil", reviews_count: 3, time: "a year ago", review: "Mobile Janitorial Supply has all the supplies I need at reasonable prices. Their staff is very professional and my deliveries are always on time. Great place to get your janitorial needs fulfilled!" },
  { reviewer: "Sharon Gudiel", reviews_count: 1, time: "a year ago", review: "I would like to highly recommend Mobile Janitorial Services! Great customer service, which is hard to find nowadays. Deliveries are made in a timely manner. They surely go above and beyond!" },
  { reviewer: "Bigguff", reviews_count: 4, time: "a year ago", review: "Here at Astronic in Aliso Viejo Ca. I highly recommend David and Nick at Mobile Janitorial Supply. They are very forthright with their knowledge of products for specific uses and stock everything on the website." },
  { reviewer: "Matt Schiele", reviews_count: 2, time: "a year ago", review: "Not only did they have TP during the pandemic but they never price gouge like so many others. The staff is always super friendly and helpful, I wish I could give them more stars then 5." },
  { reviewer: "Sparkle Unlimited Services, Inc CEO C. Laracuente", reviews_count: 18, time: "a year ago", review: "David, have the lowers prices for janitorial supplies I recommended, you not find another place like Mobil Janitorial Supply." },
  { reviewer: "Clever Chapman", reviews_count: 1, time: "a year ago", review: "David and Nick are the best! They respond quickly to email questions and orders. Their pricing is competitive and orders are fulfilled next day. We've been using them for years now and are extremely happy with their service and support!" },
  { reviewer: "Angela Mendoza", reviews_count: 5, time: "a year ago", review: "We drove in from Phx Az… the customer service was 5 star and the products we needed were in stock!!!! For some a that is more then a 5 star!!!! We are extremely satisfied!" },
];

const ratingBreakdown = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 15 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const avatarColors = [
  "bg-red-500", "bg-blue-500", "bg-emerald-500", "bg-violet-500",
  "bg-amber-500", "bg-teal-500", "bg-rose-500", "bg-indigo-500",
];

function ReviewCard({
  r,
  onHover,
  onLeave,
  isExpanded,
  onClick,
}: {
  r: (typeof reviews)[0];
  onHover: () => void;
  onLeave: () => void;
  isExpanded: boolean;
  onClick: () => void;
}) {
  const initials = r.reviewer
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colorIndex = r.reviewer.charCodeAt(0) % avatarColors.length;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-100 p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-200 ${
        isExpanded ? "shadow-md border-gray-200" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 ${avatarColors[colorIndex]} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <span className="text-white font-bold text-[10px]">{initials}</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-mjs-dark truncate max-w-[140px]">
              {r.reviewer}
            </div>
            <div className="text-[10px] text-mjs-gray-400">{r.time}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold text-mjs-green">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Verified
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-2.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 text-mjs-gold fill-mjs-gold" />
        ))}
      </div>

      {/* Review Text */}
      <p
        className={`text-[13px] text-mjs-gray-600 leading-relaxed ${
          isExpanded ? "" : "line-clamp-3"
        }`}
      >
        {r.review}
      </p>
    </div>
  );
}

export default function Testimonials() {
  const [isPaused, setIsPaused] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const doubled = [...reviews, ...reviews];

  return (
    <section className="bg-mjs-gray-50 py-8 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Summary Header */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            {/* Title + Badge */}
            <div className="text-center">
              <h2 className="text-lg font-bold text-mjs-dark mb-1.5">
                Customer Reviews
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className="bg-green-600 text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                  4.9
                  <Star className="w-3 h-3 fill-white" />
                </span>
                <span className="text-xs text-mjs-gray-400">229 Reviews</span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-gray-200" />

            {/* Google */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-mjs-gold fill-mjs-gold" />
                  ))}
                </div>
              </div>
              <span className="text-[10px] font-semibold text-mjs-gray-400 uppercase tracking-wide">
                #1 Rated &amp; Reviewed
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-gray-200" />

            {/* Big Rating */}
            <div className="text-center">
              <div className="text-3xl font-black text-mjs-dark leading-none">4.9</div>
              <div className="flex items-center gap-0.5 justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-mjs-gold fill-mjs-gold" />
                ))}
              </div>
              <div className="text-[10px] text-mjs-gray-400 mt-0.5">229 total</div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-gray-200" />

            {/* Rating Bars */}
            <div className="space-y-1 min-w-[180px]">
              {ratingBreakdown.map((r) => (
                <div key={r.stars} className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-mjs-gray-500 w-3 text-right">
                    {r.stars}
                  </span>
                  <Star className="w-3 h-3 text-mjs-gold fill-mjs-gold flex-shrink-0" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        r.stars >= 4 ? "bg-green-500" : r.stars === 3 ? "bg-yellow-400" : "bg-orange-400"
                      }`}
                      style={{ width: `${r.percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-mjs-gray-400 w-7 text-right">
                    {r.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Single Row Marquee */}
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex gap-4 animate-marquee-reviews"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {doubled.map((r, i) => (
              <ReviewCard
                key={`${r.reviewer}-${i}`}
                r={r}
                isExpanded={expandedIndex === i}
                onHover={() => setIsPaused(true)}
                onLeave={() => {
                  setExpandedIndex(null);
                  setIsPaused(false);
                }}
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeReviews {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-reviews {
          animation: marqueeReviews 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
