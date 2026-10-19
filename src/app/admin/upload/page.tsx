"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  UploadCloud,
  Lock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  LogOut,
  ArrowLeft,
  ExternalLink,
  Shield,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

interface ProjectOption {
  id: string;
  slug: string;
  title: string;
  coverImageUrl: string | null;
}

interface UploadedFileItem {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function AdminUploadPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Login form state
  const [adminSecret, setAdminSecret] = useState<string>("");
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Upload form state
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<{
    url: string;
    fileName: string;
    projectUpdated: boolean;
    message: string;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Gallery state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Check existing session token on mount
  useEffect(() => {
    const stored = localStorage.getItem("saidkhan_admin_token");
    if (stored) {
      verifyExistingToken(stored);
    } else {
      setAuthChecking(false);
    }
  }, []);

  // 2. Fetch projects & uploaded assets when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProjects();
      fetchUploadedFiles(token);
    }
  }, [isAuthenticated, token]);

  const verifyExistingToken = async (existingToken: string) => {
    setAuthChecking(true);
    try {
      const res = await fetch("/api/v1/admin/auth/login", {
        headers: {
          Authorization: `Bearer ${existingToken}`,
        },
      });

      if (res.ok) {
        setToken(existingToken);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("saidkhan_admin_token");
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch {
      localStorage.removeItem("saidkhan_admin_token");
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSecret.trim()) {
      setAuthError("Please enter your admin secret key.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/v1/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: adminSecret.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("saidkhan_admin_token", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setAdminSecret("");
      } else {
        setAuthError(data.error || "Authentication failed. Check your secret key.");
      }
    } catch {
      setAuthError("Connection error while authenticating. Ensure dev server is active.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("saidkhan_admin_token");
    setToken(null);
    setIsAuthenticated(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadSuccess(null);
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/v1/projects?page_size=50");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const fetchUploadedFiles = async (authToken: string) => {
    setLoadingFiles(true);
    try {
      const res = await fetch("/api/v1/admin/upload", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedFiles(data.files || []);
      }
    } catch (err) {
      console.error("Failed to load uploads gallery:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadSuccess(null);
    setUploadError(null);

    // Create object URL for instant preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !token) {
      setUploadError("Please select an image file first.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (selectedProjectSlug) {
      formData.append("projectSlug", selectedProjectSlug);
    }

    try {
      const res = await fetch("/api/v1/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadSuccess({
          url: data.url,
          fileName: data.fileName,
          projectUpdated: data.projectUpdated,
          message: data.message,
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Refresh project list and uploaded files
        fetchProjects();
        fetchUploadedFiles(token);
      } else {
        setUploadError(data.error || "Failed to upload image.");
      }
    } catch {
      setUploadError("Upload network failure. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-sm">
        <RefreshCw className="h-5 w-5 animate-spin mr-2 text-red-500" />
        Checking secure admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-500/20 selection:text-red-300 font-sans">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Portfolio</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              <span className="text-sm font-semibold tracking-wide">
                Admin Studio & Asset Uploader
              </span>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Session Active
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {!isAuthenticated ? (
          /* Authentication Gate */
          <div className="max-w-md mx-auto mt-12">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl">
              <div className="text-center mb-6">
                <div className="h-12 w-12 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-5 w-5 text-red-400" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Admin Session Required
                </h1>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Enter your <span className="font-mono text-zinc-300">ADMIN_JWT_SECRET</span> to upload project screenshots directly from your PC.
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-secret-input"
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                  >
                    Admin Secret Key
                  </label>
                  <div className="relative">
                    <input
                      id="admin-secret-input"
                      type={showSecret ? "text" : "password"}
                      value={adminSecret}
                      onChange={(e) => setAdminSecret(e.target.value)}
                      placeholder="Enter ADMIN_JWT_SECRET..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-medium text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Validating Session...</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      <span>Authorize & Open Upload Session</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <p className="text-[11px] text-zinc-500 font-mono">
                  Session persists securely in your browser for 7 days.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Active Upload Workspace */
          <div className="space-y-10">
            {/* Title & Introduction */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-red-400 mb-2">
                <UploadCloud className="h-3.5 w-3.5" />
                Direct Asset Studio
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Upload Project Covers & Screenshots
              </h1>
              <p className="text-sm text-zinc-400 max-w-2xl">
                Upload downloaded images or screenshots directly from your computer. Files are saved in <span className="font-mono text-zinc-300">/public/uploads/</span> and can be automatically linked to any portfolio project.
              </p>
            </div>

            {/* Notification Banners */}
            {uploadSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-200 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">{uploadSuccess.message}</p>
                    <p className="font-mono text-emerald-300 text-[11px] mt-0.5">
                      URL: {uploadSuccess.url}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(uploadSuccess.url)}
                  className="inline-flex items-center gap-1.5 bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-200 transition-colors font-mono text-[11px] shrink-0"
                >
                  {copiedUrl === uploadSuccess.url ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {uploadError && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-red-200 text-xs">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Upload Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Upload Form (2 cols) */}
              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-md">
                <form onSubmit={handleUploadSubmit} className="space-y-6">
                  {/* Step 1: Select Project (Optional) */}
                  <div>
                    <label
                      htmlFor="target-project-select"
                      className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 font-mono"
                    >
                      Step 1: Link to Project (Optional)
                    </label>
                    <select
                      id="target-project-select"
                      value={selectedProjectSlug}
                      onChange={(e) => setSelectedProjectSlug(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60 font-sans"
                    >
                      <option value="">
                        None (Upload as standalone portfolio asset)
                      </option>
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.slug}>
                          {proj.title} ({proj.slug}) {proj.coverImageUrl ? "— [Has Cover]" : "— [No Cover]"}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-zinc-500 mt-1.5">
                      If selected, the uploaded image will automatically become this project&apos;s active cover in the database.
                    </p>
                  </div>

                  {/* Step 2: Drag & Drop File Picker */}
                  <div>
                    <span className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                      Step 2: Choose Image File from PC
                    </span>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                      id="project-image-file-input"
                    />

                    <label
                      htmlFor="project-image-file-input"
                      className={`block w-full rounded-2xl border-2 border-dashed transition-all p-8 text-center cursor-pointer ${
                        selectedFile
                          ? "border-red-500/50 bg-red-950/10"
                          : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:bg-zinc-950"
                      }`}
                    >
                      <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-400 group-hover:text-red-400">
                        <UploadCloud className="h-6 w-6" />
                      </div>

                      {selectedFile ? (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-white">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {formatFileSize(selectedFile.size)} • {selectedFile.type}
                          </p>
                          <p className="text-[11px] text-red-400 pt-1 font-sans">
                            Click to change file
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-white">
                            Click to select an image from your PC
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            Supports PNG, JPG, JPEG, WEBP, SVG, GIF (Up to 10 MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!selectedFile || uploading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs py-3 rounded-xl transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Uploading & Processing Image...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4" />
                        <span>
                          {selectedProjectSlug
                            ? "Upload & Set as Project Cover"
                            : "Upload Image to Assets"}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Live Preview Box (1 col) */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md flex flex-col">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 font-mono">
                  Live Preview
                </h3>

                <div className="flex-1 min-h-[220px] rounded-xl border border-zinc-800 bg-zinc-950/80 overflow-hidden flex items-center justify-center relative">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Selected preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-zinc-600">
                      <ImageIcon className="h-10 w-10 mx-auto mb-2 stroke-[1.5]" />
                      <p className="text-xs">No image selected</p>
                      <p className="text-[10px] text-zinc-600 mt-1">
                        Select a file to inspect preview
                      </p>
                    </div>
                  )}
                </div>

                {selectedFile && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1 font-mono text-[11px] text-zinc-400">
                    <p className="truncate">File: {selectedFile.name}</p>
                    <p>Size: {formatFileSize(selectedFile.size)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Assets Gallery */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Uploaded Portfolio Assets
                  </h2>
                  <p className="text-xs text-zinc-400">
                    All static assets currently stored in <span className="font-mono text-zinc-300">public/uploads/</span>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => token && fetchUploadedFiles(token)}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-mono"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingFiles ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                  <p>No images uploaded yet.</p>
                  <p className="text-[11px] text-zinc-600 mt-1">
                    Upload your first project screenshot using the form above!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="group rounded-xl border border-zinc-800/80 bg-zinc-950 overflow-hidden hover:border-zinc-700 transition-all flex flex-col"
                    >
                      <div className="h-36 bg-zinc-900 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-medium text-white truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-zinc-900 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(file.url)}
                            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors font-mono"
                          >
                            {copiedUrl === file.url ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy URL</span>
                              </>
                            )}
                          </button>

                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                            title="Open image in new tab"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
