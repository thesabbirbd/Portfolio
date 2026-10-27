// Aiyaar Ltd — facts from the official "Aiyaar Complete Feature Guide" (October 2026, aiyaar.ltd).
// The owner is Aiyaar's Chief Project Manager (CPM); product copy below describes the product,
// not personal claims.

export const AIYAAR = {
  name: "Aiyaar",
  company: "Aiyaar Ltd",
  url: "https://aiyaar.ltd",
  docsUrl: "https://aiyaar.ltd/docs",
  role: "Chief Project Manager (CPM)",
  tagline: "One app to sell at the counter, sell online, keep your stock and khata, manage your team and see what you made.",
  summary:
    "Aiyaar is an all-in-one business management SaaS for shops and businesses in Bangladesh. It replaces the cash memo book, the stock register, the khata and a separate website with one connected system — a sale at the counter lowers stock, lands in the khata and shows in today's report at once.",
  platforms: "Runs in any browser on a computer, tablet or phone, plus the Aiyaar Android app.",
  highlights: [
    { value: "18", label: "feature areas" },
    { value: "22", label: "kinds of business" },
    { value: "~20 min", label: "sign-up to first sale" },
    { value: "Free", label: "trial, no card needed" },
  ],
};

export type AiyaarFeature = { id: string; title: string; desc: string; points: string[] };

export const AIYAAR_FEATURES: AiyaarFeature[] = [
  {
    id: "pos",
    title: "Point of sale (POS)",
    desc: "A fast counter screen for computers, tablets and phones.",
    points: ["Barcode scan or phone camera", "Cash, bKash, Nagad, card or split payments", "80/58 mm thermal receipts and cash drawer", "Hold sales, returns, staff PIN lock"],
  },
  {
    id: "store",
    title: "Online store",
    desc: "A phone-first store with the same products and stock as the shop.",
    points: ["Own address on aiyaar.ltd or a custom domain with HTTPS", "Themes and a home-page builder", "COD, bKash, SSLCommerz and Stripe checkout", "Delivery charges by area (Inside / Outside Dhaka)"],
  },
  {
    id: "inventory",
    title: "Inventory, batches & expiry",
    desc: "Stock that stays right in every shop.",
    points: ["Stock per shop with low-stock alerts", "Batches, expiry dates, first-expiry-first-out", "Serial and IMEI numbers", "Transfers, counts and full stock history"],
  },
  {
    id: "khata",
    title: "Digital khata & cash registers",
    desc: "The cash book fills itself from sales, purchases and expenses.",
    points: ["Daily cash book with balance carried forward", "Cash, bank, bKash and Nagad tracked separately", "Expenses with bill photos, monthly repeats, salaries", "Register open/close: counted vs expected"],
  },
  {
    id: "baki",
    title: "Customers, loyalty & baki",
    desc: "Collect what is owed without a notebook.",
    points: ["Customer pages with purchases and dues", "Loyalty points and member-group discounts", "Baki with “pay by” dates", "One-tap WhatsApp reminders and a 9 am collection list"],
  },
  {
    id: "orders",
    title: "Orders, returns & invoices",
    desc: "Every sale — counter and online — in one list.",
    points: ["Statuses from new to delivered with tracking", "Partial payments and due dates", "Returns, exchanges and cancellations back to stock", "Invoices as link or PDF with your design"],
  },
  {
    id: "purchases",
    title: "Purchases & suppliers",
    desc: "Buy, receive stock and track what you owe.",
    points: ["Supplier ledger at a glance", "Receive stock in full or in parts", "Supplier payments land in the khata", "Supplier returns update stock and dues together"],
  },
  {
    id: "reports",
    title: "Reports & profit",
    desc: "See how the business is doing, per shop or all shops.",
    points: ["Sales, best sellers, customers, payments", "Profit & loss from real cost prices", "Inventory value and tax report", "Daily closing reports by email"],
  },
  {
    id: "social",
    title: "Facebook, Instagram & AI replies",
    desc: "Every customer conversation in one inbox.",
    points: ["Messenger and Instagram in one inbox", "AI replies in Bangla, Banglish or English", "Hands over to a person when the AI can't help", "Comment replies, posts and Page insights"],
  },
  {
    id: "marketing",
    title: "Coupons, sales & banners",
    desc: "Offers that work the same at the counter and online.",
    points: ["Percentage or fixed coupons with limits", "Automatic sales and timed flash sales", "Store home-page banners"],
  },
  {
    id: "delivery",
    title: "Delivery & riders",
    desc: "Deliver online orders with your own riders.",
    points: ["Rider app and order hand-off", "Delivery tracking", "Cash-on-delivery collected per rider"],
  },
  {
    id: "team",
    title: "Staff, roles & security",
    desc: "Exactly the access each person needs.",
    points: ["Ready-made and custom roles", "Staff limited to their shops", "Email sign-in codes and device sessions", "Activity log: who changed what, when"],
  },
];

export const AIYAAR_BUSINESS_TYPES = [
  "Pharmacy", "Grocery", "Super Shop", "Clothing & Fashion", "Mobile Shop", "Computer Shop",
  "Restaurant & Cafe", "Bakery", "Books", "Stationery", "Hardware", "Sports", "Wholesale",
  "Turf & Sports Venue", "Homemade", "General Store",
];

export const AIYAAR_KEYWORDS = [
  "Aiyaar", "Aiyaar Ltd", "aiyaar.ltd", "POS software Bangladesh", "business management software Bangladesh",
  "digital khata app", "baki khata", "inventory management software", "online store builder Bangladesh",
  "pharmacy software Bangladesh", "grocery POS", "bKash Nagad POS", "Facebook Instagram AI reply",
  "SaaS Bangladesh", "Chief Project Manager",
];
