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
    tagline: "Connecting Bangladesh to the global knowledge graph",
    stats: {
      status: "Top Contributor",
      recognition: "Direct Google Headquarters Recognition & Gift Recipient 🎁",
      badge: "Google Local Guide & 360° Street View",
    },
    narrative:
      "As an active Google Maps Local Guide and 360° Google Street View photographer, I contribute high-fidelity geospatial updates, spherical photography, and verified business landmarks that help millions navigate Bangladesh. This continuous contribution earned direct official recognition and gifts shipped from Google Headquarters.",
    profileUrl: "https://www.google.com/maps/contrib/115922089427483699024?utm_source=mstt_0",
    featuredLocationUrl: "https://maps.app.goo.gl/Z5PUEJ3n1B7CDHjv5",
    localGuidesBdUrl: "https://www.facebook.com/LocalGuidesBD",
    streetViewUrl: "https://www.facebook.com/Google-Street-View-103793739020433/",
    googleMapsUrl: "https://www.facebook.com/GoogleMaps",
  },

  activities: [
    {
      id: "rcpc",
      role: "IT Executive",
      organization: "Rajshahi College Presentation Club (RCPC)",
      category: "leadership",
      description: "Leading tech operations, multimedia broadcasts, digital presentation workflows, and technical logistics for collegiate events.",
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
      role: "Field Interviewer",
      organization: "EPI CES Coverage Evaluation Survey",
      category: "volunteering",
      description: "Conducting fieldwork interviews and healthcare data aggregation for the nationwide immunization coverage evaluation survey.",
      url: "https://www.facebook.com/EPI-CES-Coverage-Evaluation-Survey-212726835247809/",
      badge: "Field Researcher",
    },
    {
      id: "shunno-it",
      role: "Former NOC Support & MTCNA Intern",
      organization: "Shunno IT (শূন্য আইটি)",
      category: "technical",
      description: "Monitored live ISP network links, resolved packet latency issues, configured MikroTik routers, and maintained network uptime.",
      url: "https://www.facebook.com/ShunnoITBD",
      badge: "NOC Experience",
      highlight: true,
    },
    {
      id: "aditi",
      role: "Former Photographer, Videographer & Editor",
      organization: "Aditi (অদিতি)",
      category: "media",
      description: "Produced cinematic visuals, digital photography, and post-production video editing for events and commercial campaigns.",
      url: "https://www.facebook.com/aditi.aditibd",
      badge: "Multimedia Production",
    },
  ] as ActivityItem[],
};
