const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json()); // Habilita la lectura de JSON en el cuerpo

let repertorio = [
  {
    id: 1,
    titulo: "Shape of You",
    artista: "Ed Sheeran",
    tono: "C#m",
  },
  {
    id: 2,
    titulo: "Billie Jean",
    artista: "Michael Jackson",
    tono: "F#",
  },
  {
    id: 3,
    titulo: "Smells Like Teen Spirit",
    artista: "Nirvana",
    tono: "F",
  },
];

let archivo = "repertorio.json";
if (!fs.existsSync(archivo)) {
  fs.writeFileSync(archivo, JSON.stringify(repertorio, null, 2));
  console.log("creando repertorio.json");
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor encendido en el puerto http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/canciones", (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync(archivo, "utf8"));
    res.json(canciones);
  } catch (error) {
    res.status(500).send("Error al leer el repertorio");
  }
});

app.post("/canciones", (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync(archivo, "utf8"));
    const cancion = req.body;
    canciones.push(cancion);
    fs.writeFileSync(archivo, JSON.stringify(canciones, null, 2));
    res.send("Canciones agregadas con exito");
  } catch (error) {
    res.status(500).send("Error al leer el repertorio");
  }
});

app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const cancionActualizada = req.body;
  try {
    let canciones = JSON.parse(fs.readFileSync(archivo, "utf8"));
    canciones = canciones.map((c) =>
      c.id == id ? { ...c, ...cancionActualizada } : c
    );
    fs.writeFileSync(archivo, JSON.stringify(canciones, null, 2));
    res.send("Canción modificada");
  } catch (error) {
    console.error("Error al modificar canción:", error.message);
    res.status(500).send("Error al modificar canción");
  }
});

app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;
  try {
    let canciones = JSON.parse(fs.readFileSync(archivo, "utf8"));
    const existe = canciones.some((c) => c.id == id);
    if (!existe) {
      return res.status(404).send(`No se encontró canción con id ${id}`);
    }
    canciones = canciones.filter((c) => c.id != id);
    fs.writeFileSync(archivo, JSON.stringify(canciones, null, 2));
    res.send(`Canción con id ${id} eliminada`);
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).send("Error al eliminar canción");
  }
});
