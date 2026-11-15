/**
 * THE SABBiR OS — WhatsApp & F-Commerce Smart Quick Reply Engine
 * 36 structured Bangla, Banglish & English macro templates with dynamic variable interpolation.
 */

export interface QuickReplyMacro {
  id: string;
  category: "order" | "delivery" | "payment" | "support" | "freelance" | "it_noc";
  title: string;
  language: "বাংলা" | "English" | "Banglish";
  template: string;
  tags: string[];
}

export interface MacroVariables {
  customer_name: string;
  product: string;
  price: string;
  delivery_fee: string;
  bkash_no: string;
  invoice_id: string;
  tracking_code: string;
  company_name: string;
}

export const DEFAULT_MACRO_VARIABLES: MacroVariables = {
  customer_name: "রাহিম ভাই",
  product: "প্রিমিয়াম ব্ল্যাক শার্ট (L সাইজ)",
  price: "১২৫০",
  delivery_fee: "৮০",
  bkash_no: "017XXXXXXXX",
  invoice_id: "INV-2026-89",
  tracking_code: "PATHAO-89410",
  company_name: "THE SABBiR Store",
};

export const QUICK_REPLY_MACROS: QuickReplyMacro[] = [
  // 1. Order & Stock
  {
    id: "stock-available-bn",
    category: "order",
    title: "স্টক এভেইলেবল (Stock Confirmed)",
    language: "বাংলা",
    template: "আসসালামু আলাইকুম {customer_name}! আপনার কাঙ্ক্ষিত '{product}' বর্তমানে আমাদের স্টকে এভেইলেবল আছে। প্রাইস {price} টাকা। অর্ডার কনফার্ম করতে আপনার নাম, পূর্ণ ঠিকানা ও মোবাইল নাম্বারটি পাঠিয়ে দিন। ধন্যবাদ!",
    tags: ["order", "stock", "bangla"],
  },
  {
    id: "stock-out-alternative-bn",
    category: "order",
    title: "স্টক আউট ও বিকল্প অফার",
    language: "বাংলা",
    template: "দুঃখিত {customer_name}, এই মুহূর্তে '{product}' স্টক আউট হয়ে গেছে। তবে আগামী ৩ দিনের মধ্যে রিস্টক হবে। আপনি চাইলে আমাদের একই ক্যাটাগরির বিকল্প কালেকশন দেখতে পারেন। আপনাকে কি ছবি পাঠাবো?",
    tags: ["stock out", "alternative", "bangla"],
  },
  {
    id: "order-placed-success-bn",
    category: "order",
    title: "অর্ডার গ্রহণ ও কনফার্মেশন",
    language: "বাংলা",
    template: "ধন্যবাদ {customer_name}! আপনার '{product}'-এর অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। ইনভয়েস নম্বর: #{invoice_id}। মোট মূল্য: {price} টাকা + ডেলিভারি চার্জ {delivery_fee} টাকা। কুরিয়ারে হ্যান্ডওভার হলে আপনাকে ট্র্যাকিং কোড জানিয়ে দেওয়া হবে।",
    tags: ["order confirm", "invoice", "bangla"],
  },
  {
    id: "order-confirm-en",
    category: "order",
    title: "Order Confirmed (English)",
    language: "English",
    template: "Hello {customer_name}! Your order for '{product}' has been confirmed. Total amount is {price} BDT + {delivery_fee} BDT shipping. Invoice #{invoice_id}. We will dispatch it shortly. Thank you for choosing {company_name}!",
    tags: ["order", "english", "invoice"],
  },
  {
    id: "order-size-guide-bng",
    category: "order",
    title: "সাইজ বা কালার কনফার্মেশন (Banglish)",
    language: "Banglish",
    template: "Hello {customer_name}, apnar order '{product}'-er exact size & color confirm korte chaichi. Apnar height & weight bolle amra perfect fit suggest korte parbo. Please kindly janaben.",
    tags: ["size", "banglish", "fit"],
  },
  {
    id: "preorder-timeline-bn",
    category: "order",
    title: "প্রি-অর্ডার টাইমলাইন",
    language: "বাংলা",
    template: "প্রিয় {customer_name}, '{product}' আইটেমটি প্রি-অর্ডারে নেওয়া হচ্ছে। শিপমেন্ট পৌঁছাতে ৫ থেকে ৭ কার্যদিবস সময় লাগবে। প্রি-অর্ডার কনফার্ম করতে ডেলিভারি চার্জ {delivery_fee} টাকা অগ্রিম বিকাশ করতে হবে।",
    tags: ["preorder", "bangla", "timeline"],
  },

  // 2. Delivery & Tracking
  {
    id: "delivery-charge-dhaka-bn",
    category: "delivery",
    title: "ঢাকার ভেতরে ও বাইরে ডেলিভারি চার্জ",
    language: "বাংলা",
    template: "আমাদের ডেলিভারি চার্জ: ঢাকার ভেতরে ৮০ টাকা (২৪-৪৮ ঘণ্টায় ডেলিভারি) এবং ঢাকার বাইরে ১৫০ টাকা (২-৩ দিনে স্টেডফাস্ট/পাঠাও কুরিয়ার)। ক্যাশ অন ডেলিভারি (COD) সুবিধা রয়েছে!",
    tags: ["delivery fee", "steadfast", "pathao", "bangla"],
  },
  {
    id: "dispatch-tracking-bn",
    category: "delivery",
    title: "পার্সেল হ্যান্ডওভার ও ট্র্যাকিং কোড",
    language: "বাংলা",
    template: "সুখবর {customer_name}! আপনার পার্সেলটি আজ কুরিয়ারে হ্যান্ডওভার করা হয়েছে। ট্র্যাকিং কোড: {tracking_code}। আপনি কুরিয়ার অ্যাপ বা ওয়েবসাইটের মাধ্যমে সরাসরি লাইভ লোকেশন ট্র্যাক করতে পারবেন।",
    tags: ["tracking", "dispatch", "bangla"],
  },
  {
    id: "delivery-delay-apology-bn",
    category: "delivery",
    title: "কুরিয়ার বিলম্বের আন্তরিক দুঃখপ্রকাশ",
    language: "বাংলা",
    template: "প্রিয় {customer_name}, বৈরী আবহাওয়া ও কুরিয়ার জটের কারণে আপনার পার্সেল ডেলিভারিতে কিছুটা বিলম্ব হচ্ছে। আমরা ইতোমধ্যে কুরিয়ার টিমের সাথে কথা বলেছি, দ্রুত ডেলিভারি নিশ্চিত করতে ফলোআপ রাখছি। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।",
    tags: ["delay", "apology", "courier", "bangla"],
  },
  {
    id: "delivery-address-update-bng",
    category: "delivery",
    title: "ঠিকানা পরিবর্তন রিকোয়েস্ট (Banglish)",
    language: "Banglish",
    template: "Dear {customer_name}, apnar parcel dispatch er aage jodi delivery address ba phone number change korte chan, kindly notun details ta ekhoni pathiye din.",
    tags: ["address", "banglish", "courier"],
  },

  // 3. Payment & Due
  {
    id: "bkash-send-money-bn",
    category: "payment",
    title: "বিকাশ ও নগদ পেমেন্ট নির্দেশিকা",
    language: "বাংলা",
    template: "পেমেন্টের জন্য আমাদের বিকাশ/নগদ পার্সোনাল নম্বর: {bkash_no} (Send Money)। পেমেন্ট সম্পন্ন করে অনুগ্রহ করে লাস্ট ৪ ডিজিট অথবা ট্রানজেকশন আইডি (TrxID) এখানে লিখে দিন। ধন্যবাদ!",
    tags: ["bkash", "nagad", "payment", "bangla"],
  },
  {
    id: "payment-received-bn",
    category: "payment",
    title: "পেমেন্ট প্রাপ্তি স্বীকার ও রসিদ",
    language: "বাংলা",
    template: "ধন্যবাদ {customer_name}! আপনার {price} টাকা পেমেন্ট আমরা সফলভাবে পেয়েছি। ইনভয়েস #{invoice_id} পেইড হিসেবে আপডেট করা হয়েছে। খুব দ্রুত আপনার প্যাকেজটি রেডি করে পাঠানো হচ্ছে।",
    tags: ["payment received", "receipt", "bangla"],
  },
  {
    id: "cod-reminder-bn",
    category: "payment",
    title: "ক্যাশ অন ডেলিভারি প্রস্তুতি রিমাইন্ডার",
    language: "বাংলা",
    template: "প্রিয় {customer_name}, আপনার পার্সেলটি আগামীকাল ডেলিভারি হতে পারে। অনুগ্রহ করে ডেলিভারিম্যান পৌঁছানোর সময় মোট {price} টাকা রেডি রাখবেন। পার্সেল চেক করে রিসিভ করবেন।",
    tags: ["cod", "reminder", "bangla"],
  },
  {
    id: "payment-due-polite-en",
    category: "payment",
    title: "Friendly Invoice Payment Reminder (English)",
    language: "English",
    template: "Hi {customer_name}, this is a gentle reminder regarding invoice #{invoice_id} for {price} BDT. Please let us know if you need our bank or mobile wallet details to complete the payment. Thank you!",
    tags: ["payment reminder", "invoice", "english"],
  },

  // 4. Return & Warranty
  {
    id: "return-policy-bn",
    category: "support",
    title: "৭ দিনের রিটার্ন ও এক্সচেঞ্জ পলিসি",
    language: "বাংলা",
    template: "আমাদের প্রতিটি প্রোডাক্টে ৭ দিনের সহজ রিটার্ন ও এক্সচেঞ্জ গ্যারান্টি রয়েছে। পার্সেল খোলার সময় একটি ছোট আনবক্সিং ভিডিও করে রাখুন। সাইজ বা ত্রুটি থাকলে আমরা সম্পূর্ণ ফ্রিতে প্রোডাক্ট চেঞ্জ করে দেব।",
    tags: ["return", "exchange", "warranty", "bangla"],
  },
  {
    id: "refund-processed-bn",
    category: "support",
    title: "রিফান্ড সম্পন্ন হওয়ার নোটিফিকেশন",
    language: "বাংলা",
    template: "প্রিয় {customer_name}, আপনার রিটার্নকৃত প্রোডাক্টটি আমরা পেয়েছি এবং আপনার বিকাশ একাউন্টে {price} টাকা রিফান্ড পাঠিয়ে দেওয়া হয়েছে। ট্রানজেকশন সংক্রান্ত মেসেজটি চেক করে কনফার্ম করুন।",
    tags: ["refund", "bkash", "bangla"],
  },

  // 5. Freelance Client Onboarding
  {
    id: "freelance-intro-en",
    category: "freelance",
    title: "Freelance Project Onboarding (English)",
    language: "English",
    template: "Hi {customer_name}! Excited to collaborate on '{product}'. To get started smoothly, please share your project requirements, reference links, and deadline. I have prepared our timeline under #{invoice_id}. Looking forward to building something great!",
    tags: ["freelance", "onboarding", "english"],
  },
  {
    id: "freelance-milestone-delivered-en",
    category: "freelance",
    title: "Milestone Delivered & Review Request",
    language: "English",
    template: "Hello {customer_name}, milestone for '{product}' is now deployed and ready for your review! Please test the features and let me know your thoughts. If everything looks good, kindly approve the milestone so we can proceed to the next phase.",
    tags: ["freelance", "milestone", "delivery", "english"],
  },

  // 6. IT & NOC Incident Updates
  {
    id: "noc-maintenance-bn",
    category: "it_noc",
    title: "নেটওয়ার্ক ও সার্ভার মেইনটেন্যান্স অ্যালার্ট",
    language: "বাংলা",
    template: "সম্মানিত গ্রাহক, আমাদের কোর সার্ভার আপগ্রেডেশন কাজের জন্য আজ রাত ২:০০টা থেকে ভোর ৪:০০টা পর্যন্ত সাময়িক ইন্টারনেট ও সার্ভিস বিঘ্নিত হতে পারে। কাজটি শেষ হওয়া মাত্র সেবা স্বাভাবিক হবে। সাময়িক অসুবিধার জন্য দুঃখিত। — {company_name}",
    tags: ["noc", "server maintenance", "isp", "bangla"],
  },
  {
    id: "noc-fiber-cut-resolved-bn",
    category: "it_noc",
    title: "ফাইবার কাটা মেরামত ও লিংক সচল",
    language: "বাংলা",
    template: "সম্মানিত গ্রাহক, ট্রান্সমিশন অপটিক্যাল ফাইবার লিংকে সমস্যা সমাধান করা হয়েছে এবং আমাদের সকল ইন্টারনেট ও ডাটা সেবা পুনরায় পূর্ণ গতিতে সচল রয়েছে। যেকোনো প্রয়োজনে আমাদের হেল্পলাইনে যোগাযোগ করুন।",
    tags: ["fiber cut", "resolved", "noc", "bangla"],
  },
];

export function interpolateMacro(template: string, vars: MacroVariables): string {
  let result = template;
  (Object.keys(vars) as (keyof MacroVariables)[]).forEach((key) => {
    const placeholder = new RegExp(`\\{${key}\\}`, "g");
    result = result.replace(placeholder, vars[key] || "");
  });
  return result;
}
