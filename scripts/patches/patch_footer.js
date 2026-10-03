const fs = require('fs');
let file = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');

file = file.replace(/export function Footer\(\) \{/, `import { motion } from "framer-motion";\n\nexport function Footer() {`);
file = file.replace(/<footer className="relative border-t border-slate-200\/60 dark:border-white\/10 bg-white\/40 dark:bg-slate-950\/40 backdrop-blur-md pt-16 pb-24 md:pb-16 overflow-hidden">/, 
  `<motion.footer 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative border-t border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md pt-16 pb-24 md:pb-16 overflow-hidden">`);
file = file.replace(/<\/footer>/, '</motion.footer>');

fs.writeFileSync('src/components/layout/Footer.tsx', file);
