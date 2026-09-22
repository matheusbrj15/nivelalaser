import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "./TopBar";
import { SiteFooter } from "./SiteFooter";

export function InstitutionalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <main className="flex-1">
        <div className="container-page py-6 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-compra-certa hover:underline mb-5"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-6 leading-tight">
            {title}
          </h1>
          <div className="prose-institutional text-[15px] leading-relaxed text-navy/90 space-y-5">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Section({
  heading,
  children,
}: {
  heading?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      {heading && (
        <h2 className="text-lg font-bold text-navy mt-2">{heading}</h2>
      )}
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}
