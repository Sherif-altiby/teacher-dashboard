"use client";

import ChangePassword from "../components/dashboard/ChangePassword";
import UpdatTeacherData from "../components/dashboard/UpdatTeacherData";

export default function TeacherSettings() {
  return (
    <div className="min-h-screen   md:p-10">
      <UpdatTeacherData />
      <ChangePassword />
    </div>
  );
}
