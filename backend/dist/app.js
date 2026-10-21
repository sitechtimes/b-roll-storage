"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
app.use((0, cors_1.default)());
const Routes = require("./routes");
app.use(`/`, Routes);
mongoose_1.default.connect(process.env.MONGO_URI ?? "").catch((err) => {
    console.error("emerson mongo exploded! do you have .env? ", err);
});
mongoose_1.default.connection.once("open", async () => {
    console.log("WE ARE THE EMERSON. WE ARE LOOSE AND WE STRIKE FEAR INTO THOSE WHO HEAR OUR NAME. EMERSON YANG, EMERSON YANG, EMERSON YANG");
    app.listen(port, () => {
        console.log(`App is listening at http://localhost:${port}`);
    });
});
