export interface ActivityItem {
  id: string;
  role: string;
  organization: string;
  category: "google-maps" | "leadership" | "volunteering" | "technical" | "media";
  period?: string;
  description: string;
  url?: string;
  highlight?: boolean;
  badge?: string;
}

export const COMMUNITY_DATA = {
  maps: {
    headline: "Maps, Places & Geospatial Exploration",
    tagline: "Mapping local places and 360° photography in Rajshahi",
    stats: {
      status: "Active contributor",
      recognition: "Received a gift from Google HQ as a Local Guide",
      badge: "Google Local Guide & 360° Street View",
    },
    narrative:
      "A Google Maps Local Guide since 2017 and a 360° Street View photographer, I add place updates, spherical photography and business listings that other people use to find their way around Rajshahi. The contributions were recognised with a gift sent from Google Headquarters.",
    profileUrl: "https://www.google.com/maps/contrib/115922089427483699024?utm_source=mstt_0",
    featuredLocationUrl: "https://maps.app.goo.gl/Z5PUEJ3n1B7CDHjv5",
    localGuidesBdUrl: "https://www.facebook.com/LocalGuidesBD",
    streetViewUrl: "https://www.facebook.com/Google-Street-View-103793739020433/",
    googleMapsUrl: "https://www.facebook.com/GoogleMaps",
  },

  activities: [
    {
      id: "rcpc",
      role: "IT Secretary",
      organization: "Rajshahi College Presentation Club (RCPC)",
      category: "leadership",
      description: "Managing technology setups, presentation systems and audio-visual equipment for club programmes and events.",
      url: "https://www.facebook.com/RCPC.RAJSHAHI",
      badge: "Campus Executive",
      highlight: true,
    },
    {
      id: "rcbc",
      role: "Official Member",
      organization: "Rajshahi College Business Club (RCBC)",
      category: "leadership",
      description: "Active contributor to business case competitions, corporate seminars, and operational strategy events.",
      url: "https://www.facebook.com/RCBC.Rc",
      badge: "Club Member",
    },
    {
      id: "vbd",
      role: "General Member",
      organization: "Volunteer for Bangladesh (VBD)",
      category: "volunteering",
      description: "Participating in grassroots youth empowerment, environmental stewardship, and community impact initiatives across the division.",
      url: "https://www.facebook.com/VolunteerforBangladesh",
      badge: "Youth Volunteer",
      highlight: true,
    },
    {
      id: "bffr",
      role: "Volunteer & Blood Donor",
      organization: "Blood Fighters Finder Rajshahi (BFFR)",
      category: "volunteering",
      description: "Supporting voluntary blood donation campaigns, emergency patient matching, and humanitarian healthcare support.",
      url: "https://www.facebook.com/bffr2021",
      badge: "Community Donor",
    },
    {
      id: "epi-ces",
      role: "CES Field Interviewer (EPI)",
      organization: "Center for Social and Market Research (CSMR)",
      category: "volunteering",
      description: "Dec 2023 – Feb 2025: immunization coverage evaluation surveys — collecting, digitising and analysing public-health data in the field.",
      url: "https://www.facebook.com/EPI-CES-Coverage-Evaluation-Survey-212726835247809/",
      badge: "Field Researcher",
    },
    {
      id: "shunno-it",
      role: "IT Support (Aug – Nov 2025)",
      organization: "Shunno IT (শূন্য আইটি)",
      category: "technical",
      description: "L1/L2 software support for the Netfee ISP billing platform, plus helping NOC staff with link-failure diagnostics and customer connection issues.",
      url: "https://www.facebook.com/ShunnoITBD",
      badge: "IT Support",
      highlight: true,
    },
    {
      id: "aditi",
      role: "Content Creator (Feb – May 2024)",
      organization: "Aditi (অদিতি)",
      category: "media",
      description: "Produced cinematic visuals, digital photography, and post-production video editing for events and commercial campaigns.",
      url: "https://www.facebook.com/aditi.aditibd",
      badge: "Multimedia Production",
    },
  ] as ActivityItem[],
};
