"use client";

import { useEffect, useState } from "react";
import { api, errorMessage } from "../services/api";
import type { Session } from "../services/login";

type Material = { id: number; name: string; category: string };
type Comment = { id: number; materialId: number; author: string; comment: string; createdAt: string };
type Props = { session: Session; onLogout: () => void };

export default function Home({ session, onLogout }: Props) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [revision, setRevision] = useState(0);
  const [search, setSearch] = useState("");
  const [openMaterial, setOpenMaterial] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [commentDraft, setCommentDraft] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const isAdmin = session.user.role === "admin";

  
  useEffect(() => {

    let active = true;
    async function loadMaterials() {
      try {
        const response = await api.get<Material[]>("/materials", {
          
          headers: { Authorization: `Bearer ${session.token}` },
        });
        if (active) setMaterials(response.data);
      } catch (error) {
        if (active) setError(errorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMaterials();
    return () => { active = false; };
  }, [session.token, revision]);

  function refresh() {
    setLoading(true);
    setError("");
    setNotice("");
    setRevision(current => current + 1);
  }

  async function remove(material: Material) {
    if (!window.confirm(`Excluir ${material.name} do banco de dados?`)) return;
    setDeleting(material.id);
    setError("");
    setNotice("");
    try {

      await api.delete(`/materials/${material.id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
     
      setMaterials(current => current.filter(item => item.id !== material.id));
      setNotice(`${material.name} excluído.`);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setDeleting(null);
    }
  }

  async function toggleComments(material: Material) {
    setCommentError("");
    if (openMaterial === material.id) {
      setOpenMaterial(null);
      setCommentDraft("");
      return;
    }
    setOpenMaterial(material.id);
    setCommentDraft("");
    if (comments[material.id]) return;
    try {
      const response = await api.get<Comment[]>(`/materials/${material.id}/comments`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      setComments(current => ({ ...current, [material.id]: response.data }));
    } catch (error) {
      setCommentError(errorMessage(error));
    }
  }

  async function addComment(material: Material) {
    setCommentBusy(true);
    setCommentError("");
    try {
      const response = await api.post<Comment>(`/materials/${material.id}/comments`,
        { comment: commentDraft },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      setComments(current => ({
        ...current,
        [material.id]: [...(current[material.id] || []), response.data],
      }));
      setCommentDraft("");
    } catch (error) {
      setCommentError(errorMessage(error));
    } finally {
      setCommentBusy(false);
    }
  }

  const filteredMaterials = materials.filter(material =>
    `${material.name} ${material.category}`.toLocaleLowerCase("pt-BR")
      .includes(search.trim().toLocaleLowerCase("pt-BR"))
  );

  return (
    <section className="panel" aria-labelledby="materials-title">
      <div className="actions">
        <p><strong>{session.user.name}</strong> · {session.user.email}</p>
        <button className="secondary" onClick={onLogout}>Sair</button>
      </div>
      <h1 id="materials-title">Materiais</h1>
      <p>Perfil: <strong>{isAdmin ? "Administrador (admin)" : "Usuário comum (user)"}</strong></p>
      <p>{isAdmin ? "Você pode consultar, comentar e excluir materiais." : "Você pode consultar os materiais e deixar comentários."}</p>
      <p className="muted">Para comparar os perfis, saia e entre com a outra conta.</p>
      <button className="secondary" disabled={loading || deleting !== null} onClick={refresh}>
        Atualizar materiais
      </button>
      <label htmlFor="material-search">Pesquisar material</label>
      <input id="material-search" type="search" value={search}
        onChange={event => setSearch(event.target.value)} placeholder="Nome ou categoria" />
      {error && <p className="error" role="alert">{error}</p>}
      {notice && <p className="success" role="status">{notice}</p>}
      {loading ? (
        <p role="status">Carregando materiais...</p>
      ) : (
        <ul className="materials">
          {filteredMaterials.map(material => (
            <li key={material.id}>
              <div className="material-info">
                <span><strong>{material.name}</strong> · {material.category}</span>
                <button className="secondary" type="button" onClick={() => toggleComments(material)}>
                  {openMaterial === material.id ? "Fechar comentários" : "Comentários"}
                </button>
                {openMaterial === material.id && (
                  <div className="comments">
                    <h2>Comentários de {material.name}</h2>
                    {commentError && <p className="error" role="alert">{commentError}</p>}
                    <ul>
                      {(comments[material.id] || []).map(item => (
                        <li key={item.id}>
                          <strong>{item.author}</strong>: {item.comment}
                        </li>
                      ))}
                    </ul>
                    {(comments[material.id] || []).length === 0 && !commentError &&
                      <p className="muted">Ainda não há comentários.</p>}
                    <form onSubmit={event => { event.preventDefault(); void addComment(material); }}>
                      <label htmlFor={`comment-${material.id}`}>Escreva um comentário</label>
                      <textarea id={`comment-${material.id}`} rows={3} maxLength={500}
                        value={commentDraft} disabled={commentBusy}
                        onChange={event => setCommentDraft(event.target.value)} required />
                      <small>{[...commentDraft].length}/500 caracteres</small>
                      <button type="submit" disabled={commentBusy || !commentDraft.trim()}>
                        {commentBusy ? "Enviando..." : "Enviar comentário"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
              
              {isAdmin ? (
                <button className="danger" disabled={deleting !== null} onClick={() => remove(material)}>
                  {deleting === material.id ? "Excluindo..." : "Excluir"}
                </button>
              ) : (
                <span className="muted">Somente leitura</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && materials.length === 0 && <p>Nenhum material cadastrado.</p>}
      {!loading && !error && materials.length > 0 && filteredMaterials.length === 0 &&
        <p>Nenhum material encontrado para essa pesquisa.</p>}
    </section>
  );
}
