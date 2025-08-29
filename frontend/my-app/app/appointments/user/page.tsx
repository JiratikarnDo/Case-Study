"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";



const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

type Specialty = { id: number; name: string };
type Doctor = {
  user_id: number;
  name: string;
  email: string;
  doctorProfile: { specialty: { name: string } };
};
type Slot = {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
};
type Appointment = {
  id: number;
  slot: { startTime: string; endTime: string };
  doctor: { user: { name: string; email: string } };
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

type JwtPayload = {
  sub: string;
  role?: string;
  userId?: number;
  exp?: number;
};


export default function UserAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"booking" | "mine">("booking");

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string>("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  

  // โหลด specialties + คิวนัดของเรา
  useEffect(() => {
    fetch(`${API_BASE}/specialties`)
      .then((res) => res.json())
      .then((data) => setSpecialties(data))
      .catch(() => setSpecialties([]));

    loadMyAppointments();
  }, []);

    // ----------------- JWT -----------------
    useEffect(() => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }
  
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.role !== "patient") {
          window.location.href = "/login";
          return;
        }

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
  
  // โหลดหมอตาม specialty
  async function loadDoctors() {
    if (!selectedSpec) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/doctors?specialty=${selectedSpec}`);
      const data = await res.json();
      setDoctors(data);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  // โหลด slots ของหมอ
  async function loadSlots(doctorId: number) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_BASE}/doctors/${doctorId}/slots`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSlots(data);
  }

  // จอง slot
  async function book(slotId: number) {
    const token = localStorage.getItem("accessToken");
    await fetch(`${API_BASE}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ slotId }),
    });
    toast.success("✅ จองสำเร็จ");
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, status: "booked" } : s))
    );
    loadMyAppointments();
  }

  // โหลดนัดของเรา
  async function loadMyAppointments() {
    const token = localStorage.getItem("accessToken");
    fetch(`${API_BASE}/appointments/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch(() => setAppointments([]));
  }

  function formatDateTime(d: string) {
    return new Date(d).toLocaleString("th-TH");
  }

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

        <button
          onClick={() => setActiveTab("booking")}
          className={`px-4 py-2 rounded-lg text-left ${
            activeTab === "booking"
              ? "bg-emerald-500 font-semibold shadow"
              : "hover:bg-emerald-600"
          }`}
        >
          📅 ระบบจองนัดพบแพทย์
        </button>

        <button
          onClick={() => setActiveTab("mine")}
          className={`px-4 py-2 rounded-lg text-left ${
            activeTab === "mine"
              ? "bg-emerald-500 font-semibold shadow"
              : "hover:bg-emerald-600"
          }`}
        >
          🧾 คิวนัดของฉัน
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <h1 className="text-2xl font-bold text-emerald-800 mb-6">
          {activeTab === "booking" ? "ระบบจองนัดพบแพทย์" : "คิวนัดของฉัน"}
        </h1>

        {activeTab === "booking" && (
          <div>
            {/* เลือกสาขา */}
            <div className="mb-6">
              <select
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className="border rounded p-2"
              >
                <option value="">-- เลือกสาขา --</option>
                {Array.isArray(specialties) &&
                  specialties.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
              </select>
              <button
                onClick={loadDoctors}
                className="ml-2 px-3 py-2 bg-emerald-600 text-white rounded"
              >
                🔍 ค้นหา
              </button>
            </div>

            {/* รายชื่อหมอ */}
            {loading && <p>⏳ กำลังโหลด...</p>}
            {doctors.map((d) => (
              <div key={d.user_id} className="border rounded p-4 my-2 bg-white">
                <h3 className="font-semibold text-emerald-700">{d.name}</h3>
                <p className="text-sm text-gray-600">{d.email}</p>
                <p className="text-sm">
                  สาขา: {d.doctorProfile.specialty.name}
                </p>
                <button
                  onClick={() => loadSlots(d.user_id)}
                  className="mt-2 px-3 py-1 bg-sky-500 text-white rounded"
                >
                  ดูเวลาว่าง
                </button>
              </div>
            ))}

            {/* ตาราง slots */}
            {slots.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">เวลาว่างของหมอ</h3>
                <table className="min-w-full border rounded-xl overflow-hidden shadow">
                  <thead className="bg-sky-100 text-sky-800">
                    <tr>
                      <th className="px-2 py-1 text-left">เริ่ม</th>
                      <th className="px-2 py-1 text-left">สิ้นสุด</th>
                      <th className="px-2 py-1 text-left">สถานะ</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((s) => (
                      <tr key={s.id} className="border-t hover:bg-sky-50">
                        <td className="px-2 py-1">{formatDateTime(s.startTime)}</td>
                        <td className="px-2 py-1">{formatDateTime(s.endTime)}</td>
                        <td className="px-2 py-1">{s.status}</td>
                        <td>
                          {s.status === "available" && (
                            <button
                              onClick={() => book(s.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded"
                            >
                              จอง
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "mine" && (
          <div>
            {appointments.length ? (
              <table className="min-w-full border rounded-xl overflow-hidden shadow">
                <thead className="bg-emerald-100 text-emerald-800">
                  <tr>
                    <th className="px-2 py-1 text-left">หมอ</th>
                    <th className="px-2 py-1 text-left">เริ่ม</th>
                    <th className="px-2 py-1 text-left">สิ้นสุด</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id} className="border-t hover:bg-emerald-50">
                      <td className="px-2 py-1">{a.slot.doctor.user.name}</td>
                      <td className="px-2 py-1">{formatDateTime(a.slot.startTime)}</td>
                      <td className="px-2 py-1">{formatDateTime(a.slot.endTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sky-700">❌ คุณยังไม่มีการนัด</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
