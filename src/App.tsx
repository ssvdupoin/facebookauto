import React, { useState, useEffect } from "react";
import { Sparkles, BarChart2, Calendar, Settings, ShieldAlert, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { Campaign, FbPost, FbConnectionSettings } from "./types";
import PublishingDashboard from "./components/PublishingDashboard";
import CampaignsConfig from "./components/CampaignsConfig";
import SchedulerQueue from "./components/SchedulerQueue";
import FacebookSettings from "./components/FacebookSettings";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "campaigns" | "queue" | "settings">("dashboard");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [posts, setPosts] = useState<FbPost[]>([]);
  const [settings, setSettings] = useState<FbConnectionSettings>({
    fbPageId: "",
    fbPageAccessToken: "",
    isSimulated: true,
  });

  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState("");

  // Sync methods
  const loadWorkspaceState = async () => {
    try {
      const [cRes, pRes, sRes] = await Promise.all([
        fetch("/api/campaigns"),
        fetch("/api/posts"),
        fetch("/api/settings"),
      ]);

      if (cRes.ok && pRes.ok && sRes.ok) {
        const cData = await cRes.json();
        const pData = await pRes.json();
        const sData = await sRes.json();

        setCampaigns(cData);
        setPosts(pData);
        setSettings(sData);
      } else {
        throw new Error("HTTP status check rejected during workspace syncing.");
      }
    } catch (e: any) {
      console.error("Critical Workspace state fetch failure:", e);
      setErrorBanner("Failed to communicate with back-end Express server. Verify dev server status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceState();
  }, []);

  const clearAlert = () => setErrorBanner("");

  // Campaign handlers
  const handleAddCampaign = async (newC: Omit<Campaign, "id" | "createdAt">) => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newC),
      });
      if (!res.ok) throw new Error("Could not save new campaign.");
      await loadWorkspaceState();
    } catch (e: any) {
      setErrorBanner(e.message || "Failed to launch campaign.");
    }
  };

  const handleUpdateCampaign = async (id: string, updatedFields: Partial<Campaign>) => {
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error("Could not update campaign details.");
      await loadWorkspaceState();
    } catch (e: any) {
      setErrorBanner(e.message || "Failed to update campaign.");
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete campaign.");
      await loadWorkspaceState();
    } catch (e: any) {
      setErrorBanner(e.message || "Failed to delete campaign.");
    }
  };

  // Settings handler
  const handleSaveSettings = async (updatedSettings: Partial<FbConnectionSettings>) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });
      if (!res.ok) throw new Error("Could not update secure settings.");
      await loadWorkspaceState();
    } catch (e: any) {
      setErrorBanner(e.message || "Failed to change credentials.");
    }
  };

  // Scheduler manual cron runner trigger
  const handleTriggerCron = async () => {
    try {
      const res = await fetch("/api/trigger-cron", { method: "POST" });
      if (!res.ok) throw new Error("Automated daily trigger failed.");
      await loadWorkspaceState();
    } catch (e: any) {
      setErrorBanner(e.message || "Cron passage failure.");
      throw e;
    }
  };

  // Manual on-demand individual post creation (calls gemini server proxy)
  const handleGenerateManualDraft = async (campaignId: string): Promise<FbPost> => {
    try {
      const res = await fetch("/api/posts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, forceSchedule: true }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Bespoke manual graphic composition failed.");
      }
      const draftPost = await res.json();
      await loadWorkspaceState();
      return draftPost;
    } catch (e: any) {
      setErrorBanner(e.message || "Failed to generate AI content draft.");
      throw e;
    }
  };

  // Force actual/simulated publishing to Facebook Graph Node right now
  const handleTriggerPublish = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/publish/${postId}`, { method: "POST" });
      if (!res.ok) throw new Error("Server transmission error.");
      await loadWorkspaceState();
    } catch (e: any) {
      setErrorBanner(e.message || "Transmission to Facebook failed.");
    }
  };

  return (
    <div id="autosocial-main-root" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Upper Navigation Bar */}
      <header id="main-header" className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-650 flex items-center justify-center text-white shadow-md shadow-indigo-250 font-bold shrink-0">
              AS
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">AutoSocial AI</h1>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase font-mono block mt-0.5">ระบบสร้างคอนเทนต์ Facebook อัตโนมัติ</span>
            </div>
          </div>

          <nav id="navbar-tabs" className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <button
              id="tab-btn-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`px-3.5 py-2 rounded-lg transition ${
                activeTab === "dashboard" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              ห้องควบคุมหลัก
            </button>
            <button
              id="tab-btn-campaigns"
              onClick={() => setActiveTab("campaigns")}
              className={`px-3.5 py-2 rounded-lg transition ${
                activeTab === "campaigns" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              ตั้งค่าแคมเปญ
            </button>
            <button
              id="tab-btn-queue"
              onClick={() => setActiveTab("queue")}
              className={`px-3.5 py-2 rounded-lg transition ${
                activeTab === "queue" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              ตารางเวลาและประวัติ
            </button>
            <button
              id="tab-btn-settings"
              onClick={() => setActiveTab("settings")}
              className={`px-3.5 py-2 rounded-lg transition ${
                activeTab === "settings" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              ตั้งค่าสิทธิ์การเข้าใช้งาน
            </button>
          </nav>
        </div>

        {/* Small screen navigation rails */}
        <div className="md:hidden flex justify-around border-t border-slate-100 bg-white py-2 text-xs font-bold text-slate-500">
          <button
            id="tab-btn-dash-sm"
            onClick={() => setActiveTab("dashboard")}
            className={activeTab === "dashboard" ? "text-indigo-600" : ""}
          >
            ห้องควบคุม
          </button>
          <button
            id="tab-btn-camp-sm"
            onClick={() => setActiveTab("campaigns")}
            className={activeTab === "campaigns" ? "text-indigo-600" : ""}
          >
            แคมเปญ
          </button>
          <button
            id="tab-btn-queue-sm"
            onClick={() => setActiveTab("queue")}
            className={activeTab === "queue" ? "text-indigo-600" : ""}
          >
            ตารางโพสต์
          </button>
          <button
            id="tab-btn-sett-sm"
            onClick={() => setActiveTab("settings")}
            className={activeTab === "settings" ? "text-indigo-600" : ""}
          >
            ตั้งค่า API
          </button>
        </div>
      </header>

      {/* Primary Container Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Notification Alert */}
        {errorBanner && (
          <div
            id="error-notification-bar"
            className="p-4 bg-rose-50 border border-rose-220 text-rose-800 text-sm rounded-xl shadow-xs flex items-center justify-between gap-3 animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              id="btn-dismiss-error"
              onClick={clearAlert}
              className="text-xs font-bold font-mono tracking-wider text-rose-600 hover:text-rose-800"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Loading Spinner Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="text-slate-500 text-sm font-semibold">Synchronizing social queues database...</span>
          </div>
        ) : (
          <div id="active-tab-container" className="animate-fade-in">
            {activeTab === "dashboard" && (
              <PublishingDashboard
                campaigns={campaigns}
                posts={posts}
                settings={settings}
                onTriggerCron={handleTriggerCron}
                onGenerateManualDraft={handleGenerateManualDraft}
                onTriggerPublish={handleTriggerPublish}
              />
            )}

            {activeTab === "campaigns" && (
              <CampaignsConfig
                campaigns={campaigns}
                onAddCampaign={handleAddCampaign}
                onUpdateCampaign={handleUpdateCampaign}
                onDeleteCampaign={handleDeleteCampaign}
              />
            )}

            {activeTab === "queue" && (
              <SchedulerQueue
                posts={posts}
                onTriggerPublish={handleTriggerPublish}
              />
            )}

            {activeTab === "settings" && (
              <FacebookSettings
                settings={settings}
                onSaveSettings={handleSaveSettings}
              />
            )}
          </div>
        )}
      </main>

      {/* Clean Bottom Footer */}
      <footer id="main-footer" className="bg-white border-t border-slate-200 mt-auto py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span>AutoSocial AI • Multi-Brand Automated Social Agent</span>
          <span>Workspace Environment Connected</span>
        </div>
      </footer>
    </div>
  );
}
