import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommunitySection } from './CommunitySection';
import { sound } from '@/lib/sound';

vi.mock('@/lib/sound', () => ({
  sound: {
    click: vi.fn(),
  },
}));

describe('CommunitySection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CommunitySection />);
    expect(screen.getByText('Campus leadership · Social impact')).toBeTruthy();
  });

  it('renders all three main section headings', () => {
    render(<CommunitySection />);
    expect(screen.getAllByText('Campus Leadership').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Social Impact & Volunteer').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Technical & Media Work').length).toBeGreaterThan(0);
  });

  it('renders specific data items from COMMUNITY_DATA', () => {
    render(<CommunitySection />);
    expect(screen.getAllByText('Rajshahi College Presentation Club (RCPC)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Volunteer for Bangladesh (VBD)').length).toBeGreaterThan(0);
  });

  it('calls sound.click when a link is clicked', () => {
    render(<CommunitySection />);
    const link = screen.getAllByRole('link')[0];

    expect(link).toBeTruthy();

    fireEvent.click(link);
    expect(sound.click).toHaveBeenCalledTimes(1);
  });
});
