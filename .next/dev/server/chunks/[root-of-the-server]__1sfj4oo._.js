module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

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
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/src/app/api/auth/register/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth-validation.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(req) {
    try {
        const body = await req.json();
        const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
        const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth : "";
        const email = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeEmail"])(typeof body.email === "string" ? body.email : "");
        const mobileNumber = typeof body.phoneNumber === "string" ? body.phoneNumber.replace(/\D/g, "") : "";
        const username = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeUsername"])(typeof body.username === "string" ? body.username : "");
        const password = typeof body.password === "string" ? body.password : "";
        if (!fullName) return error("Please enter your full name.");
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidDateOfBirth"])(dateOfBirth)) return error("Please enter a valid date of birth.");
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EMAIL_PATTERN"].test(email)) return error("Please enter a valid email address.");
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["INDIAN_PHONE_PATTERN"].test(mobileNumber)) return error("Please enter a valid Indian phone number.");
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["USERNAME_PATTERN"].test(username)) return error("Username must be 3-30 characters using letters, numbers, or underscores.");
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isStrongPassword"])(password)) return error("Password must be at least 8 characters and include letters, numbers, and a special character.");
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findFirst({
            where: {
                OR: [
                    {
                        email
                    },
                    {
                        mobileNumber
                    },
                    {
                        username
                    }
                ]
            },
            select: {
                email: true,
                mobileNumber: true,
                username: true
            }
        });
        if (existing?.email === email) return error("Email address is already registered.", 409);
        if (existing?.mobileNumber === mobileNumber) return error("Phone number is already registered.", 409);
        if (existing?.username === username) return error("Username is already taken.", 409);
        const passwordHash = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 12);
        const initials = fullName.split(/\s+/).map((part)=>part[0]).join("").slice(0, 2).toUpperCase();
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.create({
            data: {
                name: fullName,
                fullName,
                dateOfBirth: new Date(`${dateOfBirth}T00:00:00.000Z`),
                email,
                mobileNumber,
                username,
                passwordHash,
                avatar: initials,
                folders: {
                    create: [
                        {
                            name: "Documents"
                        },
                        {
                            name: "Education"
                        },
                        {
                            name: "Health"
                        },
                        {
                            name: "Identity"
                        },
                        {
                            name: "Finance"
                        }
                    ]
                }
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                message: "Account created successfully."
            }
        }, {
            status: 201
        });
    } catch (err) {
        console.error("Registration error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: {
                code: "REGISTRATION_FAILED",
                message: "Unable to create account."
            }
        }, {
            status: 500
        });
    }
}
function error(message, status = 400) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        error: {
            code: "VALIDATION_ERROR",
            message
        }
    }, {
        status
    });
}
}),
"[project]/src/lib/auth-validation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMAIL_PATTERN",
    ()=>EMAIL_PATTERN,
    "INDIAN_PHONE_PATTERN",
    ()=>INDIAN_PHONE_PATTERN,
    "USERNAME_PATTERN",
    ()=>USERNAME_PATTERN,
    "isStrongPassword",
    ()=>isStrongPassword,
    "isValidDateOfBirth",
    ()=>isValidDateOfBirth,
    "normalizeEmail",
    ()=>normalizeEmail,
    "normalizeUsername",
    ()=>normalizeUsername,
    "serializePublicUser",
    ()=>serializePublicUser
]);
const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,30}$/;
const INDIAN_PHONE_PATTERN = /^[6-9]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isStrongPassword(password) {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password) && /[^A-Za-z\d]/.test(password);
}
function isValidDateOfBirth(value) {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date <= new Date();
}
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function normalizeUsername(username) {
    return username.trim().toLowerCase();
}
function serializePublicUser(user) {
    return {
        id: user.id,
        mobileNumber: user.mobileNumber,
        name: user.name || user.fullName || "User",
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth?.toISOString().slice(0, 10) ?? null,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        storageUsed: Number(user.storageUsed),
        storageLimit: Number(user.storageLimit)
    };
}
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma,
    "serializeBigInt",
    ()=>serializeBigInt
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "error",
        "warn"
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
function serializeBigInt(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj === "bigint") {
        return Number(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map((item)=>serializeBigInt(item));
    }
    if (typeof obj === "object" && !(obj instanceof Date)) {
        const serialized = {};
        for (const key of Object.keys(obj)){
            const val = obj[key];
            if (typeof val === "bigint") {
                serialized[key] = Number(val);
            } else if (typeof val === "object" && val !== null) {
                serialized[key] = serializeBigInt(val);
            } else {
                serialized[key] = val;
            }
        }
        return serialized;
    }
    return obj;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1sfj4oo._.js.map