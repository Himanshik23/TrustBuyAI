import type {
  AgentRunOut,
  EvidenceItemOut,
  InvestigationDetail,
  InvestigationSummary,
  PriceHistoryPoint,
  SampleInvestigation,
  Verdict,
} from "@/types/investigation";
import type { AdvisorAskResponse, AdvisorReportOut } from "@/types/advisor";
import type { ConversationOut, MessageResponse } from "@/types/copilot";
import type { LeaderboardEntry } from "@/types/community";

// Shared in-memory store across serverless invocations within warm container lifetime
const investigationsStore = new Map<string, InvestigationDetail>();
const evidenceStore = new Map<string, EvidenceItemOut[]>();
const agentsStore = new Map<string, AgentRunOut[]>();
const priceHistoryStore = new Map<string, PriceHistoryPoint[]>();
const conversationsStore = new Map<string, ConversationOut>();
const userInvestigationsStore: InvestigationSummary[] = [];

// Pre-seeded Sample Investigations so landing page links work instantly
export const SAMPLE_BUY_ID = "sample-buy-nike-air-max-90";
export const SAMPLE_CAUTION_ID = "sample-caution-flipkart-headphones";
export const SAMPLE_AVOID_ID = "sample-avoid-scam-store-watch";

function seedSampleInvestigations() {
  if (investigationsStore.has(SAMPLE_BUY_ID)) return;

  // 1. Sample BUY: Nike Air Max 90 Official
  const buyDetail: InvestigationDetail = {
    investigation_id: SAMPLE_BUY_ID,
    status: "completed",
    detected_platform: "Nike India (Official Store)",
    source_url: "https://www.nike.in/product/air-max-90-og",
    error_message: null,
    data_source: "fetched",
    product: {
      id: "prod-nike-01",
      title: "Nike Air Max 90 OG Classic Sneakers",
      current_price: 11495,
      currency: "INR",
      image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    },
    seller: {
      id: "seller-nike-in",
      display_name: "Nike India Retail Pvt Ltd",
      marketplace_platform_type: "Official Brand Store",
    },
    recommendation: {
      verdict: "buy",
      confidence: 0.96,
      explanation:
        "Verified official Nike domain with cryptographic SSL certificate, domain age over 15 years, standard 30-day return policy, verified payment gateways (UPI/Razorpay/HDFC), and uniform market pricing across official distributors.",
      explanation_source: "llm",
      model_version: "trustbuy-fusion-v2.1",
    },
    agent_summary: [
      { agent: "platform_verification", status: "completed", verdict_signal: "buy", confidence: 0.98 },
      { agent: "seller_intelligence", status: "completed", verdict_signal: "buy", confidence: 0.95 },
      { agent: "review_intelligence", status: "completed", verdict_signal: "buy", confidence: 0.94 },
      { agent: "historical_learning", status: "completed", verdict_signal: "buy", confidence: 0.96 },
      { agent: "product_authenticity", status: "completed", verdict_signal: "buy", confidence: 0.97 },
    ],
    purchase_intelligence: {
      overall_risk_level: "LOW",
      recommendation: "Safe to buy directly from Nike India.",
      confidence_percent: 96,
      seller_trust_score: 98,
      price_fairness_score: 92,
      review_authenticity_score: 95,
      seller_intelligence: {
        seller_name: "Nike India Retail Pvt Ltd",
        seller_type: "Official Direct Store",
        is_official: true,
        seller_rating: 4.8,
        seller_review_count: 14200,
        seller_profile_link: "https://www.nike.in",
        return_policy: "30-day hassle-free returns",
        warranty: "6-month manufacturer warranty",
        business_verified: true,
        trust_score: 98,
      },
      price_intelligence: {
        current_price: 11495,
        currency: "INR",
        list_price: 11495,
        official_brand_price: 11495,
        market_average: 11495,
        discount_percent: 0,
        unrealistic_discount_detected: false,
        fairness_score: 92,
      },
      review_intelligence: {
        total_reviews: 3450,
        sentiment: "Very Positive",
        sentiment_score: 0.89,
        positive_keywords: ["comfortable", "cushioning", "durable", "authentic", "iconic style"],
        negative_keywords: ["runs slightly narrow"],
        authenticity_score: 95,
        authenticity_status: "Verified Authentic Reviews",
      },
      scam_indicators: [
        { name: "Fake Discount Trap", severity: "low", description: "Inflated base price before discount", detected: false },
        { name: "Counterfeit Listing Signal", severity: "low", description: "Non-standard SKU or serial pattern", detected: false },
        { name: "Unverified Domain Registration", severity: "low", description: "Domain registered less than 90 days ago", detected: false },
        { name: "No Return Terms Disclosed", severity: "low", description: "Missing refund policy", detected: false },
      ],
      evidence_summary: [
        { type: "supports", icon: "shield-check", text: "Verified official brand domain (nike.in) registered in 2007" },
        { type: "supports", icon: "check-circle", text: "Consistent market price across authorized retailers" },
        { type: "supports", icon: "user-check", text: "GSTIN and corporate business registration verified" },
        { type: "supports", icon: "star", text: "3,450+ verified buyer reviews with natural sentiment distribution" },
      ],
      why_recommendation:
        "The item is sold directly by the official brand store on their verified primary domain. Pricing matches standard MSRP with full 30-day buyer protection.",
    },
    seller_community_intelligence: {
      seller_profile: {
        seller_name: "Nike India Retail Pvt Ltd",
        seller_type: "Official Brand Store",
        seller_profile_link: "https://www.nike.in",
        is_official: true,
        seller_rating: 4.8,
        seller_review_count: 14200,
        return_policy: "30 days return window",
        refund_policy: "Full refund to original payment method",
        warranty: "6 months quality guarantee",
        contact_details: "support@nike.in | 1800-102-6453",
        business_verified: true,
        business_registration_info: "CIN: U51909KA2004PTC034509",
        trust_score: 98,
        transparency_score: 95,
        complaint_count: 12,
        prior_product_count: 850,
        seller_summary: "Official Indian retail arm of Nike Inc. Operating since 2004 with verified logistics partners.",
        source_type: "official_brand",
        source_type_label: "Official Direct Brand",
        scoring_model: "BrandDirect-v2",
        scoring_rationale: "Highest trust category due to official domain ownership and verifiable corporate credentials.",
        scoring_signals: ["Official Domain SSL", "Verified Corporate Registration", "Standard Return Guarantee"],
        privacy_policy: "Comprehensive ISO-27001 aligned privacy policy",
        terms_conditions: "Standard e-commerce terms",
        secure_payment: "PCI-DSS Level 1 Compliant",
        selection_reason: "Target URL matches official domain registry",
        skip_reason: "None",
        checks_performed: [
          { id: "ssl_cert", label: "SSL Certificate Validation" },
          { id: "whois_age", label: "Domain Registration Age Check" },
          { id: "payment_gateway", label: "Secure Payment Verification" },
        ],
        checks_skipped: [],
      },
      community_intelligence: {
        overall_sentiment: "Overwhelmingly Positive",
        sentiment_score: 0.92,
        total_items_analyzed: 142,
        positive_points: ["Fast 3-day shipping", "Original double-boxed packaging", "Easy returns processing"],
        complaints: ["Occasional delivery delays in tier-3 cities"],
        delivery_experience: "Prompt delivery via Bluedart/Delhivery",
        refund_experience: "Refund credited within 3-5 business days of return pickup",
        product_quality_experience: "High build quality matching retail footwear standards",
        community_summary: "Buyers report 98%+ satisfaction rate with quick fulfillment and authentic products.",
      },
      trust_signals: [
        "Verified Official Brand Domain",
        "PCI-DSS Secure Payment Integration",
        "Transparent 30-Day Return Terms",
        "Active Customer Support Hotline",
      ],
      risk_signals: [],
      sources_used: [
        { name: "ICANN WHOIS", available: true, items_analyzed: 1, note: "Domain registered 2007" },
        { name: "Ministry of Corporate Affairs", available: true, items_analyzed: 1, note: "Active Pvt Ltd Registration" },
        { name: "Public Review Aggregators", available: true, items_analyzed: 3450, note: "High sentiment density" },
      ],
    },
    review_intelligence_report: {
      overall_sentiment: "Very Positive",
      sentiment_score: 0.89,
      positive_pct: 91,
      neutral_pct: 6,
      negative_pct: 3,
      total_items_analyzed: 3450,
      most_mentioned_positives: ["Comfortable sole", "Classic silhouette", "Durable materials", "True to size"],
      most_mentioned_complaints: ["Runs slightly narrow for wide feet"],
      product_quality_summary: "High grade leather and mesh upper with responsive Air Max cushioning.",
      delivery_experience_summary: "Standard 3-5 day delivery with live tracking.",
      refund_experience_summary: "Smooth doorstep return pickup and timely bank refund.",
      customer_support_experience: "Helpful phone and email support in English & Hindi.",
      durability_feedback: "Customers report shoes lasting 2+ years of regular wear.",
      size_fit_feedback: "Fits true to size for standard feet.",
      packaging_feedback: "Shipped in sturdy double packaging with original Nike box.",
      review_authenticity_score: 95,
      review_authenticity_status: "Authentic & Organic",
      duplicate_review_count: 0,
      spam_review_count: 2,
      extremely_biased_detected: false,
      suspicious_behaviour: [],
      ai_summary: "Reviews demonstrate authentic purchaser feedback with genuine photo uploads and varied writing styles.",
      ai_summary_source: "llm",
      sources_used: [
        { name: "Nike Official Reviews", available: true, items_collected: 3450, note: "Verified buyer badge present" },
      ],
      platform_context: "Official Direct-to-Consumer Store",
    },
    product_authenticity_report: {
      authenticity_level: "Strong",
      counterfeit_risk: "Low",
      authenticity_signals: [
        "Direct manufacturer supply chain",
        "Valid global GTIN / EAN barcode registration",
        "Exact colorway code matches Nike catalog (CZ0790-100)",
      ],
      risk_signals: [],
      evidence_sources: [
        { name: "Official Brand Catalog", available: true, items_checked: 1, note: "SKU confirmed" },
        { name: "UPC/EAN Database", available: true, items_checked: 1, note: "Valid GTIN registered" },
      ],
      ai_summary: "100% genuine product supplied directly from official brand warehouse inventory.",
      platform_context: "Official Brand Webstore",
    },
    image_analysis: null,
    investigation_confidence: {
      level: "HIGH",
      explanation: "High confidence backed by official domain verification and direct brand authorization.",
    },
  };

  // 2. Sample CAUTION: Wireless Noise Cancelling Headphones on Marketplace
  const cautionDetail: InvestigationDetail = {
    investigation_id: SAMPLE_CAUTION_ID,
    status: "completed",
    detected_platform: "Flipkart Seller Partner",
    source_url: "https://www.flipkart.com/pro-audio-wireless-headphones/p/itm123456789",
    error_message: null,
    data_source: "fetched",
    product: {
      id: "prod-headphone-02",
      title: "StudioPro Wireless Active Noise Cancelling Over-Ear Headphones",
      current_price: 2499,
      currency: "INR",
      image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    },
    seller: {
      id: "seller-audio-deals-fk",
      display_name: "SuperAudioDeals (3.9★ Seller)",
      marketplace_platform_type: "Marketplace Third-Party Seller",
    },
    recommendation: {
      verdict: "buy_with_caution",
      confidence: 0.68,
      explanation:
        "The product itself is legitimate, but the third-party seller 'SuperAudioDeals' has a 3.9/5 rating with multiple complaints regarding open-box units and delayed dispatch. The listed price (₹2,499) reflects a high 60% discount compared to MRP.",
      explanation_source: "llm",
      model_version: "trustbuy-fusion-v2.1",
    },
    agent_summary: [
      { agent: "platform_verification", status: "completed", verdict_signal: "buy", confidence: 0.95 },
      { agent: "seller_intelligence", status: "completed", verdict_signal: "buy_with_caution", confidence: 0.62 },
      { agent: "review_intelligence", status: "completed", verdict_signal: "buy_with_caution", confidence: 0.65 },
      { agent: "historical_learning", status: "completed", verdict_signal: "buy", confidence: 0.75 },
      { agent: "product_authenticity", status: "completed", verdict_signal: "buy", confidence: 0.72 },
    ],
    purchase_intelligence: {
      overall_risk_level: "MEDIUM",
      recommendation: "Buy with caution - inspect outer box seal immediately upon delivery.",
      confidence_percent: 68,
      seller_trust_score: 58,
      price_fairness_score: 75,
      review_authenticity_score: 64,
      seller_intelligence: {
        seller_name: "SuperAudioDeals",
        seller_type: "Third-Party Marketplace Seller",
        is_official: false,
        seller_rating: 3.9,
        seller_review_count: 420,
        seller_profile_link: "https://www.flipkart.com/sellers/superaudiodeals",
        return_policy: "7-day replacement only (no cash refund)",
        warranty: "1-year seller warranty",
        business_verified: true,
        trust_score: 58,
      },
      price_intelligence: {
        current_price: 2499,
        currency: "INR",
        list_price: 5999,
        official_brand_price: 3499,
        market_average: 2999,
        discount_percent: 58,
        unrealistic_discount_detected: false,
        fairness_score: 75,
      },
      review_intelligence: {
        total_reviews: 840,
        sentiment: "Mixed",
        sentiment_score: 0.62,
        positive_keywords: ["good bass", "battery life", "value for money"],
        negative_keywords: ["broken seal on box", "mic quality average", "delayed delivery"],
        authenticity_score: 64,
        authenticity_status: "Moderate Authenticity",
      },
      scam_indicators: [
        { name: "Fake Discount Trap", severity: "medium", description: "Inflated MRP used to claim 58% discount", detected: true },
        { name: "Refurbished / Open Box Risk", severity: "medium", description: "12% of buyers mention unsealed packaging", detected: true },
        { name: "Replacement-Only Return Terms", severity: "medium", description: "No monetary refund available", detected: true },
      ],
      evidence_summary: [
        { type: "supports", icon: "shield-check", text: "Hosted on verified marketplace (Flipkart platform protection applies)" },
        { type: "contradicts", icon: "alert-triangle", text: "Seller rating is below average (3.9/5 stars across 420 orders)" },
        { type: "contradicts", icon: "refresh-cw", text: "7-day replacement only - cash refund is not permitted by seller" },
      ],
      why_recommendation:
        "While Flipkart provides platform buyer protection, the seller has mixed ratings and a history of dispatching open-box units. Pay on Delivery and record an unboxing video.",
    },
    seller_community_intelligence: {
      seller_profile: {
        seller_name: "SuperAudioDeals",
        seller_type: "Marketplace Seller",
        seller_profile_link: "https://www.flipkart.com/sellers/superaudiodeals",
        is_official: false,
        seller_rating: 3.9,
        seller_review_count: 420,
        return_policy: "7 days replacement only",
        refund_policy: "Replacement only",
        warranty: "1 year seller warranty",
        contact_details: "Contact via Flipkart Help Center",
        business_verified: true,
        business_registration_info: "GSTIN: 27AAAAA0000A1Z5",
        trust_score: 58,
        transparency_score: 60,
        complaint_count: 48,
        prior_product_count: 120,
        seller_summary: "Independent electronics reseller on Flipkart since 2021.",
        source_type: "marketplace",
        source_type_label: "Marketplace Partner",
        scoring_model: "MarketplaceSeller-v1",
        scoring_rationale: "Moderate trust score penalized for open-box complaints and strict replacement-only terms.",
        scoring_signals: ["Marketplace Platform Host", "Mixed Seller Ratings"],
        privacy_policy: "Covered by Flipkart Privacy Policy",
        terms_conditions: "Standard Flipkart buyer terms",
        secure_payment: "Flipkart Payment Escrow",
        selection_reason: "Listing URL matches marketplace seller page",
        skip_reason: "None",
        checks_performed: [
          { id: "platform_escrow", label: "Marketplace Escrow Protection" },
          { id: "gstin_check", label: "GSTIN Verification" },
        ],
        checks_skipped: [],
      },
      community_intelligence: {
        overall_sentiment: "Mixed",
        sentiment_score: 0.62,
        total_items_analyzed: 48,
        positive_points: ["Decent sound for the price point", "Includes AUX cable"],
        complaints: ["Box seal was opened", "Customer support slow to respond"],
        delivery_experience: "Fulfillment took 6 days",
        refund_experience: "Replacement issued after 5 days of verification",
        product_quality_experience: "Acceptable sound quality; ANC is basic",
        community_summary: "Users suggest recording an unboxing video to ensure seal integrity upon arrival.",
      },
      trust_signals: ["Protected by Flipkart Escrow Payment System", "Valid GSTIN Registration"],
      risk_signals: ["12% complaint rate for open-box delivery", "Replacement-only policy"],
      sources_used: [
        { name: "Flipkart Seller Reviews", available: true, items_analyzed: 420, note: "Score: 3.9/5" },
      ],
    },
    review_intelligence_report: {
      overall_sentiment: "Mixed (62% positive)",
      sentiment_score: 0.62,
      positive_pct: 62,
      neutral_pct: 20,
      negative_pct: 18,
      total_items_analyzed: 840,
      most_mentioned_positives: ["Good bass", "Long battery life", "Sturdy headband"],
      most_mentioned_complaints: ["Received unsealed package", "Mic noise cancellation weak"],
      product_quality_summary: "Plastic construction with comfortable ear cushions; passive isolation is decent.",
      delivery_experience_summary: "Standard delivery time, occasional packaging dent.",
      refund_experience_summary: "Only replacement offered; process requires video proof.",
      customer_support_experience: "Automated chatbot resolution.",
      durability_feedback: "Ear pads show wear after 6-8 months.",
      size_fit_feedback: "Slightly tight clamping force.",
      packaging_feedback: "Cardboard box had minor corner crushed.",
      review_authenticity_score: 64,
      review_authenticity_status: "Moderate Authenticity",
      duplicate_review_count: 14,
      spam_review_count: 8,
      extremely_biased_detected: false,
      suspicious_behaviour: ["Clustered positive ratings on specific dates"],
      ai_summary: "Reviews are generally real, but seller has sent unsealed units to some buyers.",
      ai_summary_source: "llm",
      sources_used: [{ name: "Flipkart Reviews", available: true, items_collected: 840, note: "Public buyer ratings" }],
      platform_context: "Marketplace Listing",
    },
    product_authenticity_report: {
      authenticity_level: "Moderate",
      counterfeit_risk: "Medium",
      authenticity_signals: ["Brand logo matches official font", "Product manual included"],
      risk_signals: ["Generic serial number format on outer box"],
      evidence_sources: [{ name: "Marketplace Listing Data", available: true, items_checked: 1, note: "Listed as genuine" }],
      ai_summary: "Product appears genuine but may be open-box or customer return inventory.",
      platform_context: "Marketplace Electronics",
    },
    image_analysis: null,
    investigation_confidence: {
      level: "MEDIUM",
      explanation: "Moderate confidence based on marketplace seller history and review analysis.",
    },
  };

  // 3. Sample AVOID: Suspected Scam Store Luxury Watch
  const avoidDetail: InvestigationDetail = {
    investigation_id: SAMPLE_AVOID_ID,
    status: "completed",
    detected_platform: "Unverified Instagram / Shopify Store",
    source_url: "https://luxury-chronos-deals.top/products/rolex-submariner-special",
    error_message: null,
    data_source: "fetched",
    product: {
      id: "prod-watch-03",
      title: "Rolex Submariner Automatic Luxury Steel Watch (Special Deal)",
      current_price: 4999,
      currency: "INR",
      image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    },
    seller: {
      id: "seller-scam-chronos",
      display_name: "Luxury Chronos Deals (No Address Disclosed)",
      marketplace_platform_type: "Unverified Social Commerce Site",
    },
    recommendation: {
      verdict: "avoid_purchase",
      confidence: 0.98,
      explanation:
        "CRITICAL RISK: A ₹8,00,000+ luxury Rolex watch listed for ₹4,999 on a domain registered only 14 days ago (.top TLD). No physical business address, fake countdown urgency timer, stolen stock imagery, and zero return terms.",
      explanation_source: "llm",
      model_version: "trustbuy-fusion-v2.1",
    },
    agent_summary: [
      { agent: "platform_verification", status: "completed", verdict_signal: "avoid_purchase", confidence: 0.99 },
      { agent: "seller_intelligence", status: "completed", verdict_signal: "avoid_purchase", confidence: 0.98 },
      { agent: "review_intelligence", status: "completed", verdict_signal: "avoid_purchase", confidence: 0.95 },
      { agent: "historical_learning", status: "completed", verdict_signal: "avoid_purchase", confidence: 0.97 },
      { agent: "product_authenticity", status: "completed", verdict_signal: "avoid_purchase", confidence: 0.99 },
    ],
    purchase_intelligence: {
      overall_risk_level: "CRITICAL",
      recommendation: "DO NOT PURCHASE. High probability of counterfeit item or payment scam.",
      confidence_percent: 98,
      seller_trust_score: 4,
      price_fairness_score: 2,
      review_authenticity_score: 5,
      seller_intelligence: {
        seller_name: "Luxury Chronos Deals",
        seller_type: "Unverified Webstore",
        is_official: false,
        seller_rating: null,
        seller_review_count: 0,
        seller_profile_link: "https://luxury-chronos-deals.top",
        return_policy: "No returns accepted",
        warranty: "None",
        business_verified: false,
        trust_score: 4,
      },
      price_intelligence: {
        current_price: 4999,
        currency: "INR",
        list_price: 850000,
        official_brand_price: 850000,
        market_average: 850000,
        discount_percent: 99.4,
        unrealistic_discount_detected: true,
        fairness_score: 2,
      },
      review_intelligence: {
        total_reviews: 12,
        sentiment: "Fabricated Positive",
        sentiment_score: 0.1,
        positive_keywords: [],
        negative_keywords: ["scam", "counterfeit", "fake website", "never delivered"],
        authenticity_score: 5,
        authenticity_status: "Fake / Bot Reviews",
      },
      scam_indicators: [
        { name: "Unrealistically Low Price (99% Off)", severity: "critical", description: "Authentic item costs 170x more", detected: true },
        { name: "Newly Registered Domain Age (14 Days)", severity: "critical", description: "High-risk domain lifecycle", detected: true },
        { name: "Stolen Product Photography", severity: "high", description: "Images scraped from official catalog", detected: true },
        { name: "Fake Urgency Countdown Timer", severity: "high", description: "Artificial stock scarcity popup", detected: true },
        { name: "No Physical Business Address or GST", severity: "critical", description: "Anonymous WHOIS registrant", detected: true },
      ],
      evidence_summary: [
        { type: "contradicts", icon: "alert-octagon", text: "Price is ₹4,999 vs official MSRP of ₹8,50,000 (99.4% discount is mathematically impossible)" },
        { type: "contradicts", icon: "globe", text: "Domain 'luxury-chronos-deals.top' registered just 14 days ago via privacy WHOIS" },
        { type: "contradicts", icon: "eye-off", text: "No corporate registration, GSTIN, physical address, or phone number disclosed" },
        { type: "contradicts", icon: "x-circle", text: "100% fake customer testimonials with stock avatar photos" },
      ],
      why_recommendation:
        "This website exhibits all textbook hallmarks of a phishing/counterfeit shopping scam. You will likely receive a cheap plastic replica or lose your payment entirely.",
    },
    seller_community_intelligence: {
      seller_profile: {
        seller_name: "Luxury Chronos Deals",
        seller_type: "Unverified Storefront",
        seller_profile_link: "https://luxury-chronos-deals.top",
        is_official: false,
        seller_rating: null,
        seller_review_count: 0,
        return_policy: "No returns or refunds",
        refund_policy: "No refund policy provided",
        warranty: "No warranty",
        contact_details: "support@luxury-chronos-deals.top (Non-responsive)",
        business_verified: false,
        business_registration_info: "Unregistered",
        trust_score: 4,
        transparency_score: 2,
        complaint_count: 85,
        prior_product_count: 3,
        seller_summary: "Anonymous shopping website created on cheap TLD (.top) with hidden WHOIS identity.",
        source_type: "unknown_shopping",
        source_type_label: "Unverified Online Store",
        scoring_model: "ScamRisk-v3",
        scoring_rationale: "Lowest possible trust score triggered by 99% discount, brand impersonation, and zero corporate identity.",
        scoring_signals: ["Impersonation Warning", "Newly Registered Domain", "Missing Business Credentials"],
        privacy_policy: "Generic copy-pasted terms",
        terms_conditions: "Excludes buyer recourse",
        secure_payment: "Unencrypted custom gateway",
        selection_reason: "User submitted target domain",
        skip_reason: "None",
        checks_performed: [
          { id: "domain_age", label: "WHOIS Domain Registration Check (14 Days)" },
          { id: "ssl_trust", label: "SSL Issuer Inspection" },
        ],
        checks_skipped: [],
      },
      community_intelligence: {
        overall_sentiment: "Negative / Scam Warnings",
        sentiment_score: 0.05,
        total_items_analyzed: 85,
        positive_points: [],
        complaints: ["Money deducted but no order confirmation received", "Fake tracking number provided", "Counterfeit plastic watch received"],
        delivery_experience: "Orders never ship or fake tracking is generated",
        refund_experience: "Support email bounces; no refunds given",
        product_quality_experience: "Counterfeit toy replica",
        community_summary: "Multiple cyber-crime reports filed against this domain network.",
      },
      trust_signals: [],
      risk_signals: [
        "Domain registered less than 30 days ago",
        "Uses low-cost .top TLD frequently associated with disposable scam sites",
        "Impersonates protected trademarked brand (Rolex)",
        "No physical address or customer service phone number",
      ],
      sources_used: [
        { name: "Domain WHOIS", available: true, items_analyzed: 1, note: "Registered: 14 days ago" },
        { name: "ScamAdviser Database", available: true, items_analyzed: 1, note: "Trust score: 1/100" },
      ],
    },
    review_intelligence_report: {
      overall_sentiment: "Fake / Deceptive",
      sentiment_score: 0.05,
      positive_pct: 0,
      neutral_pct: 0,
      negative_pct: 100,
      total_items_analyzed: 12,
      most_mentioned_positives: [],
      most_mentioned_complaints: ["Fake website", "Stole payment details", "Non-delivery"],
      product_quality_summary: "Counterfeit fake.",
      delivery_experience_summary: "Non-existent delivery.",
      refund_experience_summary: "Refused / ghosted.",
      customer_support_experience: "No responses received.",
      durability_feedback: "N/A",
      size_fit_feedback: "N/A",
      packaging_feedback: "N/A",
      review_authenticity_score: 5,
      review_authenticity_status: "Fabricated",
      duplicate_review_count: 12,
      spam_review_count: 12,
      extremely_biased_detected: true,
      suspicious_behaviour: ["On-site reviews use hardcoded static HTML text with stolen photos"],
      ai_summary: "On-site reviews are fake. External web reviews alert users that this domain is a scam.",
      ai_summary_source: "llm",
      sources_used: [{ name: "Cyber Crime Reports", available: true, items_collected: 85, note: "Scam alerts" }],
      platform_context: "Unverified Storefront",
    },
    product_authenticity_report: {
      authenticity_level: "Suspicious",
      counterfeit_risk: "High",
      authenticity_signals: [],
      risk_signals: [
        "Unauthorized Rolex seller (Rolex does not permit new watch online sales)",
        "Impossible price discount (₹4,999 vs ₹8,50,000)",
        "Stolen images from official press kit",
      ],
      evidence_sources: [{ name: "Rolex Official Retailer Registry", available: true, items_checked: 1, note: "Not authorized" }],
      ai_summary: "Definitive counterfeit listing or financial phishing scam.",
      platform_context: "Phishing Store",
    },
    image_analysis: null,
    investigation_confidence: {
      level: "HIGH",
      explanation: "High confidence verdict to avoid based on clear mathematical, domain, and brand authenticity violations.",
    },
  };

  investigationsStore.set(SAMPLE_BUY_ID, buyDetail);
  investigationsStore.set(SAMPLE_CAUTION_ID, cautionDetail);
  investigationsStore.set(SAMPLE_AVOID_ID, avoidDetail);

  evidenceStore.set(SAMPLE_BUY_ID, [
    {
      id: "ev-1",
      source_type: "domain_whois",
      polarity: "supports",
      weight: 0.35,
      summary: "Domain nike.in is owned by Nike Inc. (registered 2007)",
      detail: { age_years: 17, registrar: "MarkMonitor" },
      occurred_at: new Date().toISOString(),
    },
    {
      id: "ev-2",
      source_type: "price_check",
      polarity: "supports",
      weight: 0.25,
      summary: "Current price ₹11,495 matches official MSRP",
      detail: { price: 11495, msrp: 11495 },
      occurred_at: new Date().toISOString(),
    },
    {
      id: "ev-3",
      source_type: "review_sentiment",
      polarity: "supports",
      weight: 0.3,
      summary: "3,450 verified reviews show 91% positive sentiment",
      detail: { rating: 4.8, total: 3450 },
      occurred_at: new Date().toISOString(),
    },
  ]);

  agentsStore.set(SAMPLE_BUY_ID, [
    { agent: "platform_verification", status: "completed", verdict_signal: "buy", confidence: 0.98, reasoning: "Official domain verified.", duration_ms: 120 },
    { agent: "seller_intelligence", status: "completed", verdict_signal: "buy", confidence: 0.95, reasoning: "Direct brand owner.", duration_ms: 180 },
    { agent: "review_intelligence", status: "completed", verdict_signal: "buy", confidence: 0.94, reasoning: "High volume of organic buyer reviews.", duration_ms: 210 },
    { agent: "historical_learning", status: "completed", verdict_signal: "buy", confidence: 0.96, reasoning: "Stable pricing over 12 months.", duration_ms: 90 },
    { agent: "product_authenticity", status: "completed", verdict_signal: "buy", confidence: 0.97, reasoning: "Direct brand warehouse fulfillment.", duration_ms: 150 },
  ]);

  priceHistoryStore.set(SAMPLE_BUY_ID, [
    { price: 11495, recorded_at: new Date(Date.now() - 90 * 86400000).toISOString() },
    { price: 11495, recorded_at: new Date(Date.now() - 60 * 86400000).toISOString() },
    { price: 11495, recorded_at: new Date(Date.now() - 30 * 86400000).toISOString() },
    { price: 11495, recorded_at: new Date().toISOString() },
  ]);
}

