// server/app.ts
import express, { Router } from "express";
import path2 from "path";
import fs2 from "fs";
import crypto2 from "crypto";
import dotenv from "dotenv";

// server/db.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { MongoClient } from "mongodb";

// server/initialData.ts
var initialArticles = [
  {
    id: "noticia-1",
    title: "Inauguran nuevo Parque Bot\xE1nico y Corredor Ecol\xF3gico en el Centro Hist\xF3rico",
    summary: "La obra comunitaria cuenta con m\xE1s de 12 hect\xE1reas de \xE1reas verdes, ciclov\xEDas seguras y sistema de riego sostenible con aguas regeneradas.",
    content: `El alcalde municipal, junto con asociaciones vecinales y ambientalistas locales, cort\xF3 la cinta inaugural del nuevo Parque Bot\xE1nico y Corredor Ecol\xF3gico de la ciudad.

Este proyecto de recuperaci\xF3n urbana representa una inversi\xF3n de m\xE1s de 4.2 millones de d\xF3lares y transforma una antigua zona industrial en desuso en el principal pulm\xF3n verde del distrito central.

Entre sus principales atractivos destacan:
\u2022 M\xE1s de 1,500 especies vegetales aut\xF3ctonas catalogadas con c\xF3digos interactivos.
\u2022 Un lago artificial alimentado por captaci\xF3n pluvial.
\u2022 4.5 kil\xF3metros de senderos peatonales y ciclov\xEDas protegidas.
\u2022 Espacios dedicados a talleres comunitarios de huertos urbanos y compostaje.

"Este parque no solo embellece nuestra ciudad, sino que devuelve la biodiversidad a nuestros barrios y crea un punto de encuentro saludable para familias y j\xF3venes", expres\xF3 la arquitecta paisajista Mar\xEDa Dolores Vega durante el acto de apertura.`,
    category: "Local",
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Vista a\xE9rea de los nuevos senderos y jardines tem\xE1ticos en el parque reci\xE9n inaugurado.",
    author: "Elena Rivas",
    date: "14 de Septiembre, 2026",
    readTime: "4 min de lectura",
    featured: true,
    views: 1420
  },
  {
    id: "noticia-2",
    title: "Estudiantes del Instituto Tecnol\xF3gico ganan torneo regional de Rob\xF3tica e Inteligencia Artificial",
    summary: "El equipo de j\xF3venes innovadores desarroll\xF3 un dron submarino aut\xF3nomo capaz de detectar micropl\xE1sticos en r\xEDos y embalses locales.",
    content: `Un grupo de cuatro estudiantes de \xFAltimo a\xF1o del Instituto Tecnol\xF3gico Local se alz\xF3 con la medalla de oro en el certamen regional de tecnolog\xEDa aplicada celebrado el pasado fin de semana.

El prototipo, bautizado como 'AquaScan-IV', utiliza algoritmos de visi\xF3n por computadora para analizar la turbidez del agua y cartografiar focos de contaminaci\xF3n en tiempo real sin requerir intervenci\xF3n humana directa.

Las autoridades educativas han anunciado una beca especial de investigaci\xF3n para apoyar la patente del dispositivo y llevar su despliegue piloto a la cuenca del r\xEDo municipal durante el pr\xF3ximo mes.`,
    category: "Comunidad",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "El equipo de rob\xF3tica posa junto a su dron de detecci\xF3n ambiental galardonado.",
    author: "Carlos Men\xE9ndez",
    date: "13 de Septiembre, 2026",
    readTime: "3 min de lectura",
    featured: false,
    views: 890
  },
  {
    id: "noticia-3",
    title: "Club Atl\xE9tico Municipal avanza a semifinales tras emocionante victoria en tiempo extra",
    summary: "Con gol ag\xF3nico en el minuto 118, el equipo local sell\xF3 su pase en una noche hist\xF3rica ante m\xE1s de quince mil fan\xE1ticos en el estadio.",
    content: `En una velada cargada de dramatismo e intensidad futbol\xEDstica, el Club Atl\xE9tico Municipal venci\xF3 2-1 al Deportivo Uni\xF3n y asegur\xF3 su clasificaci\xF3n a las semifinales de la Copa Regional.

El tanto decisivo lleg\xF3 tras un tiro de esquina ejecutado con precisi\xF3n milim\xE9trica que el delantero juvenil Mateo Peralta conect\xF3 de cabeza directo al \xE1ngulo superior izquierdo.

La afici\xF3n invadi\xF3 las calles adyacentes para festejar un hito que no se alcanzaba desde el campeonato de 2014. El t\xE9cnico agradeci\xF3 el apoyo incondicional de la hinchada.`,
    category: "Deportes",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Celebraci\xF3n del gol decisivo en el minuto 118 frente a la grada local.",
    author: "Joaqu\xEDn Salgado",
    date: "12 de Septiembre, 2026",
    readTime: "5 min de lectura",
    featured: false,
    views: 2150
  },
  {
    id: "noticia-4",
    title: "Comienza la 28\xAA Feria Internacional del Libro y Expresi\xF3n Art\xEDstica",
    summary: "M\xE1s de ochenta casas editoriales independientes y creadores locales se dan cita en la plaza mayor con charlas magistrales y recitales po\xE9ticos.",
    content: `La emblem\xE1tica Feria del Libro abri\xF3 sus puertas este lunes con una programaci\xF3n que incluye m\xE1s de 120 actividades gratuitas para todas las edades.

Entre las novedades de este a\xF1o destaca el pabell\xF3n de autores emergentes, un espacio de digitalizaci\xF3n de relatos orales de los barrios m\xE1s antiguos y talleres de ilustraci\xF3n infantil.

El evento se extender\xE1 hasta el pr\xF3ximo domingo con entrada libre y gratuita para toda la comunidad.`,
    category: "Cultura",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Pabell\xF3n central de literatura y expositores en la apertura de la feria.",
    author: "Sof\xEDa Valenzuela",
    date: "11 de Septiembre, 2026",
    readTime: "3 min de lectura",
    featured: false,
    views: 640
  },
  {
    id: "noticia-5",
    title: "Comercio local reporta crecimiento de 15% gracias al programa de consumo barrial",
    summary: "Las peque\xF1as tiendas de barrio, panader\xEDas y mercados tradicionales incrementaron ventas tras la implementaci\xF3n de cuponeras y promociones municipales.",
    content: `El balance del tercer trimestre presentado por la C\xE1mara de Comercio Local arroj\xF3 cifras sumamente positivas para los negocios de proximidad.

La iniciativa 'Compra en tu Barrio', impulsada conjuntamente por comerciantes y la administraci\xF3n comunal, ha logrado incentivar que las familias realicen sus compras cotidianas en los peque\xF1os almacenes y ferias zonales.

Se prev\xE9 una segunda fase para finales de a\xF1o con descuentos especiales durante la temporada festiva.`,
    category: "Econom\xEDa",
    image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Comerciantes locales reportan mejores ingresos gracias a la fidelizaci\xF3n barrial.",
    author: "Mariano Castro",
    date: "10 de Septiembre, 2026",
    readTime: "4 min de lectura",
    featured: false,
    views: 520
  },
  {
    id: "noticia-6",
    title: "Modernizan central de monitoreo ciudadano con 80 nuevas c\xE1maras de vigilancia en puntos estrat\xE9gicos",
    summary: "El nuevo sistema cuenta con botones de p\xE1nico conectados directamente al servicio de emergencias y patrullaje preventivo.",
    content: `Las autoridades de seguridad ciudadana presentaron las nuevas instalaciones de la central de vigilancia integrada.

Las nuevas c\xE1maras de alta resoluci\xF3n han sido instaladas en paradas de autobuses, accesos escolares y avenidas principales con el objetivo de prevenir delitos y coordinar r\xE1pidamente la respuesta de ambulancias y patrullas.

Los vecinos podr\xE1n acceder a reportes de incidencias a trav\xE9s de una aplicaci\xF3n comunitaria.`,
    category: "Seguridad",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Pantallas del centro de monitoreo municipal operando las 24 horas del d\xEDa.",
    author: "Elena Rivas",
    date: "09 de Septiembre, 2026",
    readTime: "3 min de lectura",
    featured: false,
    views: 1100
  }
];

