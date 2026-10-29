import { ResumeInterface } from '@/components/resume/ResumeInterface';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: "Interactive Resume | THE SABBiR",
  description: "Professional capability model, engineering experience, and technical evidence for Md Sabbirul Islam Khan.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <ResumeInterface />
    </div>
  );
}
