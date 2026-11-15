#!/usr/bin/env python3
"""
Bilingualize BSc and Diploma Course Titles in cgpa-grade-engine.ts
Adds Bengali subject & book titles alongside the English ones.
"""

import re

ENGINE_FILE = "src/lib/education/cgpa-grade-engine.ts"

with open(ENGINE_FILE, "r", encoding="utf-8") as f:
    text = f.read()

REPLACEMENTS = [
    # BSc CSE
    ('name: "Structured Programming Language (C)"', 'name: "Structured Programming Language (C) / স্ট্রাকচার্ড সি প্রোগ্রামিং"'),
    ('name: "Structured Programming Lab"', 'name: "Structured Programming Lab / সি প্রোগ্রামিং ব্যবহারিক ল্যাব"'),
    ('name: "Technical English & Communication"', 'name: "Technical English & Communication / টেকনিক্যাল ইংরেজি ও যোগাযোগ"'),
    ('name: "Differential & Integral Calculus"', 'name: "Differential & Integral Calculus / ডিফারেন্সিয়াল ও ইন্টিগ্রাল ক্যালকুলাস"'),
    ('name: "Engineering Physics (Optics & Waves)"', 'name: "Engineering Physics (Optics & Waves) / প্রকৌশল পদার্থবিজ্ঞান (আলোক ও তরঙ্গ)"'),
    ('name: "Physics Laboratory"', 'name: "Physics Laboratory / পদার্থবিজ্ঞান ব্যবহারিক ল্যাব"'),
    ('name: "Discrete Mathematics"', 'name: "Discrete Mathematics / ডিসক্রিট গণিত"'),
    ('name: "Object Oriented Programming (C++/Java)"', 'name: "Object Oriented Programming (C++/Java) / অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং"'),
    ('name: "Object Oriented Programming Lab"', 'name: "Object Oriented Programming Lab / ওওপি ব্যবহারিক ল্যাব"'),
    ('name: "Coordinate Geometry & Linear Algebra"', 'name: "Coordinate Geometry & Linear Algebra / স্থানাঙ্ক জ্যামিতি ও রৈখিক বীজগণিত"'),
    ('name: "Basic Electrical & Circuit Analysis"', 'name: "Basic Electrical & Circuit Analysis / মৌলিক তড়িৎ ও সার্কিট বিশ্লেষণ"'),
    ('name: "Basic Electrical Circuit Lab"', 'name: "Basic Electrical Circuit Lab / সার্কিট ব্যবহারিক ল্যাব"'),
    ('name: "Data Structures & Algorithms"', 'name: "Data Structures & Algorithms / ডেটা স্ট্রাকচার ও অ্যালগরিদম"'),
    ('name: "Data Structures & Algorithms Lab"', 'name: "Data Structures & Algorithms Lab / ডেটা স্ট্রাকচার ও অ্যালগরিদম ল্যাব"'),
    ('name: "Digital Logic Design"', 'name: "Digital Logic Design / ডিজিটাল লজিক ডিজাইন"'),
    ('name: "Digital Logic Design Lab"', 'name: "Digital Logic Design Lab / ডিজিটাল লজিক ডিজাইন ল্যাব"'),
    ('name: "Ordinary & Partial Differential Equations"', 'name: "Ordinary & Partial Differential Equations / ব্যবকলনীয় সমীকরণ"'),
    ('name: "Statistics & Probability for Engineers"', 'name: "Statistics & Probability for Engineers / প্রকৌশল পরিসংখ্যান ও সম্ভাবনা"'),
    ('name: "Design & Analysis of Algorithms"', 'name: "Design & Analysis of Algorithms / অ্যালগরিদম ডিজাইন ও বিশ্লেষণ"'),
    ('name: "Algorithms Design Lab"', 'name: "Algorithms Design Lab / অ্যালগরিদম ল্যাব"'),
    ('name: "Computer Architecture & Organization"', 'name: "Computer Architecture & Organization / কম্পিউটার আর্কিটেকচার ও সংগঠন"'),
    ('name: "Database Management Systems"', 'name: "Database Management Systems / ডেটাবেস ম্যানেজমেন্ট সিস্টেম"'),
    ('name: "Database Systems Lab"', 'name: "Database Systems Lab / ডেটাবেস সিস্টেম ল্যাব"'),
    ('name: "Principles of Accounting & Economics"', 'name: "Principles of Accounting & Economics / হিসাববিজ্ঞান ও অর্থনীতি"'),
    ('name: "Operating Systems & System Programming"', 'name: "Operating Systems & System Programming / অপারেটিং সিস্টেম ও সিস্টেম প্রোগ্রামিং"'),
    ('name: "Operating Systems Lab"', 'name: "Operating Systems Lab / অপারেটিং সিস্টেম ল্যাব"'),
    ('name: "Theory of Computation & Formal Languages"', 'name: "Theory of Computation & Formal Languages / কম্প্যুটেশন তত্ত্ব ও অটোমেটা"'),
    ('name: "Software Engineering & Agile System Design"', 'name: "Software Engineering & Agile System Design / সফটওয়্যার ইঞ্জিনিয়ারিং"'),
    ('name: "Software Development Project Lab"', 'name: "Software Development Project Lab / সফটওয়্যার ডেভেলপমেন্ট প্রজেক্ট ল্যাব"'),
    ('name: "Numerical Methods for Computing"', 'name: "Numerical Methods for Computing / সংখ্যাতাত্ত্বিক কম্পিউটিং পদ্ধতি"'),
    ('name: "Computer Networks & Internet Protocols"', 'name: "Computer Networks & Internet Protocols / কম্পিউটার নেটওয়ার্ক ও প্রোটোকল"'),
    ('name: "Computer Networks Lab"', 'name: "Computer Networks Lab / কম্পিউটার নেটওয়ার্ক ল্যাব"'),
    ('name: "Microprocessors & Embedded Systems"', 'name: "Microprocessors & Embedded Systems / মাইক্রোপ্রসেসর ও এমবেডেড সিস্টেম"'),
    ('name: "Microprocessors & Microcontrollers Lab"', 'name: "Microprocessors & Microcontrollers Lab / মাইক্রোপ্রসেসর ও মাইক্রোকন্ট্রোলার ল্যাব"'),
    ('name: "Web Technologies & Cloud Applications"', 'name: "Web Technologies & Cloud Applications / ওয়েব টেকনোলজি ও ক্লাউড অ্যাপ"'),
    ('name: "Cyber Law & Professional Ethics"', 'name: "Cyber Law & Professional Ethics / সাইবার আইন ও পেশাগত নীতিশাস্ত্র"'),
    ('name: "Artificial Intelligence & Expert Systems"', 'name: "Artificial Intelligence & Expert Systems / কৃত্রিম বুদ্ধিমত্তা ও বিশেষজ্ঞ সিস্টেম"'),
    ('name: "Artificial Intelligence Lab"', 'name: "Artificial Intelligence Lab / কৃত্রিম বুদ্ধিমত্তা ল্যাব"'),
    ('name: "Compiler Design & Construction"', 'name: "Compiler Design & Construction / কম্পাইলার ডিজাইন ও কনস্ট্রাকশন"'),
    ('name: "Information Security & Cryptography"', 'name: "Information Security & Cryptography / তথ্য নিরাপত্তা ও ক্রিপ্টোগ্রাফি"'),
    ('name: "Undergraduate Capstone Project / Thesis-I"', 'name: "Undergraduate Capstone Project / Thesis-I / ক্যাপস্টোন থিসিস ও প্রজেক্ট-১"'),
    ('name: "Machine Learning & Neural Networks"', 'name: "Machine Learning & Neural Networks / মেশিন লার্নিং ও নিউরাল নেটওয়ার্ক"'),
    ('name: "Mobile App Development (Android/iOS)"', 'name: "Mobile App Development (Android/iOS) / মোবাইল অ্যাপ ডেভেলপমেন্ট"'),
    ('name: "Distributed Cloud Computing & Big Data"', 'name: "Distributed Cloud Computing & Big Data / ডিস্ট্রিবিউটেড ক্লাউড ও বিগ ডেটা"'),
    ('name: "Undergraduate Capstone Project / Thesis-II"', 'name: "Undergraduate Capstone Project / Thesis-II / ক্যাপস্টোন থিসিস ও প্রজেক্ট-২"'),
    ('name: "Comprehensive Degree Viva-Voce"', 'name: "Comprehensive Degree Viva-Voce / সমন্বিত ডিগ্রি মৌখিক পরীক্ষা"'),

    # Diploma Computer
    ('name: "Engineering Drawing (AutoCAD)"', 'name: "Engineering Drawing (AutoCAD) / প্রকৌশল অঙ্কন (অটোক্যাড)"'),
    ('name: "Basic Electronics & Semi-conductor Devices"', 'name: "Basic Electronics & Semi-conductor Devices / মৌলিক ইলেকট্রনিক্স ও সেমিকন্ডাক্টর"'),
    ('name: "Analog Electronics Circuit"', 'name: "Analog Electronics Circuit / অ্যানালগ ইলেকট্রনিক্স সার্কিট"'),
    ('name: "Microprocessor & Interfacing"', 'name: "Microprocessor & Interfacing / মাইক্রোপ্রসেসর ও ইন্টারফেসিং"'),
    ('name: "PCB Design & Circuit Fabrication Lab"', 'name: "PCB Design & Circuit Fabrication Lab / পিসিবি ডিজাইন ও সার্কিট ল্যাব"'),
    ('name: "Industrial Attachment (Internship in Tech Firm)"', 'name: "Industrial Attachment (Internship in Tech Firm) / শিল্প সংযুক্তি (৩ মাস ইন্ডাস্ট্রিয়াল ইন্টার্নশিপ)"'),
    ('name: "Project Presentation & Viva-Voce"', 'name: "Project Presentation & Viva-Voce / প্রকল্প উপস্থাপনা ও মৌখিক পরীক্ষা"'),
]

count = 0
for old, new in REPLACEMENTS:
    if old in text:
        text = text.replace(old, new)
        count += 1

with open(ENGINE_FILE, "w", encoding="utf-8") as f:
    f.write(text)

print(f"Replaced {count} titles with bilingual English / Bangla names in cgpa-grade-engine.ts!")
