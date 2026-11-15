import autoPulseData from "@/data/auto-pulse.json";
import { type NewsStory } from "@/lib/news-portal";

export const AUTONOMOUS_PULSE_STORIES: NewsStory[] = autoPulseData as unknown as NewsStory[];

export const NEW_PULSE_STORIES = AUTONOMOUS_PULSE_STORIES.filter((s: any) => s.isNew);
