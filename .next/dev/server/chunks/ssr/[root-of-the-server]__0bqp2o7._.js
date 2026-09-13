module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[project]/src/lib/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSession"])();
        setUser(session);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSession"])().then(setUser).finally(()=>setLoading(false));
    }, []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logout"])();
        setUser(null);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            setUser,
            refreshUser,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/AuthContext.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
}),
"[project]/src/lib/ToastContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.mjs [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.mjs [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
"use client";
;
;
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const ICONS = {
    success: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
    error: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
    info: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"]
};
const STYLES = {
    success: "bg-white border-emerald-200 text-emerald-700",
    error: "bg-white border-red-200 text-red-700",
    info: "bg-white border-blue-200 text-blue-700"
};
function ToastProvider({ children }) {
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((message, type = "info")=>{
        const id = Math.random().toString(36).slice(2);
        setToasts((prev)=>[
                ...prev,
                {
                    id,
                    type,
                    message
                }
            ]);
        setTimeout(()=>{
            setToasts((prev)=>prev.filter((t)=>t.id !== id));
        }, 4000);
    }, []);
    const dismiss = (id)=>setToasts((prev)=>prev.filter((t)=>t.id !== id));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: {
            showToast
        },
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]",
                children: toasts.map((t)=>{
                    const Icon = ICONS[t.type];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "status",
                        className: `flex items-start gap-2.5 rounded-lg border shadow-lg px-4 py-3 text-sm animate-[fadeIn_0.15s_ease-out] ${STYLES[t.type]}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 18,
                                className: "mt-0.5 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/lib/ToastContext.tsx",
                                lineNumber: 57,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex-1 leading-snug",
                                children: t.message
                            }, void 0, false, {
                                fileName: "[project]/src/lib/ToastContext.tsx",
                                lineNumber: 58,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>dismiss(t.id),
                                "aria-label": "Dismiss notification",
                                className: "text-slate-400 hover:text-slate-600",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/src/lib/ToastContext.tsx",
                                    lineNumber: 64,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/lib/ToastContext.tsx",
                                lineNumber: 59,
                                columnNumber: 15
                            }, this)
                        ]
                    }, t.id, true, {
                        fileName: "[project]/src/lib/ToastContext.tsx",
                        lineNumber: 52,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/lib/ToastContext.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/lib/ToastContext.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
function useToast() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
}),
"[project]/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createShareLink",
    ()=>createShareLink,
    "deleteDocument",
    ()=>deleteDocument,
    "getDashboardSummary",
    ()=>getDashboardSummary,
    "getSession",
    ()=>getSession,
    "getSharedDocument",
    ()=>getSharedDocument,
    "getStorageInfo",
    ()=>getStorageInfo,
    "listDocuments",
    ()=>listDocuments,
    "listShareLinksForDocument",
    ()=>listShareLinksForDocument,
    "logout",
    ()=>logout,
    "recordDownload",
    ()=>recordDownload,
    "revokeShareLink",
    ()=>revokeShareLink,
    "uploadDocument",
    ()=>uploadDocument
]);
const AUTH_TOKEN_KEY = "digivault_jwt";
function getAuthHeaders() {
    if ("TURBOPACK compile-time truthy", 1) return {};
    //TURBOPACK unreachable
    ;
    const token = undefined;
}
function mapApiDocument(doc) {
    return {
        id: doc.id,
        userId: doc.userId,
        name: doc.name,
        fileName: doc.fileName,
        fileType: doc.fileType || doc.fileExtension || "bin",
        fileSize: Number(doc.fileSize || 0),
        category: doc.category,
        cloudStorageKey: doc.cloudStorageKey || "",
        uploadedAt: typeof doc.uploadedAt === "string" ? doc.uploadedAt : new Date(doc.uploadedAt).toISOString(),
        downloadCount: Number(doc.downloadCount || 0),
        fileDataUrl: `/api/documents/${doc.id}/download`
    };
}
async function getSession() {
    try {
        const res = await fetch("/api/dashboard/stats", {
            headers: {
                ...getAuthHeaders()
            },
            cache: "no-store"
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (!json.success || !json.data?.user) return null;
        const { user, stats } = json.data;
        return {
            id: user.id,
            mobileNumber: user.mobileNumber,
            name: user.name || "User",
            fullName: user.fullName ?? null,
            dateOfBirth: user.dateOfBirth ?? null,
            email: user.email ?? null,
            username: user.username ?? null,
            avatar: user.avatar ?? null,
            storageUsed: Number(stats?.storageUsed || 0),
            storageLimit: Number(stats?.storageLimit || 1073741824)
        };
    } catch  {
        return null;
    }
}
async function logout() {
    await fetch("/api/auth/logout", {
        method: "POST"
    });
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
async function listDocuments(params) {
    const query = new URLSearchParams();
    if (params.cursor) query.set("cursor", params.cursor);
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search?.trim()) query.set("search", params.search.trim());
    if (params.category && params.category !== "All") query.set("category", params.category);
    if (params.sort) query.set("sortBy", params.sort);
    const res = await fetch(`/api/documents?${query.toString()}`, {
        headers: {
            ...getAuthHeaders()
        },
        cache: "no-store"
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load documents.");
    }
    const rawDocs = json.data?.documents || [];
    const items = rawDocs.map(mapApiDocument);
    return {
        items,
        nextCursor: json.data?.nextCursor ?? null,
        hasMore: Boolean(json.data?.nextCursor)
    };
}
async function getDashboardSummary() {
    const res = await fetch("/api/dashboard/stats", {
        headers: {
            ...getAuthHeaders()
        },
        cache: "no-store"
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load dashboard stats.");
    }
    const stats = json.data?.stats || {};
    return {
        totalDocuments: Number(stats.totalDocuments || 0),
        storageUsed: Number(stats.storageUsed || 0),
        shareLinks: Number(stats.activeShareLinks || 0),
        downloads: Number(stats.totalDownloads || 0)
    };
}
async function getStorageInfo() {
    const res = await fetch("/api/dashboard/stats", {
        headers: {
            ...getAuthHeaders()
        },
        cache: "no-store"
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load storage info.");
    }
    const stats = json.data?.stats || {};
    return {
        used: Number(stats.storageUsed || 0),
        limit: Number(stats.storageLimit || 1073741824)
    };
}
async function uploadDocument(file, category) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
            ...getAuthHeaders()
        },
        body: formData
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to upload document.");
    }
    return mapApiDocument(json.data.document);
}
async function deleteDocument(id) {
    const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        headers: {
            ...getAuthHeaders()
        }
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to delete document.");
    }
}
async function recordDownload(id) {
    // Download count is automatically incremented server-side upon fetching /api/documents/[id]/download
    try {
        await fetch(`/api/documents/${id}/download`, {
            method: "GET",
            headers: {
                ...getAuthHeaders()
            }
        });
    } catch  {
    // Ignore non-blocking download count errors
    }
}
async function createShareLink(documentId, expiry) {
    const res = await fetch("/api/share", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({
            documentId,
            expiryOption: expiry
        })
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to create share link.");
    }
    const rawLink = json.data?.shareLink;
    return {
        id: rawLink.id,
        documentId: rawLink.documentId,
        userId: rawLink.userId,
        token: rawLink.token,
        createdAt: typeof rawLink.createdAt === "string" ? rawLink.createdAt : new Date(rawLink.createdAt).toISOString(),
        expiresAt: typeof rawLink.expiresAt === "string" ? rawLink.expiresAt : new Date(rawLink.expiresAt).toISOString(),
        revokedAt: rawLink.revokedAt ? typeof rawLink.revokedAt === "string" ? rawLink.revokedAt : new Date(rawLink.revokedAt).toISOString() : null,
        isActive: Boolean(rawLink.isActive)
    };
}
async function revokeShareLink(id) {
    const res = await fetch(`/api/share/${id}/revoke`, {
        method: "POST",
        headers: {
            ...getAuthHeaders()
        }
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to revoke share link.");
    }
}
async function getSharedDocument(token) {
    try {
        const res = await fetch(`/api/shared/${token}`, {
            cache: "no-store"
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (!json.success || !json.data?.document) return null;
        const { document, expiresAt } = json.data;
        const mappedDoc = mapApiDocument(document);
        if (json.data.downloadUrl) {
            mappedDoc.fileDataUrl = json.data.downloadUrl;
        }
        const link = {
            id: token,
            documentId: document.id,
            userId: "",
            token,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt || new Date(Date.now() + 86400000).toISOString(),
            revokedAt: null,
            isActive: true
        };
        return {
            link,
            document: mappedDoc
        };
    } catch  {
        return null;
    }
}
async function listShareLinksForDocument(documentId) {
    try {
        const res = await fetch("/api/share", {
            headers: {
                ...getAuthHeaders()
            },
            cache: "no-store"
        });
        const json = await res.json();
        if (!res.ok || !json.success) return [];
        const rawLinks = json.data?.shareLinks || [];
        return rawLinks.filter((l)=>l.documentId === documentId).map((rawLink)=>({
                id: rawLink.id,
                documentId: rawLink.documentId,
                userId: rawLink.userId,
                token: rawLink.token,
                createdAt: typeof rawLink.createdAt === "string" ? rawLink.createdAt : new Date(rawLink.createdAt).toISOString(),
                expiresAt: typeof rawLink.expiresAt === "string" ? rawLink.expiresAt : new Date(rawLink.expiresAt).toISOString(),
                revokedAt: rawLink.revokedAt ? typeof rawLink.revokedAt === "string" ? rawLink.revokedAt : new Date(rawLink.revokedAt).toISOString() : null,
                isActive: Boolean(rawLink.isActive && !rawLink.isExpired)
            }));
    } catch  {
        return [];
    }
}
}),
"[project]/src/lib/useTextSize.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextSizeProvider",
    ()=>TextSizeProvider,
    "useTextSize",
    ()=>useTextSize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const TextSizeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const CLASS_MAP = {
    sm: "text-size-sm",
    md: "text-size-md",
    lg: "text-size-lg"
};
function TextSizeProvider({ children }) {
    const [size, setSizeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("md");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const stored = window.localStorage.getItem("digivault_text_size");
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate preference from storage on mount
        if (stored) setSizeState(stored);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.documentElement.classList.remove(...Object.values(CLASS_MAP));
        document.documentElement.classList.add(CLASS_MAP[size]);
        window.localStorage.setItem("digivault_text_size", size);
    }, [
        size
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextSizeContext.Provider, {
        value: {
            size,
            setSize: setSizeState
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/useTextSize.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
function useTextSize() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(TextSizeContext);
    if (!ctx) throw new Error("useTextSize must be used within TextSizeProvider");
    return ctx;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0bqp2o7._.js.map