import React from 'react';
  import type { ContactHistory, HistoryBatch } from './types';

  interface HistoryProps {
    history: ContactHistory[];
    loading: boolean;
  }

  export const History: React.FC<HistoryProps> = ({ history, loading }) => {
    const groupChangesByBatch = (changes: ContactHistory[]): HistoryBatch[] => {
      const batches: { [batch_id: string]: ContactHistory[] } = {};

      changes.forEach(change => {
        if (!batches[change.batch_id]) {
          batches[change.batch_id] = [];
        }
        batches[change.batch_id].push(change);
      });

      const batchArray : HistoryBatch[] = Object.entries(batches).map(([batch_id, batchChanges]) => {
        const sortedChanges = batchChanges.sort((a, b) => {
            return a.id - b.id;
        });
        return {
          id: sortedChanges[0].id,
          batch_id,
          changes : sortedChanges,
          changed_at: sortedChanges[0].changed_at 
        };
      });

      // Sort batches by the earliest change timestamp (most recent first)
      return batchArray.sort((a, b) =>
        a.id - b.id
      );
    };

    const formatChangeValue = (value: string): string => {
      // Remove quotes if they exist
      return value.replace(/^"(.*)"$/, '$1');
    };

    const getChangeTypeColor = (changeType: string): string => {
      switch (changeType) {
        case 'CREATE': return '#4CAF50';
        case 'UPDATE': return '#2196F3';
        case 'DELETE': return '#f44336';
        default: return '#666';
      }
    };

    const formatFieldName = (fieldName: string): string => {
      return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
      return <div className="history-loading">Loading history...</div>;
    }

    if (history.length === 0) {
      return <div className="history-empty">No history available</div>;
    }

    const batches = groupChangesByBatch(history);

    return (
      <div className="contact-history">
        <h4>Contact History</h4>
        {batches.map((batch) => (
          <div key={batch.batch_id} className="history-batch">
            <div className="batch-header">
              <span className="batch-date">
                {new Date(batch.changed_at).toLocaleDateString()} at{' '}
                {new Date(batch.changed_at).toLocaleTimeString()}
              </span>
            </div>
            <div className="batch-changes">
              {batch.changes.map((change) => (
                <div key={change.id} className="history-change">
                  <span
                    className="change-type"
                    style={{ color: getChangeTypeColor(change.change_type) }}
                  >
                    {change.change_type}
                  </span>
                  <span className="field-name">
                    {formatFieldName(change.field_name)}:
                  </span>
                  {(
                    <span className="new-value">
                      "{formatChangeValue(change.new_value)}"
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };