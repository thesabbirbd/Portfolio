import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { GET } from '../route';
import { getAllContent } from '@/lib/content';

// Mock the content library
vi.mock('@/lib/content', () => ({
  getAllContent: vi.fn()
}));

// We need to mock Response.json as it might not be fully available in the jsdom environment
const mockJson = vi.fn((data, options) => {
  return {
    status: 200,
    json: () => Promise.resolve(data),
    headers: options?.headers
  };
});

// Preserve the original Response
const originalResponse = global.Response;

beforeAll(() => {
  if (typeof global.Response === 'undefined') {
    global.Response = { json: mockJson } as unknown as typeof Response;
  } else {
    global.Response.json = mockJson;
  }
});

afterAll(() => {
  global.Response = originalResponse;
});

describe('GET /api/search', () => {
  it('should return a JSON array with correctly mapped content items', async () => {
    // Setup mock return values for getAllContent
    const mockNotes = [
      {
        meta: {
          title: 'Test Note 1',
          description: 'A test note description',
          slug: 'test-note-1',
          type: 'notes',
          category: 'development',
          tags: ['react', 'nextjs'],
          date: '2023-10-01'
        }
      }
    ];

    const mockLab = [
      {
        meta: {
          title: 'Test Lab',
          description: 'A test lab description',
          slug: 'test-lab-1',
          type: 'lab',
          category: 'experiment',
          tags: ['threejs'],
          date: '2023-10-02'
        }
      }
    ];

    // Configure the mock to return different data based on the argument
    vi.mocked(getAllContent).mockImplementation((type) => {
      if (type === 'notes') return mockNotes;
      if (type === 'lab') return mockLab;
      return []; // Return empty array for journal and projects
    });

    const response = await GET();
    const data = await response.json();

    // Verify getAllContent was called for all types
    expect(getAllContent).toHaveBeenCalledWith('notes');
    expect(getAllContent).toHaveBeenCalledWith('journal');
    expect(getAllContent).toHaveBeenCalledWith('projects');
    expect(getAllContent).toHaveBeenCalledWith('lab');

    // Verify the response data structure
    expect(data).toHaveLength(2);

    // Verify normal mapping
    expect(data[0]).toEqual({
      title: 'Test Note 1',
      description: 'A test note description',
      slug: 'test-note-1',
      type: 'notes',
      category: 'development',
      tags: ['react', 'nextjs'],
      date: '2023-10-01',
      url: '/notes/test-note-1' // Regular type
    });

    // Verify lab specific URL mapping
    expect(data[1]).toEqual({
      title: 'Test Lab',
      description: 'A test lab description',
      slug: 'test-lab-1',
      type: 'lab',
      category: 'experiment',
      tags: ['threejs'],
      date: '2023-10-02',
      url: '/engineering-lab/test-lab-1' // Special logic for lab type
    });

    // Verify caching headers
    expect(mockJson).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: {
          'Cache-Control': 's-maxage=86400, stale-while-revalidate'
        }
      })
    );
  });
});
