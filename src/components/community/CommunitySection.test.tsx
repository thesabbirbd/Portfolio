import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CommunitySection } from './CommunitySection';
import { COMMUNITY_DATA } from '@/data/community';

// Mock child components that might use contexts or complex rendering
vi.mock('@/components/system/SectionHeader', () => ({
  SectionHeader: ({ eyebrow, title, lede }: any) => (
    <header data-testid="section-header">
      <div>{eyebrow}</div>
      <h1 data-testid="section-title">Community & activities</h1>
      <p>{lede}</p>
    </header>
  ),
  Accent: ({ children }: any) => <span>{children}</span>,
}));

// Mock icons
vi.mock('lucide-react', () => ({
  Building2: () => <div data-testid="icon-building" />,
  HeartHandshake: () => <div data-testid="icon-heart" />,
  Briefcase: () => <div data-testid="icon-briefcase" />,
  GraduationCap: () => <div data-testid="icon-grad" />,
  ExternalLink: () => <div data-testid="icon-external" />,
  Award: () => <div data-testid="icon-award" />,
}));

// Mock sound system
const mockSoundClick = vi.fn();
vi.mock('@/lib/sound', () => ({
  sound: {
    click: (...args: any[]) => mockSoundClick(...args),
  },
}));

describe('CommunitySection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders section header correctly', () => {
    render(<CommunitySection />);
    expect(screen.getByTestId('section-header')).toBeDefined();
    // Using a custom function because the content might be split across child spans
    expect(screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Campus leadership') ?? false;
    }).length).toBeGreaterThan(0);
    expect(screen.getByTestId('section-title')).toBeDefined();
  });

  it('renders all three column headers', () => {
    render(<CommunitySection />);
    expect(screen.getAllByRole('heading', { name: 'Campus Leadership' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: 'Social Impact & Volunteer' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: 'Technical & Media Work' }).length).toBeGreaterThan(0);
  });

  it('filters and renders leadership activities', () => {
    const { container } = render(<CommunitySection />);
    const leadershipItems = COMMUNITY_DATA.activities.filter(a => a.category === 'leadership');
    expect(leadershipItems.length).toBeGreaterThan(0);
    expect(container.textContent).toContain(leadershipItems[0].organization);
  });

  it('filters and renders volunteering activities', () => {
    const { container } = render(<CommunitySection />);
    const volItems = COMMUNITY_DATA.activities.filter(a => a.category === 'volunteering');
    expect(volItems.length).toBeGreaterThan(0);
    expect(container.textContent).toContain(volItems[0].organization);
  });

  it('filters and renders technical and media activities in the same column', () => {
    const { container } = render(<CommunitySection />);
    const techItems = COMMUNITY_DATA.activities.filter(a => a.category === 'technical' || a.category === 'media');
    expect(techItems.length).toBeGreaterThan(0);
    expect(container.textContent).toContain(techItems[0].organization);
  });

  it('renders external links based on url property', () => {
    render(<CommunitySection />);
    const activitiesWithUrl = COMMUNITY_DATA.activities.filter(a => a.url);
    const links = screen.getAllByRole('link');

    // Check that we have links rendered (the number depends on the real data)
    expect(links.length).toBeGreaterThanOrEqual(activitiesWithUrl.length);
  });

  it('triggers sound.click() when a link is clicked', () => {
    render(<CommunitySection />);
    const links = screen.getAllByRole('link');

    if (links.length > 0) {
        fireEvent.click(links[0]);
        expect(mockSoundClick).toHaveBeenCalledTimes(1);
    }
  });
});
