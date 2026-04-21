import { useEffect, useState } from "react";

const API_URL = "https://zonegym-backend-finalyuliana-production.up.railway.app/api";

export default function Comentarios() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  // 🔥 Obtener comentarios
  const fetchComments = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/comments`);
      const data = await res.json();

      setComments(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar comentarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // 🔥 Enviar comentario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      alert("Escribe un comentario");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          rating, // ✅ requerido por tu backend
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al enviar comentario");
        return;
      }

      alert("Comentario enviado");
      setText("");
      setRating(5);
      fetchComments();

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-red-500">
        Comentarios
      </h2>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        
        <textarea
          className="w-full p-3 rounded-lg text-black"
          placeholder="Escribe tu comentario..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* ⭐ RATING */}
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="text-black p-2 rounded-lg"
        >
          <option value={5}>⭐⭐⭐⭐⭐ Excelente</option>
          <option value={4}>⭐⭐⭐⭐ Muy bueno</option>
          <option value={3}>⭐⭐⭐ Bueno</option>
          <option value={2}>⭐⭐ Regular</option>
          <option value={1}>⭐ Malo</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {/* LOADING */}
      {loading && <p className="text-gray-400">Cargando...</p>}

      {/* LISTA DE COMENTARIOS */}
      <div className="space-y-3">
        {comments.map((c) => (
          <div
            key={c._id}
            className="bg-white/10 p-3 rounded-lg"
          >
            <p className="font-bold text-red-400">
              {c.user || "Anónimo"}
            </p>

            {/* ✅ SEGURO (sin XSS) */}
            <p>{c.text}</p>

            {/* ⭐ mostrar rating */}
            <p className="text-yellow-400">
              {"⭐".repeat(c.rating || 0)}
            </p>

            <p className="text-xs text-gray-400">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}