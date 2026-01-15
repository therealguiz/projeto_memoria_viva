import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Timeline = () => {
  const [memoriasFiltradas, setMemoriasFiltradas] = useState([]);
  const usuarioLogado = JSON.parse(localStorage.getItem('@usuario_logado'));

  useEffect(() => {
    const todasMemorias = JSON.parse(localStorage.getItem('@memorias_familia')) || [];

    if (usuarioLogado) {
      const meuNome = usuarioLogado.nome.toLowerCase();
      const meuApelido = usuarioLogado.apelido?.toLowerCase();
      const filtradas = todasMemorias.filter(memoria => {
        const souAutor = memoria.autorEmail === usuarioLogado.email;
        const quemParticipa = memoria.quemParticipa?.toLowerCase() || "";
        const estouMarcado = (meuNome && quemParticipa.includes(meuNome)) ||
          (meuApelido && quemParticipa.includes(meuApelido));

        return souAutor || estouMarcado;
      });

      const ordenadas = filtradas.sort((a, b) => parseInt(a.data) - parseInt(b.data));

      setMemoriasFiltradas(ordenadas);
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="pagina-padrao">
        <section className="timeline-container">
          <h1 className="titulo-trilho" style={{ textAlign: 'center', marginBottom: '40px' }}>
            Sua Linha do Tempo
          </h1>

          {memoriasFiltradas.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>
              Nenhum momento encontrado onde você participa ou seja o autor.
            </p>
          ) : (
            <div className="timeline-vertical">
              {memoriasFiltradas.map((memoria, index) => (
                <div key={memoria.id} className={`timeline-item ${index % 2 === 0 ? 'esquerda' : 'direita'}`}>
                  <div className="timeline-ponto"></div>
                  <Link to={`/memoria/${memoria.id}`} className="timeline-card">
                    <span className="timeline-data">{memoria.data}</span>
                    <h3 className="timeline-titulo">{memoria.titulo}</h3>
                    <p className="timeline-resumo">{memoria.descricao.substring(0, 80)}...</p>
                    <span className="timeline-tag-autor">
                      {memoria.autorEmail === usuarioLogado.email ? "Postado por você" : `Postado por ${memoria.autor}`}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Timeline;