import React, { useState } from "react";
import { Key, HelpCircle, Shield, CheckCircle, Smartphone, ExternalLink, ToggleLeft, ToggleRight, Loader2, Sparkles } from "lucide-react";
import { FbConnectionSettings } from "../types";

interface FacebookSettingsProps {
  settings: FbConnectionSettings;
  onSaveSettings: (settings: Partial<FbConnectionSettings>) => void;
}

export default function FacebookSettings({ settings, onSaveSettings }: FacebookSettingsProps) {
  const [fbPageId, setFbPageId] = useState(settings.fbPageId);
  const [fbPageAccessToken, setFbPageAccessToken] = useState(settings.fbPageAccessToken);
  const [isSimulated, setIsSimulated] = useState(settings.isSimulated);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedPrompt, setShowSavedPrompt] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    onSaveSettings({
      fbPageId,
      fbPageAccessToken,
      isSimulated,
    });
    setTimeout(() => {
      setIsSaving(false);
      setShowSavedPrompt(true);
      setTimeout(() => setShowSavedPrompt(false), 3000);
    }, 800);
  };

  return (
    <div id="facebook-settings-view" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Settings Form */}
      <div className="lg:col-span-2 space-y-6">
        <form
          id="fb-credentials-form"
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6"
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" />
              Meta Pages API Credentials
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Provide your Facebook Page credentials below. Toggle to Live Mode to establish true API publishing.
            </p>
          </div>

          <div className="space-y-4">
            {/* Simulation mode warning */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-800 text-sm">Enable Interactive Simulation Sandbox</h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Generates realistic content, triggers AI graphics, and stores standard responses locally without requiring premium Facebook Developer registration.
                </p>
              </div>

              <button
                id="btn-toggle-sim"
                type="button"
                onClick={() => setIsSimulated(!isSimulated)}
                className="focus:outline-none"
              >
                {isSimulated ? (
                  <ToggleRight className="w-12 h-12 text-indigo-600 cursor-pointer" />
                ) : (
                  <ToggleLeft className="w-12 h-12 text-slate-400 cursor-pointer" />
                )}
              </button>
            </div>

            {/* Page ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 font-sans block">Facebook Page Numeric ID</label>
              <input
                id="settings-page-id"
                type="text"
                value={fbPageId}
                onChange={(e) => setFbPageId(e.target.value)}
                placeholder="e.g. 100098481234123"
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Page Access Token */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 font-sans block">Facebook Page Access Token (EAA...)</label>
              <input
                id="settings-token"
                type="password"
                value={fbPageAccessToken}
                onChange={(e) => setFbPageAccessToken(e.target.value)}
                placeholder="Paste your system-user page token here"
                disabled={isSimulated}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isSimulated ? "opacity-55 cursor-not-allowed border-slate-100" : "border-slate-200"
                }`}
              />
              {isSimulated && (
                <p className="text-[11px] text-amber-600 font-medium">
                  * Credentials not required while running in Simulation Sandbox mode.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-150">
            <span className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
              <Shield className="w-4 h-4 text-emerald-500" />
              Direct, secure local execution
            </span>

            <button
              id="btn-save-credentials"
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition shadow-sm"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {showSavedPrompt ? "Saved Successfully!" : "Save Credentials"}
            </button>
          </div>
        </form>

        {/* Saved Confirmation Banner */}
        {showSavedPrompt && (
          <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 text-sm rounded-lg shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Settings successfully synced on the database. Active automated workers have loaded your profile.</span>
          </div>
        )}
      </div>

      {/* Guide Card */}
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-220 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <HelpCircle className="w-4.5 h-4.5 text-indigo-500" />
            Pages Token Generator Guide
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Here's a standard quick list of tasks to generate a permanent Facebook Page Access Token for real automated publishing:
          </p>

          <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-3 font-sans">
            <li>
              <span className="font-semibold text-slate-800">Visit Meta Developer Hub:</span> Register a Facebook App with the "Business" type at{" "}
              <a
                href="https://developers.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-500 hover:underline inline-flex items-center gap-0.5"
              >
                developers.facebook.com <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <span className="font-semibold text-slate-800">Configure Graph API Explorer:</span> Select your Page from the dropdown list.
            </li>
            <li>
              <span className="font-semibold text-slate-800">Grant Permissions:</span> Select the specific API credentials:
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-500 font-sans">
                <li>pages_manage_posts</li>
                <li>pages_read_engagement</li>
                <li>pages_show_list</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-slate-800">Exchange for Long-Lived Token:</span> Use the Meta Access Token Tool to secure a 60-day or permanent token.
            </li>
          </ol>

          <div className="flex gap-2.5 items-start bg-indigo-50 p-3 rounded-lg border border-indigo-150">
            <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-[11px] font-bold text-indigo-900 uppercase">Interactive Preview Advantage</h5>
              <p className="text-[11px] text-indigo-600 leading-relaxed font-sans">
                Turn on Simulation Sandbox Mode to check all content layouts, customize schedules, and trigger instant posts instantly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
