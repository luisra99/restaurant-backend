import app from "./app";
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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const lineas = 32;
