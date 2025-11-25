import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description: "API documentation for Expense Tracker backend",
    },
    servers: [
      { url: "http://localhost:5000" },
      { url: "https://expense-tracker-twkk.onrender.com" }
    ],
  },
  apis: ["./src/routes/*.ts"], // scan route files for docs
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger Docs available at /api-docs");
};
