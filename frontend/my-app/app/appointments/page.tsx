"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

type JwtPayload = {
  sub: string;
  doctorId?: number;
  role?: string;
  exp?: number;
};

type Slot = {
  id: number | string;
  startTime: string;
  endTime: string;
  status?: string;
};

type Patient = {
  user_id: number | string;
  name: string;
  email: string;
};

type Appointment = {
  id: number | string;
  patient?: Patient;
  slot: Slot & { doctor?: { name: string } };
};

type UserProfile = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  address?: string;
};

export default function DoctorAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"mine" | "availability">("mine");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppt, setLoadingAppt] = useState(false);

  const [mySlots, setMySlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [doctorId, setDoctorId] = useState<string | number | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // ----------------- JWT -----------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login/doctor";
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const id = decoded.doctorId || decoded.sub;
      if (!id) throw new Error("ไม่พบ doctorId ใน token");
      setDoctorId(id);

      // โหลดโปรไฟล์
      fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setProfile(data))
        .catch(() => setProfile(null));
    } catch {
      window.location.href = "/login/doctor";
    }
  }, []);

  // ----------------- API -----------------
  async function loadAppointments() {
    setLoadingAppt(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("กรุณาเข้าสู่ระบบใหม่");

      const res = await fetch(`${API_BASE}/appointments/doctor/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("โหลดรายการนัดไม่สำเร็จ");
      const data = await res.json();
      setAppointments(data);
    } catch {
      setAppointments([]);
    } finally {
      setLoadingAppt(false);
    }
  }

  async function loadMySlots() {
    if (!doctorId) return;
    setLoadingSlots(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("กรุณาเข้าสู่ระบบใหม่");

      const res = await fetch(`${API_BASE}/doctors/${doctorId}/slots`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("โหลดเวลาว่างไม่สำเร็จ");
      const data = await res.json();
      setMySlots(data);
    } catch {
      setMySlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  async function addAvailability() {
    if (!start || !end || !doctorId) return;
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("กรุณาเข้าสู่ระบบใหม่");

    await fetch(`${API_BASE}/doctors/slots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ startTime: start, endTime: end }),
    });

    setStart("");
    setEnd("");
    loadMySlots();
  }

  useEffect(() => {
    if (!doctorId) return;
    if (activeTab === "mine") loadAppointments();
    if (activeTab === "availability") loadMySlots();
  }, [activeTab, doctorId]);

  // ----------------- Helpers -----------------
  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatTimeRange(startISO: string, endISO: string) {
    const fmt = (d: string) =>
      new Date(d).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    return `${fmt(startISO)} - ${fmt(endISO)} น.`;
  }

  // ----------------- UI -----------------
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-emerald-700 to-emerald-900 text-white p-6 flex flex-col gap-6 shadow-xl">
        {/* Profile */}
        {profile && (
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-2xl font-bold shadow-md">
              {profile.name.charAt(0)}
            </div>
            <h2 className="mt-3 text-lg font-semibold">{profile.name}</h2>
            <p className="text-sm text-emerald-200">{profile.email}</p>
            <span className="mt-1 px-2 py-1 text-xs rounded bg-emerald-600">
              {profile.role} ({profile.status})
            </span>
          </div>
        )}

        {/* Menu */}
        <button
          onClick={() => setActiveTab("mine")}
          className={`px-4 py-2 rounded-lg text-left ${
            activeTab === "mine"
              ? "bg-emerald-500 font-semibold shadow"
              : "hover:bg-emerald-600"
          }`}
        >
          📅 ตารางนัด
        </button>
        <button
          onClick={() => setActiveTab("availability")}
          className={`px-4 py-2 rounded-lg text-left ${
            activeTab === "availability"
              ? "bg-emerald-500 font-semibold shadow"
              : "hover:bg-emerald-600"
          }`}
        >
          ⏰ เวลาว่างของฉัน
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <h1 className="text-2xl font-bold text-emerald-800 mb-6">
          จัดการตารางแพทย์
        </h1>

        {activeTab === "mine" ? (
          // ตารางนัด
          <div>
            {loadingAppt ? (
              <p>⏳ กำลังโหลด...</p>
            ) : appointments.length ? (
              <table className="min-w-full border border-sky-200 rounded-xl overflow-hidden shadow">
                <thead className="bg-sky-100 text-sky-800">
                  <tr>
                    <th className="px-4 py-2 text-left">วันที่เริ่ม</th>
                    <th className="px-4 py-2 text-left">วันที่สิ้นสุด</th>
                    <th className="px-4 py-2 text-left">เวลา</th>
                    <th className="px-4 py-2 text-left">สถานะ</th>
                    <th className="px-4 py-2 text-left">คนไข้</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-sky-50">
                      <td className="px-4 py-2">{formatDate(a.slot.startTime)}</td>
                      <td className="px-4 py-2">{formatDate(a.slot.endTime)}</td>
                      <td className="px-4 py-2">
                        {formatTimeRange(a.slot.startTime, a.slot.endTime)}
                      </td>
                      <td className="px-4 py-2">
                        {a.patient ? (
                          <span className="px-2 py-1 text-sm rounded bg-red-100 text-red-700">
                            ถูกจองแล้ว
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-sm rounded bg-green-100 text-green-700">
                            ว่าง
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">{a.patient?.name || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sky-700">ยังไม่มีการนัด</p>
            )}
          </div>
        ) : (
          // เวลาว่างของฉัน
          <div>
            <div className="flex gap-2 mb-4">
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="px-3 py-2 rounded-xl border border-sky-200"
              />
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="px-3 py-2 rounded-xl border border-sky-200"
              />
              <button
                onClick={addAvailability}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-sky-600 text-white font-medium"
              >
                บันทึกเวลาว่าง
              </button>
            </div>

            {loadingSlots ? (
              <p>⏳ กำลังโหลด...</p>
            ) : mySlots.length ? (
              <table className="min-w-full border border-emerald-200 rounded-xl overflow-hidden shadow">
                <thead className="bg-emerald-100 text-emerald-800">
                  <tr>
                    <th className="px-4 py-2 text-left">วันที่เริ่ม</th>
                    <th className="px-4 py-2 text-left">วันที่สิ้นสุด</th>
                    <th className="px-4 py-2 text-left">เวลา</th>
                    <th className="px-4 py-2 text-left">สถานะ</th>
                    <th className="px-4 py-2 text-left">คนไข้</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {mySlots.map((s) => (
                    <tr key={s.id} className="hover:bg-emerald-50">
                      <td className="px-4 py-2">{formatDate(s.startTime)}</td>
                      <td className="px-4 py-2">{formatDate(s.endTime)}</td>
                      <td className="px-4 py-2">
                        {formatTimeRange(s.startTime, s.endTime)}
                      </td>
                      <td className="px-4 py-2">
                        {s.status === "booked" ? (
                          <span className="px-2 py-1 text-sm rounded bg-red-100 text-red-700">
                            ถูกจองแล้ว
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-sm rounded bg-green-100 text-green-700">
                            ว่าง
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {(s as any).patient?.name || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sky-700">ยังไม่มีเวลาว่าง</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
