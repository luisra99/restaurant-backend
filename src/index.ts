import app from "./app";
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

app.use(OperatorRoute);
app.use(OptionsRoute);
app.use(PaymentRoute);
app.use(ConceptRoute);
app.use(OfferRoute);
app.use(TableRoute);
app.use(DivisaRoute);
app.use(AccountRoute);
app.use(DependentRoute);
app.use(TaxDiscountsRoute);
app.use(PrinterRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const lineas = 32;
