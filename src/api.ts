import { Article, User, DbStatusInfo } from './types';

const TOKEN_KEY = 'los_internacionalitos_token';
const USER_KEY = 'los_internacionalitos_user';

export function getStoredAuth(): { user: User | null; token: string | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

export function setStoredAuth(user: User | null, token: string | null) {
  try {
    if (token && user) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  } catch (err) {
    console.error('Error saving auth to localStorage', err);
  }
}

function getAuthHeaders(): HeadersInit {
  const { token } = getStoredAuth();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Universal safe HTTP request helper to guarantee no JSON parse crashes (e.g., HTML 404/500 errors)
async function safeRequest<T>(url: string, options?: RequestInit, defaultErrMsg = 'Error de comunicación con el servidor'): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (netErr: any) {
    throw new Error(`Error de red: no se pudo conectar con el servidor (${netErr?.message || 'Verifique su conexión'}).`);
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.toLowerCase().includes('application/json');

  if (isJson) {
    try {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.message || defaultErrMsg);
      }
      return data as T;
    } catch (err: any) {
      if (!res.ok) {
        throw new Error(defaultErrMsg);
      }
      throw err;
    }
  }

  // Handle non-JSON responses (such as Vercel HTML 404/500 error pages)
  const rawText = await res.text().catch(() => '');
  if (res.status === 404) {
    throw new Error(`El endpoint ${url} no fue encontrado (404). Si estás en Vercel, asegúrate de haber configurado el backend en vercel.json.`);
  }

  if (!res.ok) {
    const cleanText = rawText.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
    throw new Error(cleanText || `Error ${res.status}: ${defaultErrMsg}`);
  }

  throw new Error('La respuesta del servidor no tiene un formato JSON válido.');
}

export async function verifyCurrentSessionApi(): Promise<User | null> {
  const { token } = getStoredAuth();
  if (!token) return null;

  try {
    const data = await safeRequest<{ user: User }>('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.user || null;
  } catch (err) {
    console.warn('Session verification failed or expired:', err);
    return null;
  }
}

export async function fetchNews(category?: string, search?: string): Promise<Article[]> {
  const params = new URLSearchParams();
  if (category && category !== 'Todas') params.append('category', category);
  if (search && search.trim()) params.append('search', search.trim());

  const data = await safeRequest<{ articles: Article[] }>(
    `/api/news?${params.toString()}`,
    undefined,
    'Error al cargar las noticias'
  );
  return data.articles || [];
}

export async function fetchArticleById(id: string): Promise<Article> {
  const data = await safeRequest<{ article: Article }>(
    `/api/news/${id}`,
    undefined,
    'No se pudo encontrar la noticia'
  );
  return data.article;
}

export async function createArticleApi(articleData: Partial<Article>): Promise<Article> {
  const data = await safeRequest<{ article: Article }>(
    '/api/news',
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(articleData),
    },
    'Error al publicar la noticia'
  );
  return data.article;
}

export async function updateArticleApi(id: string, updates: Partial<Article>): Promise<Article> {
  const data = await safeRequest<{ article: Article }>(
    `/api/news/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    },
    'Error al actualizar la noticia'
  );
  return data.article;
}

export async function deleteArticleApi(id: string): Promise<boolean> {
  await safeRequest<{ success: boolean }>(
    `/api/news/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    },
    'Error al eliminar la noticia'
  );
  return true;
}

export async function loginApi(email: string, password: string): Promise<{ user: User; token: string }> {
  const data = await safeRequest<{ user: User; token: string }>(
    '/api/auth/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    },
    'Error en las credenciales'
  );
  setStoredAuth(data.user, data.token);
  return data;
}

export async function registerApi(payload: {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'reader';
  adminCode?: string;
}): Promise<{ user: User; token: string }> {
  const data = await safeRequest<{ user: User; token: string }>(
    '/api/auth/register',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'Error al registrar usuario'
  );
  setStoredAuth(data.user, data.token);
  return data;
}

export async function fetchDbStatus(): Promise<DbStatusInfo> {
  return await safeRequest<DbStatusInfo>(
    '/api/db/status',
    undefined,
    'Error al obtener estado de base de datos'
  );
}

export async function triggerDbReconnect(): Promise<{ success: boolean; status: DbStatusInfo }> {
  return await safeRequest<{ success: boolean; status: DbStatusInfo }>(
    '/api/db/reconnect',
    { method: 'POST' },
    'Error al intentar reconectar'
  );
}

export async function addCommentApi(articleId: string, content: string): Promise<any> {
  const data = await safeRequest<{ comment: any }>(
    `/api/news/${articleId}/comments`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    },
    'Error al enviar el comentario'
  );
  return data.comment;
}

export async function deleteCommentApi(articleId: string, commentId: string): Promise<boolean> {
  await safeRequest<{ success: boolean }>(
    `/api/news/${articleId}/comments/${commentId}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    },
    'Error al eliminar el comentario'
  );
  return true;
}

export async function likeArticleApi(articleId: string): Promise<number> {
  const data = await safeRequest<{ likes: number }>(
    `/api/news/${articleId}/like`,
    { method: 'POST' },
    'Error al registrar me gusta'
  );
  return data.likes || 0;
}

export async function connectMongoAtlasUriApi(uri: string): Promise<{ success: boolean; status: DbStatusInfo }> {
  return await safeRequest<{ success: boolean; status: DbStatusInfo }>(
    '/api/db/connect-uri',
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ uri }),
    },
    'Error al conectar con MongoDB Atlas'
  );
}

export async function fetchUsersApi(): Promise<User[]> {
  const data = await safeRequest<{ users: User[] }>(
    '/api/users',
    {
      headers: getAuthHeaders(),
    },
    'Error al obtener lista de usuarios'
  );
  return data.users || [];
}

export async function updateUserRoleApi(userId: string, role: 'admin' | 'reader'): Promise<User> {
  const data = await safeRequest<{ user: User }>(
    `/api/users/${userId}/role`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    },
    'Error al actualizar el rol del usuario'
  );
  return data.user;
}

