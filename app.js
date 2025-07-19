import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Ruta para recibir mensaje del usuario
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.mensaje;

    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    });

    const respuesta = chat.choices[0].message.content;
    res.json({ respuesta });
  } catch (error) {
    console.error("Error en la solicitud:", error);
    res.status(500).json({ error: "Ocurrió un error al obtener la respuesta." });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
