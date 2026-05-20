import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { useTranslation } from 'react-i18next';
import api from '../api';

const steps = ['confirmed', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

const TrackingPage = () => {
  const { trackingId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const { t } = useTranslation();

  const isDelivered = data?.status === 'delivered';

  const fetchTracking = async (mounted, setLoadingFn) => {
    try {
      const res = await api.get(`/tracking/${trackingId}`, { silent: true });
      if (!mounted.current) return res.data?.status;
      setData(res.data);
      setError('');
      setLastRefreshed(new Date());
      return res.data?.status;
    } catch (err) {
      if (!mounted.current) return;
      setError(err.response?.data?.error || t('Tracking_Error'));
    } finally {
      if (mounted.current && setLoadingFn) setLoadingFn(false);
    }
  };

  useEffect(() => {
    const mounted = { current: true };
    let interval = null;

    const run = async () => {
      const status = await fetchTracking(mounted, setLoading);
      // Only start polling if not already delivered
      if (status !== 'delivered') {
        interval = setInterval(async () => {
          const s = await fetchTracking(mounted, null);
          // Stop polling once delivered
          if (s === 'delivered' && interval) {
            clearInterval(interval);
            interval = null;
          }
        }, 15000);
      }
    };

    run();
    return () => {
      mounted.current = false;
      if (interval) clearInterval(interval);
    };
  }, [trackingId]);

  const handleManualRefresh = async () => {
    const mounted = { current: true };
    setLoading(true);
    await fetchTracking(mounted, setLoading);
  };

  const activeIndex = steps.findIndex((step) => step === data?.status);

  const formatStatus = (status) => {
    const key = `Tracking_Status_${status}`;
    const translated = t(key);
    // Fall back to formatted raw value if key missing
    return translated === key ? String(status || 'pending').replace(/_/g, ' ') : translated;
  };

  return (
    <>
      <SeoHead
        title={`Track Order ${trackingId} — Meditrust Nepal`}
        description="Track your medical equipment order from Meditrust Nepal. View real-time status updates for your delivery."
        noindex={true}
      />

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-slate-300 text-sm uppercase tracking-[0.22em]">{t('Tracking_Hero_Label')}</p>
          <h1 className="text-4xl font-bold text-white mt-3">{t('Tracking_Hero_Title')}: {trackingId}</h1>
          <p className="text-slate-200 mt-3 max-w-2xl">{t('Tracking_Hero_Desc')}</p>
        </div>
      </section>

      <section className="bg-slate-50 py-10">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 animate-pulse">
              <div className="h-8 w-56 bg-slate-200 rounded mb-8" />
              <div className="grid md:grid-cols-5 gap-4">
                {steps.map((step) => (
                  <div key={step} className="h-20 rounded-2xl bg-slate-100" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl border border-red-100 p-8">
              <h2 className="text-xl font-semibold text-slate-900">{t('Tracking_Unavailable')}</h2>
              <p className="text-slate-600 mt-2">{error}</p>
              <button
                onClick={handleManualRefresh}
                className="mt-4 text-sm text-primary-600 hover:text-primary-800 font-medium underline"
              >
                {t('Tracking_Retry')}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
                  <div>
                    <p className="text-sm text-slate-500">{t('Tracking_Current_Status')}</p>
                    <h2 className="text-3xl font-bold text-slate-900 capitalize">
                      {formatStatus(data?.status)}
                    </h2>
                    {isDelivered && (
                      <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {t('Tracking_Polling_Stopped')}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 text-right">
                    <p>{t('Tracking_Last_Updated')}</p>
                    <p className="font-medium text-slate-800">
                      {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : t('Tracking_Unknown')}
                    </p>
                    {!isDelivered && (
                      <>
                        <p className="mt-2">{t('Tracking_ETA')}</p>
                        <p className="font-medium text-slate-800">
                          {data?.eta ? new Date(data.eta).toDateString() : t('Tracking_Unknown')}
                        </p>
                      </>
                    )}
                    <button
                      onClick={handleManualRefresh}
                      className="mt-3 text-xs text-primary-600 hover:text-primary-800 font-medium underline"
                    >
                      {t('Tracking_Refresh')}
                      {lastRefreshed && (
                        <span className="text-slate-400 ml-1 font-normal">
                          ({lastRefreshed.toLocaleTimeString()})
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-5">
                  {steps.map((step, index) => {
                    const completed = activeIndex >= index || (activeIndex === -1 && data?.status === step);
                    return (
                      <div
                        key={step}
                        className={`rounded-2xl border p-4 transition-all ${
                          completed
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                              completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {index + 1}
                          </span>
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-900">{formatStatus(step)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">{t('Tracking_Timeline_Title')}</h3>
                {!data?.history || data.history.length === 0 ? (
                  <div className="mt-6 text-center py-8 text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">{t('Tracking_No_History')}</p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-5">
                    {data.history.slice().reverse().map((event, index) => (
                      <div key={`${event.id || index}-${event.timestamp}`} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-4 w-4 rounded-full bg-emerald-500 mt-1" />
                          {index !== (data.history.length - 1) && <div className="w-px flex-1 bg-slate-200 mt-2" />}
                        </div>
                        <div className="pb-6">
                          <p className="font-semibold text-slate-900 capitalize">{formatStatus(event.status)}</p>
                          <p className="text-slate-600 text-sm mt-1">{event.message || t('Tracking_Default_Message')}</p>
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TrackingPage;
