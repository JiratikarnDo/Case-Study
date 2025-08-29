"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export default function DoctorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "เข้าสู่ระบบไม่สำเร็จ");
      }

      const data = await res.json();
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      toast.success("เข้าสู่ระบบสำเร็จ ✅");

      setTimeout(() => {
        window.location.href = "/appointments/user";
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || "เข้าสู่ระบบไม่สำเร็จ ❌");
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
        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-center rounded-3xl bg-white/70 backdrop-blur border border-sky-100 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 grid place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-sky-800">CareLine</div>
              <div className="text-sky-600">User Portal</div>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-2">ยินดีต้อนรับ</h2>
          <p className="text-sky-700/80 leading-relaxed">
            เข้าสู่ระบบเพื่อจัดดูตารางคิวการหาหมอของคุณ ดูประวัติการนัดหมาย และจัดการข้อมูลผู้ป่วยได้อย่างง่ายดาย
          </p>
        </div>

        {/* Right: Login card */}
        <div className="rounded-3xl bg-white/80 backdrop-blur border border-emerald-100 p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-emerald-800 mb-2">เข้าสู่ระบบ</h1>
          <p className="text-sky-700/80 text-sm mb-6">กรุณากรอกอีเมลและรหัสผ่านของคุณ</p>

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
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-2 my-auto h-8 w-8 grid place-items-center text-sky-700"
                >
                  {showPw ? (
                    // eye open
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    // eye closed
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 011.669-3.113M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-sky-600 px-4 py-2 font-semibold text-white shadow-lg hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