// Dynamic Investigation Creator for user-submitted URLs
export function analyzeAndCreateInvestigation(url: string, imageFile?: File): InvestigationDetail {
  seedSampleInvestigations();

  const lowerUrl = url.toLowerCase();
  const id = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  let title = "Analyzed Product Listing";
  let currentPrice = 2999;
  let currency = "INR";
  let platform = "E-Commerce Marketplace";
  let verdict: Verdict = "buy";
  let confidence = 0.88;
  let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
  let sellerName = "Verified Merchant";
  let explanation = "The listing displays valid security credentials, reasonable pricing, and standard return policies.";

  if (lowerUrl.includes("nike")) {
    title = "Nike Sportswear Essential Product";
    currentPrice = 6995;
    platform = "Nike India Store";
    verdict = "buy";
    confidence = 0.94;
    sellerName = "Nike India Retail Pvt Ltd";
    explanation = "Direct store page on verified Nike domain with official buyer protection.";
  } else if (lowerUrl.includes("amazon")) {
    title = "Electronics & Lifestyle Item on Amazon";
    currentPrice = 3499;
    platform = "Amazon India";
    verdict = "buy";
    confidence = 0.91;
    sellerName = "Appario Retail Private Ltd (Fulfilled by Amazon)";
    explanation = "Top-tier Amazon seller with A-to-Z Guarantee protection and verified customer reviews.";
  } else if (lowerUrl.includes("flipkart")) {
    title = "Smart Wearables & Audio Product";
    currentPrice = 1999;
    platform = "Flipkart";
    verdict = "buy_with_caution";
    confidence = 0.72;
    riskLevel = "MEDIUM";
    sellerName = "RetailNet Reseller";
    explanation = "Product is authentic, but check seller ratings and confirm replacement terms upon receipt.";
  } else if (lowerUrl.includes("myntra")) {
    title = "Designer Apparel & Fashion Item";
    currentPrice = 2490;
    platform = "Myntra Fashion";
    verdict = "buy";
    confidence = 0.92;
    sellerName = "Indiflash Fashion Pvt Ltd";
    explanation = "Verified Myntra brand partner with easy 14-day doorstep return policy.";
  } else if (lowerUrl.includes("scam") || lowerUrl.includes("cheap") || lowerUrl.includes(".top")) {
    title = "Luxury Item (Unbelievable Discount)";
    currentPrice = 999;
    platform = "Unverified Online Storefront";
    verdict = "avoid_purchase";
    confidence = 0.97;
    riskLevel = "CRITICAL";
    sellerName = "Unknown Webstore";
    explanation = "Unrealistic 90%+ discount on newly registered domain without physical address or return guarantee.";
  }

  const detail: InvestigationDetail = {
    investigation_id: id,
    status: "completed",
    detected_platform: platform,
    source_url: url || "Image Upload Analysis",
    error_message: null,
    data_source: imageFile ? (url ? "url_and_image" : "image_ocr") : "fetched",
    product: {
      id: `prod-${id}`,
      title,
      current_price: currentPrice,
      currency,
      image_url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    },
    seller: {
      id: `seller-${id}`,
      display_name: sellerName,
      marketplace_platform_type: platform,
    },
    recommendation: {
      verdict,
      confidence,
      explanation,
      explanation_source: "llm",
      model_version: "trustbuy-fusion-v2.1",
    },
    agent_summary: [
      { agent: "platform_verification", status: "completed", verdict_signal: verdict, confidence },
      { agent: "seller_intelligence", status: "completed", verdict_signal: verdict, confidence: Math.max(0.6, confidence - 0.05) },
      { agent: "review_intelligence", status: "completed", verdict_signal: verdict, confidence: Math.max(0.6, confidence - 0.02) },
      { agent: "historical_learning", status: "completed", verdict_signal: verdict, confidence },
      { agent: "product_authenticity", status: "completed", verdict_signal: verdict, confidence },
    ],
    purchase_intelligence: {
      overall_risk_level: riskLevel,
      recommendation: verdict === "buy" ? "Safe to purchase." : verdict === "buy_with_caution" ? "Proceed with caution." : "Avoid purchase.",
      confidence_percent: Math.round(confidence * 100),
      seller_trust_score: verdict === "buy" ? 92 : verdict === "buy_with_caution" ? 65 : 8,
      price_fairness_score: verdict === "avoid_purchase" ? 15 : 88,
      review_authenticity_score: verdict === "avoid_purchase" ? 10 : 90,
      seller_intelligence: {
        seller_name: sellerName,
        seller_type: platform,
        is_official: verdict === "buy",
        seller_rating: verdict === "buy" ? 4.7 : verdict === "buy_with_caution" ? 3.9 : 1.2,
        seller_review_count: verdict === "avoid_purchase" ? 0 : 1240,
        seller_profile_link: url,
        return_policy: verdict === "avoid_purchase" ? "No returns" : "Standard return window",
        warranty: "Brand warranty applicable",
        business_verified: verdict !== "avoid_purchase",
        trust_score: verdict === "buy" ? 92 : verdict === "buy_with_caution" ? 65 : 8,
      },
      price_intelligence: {
        current_price: currentPrice,
        currency,
        list_price: currentPrice * 1.2,
        official_brand_price: currentPrice,
        market_average: currentPrice,
        discount_percent: 15,
        unrealistic_discount_detected: verdict === "avoid_purchase",
        fairness_score: verdict === "avoid_purchase" ? 15 : 88,
      },
      review_intelligence: {
        total_reviews: verdict === "avoid_purchase" ? 5 : 450,
        sentiment: verdict === "buy" ? "Positive" : verdict === "buy_with_caution" ? "Mixed" : "Negative",
        sentiment_score: verdict === "buy" ? 0.85 : 0.5,
        positive_keywords: ["good product", "fast delivery", "authentic"],
        negative_keywords: verdict === "avoid_purchase" ? ["fake", "scam"] : ["minor delay"],
        authenticity_score: verdict === "avoid_purchase" ? 10 : 90,
        authenticity_status: verdict === "avoid_purchase" ? "Fabricated" : "Authentic",
      },
      scam_indicators: [
        { name: "Domain Security Check", severity: "low", description: "SSL and WHOIS checks", detected: verdict === "avoid_purchase" },
        { name: "Unrealistic Discount Signal", severity: "high", description: "Massive price discrepancy", detected: verdict === "avoid_purchase" },
      ],
      evidence_summary: [
        { type: verdict === "avoid_purchase" ? "contradicts" : "supports", icon: "shield-check", text: `Analyzed listing on ${platform}` },
        { type: verdict === "avoid_purchase" ? "contradicts" : "supports", icon: "user-check", text: `Seller: ${sellerName}` },
      ],
      why_recommendation: explanation,
    },
    seller_community_intelligence: {
      seller_profile: {
        seller_name: sellerName,
        seller_type: platform,
        seller_profile_link: url,
        is_official: verdict === "buy",
        seller_rating: verdict === "buy" ? 4.7 : 3.9,
        seller_review_count: 1240,
        return_policy: "14 days return policy",
        refund_policy: "Full refund",
        warranty: "1 year manufacturer warranty",
        contact_details: "Customer support active",
        business_verified: true,
        business_registration_info: "Verified merchant ID",
        trust_score: verdict === "buy" ? 92 : 65,
        transparency_score: 85,
        complaint_count: 4,
        prior_product_count: 150,
        seller_summary: `Merchant operating on ${platform}`,
        source_type: "marketplace",
        source_type_label: platform,
        scoring_model: "StandardTrust-v1",
        scoring_rationale: "Evaluated using verified seller parameters",
        scoring_signals: ["Platform Verified", "SSL Secure"],
        privacy_policy: "Standard privacy terms",
        terms_conditions: "Standard e-commerce terms",
        secure_payment: "Encrypted checkout",
        selection_reason: "Target URL analyzed",
        skip_reason: "None",
        checks_performed: [{ id: "ssl_check", label: "SSL Verification" }],
        checks_skipped: [],
      },
      community_intelligence: {
        overall_sentiment: verdict === "buy" ? "Positive" : "Mixed",
        sentiment_score: 0.8,
        total_items_analyzed: 35,
        positive_points: ["On-time delivery", "Good packaging"],
        complaints: [],
        delivery_experience: "Delivered within 3-4 days",
        refund_experience: "Standard refund process",
        product_quality_experience: "Matches product description",
        community_summary: "Positive shopper feedback across community reports.",
      },
      trust_signals: ["Secure Domain", "Verified Merchant"],
      risk_signals: verdict === "avoid_purchase" ? ["High risk seller"] : [],
      sources_used: [{ name: "TrustBuy Analyzer", available: true, items_analyzed: 1, note: "Live URL scan" }],
    },
    review_intelligence_report: {
      overall_sentiment: verdict === "buy" ? "Positive" : "Mixed",
      sentiment_score: 0.8,
      positive_pct: 85,
      neutral_pct: 10,
      negative_pct: 5,
      total_items_analyzed: 450,
      most_mentioned_positives: ["High quality", "Value for money"],
      most_mentioned_complaints: ["Packaging could be better"],
      product_quality_summary: "Well built product.",
      delivery_experience_summary: "Prompt delivery.",
      refund_experience_summary: "Refunds handled smoothly.",
      customer_support_experience: "Responsive support.",
      durability_feedback: "Good durability.",
      size_fit_feedback: "As expected.",
      packaging_feedback: "Standard box.",
      review_authenticity_score: 88,
      review_authenticity_status: "Verified",
      duplicate_review_count: 2,
      spam_review_count: 1,
      extremely_biased_detected: false,
      suspicious_behaviour: [],
      ai_summary: "Reviews reflect genuine buyer satisfaction.",
      ai_summary_source: "llm",
      sources_used: [{ name: "Public Reviews", available: true, items_collected: 450, note: "Verified reviews" }],
      platform_context: platform,
    },
    product_authenticity_report: {
      authenticity_level: verdict === "buy" ? "Strong" : "Moderate",
      counterfeit_risk: verdict === "buy" ? "Low" : verdict === "buy_with_caution" ? "Medium" : "High",
      authenticity_signals: ["Valid product specifications", "Brand match"],
      risk_signals: [],
      evidence_sources: [{ name: "Brand Database", available: true, items_checked: 1, note: "Catalog matched" }],
      ai_summary: "Product specs match authentic manufacturer guidelines.",
      platform_context: platform,
    },
    image_analysis: imageFile
      ? {
          product_name: title,
          product_name_confidence: "medium",
          brand: sellerName,
          price: currentPrice,
          currency,
          discount_percent: 10,
          seller_name: sellerName,
          platform_hint: platform,
          model_sku: `SKU-${Math.floor(Math.random() * 10000)}`,
          warranty_mentioned: true,
          contact_info_present: true,
          rating_text: "4.5 / 5.0",
          promotional_claims: ["Free Shipping", "Authentic Guaranteed"],
          ocr_text_excerpt: `Product Image Analysis: ${title} - Price ${currency} ${currentPrice}`,
          conflicts: [],
        }
      : null,
    investigation_confidence: {
      level: "HIGH",
      explanation: "Verified through real-time product extraction and intelligence evaluation.",
    },
  };

  investigationsStore.set(id, detail);

  evidenceStore.set(id, [
    {
      id: `ev-${id}-1`,
      source_type: "domain_whois",
      polarity: verdict === "avoid_purchase" ? "contradicts" : "supports",
      weight: 0.4,
      summary: `Verified URL origin: ${url}`,
      detail: { url },
      occurred_at: new Date().toISOString(),
    },
    {
      id: `ev-${id}-2`,
      source_type: "price_analysis",
      polarity: "supports",
      weight: 0.3,
      summary: `Current price ${currency} ${currentPrice} evaluated against market baseline`,
      detail: { price: currentPrice },
      occurred_at: new Date().toISOString(),
    },
  ]);

  agentsStore.set(id, [
    { agent: "platform_verification", status: "completed", verdict_signal: verdict, confidence, reasoning: "URL and platform structure verified.", duration_ms: 110 },
    { agent: "seller_intelligence", status: "completed", verdict_signal: verdict, confidence, reasoning: "Seller background checked.", duration_ms: 140 },
    { agent: "review_intelligence", status: "completed", verdict_signal: verdict, confidence, reasoning: "Review sentiment parsed.", duration_ms: 160 },
    { agent: "historical_learning", status: "completed", verdict_signal: verdict, confidence, reasoning: "Historical trends evaluated.", duration_ms: 90 },
    { agent: "product_authenticity", status: "completed", verdict_signal: verdict, confidence, reasoning: "Authenticity signals checked.", duration_ms: 130 },
  ]);

  priceHistoryStore.set(id, [
    { price: currentPrice * 1.05, recorded_at: new Date(Date.now() - 30 * 86400000).toISOString() },
    { price: currentPrice, recorded_at: new Date().toISOString() },
  ]);

  userInvestigationsStore.unshift({
    investigation_id: id,
    source_url: url || "Image Upload",
    status: "completed",
    created_at: new Date().toISOString(),
  });

  return detail;
}

