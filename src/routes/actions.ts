export enum AccountActions {
    openAccount = "openAccount",
    modifyAccountDetails = "modifyAccountDetails",
    modifyTaxes = "modifyTaxes",
    modifyAccount = "modifyAccount",
    deleteAccountDetails = "deleteAccountDetails",
    listAccounts = "listAccounts",
    getAccount = "getAccount",
    closeAccount = "closeAccount",
    deleteAccount = "deleteAccount",
    marchOrders = "marchOrders"
}
export enum ConceptActions {
    createConcept = "createConcept",
    updateConcept = "updateConcept",
    deleteConcept = "deleteConcept",
    getConcepts = "getConcepts",
    getConceptById = "getConceptById"
}
export enum DependentActions {
    listDependents = "listDependents",
    getDependentById = "getDependentById",
    createDependent = "createDependent",
    updateDependent = "updateDependent",
    deleteDependent = "deleteDependent"
}
export enum OfferActions {
    createOffer = "createOffer",
    listOffers = "listOffers",
    listRecentOffers = "listRecentOffers",
    getOffer = "getOffer",
    updateOffer = "updateOffer",
    deleteOffer = "deleteOffer",
    findOffersByArea = "findOffersByArea",
    findOffersByCategory = "findOffersByCategory",
    findOffersByPriceRange = "findOffersByPriceRange",
    searchOffers = "searchOffers"
}
export enum DivisaActions {
    listDivisas = "listDivisas",
    getDivisaById = "getDivisaById",
    createDivisa = "createDivisa",
    updateDivisa = "updateDivisa",
    deleteDivisa = "deleteDivisa"
}
export enum TableActions {
    createTable = "createTable",
    listTables = "listTables",
    getTable = "getTable",
    updateTable = "updateTable",
    deleteTable = "deleteTable"
}
export enum TaxDiscountActions {
    listTaxDiscounts = "listTaxDiscounts",
    getTaxDiscountById = "getTaxDiscountById",
    createTaxDiscount = "createTaxDiscount",
    updateTaxDiscount = "updateTaxDiscount",
    deleteTaxDiscount = "deleteTaxDiscount",
    alterTaxDiscount = "alterTaxDiscount",
}
export enum PrintActions {
    printRecipe = "printRecipe",
    printAreas = "printAreas",
    operatorInform = "operatorInform"
}
