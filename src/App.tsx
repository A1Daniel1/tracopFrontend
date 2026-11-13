import { useEffect, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Box,
  Camera,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CloudOff,
  Home,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Mic,
  Navigation,
  PackageCheck,
  Plus,
  QrCode,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Truck,
  UserRound,
  Volume2,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

type Role = "productor" | "comprador" | "transportista";
type Screen =
  | "roles"
  | "login"
  | "home"
  | "notifications"
  | "publish"
  | "confirm-offer"
  | "offers"
  | "orders"
  | "order-detail"
  | "freight"
  | "catalog"
  | "offer-detail"
  | "rating"
  | "loads"
  | "route"
  | "qr"
  | "tracking"
  | "delivery"
  | "voice"
  | "states"
  | "menu";

const harvestPhoto =
  "https://images.unsplash.com/photo-1545830790-68595959c491?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900";
const producePhoto =
  "https://images.unsplash.com/photo-1551649001-7a2482d98d05?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900";

const roleNames: Record<Role, string> = {
  productor: "Productor",
  comprador: "Comprador",
  transportista: "Transportista",
};

const screenTitles: Partial<Record<Screen, string>> = {
  notifications: "Notificaciones",
  publish: "Publicar por voz",
  "confirm-offer": "Revisa tu oferta",
  offers: "Mis ofertas",
  orders: "Mis pedidos",
  "order-detail": "Pedido #TR-284",
  freight: "Elegir transporte",
  catalog: "Productos frescos",
  "offer-detail": "Detalle de oferta",
  rating: "Califica tu compra",
  loads: "Cargas disponibles",
  route: "Ruta del día",
  qr: "Escanear lote",
  tracking: "Seguimiento en ruta",
  delivery: "Confirmar entrega",
  voice: "Precios de mi zona",
  states: "Estados de pantalla",
  menu: "Todas las funciones",
};

function AppIcon() {
  return (
    <div className="app-mark" aria-label="TRACOP">
      <Leaf size={26} strokeWidth={2.5} />
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button className={`btn btn-${variant} ${className}`} onClick={onClick} disabled={disabled}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

function SyncChip({ state = "saved" }: { state?: "saved" | "pending" | "synced" }) {
  const labels = {
    saved: "Guardado en el teléfono",
    pending: "Pendiente de sincronizar",
    synced: "Sincronizado",
  };
  const Icon = state === "synced" ? Check : state === "pending" ? Clock3 : CloudOff;
  return (
    <span className={`sync-chip sync-${state}`}>
      <Icon size={13} /> {labels[state]}
    </span>
  );
}

function StatusStepper({ current = 2 }: { current?: number }) {
  const states = ["Solicitado", "Aceptado", "En camino", "Entregado", "Pagado"];
  return (
    <div className="stepper" aria-label={`Estado: ${states[current]}`}>
      <div className="step-line" />
      {states.map((state, index) => (
        <div
          className={`step ${index <= current ? "done" : ""} ${index === current ? "current" : ""}`}
          key={state}
        >
          <span>{index < current ? <Check size={12} /> : index + 1}</span>
          <small>{state}</small>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({
  title,
  action,
  onClick,
}: {
  title: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && <button onClick={onClick}>{action}</button>}
    </div>
  );
}

function Header({
  title,
  back,
  onBack,
  onBell,
  role,
}: {
  title?: string;
  back?: boolean;
  onBack: () => void;
  onBell: () => void;
  role: Role;
}) {
  return (
    <header className="topbar">
      {back ? (
        <button className="icon-btn" onClick={onBack} aria-label="Volver">
          <ArrowLeft />
        </button>
      ) : (
        <div className="mini-brand">
          <AppIcon />
          <div>
            <b>{title || "Hola, María"}</b>
            {!title && <span>{roleNames[role]} · Filandia</span>}
          </div>
        </div>
      )}
      {back && <h1>{title}</h1>}
      <button className="icon-btn notification-btn" onClick={onBell} aria-label="Notificaciones">
        <Bell />
        <i />
      </button>
    </header>
  );
}

function OfflineBanner({ offline, toggle }: { offline: boolean; toggle: () => void }) {
  return (
    <button className={`network-banner ${offline ? "" : "online"}`} onClick={toggle}>
      {offline ? <WifiOff size={17} /> : <Wifi size={17} />}
      <span>
        {offline ? "Sin conexión · Puedes seguir trabajando" : "Con conexión · Todo sincronizado"}
      </span>
      <b>{offline ? "Ver" : "Listo"}</b>
    </button>
  );
}

const navItems: Record<Role, { label: string; icon: typeof Home; screen: Screen }[]> = {
  productor: [
    { label: "Inicio", icon: Home, screen: "home" },
    { label: "Ofertas", icon: Store, screen: "offers" },
    { label: "Pedidos", icon: Box, screen: "orders" },
    { label: "Más", icon: Menu, screen: "menu" },
  ],
  comprador: [
    { label: "Catálogo", icon: Search, screen: "catalog" },
    { label: "Pedidos", icon: Box, screen: "orders" },
    { label: "Precios", icon: Volume2, screen: "voice" },
    { label: "Más", icon: Menu, screen: "menu" },
  ],
  transportista: [
    { label: "Cargas", icon: Box, screen: "loads" },
    { label: "Mi ruta", icon: Navigation, screen: "route" },
    { label: "Escanear", icon: QrCode, screen: "qr" },
    { label: "Más", icon: Menu, screen: "menu" },
  ],
};

function BottomNav({ role, screen, go }: { role: Role; screen: Screen; go: (s: Screen) => void }) {
  return (
    <nav className="bottom-nav">
      {navItems[role].map(({ label, icon: Icon, screen: destination }) => (
        <button
          key={label}
          className={screen === destination ? "active" : ""}
          onClick={() => go(destination)}
        >
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function RoleSelection({ choose }: { choose: (role: Role) => void }) {
  const roles: { role: Role; copy: string; icon: typeof Leaf }[] = [
    { role: "productor", copy: "Publica cosechas y recibe pedidos", icon: Leaf },
    { role: "comprador", copy: "Encuentra productos de origen", icon: Store },
    { role: "transportista", copy: "Lleva cosechas por Colombia", icon: Truck },
  ];
  return (
    <div className="splash">
      <div className="splash-art">
        <img src={harvestPhoto} alt="Productor agrícola con su cosecha" />
        <div className="splash-overlay" />
        <div className="brand-lockup">
          <AppIcon />
          <div>
            <strong>TRACOP</strong>
            <span>Del campo, más cerca.</span>
          </div>
        </div>
      </div>
      <div className="role-sheet">
        <p className="eyebrow">BIENVENIDO</p>
        <h1>¿Cómo quieres usar TRACOP?</h1>
        <p className="muted">Puedes cambiar de perfil después.</p>
        <div className="role-list">
          {roles.map(({ role, copy, icon: Icon }) => (
            <button key={role} onClick={() => choose(role)}>
              <span className={`role-icon ${role}`}>
                <Icon />
              </span>
              <span>
                <b>{roleNames[role]}</b>
                <small>{copy}</small>
              </span>
              <ChevronRight />
            </button>
          ))}
        </div>
        <p className="legal">Al continuar aceptas el tratamiento de datos de TRACOP.</p>
      </div>
    </div>
  );
}

function Login({ role, enter, back }: { role: Role; enter: () => void; back: () => void }) {
  return (
    <div className="auth-screen">
      <button className="icon-btn auth-back" onClick={back}>
        <ArrowLeft />
      </button>
      <AppIcon />
      <p className="eyebrow">{roleNames[role].toUpperCase()}</p>
      <h1>Entra a tu cuenta</h1>
      <p className="muted">Te enviaremos un código. No necesitas contraseña.</p>
      <label className="field-label">Número de celular</label>
      <div className="phone-field">
        <span>+57</span>
        <input defaultValue="310 456 7821" />
      </div>
      <Button onClick={enter}>Continuar</Button>
      <div className="divider">
        <span>o</span>
      </div>
      <Button variant="secondary">Crear una cuenta</Button>
      <div className="offline-promise">
        <CloudOff />
        <span>
          <b>Funciona sin internet</b>Lo que hagas se enviará cuando vuelva la señal.
        </span>
      </div>
    </div>
  );
}

function ProducerHome({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <div className="hero-greeting">
        <p>Tu campo hoy</p>
        <h1>
          Tienes <strong>3 pedidos</strong>
          <br />
          por responder
        </h1>
        <div className="summary-row">
          <div>
            <b>4</b>
            <span>Ofertas activas</span>
          </div>
          <div>
            <b>2</b>
            <span>En camino</span>
          </div>
        </div>
      </div>
      <button className="voice-cta" onClick={() => go("publish")}>
        <span className="mic-orbit">
          <Mic size={31} />
        </span>
        <span>
          <b>Publicar por voz</b>
          <small>Cuéntanos qué cosechaste</small>
        </span>
        <ChevronRight />
      </button>
      <SectionTitle title="Pedidos por responder" action="Ver todos" onClick={() => go("orders")} />
      <button className="order-card" onClick={() => go("order-detail")}>
        <div className="order-top">
          <span className="produce-icon">A</span>
          <div>
            <b>Aguacate Hass</b>
            <small>Pedido de Mercado La 14</small>
          </div>
          <span className="price">$1.480.000</span>
        </div>
        <div className="order-meta">
          <span>
            <Box /> 200 kg
          </span>
          <span>
            <Clock3 /> Hoy, 4:30 p. m.
          </span>
        </div>
        <SyncChip state="pending" />
      </button>
      <SectionTitle title="Saliendo de la finca" />
      <div className="route-mini">
        <div>
          <Truck />
          <i />
        </div>
        <span>
          <b>Tomate chonto · 8 canastillas</b>
          <small>Julián va hacia Armenia · llega 3:20 p. m.</small>
        </span>
      </div>
    </>
  );
}

function Publish({ go }: { go: (s: Screen) => void }) {
  const [recording, setRecording] = useState(false);
  return (
    <div className="voice-publish">
      <div className="tip-card">
        <Sparkles />
        <span>
          <b>Habla con tus palabras</b>Di producto, cantidad, precio y dónde estás.
        </span>
      </div>
      <div className={`recorder ${recording ? "recording" : ""}`}>
        <span className="pulse-ring">
          <Mic size={38} />
        </span>
        <h2>{recording ? "Te estamos escuchando…" : "Toca para empezar"}</h2>
        <p>
          {recording
            ? "“Tengo 200 kilos de aguacate hass…”"
            : "Ejemplo: “Tengo 10 bultos de papa a 90 mil cada uno”"}
        </p>
        <button onClick={() => setRecording(!recording)}>
          {recording ? (
            <>
              <X /> Detener
            </>
          ) : (
            <>
              <Mic /> Grabar oferta
            </>
          )}
        </button>
      </div>
      <button className="photo-add">
        <Camera />
        <span>
          <b>Agregar foto</b>
          <small>Ayuda a vender más rápido</small>
        </span>
        <Plus />
      </button>
      <SyncChip state="saved" />
      <Button onClick={() => go("confirm-offer")} icon={<Sparkles size={20} />}>
        Revisar lo que entendimos
      </Button>
    </div>
  );
}

function ConfirmOffer({ go }: { go: (s: Screen) => void }) {
  const fields = [
    ["Producto", "Aguacate Hass"],
    ["Cantidad", "200 kg"],
    ["Precio", "$7.400 por kg"],
    ["Municipio", "Filandia, Quindío"],
    ["Disponible desde", "18 de junio"],
  ];
  return (
    <>
      <div className="ai-banner">
        <Sparkles />
        <span>
          <b>La IA organizó tu oferta</b>Revisa que todo esté bien antes de publicar.
        </span>
      </div>
      <div className="offer-preview">
        <img src={producePhoto} alt="Cosecha de verduras frescas" />
        <div className="offer-fields">
          {fields.map(([label, value]) => (
            <label key={label}>
              <span>{label}</span>
              <input defaultValue={value} />
            </label>
          ))}
        </div>
      </div>
      <SyncChip state="saved" />
      <div className="stack-actions">
        <Button onClick={() => go("offers")} icon={<Check />}>
          Publicar oferta
        </Button>
        <Button variant="ghost" onClick={() => go("publish")}>
          Volver a grabar
        </Button>
      </div>
    </>
  );
}

function OfferCard({ go, synced = false }: { go: (s: Screen) => void; synced?: boolean }) {
  return (
    <button className="offer-card" onClick={() => go("offer-detail")}>
      <img src={producePhoto} alt="Producto fresco" />
      <div className="offer-card-body">
        <div>
          <span className="category">FRUTA</span>
          <span className="stock">Disponible</span>
        </div>
        <h3>Aguacate Hass</h3>
        <p>
          <MapPin /> Filandia, Quindío
        </p>
        <div className="offer-price">
          <b>
            $7.400 <small>/ kg</small>
          </b>
          <span>200 kg</span>
        </div>
        <SyncChip state={synced ? "synced" : "pending"} />
      </div>
    </button>
  );
}

function Offers({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <div className="tabs">
        <button className="active">
          Activas <i>4</i>
        </button>
        <button>Pausadas</button>
        <button>Vendidas</button>
      </div>
      <div className="list-heading">
        <span>4 ofertas</span>
        <button>
          <SlidersHorizontal /> Ordenar
        </button>
      </div>
      <OfferCard go={go} />
      <div className="simple-offer">
        <span className="produce-icon">T</span>
        <div>
          <b>Tomate chonto</b>
          <small>80 kg · $3.200/kg</small>
          <SyncChip state="synced" />
        </div>
        <ChevronRight />
      </div>
      <button className="fab" onClick={() => go("publish")}>
        <Mic />
        <span>Publicar por voz</span>
      </button>
    </>
  );
}

function Orders({ role, go }: { role: Role; go: (s: Screen) => void }) {
  return (
    <>
      <div className="tabs two">
        <button className="active">
          En curso <i>3</i>
        </button>
        <button>Finalizados</button>
      </div>
      <button className="order-list-card" onClick={() => go("order-detail")}>
        <div className="order-id">
          <span>Pedido #TR-284</span>
          <SyncChip state="synced" />
        </div>
        <div className="order-product">
          <span className="produce-icon">A</span>
          <div>
            <b>Aguacate Hass</b>
            <small>200 kg · $1.480.000</small>
          </div>
          <ChevronRight />
        </div>
        <StatusStepper current={role === "productor" ? 1 : 2} />
        <p className="next-action">
          <Clock3 />{" "}
          {role === "productor"
            ? "Recogida mañana, 7:00 a. m."
            : "Llega hoy entre 3:00 y 4:00 p. m."}
        </p>
      </button>
      <button className="order-list-card muted-card" onClick={() => go("order-detail")}>
        <div className="order-id">
          <span>Pedido #TR-269</span>
          <SyncChip state="pending" />
        </div>
        <div className="order-product">
          <span className="produce-icon tomato">T</span>
          <div>
            <b>Tomate chonto</b>
            <small>80 kg · $256.000</small>
          </div>
          <ChevronRight />
        </div>
        <StatusStepper current={0} />
      </button>
    </>
  );
}

function OrderDetail({ role, go }: { role: Role; go: (s: Screen) => void }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <>
      <div className="status-panel">
        <p>ESTADO DEL PEDIDO</p>
        <h2>
          {accepted
            ? "Pedido aceptado"
            : role === "comprador"
              ? "En camino"
              : "Esperando tu respuesta"}
        </h2>
        <StatusStepper current={accepted ? 1 : role === "comprador" ? 2 : 0} />
      </div>
      <div className="detail-card">
        <div className="order-product">
          <span className="produce-icon">A</span>
          <div>
            <b>Aguacate Hass</b>
            <small>200 kg · $7.400/kg</small>
          </div>
          <b>$1.480.000</b>
        </div>
        <hr />
        <p>
          <UserRound />{" "}
          {role === "comprador" ? "Productora: María González" : "Comprador: Mercado La 14"}
        </p>
        <p>
          <MapPin /> {role === "comprador" ? "Filandia → Armenia" : "Entrega en Armenia, Quindío"}
        </p>
        <p>
          <Clock3 /> Miércoles 19 de junio, 8:00 a. m.
        </p>
      </div>
      {role === "comprador" && (
        <>
          <div className="counteroffer">
            <MessageCircle />
            <span>
              <b>Contraoferta recibida</b>María propone entregar el jueves por la mañana.
            </span>
            <button>Aceptar</button>
          </div>
          <div className="tracking-card">
            <div className="map-pattern">
              <span>Finca El Porvenir</span>
              <i />
              <Truck />
              <b>Armenia</b>
            </div>
            <div>
              <b>Tu pedido está en camino</b>
              <span>Transporta: Julián R. · Placa TQK 218</span>
            </div>
          </div>
          <Button onClick={() => go("rating")} icon={<PackageCheck />}>
            Confirmar entrega
          </Button>
          <Button variant="secondary" icon={<CircleDollarSign />}>
            Confirmar pago de producto y flete
          </Button>
        </>
      )}
      {role === "productor" && (
        <>
          <div className="action-note">
            <b>Responde antes de las 4:30 p. m.</b>
            <span>El comprador recibirá tu respuesta cuando vuelva la señal.</span>
          </div>
          <Button onClick={() => setAccepted(true)} icon={<Check />}>
            {accepted ? "Pedido aceptado" : "Aceptar pedido"}
          </Button>
          <div className="counter-row">
            <Button variant="secondary">Contraofertar precio</Button>
            <Button variant="secondary">Cambiar fecha</Button>
          </div>
          {accepted && (
            <Button variant="secondary" onClick={() => go("freight")} icon={<Truck />}>
              Asignar transportista
            </Button>
          )}
        </>
      )}
    </>
  );
}

function Freight({ go }: { go: (s: Screen) => void }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const drivers = [
    ["Julián Ramírez", "4,9", "$180.000", "Camión 3,5 t · A 18 km"],
    ["Carlos Mena", "4,7", "$165.000", "Camioneta · A 24 km"],
  ];
  return (
    <>
      <div className="freight-summary">
        <Truck />
        <span>
          <b>Filandia → Armenia</b>200 kg · Recogida mañana, 7:00 a. m.
        </span>
      </div>
      <SectionTitle title="2 propuestas recibidas" />
      {drivers.map((d, i) => (
        <button
          className={`driver-card ${chosen === i ? "selected" : ""}`}
          onClick={() => setChosen(i)}
          key={d[0]}
        >
          <span className="avatar">
            {d[0]
              .split(" ")
              .map((x) => x[0])
              .join("")}
          </span>
          <div>
            <b>{d[0]}</b>
            <small>
              <Star /> {d[1]} · {d[3]}
            </small>
            <SyncChip state={i ? "pending" : "synced"} />
          </div>
          <strong>{d[2]}</strong>
          {chosen === i && (
            <i>
              <Check />
            </i>
          )}
        </button>
      ))}
      <div className="price-breakdown">
        <span>
          Producto <b>$1.480.000</b>
        </span>
        <span>
          Flete <b>{chosen === 1 ? "$165.000" : "$180.000"}</b>
        </span>
      </div>
      <Button onClick={() => go("orders")} disabled={chosen === null}>
        Aceptar propuesta
      </Button>
    </>
  );
}

function Catalog({ go }: { go: (s: Screen) => void }) {
  const categories = ["Todo", "Frutas", "Verduras", "Tubérculos"];
  return (
    <>
      <div className="search-row">
        <div>
          <Search />
          <input placeholder="Buscar papa, café, plátano…" />
        </div>
        <button>
          <SlidersHorizontal />
        </button>
      </div>
      <div className="category-scroll">
        {categories.map((c, i) => (
          <button className={i === 0 ? "active" : ""} key={c}>
            {c}
          </button>
        ))}
      </div>
      <div className="filter-summary">
        <MapPin /> Cerca de Armenia <button>Cambiar</button>
      </div>
      <div className="catalog-head">
        <span>
          <b>32 ofertas</b> frescas de hoy
        </span>
        <button>Menor precio</button>
      </div>
      <OfferCard go={go} synced />
      <button className="offer-card compact" onClick={() => go("offer-detail")}>
        <img src={harvestPhoto} alt="Productor con canastas" />
        <div className="offer-card-body">
          <span className="category">VERDURA</span>
          <h3>Tomate chonto</h3>
          <p>
            <MapPin /> Montenegro · 18 km
          </p>
          <div className="offer-price">
            <b>
              $3.200 <small>/ kg</small>
            </b>
            <span>80 kg</span>
          </div>
        </div>
      </button>
    </>
  );
}

function OfferDetail({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <div className="detail-photo">
        <img src={producePhoto} alt="Aguacate Hass fresco" />
        <span>FRUTA · DISPONIBLE</span>
      </div>
      <div className="offer-detail-head">
        <div>
          <h1>Aguacate Hass</h1>
          <p>
            <MapPin /> Filandia, Quindío · A 27 km
          </p>
        </div>
        <button>♡</button>
      </div>
      <div className="big-price">
        <b>$7.400</b>
        <span>por kg</span>
        <i>200 kg disponibles</i>
      </div>
      <div className="producer-row">
        <span className="avatar">MG</span>
        <div>
          <b>María González</b>
          <small>
            <Star /> 4,9 · 38 ventas · Verificada
          </small>
        </div>
        <ChevronRight />
      </div>
      <div className="quality-grid">
        <div>
          <Leaf />
          <b>Cosecha</b>
          <span>De esta semana</span>
        </div>
        <div>
          <Box />
          <b>Pedido mínimo</b>
          <span>50 kg</span>
        </div>
      </div>
      <label className="quantity-field">
        <span>¿Cuánto necesitas?</span>
        <div>
          <button>−</button>
          <input defaultValue="200 kg" />
          <button>+</button>
        </div>
      </label>
      <div className="sticky-action">
        <div>
          <span>Total estimado</span>
          <b>$1.480.000</b>
        </div>
        <Button onClick={() => go("orders")}>Hacer pedido</Button>
      </div>
    </>
  );
}

function Rating({ go }: { go: (s: Screen) => void }) {
  const [rating, setRating] = useState(5);
  return (
    <div className="rating-screen">
      <span className="success-seal">
        <Check />
      </span>
      <h1>¡Pedido entregado!</h1>
      <p>Tu confirmación ayuda a cerrar el trato con confianza.</p>
      <div className="rating-card">
        <span className="avatar">MG</span>
        <h2>¿Cómo te fue con María?</h2>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button onClick={() => setRating(n)} className={n <= rating ? "active" : ""} key={n}>
              <Star />
            </button>
          ))}
        </div>
        <b>{rating === 5 ? "¡Excelente!" : "Gracias por contarnos"}</b>
        <textarea placeholder="Escribe un comentario (opcional)" />
      </div>
      <Button onClick={() => go("orders")}>Enviar calificación</Button>
      <Button variant="ghost" onClick={() => go("orders")}>
        Ahora no
      </Button>
    </div>
  );
}

function Loads({ go }: { go: (s: Screen) => void }) {
  const [offer, setOffer] = useState(false);
  return (
    <>
      <div className="route-filter">
        <MapPin />
        <span>
          <b>Cerca de Armenia</b>Radio de 40 km
        </span>
        <button>Cambiar</button>
      </div>
      <div className="list-heading">
        <span>8 cargas para ti</span>
        <button>
          <SlidersHorizontal /> Filtrar
        </button>
      </div>
      <div className="load-card">
        <div className="load-date">
          <b>MAÑANA</b>
          <span>7:00 a. m.</span>
        </div>
        <div className="route-line">
          <i />
          <span>
            <small>ORIGEN</small>
            <b>Filandia, Quindío</b>
          </span>
          <i />
          <span>
            <small>DESTINO</small>
            <b>Armenia, Quindío</b>
          </span>
        </div>
        <div className="load-stats">
          <span>
            <Box /> 200 kg
          </span>
          <span>
            <Leaf /> Aguacate
          </span>
          <span>27 km</span>
        </div>
        {offer ? (
          <div className="offer-sent">
            <Check />
            <span>
              <b>Propuesta enviada: $180.000</b>
              <small>Pendiente de respuesta</small>
            </span>
          </div>
        ) : (
          <>
            <label className="freight-input">
              Tu valor de flete{" "}
              <div>
                <span>$</span>
                <input defaultValue="180.000" />
                <span>COP</span>
              </div>
            </label>
            <Button onClick={() => setOffer(true)}>Proponer valor</Button>
          </>
        )}
      </div>
      <div className="load-card small">
        <div className="load-date">
          <b>20 JUN</b>
          <span>10:30 a. m.</span>
        </div>
        <div className="route-line">
          <i />
          <span>
            <small>ORIGEN</small>
            <b>Montenegro</b>
          </span>
          <i />
          <span>
            <small>DESTINO</small>
            <b>Pereira</b>
          </span>
        </div>
        <div className="load-stats">
          <span>
            <Box /> 480 kg
          </span>
          <span>
            <Leaf /> Plátano
          </span>
        </div>
      </div>
    </>
  );
}

function RouteScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <div className="route-map">
        <div className="map-roads" />
        <span className="route-pin start">
          <Leaf />
        </span>
        <span className="route-pin truck">
          <Truck />
        </span>
        <span className="route-pin end">
          <Store />
        </span>
        <div className="eta-pill">
          <b>1 h 24 min</b>
          <span>52 km restantes</span>
        </div>
      </div>
      <div className="route-sheet-card">
        <p>RUTA ACTIVA</p>
        <h2>Filandia → Armenia</h2>
        <div className="timeline">
          <span>
            <i />
            <b>7:00 a. m. · Recoger lote</b>
            <small>Finca El Porvenir, Filandia</small>
          </span>
          <span>
            <i />
            <b>8:30 a. m. · Entregar</b>
            <small>Mercado La 14, Armenia</small>
          </span>
        </div>
        <Button onClick={() => go("qr")} icon={<QrCode />}>
          Escanear QR para recoger
        </Button>
        <button className="link-button" onClick={() => go("tracking")}>
          Ver seguimiento en ruta
        </button>
      </div>
    </>
  );
}

function QRScanner({ go }: { go: (s: Screen) => void }) {
  const [scanned, setScanned] = useState(false);
  if (scanned)
    return (
      <div className="scan-confirm">
        <span>
          <Check />
        </span>
        <h1>Lote verificado</h1>
        <p>La información coincide con la carga asignada.</p>
        <div className="lot-card">
          <div>
            <small>LOTE</small>
            <b>TR-284-AH</b>
          </div>
          <hr />
          <p>
            <Leaf /> Aguacate Hass · 200 kg
          </p>
          <p>
            <UserRound /> María González
          </p>
          <p>
            <MapPin /> Finca El Porvenir, Filandia
          </p>
          <SyncChip state="saved" />
        </div>
        <Button onClick={() => go("tracking")}>Confirmar recolección</Button>
      </div>
    );
  return (
    <div className="scanner">
      <div className="camera-view">
        <img src={harvestPhoto} alt="Vista de cámara en la finca" />
        <div className="scan-shade" />
        <div className="scan-box">
          <i />
          <i />
          <i />
          <i />
          <span />
        </div>
        <p>Ubica el código dentro del recuadro</p>
      </div>
      <div className="scanner-actions">
        <button>
          <Volume2 />
          <span>Instrucciones</span>
        </button>
        <button onClick={() => setScanned(true)}>
          <QrCode />
          <span>Simular escaneo</span>
        </button>
        <button>
          <Camera />
          <span>Linterna</span>
        </button>
      </div>
    </div>
  );
}

function Tracking({ go }: { go: (s: Screen) => void }) {
  const [incident, setIncident] = useState(false);
  return (
    <>
      <div className="tracking-status">
        <span className="moving-truck">
          <Truck />
        </span>
        <div>
          <p>EN CAMINO</p>
          <h2>Entrega estimada 8:42 a. m.</h2>
          <span>Actualizado hace 2 min</span>
        </div>
      </div>
      <StatusStepper current={2} />
      <div className="route-map short">
        <div className="map-roads" />
        <span className="route-pin truck">
          <Truck />
        </span>
        <span className="route-pin end">
          <Store />
        </span>
      </div>
      <div className="detail-card">
        <p>
          <Box /> Lote TR-284-AH · 200 kg
        </p>
        <p>
          <MapPin /> Mercado La 14, Armenia
        </p>
        <p>
          <UserRound /> Recibe: Sandra López · 310 555 0182
        </p>
      </div>
      {incident && (
        <div className="incident-panel">
          <b>¿Qué pasó?</b>
          <button>
            Demora en la ruta <ChevronRight />
          </button>
          <button>
            Producto dañado <ChevronRight />
          </button>
          <button>
            Problema con el vehículo <ChevronRight />
          </button>
        </div>
      )}
      <Button
        variant={incident ? "secondary" : "danger"}
        onClick={() => setIncident(!incident)}
        icon={<AlertTriangle />}
      >
        {incident ? "Cerrar opciones" : "Reportar incidencia"}
      </Button>
      <Button onClick={() => go("delivery")} icon={<PackageCheck />}>
        Llegué al destino
      </Button>
    </>
  );
}

function Delivery({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="delivery-screen">
      <span className="success-seal">
        <PackageCheck />
      </span>
      <p className="eyebrow">ÚLTIMO PASO</p>
      <h1>Confirma la entrega</h1>
      <p>Revisa el lote con la persona que recibe.</p>
      <div className="check-list">
        <label>
          <input type="checkbox" defaultChecked />
          <span>
            <b>Producto completo</b>200 kg de Aguacate Hass
          </span>
        </label>
        <label>
          <input type="checkbox" defaultChecked />
          <span>
            <b>Producto en buen estado</b>Sin daños visibles
          </span>
        </label>
        <label>
          <input type="checkbox" />
          <span>
            <b>Recibió el comprador</b>Sandra López · Mercado La 14
          </span>
        </label>
      </div>
      <SyncChip state="saved" />
      <Button onClick={() => go("route")}>Confirmar entrega</Button>
    </div>
  );
}

function Notifications({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <div className="notification-section">
        <span>HOY</span>
        <button onClick={() => go("order-detail")}>
          <i className="notif-icon green">
            <Box />
          </i>
          <div>
            <b>Nuevo pedido recibido</b>
            <p>Mercado La 14 quiere 200 kg de Aguacate Hass.</p>
            <small>Hace 12 min</small>
          </div>
          <em />
        </button>
        <button onClick={() => go("freight")}>
          <i className="notif-icon ochre">
            <Truck />
          </i>
          <div>
            <b>Nueva propuesta de flete</b>
            <p>Julián propone llevar tu pedido por $180.000.</p>
            <small>Hace 35 min</small>
          </div>
          <em />
        </button>
      </div>
      <div className="notification-section">
        <span>AYER</span>
        <button>
          <i className="notif-icon soft">
            <Check />
          </i>
          <div>
            <b>Pedido sincronizado</b>
            <p>Los cambios guardados sin conexión ya están al día.</p>
            <small>Ayer, 5:20 p. m.</small>
          </div>
        </button>
      </div>
    </>
  );
}

function VoicePrices() {
  const [listening, setListening] = useState(false);
  return (
    <div className="voice-chat">
      <div className="assistant-intro">
        <span>
          <Sparkles />
        </span>
        <div>
          <b>Asistente TRACOP</b>
          <p>Pregunta por precios de referencia, incluso con poca señal.</p>
        </div>
      </div>
      <div className="chat-date">HOY</div>
      <div className="bubble user">¿A cómo está el aguacate Hass en el Quindío?</div>
      <div className="bubble bot">
        <b>Precio de referencia hoy</b>
        <h2>
          $7.100 – $7.800 <small>/ kg</small>
        </h2>
        <p>En plazas y ofertas cercanas a Armenia. Tu precio de $7.400 está dentro del rango.</p>
        <small>
          <Clock3 /> Datos guardados a las 6:00 a. m.
        </small>
        <button>
          <Volume2 /> Escuchar respuesta
        </button>
      </div>
      <div className="suggestions">
        <button>Precio de la papa</button>
        <button>Tomate en Armenia</button>
      </div>
      <div className="chat-input">
        <button className={listening ? "active" : ""} onClick={() => setListening(!listening)}>
          <Mic />
        </button>
        <span>{listening ? "Escuchando…" : "Mantén presionado para hablar"}</span>
      </div>
    </div>
  );
}

function StateGallery() {
  return (
    <>
      <SectionTitle title="Vacío" />
      <div className="state-card">
        <span>
          <Leaf />
        </span>
        <h3>Tu cosecha empieza aquí</h3>
        <p>Aún no tienes ofertas activas. Publica la primera hablando.</p>
        <Button icon={<Mic />}>Publicar por voz</Button>
      </div>
      <SectionTitle title="Sin conexión / error" />
      <div className="state-card error">
        <span>
          <WifiOff />
        </span>
        <h3>No pudimos actualizar</h3>
        <p>Tus datos guardados siguen disponibles. Intenta de nuevo cuando tengas señal.</p>
        <Button variant="secondary">Intentar de nuevo</Button>
      </div>
      <SectionTitle title="Cargando" />
      <div className="skeleton-card">
        <i />
        <span />
        <span />
        <span />
      </div>
    </>
  );
}

function MenuScreen({
  role,
  go,
  switchRole,
}: {
  role: Role;
  go: (s: Screen) => void;
  switchRole: () => void;
}) {
  const menus: Record<Role, [Screen, string, typeof Home][]> = {
    productor: [
      ["home", "Inicio", Home],
      ["publish", "Publicar por voz", Mic],
      ["offers", "Mis ofertas", Store],
      ["orders", "Pedidos recibidos", Box],
      ["freight", "Propuestas de flete", Truck],
    ],
    comprador: [
      ["catalog", "Explorar catálogo", Search],
      ["orders", "Mis pedidos", Box],
      ["offer-detail", "Detalle de oferta", Leaf],
      ["voice", "Precios de mi zona", Volume2],
      ["rating", "Calificar productor", Star],
    ],
    transportista: [
      ["loads", "Cargas disponibles", Box],
      ["route", "Ruta del día", Navigation],
      ["qr", "Escanear QR", QrCode],
      ["tracking", "Seguimiento en ruta", Truck],
      ["delivery", "Confirmar entrega", PackageCheck],
    ],
  };
  return (
    <>
      <div className="profile-card">
        <span className="avatar">MG</span>
        <div>
          <b>María González</b>
          <small>{roleNames[role]} · Filandia, Quindío</small>
        </div>
        <button>Editar</button>
      </div>
      <p className="menu-label">FUNCIONES DE {roleNames[role].toUpperCase()}</p>
      <div className="menu-list">
        {menus[role].map(([screen, label, Icon]) => (
          <button key={label} onClick={() => go(screen)}>
            <i>
              <Icon />
            </i>
            <span>{label}</span>
            <ChevronRight />
          </button>
        ))}
      </div>
      <p className="menu-label">AYUDA Y DEMO</p>
      <div className="menu-list">
        <button onClick={() => go("notifications")}>
          <i>
            <Bell />
          </i>
          <span>Notificaciones</span>
          <ChevronRight />
        </button>
        <button onClick={() => go("states")}>
          <i>
            <Sparkles />
          </i>
          <span>Estados de pantalla</span>
          <ChevronRight />
        </button>
        <button onClick={switchRole}>
          <i>
            <UserRound />
          </i>
          <span>Cambiar de rol</span>
          <ChevronRight />
        </button>
      </div>
    </>
  );
}

function App() {
  const [role, setRole] = useState<Role>("productor");
  const [screen, setScreen] = useState<Screen>("roles");
  const [offline, setOffline] = useState(true);
  const [history, setHistory] = useState<Screen[]>([]);

  useEffect(() => {
    document.title = "TRACOP · Del campo, más cerca";
  }, []);

  const go = (next: Screen) => {
    setHistory((h) => [...h.slice(-8), screen]);
    setScreen(next);
  };
  const back = () => {
    const previous = history.at(-1);
    if (previous) {
      setHistory((h) => h.slice(0, -1));
      setScreen(previous);
    } else setScreen(role === "productor" ? "home" : role === "comprador" ? "catalog" : "loads");
  };
  const chooseRole = (nextRole: Role) => {
    setRole(nextRole);
    setScreen("login");
  };
  const enter = () =>
    setScreen(role === "productor" ? "home" : role === "comprador" ? "catalog" : "loads");
  const rootScreens: Screen[] = [
    "home",
    "offers",
    "orders",
    "catalog",
    "loads",
    "route",
    "menu",
    "voice",
  ];
  const shell = !["roles", "login"].includes(screen);
  const backVisible = shell && !rootScreens.includes(screen);

  let content: ReactNode;
  if (screen === "roles") content = <RoleSelection choose={chooseRole} />;
  else if (screen === "login")
    content = <Login role={role} enter={enter} back={() => setScreen("roles")} />;
  else if (screen === "home") content = <ProducerHome go={go} />;
  else if (screen === "publish") content = <Publish go={go} />;
  else if (screen === "confirm-offer") content = <ConfirmOffer go={go} />;
  else if (screen === "offers") content = <Offers go={go} />;
  else if (screen === "orders") content = <Orders role={role} go={go} />;
  else if (screen === "order-detail") content = <OrderDetail role={role} go={go} />;
  else if (screen === "freight") content = <Freight go={go} />;
  else if (screen === "catalog") content = <Catalog go={go} />;
  else if (screen === "offer-detail") content = <OfferDetail go={go} />;
  else if (screen === "rating") content = <Rating go={go} />;
  else if (screen === "loads") content = <Loads go={go} />;
  else if (screen === "route") content = <RouteScreen go={go} />;
  else if (screen === "qr") content = <QRScanner go={go} />;
  else if (screen === "tracking") content = <Tracking go={go} />;
  else if (screen === "delivery") content = <Delivery go={go} />;
  else if (screen === "notifications") content = <Notifications go={go} />;
  else if (screen === "voice") content = <VoicePrices />;
  else if (screen === "states") content = <StateGallery />;
  else
    content = (
      <MenuScreen
        role={role}
        go={go}
        switchRole={() => {
          setScreen("roles");
          setHistory([]);
        }}
      />
    );

  return (
    <main className="workspace">
      <div className="phone-frame">
        <div className="status-bar">
          <span>9:41</span>
          <span>
            <i />
            <i />
            <i /> ▰
          </span>
        </div>
        {shell && <OfflineBanner offline={offline} toggle={() => setOffline(!offline)} />}
        {shell && (
          <Header
            title={screenTitles[screen]}
            back={backVisible}
            onBack={back}
            onBell={() => go("notifications")}
            role={role}
          />
        )}
        <div className={`screen-content screen-${screen}`}>{content}</div>
        {shell && !["qr"].includes(screen) && <BottomNav role={role} screen={screen} go={go} />}
      </div>
      <aside className="prototype-note">
        <div>
          <AppIcon />
          <span>
            <b>TRACOP</b>Prototipo móvil · 390 × 844
          </span>
        </div>
        <p>
          Usa los controles del teléfono para recorrer el flujo. Pulsa el banner de conexión para
          probar ambos estados.
        </p>
        <div className="role-pills">
          {(["productor", "comprador", "transportista"] as Role[]).map((r) => (
            <button
              className={role === r ? "active" : ""}
              key={r}
              onClick={() => {
                setRole(r);
                setScreen(r === "productor" ? "home" : r === "comprador" ? "catalog" : "loads");
              }}
            >
              {roleNames[r]}
            </button>
          ))}
        </div>
        <small>Voz primero · Offline visible · Trazabilidad QR</small>
      </aside>
    </main>
  );
}

export default App;
