'use client';

import {useEffect} from 'react';
import type {AnxianEventName} from '@/lib/anxian/analytics';

function getAnonymousId() {
  const key = 'anxian_anonymous_id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

export function AnxianPageTracker({
  eventName = 'page_view',
  pagePath,
  templateSlug,
  properties,
}: {
  eventName?: AnxianEventName;
  pagePath: string;
  templateSlug?: string;
  properties?: Record<string, unknown>;
}) {
  useEffect(() => {
    void fetch('/api/anxian/track', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        anonymousId: getAnonymousId(),
        eventName,
        pagePath,
        templateSlug,
        properties: properties || {},
      }),
      keepalive: true,
    }).catch(() => {
      // Analytics should never block the page.
    });
  }, [eventName, pagePath, templateSlug, properties]);

  return null;
}
