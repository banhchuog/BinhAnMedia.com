import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposal — Bình An Media",
  description: "Production proposal from Bình An Media",
  robots: { index: false, follow: false },
};

export default function ProposalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
