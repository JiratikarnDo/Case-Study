"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export default function UserRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!/^\d{13}$/.test(idCard)) {
      toast.error("กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          citizen_id: idCard,
          birth_date: birthDate,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "สมัครสมาชิกไม่สำเร็จ");
      }

      const data = await res.json();
      console.log("Register success:", data);

      toast.success("สมัครสมาชิกสำเร็จ 🎉");
      setTimeout(() => router.push("/login/user"), 2000); // redirect หลัง 2 วิ
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50 px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8">
        {/* Left card */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-emerald-700">CareLine</h1>
          <p className="text-sky-600 mb-6">User Portal</p>
          <h2 className="text-xl font-semibold text-emerald-800 mb-2">
            สมัครสมาชิกใหม่
          </h2>
          <p className="text-sky-700">
            สร้างบัญชีผู้ใช้ใหม่เพื่อใช้งานบริการ นัดหมายแพทย์
            และตรวจสอบข้อมูลของคุณ
          </p>
        </div>

        {/* Right card */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100">
          <h2 className="text-xl font-bold text-emerald-700 mb-6">
            สมัครสมาชิกผู้ใช้
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sky-700 mb-1">
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                placeholder="สมชาย ใจดี"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-700 mb-1">
                เลขบัตรประชาชน
              </label>
              <input
                type="text"
                placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                value={idCard}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 13) setIdCard(val);
                }}
                maxLength={13}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-700 mb-1">
                วันเกิด
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-700 mb-1">
                อีเมล
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-700 mb-1">
                ยืนยันรหัสผ่าน
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-sky-600 text-white rounded-xl font-medium hover:opacity-90"
            >
              สมัครสมาชิก
            </button>
          </form>

          <p className="text-center text-sm text-sky-700 mt-4">
            มีบัญชีอยู่แล้ว?{" "}
            <a
              href="/login/user"
              className="font-medium text-emerald-600 hover:underline"
            >
              เข้าสู่ระบบ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
