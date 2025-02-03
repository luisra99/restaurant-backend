import app from "./app";
const os = require("os")
import AuthRoute from "./auth/routes";
import ConceptRoute from "./routes/concepts.route";
import OfferRoute from "./routes/offer.route";
import TableRoute from "./routes/table.route";
import AccountRoute from "./routes/account.route";
import DivisaRoute from "./routes/divisa.route";
import DependentRoute from "./routes/dependent.route";
import TaxDiscountsRoute from "./routes/taxDiscount.route";
import PrinterRoute from "./routes/printer.route";
import PaymentRoute from "./routes/payments.route";
import OperatorRoute from "./routes/operator.route";
import OptionsRoute from "./routes/options.route";
import LocalRoutes from './routes/local.route';
import AreaRoutes from './routes/area.route';
import InventoryItemRoutes from './routes/inventoryItem.routes';
import InventoryMovementRoutes from './routes/inventoryMovement.routes';
import CashFlowRoutes from './routes/cashflow.route';
import SupplierCustomerRoutes from './routes/customer.route';
import StockRoutes from './routes/stock.route';

import UserRoute from "./routes/users.route";
import { authenticate } from "./auth/middlewares/auth.middleware";

app.use(AuthRoute);
app.use(authenticate, UserRoute);
app.use(authenticate, LocalRoutes);
app.use(authenticate, AreaRoutes);
app.use(authenticate, OperatorRoute);
app.use(authenticate, OptionsRoute);
app.use(authenticate, PaymentRoute);
app.use(authenticate, ConceptRoute);
app.use(authenticate, OfferRoute);
app.use(authenticate, TableRoute);
app.use(authenticate, DivisaRoute);
app.use(authenticate, AccountRoute);
app.use(authenticate, DependentRoute);
app.use(authenticate, TaxDiscountsRoute);
app.use(authenticate, PrinterRoute);
app.use(authenticate, InventoryItemRoutes);
app.use(authenticate, InventoryMovementRoutes);
app.use(authenticate, CashFlowRoutes);
app.use(authenticate, SupplierCustomerRoutes);
app.use(authenticate, StockRoutes);

app.use("/host", (req, res) => {
  const datos: any = os.networkInterfaces()
  let ipAddress

  for (let nombreInterfaz in datos.interfaces) {
    const interfaces = datos.interfaces[nombreInterfaz];

    // Buscar la primera interfaz IPv4 externa
    for (let inteface of interfaces) {
      if (inteface.family === 'IPv4' && !inteface.internal) {
        ipAddress = inteface.address
      }
    }
  }
  res.status(200).json({ ipAddress })
})
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const lineas = 32;
