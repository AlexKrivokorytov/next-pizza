'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search } from 'lucide-react';

/**
 * Button that triggers a full Meilisearch product index rebuild.
 * Shows spinner and result message after the sync.
 */
export function SyncSearchButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/sync-search', { method: 'POST' });
      const data = await res.json() as { synced?: number; message?: string; error?: string };

      if (res.ok) {
        setResult(`✅ Synced ${data.synced} products to search index`);
      } else {
        setResult(`❌ ${data.error ?? 'Sync failed'}`);
      }
    } catch {
      setResult('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={handleSync} disabled={loading}>
        {loading ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Search className="h-4 w-4 mr-2" />
        )}
        {loading ? 'Syncing...' : 'Sync Search Index'}
      </Button>
      {result && <span className="text-sm text-muted-foreground">{result}</span>}
    </div>
  );
}
