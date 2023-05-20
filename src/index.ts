require("dotenv/config");
require("regenerator-runtime");

import app from "./lib/app";

const PORT = process.env.PORT || 4000;

const api = app.listen(PORT, () => console.info(`Server up and running on port ${PORT}`));

export default api;

