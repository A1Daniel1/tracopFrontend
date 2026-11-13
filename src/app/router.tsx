import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { MenuScreen } from "./MenuScreen";
import { RequireRole } from "./RequireRole";
import { RoleSelection } from "@/features/auth/RoleSelection";
import { Login } from "@/features/auth/Login";
import { VoicePrices } from "@/features/assistant/VoicePrices";
import { Catalog } from "@/features/catalog/Catalog";
import { OfferDetail } from "@/features/catalog/OfferDetail";
import { Freight } from "@/features/freight/Freight";
import { Notifications } from "@/features/notifications/Notifications";
import { ConfirmOffer } from "@/features/offers/ConfirmOffer";
import { Offers } from "@/features/offers/Offers";
import { ProducerHome } from "@/features/offers/ProducerHome";
import { Publish } from "@/features/offers/Publish";
import { OrderDetail } from "@/features/orders/OrderDetail";
import { Orders } from "@/features/orders/Orders";
import { Rating } from "@/features/orders/Rating";
import { Delivery } from "@/features/shipments/Delivery";
import { Loads } from "@/features/shipments/Loads";
import { QRScanner } from "@/features/shipments/QRScanner";
import { RouteScreen } from "@/features/shipments/RouteScreen";
import { Tracking } from "@/features/shipments/Tracking";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route
        path="/entrar"
        element={
          <RequireRole>
            <Login />
          </RequireRole>
        }
      />

      <Route element={<RequireRole rol="productor" />}>
        <Route element={<Layout />}>
          <Route path="/productor" element={<ProducerHome />} />
          <Route path="/productor/publicar" element={<Publish />} />
          <Route path="/productor/confirmar" element={<ConfirmOffer />} />
          <Route path="/productor/ofertas" element={<Offers />} />
          <Route path="/productor/pedidos" element={<Orders />} />
          <Route path="/productor/pedido" element={<OrderDetail />} />
          <Route path="/productor/flete" element={<Freight />} />
        </Route>
      </Route>

      <Route element={<RequireRole rol="comprador" />}>
        <Route element={<Layout />}>
          <Route path="/comprador" element={<Catalog />} />
          <Route path="/comprador/oferta" element={<OfferDetail />} />
          <Route path="/comprador/pedidos" element={<Orders />} />
          <Route path="/comprador/pedido" element={<OrderDetail />} />
          <Route path="/comprador/precios" element={<VoicePrices />} />
          <Route path="/comprador/calificar" element={<Rating />} />
        </Route>
      </Route>

      <Route element={<RequireRole rol="transportista" />}>
        <Route element={<Layout />}>
          <Route path="/transportista" element={<Loads />} />
          <Route path="/transportista/ruta" element={<RouteScreen />} />
          <Route path="/transportista/escanear" element={<QRScanner />} />
          <Route path="/transportista/seguimiento" element={<Tracking />} />
          <Route path="/transportista/entrega" element={<Delivery />} />
        </Route>
      </Route>

      <Route element={<RequireRole />}>
        <Route element={<Layout />}>
          <Route path="/menu" element={<MenuScreen />} />
          <Route path="/notificaciones" element={<Notifications />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
