"use client";

import { useState, useTransition } from "react";
import { CheckCircle, XCircle, Save, Zap, RefreshCw } from "lucide-react";
import { saveStoreSettings, syncGbpToBrlRate } from "@/lib/actions";

type StoreSettings = {
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
  googleTagId?: string | null;
  utmifyPixelId?: string | null;
  utmifyMetaApiKey?: string | null;
  utmifyTiktokApiKey?: string | null;
  utmifyGoogleApiKey?: string | null;
  gbpToBrlRate?: number;
  trackingMode?: string;
} | null;

type Toast = { type: "success" | "error"; msg: string };

const PLATFORMS = [
  {
    key: "meta" as const,
    label: "Meta",
    color: "#1877F2",
    dot: "bg-blue-500",
    pixelKey: "metaPixelId" as const,
    pixelLabel: "Meta Pixel ID",
    pixelHint: "Pixel nativo — injetado após consentimento LGPD",
    apiKey: "utmifyMetaApiKey" as const,
    apiLabel: "UTMify API Key → Meta",
    apiHint: "S2S: UTMify roteia conversões para o Meta",
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    color: "#FF0050",
    dot: "bg-rose-500",
    pixelKey: "tiktokPixelId" as const,
    pixelLabel: "TikTok Pixel ID",
    pixelHint: "Pixel nativo — injetado após consentimento LGPD",
    apiKey: "utmifyTiktokApiKey" as const,
    apiLabel: "UTMify API Key → TikTok",
    apiHint: "S2S: UTMify roteia conversões para o TikTok",
  },
  {
    key: "google" as const,
    label: "Google",
    color: "#EA4335",
    dot: "bg-red-500",
    pixelKey: "googleTagId" as const,
    pixelLabel: "Google Tag ID",
    pixelHint: "GTM/GA4 — injetado após consentimento LGPD",
    apiKey: "utmifyGoogleApiKey" as const,
    apiLabel: "UTMify API Key → Google",
    apiHint: "S2S: UTMify roteia conversões para o Google Ads",
  },
];

