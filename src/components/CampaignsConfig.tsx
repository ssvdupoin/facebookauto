import React, { useState } from "react";
import { Plus, Trash2, Calendar, Smile, Settings, ToggleLeft, ToggleRight, Sparkles, AlertCircle, Edit, Check } from "lucide-react";
import { Campaign } from "../types";

interface CampaignsConfigProps {
  campaigns: Campaign[];
  onAddCampaign: (campaign: Omit<Campaign, "id" | "createdAt">) => void;
  onUpdateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  onDeleteCampaign: (id: string) => void;
}

export default function CampaignsConfig({
  campaigns,
  onAddCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
}: CampaignsConfigProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [mood, setMood] = useState<Campaign["mood"]>("playful");
  const [postingHour, setPostingHour] = useState("09:00");
  const [imagePromptAddition, setImagePromptAddition] = useState("");

  const resetForm = () => {
    setName("");
    setNiche("");
    setMood("playful");
    setPostingHour("09:00");
    setImagePromptAddition("");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !niche) return;
    onAddCampaign({
      name,
      niche,
      mood,
      postingHour,
      isActive: true,
      imagePromptAddition,
    });
    resetForm();
    setIsAdding(false);
  };

  const startEdit = (c: Campaign) => {
    setEditingId(c.id);
    setName(c.name);
    setNiche(c.niche);
    setMood(c.mood);
    setPostingHour(c.postingHour);
    setImagePromptAddition(c.imagePromptAddition || "");
  };

  const handleSaveEdit = (id: string) => {
    onUpdateCampaign(id, {
      name,
      niche,
      mood,
      postingHour,
      imagePromptAddition,
    });
    setEditingId(null);
    resetForm();
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div id="campaigns-config-view" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="campaigns-heading" className="text-xl font-semibold text-slate-800 tracking-tight">Active Campaigns</h2>
          <p className="text-sm text-slate-500">Each campaign is dedicated to a distinct brand identity, automated tone, and target schedule.</p>
        </div>
        <button
          id="btn-new-campaign"
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Cancel" : "Add Campaign"}
        </button>
      </div>

      {/* Add Campaign Form */}
      {isAdding && (
        <form
          id="form-add-campaign"
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 transition duration-200"
        >
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-md">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Configure Brand Campaign
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Campaign Name</label>
              <input
                id="input-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Daily Tech Dev Tips"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Daily Posting Hour (24h)</label>
              <input
                id="input-posting-hour"
                type="time"
                value={postingHour}
                onChange={(e) => setPostingHour(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 font-sans">Niche, Brand Goal, or Core Topics</label>
              <textarea
                id="input-niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Describe your audience. Example: Smart eco-friendly home improvement tactics, recycled furniture DIY blueprints, and daily green hacks."
                required
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Post Attitude & Mood</label>
              <select
                id="input-mood"
                value={mood}
                onChange={(e) => setMood(e.target.value as Campaign["mood"])}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="playful">Playful / Witty / Humorist</option>
                <option value="informative">Informative / Educational / Fact-rich</option>
                <option value="inspiring">Inspiring / Motivating / Uplifting</option>
                <option value="professional">Professional / Executive / Authority</option>
                <option value="sarcastic">Sarcastic / Edgy Tech Nerd</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">AI Graphics Enhancement style descriptor</label>
              <input
                id="input-image-style"
                type="text"
                value={imagePromptAddition}
                onChange={(e) => setImagePromptAddition(e.target.value)}
                placeholder="e.g. minimalist flat 3D vectors typography art, neon synthwave background"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              id="btn-cancel-campaign"
              type="button"
              onClick={() => {
                setIsAdding(false);
                resetForm();
              }}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              id="btn-submit-campaign"
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
            >
              Start Automated Campaign
            </button>
          </div>
        </form>
      )}

      {/* Campaigns Listing */}
      <div id="campaigns-grid-container" className="grid grid-cols-1 gap-4">
        {campaigns.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-700">No campaigns launched yet</h4>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Click "Add Campaign" above to build your first AI creator pipeline.</p>
          </div>
        ) : (
          campaigns.map((c) => {
            const isEditing = editingId === c.id;

            return (
              <div
                id={`campaign-card-${c.id}`}
                key={c.id}
                className={`bg-white rounded-xl border p-5 shadow-sm space-y-4 transition-all duration-200 ${
                  c.isActive ? "border-slate-200 hover:shadow" : "border-slate-150 bg-slate-50/50 opacity-80"
                }`}
              >
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Name</label>
                        <input
                          id={`edit-name-${c.id}`}
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Daily Posting Hour</label>
                        <input
                          id={`edit-time-${c.id}`}
                          type="time"
                          value={postingHour}
                          onChange={(e) => setPostingHour(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-slate-500">Target Niche</label>
                        <textarea
                          id={`edit-niche-${c.id}`}
                          value={niche}
                          onChange={(e) => setNiche(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Attitude & Tone Mood</label>
                        <select
                          id={`edit-mood-${c.id}`}
                          value={mood}
                          onChange={(e) => setMood(e.target.value as Campaign["mood"])}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="playful">Playful / Witty / Humorist</option>
                          <option value="informative">Informative / Educational</option>
                          <option value="inspiring">Inspiring / Motivation</option>
                          <option value="professional">Professional / Executive</option>
                          <option value="sarcastic">Sarcastic / Edgy Tech Nerd</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">AI Graphics Enhancement style descriptor</label>
                        <input
                          id={`edit-graphics-${c.id}`}
                          type="text"
                          value={imagePromptAddition}
                          onChange={(e) => setImagePromptAddition(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        id="btn-edit-cancel"
                        onClick={cancelEdit}
                        className="px-3 py-1 text-xs border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        id="btn-edit-save"
                        onClick={() => handleSaveEdit(c.id)}
                        className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800 text-base">{c.name}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${
                              c.mood === "inspiring"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : c.mood === "playful"
                                ? "bg-pink-50 text-pink-700 border border-pink-200"
                                : c.mood === "informative"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : c.mood === "professional"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            <Smile className="w-3 h-3" />
                            {c.mood}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-sans mt-1">{c.niche}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Hour scheduler indicator */}
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 bg-slate-100/55 px-2.5 py-1 rounded-md">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-700">{c.postingHour} Daily</span>
                        </div>

                        {/* Toggle active switch */}
                        <button
                          id={`toggle-active-${c.id}`}
                          onClick={() => onUpdateCampaign(c.id, { isActive: !c.isActive })}
                          className="focus:outline-none"
                          title={c.isActive ? "Pause automation loop" : "Begin automation loop"}
                        >
                          {c.isActive ? (
                            <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
                              <ToggleRight className="w-10 h-10 cursor-pointer" />
                              <span className="sr-only">Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-slate-400 font-medium text-sm">
                              <ToggleLeft className="w-10 h-10 cursor-pointer" />
                              <span className="sr-only">Paused</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    {c.imagePromptAddition && (
                      <div className="bg-slate-50 p-2.5 rounded-lg text-slate-500 border border-slate-150 inline-block text-xs">
                        <span className="font-semibold text-slate-700 mr-1 font-sans">Graphics Style Modifier:</span>
                        "{c.imagePromptAddition}"
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2 text-xs">
                      <span className="text-slate-400">Launched on {new Date(c.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <button
                          id={`btn-edit-${c.id}`}
                          onClick={() => startEdit(c)}
                          className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-indigo-600 bg-slate-100 rounded hover:bg-slate-200 transition font-medium"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          id={`btn-delete-${c.id}`}
                          onClick={() => onDeleteCampaign(c.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded transition font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
