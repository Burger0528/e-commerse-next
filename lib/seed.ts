import { MongoClient } from "mongodb";
import type { ProductDocument } from "./types";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/simulacro";

const products: Omit<ProductDocument, "_id">[] = [
  {
    name: "Auriculares Inalámbricos Pro",
    price: 89.99,
    category: "Electrónica",
    imageUrl: "/images/headphones.jpg",
    shortDescription: "Sonido premium con cancelación de ruido activa.",
    extendedDescription:
      "Experimenta el audio de alta fidelidad con controladores de 40 mm y tecnología de cancelación de ruido híbrida. La batería de 30 horas y la conectividad multipunto te acompañan durante todo el día.",
    specifications: [
      { label: "Conectividad", value: "Bluetooth 5.3" },
      { label: "Batería", value: "30 horas" },
      { label: "Peso", value: "250 g" },
      { label: "Cancelación de ruido", value: "Activa (ANC)" },
    ],
    stock: 42,
    createdAt: new Date("2025-01-10"),
  },
  {
    name: "Teclado Mecánico Compacto",
    price: 129.00,
    category: "Periféricos",
    imageUrl: "/images/keyboard.jpg",
    shortDescription: "Switches táctiles silenciosos para mayor comodidad.",
    extendedDescription:
      "Diseño 75% sin numpad para más espacio de escritorio. Los switches Brown ofrecen retroalimentación táctil sin el ruido del clic. Retroiluminación RGB por tecla con 16 millones de colores.",
    specifications: [
      { label: "Layout", value: "75% (84 teclas)" },
      { label: "Switches", value: "Brown táctico" },
      { label: "Retroiluminación", value: "RGB por tecla" },
      { label: "Conexión", value: "USB-C / Bluetooth" },
    ],
    stock: 18,
    createdAt: new Date("2025-02-05"),
  },
  {
    name: "Mouse Ergonómico Vertical",
    price: 54.99,
    category: "Periféricos",
    imageUrl: "/images/mouse.jpg",
    shortDescription: "Reduce la fatiga con postura natural de la muñeca.",
    extendedDescription:
      "El diseño vertical mantiene el antebrazo en posición neutra, reduciendo la tensión muscular hasta en un 60%. Sensor óptico de 4000 DPI ajustable en 4 niveles.",
    specifications: [
      { label: "DPI", value: "800 / 1600 / 2400 / 4000" },
      { label: "Botones", value: "6 programables" },
      { label: "Conexión", value: "USB receptor 2.4 GHz" },
      { label: "Batería", value: "6 meses (AA)" },
    ],
    stock: 67,
    createdAt: new Date("2025-02-20"),
  },
  {
    name: "Monitor 4K 27\"",
    price: 349.00,
    category: "Monitores",
    imageUrl: "/images/monitor.jpg",
    shortDescription: "Panel IPS 4K con cobertura sRGB 99%.",
    extendedDescription:
      "Panel IPS de 27 pulgadas con resolución 3840×2160. Cobertura del 99% del espacio de color sRGB y tiempo de respuesta de 5 ms GTG. Compatible con HDR400 y FreeSync Premium.",
    specifications: [
      { label: "Resolución", value: "3840 × 2160 (4K)" },
      { label: "Panel", value: "IPS" },
      { label: "Frecuencia", value: "144 Hz" },
      { label: "Tiempo de respuesta", value: "5 ms GTG" },
      { label: "HDR", value: "HDR400" },
    ],
    stock: 9,
    createdAt: new Date("2025-03-01"),
  },
  {
    name: "Silla de Escritorio Ergonómica",
    price: 299.00,
    category: "Mobiliario",
    imageUrl: "/images/chair.jpg",
    shortDescription: "Soporte lumbar ajustable para largas jornadas.",
    extendedDescription:
      "Respaldo de malla transpirable con soporte lumbar ajustable en altura y profundidad. Reposabrazos 4D para adaptarse a cualquier postura. Capacidad de carga de 120 kg.",
    specifications: [
      { label: "Material respaldo", value: "Malla transpirable" },
      { label: "Reposabrazos", value: "4D ajustables" },
      { label: "Altura asiento", value: "42 – 52 cm" },
      { label: "Carga máxima", value: "120 kg" },
    ],
    stock: 14,
    createdAt: new Date("2025-03-15"),
  },
  {
    name: "Hub USB-C 7 en 1",
    price: 39.99,
    category: "Accesorios",
    imageUrl: "/images/hub.jpg",
    shortDescription: "Expande tu laptop con 7 puertos en un solo adaptador.",
    extendedDescription:
      "Convierte un único puerto USB-C en HDMI 4K, 3× USB-A 3.0, SD/microSD y carga de paso de 100 W. Carcasa de aluminio con disipación de calor pasiva.",
    specifications: [
      { label: "Puertos", value: "HDMI, 3× USB-A, SD, microSD, USB-C PD" },
      { label: "Salida vídeo", value: "HDMI 4K 30 Hz" },
      { label: "Carga paso", value: "100 W" },
      { label: "Material", value: "Aluminio" },
    ],
    stock: 95,
    createdAt: new Date("2025-04-01"),
  },
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    // Ensure collections exist (createCollection is idempotent)
    const existingCollections = (await db.listCollections().toArray()).map(
      (c) => c.name
    );
    for (const name of ["users", "products", "cart", "favorites", "sales"]) {
      if (!existingCollections.includes(name)) {
        await db.createCollection(name);
        console.log(`Created collection: ${name}`);
      }
    }

    // Clear and re-seed products
    const col = db.collection<Omit<ProductDocument, "_id">>("products");
    await col.deleteMany({});
    const result = await col.insertMany(products);
    console.log(`Inserted ${result.insertedCount} products.`);

    console.log("Seed complete.");
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
