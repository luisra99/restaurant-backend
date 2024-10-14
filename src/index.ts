import app from "./app";
import ConceptRoute from "./routes/concepts.route";
import OfferRoute from "./routes/offer.route";

app.use(ConceptRoute);
app.use(OfferRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const lineas = 32;
