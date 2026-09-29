import { ResumeInterface } from '@/components/resume/ResumeInterface';

export const metadata = {
  title: "Interactive Resume | THE SABBiR",
  description: "Professional capability model, engineering experience, and technical evidence for Md Sabbirul Islam Khan.",
  alternates: {
    canonical: "https://sabbir.nav.bd/resume",
  }
};

export default function ResumePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <ResumeInterface />
    </div>
  );
}