// server/db.ts
function getStoragePaths() {
  const defaultDir = path.join(process.cwd(), "data");
  const defaultFile = path.join(defaultDir, "db.json");
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDir = path.join("/tmp", "data");
    const tmpFile = path.join(tmpDir, "db.json");
    return { dir: tmpDir, file: tmpFile, seedFile: defaultFile };
  }
  return { dir: defaultDir, file: defaultFile, seedFile: defaultFile };
}
function hashPassword(password) {
  const salt = "los_internacionalitos_salt";
  return crypto.scryptSync(password, salt, 64).toString("hex");
}
function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}
var DEFAULT_SUPERADMIN = {
  id: "superadmin-1",
  name: "Super Administrador",
  email: "moelvlmax@gmail.com",
  passwordHash: hashPassword("mediafire4w7"),
  role: "superadmin",
  createdAt: (/* @__PURE__ */ new Date()).toISOString()
};
var DatabaseService = class {
  constructor() {
    this.mongoClient = null;
    this.mongoDb = null;
    this.isConnectedToMongo = false;
    this.mongoStatusMessage = "Iniciando conexi\xF3n...";
    this.localArticles = [];
    this.localUsers = [];
    this.initLocalStorage();
    this.tryConnectMongo().catch((err) => {
      console.warn("Mongo connection attempt caught in constructor:", err);
    });
  }
  initLocalStorage() {
    try {
      const { dir, file, seedFile } = getStoragePaths();
      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch {
        }
      }
      let raw = null;
      if (fs.existsSync(file)) {
        raw = fs.readFileSync(file, "utf-8");
      } else if (fs.existsSync(seedFile)) {
        raw = fs.readFileSync(seedFile, "utf-8");
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        this.localArticles = parsed.articles || [];
        this.localUsers = (parsed.users || []).filter(
          (u) => u.email !== "admin@losinternacionalitos.com" && u.email !== "lector@losinternacionalitos.com"
        );
        const superIndex = this.localUsers.findIndex((u) => u.email === "moelvlmax@gmail.com");
        if (superIndex === -1) {
          this.localUsers.unshift(DEFAULT_SUPERADMIN);
        } else {
          this.localUsers[superIndex].role = "superadmin";
          this.localUsers[superIndex].passwordHash = hashPassword("mediafire4w7");
        }
        this.saveLocalStorage();
      } else {
        this.localArticles = [...initialArticles];
        this.localUsers = [DEFAULT_SUPERADMIN];
        this.saveLocalStorage();
      }
    } catch (err) {
      console.error("Error initializing local database storage:", err);
      this.localArticles = [...initialArticles];
      this.localUsers = [DEFAULT_SUPERADMIN];
    }
  }
  saveLocalStorage() {
    try {
      const { dir, file } = getStoragePaths();
      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch {
        }
      }
      fs.writeFileSync(
        file,
        JSON.stringify({ articles: this.localArticles, users: this.localUsers }, null, 2),
        "utf-8"
      );
    } catch (err) {
      console.warn("Storage write skipped or non-critical error:", err);
    }
  }
  async tryConnectMongo() {
    const mongoUri = process.env.MONGODB_URI?.trim();
    if (!mongoUri) {
      this.isConnectedToMongo = false;
      this.mongoStatusMessage = "Modo Local activo. Para conectar con MongoDB Atlas, define MONGODB_URI en Variables de Entorno.";
      return false;
    }
    try {
      if (this.mongoClient) {
        try {
          await this.mongoClient.close();
        } catch {
        }
      }
      console.log("Intentando conectar con MongoDB Atlas...");
      this.mongoClient = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 5e3,
        connectTimeoutMS: 5e3
      });
      await this.mongoClient.connect();
      this.mongoDb = this.mongoClient.db("los_internacionalitos");
      this.isConnectedToMongo = true;
      this.mongoStatusMessage = "Conectado exitosamente a MongoDB Atlas (Base de datos: los_internacionalitos)";
      console.log("\xA1Conexi\xF3n exitosa a MongoDB Atlas!");
      await this.seedMongoIfEmpty();
      return true;
    } catch (err) {
      console.warn("No se pudo conectar a MongoDB Atlas:", err.message);
      this.isConnectedToMongo = false;
      this.mongoStatusMessage = `Error de conexi\xF3n a Mongo Atlas: ${err.message}. Operando en almacenamiento persistente local.`;
      return false;
    }
  }
  async seedMongoIfEmpty() {
    if (!this.mongoDb) return;
    try {
      const articlesCol = this.mongoDb.collection("articles");
      const usersCol = this.mongoDb.collection("users");
      const articlesCount = await articlesCol.countDocuments();
      if (articlesCount === 0) {
        console.log("Sembrando noticias iniciales en MongoDB Atlas...");
        await articlesCol.insertMany(this.localArticles.length > 0 ? this.localArticles : initialArticles);
      }
      const usersCount = await usersCol.countDocuments();
      if (usersCount === 0) {
        console.log("Sembrando usuario superadmin inicial en MongoDB Atlas...");
        await usersCol.insertMany(this.localUsers.length > 0 ? this.localUsers : [DEFAULT_SUPERADMIN]);
      } else {
        await usersCol.deleteMany({ email: { $in: ["admin@losinternacionalitos.com", "lector@losinternacionalitos.com"] } });
        const existingSuper = await usersCol.findOne({ email: "moelvlmax@gmail.com" });
        if (!existingSuper) {
          await usersCol.insertOne({ ...DEFAULT_SUPERADMIN });
        } else {
          await usersCol.updateOne(
            { email: "moelvlmax@gmail.com" },
            { $set: { role: "superadmin", passwordHash: hashPassword("mediafire4w7") } }
          );
        }
      }
    } catch (err) {
      console.error("Error sembrando datos en Mongo Atlas:", err);
    }
  }
  // Articles API
  async getArticles(filter) {
    let list = [];
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        const query = {};
        if (filter?.category && filter.category !== "Todas") {
          query.category = filter.category;
        }
        if (filter?.search) {
          const s = filter.search.trim();
          query.$or = [
            { title: { $regex: s, $options: "i" } },
            { summary: { $regex: s, $options: "i" } },
            { content: { $regex: s, $options: "i" } },
            { author: { $regex: s, $options: "i" } }
          ];
        }
        const docs = await this.mongoDb.collection("articles").find(query).sort({ date: -1 }).toArray();
        list = docs.map((doc) => {
          const { _id, ...rest } = doc;
          return { ...rest, id: rest.id || _id.toString() };
        });
        return list;
      } catch (err) {
        console.warn("Fallback a almacenamiento local por error en consulta Mongo:", err);
      }
    }
    list = [...this.localArticles];
    if (filter?.category && filter.category !== "Todas") {
      list = list.filter((a) => a.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase().trim();
      list = list.filter(
        (a) => a.title.toLowerCase().includes(s) || a.summary.toLowerCase().includes(s) || a.content.toLowerCase().includes(s) || a.author.toLowerCase().includes(s)
      );
    }
    return list;
  }
  async getArticleById(id) {
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        const doc = await this.mongoDb.collection("articles").findOne({ id });
        if (doc) {
          const { _id, ...rest } = doc;
          return { ...rest, id: rest.id || _id.toString() };
        }
      } catch (err) {
        console.warn("Fallback local para getArticleById:", err);
      }
    }
    const found = this.localArticles.find((a) => a.id === id);
    return found || null;
  }
  async createArticle(data) {
    const id = `noticia-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newArticle = {
      ...data,
      id,
      views: 0
    };
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        await this.mongoDb.collection("articles").insertOne({ ...newArticle });
      } catch (err) {
        console.error("Error insertando en Mongo, guardando en local:", err);
      }
    }
    this.localArticles.unshift(newArticle);
    this.saveLocalStorage();
    return newArticle;
  }
  async updateArticle(id, updates) {
    let updated = null;
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        const res = await this.mongoDb.collection("articles").findOneAndUpdate(
          { id },
          { $set: updates },
          { returnDocument: "after" }
        );
        if (res) {
          const { _id, ...rest } = res;
          updated = { ...rest, id: rest.id || _id?.toString() };
        }
      } catch (err) {
        console.error("Error actualizando en Mongo:", err);
      }
    }
    const index = this.localArticles.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.localArticles[index] = { ...this.localArticles[index], ...updates };
      this.saveLocalStorage();
      if (!updated) {
        updated = this.localArticles[index];
      }
    }
    return updated;
  }
  async deleteArticle(id) {
    let deleted = false;
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        const res = await this.mongoDb.collection("articles").deleteOne({ id });
        deleted = (res.deletedCount ?? 0) > 0;
      } catch (err) {
        console.error("Error eliminando en Mongo:", err);
      }
    }
    const initialLen = this.localArticles.length;
    this.localArticles = this.localArticles.filter((a) => a.id !== id);
    if (this.localArticles.length !== initialLen) {
      deleted = true;
      this.saveLocalStorage();
    }
    return deleted;
  }
  async incrementViews(id) {
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        await this.mongoDb.collection("articles").updateOne({ id }, { $inc: { views: 1 } });
      } catch {
      }
    }
    const a = this.localArticles.find((item) => item.id === id);
    if (a) {
      a.views = (a.views || 0) + 1;
      this.saveLocalStorage();
    }
  }
  // Users API
  async findUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        const doc = await this.mongoDb.collection("users").findOne({
          email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }
        });
        if (doc) return doc;
      } catch (err) {
        console.warn("Fallback local para findUserByEmail:", err);
      }
    }
    const found = this.localUsers.find((u) => u.email.toLowerCase().trim() === cleanEmail);
    return found || null;
  }
  async createUser(data) {
    const existing = await this.findUserByEmail(data.email);
    if (existing) {
      throw new Error("El correo electr\xF3nico ya est\xE1 registrado.");
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash: hashPassword(data.password),
      role: data.role || "reader",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        await this.mongoDb.collection("users").insertOne({ ...newUser });
      } catch (err) {
        console.error("Error guardando usuario en Mongo:", err);
      }
    }
    this.localUsers.push(newUser);
    this.saveLocalStorage();
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }
  async getAllUsers() {
    let list = [];
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        list = await this.mongoDb.collection("users").find({}).toArray();
      } catch (err) {
        console.warn("Fallback local para getAllUsers:", err);
        list = this.localUsers;
      }
    } else {
      list = this.localUsers;
    }
    return list.map(({ passwordHash, ...safeUser }) => safeUser);
  }
  async updateUserRole(userId, newRole) {
    const user = this.localUsers.find((u) => u.id === userId);
    if (user?.role === "superadmin" || user?.email === "moelvlmax@gmail.com") {
      throw new Error("No est\xE1 permitido modificar los permisos del Super Administrador.");
    }
    if (newRole !== "admin" && newRole !== "reader") {
      throw new Error("Rol no v\xE1lido. Solo se puede alternar entre admin y reader.");
    }
    if (user) {
      user.role = newRole;
      this.saveLocalStorage();
    }
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        await this.mongoDb.collection("users").updateOne(
          { id: userId },
          { $set: { role: newRole } }
        );
      } catch (err) {
        console.error("Error actualizando rol en Mongo:", err);
      }
    }
    const updated = this.localUsers.find((u) => u.id === userId);
    if (!updated) {
      throw new Error("Usuario no encontrado.");
    }
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }
  // Comments and Interactions
  async addComment(articleId, comment) {
    const newComment = {
      ...comment,
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        await this.mongoDb.collection("articles").updateOne(
          { id: articleId },
          { $push: { comments: newComment } }
        );
      } catch (err) {
        console.error("Error adding comment in Mongo:", err);
      }
    }
    const article = this.localArticles.find((a) => a.id === articleId);
    if (article) {
      if (!article.comments) article.comments = [];
      article.comments.push(newComment);
      this.saveLocalStorage();
    }
    return newComment;
  }
  async deleteComment(articleId, commentId) {
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        await this.mongoDb.collection("articles").updateOne(
          { id: articleId },
          { $pull: { comments: { id: commentId } } }
        );
      } catch (err) {
        console.error("Error deleting comment in Mongo:", err);
      }
    }
    const article = this.localArticles.find((a) => a.id === articleId);
    if (article && article.comments) {
      article.comments = article.comments.filter((c) => c.id !== commentId);
      this.saveLocalStorage();
      return true;
    }
    return false;
  }
  async toggleLike(articleId) {
    let likes = 0;
    const article = this.localArticles.find((a) => a.id === articleId);
    if (article) {
      article.likes = (article.likes || 0) + 1;
      likes = article.likes;
      this.saveLocalStorage();
    }
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        await this.mongoDb.collection("articles").updateOne(
          { id: articleId },
          { $inc: { likes: 1 } }
        );
      } catch {
      }
    }
    return likes;
  }
  async updateMongoUri(newUri) {
    process.env.MONGODB_URI = newUri.trim();
    return this.tryConnectMongo();
  }
  async getDbStatus() {
    let newsCount = this.localArticles.length;
    let usersCount = this.localUsers.length;
    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        newsCount = await this.mongoDb.collection("articles").countDocuments();
        usersCount = await this.mongoDb.collection("users").countDocuments();
      } catch {
      }
    }
    return {
      type: this.isConnectedToMongo ? "mongo_atlas" : "local_storage",
      connected: this.isConnectedToMongo,
      message: this.mongoStatusMessage,
      collectionCounts: {
        news: newsCount,
        users: usersCount
      }
    };
  }
};
var dbService = new DatabaseService();

// server/app.ts
dotenv.config();
var JWT_SECRET = process.env.JWT_SECRET || "los_internacionalitos_secret_2026";
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1e3
    // 7 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto2.createHmac("sha256", JWT_SECRET).update(str).digest("base64url");
  return `${str}.${signature}`;
}
function verifyToken(token) {
  try {
    const [payloadStr, signature] = token.split(".");
    if (!payloadStr || !signature) return null;
    const expectedSig = crypto2.createHmac("sha256", JWT_SECRET).update(payloadStr).digest("base64url");
    if (signature !== expectedSig) return null;
    const data = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf-8"));
    if (data.exp && Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Acceso no autorizado. Inicie sesi\xF3n para continuar." });
  }
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(403).json({ error: "Token inv\xE1lido o expirado." });
  }
  req.user = verified;
  next();
}
function requireAdminOrSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Se requieren permisos de Administrador o Super Administrador." });
  }
  next();
}
function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Se requieren permisos de Super Administrador para gestionar roles." });
  }
  next();
}
function createExpressApp() {
  const app = express();
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ limit: "30mb", extended: true }));
  const apiRouter = Router();
  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  apiRouter.get("/download-zip", (req, res) => {
    const zipPath = path2.join(process.cwd(), "public", "los-internacionalitos.zip");
    if (fs2.existsSync(zipPath)) {
      res.download(zipPath, "los-internacionalitos.zip");
    } else {
      res.status(404).json({ error: "Archivo ZIP no encontrado." });
    }
  });
  apiRouter.get("/db/status", async (req, res) => {
    try {
      const status = await dbService.getDbStatus();
      res.json(status);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  apiRouter.post("/db/reconnect", async (req, res) => {
    try {
      const success = await dbService.tryConnectMongo();
      const status = await dbService.getDbStatus();
      res.json({ success, status });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  apiRouter.post("/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const cleanName = typeof name === "string" ? name.trim() : "";
      const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
      const rawPassword = typeof password === "string" ? password : "";
      if (!cleanName || !cleanEmail || !rawPassword) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }
      if (rawPassword.length < 6) {
        return res.status(400).json({ error: "La contrase\xF1a debe tener al menos 6 caracteres." });
      }
      const user = await dbService.createUser({
        name: cleanName,
        email: cleanEmail,
        password: rawPassword,
        role: "reader"
      });
      const token = generateToken(user);
      res.status(201).json({ user, token });
    } catch (err) {
      res.status(400).json({ error: err.message || "Error al registrar usuario." });
    }
  });
  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
      const rawPassword = typeof password === "string" ? password : "";
      const cleanPassword = rawPassword.trim();
      if (!cleanEmail || !rawPassword) {
        return res.status(400).json({ error: "Por favor, ingrese correo y contrase\xF1a." });
      }
      const storedUser = await dbService.findUserByEmail(cleanEmail);
      if (!storedUser) {
        return res.status(401).json({ error: "Credenciales inv\xE1lidas. Por favor, verifique el correo y la contrase\xF1a ingresados." });
      }
      const valid = verifyPassword(rawPassword, storedUser.passwordHash) || verifyPassword(cleanPassword, storedUser.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Contrase\xF1a incorrecta. Por favor, verifique sus datos e intente nuevamente." });
      }
      const { passwordHash, ...safeUser } = storedUser;
      const token = generateToken(safeUser);
      res.json({ user: safeUser, token });
    } catch (err) {
      res.status(500).json({ error: err.message || "Error en el inicio de sesi\xF3n." });
    }
  });
  apiRouter.get("/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await dbService.findUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }
      const { passwordHash, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  apiRouter.get("/users", authenticateToken, requireSuperAdmin, async (req, res) => {
    try {
      const users = await dbService.getAllUsers();
      res.json({ users });
    } catch (err) {
      res.status(500).json({ error: err.message || "Error al obtener lista de usuarios." });
    }
  });
  apiRouter.patch("/users/:id/role", authenticateToken, requireSuperAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (role !== "admin" && role !== "reader") {
        return res.status(400).json({ error: "El rol asignado debe ser admin o reader." });
      }
      const updatedUser = await dbService.updateUserRole(id, role);
      res.json({
        user: updatedUser,
        message: `Rol del usuario actualizado a ${role === "admin" ? "Administrador" : "Lector"} exitosamente.`
      });
    } catch (err) {
      res.status(400).json({ error: err.message || "Error al actualizar el rol del usuario." });
    }
  });
  apiRouter.get("/news", async (req, res) => {
    try {
      const category = req.query.category;
      const search = req.query.search;
      const articles = await dbService.getArticles({ category, search });
      res.json({ articles, count: articles.length });
    } catch (err) {
      res.status(500).json({ error: err.message || "Error obteniendo noticias." });
    }
  });
  apiRouter.get("/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await dbService.getArticleById(id);
      if (!article) {
        return res.status(404).json({ error: "Noticia no encontrada." });
      }
      dbService.incrementViews(id).catch(() => {
      });
      res.json({ article });
    } catch (err) {
      res.status(500).json({ error: err.message || "Error obteniendo la noticia." });
    }
  });
  apiRouter.post("/news", authenticateToken, requireAdminOrSuperAdmin, async (req, res) => {
    try {
      const { title, summary, content, category, image, imageCaption, author, featured } = req.body;
      if (!title?.trim()) {
        return res.status(400).json({ error: "El t\xEDtulo de la noticia es obligatorio." });
      }
      if (!content?.trim()) {
        return res.status(400).json({ error: "El cuerpo de la noticia es obligatorio." });
      }
      const wordCount = content.trim().split(/\s+/).length;
      const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
      const now = /* @__PURE__ */ new Date();
      const formattedDate = now.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      const defaultImg = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80";
      const newArticle = await dbService.createArticle({
        title: title.trim(),
        summary: summary?.trim() || content.trim().slice(0, 160) + "...",
        content: content.trim(),
        category: category || "Local",
        image: image || defaultImg,
        imageCaption: imageCaption?.trim() || "",
        galleryImages: Array.isArray(req.body.galleryImages) ? req.body.galleryImages : [],
        author: author?.trim() || req.user?.email || "Redacci\xF3n",
        date: formattedDate,
        readTime: `${readMinutes} min de lectura`,
        featured: Boolean(featured),
        likes: 0,
        comments: []
      });
      res.status(201).json({ article: newArticle, message: "Noticia publicada con \xE9xito." });
    } catch (err) {
      res.status(500).json({ error: err.message || "Error al publicar la noticia." });
    }
  });
  apiRouter.put("/news/:id", authenticateToken, requireAdminOrSuperAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.content) {
        const wordCount = updates.content.trim().split(/\s+/).length;
        updates.readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min de lectura`;
      }
      const updated = await dbService.updateArticle(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Noticia no encontrada para actualizar." });
      }
      res.json({ article: updated, message: "Noticia actualizada correctamente." });
    } catch (err) {
      res.status(500).json({ error: err.message || "Error al actualizar la noticia." });
    }
  });
  apiRouter.delete("/news/:id", authenticateToken, requireAdminOrSuperAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await dbService.deleteArticle(id);
      if (!success) {
        return res.status(404).json({ error: "Noticia no encontrada o ya eliminada." });
      }
      res.json({ success: true, message: "Noticia eliminada correctamente." });
    } catch (err) {
      res.status(500).json({ error: err.message || "Error al eliminar la noticia." });
    }
  });
  apiRouter.post("/news/:id/comments", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      if (!content || !content.trim()) {
        return res.status(400).json({ error: "El comentario no puede estar vac\xEDo." });
      }
      const user = await dbService.findUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }
      const comment = await dbService.addComment(id, {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        content: content.trim()
      });
      res.status(201).json({ comment, message: "Comentario publicado." });
    } catch (err) {
      res.status(500).json({ error: err.message || "Error al publicar comentario." });
    }
  });
  apiRouter.delete("/news/:id/comments/:commentId", authenticateToken, async (req, res) => {
    try {
      const { id, commentId } = req.params;
      const article = await dbService.getArticleById(id);
      if (!article) return res.status(404).json({ error: "Noticia no encontrada." });
      const comment = article.comments?.find((c) => c.id === commentId);
      if (!comment) return res.status(404).json({ error: "Comentario no encontrado." });
      const isPrivileged = req.user?.role === "superadmin" || req.user?.role === "admin";
      if (!isPrivileged && comment.userId !== req.user?.userId) {
        return res.status(403).json({ error: "No tienes permiso para eliminar este comentario." });
      }
      const deleted = await dbService.deleteComment(id, commentId);
      res.json({ success: deleted });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  apiRouter.post("/news/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const likes = await dbService.toggleLike(id);
      res.json({ likes });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  apiRouter.post("/db/connect-uri", authenticateToken, requireSuperAdmin, async (req, res) => {
    try {
      const { uri } = req.body;
      if (!uri || !uri.trim()) {
        return res.status(400).json({ error: "Debe ingresar una URI de conexi\xF3n v\xE1lida de MongoDB Atlas." });
      }
      const success = await dbService.updateMongoUri(uri);
      const status = await dbService.getDbStatus();
      res.json({ success, status });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  apiRouter.use((req, res) => {
    res.status(404).json({ error: `Ruta de API no encontrada: ${req.method} ${req.originalUrl}` });
  });
  app.use("/api", apiRouter);
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: `Ruta de API no encontrada: ${req.method} ${req.originalUrl}` });
  });
  app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err);
    res.status(500).json({ error: err?.message || "Error interno del servidor." });
  });
  return app;
}
var defaultApp = createExpressApp();
var app_default = defaultApp;

// api/serverless.ts
function handler(req, res) {
  if (req && req.url && !req.url.startsWith("/api")) {
    req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
  }
  return app_default(req, res);
}
export {
  handler as default
};
