"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  FileText,
  Bell,
  Sparkles,
  BookOpen,
  DollarSign,
  CreditCard,
  Lock,
  Layers,
  ArrowUpRight,
  Receipt,
  Download,
  AlertCircle,
  LogOut,
  Key,
  Eye,
  EyeOff
} from "lucide-react";
import { initialResources } from "@/data/resourcesData";
import { initialUpdates } from "@/data/updatesData";
import { Resource, UpdateAnnouncement, ResourceTopic, ResourceType, Difficulty, Order } from "@/types";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"resources" | "orders" | "gateway" | "security" | "announcements" | "stats">("resources");
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [updates, setUpdates] = useState<UpdateAnnouncement[]>(initialUpdates);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  // Admin authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Change Password state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passChangeStatus, setPassChangeStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Uploading state
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    fileName: string;
    fileSize: string;
    url: string;
  } | null>(null);

  // New Resource Form state
  const [newResource, setNewResource] = useState<{
    title: string;
    topic: ResourceTopic;
    type: ResourceType;
    difficulty: Difficulty;
    description: string;
    tags: string[];
    fileSize: string;
    fileUrl: string;
    downloadUrl: string;
    isPaid: boolean;
    price: number;
    originalPrice: number;
    keyTakeaways: string[];
  }>({
    title: "",
    topic: "DSA",
    type: "PDF",
    difficulty: "Beginner",
    description: "",
    tags: ["DSA", "PDF"],
    fileSize: "4.2 MB",
    fileUrl: "",
    downloadUrl: "#download",
    isPaid: true,
    price: 99,
    originalPrice: 299,
    keyTakeaways: ["Complete visual concept breakdown", "Interview patterns & cheat notes"]
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

  // Gateway Settings Form state
  const [gatewayForm, setGatewayForm] = useState({
    upiId: "codedecoded@upi",
    upiName: "Code Decoded",
    razorpayKeyId: "",
    razorpayKeySecret: "",
    preferredMethod: "both"
  });
  const [savingGateway, setSavingGateway] = useState(false);

  useEffect(() => {
    // Check admin authentication session
    fetch("/api/admin/check-auth")
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(Boolean(data?.authenticated));
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setCheckingAuth(false);
      });

    // Load gateway settings
    fetch("/api/admin/gateway-settings")
      .then(res => res.json())
      .then(data => {
        if (data?.config) {
          setGatewayForm({
            upiId: data.config.upiId || "codedecoded@upi",
            upiName: data.config.upiName || "Code Decoded",
            razorpayKeyId: data.config.rawRazorpayKeyId || "",
            razorpayKeySecret: "",
            preferredMethod: data.config.preferredMethod || "both"
          });
        }
      })
      .catch(() => {});
    if (typeof window !== "undefined") {
      // 1. Load custom resources
      const savedRes = localStorage.getItem("codedecoded_custom_resources");
      if (savedRes) {
        try {
          const parsed = JSON.parse(savedRes);
          setResources([...parsed, ...initialResources]);
        } catch {
          // ignore
        }
      }

      // 2. Load orders
      const savedOrders = localStorage.getItem("codedecoded_all_orders");
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch {
          setOrders([]);
        }
      } else {
        // Initial sample seed orders so dashboard looks realistic immediately
        const initialSeedOrders: Order[] = [
          {
            id: "ord_demo_101",
            orderId: "order_cd_8f912a7b3c",
            paymentId: "pay_live_981240182",
            resourceId: "res-1",
            resourceTitle: "The Ultimate DSA Decoded Cheatsheet",
            amount: 99,
            currency: "INR",
            status: "paid",
            customerName: "Rohan Verma",
            customerEmail: "rohan.v@gmail.com",
            customerPhone: "+91 98765 43210",
            paymentMethod: "upi",
            downloadUrl: "/downloads/dsa-cheatsheet.pdf",
            createdAt: "2026-11-13T14:30:00Z"
          },
          {
            id: "ord_demo_102",
            orderId: "order_cd_4e881c991d",
            paymentId: "pay_live_449102819",
            resourceId: "res-4",
            resourceTitle: "DBMS & SQL Interview Bible",
            amount: 149,
            currency: "INR",
            status: "paid",
            customerName: "Ananya Deshmukh",
            customerEmail: "ananya.d@outlook.com",
            customerPhone: "+91 91234 56789",
            paymentMethod: "card",
            downloadUrl: "/downloads/sql-bible.pdf",
            createdAt: "2026-11-12T09:15:00Z"
          }
        ];
        setOrders(initialSeedOrders);
        localStorage.setItem("codedecoded_all_orders", JSON.stringify(initialSeedOrders));
      }
    }
  }, []);

  // Handle actual PDF file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadedFileInfo({
        fileName: data.fileName,
        fileSize: data.fileSize,
        url: data.url
      });

      setNewResource(prev => ({
        ...prev,
        title: prev.title || data.fileName.replace(/\.pdf$/i, "").replace(/[-_]/g, " "),
        fileSize: data.fileSize,
        fileUrl: data.url,
        downloadUrl: data.url
      }));

      setStatusMessage(`✓ PDF "${data.fileName}" uploaded successfully (${data.fileSize})!`);
      setTimeout(() => setStatusMessage(""), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      alert(msg);
    } finally {
      setUploadingFile(false);
    }
  };

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
      topic: newResource.topic,
      type: newResource.type,
      difficulty: newResource.difficulty,
      tags: newResource.tags,
      downloadUrl: newResource.downloadUrl || newResource.fileUrl || "#download",
      fileUrl: newResource.fileUrl,
      downloadsCount: 0,
      isNew: true,
      publishedAt: new Date().toISOString().split("T")[0],
      fileSize: newResource.fileSize || "3.5 MB",
      author: "Code Decoded Admin",
      keyTakeaways: newResource.keyTakeaways,
      isPaid: newResource.isPaid,
      price: newResource.isPaid ? Number(newResource.price) : 0,
      originalPrice: newResource.isPaid ? Number(newResource.originalPrice) : undefined
    };

    const updated = [resourceToAdd, ...resources];
    setResources(updated);

    if (typeof window !== "undefined") {
      const customOnly = updated.filter(r => r.id.startsWith("custom-res-"));
      localStorage.setItem("codedecoded_custom_resources", JSON.stringify(customOnly));
    }

    setStatusMessage(
      `✓ Successfully added "${resourceToAdd.title}" (${
        resourceToAdd.isPaid ? `Paid ₹${resourceToAdd.price}` : "Free"
      })! Live in Resources Hub.`
    );
    setTimeout(() => setStatusMessage(""), 4000);

    // Reset
    setUploadedFileInfo(null);
    setNewResource({
      title: "",
      topic: "DSA",
      type: "PDF",
      difficulty: "Beginner",
      description: "",
      tags: ["DSA", "PDF"],
      fileSize: "4.2 MB",
      fileUrl: "",
      downloadUrl: "#download",
      isPaid: true,
      price: 99,
      originalPrice: 299,
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setLoginPassword("");
        setStatusMessage("✓ Welcome back, Admin! Access granted.");
        setTimeout(() => setStatusMessage(""), 4000);
      } else {
        setLoginError(data.error || "Incorrect password. Default is admin123");
      }
    } catch {
      setLoginError("Could not reach authentication server.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      setIsAuthenticated(false);
      setStatusMessage("Logged out successfully.");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeStatus(null);
    if (newPass !== confirmPass) {
      setPassChangeStatus({ type: "error", msg: "New passwords do not match." });
      return;
    }
    if (newPass.length < 4) {
      setPassChangeStatus({ type: "error", msg: "Password must be at least 4 characters long." });
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassChangeStatus({ type: "success", msg: "✓ Admin passcode updated successfully!" });
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        setPassChangeStatus({ type: "error", msg: data.error || "Failed to update passcode." });
      }
    } catch {
      setPassChangeStatus({ type: "error", msg: "Network error while updating passcode." });
    } finally {
      setChangingPassword(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status === "paid" ? o.amount : 0), 0);

  if (checkingAuth) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center animate-pulse mb-4">
          <Lock className="w-7 h-7 text-cyan-500" />
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Checking admin security credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle accent glows */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 mb-1">
                <Shield className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Admin Portal Login
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your admin passcode to manage resources, view student orders, and configure payment gateways.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Admin Passcode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    required
                    autoFocus
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loggingIn || !loginPassword}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-sky-500 hover:brightness-110 text-slate-950 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                <Lock className="w-4 h-4" />
                <span>{loggingIn ? "Verifying Passcode..." : "Unlock Dashboard"}</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                <Key className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span>Default passcode: <code className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">admin123</code></span>
              </div>
              <div>
                <a
                  href="/"
                  className="text-xs text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
                >
                  &larr; Return to Code Decoded Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Management & Monetization</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Authenticated</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Code Decoded Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Upload PDF resources, set pricing in INR, collect payments via Razorpay/UPI, and monitor sales.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab("resources")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              activeTab === "resources"
                ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Upload & Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1 ${
              activeTab === "orders"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Orders & Sales (₹{totalRevenue})</span>
          </button>
          <button
            onClick={() => setActiveTab("gateway")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1 ${
              activeTab === "gateway"
                ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment Gateway</span>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1 ${
              activeTab === "security"
                ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Admin Passcode</span>
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              activeTab === "announcements"
                ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              activeTab === "stats"
                ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Platform Stats
          </button>
        </div>

        {/* Status Toast Notification */}
        {statusMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* TAB 1: RESOURCES & PDF UPLOADS */}
        {activeTab === "resources" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Upload & Add Form */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 text-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-cyan-500" />
                  <span>Upload PDF & Set Price</span>
                </h2>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Upload your study material and configure free or paid access with instant checkout.
                </p>
              </div>

              {/* 1. PDF File Upload Box */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-500/60 transition text-center relative">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1.5 py-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  {uploadingFile ? (
                    <p className="text-cyan-600 dark:text-cyan-400 font-bold">Uploading file to server...</p>
                  ) : uploadedFileInfo ? (
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-[240px] mx-auto">
                        ✓ {uploadedFileInfo.fileName}
                      </p>
                      <p className="text-[10px] text-emerald-500 font-mono">
                        Ready ({uploadedFileInfo.fileSize})
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        Click or drag PDF here to upload
                      </p>
                      <p className="text-[10px] text-slate-400">PDF documents up to 50MB supported</p>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleAddResource} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newResource.title}
                    onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                    placeholder="e.g. Complete Dynamic Programming Patterns Handbook"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Topic & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Topic
                    </label>
                    <select
                      value={newResource.topic}
                      onChange={e => setNewResource({ ...newResource, topic: e.target.value as ResourceTopic })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
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
                      Type
                    </label>
                    <select
                      value={newResource.type}
                      onChange={e => setNewResource({ ...newResource, type: e.target.value as ResourceType })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="PDF">PDF</option>
                      <option value="Cheat Sheet">Cheat Sheet</option>
                      <option value="Notes">Notes</option>
                      <option value="Free Course">Course Guide</option>
                    </select>
                  </div>
                </div>

                {/* Free vs Paid Toggle */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Pricing Model</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNewResource({ ...newResource, isPaid: false, price: 0 })}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${
                          !newResource.isPaid
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        Free (₹0)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewResource({ ...newResource, isPaid: true, price: 99 })}
                        className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                          newResource.isPaid
                            ? "bg-amber-500 text-slate-950"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <Lock className="w-3 h-3" /> Paid (INR)
                      </button>
                    </div>
                  </div>

                  {newResource.isPaid && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Selling Price (₹) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={newResource.price}
                          onChange={e => setNewResource({ ...newResource, price: Number(e.target.value) })}
                          placeholder="e.g. 99"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Original Price / MRP (₹)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newResource.originalPrice}
                          onChange={e =>
                            setNewResource({ ...newResource, originalPrice: Number(e.target.value) })
                          }
                          placeholder="e.g. 299"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Summary & Highlights *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newResource.description}
                    onChange={e => setNewResource({ ...newResource, description: e.target.value })}
                    placeholder="Short summary of what this PDF explains..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Publish Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    Publish {newResource.isPaid ? `Paid Resource (₹${newResource.price})` : "Free Resource"}
                  </span>
                </button>
              </form>
            </div>

            {/* Existing Resources List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Published Library ({resources.length} items)
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  {resources.filter(r => r.isPaid).length} Paid • {resources.filter(r => !r.isPaid).length} Free
                </span>
              </div>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {resources.map(res => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {res.topic}
                        </span>
                        {res.isPaid ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-0.5 font-mono">
                            <Lock className="w-2.5 h-2.5" /> ₹{res.price}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                            Free
                          </span>
                        )}
                        {res.fileSize && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {res.fileSize}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-1">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">{res.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                        title="Delete resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS & SALES */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Sales Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Gross Revenue
                </span>
                <p className="text-3xl font-extrabold text-emerald-500 font-mono">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">From paid PDF downloads</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Completed Orders
                </span>
                <p className="text-3xl font-extrabold text-cyan-500 font-mono">
                  {orders.length}
                </p>
                <p className="text-xs text-slate-400">100% Verified Transactions</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Average Order Value (AOV)
                </span>
                <p className="text-3xl font-extrabold text-purple-500 font-mono">
                  ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}
                </p>
                <p className="text-xs text-slate-400">Affordable Indian Student Pricing</p>
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Customer Transactions Log
                </h3>
                <span className="text-xs text-slate-500">Live order sync</span>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No transactions yet. Purchases will appear here in real-time.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-mono uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Resource</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment ID / Order ID</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-4">
                            <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                            <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
                          </td>
                          <td className="p-4 font-medium text-slate-800 dark:text-slate-200 max-w-[220px] truncate">
                            {order.resourceTitle}
                          </td>
                          <td className="p-4 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            ₹{order.amount}
                          </td>
                          <td className="p-4 font-mono text-[11px] text-slate-500">
                            <p>{order.paymentId}</p>
                            <p className="text-[10px] text-slate-400">{order.orderId}</p>
                          </td>
                          <td className="p-4 font-mono text-slate-600 dark:text-slate-300">
                            {order.paymentMethod || "UPI"}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              ✓ Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT GATEWAY CONFIGURATION */}
        {activeTab === "gateway" && (
          <div className="max-w-4xl space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Real Payment Gateway Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure your real Indian UPI ID and Razorpay API credentials to receive payments directly.
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    Real Payments Active: Direct UPI + Official Razorpay
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Students can pay you directly via Google Pay, PhonePe, and Paytm UPI QR code, or through Razorpay card/netbanking gateway.
                  </p>
                </div>
              </div>

              {/* Live Gateway Settings Form */}
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  setSavingGateway(true);
                  try {
                    const res = await fetch("/api/admin/gateway-settings", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(gatewayForm)
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setStatusMessage("✓ Payment gateway settings saved! Real payments are active.");
                      setTimeout(() => setStatusMessage(""), 4000);
                    } else {
                      alert(data.error || "Failed to save settings");
                    }
                  } catch {
                    alert("Error saving settings");
                  } finally {
                    setSavingGateway(false);
                  }
                }}
                className="space-y-6 pt-2"
              >
                {/* 1. Direct UPI Configuration */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>1. Your Real UPI ID (Direct Bank Transfer)</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          0% Fee
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Students scan this QR in Google Pay, PhonePe, or Paytm and the money goes directly to your bank account!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your UPI ID / VPA *
                      </label>
                      <input
                        type="text"
                        required
                        value={gatewayForm.upiId}
                        onChange={e => setGatewayForm({ ...gatewayForm, upiId: e.target.value })}
                        placeholder="e.g. yourname@okaxis, 9876543210@paytm, codedecoded@upi"
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono font-bold text-cyan-600 dark:text-cyan-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Business / Payee Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={gatewayForm.upiName}
                        onChange={e => setGatewayForm({ ...gatewayForm, upiName: e.target.value })}
                        placeholder="e.g. Code Decoded"
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  {/* UPI QR Preview */}
                  <div className="pt-2 flex items-center gap-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                        `upi://pay?pa=${gatewayForm.upiId}&pn=${encodeURIComponent(gatewayForm.upiName)}&cu=INR`
                      )}`}
                      alt="Current UPI QR"
                      className="w-16 h-16 rounded-xl border border-slate-200 bg-white p-1 shrink-0"
                    />
                    <div className="text-xs text-slate-500">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Live UPI QR Preview:
                      </p>
                      <p className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
                        upi://pay?pa={gatewayForm.upiId}&pn={gatewayForm.upiName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Razorpay API Keys Configuration */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>2. Razorpay Payment Gateway (Cards, NetBanking, UPI)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your keys from{" "}
                      <a
                        href="https://dashboard.razorpay.com/app/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-500 underline"
                      >
                        Razorpay Dashboard &gt; Settings &gt; API Keys
                      </a>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Razorpay Key ID
                      </label>
                      <input
                        type="text"
                        value={gatewayForm.razorpayKeyId}
                        onChange={e => setGatewayForm({ ...gatewayForm, razorpayKeyId: e.target.value })}
                        placeholder="rzp_test_... or rzp_live_..."
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Razorpay Key Secret
                      </label>
                      <input
                        type="password"
                        value={gatewayForm.razorpayKeySecret}
                        onChange={e => setGatewayForm({ ...gatewayForm, razorpayKeySecret: e.target.value })}
                        placeholder="Paste your Secret Key"
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={savingGateway}
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-sky-500 hover:brightness-110 text-slate-950 transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{savingGateway ? "Saving Settings..." : "Save Payment Gateway Settings"}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & ADMIN PASSCODE */}
        {activeTab === "security" && (
          <div className="max-w-2xl space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Change Admin Passcode
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update the secret access password for this admin portal.
                  </p>
                </div>
              </div>

              {passChangeStatus && (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    passChangeStatus.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {passChangeStatus.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{passChangeStatus.msg}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Passcode *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      value={currentPass}
                      onChange={e => setCurrentPass(e.target.value)}
                      placeholder="Enter current password (default: admin123)"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Passcode *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        required
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                        placeholder="Min 4 characters"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Passcode *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={e => setConfirmPass(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={changingPassword || !currentPass || !newPass || !confirmPass}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-sky-500 hover:brightness-110 text-slate-950 transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>{changingPassword ? "Updating Passcode..." : "Update Passcode"}</span>
                </button>
              </form>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Security Details:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Password is authenticated server-side using secure HTTP-only cookies.</li>
                  <li>You can also configure <code className="font-mono text-cyan-600 dark:text-cyan-400">ADMIN_PASSWORD</code> in your environment variables.</li>
                  <li>Session remains active for 7 days unless you manually sign out.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ANNOUNCEMENTS */}
        {activeTab === "announcements" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-500" />
                <span>Publish Announcement</span>
              </h2>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!newUpdate.title || !newUpdate.description) return;
                  const item: UpdateAnnouncement = {
                    id: `update-${Date.now()}`,
                    title: newUpdate.title || "",
                    category: newUpdate.category || "News",
                    date: new Date().toISOString().split("T")[0],
                    description: newUpdate.description || "",
                    linkText: newUpdate.linkText,
                    linkUrl: newUpdate.linkUrl,
                    badge: newUpdate.badge
                  };
                  setUpdates([item, ...updates]);
                  setStatusMessage(`✓ Announcement published!`);
                  setTimeout(() => setStatusMessage(""), 3000);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUpdate.title}
                    onChange={e => setNewUpdate({ ...newUpdate, title: e.target.value })}
                    placeholder="e.g. New YouTube Video Released!"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
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
                    placeholder="Details about this update..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
                >
                  Publish to Timeline
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

        {/* TAB 5: STATS */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Resources</p>
              <p className="text-3xl font-extrabold text-cyan-500">{resources.length}</p>
              <p className="text-xs text-slate-400">In Free & Premium Library</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Paid PDF Revenue</p>
              <p className="text-3xl font-extrabold text-emerald-500 font-mono">₹{totalRevenue}</p>
              <p className="text-xs text-slate-400">{orders.length} student orders</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Community Reach</p>
              <p className="text-3xl font-extrabold text-purple-500">75,000+</p>
              <p className="text-xs text-slate-400">Instagram & YouTube</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Free Downloads</p>
              <p className="text-3xl font-extrabold text-amber-500">100k+</p>
              <p className="text-xs text-slate-400">Across All Roadmaps</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
