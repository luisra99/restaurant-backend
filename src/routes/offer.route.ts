import { Router } from "express";
import {
  createOffer,
  listOffers,
  updateOffer,
  deleteOffer,
  findOffersByArea,
  findOffersByCategory,
  findOffersByPriceRange,
  searchOffers,
  getOffer,
  listRecentOffers,
} from "../controller/offer.controller";
import upload from "../libs/multerConfig";

const router = Router();

// Rutas CRUD básicas
router.post("/offers", upload.single("image"), createOffer); // Carga de una sola imagen
router.get("/offers", listOffers);
router.get("/offers/recent", listRecentOffers);
router.get("/offers/:id", getOffer);
router.put("/offers/:id", upload.single("image"), updateOffer); // Carga de una sola imagen para actualizar
router.delete("/offers/:id", deleteOffer);

// Rutas específicas de búsqueda
router.get("/offers/area/:idArea", findOffersByArea);
router.get("/offers/category/:idCategory", findOffersByCategory);
router.get("/offers/price-range", findOffersByPriceRange);
router.get("/offers/search", searchOffers);

export default router;
