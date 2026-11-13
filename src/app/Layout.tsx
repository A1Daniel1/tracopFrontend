import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRole } from "./role";
import { infoDeRuta } from "./rutas";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { OfflineBanner } from "@/shared/ui";

export function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { rol } = useRole();

  const info = infoDeRuta(pathname);

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
        {info.shell && <OfflineBanner />}
        {info.shell && rol && (
          <Header
            title={info.titulo}
            back={!info.raiz}
            onBack={() => navigate(-1)}
            onBell={() => navigate("/notificaciones")}
            role={rol}
          />
        )}
        <div className={`screen-content screen-${info.pantalla}`}>
          <Outlet />
        </div>
        {info.shell && rol && info.pantalla !== "qr" && <BottomNav rol={rol} />}
      </div>
    </main>
  );
}