export function SettingsForm({ initialSettings }: { initialSettings: StoreSettings }) {
  const init = initialSettings || {};
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncRate = async () => {
    setIsSyncing(true);
    try {
      const rate = await syncGbpToBrlRate();
      setForm((p) => ({ ...p, gbpToBrlRate: String(rate) }));
      showToast("success", `Taxa atualizada: ${rate}`);
    } catch (err: any) {
      showToast("error", err.message || "Erro ao buscar taxa no Stripe.");
    } finally {
      setIsSyncing(false);
    }
  };

  const [form, setForm] = useState({
    metaPixelId: init.metaPixelId || "",
    tiktokPixelId: init.tiktokPixelId || "",
    googleTagId: init.googleTagId || "",
    utmifyPixelId: init.utmifyPixelId || "",
    utmifyMetaApiKey: init.utmifyMetaApiKey || "",
    utmifyTiktokApiKey: init.utmifyTiktokApiKey || "",
    utmifyGoogleApiKey: init.utmifyGoogleApiKey || "",
    gbpToBrlRate: String(init.gbpToBrlRate ?? "7.4"),
    trackingMode: init.trackingMode || "production",
  });

  const [toast, setToast] = useState<Toast | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (type: Toast["type"], msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveStoreSettings({
          metaPixelId: form.metaPixelId || null,
          tiktokPixelId: form.tiktokPixelId || null,
          googleTagId: form.googleTagId || null,
          utmifyPixelId: form.utmifyPixelId || null,
          utmifyMetaApiKey: form.utmifyMetaApiKey || null,
          utmifyTiktokApiKey: form.utmifyTiktokApiKey || null,
          utmifyGoogleApiKey: form.utmifyGoogleApiKey || null,
          gbpToBrlRate: parseFloat(form.gbpToBrlRate) || 7.4,
          trackingMode: form.trackingMode,
        });
        showToast("success", "Salvo com sucesso.");
      } catch {
        showToast("error", "Erro ao salvar.");
      }
    });
  };

  const isConfigured = (val: string) => val.trim().length > 0;

  return (
    <div className="space-y-6 relative pb-8">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-black uppercase tracking-widest animate-in slide-in-from-bottom-4 duration-300 ${
            toast.type === "success" ? "bg-emerald-500 text-black" : "bg-rose-500 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Tracking</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-white/30">
            Pixels nativos + S2S UTMify por plataforma — sem redeploy
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-3 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/90 disabled:opacity-50 transition-all"
        >
          {isPending ? (
            <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {isPending ? "Salvando..." : "Salvar"}
        </button>
      </div>

      {/* Per-platform cards */}
      {PLATFORMS.map((p) => (
        <div key={p.key} className="bg-black border border-white/5 rounded-3xl overflow-hidden">
          {/* Platform header */}
          <div className="flex items-center gap-4 px-8 py-5 border-b border-white/5">
            <div className={`w-2 h-2 rounded-full ${p.dot}`} />
            <span className="text-sm font-black uppercase tracking-widest text-white">{p.label}</span>
            <div className="flex items-center gap-3 ml-auto">
              <span
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  isConfigured(form[p.pixelKey]) && isConfigured(form[p.apiKey])
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : isConfigured(form[p.pixelKey]) || isConfigured(form[p.apiKey])
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                    : "bg-white/5 border-white/10 text-white/20"
                }`}
              >
                {isConfigured(form[p.pixelKey]) && isConfigured(form[p.apiKey])
                  ? "Configurado"
                  : isConfigured(form[p.pixelKey]) || isConfigured(form[p.apiKey])
                  ? "Parcial"
                  : "Não configurado"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
            {/* Native Pixel */}
            <div className="px-8 py-6 space-y-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{p.pixelLabel}</p>
                <p className="text-[10px] text-white/20 mt-0.5">{p.pixelHint}</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={form[p.pixelKey]}
                  onChange={set(p.pixelKey)}
                  placeholder="—"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-all font-mono pr-8"
                />
                {isConfigured(form[p.pixelKey]) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
            </div>

            {/* UTMify S2S Key */}
            <div className="px-8 py-6 space-y-3">
              <div className="flex items-center gap-2">
                <Zap size={11} className="text-white/30" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{p.apiLabel}</p>
              </div>
              <p className="text-[10px] text-white/20">{p.apiHint}</p>
              <div className="relative">
                <input
                  type="text"
                  value={form[p.apiKey]}
                  onChange={set(p.apiKey)}
                  placeholder="—"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-all font-mono pr-8"
                />
                {isConfigured(form[p.apiKey]) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* UTMify Client Script + Conversion Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UTMify client pixel */}
        <div className="bg-black border border-white/5 rounded-3xl px-8 py-6 space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">UTMify — Pixel do Script</p>
            <p className="text-[10px] text-white/20 mt-0.5">
              ID do pixel no script client-side (<code className="bg-white/5 px-1 rounded">data-utmify-pixel</code>).
              Captura UTMs e tráfego — sem consentimento necessário.
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              value={form.utmifyPixelId}
              onChange={set("utmifyPixelId")}
              placeholder="utm_pixel_..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-all font-mono pr-8"
            />
            {isConfigured(form.utmifyPixelId) && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </div>
        </div>

        {/* Conversion config */}
        <div className="bg-black border border-white/5 rounded-3xl px-8 py-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Taxa GBP → BRL</p>
              <p className="text-[10px] text-white/20 mt-0.5">
                Aplicada em todos os eventos S2S e no script client-side via{" "}
                <code className="bg-white/5 px-1 rounded">window.__NM_CONFIG__</code>
              </p>
            </div>
            <button
              onClick={handleSyncRate}
              disabled={isSyncing}
              title="Buscar taxa atual GBP→BRL via Stripe"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/40 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <RefreshCw size={11} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Buscando..." : "Sync Stripe"}
            </button>
          </div>
          <input
            type="number"
            step="0.0001"
            min="1"
            value={form.gbpToBrlRate}
            onChange={set("gbpToBrlRate")}
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-all font-mono"
          />
          <div className="flex gap-2 pt-1">
            {["production", "debug"].map((mode) => (
              <button
                key={mode}
                onClick={() => setForm((p) => ({ ...p, trackingMode: mode }))}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                  form.trackingMode === mode
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/30 border-white/5 hover:border-white/20"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
        <p className="text-[10px] text-white/25 leading-relaxed">
          <span className="text-white/40 font-black">Como funciona:</span> os pixels nativos (Meta, TikTok, Google) são carregados
          no browser somente após consentimento LGPD. As API keys UTMify disparam S2S para cada plataforma configurada em paralelo —
          enviando nome, e-mail, telefone e endereço do cliente para máximo grau de correspondência. A taxa GBP→BRL é lida em runtime
          via <code className="bg-white/5 px-1 rounded">window.__NM_CONFIG__</code> e nos routes S2S, eliminando o valor fixo no código.
        </p>
      </div>
    </div>
  );
}
