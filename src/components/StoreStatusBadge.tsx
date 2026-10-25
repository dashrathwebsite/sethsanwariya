import React, { useState, useEffect } from 'react';
import { getStoreStatus, StoreStatusResult } from '../utils/storeStatus';
import { useStore } from '../context/StoreContext';
import { Clock } from 'lucide-react';

export const StoreStatusBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { settings } = useStore();
  const [status, setStatus] = useState<StoreStatusResult>(() =>
    getStoreStatus(
      settings.opening_time || "08:00",
      settings.closing_time || "22:00",
      settings.is_exceptional_closure,
      settings.exceptional_closure_reason
    )
  );

  useEffect(() => {
    const update = () => {
      setStatus(
        getStoreStatus(
          settings.opening_time || "08:00",
          settings.closing_time || "22:00",
          settings.is_exceptional_closure,
          settings.exceptional_closure_reason
        )
      );
    };

    update();
    const interval = setInterval(update, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [settings.opening_time, settings.closing_time, settings.is_exceptional_closure, settings.exceptional_closure_reason]);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs font-hindi font-semibold">
        <span
          className={`w-2 h-2 rounded-full ${
            status.isOpen ? 'bg-emerald-500' : 'bg-red-500'
          }`}
          aria-hidden="true"
        />
        <span className={status.isOpen ? 'text-emerald-700' : 'text-red-700'}>
          {status.statusTextHi}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-hindi transition-colors ${
        status.isOpen
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
          : 'bg-red-50/90 border-red-200 text-red-900'
      }`}
    >
      <Clock className={`w-3.5 h-3.5 shrink-0 ${status.isOpen ? 'text-emerald-600' : 'text-red-600'}`} />
      <div>
        <div className="flex items-center gap-1.5 font-bold">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              status.isOpen ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          <span>{status.statusTextHi}</span>
        </div>
        <div className="text-[11px] opacity-85">{status.subTextHi}</div>
      </div>
    </div>
  );
};
