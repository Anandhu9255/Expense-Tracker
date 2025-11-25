import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description: "API documentation for Expense Tracker backend",
      xRefresh: "1.0.1"  // 👈🔥 FORCE SWAGGER JSON REBUILD
    },
    servers: [
      { url: "https://expense-tracker-twkk.onrender.com", description: "Render Deployment" },
      { url: "http://localhost:5000", description: "Local Server" }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        CreateUser: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },

        LoginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },

        CreateExpenseRequest: {
          type: "object",
          required: ["title", "amount", "category"],
          properties: {
            title: { type: "string" },
            amount: { type: "number" },
            category: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date-time" },
          },
        },

        UpdateExpenseRequest: {
          type: "object",
          properties: {
            title: { type: "string" },
            amount: { type: "number" },
            category: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date-time" },
          },
        },

        Expense: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            amount: { type: "number" },
            category: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date-time" },
            user: { type: "string" },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger Docs available at /api-docs");
};
