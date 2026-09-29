'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Code, Server, Network, Cpu, Navigation, FileDown } from 'lucide-react';
import Link from 'next/link';
import { sound } from '@/lib/sound';

type ResumeMode = 'visual' | 'professional';
type ViewRole = 'all' | 'engineering' | 'infrastructure';

export function ResumeInterface() {
  const [mode, setMode] = useState<ResumeMode>('visual');
  const [role, setRole] = useState<ViewRole>('all');

  const CAPABILITIES = [
    {
      group: "Backend Engineering",
      icon: Server,
      roles: ['engineering'],
      skills: [
        { name: "API Development (FastAPI, REST)", level: "Active Focus" },
        { name: "Database Architecture (PostgreSQL, Redis)", level: "Working Knowledge" },
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
        { name: "Web Servers (Nginx)", level: "Working Knowledge" }
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
        { name: "NOC & Monitoring", level: "Working Knowledge" },
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
        { name: "Workflow Automation", level: "Learning" }
      ],
      evidence: [
        { label: "Qwen 0.5B Limitations Lab", link: "/engineering-lab/qwen-automation-limitations" },
        { label: "Changing AI Strategy", link: "/journal/changing-local-ai-strategy" }
      ]
    }
  ];

  const EXPERIENCE = [
    {
      title: "Network Operations Center (NOC) Intern",
      company: "Shunno IT",
      date: "2022 - 2023",
      description: "Provided enterprise-level network monitoring and support for a massive user base. Configured MikroTik routers, handled DNS/DHCP administration, and diagnosed structural network issues."
    },
    {
      title: "Founder & Lead Developer",
      company: "Omnidesk BD",
      date: "2024 - Present",
      description: "Architected a scalable e-commerce and inventory management platform. Built the backend with FastAPI and PostgreSQL, and deployed containerized services."
    }
  ];

  const EDUCATION = [
    {
      degree: "BBA in Management",
      institution: "Rajshahi College, National University",
      date: "Ongoing",
      description: "Foundational studies in business economics, resource allocation, and organizational management."
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
    <div className={`w-full ${mode === 'professional' ? 'bg-white text-black min-h-screen pt-8 pb-24' : 'pt-16 md:pt-24 pb-16 md:pb-32'}`}>
      
      {/* Controls (Hidden in Print) */}
      <div className="print:hidden container mx-auto px-4 max-w-4xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { sound.click(); setRole('all'); }} className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors ${role === 'all' ? 'text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
    {role === 'all' && <motion.div layoutId="role-indicator" className="absolute inset-0 bg-primary rounded-full z-0" />}
    <span className="relative z-10">All Roles</span>
  </button>
          <button onClick={() => { sound.click(); setRole('engineering'); }} className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors ${role === 'engineering' ? 'text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
    {role === 'engineering' && <motion.div layoutId="role-indicator" className="absolute inset-0 bg-primary rounded-full z-0" />}
    <span className="relative z-10">Engineering</span>
  </button>
          <button onClick={() => { sound.click(); setRole('infrastructure'); }} className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors ${role === 'infrastructure' ? 'text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
    {role === 'infrastructure' && <motion.div layoutId="role-indicator" className="absolute inset-0 bg-primary rounded-full z-0" />}
    <span className="relative z-10">Infrastructure</span>
  </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { sound.click(); setMode('visual'); }} className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors ${mode === 'visual' ? 'text-background' : 'bg-muted text-muted-foreground'}`}>
    {mode === 'visual' && <motion.div layoutId="mode-indicator" className="absolute inset-0 bg-foreground rounded-full z-0" />}
    <span className="relative z-10">Visual Mode</span>
  </button>
          <button onClick={() => { sound.click(); setMode('professional'); }} className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors ${mode === 'professional' ? 'text-background' : 'bg-muted text-muted-foreground'}`}>
    {mode === 'professional' && <motion.div layoutId="mode-indicator" className="absolute inset-0 bg-foreground rounded-full z-0" />}
    <span className="relative z-10">Professional Mode</span>
  </button>
          <button onClick={handlePrint} className="px-4 py-2 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
            <Printer className="w-3 h-3" /> Print PDF
          </button>
        </div>
      </div>

      <div className={`container mx-auto px-4 ${mode === 'professional' ? 'max-w-3xl' : 'max-w-5xl'}`}>
        {/* Header */}
        <header className={`mb-12 ${mode === 'professional' ? 'border-b-2 border-black pb-8' : 'border-b border-border/50 pb-12'}`}>
          <h1 className={`font-black tracking-tight ${mode === 'professional' ? 'text-4xl text-black' : 'text-5xl text-foreground'}`}>Md Sabbirul Islam Khan</h1>
          <p className={`mt-2 ${mode === 'professional' ? 'text-lg text-gray-700' : 'text-xl text-primary font-mono'}`}>Backend, DevOps & Systems Engineering</p>
          <div className={`flex gap-4 mt-4 text-sm ${mode === 'professional' ? 'text-gray-600' : 'text-muted-foreground'}`}>
            <span>Rajshahi, Bangladesh</span>
            <span>•</span>
            <a href="https://sabbir.nav.bd" className="hover:underline">sabbir.nav.bd</a>
            <span>•</span>
            <a href="https://github.com/thesabbirbd" className="hover:underline">github.com/thesabbirbd</a>
          </div>
        </header>

        <div className={`grid gap-12 ${mode === 'visual' ? 'md:grid-cols-[1fr_300px]' : 'grid-cols-1'}`}>
          <div className="space-y-12">
            {/* Experience */}
            <section>
              <h2 className={`font-bold uppercase tracking-widest mb-6 ${mode === 'professional' ? 'text-xl text-black border-b border-gray-300 pb-2' : 'text-sm text-muted-foreground'}`}>Experience</h2>
              <div className="space-y-8">
                {EXPERIENCE.map((exp, i) => (
                  <div key={i} className={`relative ${mode === 'visual' ? 'pl-6 border-l-2 border-primary/20' : ''}`}>
                    {mode === 'visual' && <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold ${mode === 'professional' ? 'text-lg text-black' : 'text-xl text-foreground'}`}>{exp.title}</h3>
                      <span className={`text-sm font-medium ${mode === 'professional' ? 'text-gray-600' : 'text-muted-foreground bg-muted px-2 py-1 rounded'}`}>{exp.date}</span>
                    </div>
                    <div className={`font-medium mb-3 ${mode === 'professional' ? 'text-gray-800' : 'text-primary'}`}>{exp.company}</div>
                    <p className={`leading-relaxed ${mode === 'professional' ? 'text-gray-700 text-sm' : 'text-muted-foreground'}`}>{exp.description}</p>
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
                          {!mode.includes('professional') && <span className="text-[10px] uppercase tracking-wider bg-foreground/5 px-2 py-0.5 rounded text-foreground/70">{skill.level}</span>}
                        </li>
                      ))}
                    </ul>

                    {cap.evidence.length > 0 && (
                      <div className={`pt-3 ${mode === 'visual' ? 'border-t border-border/50' : 'mt-2 border-t border-gray-200'}`}>
                        <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${mode === 'professional' ? 'text-gray-500' : 'text-primary'}`}>Evidence</div>
                        <ul className="space-y-1">
                          {cap.evidence.map((ev, j) => (
                            <li key={j}>
                              <Link href={ev.link} className={`text-sm flex items-center gap-1.5 ${mode === 'professional' ? 'text-blue-700 hover:underline' : 'text-foreground hover:text-primary transition-colors'}`}>
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
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
