'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Code, Server, Network, Cpu, Navigation, FileDown, Wrench, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { sound } from '@/lib/sound';
import { Segmented } from '@/components/system/Controls';
import { CV_PDF, LINKEDIN_URL, HEADLINE, FOCUS_LINE, SUMMARY, WORK_EXPERIENCE, EDUCATION, TRAINING, LANGUAGES } from '@/data/experience';

type ResumeMode = 'visual' | 'professional';
type ViewRole = 'all' | 'engineering' | 'infrastructure';

export function ResumeInterface() {
  const [mode, setMode] = useState<ResumeMode>('visual');
  const [role, setRole] = useState<ViewRole>('all');

  const CAPABILITIES = [
    {
      group: "IT Support & Systems",
      icon: Wrench,
      roles: ['infrastructure'],
      skills: [
        { name: "Hardware & Software Troubleshooting", level: "Hands-on" },
        { name: "System Diagnostics, PC Setup & Maintenance", level: "Hands-on" },
        { name: "Ticket-based L1/L2 Support (Netfee ISP platform)", level: "Hands-on" }
      ],
      evidence: [
        { label: "Custom UPS & power hardware", link: "/projects/custom-ups" }
      ]
    },
    {
      group: "Backend Engineering",
      icon: Server,
      roles: ['engineering'],
      skills: [
        { name: "API Development (FastAPI, REST)", level: "Active Focus" },
        { name: "PostgreSQL & Redis", level: "Working Knowledge" },
        { name: "Node.js", level: "Familiarity" },
        { name: "Authentication & Security", level: "Working Knowledge" }
      ],
      evidence: [
        { label: "Omnidesk BD Project", link: "/projects/omnidesk" },
        { label: "StudyOS Architecture", link: "/projects/studyos" }
      ]
    },
    {
      group: "DevOps & Deployment",
      icon: Code,
      roles: ['engineering', 'infrastructure'],
      skills: [
        { name: "Containerization (Docker)", level: "Active Focus" },
        { name: "Linux Administration (Ubuntu, Debian)", level: "Hands-on" },
        { name: "Nginx reverse proxy & systemd services", level: "Hands-on" },
        { name: "Bash scripting", level: "Hands-on" }
      ],
      evidence: [
        { label: "Ubuntu Dev Environment", link: "/journal/ubuntu-dev-environment" }
      ]
    },
    {
      group: "Networking & Infrastructure",
      icon: Network,
      roles: ['infrastructure'],
      skills: [
        { name: "MikroTik Configuration", level: "Hands-on" },
        { name: "NOC Monitoring & Network Troubleshooting", level: "Hands-on" },
        { name: "Wireshark, ping, traceroute", level: "Hands-on" },
        { name: "DNS, DHCP & Routing", level: "Hands-on" }
      ],
      evidence: [
        { label: "OpenWrt NAS Experiment", link: "/notes/openwrt-nas" }
      ]
    },
    {
      group: "Local AI & Automation",
      icon: Cpu,
      roles: ['engineering'],
      skills: [
        { name: "Ollama & Local Inference", level: "Exploring" },
        { name: "Model Evaluation", level: "Exploring" },
        { name: "AI-assisted Development & Workflow Automation", level: "Learning" },
        { name: "RAG Concepts", level: "Learning" }
      ],
      evidence: [
        { label: "Qwen 0.5B Limitations Lab", link: "/engineering-lab/qwen-automation-limitations" },
        { label: "Changing AI Strategy", link: "/journal/changing-local-ai-strategy" }
      ]
    }
  ];

  const handlePrint = () => {
    setMode('professional');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const filteredCapabilities = CAPABILITIES.filter(c => role === 'all' || c.roles.includes(role));

  return (
    <div className={`w-full ${mode === 'professional' ? 'bg-white text-black min-h-screen pt-8 pb-24' : 'pt-6 md:pt-8 pb-16 md:pb-32'}`}>
      
      {/* Controls (Hidden in Print) */}
      <div className="print:hidden container mx-auto px-4 max-w-4xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="w-full sm:w-auto sm:min-w-[320px]">
          <Segmented<ViewRole>
            label="Filter capabilities by role"
            value={role}
            onChange={(r) => { sound.click(); setRole(r); }}
            options={[
              { value: 'all', label: 'All roles' },
              { value: 'engineering', label: 'Engineering' },
              { value: 'infrastructure', label: 'Infrastructure' },
            ]}
          />
        </div>
        <div className="flex flex-wrap w-full sm:w-auto items-center gap-2">
          <div className="w-full sm:w-[240px]">
            <Segmented<ResumeMode>
              label="Resume view"
              value={mode}
              onChange={(m) => { sound.click(); setMode(m); }}
              options={[
                { value: 'visual', label: 'Visual' },
                { value: 'professional', label: 'Professional' },
              ]}
            />
          </div>
          <a
            href={CV_PDF}
            download
            className="shrink-0 min-h-10 px-4 rounded-xl text-sm font-semibold border border-line text-ink hover:border-primary/50 hover:text-primary flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <FileDown aria-hidden="true" className="w-4 h-4" /> CV (PDF)
          </a>
          <button type="button" onClick={handlePrint} className="shrink-0 min-h-10 px-4 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:bg-primary/90 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <Printer aria-hidden="true" className="w-3 h-3" /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className={`container mx-auto px-4 ${mode === 'professional' ? 'max-w-3xl' : 'max-w-5xl'}`}>
        {/* Header */}
        <header className={`mb-12 ${mode === 'professional' ? 'border-b-2 border-black pb-8' : 'border-b border-border/50 pb-12'}`}>
          <h1 className={`font-black tracking-tight ${mode === 'professional' ? 'text-4xl text-black' : 'text-5xl text-foreground'}`}>Md Sabbirul Islam Khan</h1>
          <p className={`mt-2 ${mode === 'professional' ? 'text-lg text-gray-700' : 'text-xl text-primary font-mono'}`}>{HEADLINE}</p>
          <p className={`mt-1 text-sm ${mode === 'professional' ? 'text-gray-600' : 'text-muted-foreground'}`}>{FOCUS_LINE}</p>
          <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-sm ${mode === 'professional' ? 'text-gray-600' : 'text-muted-foreground'}`}>
            <span>Rajshahi, Bangladesh</span>
            <span>•</span>
            <a href="https://sabbir.nav.bd" className="inline-flex min-h-7 items-center hover:underline">sabbir.nav.bd</a>
            <span>•</span>
            <a href="https://github.com/thesabbirbd" className="inline-flex min-h-7 items-center hover:underline">github.com/thesabbirbd</a>
            <span>•</span>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-7 items-center hover:underline">linkedin.com/in/thesabbirbd</a>
          </div>
          <p className={`mt-5 max-w-3xl leading-relaxed ${mode === 'professional' ? 'text-sm text-gray-700' : 'text-muted-foreground'}`}>{SUMMARY}</p>
        </header>

        <div className={`grid gap-12 ${mode === 'visual' ? 'md:grid-cols-[1fr_300px]' : 'grid-cols-1'}`}>
          <div className="space-y-12">
            {/* Experience */}
            <section>
              <h2 className={`font-bold uppercase tracking-widest mb-6 ${mode === 'professional' ? 'text-xl text-black border-b border-gray-300 pb-2' : 'text-sm text-muted-foreground'}`}>Experience</h2>
              <div className="space-y-8">
                {WORK_EXPERIENCE.map((exp, i) => (
                  <div key={i} className={`relative ${mode === 'visual' ? 'pl-6 border-l-2 border-primary/20' : ''}`}>
                    {mode === 'visual' && <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />}
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h3 className={`font-bold ${mode === 'professional' ? 'text-lg text-black' : 'text-xl text-foreground'}`}>{exp.title}</h3>
                      <span className={`text-sm font-medium ${mode === 'professional' ? 'text-gray-600' : 'text-muted-foreground bg-muted px-2 py-1 rounded'}`}>{exp.date}</span>
                    </div>
                    <div className={`font-medium mb-3 ${mode === 'professional' ? 'text-gray-800' : 'text-primary'}`}>
                      {exp.url ? (
                        <a href={exp.url} {...(exp.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="inline-flex items-center gap-1 hover:underline underline-offset-4">
                          {exp.org}{exp.url.startsWith('http') && <ExternalLink aria-hidden="true" className="w-3 h-3" />}
                        </a>
                      ) : exp.org}
                    </div>
                    <ul className={`space-y-1.5 leading-relaxed list-disc pl-5 ${mode === 'professional' ? 'text-gray-700 text-sm' : 'text-muted-foreground'}`}>
                      {exp.points.map((pt) => <li key={pt}>{pt}</li>)}
                      {exp.detailsHref && (
                        <li className="list-none -ml-5 print:hidden">
                          <Link href={exp.detailsHref} className={`inline-flex min-h-7 items-center gap-1 font-semibold hover:underline underline-offset-4 ${mode === 'professional' ? 'text-blue-700' : 'text-primary'}`}>
                            Details: {exp.org} →
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Capabilities mapped to Evidence */}
            <section>
              <h2 className={`font-bold uppercase tracking-widest mb-6 ${mode === 'professional' ? 'text-xl text-black border-b border-gray-300 pb-2' : 'text-sm text-muted-foreground'}`}>Capabilities & Evidence</h2>
              <div className={`grid gap-6 ${mode === 'visual' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {filteredCapabilities.map((cap, i) => (
                  <div key={i} className={mode === 'visual' ? 'p-6 rounded-2xl bg-muted/20 border border-border/50' : 'mb-6'}>
                    <div className="flex items-center gap-3 mb-4">
                      {mode === 'visual' && <cap.icon className="w-5 h-5 text-primary" />}
                      <h3 className={`font-bold ${mode === 'professional' ? 'text-lg text-black' : 'text-lg text-foreground'}`}>{cap.group}</h3>
                    </div>
                    
                    <ul className={`space-y-2 mb-4 ${mode === 'professional' ? 'text-sm text-gray-700 list-disc list-inside' : 'text-sm text-muted-foreground'}`}>
                      {cap.skills.map((skill, j) => (
                        <li key={j} className="flex justify-between items-center">
                          <span className={mode === 'professional' ? '' : 'flex-1'}>{skill.name}</span>
                          {!mode.includes('professional') && <span className="text-[11px] uppercase tracking-wider bg-foreground/5 px-2 py-0.5 rounded text-foreground/70">{skill.level}</span>}
                        </li>
                      ))}
                    </ul>

                    {cap.evidence.length > 0 && (
                      <div className={`pt-3 ${mode === 'visual' ? 'border-t border-border/50' : 'mt-2 border-t border-gray-200'}`}>
                        <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${mode === 'professional' ? 'text-gray-500' : 'text-primary'}`}>Evidence</div>
                        <ul className="space-y-1">
                          {cap.evidence.map((ev, j) => (
                            <li key={j}>
                              <Link href={ev.link} className={`text-sm flex min-h-7 items-center gap-1.5 ${mode === 'professional' ? 'text-blue-700 hover:underline' : 'text-foreground hover:text-primary transition-colors'}`}>
                                {!mode.includes('professional') && <Navigation className="w-3 h-3 text-muted-foreground" />}
                                {ev.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-12">
            {/* Education */}
            <section>
              <h2 className={`font-bold uppercase tracking-widest mb-6 ${mode === 'professional' ? 'text-xl text-black border-b border-gray-300 pb-2' : 'text-sm text-muted-foreground'}`}>Education</h2>
              <div className="space-y-6">
                {EDUCATION.map((edu, i) => (
                  <div key={i}>
                    <h3 className={`font-bold ${mode === 'professional' ? 'text-base text-black' : 'text-lg text-foreground'}`}>{edu.degree}</h3>
                    <div className={`text-sm mb-2 ${mode === 'professional' ? 'text-gray-700' : 'text-primary'}`}>{edu.institution}</div>
                    <div className={`text-sm ${mode === 'professional' ? 'text-gray-600' : 'text-muted-foreground'}`}>{edu.date}</div>
                    <div className={`text-xs mt-1 ${mode === 'professional' ? 'text-gray-600' : 'text-muted-foreground'}`}>{edu.note}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={`font-bold uppercase tracking-widest mb-6 ${mode === 'professional' ? 'text-xl text-black border-b border-gray-300 pb-2' : 'text-sm text-muted-foreground'}`}>Training</h2>
              <ul className="space-y-4">
                {TRAINING.map((t) => (
                  <li key={t.name}>
                    <div className={`font-semibold text-sm ${mode === 'professional' ? 'text-black' : 'text-foreground'}`}>{t.name}</div>
                    <div className={`text-xs ${mode === 'professional' ? 'text-gray-600' : 'text-muted-foreground'}`}>{t.org} · {t.date}</div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className={`font-bold uppercase tracking-widest mb-6 ${mode === 'professional' ? 'text-xl text-black border-b border-gray-300 pb-2' : 'text-sm text-muted-foreground'}`}>Languages</h2>
              <ul className="space-y-2 text-sm">
                {LANGUAGES.map((l) => (
                  <li key={l.name} className="flex justify-between gap-3">
                    <span className={mode === 'professional' ? 'text-black' : 'text-foreground'}>{l.name}</span>
                    <span className={mode === 'professional' ? 'text-gray-600' : 'text-muted-foreground'}>{l.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
