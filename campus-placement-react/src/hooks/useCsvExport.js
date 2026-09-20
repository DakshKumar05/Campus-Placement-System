import { useToast } from './useToast.js';

function escapeCell(text) {
  return '"' + String(text).replace(/"/g, '""') + '"';
}

/**
 * Returns a function that turns rows of data into a CSV download.
 * The rows come from state, so the file matches the data and not
 * whatever happens to be on screen.
 */
export function useCsvExport() {
  const showToast = useToast();

  return function exportCsv(headers, rows, filename) {
    if (!rows.length) {
      showToast('No data to export', 'error');
      return;
    }

    const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(','));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Exported ' + filename, 'success');
  };
}
