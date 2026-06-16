import React, { useState } from "react";
import { Clock, Eye, AlertTriangle, CheckCircle2, ChevronRight, MessageSquare, ThumbsUp, Share2, HelpCircle, FileJson, X } from "lucide-react";
import { FbPost } from "../types";

interface SchedulerQueueProps {
  posts: FbPost[];
  onTriggerPublish: (id: string) => void;
}

export default function SchedulerQueue({ posts, onTriggerPublish }: SchedulerQueueProps) {
  const [activeTab, setActiveTab] = useState<"queue" | "history">("queue");
  const [inspectPost, setInspectPost] = useState<FbPost | null>(null);

  const getStatusBadge = (status: FbPost["status"]) => {
    switch (status) {
      case "published":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Published
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      case "scheduled":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> Scheduled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" /> Draft
          </span>
        );
    }
  };

  const queuePosts = posts
    .filter((p) => p.status === "scheduled" || p.status === "draft")
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

  const historyPosts = posts
    .filter((p) => p.status === "published" || p.status === "failed")
    .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime());

  return (
    <div id="scheduler-queue-view" className="space-y-6">
      {/* Tab controls */}
      <div className="flex border-b border-slate-200">
        <button
          id="btn-tab-queue"
          onClick={() => setActiveTab("queue")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition ${
            activeTab === "queue"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          Scheduled Queue backlog ({queuePosts.length})
        </button>
        <button
          id="btn-tab-history"
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition ${
            activeTab === "history"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          Publish log history ({historyPosts.length})
        </button>
      </div>

      {/* Queue View */}
      {activeTab === "queue" && (
        <div id="queue-container" className="space-y-4">
          {queuePosts.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-xl text-center">
              <Clock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-700">No scheduled content</h4>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Trigger content generation or enable active campaigns to automatically construct tomorrow's queue backlog!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {queuePosts.map((post) => (
                <div
                  id={`queue-post-card-${post.id}`}
                  key={post.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold py-1 px-2.5 bg-slate-100 text-slate-700 rounded-md">
                        {post.campaignName}
                      </span>
                      {getStatusBadge(post.status)}
                    </div>

                    <div className="flex gap-3">
                      <img
                        src={post.imageUrl}
                        alt="AI Art Asset Preview"
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Planned Release: {new Date(post.scheduledTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-700 line-clamp-3 font-sans leading-relaxed">
                          {post.caption}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
                    <button
                      id={`btn-inspect-post-${post.id}`}
                      onClick={() => setInspectPost(post)}
                      className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview Draft
                    </button>
                    <button
                      id={`btn-publish-now-${post.id}`}
                      onClick={() => onTriggerPublish(post.id)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition shadow-sm"
                    >
                      Publish right now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History View */}
      {activeTab === "history" && (
        <div id="history-container" className="space-y-4">
          {historyPosts.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-xl text-center">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-700">No published results yet</h4>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Once scheduled posts trigger or are force-published, their details and live metrics will be logged here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {historyPosts.map((post) => (
                <div
                  id={`history-post-row-${post.id}`}
                  key={post.id}
                  className="p-4 hover:bg-slate-50/50 transition flex items-center gap-4 flex-wrap md:flex-nowrap justify-between"
                >
                  <div className="flex items-start gap-3 w-full md:w-3/5">
                    <img
                      src={post.imageUrl}
                      alt="AI generated"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0 mt-0.5"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-500">
                          {post.campaignName}
                        </span>
                        <span className="text-slate-300">•</span>
                        <p className="text-xs text-slate-400">
                          {post.publishedTime ? new Date(post.publishedTime).toLocaleString() : "Date unknown"}
                        </p>
                        {getStatusBadge(post.status)}
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed font-sans">
                        {post.caption}
                      </p>
                      {post.fbPostId && (
                        <p className="text-xs text-indigo-500 font-mono">ID: {post.fbPostId}</p>
                      )}
                      {post.errorMessage && (
                        <p className="text-xs text-rose-500 bg-rose-50 p-1.5 rounded">{post.errorMessage}</p>
                      )}
                    </div>
                  </div>

                  {/* Metrics and logs buttons */}
                  <div className="flex items-center gap-6 shrink-0 justify-between w-full md:w-auto md:border-l border-slate-100 md:pl-6">
                    {post.status === "published" && (
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1" title="Simulated Facebook Likes">
                          <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                          {post.likes || 0}
                        </span>
                        <span className="flex items-center gap-1" title="Simulated Facebook Comments">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          {post.comments || 0}
                        </span>
                        <span className="flex items-center gap-1" title="Simulated Facebook Shares">
                          <Share2 className="w-3.5 h-3.5 text-slate-400" />
                          {post.shares || 0}
                        </span>
                      </div>
                    )}

                    <button
                      id={`btn-inspect-payload-${post.id}`}
                      onClick={() => setInspectPost(post)}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1 hover:underline"
                    >
                      <FileJson className="w-3.5 h-3.5" /> API payload logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INSPECT DETAIL MODAL */}
      {inspectPost && (
        <div id="inspector-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <dt className="text-xs font-semibold text-slate-400 font-mono">POST PREVIEW & API AUDIT</dt>
                <h3 className="font-bold text-slate-800 text-md mt-0.5">{inspectPost.campaignName}</h3>
              </div>
              <button
                id="btn-close-modal"
                onClick={() => setInspectPost(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-150 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
              {/* Layout design resembling a Facebook Post Card */}
              <div className="border border-slate-250 rounded-xl overflow-hidden shadow-xs bg-white">
                <div className="p-4 flex items-center gap-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                    AI
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-none">Campaign Channel</h4>
                    <span className="text-xs text-slate-400 block mt-1">Scheduled for Facebook Pages • AI Generated</span>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <p className="whitespace-pre-wrap leading-relaxed text-slate-800 font-sans">
                    {inspectPost.caption}
                  </p>
                  
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-slate-150 bg-slate-50">
                    <img
                      src={inspectPost.imageUrl}
                      alt="AI generated companion artwork"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {inspectPost.imagePrompt && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-600 block mb-1">Generated matching visual instructions:</span>
                    <p className="text-xs text-slate-500 italic">"{inspectPost.imagePrompt}"</p>
                  </div>
                )}
              </div>

              {/* API raw log section */}
              {inspectPost.apiPayloadLog && (
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <h4 className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
                    <FileJson className="w-4 h-4 text-indigo-500" />
                    GRAPH API INTEGRATION TELEMETRY LOGS (RAW CAPTURED DATA)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Captured Request Pipeline</span>
                      <pre className="text-xs bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto max-h-48 font-mono">
                        {inspectPost.apiPayloadLog}
                      </pre>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Facebook Node Server Response</span>
                      <pre className="text-xs bg-slate-900 text-emerald-300 p-3 rounded-lg overflow-x-auto max-h-48 font-mono">
                        {inspectPost.apiResponseLog}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-150 flex justify-end">
              <button
                id="btn-close-modal-bottom"
                onClick={() => setInspectPost(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold transition"
              >
                Close Audit Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
