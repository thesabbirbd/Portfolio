const fs = require('fs');
let file = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');

const oldGetSocialIcon = `  const getSocialIcon = (icon: string) => {
    switch (icon) {
      case "github":
        return <GithubIcon className="w-4 h-4" />;
      case "linkedin":
        return <LinkedinIcon className="w-4 h-4" />;
      case "facebook":
        return <FacebookIcon className="w-4 h-4" />;
      case "instagram":
        return <InstagramIcon className="w-4 h-4" />;
      case "x":
        return <TwitterIcon className="w-4 h-4" />;
      case "maps":
        return <MapPin className="w-4 h-4" />;
      case "gmail":
      default:
        return <Mail className="w-4 h-4" />;
    }
  };`;

const newGetSocialIcon = `  const getSocialIcon = (icon: string) => {
    const baseClass = "w-5 h-5 icon-3d-punchy transition-transform group-hover:scale-110";
    switch (icon) {
      case "github":
        return <GithubIcon className={\`\${baseClass} text-indigo-400\`} />;
      case "linkedin":
        return <LinkedinIcon className={\`\${baseClass} text-blue-500\`} />;
      case "facebook":
        return <FacebookIcon className={\`\${baseClass} text-blue-600\`} />;
      case "instagram":
        return <InstagramIcon className={\`\${baseClass} text-pink-500\`} />;
      case "x":
        return <TwitterIcon className={\`\${baseClass} text-zinc-300\`} />;
      case "maps":
        return <MapPin className={\`\${baseClass} text-emerald-500\`} />;
      case "gmail":
      default:
        return <Mail className={\`\${baseClass} text-red-500\`} />;
    }
  };`;

file = file.replace(oldGetSocialIcon, newGetSocialIcon);

file = file.replace(
  /className="p-2.5 rounded-xl bg-zinc-900\/30 border border-border\/50 text-muted-foreground hover:text-foreground hover:bg-zinc-800 transition-all"/g,
  'className="p-2.5 rounded-xl bg-zinc-900/30 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-zinc-800 transition-all group"'
);

fs.writeFileSync('src/components/layout/Footer.tsx', file);
