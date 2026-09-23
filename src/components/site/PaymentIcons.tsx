// Ícones dos métodos de pagamento — desenhados em SVG (cores/formas oficiais de cada
// bandeira), sem depender de nenhuma imagem externa ou de asset do Lovable.
export function PaymentIcons() {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center items-center">
      <PixIcon />
      <VisaIcon />
      <MastercardIcon />
      <EloIcon />
      <AmexIcon />
      <HipercardIcon />
    </div>
  );
}

function Badge({
  children,
  fill,
}: {
  children: React.ReactNode;
  fill: string;
}) {
  return (
    <svg width="42" height="26" viewBox="0 0 42 26" className="shrink-0">
      <rect width="42" height="26" rx="4" fill={fill} />
      {children}
    </svg>
  );
}

function PixIcon() {
  return (
    <Badge fill="#32BCAD">
      <text
        x="21"
        y="17"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="11"
        fill="#fff"
        letterSpacing="0.3"
      >
        Pix
      </text>
    </Badge>
  );
}

function VisaIcon() {
  return (
    <Badge fill="#1434CB">
      <text
        x="21"
        y="17.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontWeight="800"
        fontSize="11"
        fill="#fff"
        letterSpacing="0.5"
      >
        VISA
      </text>
    </Badge>
  );
}

function MastercardIcon() {
  return (
    <Badge fill="#16171A">
      <circle cx="17.5" cy="13" r="7" fill="#EB001B" />
      <circle cx="24.5" cy="13" r="7" fill="#F79E1B" />
      <path
        d="M21 7.2a7 7 0 0 1 0 11.6 7 7 0 0 1 0-11.6Z"
        fill="#FF5F00"
      />
    </Badge>
  );
}

function EloIcon() {
  return (
    <Badge fill="#000000">
      <text
        x="21"
        y="17.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="12"
      >
        <tspan fill="#FFCB05">e</tspan>
        <tspan fill="#00A4E0">l</tspan>
        <tspan fill="#EE4023">o</tspan>
      </text>
    </Badge>
  );
}

function AmexIcon() {
  return (
    <Badge fill="#016FD0">
      <text
        x="21"
        y="16.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="8.5"
        fill="#fff"
        letterSpacing="0.3"
      >
        AMEX
      </text>
    </Badge>
  );
}

function HipercardIcon() {
  return (
    <Badge fill="#AF1E2D">
      <text
        x="21"
        y="17"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontWeight="800"
        fontSize="8"
        fill="#fff"
      >
        Hipercard
      </text>
    </Badge>
  );
}