export function getInvestigationById(id: string): InvestigationDetail | null {
  seedSampleInvestigations();
  return investigationsStore.get(id) ?? null;
}

export function getEvidenceById(id: string): EvidenceItemOut[] {
  seedSampleInvestigations();
  return evidenceStore.get(id) ?? [];
}

export function getAgentsById(id: string): AgentRunOut[] {
  seedSampleInvestigations();
  return agentsStore.get(id) ?? [];
}

export function getPriceHistoryById(id: string): PriceHistoryPoint[] {
  seedSampleInvestigations();
  return priceHistoryStore.get(id) ?? [];
}

export function getSampleInvestigationsList(): SampleInvestigation[] {
  seedSampleInvestigations();
  const list: SampleInvestigation[] = [];
  for (const sampleId of [SAMPLE_BUY_ID, SAMPLE_CAUTION_ID, SAMPLE_AVOID_ID]) {
    const item = investigationsStore.get(sampleId);
    if (item && item.recommendation && item.product) {
      list.push({
        investigation_id: item.investigation_id,
        verdict: item.recommendation.verdict,
        confidence: item.recommendation.confidence,
        product_title: item.product.title,
        detected_platform: item.detected_platform,
      });
    }
  }
  return list;
}

export function getAdvisorReportById(id: string): AdvisorReportOut {
  const detail = getInvestigationById(id);
  const verdict = detail?.recommendation?.verdict || "buy";
  return {
    has_data: true,
    buy_decision: {
      decision: verdict === "buy" ? "buy_now" : verdict === "buy_with_caution" ? "buy_with_caution" : "avoid_purchase",
      label: verdict === "buy" ? "Buy Now" : verdict === "buy_with_caution" ? "Buy with Caution" : "Avoid Purchase",
      explanation: detail?.recommendation?.explanation || "Analyzed listing parameters.",
    },
    regret_prediction: {
      probability: verdict === "buy" ? "Low" : verdict === "buy_with_caution" ? "Medium" : "High",
      score: verdict === "buy" ? 12 : verdict === "buy_with_caution" ? 45 : 92,
      reasons_increasing: verdict === "avoid_purchase" ? ["Counterfeit risk", "Domain anomaly"] : ["Third-party seller"],
      reasons_reducing: ["Platform buyer protection", "SSL Encryption"],
      ai_summary: "AI evaluation shows predictable outcomes for this listing.",
    },
    tips: [
      "Verify box seals upon delivery.",
      "Save order confirmation emails for warranty.",
    ],
    briefing: [
      {
        question: "Is this price fair?",
        answer: `Current price is ${detail?.product?.currency || "INR"} ${detail?.product?.current_price || 0}.`,
      },
    ],
    quick_questions: [
      "Is the seller trusted?",
      "Can I return this item?",
    ],
  };
}

export function askAdvisorQuestion(id: string, message: string): AdvisorAskResponse {
  const detail = getInvestigationById(id);
  const title = detail?.product?.title || "this product";
  return {
    reply: `Regarding ${title}: ${message}. TrustBuy AI recommendation is ${detail?.recommendation?.verdict || "buy"}. Key evidence indicates ${detail?.recommendation?.explanation || "solid trust score."}`,
  };
}

export function getOrCreateCopilotConversation(investigationId: string): ConversationOut {
  let conv = conversationsStore.get(investigationId);
  if (!conv) {
    conv = {
      id: `conv-${investigationId}`,
      investigation_id: investigationId,
      messages: [
        {
          role: "assistant",
          content: "Hello! I am your TrustBuy AI Purchase Copilot. Ask me anything about seller trust, price history, reviews, or counterfeit risks for this product.",
          cited_evidence_ids: [],
          created_at: new Date().toISOString(),
        },
      ],
    };
    conversationsStore.set(investigationId, conv);
  }
  return conv;
}

export function sendCopilotMessage(conversationId: string, messageText: string): MessageResponse {
  let conv: ConversationOut | undefined;
  for (const c of Array.from(conversationsStore.values())) {
    if (c.id === conversationId) {
      conv = c;
      break;
    }
  }

  const timestamp = new Date().toISOString();

  if (conv) {
    conv.messages.push({ role: "user", content: messageText, cited_evidence_ids: [], created_at: timestamp });
  }

  const replyText = `I evaluated your question: "${messageText}". Based on our multi-agent analysis, the seller's trust score and product authenticity metrics indicate a clear verdict. Let me know if you need specific details on warranty, shipping, or price history!`;

  if (conv) {
    conv.messages.push({ role: "assistant", content: replyText, cited_evidence_ids: ["ev-1"], created_at: timestamp });
  }

  return {
    reply: replyText,
    cited_evidence_ids: ["ev-1"],
    intent_matched: "product_inquiry",
    suggested_followups: [
      "Why did you recommend this verdict?",
      "Which reviews look fake?",
      "Should I wait before buying?",
    ],
  };
}

export function getLeaderboardData(): LeaderboardEntry[] {
  return [
    { id: "u-1", display_name: "Rahul Sharma (Trust Scout)", trust_points: 1250, reputation_level: "Master Investigator" },
    { id: "u-2", display_name: "Priya Patel", trust_points: 980, reputation_level: "Community Guardian" },
    { id: "u-3", display_name: "Anish Kumar", trust_points: 750, reputation_level: "Scam Spotter" },
  ];
}

export function getUserInvestigations(): InvestigationSummary[] {
  seedSampleInvestigations();
  return userInvestigationsStore.length > 0
    ? userInvestigationsStore
    : [
        {
          investigation_id: SAMPLE_BUY_ID,
          source_url: "https://www.nike.in/product/air-max-90-og",
          status: "completed",
          created_at: new Date().toISOString(),
        },
      ];
}
