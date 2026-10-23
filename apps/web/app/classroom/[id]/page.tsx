import React from 'react';
import { LiveKitClassroomShell } from '@/components/classroom/LiveKitClassroomShell';

interface ClassroomPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}

export default async function ClassroomPage({
  params,
  searchParams,
}: ClassroomPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const role = resolvedSearchParams?.role === 'teacher' ? 'teacher' : 'student';

  return <LiveKitClassroomShell sessionId={id} initialRole={role} />;
}
