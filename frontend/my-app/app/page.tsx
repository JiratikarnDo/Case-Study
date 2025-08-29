"use client";
import React, { useState } from "react";
import Link from "next/link";

/**
 * Drop this file at: /app/login/page.tsx
 * Theme: clean medical (white/green/blue)
 * Works with any backend — set NEXT_PUBLIC_API_BASE_URL
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function DoctorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Login failed");
      // TODO: store token/cookie according to your backend
      // For demo, go to appointments page
      window.location.href = "/appointments";
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Brand/illustration */}
        <div className="hidden md:flex flex-col justify-center rounded-3xl bg-white/70 backdrop-blur border border-sky-100 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 grid place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-md">
              {/* medical cross icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </div>
            <div>
              <div className="text-xl font-bold text-sky-800">CareLine</div>
              <div className="text-sky-600">Doctor Portal</div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-emerald-800 mb-2">ยินดีต้อนรับคุณหมอ</h2>
          <p className="text-sky-700/80 leading-relaxed">
            เข้าสู่ระบบเพื่อจัดการตารางตรวจ ดูคิวคนไข้ และยืนยันการนัดหมายได้อย่างรวดเร็ว
            อินเทอร์เฟซโทนขาว–เขียว–น้ำเงินสบายตา ออกแบบมาเพื่อบุคลากรทางการแพทย์
          </p>

          <ul className="mt-6 space-y-3 text-sky-800/80">
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500"/>สรุปคิววันนี้แบบรวดเร็ว</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500"/>จัดการการนัดหมายและเวลาว่าง</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-500"/>รองรับทุกหน้าจอ ใช้งานง่าย</li>
          </ul>
        </div>

        {/* Right: Login card */}
        <div className="rounded-3xl bg-white/80 backdrop-blur border border-emerald-100 p-8 shadow-xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-emerald-800">เข้าสู่ระบบแพทย์</h1>
            <p className="text-sky-700/80 text-sm mt-1">กรุณากรอกอีเมลและรหัสผ่านของคุณ</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sky-800 mb-1">อีเมล</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="name@hospital.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-800 mb-1">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-2 my-auto h-8 w-8 grid place-items-center rounded-lg hover:bg-sky-50 text-sky-700"
                  aria-label={showPw ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.02-2.79 2.86-4.99 5.06-6.45"/><path d="M1 1l22 22"/><path d="M10.58 10.58a2 2 0 1 0 2.83 2.83"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sky-800">
                <input type="checkbox" className="rounded border-sky-300 text-emerald-600 focus:ring-emerald-400" />
                <span className="text-sm">จดจำฉันไว้</span>
              </label>
              <Link href="#" className="text-sm text-sky-700 hover:underline">ลืมรหัสผ่าน?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-sky-600 px-4 py-2 font-semibold text-white shadow-lg hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-sky-700/80">
            <span>ยังไม่มีบัญชี?</span>{" "}
            <Link href="#" className="text-emerald-700 hover:underline font-medium">ติดต่อเจ้าหน้าที่</Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 text-xs text-sky-700/70">
            <span className="h-px w-8 bg-sky-200" />
            <span>หรือ</span>
            <span className="h-px w-8 bg-sky-200" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link href="/" className="rounded-xl border border-sky-200 bg-white px-3 py-2 text-center text-sky-800 hover:bg-sky-50">กลับหน้าแรก</Link>
            <Link href="/appointments" className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-center text-emerald-800 hover:bg-emerald-50">ไปหน้าจองคิว</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
