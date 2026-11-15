"use client";

import React, { useState, useMemo } from "react";
import { StudioWorkspaceShell } from "@/components/tools/StudioWorkspaceShell";
import {
  UNICODE_STYLES,
  BULLET_DECORATORS,
  transformUnicodeText,
  decorateList,
  generateSeoTags,
  buildUtmUrl,
  type UnicodeStyleKey,
} from "@/lib/social/unicode-text-styler";
import {
  Type,
  List,
  Tag,
  Link2,
  Copy,
  Check,
  Share2,
  Sparkles,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
  Globe,
  Trash2,
} from "lucide-react";
import { FacebookIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { useGatedExport } from "@/hooks/useGatedExport";

type ActiveTab = "styles" | "bullets" | "tags" | "utm";

export function SocialTextStylerStudio() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("styles");
  const [inputText, setInputText] = useState("Build Once, Run Everywhere with Autonomous AI Agents!");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Bullets state
  const [bulletText, setBulletText] = useState(
    "Zero cloud server dependency\nDeterministic client-side cryptography\nNative Bangla language typography\nFull responsive design on all devices"
  );
  const [selectedBullet, setSelectedBullet] = useState("✦ ");

  // Tags state
  const [tagInput, setTagInput] = useState(
    "nextjs, react, typescript, autonomous agents, bangladesh tech, web development, open source, productivity"
  );

  // UTM state
  const [utmUrl, setUtmUrl] = useState("https://sabbir.nav.bd/tools");
  const [utmSource, setUtmSource] = useState("linkedin");
  const [utmMedium, setUtmMedium] = useState("post");
  const [utmCampaign, setUtmCampaign] = useState("os_super_tools");
  const [utmContent, setUtmContent] = useState("social_styler");

  // Feed preview state
  const [previewPlatform, setPreviewPlatform] = useState<"facebook" | "linkedin">("linkedin");
  const [selectedStyle, setSelectedStyle] = useState<UnicodeStyleKey>("sans-bold");

  const { triggerExport } = useGatedExport();

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // fallback
    }
  };

  const styledResults = useMemo(() => {
    return UNICODE_STYLES.map((style) => ({
      ...style,
      output: transformUnicodeText(inputText, style.key),
    }));
  }, [inputText]);

  const decoratedBulletOutput = useMemo(() => {
    return decorateList(bulletText, selectedBullet);
  }, [bulletText, selectedBullet]);

  const tagResults = useMemo(() => {
    return generateSeoTags(tagInput);
  }, [tagInput]);

  const finalUtmUrl = useMemo(() => {
    return buildUtmUrl({
      baseUrl: utmUrl,
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
      content: utmContent,
    });
  }, [utmUrl, utmSource, utmMedium, utmCampaign, utmContent]);

  const previewContent = useMemo(() => {
    const header = transformUnicodeText(inputText, selectedStyle);
    return `${header}\n\n${decoratedBulletOutput}\n\nCheck out: ${finalUtmUrl}`;
  }, [inputText, selectedStyle, decoratedBulletOutput, finalUtmUrl]);

  return (
    <StudioWorkspaceShell
      title="Unicode Text Styler & Social Growth Engine"
      badge="Studio #44"
      category="Design & Content"
      description="Transform regular text into 8 bold/italic/monospace Unicode styles for Facebook & LinkedIn, generate bullet lists, YouTube/Reel SEO tags (≤500 chars), and UTM links."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Navigation Tabs */}
          <div className="flex border-b border-border/50 bg-card/40 p-1.5 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab("styles")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "styles"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Unicode Fonts</span>
            </button>

            <button
              onClick={() => setActiveTab("bullets")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "bullets"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <List className="w-4 h-4" />
              <span>Viral Bullets</span>
            </button>

            <button
              onClick={() => setActiveTab("tags")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "tags"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>SEO Tags</span>
            </button>

            <button
              onClick={() => setActiveTab("utm")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "utm"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>UTM Link</span>
            </button>
          </div>

          {/* TAB 1: Unicode Styles */}
          {activeTab === "styles" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-card/50 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Enter Text to Convert (English & Numbers)
                  </label>
                  {inputText && (
                    <button
                      onClick={() => setInputText("")}
                      className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear
                    </button>
                  )}
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type anything to format for Facebook/LinkedIn/Twitter..."
                  rows={2}
                  className="w-full p-3 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none resize-none font-medium"
                />
              </div>

              {/* Styles Output Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {styledResults.map((style) => (
                  <div
                    key={style.key}
                    onClick={() => setSelectedStyle(style.key)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative group ${
                      selectedStyle === style.key
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border/60 bg-card/60 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {style.label}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(style.output, style.key);
                        }}
                        className="px-2 py-1 rounded bg-muted/70 hover:bg-primary hover:text-primary-foreground text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        {copiedKey === style.key ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-base font-medium break-words select-all text-foreground">
                      {style.output || <span className="text-muted-foreground/50 italic">Empty output</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Bullets */}
          {activeTab === "bullets" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-card/50 space-y-3">
                <label className="text-sm font-semibold">Choose Viral Bullet Icon</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {BULLET_DECORATORS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBullet(b.icon)}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        selectedBullet === b.icon
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                          : "border-border hover:bg-muted"
                      }`}
                      title={b.name}
                    >
                      <span className="text-lg">{b.icon.trim()}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Your Bullet Points (1 point per line)
                  </label>
                  <textarea
                    value={bulletText}
                    onChange={(e) => setBulletText(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none font-mono"
                  />
                </div>
              </div>

              {/* Result Preview */}
              <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Formatted Social Bullet List
                  </span>
                  <button
                    onClick={() => copyToClipboard(decoratedBulletOutput, "bullets")}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 shadow"
                  >
                    {copiedKey === "bullets" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" /> Copied List!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Bullet List
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-muted/40 rounded-lg text-sm font-sans whitespace-pre-wrap select-all">
                  {decoratedBulletOutput}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Tags Generator */}
          {activeTab === "tags" && (
            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Input Keywords / Hashtags / Phrases
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Paste topics separated by commas, hashtags, or newlines. We format and enforce YouTube & Reels ≤500 character limit.
                </p>
                <textarea
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none resize-none font-mono"
                />
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      SEO Tags ({tagResults.tagCount} tags)
                    </span>
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                        tagResults.charCount > 450
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      {tagResults.charCount} / 500 chars
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(tagResults.tagsString, "tags")}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 shadow"
                  >
                    {copiedKey === "tags" ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Tags
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg text-xs font-mono leading-relaxed select-all">
                  {tagResults.tagsString || <span className="text-muted-foreground">No tags generated</span>}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UTM Link Builder */}
          {activeTab === "utm" && (
            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={utmUrl}
                    onChange={(e) => setUtmUrl(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Campaign Source (e.g. linkedin, facebook, youtube)
                  </label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="w-full p-2 rounded-lg bg-background border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Campaign Medium (e.g. post, bio, reel, email)
                  </label>
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="w-full p-2 rounded-lg bg-background border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Campaign Name (utm_campaign)
                  </label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="w-full p-2 rounded-lg bg-background border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Campaign Content (optional)
                  </label>
                  <input
                    type="text"
                    value={utmContent}
                    onChange={(e) => setUtmContent(e.target.value)}
                    className="w-full p-2 rounded-lg bg-background border border-border text-sm"
                  />
                </div>
              </div>

              {/* Output URL */}
              <div className="p-3.5 bg-card rounded-xl border border-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Generated Clean Tracking URL
                  </span>
                  <button
                    onClick={() => copyToClipboard(finalUtmUrl, "utm")}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 shadow"
                  >
                    {copiedKey === "utm" ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy UTM Link
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 bg-muted/40 rounded-lg text-xs font-mono break-all select-all">
                  {finalUtmUrl}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Social Post Mockup */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center p-2 rounded-xl bg-card border border-border">
            <span className="text-xs font-semibold uppercase text-muted-foreground pl-2">
              Feed Preview
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPreviewPlatform("linkedin")}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 font-medium transition-all ${
                  previewPlatform === "linkedin"
                    ? "bg-[#0A66C2] text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
              </button>
              <button
                onClick={() => setPreviewPlatform("facebook")}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 font-medium transition-all ${
                  previewPlatform === "facebook"
                    ? "bg-[#1877F2] text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <FacebookIcon className="w-3.5 h-3.5" /> Facebook
              </button>
            </div>
          </div>

          {/* Social Post Mockup Card */}
          <div className="rounded-2xl border border-border bg-card shadow-sm p-4 space-y-3">
            {/* Author Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                TS
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-foreground">THE SABBiR</h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-medium">
                    {previewPlatform === "linkedin" ? "• 1st" : "Follow"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  Chief Product Manager (CPM) at Aiyaar • 12m • <Globe className="w-2.5 h-2.5" />
                </p>
              </div>
            </div>

            {/* Post Content */}
            <div className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed select-all border-y border-border/40 py-3">
              {previewContent}
            </div>

            {/* Social Action Bar */}
            {previewPlatform === "linkedin" ? (
              <div className="flex justify-between items-center text-xs text-muted-foreground pt-1 font-medium">
                <button className="flex items-center gap-1 hover:text-foreground">
                  <ThumbsUp className="w-4 h-4" /> Like
                </button>
                <button className="flex items-center gap-1 hover:text-foreground">
                  <MessageCircle className="w-4 h-4" /> Comment
                </button>
                <button className="flex items-center gap-1 hover:text-foreground">
                  <Repeat2 className="w-4 h-4" /> Repost
                </button>
                <button className="flex items-center gap-1 hover:text-foreground">
                  <Send className="w-4 h-4" /> Send
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center text-xs text-muted-foreground pt-1 font-medium">
                <button className="flex items-center gap-1 hover:text-[#1877F2]">
                  <ThumbsUp className="w-4 h-4" /> Like
                </button>
                <button className="flex items-center gap-1 hover:text-foreground">
                  <MessageCircle className="w-4 h-4" /> Comment
                </button>
                <button className="flex items-center gap-1 hover:text-foreground">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            )}
          </div>

          {/* Quick Copy Full Post */}
          <button
            onClick={() => copyToClipboard(previewContent, "full-post")}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity"
          >
            {copiedKey === "full-post" ? (
              <>
                <Check className="w-4 h-4" /> Copied Full Post!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Complete Formatted Post
              </>
            )}
          </button>
        </div>
      </div>
    </StudioWorkspaceShell>
  );
}
