import React from "react";
import { PrivacyOperationsDashboard } from "../../../components/privacy/PrivacyOperationsDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Operations | Endoora",
  description: "Data protection and privacy compliance dashboard.",
};

export default function PrivacyOperationsPage() {
  return <PrivacyOperationsDashboard />;
}
