import React, { useState } from "react";
import { Sparkles, Calendar, CheckCircle2, ChevronRight, Play, AlertTriangle, MessageSquare, Heart, RefreshCw, BarChart2, Edit2, Send, Save, ArrowRight } from "lucide-react";
import { Campaign, FbPost, FbConnectionSettings } from "../types";

interface PublishingDashboardProps {
  campaigns: Campaign[];
  posts: FbPost[];
  settings: FbConnectionSettings;
  onTriggerCron: () => Promise<void>;
  onGenerateManualDraft: (campaignId: string) => Promise<FbPost>;
  onTriggerPublish: (id: string) => void;
}

export default function PublishingDashboard({
  campaigns,
  posts,
  settings,
  onTriggerCron,
  onGenerateManualDraft,
  onTriggerPublish,
}: PublishingDashboardProps) {
  // Manual draft states
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<FbPost | null>(null);
  const [captionEdit, setCaptionEdit] = useState("");
  const [cronRunning, setCronRunning] = useState(false);
  const [cronSuccessMsg, setCronSuccessMsg] = useState("");

  const activeCampaigns = campaigns.filter((c) => c.isActive);
  const totalPublished = posts.filter((p) => p.status === "published").length;
  const totalLikes = posts.filter((p) => p.status === "published").reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const totalComments = posts.filter((p) => p.status === "published").reduce((acc, curr) => acc + (curr.comments || 0), 0);

  const handleCronTrigger = async () => {
    setCronRunning(true);
    setCronSuccessMsg("");
    try {
      await onTriggerCron();
      setCronSuccessMsg("Automation run completed! Generated post published to Facebook log history.");
      setTimeout(() => setCronSuccessMsg(""), 5000);
    } catch (e: any) {
      console.error(e);
    } finally {
      setCronRunning(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!selectedCampaignId) return;
    setIsGenerating(true);
    setGeneratedDraft(null);
    try {
      const draft = await onGenerateManualDraft(selectedCampaignId);
      setGeneratedDraft(draft);
      setCaptionEdit(draft.caption);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleForcePublish = () => {
    if (!generatedDraft) return;
    // Set custom text caption before publishing
    generatedDraft.caption = captionEdit;
    onTriggerPublish(generatedDraft.id);
    setGeneratedDraft(null);
  };

  // Pre-fill selected campaign default
  React.useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0].id);
    }
  }, [campaigns]);

  return (
    <div id="publishing-dashboard-view" className="space-y-6">
      {/* 1. Automated Cron Runner Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-indigo-200 tracking-wider uppercase font-mono">AUTOMATION WORKER SPEED</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Daily Campaign Automater</h2>
          <p className="text-slate-300 text-sm max-w-xl">
            AutoSocial generates highly relevant captions and matching visual graphics every day. Clicking the automation bypass triggers immediate cron scheduling loops.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
          <button
            id="btn-trigger-cron"
            disabled={cronRunning}
            onClick={handleCronTrigger}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-md active:scale-95 disabled:opacity-55"
          >
            {cronRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Working AI Engine...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Trigger Automation Loop (Post Daily Now)
              </>
            )}
          </button>
          <span className="text-[11px] text-slate-400">
            {activeCampaigns.length} Campaigns Active • {settings.isSimulated ? "Simulation Sandboxed" : "Live Page Mode"}
          </span>
        </div>
      </div>

      {cronSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500shrink-0" />
          <span>{cronSuccessMsg}</span>
        </div>
      )}

      {/* 2. Key Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total campaigns */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Campaigns</span>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{campaigns.length}</p>
          </div>
        </div>

        {/* Facebook Page */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <img
            src={settings.connectedPageAvatar || "https://picsum.photos/seed/fbpage/120/120"}
            referrerPolicy="no-referrer"
            alt="Facebook Page Avatar"
            className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-50"
          />
          <div className="truncate">
            <span className="text-xs text-slate-500 font-medium">Facebook Channel</span>
            <p className="text-sm font-bold text-slate-800 truncate mt-0.5">
              {settings.isSimulated ? "Sandbox Simulation" : settings.connectedPageName || "Connected Page"}
            </p>
          </div>
        </div>

        {/* Total published */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Published Updates</span>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{totalPublished}</p>
          </div>
        </div>

        {/* Total engagement */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center border border-pink-100">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium font-sans">Accumulated Likes</span>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{totalLikes} reactions</p>
          </div>
        </div>
      </div>

      {/* 3. Bottom Columns: Creator Hub + Live Feed preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column A: Manual Creator Hub */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">On-Demand Dispatcher</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select an active campaign style, then query the Gemini content model to output a bespoke graphic post blueprint immediately.
            </p>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-dashed text-center rounded-lg text-slate-500 text-xs">
              Configure a Campaign first in active tabs to run drafts.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">Select Target Identity</label>
                <select
                  id="select-draft-campaign"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mood})
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="btn-trigger-manual-ai"
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition shadow-sm disabled:opacity-55"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Bespoke Creative Generation...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> AI Compose Unique Post Draft
                  </>
                )}
              </button>

              {/* Created draft workspace */}
              {generatedDraft && (
                <div id="draft-workspace-container" className="bg-indigo-50/50 border border-indigo-150 p-4 rounded-xl space-y-4 transition">
                  <h4 className="text-xs font-bold text-indigo-900 tracking-wider uppercase font-mono">Bespoke Workspace Editor</h4>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600 block">Edit Generated Copy</label>
                    <textarea
                      id="text-caption-edit"
                      value={captionEdit}
                      onChange={(e) => setCaptionEdit(e.target.value)}
                      rows={5}
                      className="w-full p-3 border border-indigo-100 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
                    />
                  </div>

                  <div className="flex gap-4 items-center flex-wrap md:flex-nowrap">
                    <img
                      src={generatedDraft.imageUrl}
                      alt="Generated Graphic"
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-lg object-cover border border-slate-200 bg-slate-100"
                    />
                    <div className="text-xs text-slate-500 space-y-1">
                      <span className="font-semibold block text-slate-700">Art Generator Prompter:</span>
                      <p className="italic font-sans line-clamp-3">"{generatedDraft.imagePrompt}"</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 font-bold rounded-sm uppercase text-[9px]">
                        {generatedDraft.imageSource} source
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2 border-t border-indigo-150">
                    <button
                      id="btn-delete-draft"
                      onClick={() => setGeneratedDraft(null)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                    >
                      Delete
                    </button>
                    <button
                      id="btn-send-draft-fb"
                      onClick={handleForcePublish}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded transition shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" /> Publish to Facebook Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Column B: Interactive Live Feed Simulator */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Connected Platform Monitor</h3>
            <p className="text-xs text-slate-500 mt-1">
              Provides a localized aesthetic rendering of your active target Page. See what fans see on Facebook.
            </p>
          </div>

          <div id="mock-feed-scroll" className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {posts.filter((p) => p.status === "published").length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-150 rounded-lg text-slate-500 text-xs">
                No items in published logs yet. Launch campaigns or run quick dispatchers to monitor immediate feed layout rendering.
              </div>
            ) : (
              posts
                .filter((p) => p.status === "published")
                .map((post) => (
                  <div
                    id={`feed-post-${post.id}`}
                    key={post.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs font-sans text-sm"
                  >
                    {/* Page header */}
                    <div className="p-3.5 flex items-center gap-2.5 border-b border-slate-100">
                      <img
                        src={settings.connectedPageAvatar || "https://picsum.photos/seed/fbpage/120/120"}
                        referrerPolicy="no-referrer"
                        alt="Facebook Avatar"
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 leading-none">
                          {settings.isSimulated ? "AI Sandbox Channel" : settings.connectedPageName || "Facebook Page"}
                        </h4>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Published via AutoSocial • {post.publishedTime ? new Date(post.publishedTime).toLocaleDateString() : "Today"}
                        </span>
                      </div>
                    </div>

                    {/* Content copy */}
                    <div className="p-3.5 space-y-3">
                      <p className="text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">{post.caption}</p>
                      
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-slate-150 bg-slate-50">
                        <img
                          src={post.imageUrl}
                          alt="Post accompaniment"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Sim Action Metrics */}
                    <div className="bg-slate-50 border-t border-slate-150 px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        {post.likes || 4} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        {post.comments || 1} comments
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
