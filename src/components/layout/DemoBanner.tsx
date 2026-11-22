import { AlertTriangle } from 'lucide-react';

/**
 * Persistent notice shown whenever the frontend is serving the local demo
 * corpus instead of the live IR API.
 */
export function DemoBanner() {
  return (
    <div className="demo-banner" role="status">
      <div className="demo-banner__inner">
        <AlertTriangle size={15} aria-hidden="true" />
        <span>
          <strong>Mode demo aktif.</strong> Hasil diambil dari korpus contoh proyek
          dan skor relevansi dihitung secara lokal — bukan keluaran model IR.
        </span>
      </div>
    </div>
  );
}
