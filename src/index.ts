import app from "./app";
import ConceptRoute from "./routes/concepts.route";
import OfferRoute from "./routes/offer.route";
import TableRoute from "./routes/table.route";
import AccountRoute from "./routes/account.route";
import DivisaRoute from "./routes/divisa.route";
import DependentRoute from "./routes/dependent.route";

app.use(ConceptRoute);
app.use(OfferRoute);
app.use(TableRoute);
app.use(DivisaRoute);
app.use(AccountRoute);
app.use(DependentRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const lineas = 32;
