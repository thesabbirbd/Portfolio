const fs = require('fs');
let file = fs.readFileSync('src/components/about/JourneyTimeline.tsx', 'utf8');

file = file.replace(/import \{ GlassCard \} from "@\/components\/ui\/glass\/GlassCard";/, 'import { GlassCard } from "@/components/ui/GlassCard";');

fs.writeFileSync('src/components/about/JourneyTimeline.tsx', file);
