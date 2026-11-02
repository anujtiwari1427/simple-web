"use client";

import { useState, useEffect } from "react";
import { Shield, Plus, Trash2, Edit, Save, CheckCircle2, FileText, Bell, Sparkles, BookOpen, Layers } from "lucide-react";
import { initialResources } from "@/data/resourcesData";
import { initialUpdates } from "@/data/updatesData";
import { Resource, UpdateAnnouncement, ResourceTopic, ResourceType, Difficulty } from "@/types";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"resources" | "announcements" | "stats">("resources");
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [updates, setUpdates] = useState<UpdateAnnouncement[]>(initialUpdates);
  const [statusMessage, setStatusMessage] = useState("");

  // New Resource Form state
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    title: "",
    topic: "DSA",
    type: "Cheat Sheet",
    difficulty: "Beginner",
    description: "",
    tags: ["DSA", "Beginner"],
    fileSize: "3.5 MB",
    downloadUrl: "#download",
    keyTakeaways: ["Clear breakdown of concepts", "Interview ready templates"]
  });

  // New Announcement Form state
  const [newUpdate, setNewUpdate] = useState<Partial<UpdateAnnouncement>>({
    title: "",
    category: "Resource",
    description: "",
    badge: "New Release",
    linkText: "Check it out",
    linkUrl: "/resources"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRes = localStorage.getItem("codedecoded_custom_resources");
      if (savedRes) {
        try {
          const parsed = JSON.parse(savedRes);
          setResources([...parsed, ...initialResources]);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.description) return;

    const resourceToAdd: Resource = {
      id: `custom-res-${Date.now()}`,
      slug: (newResource.title || "new-resource")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      title: newResource.title || "",
      description: newResource.description || "",
      topic: (newResource.topic as ResourceTopic) || "DSA",
      type: (newResource.type as ResourceType) || "Cheat Sheet",
      difficulty: (newResource.difficulty as Difficulty) || "Beginner",
      tags: newResource.tags || ["Coding"],
      downloadUrl: newResource.downloadUrl || "#download",
      downloadsCount: 1,
      isNew: true,
      publishedAt: new Date().toISOString().split("T")[0],
      fileSize: newResource.fileSize || "2.5 MB",
      author: "Code Decoded Admin",
      keyTakeaways: newResource.keyTakeaways || ["Key concepts decoded"]
    };

    const updated = [resourceToAdd, ...resources];
    setResources(updated);

    if (typeof window !== "undefined") {
      const customOnly = updated.filter(r => r.id.startsWith("custom-res-"));
      localStorage.setItem("codedecoded_custom_resources", JSON.stringify(customOnly));
    }

    setStatusMessage(`✓ Successfully added "${resourceToAdd.title}"! It is now live in the Resources Hub.`);
    setTimeout(() => setStatusMessage(""), 4000);

    setNewResource({
      title: "",
      topic: "DSA",
      type: "Cheat Sheet",
      difficulty: "Beginner",
      description: "",
      tags: ["DSA"],
      fileSize: "3.5 MB",
      downloadUrl: "#download",
      keyTakeaways: ["Key concepts decoded"]
    });
  };

  const handleDeleteResource = (id: string) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      const updated = resources.filter(r => r.id !== id);
      setResources(updated);
      if (typeof window !== "undefined") {
        const customOnly = updated.filter(r => r.id.startsWith("custom-res-"));
        localStorage.setItem("codedecoded_custom_resources", JSON.stringify(customOnly));
      }
      setStatusMessage("Resource removed.");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.title || !newUpdate.description) return;

    const announcementToAdd: UpdateAnnouncement = {
      id: `update-${Date.now()}`,
      title: newUpdate.title || "",
      category: newUpdate.category || "News",
      date: new Date().toISOString().split("T")[0],
      description: newUpdate.description || "",
      linkText: newUpdate.linkText,
      linkUrl: newUpdate.linkUrl,
      badge: newUpdate.badge
    };

    setUpdates([announcementToAdd, ...updates]);
    setStatusMessage(`✓ Successfully published announcement "${announcementToAdd.title}"!`);
    setTimeout(() => setStatusMessage(""), 4000);

    setNewUpdate({
      title: "",
      category: "Resource",
      description: "",
      badge: "New Release",
      linkText: "Check it out",
      linkUrl: "/resources"
    });
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Platform Content Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Add and edit study resources, publish updates, and view live metrics in real-time.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "resources"
                  ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Resources ({resources.length})
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "announcements"
                  ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Announcements ({updates.length})
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "stats"
                  ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Overview Stats
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* TAB 1: RESOURCES */}
        {activeTab === "resources" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Add Resource Form */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg h-fit space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-500" />
                <span>Add New Resource</span>
              </h2>

              <form onSubmit={handleAddResource} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newResource.title}
                    onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                    placeholder="e.g. Next.js 16 Production Architecture"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Topic
                    </label>
                    <select
                      value={newResource.topic}
                      onChange={e => setNewResource({ ...newResource, topic: e.target.value as ResourceTopic })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="DSA">DSA</option>
                      <option value="Web Dev">Web Dev</option>
                      <option value="Python">Python</option>
                      <option value="Data Science">Data Science</option>
                      <option value="DBMS">DBMS</option>
                      <option value="Interview Prep">Interview Prep</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Resource Type
                    </label>
                    <select
                      value={newResource.type}
                      onChange={e => setNewResource({ ...newResource, type: e.target.value as ResourceType })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="Cheat Sheet">Cheat Sheet</option>
                      <option value="PDF">PDF</option>
                      <option value="Notes">Notes</option>
                      <option value="GitHub Repo">GitHub Repo</option>
                      <option value="Tool">Tool</option>
                      <option value="Free Course">Free Course</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={newResource.difficulty}
                      onChange={e => setNewResource({ ...newResource, difficulty: e.target.value as Difficulty })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Estimated File Size
                    </label>
                    <input
                      type="text"
                      value={newResource.fileSize}
                      onChange={e => setNewResource({ ...newResource, fileSize: e.target.value })}
                      placeholder="e.g. 4.2 MB"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Summary & Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newResource.description}
                    onChange={e => setNewResource({ ...newResource, description: e.target.value })}
                    placeholder="Short summary of what this guide explains..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish to Resources Hub</span>
                </button>
              </form>
            </div>

            {/* Existing Resources List */}
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Library ({resources.length} items)
              </h2>

              <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
                {resources.map(res => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {res.topic}
                        </span>
                        <span className="text-[10px] font-medium text-cyan-600 dark:text-cyan-400">
                          {res.type}
                        </span>
                        {res.isNew && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-cyan-500 text-slate-950 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-1">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">{res.description}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteResource(res.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition shrink-0"
                      title="Delete resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANNOUNCEMENTS */}
        {activeTab === "announcements" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg h-fit space-y-4 text-xs">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-500" />
                <span>Publish Announcement</span>
              </h2>

              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUpdate.title}
                    onChange={e => setNewUpdate({ ...newUpdate, title: e.target.value })}
                    placeholder="e.g. New YouTube Video: LeetCode Patterns"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newUpdate.category}
                      onChange={e => setNewUpdate({ ...newUpdate, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="YouTube">YouTube</option>
                      <option value="Resource">Resource</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Event">Event</option>
                      <option value="News">News</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={newUpdate.badge}
                      onChange={e => setNewUpdate({ ...newUpdate, badge: e.target.value })}
                      placeholder="e.g. Milestone, Trending"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newUpdate.description}
                    onChange={e => setNewUpdate({ ...newUpdate, description: e.target.value })}
                    placeholder="What is this update about?"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish to Timeline</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Timeline Updates ({updates.length})
              </h2>

              <div className="space-y-3">
                {updates.map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STATS */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Resources</p>
              <p className="text-3xl font-extrabold text-cyan-500">{resources.length}</p>
              <p className="text-xs text-slate-400">Available in Free Library</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Downloads</p>
              <p className="text-3xl font-extrabold text-emerald-500">
                {resources.reduce((acc, r) => acc + r.downloadsCount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">Cheat sheets & PDFs</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Community Reach</p>
              <p className="text-3xl font-extrabold text-purple-500">75,000+</p>
              <p className="text-xs text-slate-400">Instagram & YouTube</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Interactive Roadmaps</p>
              <p className="text-3xl font-extrabold text-amber-500">3</p>
              <p className="text-xs text-slate-400">Web Dev, DSA, Data Science</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
