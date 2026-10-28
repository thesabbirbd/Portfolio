import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { getAllContent } from '@/lib/content';

// Mock the content library
vi.mock('@/lib/content', () => ({
  getAllContent: vi.fn(),
}));

describe('feed.xml GET Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockItem = (type: string, date: string, slug: string) => ({
    meta: {
      type,
      date,
      slug,
      title: `Title for ${slug}`,
      description: `Description for ${slug}`,
      status: 'published',
    },
    content: `Content for ${slug}`,
  });

  it('should return a valid RSS XML response with correct headers', async () => {
    vi.mocked(getAllContent).mockReturnValue([]);

    const response = await GET();

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml');
    expect(response.headers.get('Cache-Control')).toBe('s-maxage=86400, stale-while-revalidate');

    const text = await response.text();
    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(text).toContain('<rss version="2.0"');
    expect(text).toContain('<channel>');
  });

  it('should correctly slice to a maximum of 20 items', async () => {
    const mockNotes = Array.from({ length: 25 }).map((_, i) =>
      createMockItem('notes', `2023-01-${String((i % 28) + 1).padStart(2, '0')}`, `note-${i}`)
    );

    // Provide 25 items just for notes, and 0 for others to keep it simple but test slicing
    vi.mocked(getAllContent).mockImplementation((type) => {
      if (type === 'notes') return mockNotes as any;
      return [];
    });

    const response = await GET();
    const text = await response.text();

    const itemMatches = text.match(/<item>/g);
    expect(itemMatches?.length).toBe(20);
  });

  it('should sort items by date descending', async () => {
    const item1 = createMockItem('notes', '2023-01-01', 'old-note');
    const item2 = createMockItem('journal', '2023-01-03', 'new-journal');
    const item3 = createMockItem('projects', '2023-01-02', 'mid-project');

    vi.mocked(getAllContent).mockImplementation((type) => {
      if (type === 'notes') return [item1] as any;
      if (type === 'journal') return [item2] as any;
      if (type === 'projects') return [item3] as any;
      return [];
    });

    const response = await GET();
    const text = await response.text();

    // Check order in XML string
    const indexOfItem1 = text.indexOf('old-note');
    const indexOfItem2 = text.indexOf('new-journal');
    const indexOfItem3 = text.indexOf('mid-project');

    // Item2 (03) should be before Item3 (02), which should be before Item1 (01)
    expect(indexOfItem2).toBeLessThan(indexOfItem3);
    expect(indexOfItem3).toBeLessThan(indexOfItem1);
  });

  it('should correctly map the "lab" type to "engineering-lab" in links', async () => {
    const labItem = createMockItem('lab', '2023-01-01', 'lab-experiment');

    vi.mocked(getAllContent).mockImplementation((type) => {
      if (type === 'lab') return [labItem] as any;
      return [];
    });

    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<link>https://sabbir.nav.bd/engineering-lab/lab-experiment</link>');
    expect(text).toContain('<guid>https://sabbir.nav.bd/engineering-lab/lab-experiment</guid>');

    // Ensure it doesn't just use 'lab'
    expect(text).not.toContain('<link>https://sabbir.nav.bd/lab/lab-experiment</link>');
  });

  it('should output all relevant fields in the item XML', async () => {
     const testItem = createMockItem('notes', '2023-10-15T10:00:00Z', 'full-test-note');

     vi.mocked(getAllContent).mockImplementation((type) => {
      if (type === 'notes') return [testItem] as any;
      return [];
    });

    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<title><![CDATA[Title for full-test-note]]></title>');
    expect(text).toContain('<link>https://sabbir.nav.bd/notes/full-test-note</link>');
    expect(text).toContain('<pubDate>Sun, 15 Oct 2023 10:00:00 GMT</pubDate>');
    expect(text).toContain('<description><![CDATA[Description for full-test-note]]></description>');
  });
});
