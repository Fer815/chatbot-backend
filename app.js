import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors"; // 👈 Importamos cors

dotenv.config();

const app = express();

// Habilita CORS para todas las rutas
app.use(cors()); // 👈 Usa cors como middleware

// Middleware para parsear JSON
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

// Ruta pública para el robot de cron-job.org
app.get("/ping", (req, res) => {
  // 1. Configuramos los headers y respondemos de inmediato
  res.status(200).setHeader("Content-Type", "text/plain");
  res.write("Despertando el servidor del Chatbot de IA... 🤖\n");

  let ciclos = 0;
  
  // 2. Un intervalo que se ejecuta cada 10 segundos (10000 ms)
  const intervalId = setInterval(() => {
    ciclos++;
    res.write(`Calentando motores de IA... ciclo ${ciclos}\n`);
    
    // 3. Cuando llegamos a 6 ciclos (60 segundos en total), cerramos la conexión
    if (ciclos >= 6) {
      clearInterval(intervalId);
      res.end("El servidor de IA está 100% operativo y listo. 🚀");
    }
  }, 10000);
  
  // IMPORTANTE: Si el cliente (cron-job) cancela la petición antes de tiempo,
  // limpiamos el intervalo para no dejar procesos fantasma consumiendo memoria.
  req.on('close', () => {
    clearInterval(intervalId);
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
