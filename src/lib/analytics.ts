/**
 * Lightweight Privacy-First Analytics Wrapper
 * Supports simple taxonomy for tracking knowledge base engagement.
 */

type EventName = 
  | 'content_view'
  | 'project_view'
  | 'lab_view'
  | 'search'
  | 'search_result_click'
  | 'external_link_click'
  | 'github_click'
  | 'demo_click'
  | 'related_content_click'
  | 'feed_click';

interface EventProperties {
  [key: string]: string | number | boolean;
}

export function trackEvent(eventName: EventName, properties?: EventProperties) {
  // Check if standard web analytics (e.g., Vercel Analytics window.va) is available
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', eventName, properties);
  }
}
