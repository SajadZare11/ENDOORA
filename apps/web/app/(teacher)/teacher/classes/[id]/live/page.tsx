"use client";

import React, { use, useEffect, useState } from "react";
import { LiveKitClassroomShell } from "../../../../../../components/classroom/LiveKitClassroomShell";
import { fetchTeacherClassDetail, type TeacherClass } from "../../../../../../lib/teacher-classes";

export default function TeacherClassLivePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const unwrappedParams = React.use(params as any) as { id: string };
  const classId = unwrappedParams.id;
  const [cls, setCls] = useState<TeacherClass | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchTeacherClassDetail(classId);
        if (active && data?.class) {
          setCls(data.class);
        }
      } catch {
        // Fallback for offline or test mode
      }
    }
    if (classId) {
      load();
    }
    return () => {
      active = false;
    };
  }, [classId]);

  return (
    <LiveKitClassroomShell
      sessionId={classId}
      initialRole="teacher"
      classTitle={cls?.title ? `${cls.title} (${cls.level || "عمومی"})` : `کلاس آنلاین (${classId})`}
      teacherName="استاد کلاس"
    />
  );
}
