const { useState, useEffect } = React;

// ==========================================
// 1. BANCO DE DADOS E ARRAYS ORIGINAIS
// ==========================================
const INST = ["2 - OBRA SOCIAL DOM BOSCO", "6 - CEC TABOR", "9 - CCA VILA PEDREIRA", "10 - CCA SANTA TEREZINHA", "12 - IRMÃ NICE - NAF", "20 - RECANTO DOS AVÓS", "21 - CASA SANTANA E SÃO JOAQUIM - LAR DOS IDOSOS", "22 - AÇÃO UNIVIDA", "23 - CASA DO CRISTO", "25 - NÚCLEO BATUIRA - UNIDADE I", "26 - CCA NOVO LAR BETANIA", "27 - CCA PE. MOREIRA", "29 - CANTINHO DA PAZ I", "30 - ABRIGO BEZERRA DE MENEZES", "32 - CCA RODOLFO PIRANI", "34 - CPA - PADRE BELLO", "43 - CCA SANTA RITA", "44 - CCA NOSSA SENHORA APARECIDA", "50 - CCP HENRY FORD MULTIMARCAS", "51 - CANTINHO DA PAZ III", "55 - CASA DA CRIANÇA BETINHO", "59 - LAR MADRE REGINA", "65 - NCI TEREZA BUGOLIM", "68 - ACM ITAQUERA", "75 - CANTINHO DA PAZ IV", "76 - CCA LAR DITOSO", "88 - CA COMEÇAR DE NOVO", "89 - KODOMO NO SONO - CASA 1", "91 - CCA ANTONIO PREVIATO", "97 - CA SÃO MATEUS", "98 - SAICA NOVO LAR", "99 - SAICA SÃO MATEUS I", "101 - CA SÃO MIGUEL PAULISTA", "106 - ACDEM", "107 - ILPI SÃO MATEUS", "108 - CA JAÇANÃ", "110 - CASA DE DAVID", "111 - LAR VICENTINO", "116 - CENTRO DE JUVENTUDE NOSSO LAR", "123 - CIRCO ESCOLA CIDADE SERÓDIO", "124 - CASA DE CULTURA LEIDE DAS NEVES", "125 - CIRCO ESCOLA AGUIA DE HAIA", "132 - SAICA NOVO LAR BETANIA I", "134 - CENTRO SOCIAL N SRA APARECIDA", "148 - HOSPITAL SÃO LUIZ GONZAGA", "149 - HOSPITAL GERIÁTRICO E DE CONVALESCENTES D. PEDRO II", "150 - CAE PARA MULHERES ESPERANÇA", "153 - CA LAJEADO", "155 - ESCOLA FILANTRÓPICA TABOR", "157 - CAF - CASA FILADÉLFIA", "160 - CTA ARICANDUVA", "161 - CEDESP TABOR", "163 - SAICA ABRIGO ACDEM", "167 - CAE FAMÍLIA PENHA", "169 - CTA SÃO MATEUS", "173 - NCI VIVER MELHOR", "174 - CA MARIA IZABEL CARVALHO", "175 - CCA AMIGOS DA VITÓRIA", "176 - CAEM ERMELINO MATARAZZO", "177 - SPVV - VILA MARA", "178 - HOSPITAL SANTA MARCELINA", "181 - COOP-RECICLÁVEL", "190 - LAR SÍRIO PRÓ INFÂNCIA", "191 - COOPERLESTE", "192 - CAE MULHERES APARECIDA", "193 - CTA PARQUE NOVO MUNDO", "194 - CEDESP NEUZA AVELINO", "195 - CCA SÃO GABRIEL", "196 - CA SÃO LEOPOLDO", "198 - CASA DO CATADOR", "200 - SASF PONTE RASA (CAF)", "201 - SASF FORMOSA", "202 - SASF CANGAIBA", "203 - SASF JARDIM HELENA II", "204 - SASF JOSÉ BONIFÁCIO", "205 - CAE MULHERES VILA MARIA", "206 - SAICA MENINO JESUS", "207 - ILPI JAÇANÃ", "208 - CCA VILA SÃO GERALDO", "210 - CCA BOTURUSSU"];
const CARGOS = ["Coordenador(a)", "Diretor(a)", "Presidente", "Gestor(a)", "Assistente Social", "Nutricionista", "Cozinheiro(a)", "Auxiliar Administrativo", "Voluntário(a)", "Outro"];
const REFEICOES = ["Café da manhã", "Lanche da manhã", "Almoço", "Lanche da tarde", "Jantar", "Ceia"];
const CARACT = ["Grande", "Pequena", "Local limpo e organizado", "Necessita de reforma", "Equipamentos antigos", "Desorganizada"];
const PRIORIDADES = ["Muito", "Médio", "Pouco", "Ocasional/Eventual"];
const MANIP_OPTS = ["Uniformes adequados", "Sem uniforme completo", "Uso de adornos (brincos, anéis, pulseiras)", "Unhas cortadas e sem esmalte", "Unhas inadequadas (longas ou com esmalte)", "Cabelos protegidos (touca/rede)", "Cabelos sem proteção", "Higiene das mãos adequada", "Higiene das mãos inadequada", "Uso correto de luvas", "Uso incorreto de luvas", "Manipuladores com sintomas de doença"];
const ORIENT_RAP = ["Proibição do uso de adornos na cozinha", "Higienização correta das mãos", "Descongelamento adequado (em geladeira ou micro-ondas)", "Proibição de descongelamento fora da geladeira", "Manutenção de unhas curtas e sem esmalte", "Uso correto e obrigatório de uniforme", "Uso correto de touca/proteção de cabelos", "Temperatura adequada de armazenamento", "Separação de alimentos crus e cozidos", "Higienização correta de FLV", "Controle de pragas e vetores", "Rotatividade de estoque (PVPS)", "Higienização de superfícies e utensílios", "Cuidados com manipuladores doentes", "Armazenamento correto de produtos de limpeza", "Temperatura de cocção adequada (acima de 70°C)", "Resfriamento correto de preparações", "Identificação e etiquetagem de alimentos", "Boas práticas de manipulação de carnes", "Descarte correto de óleo e resíduos"];

const initForm = () => ({
  id: Date.now(),
  instituicao: "", atendidoPor: "", quemRecebeu: "", cargo: "", cargoOutro: "", numAtendidos: "",
  alimentos: [], sobras: "", convenio: "", convenioOpcoes: [], convenioOutros: "",
  equipamentos: { geladeiraDom: "", geladeiraInd: "", fogao: { qtd: "", bocas: "" }, freezer: { qtd: "", tipos: [] }, camaraFria: "", balcaoQuente: "", balcaoFrio: "", fornoComum: "", fornoCombinado: "", outros: "" },
  refeicoes: [], caracCozinha: [], caracOutro: "", funcCozinheira: "", funcAuxiliar: "", escala: "",
  estoque: { flv: "", estocaveis: "", carnes: "" }, periodicidade: { flv: "", estocaveis: "", carnes: "" },
  higiene: { geral: "", manipuladores: [], cozinhaRefeitorio: "" },
  orientacoesAplicadas: "", patologia: "", patologiaDesc: "", prioridadeDoacao: "",
  orientacoesRapidas: [], orientacoesNutricionista: "", data: new Date().toLocaleDateString("pt-BR"),
});

// ==========================================
// 2. COMPONENTES REUTILIZÁVEIS UI (Migrados pro Tailwind)
// ==========================================
const SLabel = ({ icon, text }) => (
  <p className="text-xs font-semibold text-mb-green uppercase tracking-wide mb-2 flex items-center gap-1.5"><i className={`ti ti-${icon} text-sm`}></i>{text}</p>
);

const Chip = ({ label, active, onClick, className = "" }) => (
  <span onClick={onClick} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] cursor-pointer border transition-all select-none ${active ? "bg-mb-green-light border-mb-green text-mb-green font-medium" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"} ${className}`}>
    {active && <i className="ti ti-check text-[11px]"></i>}
    {label}
  </span>
);

const YN = ({ val, onChange }) => (
  <div className="flex gap-2">
    {["Sim", "Não"].map(o => (
      <button key={o} onClick={() => onChange(o)} className={`flex-1 py-2 rounded-lg border transition-all text-sm ${val === o ? "bg-mb-green text-white border-mb-green" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
        {o}
      </button>
    ))}
  </div>
);

const QR = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3 mb-2">
    <label className="text-[13px] text-gray-600 flex-1">{label}</label>
    <input type="number" placeholder="0" value={value} onChange={(e) => onChange(e.target.value)} className="w-20 p-2 rounded-lg border border-gray-300 outline-none focus:border-mb-green text-center text-sm" />
  </div>
);

// Modal de Instituições
function InstModal({ onSelect, onClose, current }) {
  const [s, setS] = useState("");
  const f = INST.filter(i => i.toLowerCase().includes(s.toLowerCase()));
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b bg-mb-green-light rounded-t-xl">
          <p className="font-medium text-mb-green mb-2">Selecionar instituição</p>
          <input type="text" placeholder="Buscar pelo nome ou código..." value={s} onChange={e => setS(e.target.value)} autoFocus className="w-full p-2.5 rounded border border-mb-green/30 outline-none" />
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          {f.map(i => (
            <div key={i} onClick={() => { onSelect(i); onClose(); }} className={`p-3 text-sm cursor-pointer border-b border-gray-100 rounded hover:bg-gray-50 ${i === current ? "bg-mb-green-light text-mb-green font-medium" : ""}`}>
              {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. O APP PRINCIPAL
// ==========================================
function App() {
  const [activeMenu, setActiveMenu] = useState("nova");
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("mb_visita_rascunho");
    return saved ? JSON.parse(saved) : initForm();
  });
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [showInst, setShowInst] = useState(false);

  useEffect(() => {
    localStorage.setItem("mb_visita_rascunho", JSON.stringify(form));
  }, [form]);

  // Helpers de Update
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updN = (k, s, v) => setForm(f => ({ ...f, [k]: { ...f[k], [s]: v } }));
  const tog = (k, v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }));
  const togN = (k, s, v) => setForm(f => ({ ...f, [k]: { ...f[k], [s]: f[k][s].includes(v) ? f[k][s].filter(x => x !== v) : [...f[k][s], v] } }));
  
  const addO = (txt) => setForm(f => {
    const cur = f.orientacoesNutricionista;
    return { ...f, orientacoesRapidas: [...f.orientacoesRapidas, txt], orientacoesNutricionista: cur + (cur && !cur.endsWith("\n") ? "\n• " : "• ") + txt };
  });
  const remO = (txt) => setForm(f => ({
    ...f, orientacoesRapidas: f.orientacoesRapidas.filter(x => x !== txt), orientacoesNutricionista: f.orientacoesNutricionista.split("\n").filter(l => !l.includes(txt)).join("\n")
  }));

  // GERADOR DE TEXTO (COPIAR INTELIGENTE - Só mostra o que foi preenchido)
  const gerarTexto = () => {
    const f = form; const eq = f.equipamentos;
    let txt = `RELATÓRIO DE VISITA NUTRICIONAL — SESC MESA BRASIL\nData: ${f.data}\n`;
    if(f.instituicao) txt += `Instituição: ${f.instituicao}\n`;
    if(f.atendidoPor) txt += `Atendimento feito por: ${f.atendidoPor}\n`;
    if(f.quemRecebeu) txt += `Quem recebeu: ${f.quemRecebeu} | Cargo: ${f.cargo === 'Outro' ? f.cargoOutro : f.cargo}\n`;
    if(f.numAtendidos) txt += `Número de atendidos: ${f.numAtendidos}\n`;
    
    txt += `\nALIMENTAÇÃO:\n`;
    if(f.alimentos.length) txt += `- Necessidades: ${f.alimentos.join(', ')}\n`;
    if(f.sobras) txt += `- Sobras: ${f.sobras}\n`;
    if(f.convenio) txt += `- Convênio prefeitura: ${f.convenio}${f.convenio === 'Sim' && (f.convenioOpcoes.length || f.convenioOutros) ? ` (${[...f.convenioOpcoes, f.convenioOutros].filter(Boolean).join(', ')})` : ''}\n`;
    if(f.refeicoes.length) txt += `- Refeições: ${f.refeicoes.join(', ')}\n`;
    if(f.prioridadeDoacao) txt += `- Prioridade: ${f.prioridadeDoacao}\n`;

    let eqStr = [];
    if(eq.geladeiraDom) eqStr.push(`Geladeira Dom: ${eq.geladeiraDom}`);
    if(eq.geladeiraInd) eqStr.push(`Geladeira Ind: ${eq.geladeiraInd}`);
    if(eq.fogao.qtd) eqStr.push(`Fogão: ${eq.fogao.qtd} (${eq.fogao.bocas} bocas)`);
    if(eq.freezer.qtd) eqStr.push(`Freezer: ${eq.freezer.qtd} (${eq.freezer.tipos.join(', ')})`);
    if(eq.camaraFria) eqStr.push(`Câmara Fria: ${eq.camaraFria}`);
    if(eq.balcaoQuente) eqStr.push(`Balcão Quente: ${eq.balcaoQuente}`);
    if(eq.balcaoFrio) eqStr.push(`Balcão Frio: ${eq.balcaoFrio}`);
    if(eq.fornoComum) eqStr.push(`Forno Comum: ${eq.fornoComum}`);
    if(eq.fornoCombinado) eqStr.push(`Forno Combinado: ${eq.fornoCombinado}`);
    if(eq.outros) eqStr.push(`Outros: ${eq.outros}`);
    if(eqStr.length) txt += `\nEQUIPAMENTOS:\n- ${eqStr.join(' | ')}\n`;

    txt += `\nCOZINHA E ESTOQUE:\n`;
    if(f.caracCozinha.length || f.caracOutro) txt += `- Caract.: ${[...f.caracCozinha, f.caracOutro].filter(Boolean).join(', ')}\n`;
    if(f.funcCozinheira || f.funcAuxiliar) txt += `- Funcionários: Cozinheiras(${f.funcCozinheira || 0}), Auxiliares(${f.funcAuxiliar || 0})\n`;
    if(f.escala) txt += `- Escala: ${f.escala}\n`;
    
    let est = [];
    if(f.estoque.flv) est.push(`FLV: ${f.estoque.flv} (${f.periodicidade.flv || '-'})`);
    if(f.estoque.estocaveis) est.push(`Estocáveis: ${f.estoque.estocaveis} (${f.periodicidade.estocaveis || '-'})`);
    if(f.estoque.carnes) est.push(`Carnes: ${f.estoque.carnes} (${f.periodicidade.carnes || '-'})`);
    if(est.length) txt += `- Estoque: ${est.join(' | ')}\n`;

    txt += `\nHIGIENE:\n`;
    if(f.higiene.geral) txt += `- Geral: ${f.higiene.geral}\n`;
    if(f.higiene.manipuladores.length) txt += `- Manipuladores: ${f.higiene.manipuladores.join(', ')}\n`;
    if(f.higiene.cozinhaRefeitorio) txt += `- Obs (Coz/Ref): ${f.higiene.cozinhaRefeitorio}\n`;
    if(f.orientacoesAplicadas) txt += `- Orientações aplicadas: ${f.orientacoesAplicadas}\n`;

    if(f.patologia) txt += `\nPatologia/Dieta Especial: ${f.patologia}${f.patologia === 'Sim' ? ` (${f.patologiaDesc})` : ''}\n`;
    if(f.orientacoesNutricionista) txt += `\nORIENTAÇÕES NUTRICIONAIS:\n${f.orientacoesNutricionista}\n`;

    return txt;
  };

  // ==========================================
  // SIDEBARS & MENUS
  // ==========================================
  const Sidebar = () => (
    <div className="group w-16 hover:w-64 transition-all duration-300 bg-mb-green text-white flex-col justify-between hidden md:flex h-full shadow-2xl z-50 no-print">
      <div>
        <div className="h-16 flex items-center px-4 border-b border-white/10 bg-mb-green-mid/30">
          <i className="ti ti-leaf text-2xl shrink-0"></i>
          <span className="sidebar-text-expand font-semibold tracking-wide">Visitas Nutricionais</span>
        </div>
        <nav className="mt-6 flex flex-col gap-2 px-2">
          <button onClick={() => { setActiveMenu('nova'); setDone(false); }} className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors ${activeMenu === 'nova' && !done ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <i className="ti ti-clipboard-plus text-xl shrink-0"></i><span className="sidebar-text-expand text-sm">Nova Visita</span>
          </button>
          <button onClick={() => setActiveMenu('historico')} className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors ${activeMenu === 'historico' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <i className="ti ti-history text-xl shrink-0"></i><span className="sidebar-text-expand text-sm">Histórico (7 dias)</span>
          </button>
          <button onClick={() => setActiveMenu('instituicoes')} className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors ${activeMenu === 'instituicoes' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <i className="ti ti-building-cog text-xl shrink-0"></i><span className="sidebar-text-expand text-sm">Locais</span>
          </button>
        </nav>
      </div>
      <div className="mb-6 px-4 flex items-center text-white/50 hover:text-white/80 cursor-default">
        <i className="ti ti-code text-xl shrink-0"></i><span className="sidebar-text-expand text-xs whitespace-nowrap">Powered by Mesaque & Lorrana</span>
      </div>
    </div>
  );

  const MobileNav = () => (
    <div className="md:hidden flex w-full h-16 bg-white border-t border-gray-200 justify-around items-center text-gray-500 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] no-print">
      <button onClick={() => { setActiveMenu('nova'); setDone(false); }} className={`flex flex-col items-center justify-center w-full h-full ${activeMenu === 'nova' && !done ? 'text-mb-green' : ''}`}><i className="ti ti-clipboard-plus text-xl mb-1"></i><span className="text-[10px] font-medium">Nova</span></button>
      <button onClick={() => setActiveMenu('historico')} className={`flex flex-col items-center justify-center w-full h-full ${activeMenu === 'historico' ? 'text-mb-green' : ''}`}><i className="ti ti-history text-xl mb-1"></i><span className="text-[10px] font-medium">Histórico</span></button>
      <button onClick={() => setActiveMenu('instituicoes')} className={`flex flex-col items-center justify-center w-full h-full ${activeMenu === 'instituicoes' ? 'text-mb-green' : ''}`}><i className="ti ti-building-cog text-xl mb-1"></i><span className="text-[10px] font-medium">Locais</span></button>
    </div>
  );

  // ==========================================
  // RENDERIZAÇÃO DOS 3 PASSOS (WIZARD)
  // ==========================================
  const renderStep = () => {
    const f = form; const eq = f.equipamentos;
    if (step === 0) return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <SLabel icon="building" text="Identificação" />
          <div className="flex gap-2 mb-4">
             <input type="text" readOnly placeholder="Selecione a instituição..." value={f.instituicao} onClick={() => setShowInst(true)} className="w-full p-2.5 rounded-lg border border-gray-300 cursor-pointer outline-none bg-gray-50 text-sm flex-1" />
             <button onClick={() => setShowInst(true)} className="px-4 bg-mb-green text-white rounded-lg hover:bg-mb-green-mid"><i className="ti ti-search"></i></button>
          </div>
          {showInst && <InstModal current={f.instituicao} onSelect={v => upd("instituicao", v)} onClose={() => setShowInst(false)} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Atendimento feito por (Seu nome)" value={f.atendidoPor} onChange={e => upd('atendidoPor', e.target.value)} className="w-full p-2.5 rounded-lg border outline-none text-sm" />
            <input type="number" placeholder="Nº de atendidos pelo local" value={f.numAtendidos} onChange={e => upd('numAtendidos', e.target.value)} className="w-full p-2.5 rounded-lg border outline-none text-sm" />
          </div>

          <p className="text-xs font-semibold text-gray-500 mb-2">Quem recebeu e Cargo</p>
          <input type="text" placeholder="Nome de quem recebeu" value={f.quemRecebeu} onChange={e => upd('quemRecebeu', e.target.value)} className="w-full p-2.5 rounded-lg border outline-none text-sm mb-3" />
          <div className="flex flex-wrap gap-2 mb-2">
            {CARGOS.map(c => <Chip key={c} label={c} active={f.cargo === c} onClick={() => upd("cargo", c)} />)}
          </div>
          {f.cargo === "Outro" && <input type="text" placeholder="Especifique o cargo" value={f.cargoOutro} onChange={e => upd('cargoOutro', e.target.value)} className="w-full p-2.5 rounded-lg border outline-none text-sm mt-2" />}
        </div>
        
        <hr className="border-gray-200" />
        
        <div>
          <SLabel icon="basket" text="Alimentação e Refeições" />
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Alimentos mais necessários</p>
            <div className="flex flex-wrap gap-2">{["FLV", "Pães", "Cesta básica", "Industrializados", "Carnes", "Laticínios", "Todos"].map(a => <Chip key={a} label={a} active={f.alimentos.includes(a)} onClick={() => tog("alimentos", a)} />)}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div><p className="text-xs text-gray-500 mb-2">Sobras de alimentos</p><YN val={f.sobras} onChange={v => upd("sobras", v)} /></div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Convênio prefeitura?</p><YN val={f.convenio} onChange={v => upd("convenio", v)} />
              {f.convenio === "Sim" && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2 mb-2">{["ONG Prato Cheio", "ONG Banco de Alimentos", "Empresas parceiras"].map(o => <Chip key={o} label={o} active={f.convenioOpcoes.includes(o)} onClick={() => tog("convenioOpcoes", o)} />)}</div>
                  <input type="text" placeholder="Outras..." value={f.convenioOutros} onChange={e => upd("convenioOutros", e.target.value)} className="w-full p-2 rounded border text-sm" />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Refeições oferecidas</p>
            <div className="flex flex-wrap gap-2">{REFEICOES.map(r => <Chip key={r} label={r} active={f.refeicoes.includes(r)} onClick={() => tog("refeicoes", r)} />)}</div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Prioridade para doações</p>
            <div className="flex flex-wrap gap-2">{PRIORIDADES.map(p => <Chip key={p} label={p} active={f.prioridadeDoacao === p} onClick={() => upd("prioridadeDoacao", p)} className="flex-1 text-center justify-center" />)}</div>
          </div>
        </div>
      </div>
    );

    if (step === 1) return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <SLabel icon="tool" text="Equipamentos" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <QR label="Geladeira doméstica" value={eq.geladeiraDom} onChange={v => updN("equipamentos", "geladeiraDom", v)} />
            <QR label="Geladeira industrial" value={eq.geladeiraInd} onChange={v => updN("equipamentos", "geladeiraInd", v)} />
            <div>
              <QR label="Quantidade de fogões" value={eq.fogao.qtd} onChange={v => setForm(f => ({...f, equipamentos: {...f.equipamentos, fogao: {...f.equipamentos.fogao, qtd: v}}}))} />
              {eq.fogao.qtd > 0 && <div className="flex gap-2 mb-2">{["4", "6", "8", "Mais de 8"].map(b => <Chip key={b} label={b+" bocas"} active={eq.fogao.bocas === b} onClick={() => setForm(f => ({...f, equipamentos: {...f.equipamentos, fogao: {...f.equipamentos.fogao, bocas: b}}}))} />)}</div>}
            </div>
            <div>
              <QR label="Quantidade de freezers" value={eq.freezer.qtd} onChange={v => setForm(f => ({...f, equipamentos: {...f.equipamentos, freezer: {...f.equipamentos.freezer, qtd: v}}}))} />
              {eq.freezer.qtd > 0 && <div className="flex gap-2 flex-wrap mb-2">{["Vert. 1P", "Horiz. 1P", "Horiz. 2P"].map(t => <Chip key={t} label={t} active={eq.freezer.tipos.includes(t)} onClick={() => setForm(f => ({...f, equipamentos: {...f.equipamentos, freezer: {...f.equipamentos.freezer, tipos: f.equipamentos.freezer.tipos.includes(t) ? f.equipamentos.freezer.tipos.filter(x=>x!==t) : [...f.equipamentos.freezer.tipos, t]}}}))} />)}</div>}
            </div>
            <QR label="Câmara fria" value={eq.camaraFria} onChange={v => updN("equipamentos", "camaraFria", v)} />
            <QR label="Balcão quente" value={eq.balcaoQuente} onChange={v => updN("equipamentos", "balcaoQuente", v)} />
            <QR label="Balcão frio" value={eq.balcaoFrio} onChange={v => updN("equipamentos", "balcaoFrio", v)} />
            <QR label="Forno comum" value={eq.fornoComum} onChange={v => updN("equipamentos", "fornoComum", v)} />
            <QR label="Forno combinado" value={eq.fornoCombinado} onChange={v => updN("equipamentos", "fornoCombinado", v)} />
          </div>
          <input type="text" placeholder="Outros equipamentos..." value={eq.outros} onChange={e => updN("equipamentos", "outros", e.target.value)} className="w-full p-2.5 rounded-lg border outline-none text-sm mt-2" />
        </div>

        <hr className="border-gray-200" />

        <div>
          <SLabel icon="chef-hat" text="Cozinha e Funcionários" />
          <div className="flex flex-wrap gap-2 mb-3">{CARACT.map(c => <Chip key={c} label={c} active={f.caracCozinha.includes(c)} onClick={() => tog("caracCozinha", c)} />)}</div>
          <input type="text" placeholder="Outras características..." value={f.caracOutro} onChange={e => upd("caracOutro", e.target.value)} className="w-full p-2 rounded-lg border outline-none text-sm mb-4" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div><label className="text-xs text-gray-500">Cozinheiras</label><input type="number" value={f.funcCozinheira} onChange={e => upd("funcCozinheira", e.target.value)} className="w-full p-2 border rounded" /></div>
            <div><label className="text-xs text-gray-500">Auxiliares</label><input type="number" value={f.funcAuxiliar} onChange={e => upd("funcAuxiliar", e.target.value)} className="w-full p-2 border rounded" /></div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Escala</label>
              <div className="flex gap-2">{["5x2", "12x36"].map(e => <Chip key={e} label={e} active={f.escala === e} onClick={() => upd("escala", e)} />)}</div>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <SLabel icon="package" text="Estoque e Periodicidade" />
          <div className="grid grid-cols-3 gap-4">
            {["flv", "estocaveis", "carnes"].map(k => (
              <div key={k} className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase">{k}</label>
                <select value={f.estoque[k]} onChange={e => updN("estoque", k, e.target.value)} className="p-2 border rounded text-sm bg-white outline-none">
                  <option value="">Status...</option><option>Poucos</option><option>Satisfatório</option><option>Muito</option>
                </select>
                <input type="text" placeholder="Freq..." value={f.periodicidade[k]} onChange={e => updN("periodicidade", k, e.target.value)} className="p-2 border rounded text-sm outline-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    if (step === 2) return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <SLabel icon="sparkles" text="Higiene" />
          <div className="flex gap-2 mb-4">{["Satisfatória", "Insatisfatória"].map(o => <Chip key={o} label={o} active={f.higiene.geral === o} onClick={() => updN("higiene", "geral", o)} />)}</div>
          <p className="text-xs text-gray-500 mb-2">Manipuladores</p>
          <div className="flex flex-wrap gap-2 mb-4">{MANIP_OPTS.map(o => <Chip key={o} label={o} active={f.higiene.manipuladores.includes(o)} onClick={() => togN("higiene", "manipuladores", o)} />)}</div>
          <input type="text" placeholder="Obs: Cozinha e Refeitório" value={f.higiene.cozinhaRefeitorio} onChange={e => updN("higiene", "cozinhaRefeitorio", e.target.value)} className="w-full p-2.5 border rounded-lg outline-none text-sm" />
        </div>

        <hr className="border-gray-200" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-xs text-gray-500 mb-2">Aplica orientações dos cursos?</p><YN val={f.orientacoesAplicadas} onChange={v => upd("orientacoesAplicadas", v)} /></div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Assistidos com patologia?</p><YN val={f.patologia} onChange={v => upd("patologia", v)} />
            {f.patologia === "Sim" && <input type="text" placeholder="Descreva..." value={f.patologiaDesc} onChange={e => upd("patologiaDesc", e.target.value)} className="w-full mt-2 p-2 border rounded text-sm" />}
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <SLabel icon="speakerphone" text="Orientações Rápidas (Tags)" />
          <div className="flex flex-wrap gap-2 mb-4">{ORIENT_RAP.map(o => <Chip key={o} label={o} active={f.orientacoesRapidas.includes(o)} onClick={() => f.orientacoesRapidas.includes(o) ? remO(o) : addO(o)} className="text-[11px] border-dashed" />)}</div>
          
          <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm relative">
             <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-blue-600 uppercase">Texto Final (Nutricionista)</label>
                <button onClick={() => document.getElementById('spen-modal').classList.remove('hidden')} className="flex items-center gap-1 text-[11px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors">
                  <i className="ti ti-ballpen"></i> Usar Caneta (S-Pen)
                </button>
             </div>
             <textarea className="w-full p-3 rounded bg-gray-50 border-none outline-none resize-vertical text-sm" rows="6" placeholder="Orientações selecionadas aparecerão aqui..." value={f.orientacoesNutricionista} onChange={e => upd('orientacoesNutricionista', e.target.value)}></textarea>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TELA DE RESUMO E IMPRESSÃO (NOVO)
  // ==========================================
  const renderResumo = () => (
    <div className="animate-fade-in print-container bg-white rounded-2xl md:shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-mb-green p-6 flex justify-between items-center">
        <div><h2 className="text-white text-lg font-bold">Relatório de Visita Nutricional</h2><p className="text-white/70 text-sm">{form.instituicao || "Instituição não informada"} • {form.data}</p></div>
        <div className="flex gap-2 no-print">
          <button onClick={() => { navigator.clipboard.writeText(gerarTexto()); alert("Texto copiado (Apenas campos preenchidos)!"); }} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition"><i className="ti ti-copy"></i> Copiar</button>
          <button onClick={() => window.print()} className="bg-white text-mb-green font-medium px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-100 transition"><i className="ti ti-file-text"></i> PDF</button>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-6 no-print"><i className="ti ti-info-circle"></i> O layout acima está otimizado. Ao clicar em PDF, apenas os dados serão impressos.</p>
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed print-only-text">{gerarTexto()}</pre>
        <div className="mt-8 pt-4 border-t flex justify-end no-print">
           <button onClick={() => setDone(false)} className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">Voltar e Editar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="md:hidden bg-mb-green text-white p-4 shadow-md flex items-center justify-between z-10 no-print">
           <div className="flex items-center gap-2"><i className="ti ti-leaf text-xl"></i><h1 className="font-semibold text-sm">Mesa Brasil</h1></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {activeMenu === 'nova' && !done && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex border-b bg-gray-50/50">
                  {['Geral', 'Infraestrutura', 'Higiene & Fim'].map((st, i) => (
                    <button key={i} onClick={() => setStep(i)} className={`flex-1 py-4 text-xs md:text-sm font-medium transition-colors border-b-2 ${step === i ? 'border-mb-green text-mb-green bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                      {i+1}. {st}
                    </button>
                  ))}
                </div>
                <div className="p-5 md:p-8">{renderStep()}</div>
                <div className="bg-gray-50 p-4 border-t flex justify-between items-center rounded-b-2xl">
                  {step > 0 ? (
                    <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 text-gray-600 bg-white border rounded-lg shadow-sm hover:bg-gray-50 text-sm"><i className="ti ti-arrow-left"></i> Voltar</button>
                  ) : (
                    <button onClick={() => {if(confirm("Apagar rascunho?")){setForm(initForm());setStep(0);}}} className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm">Limpar Form</button>
                  )}
                  {step < 2 ? (
                    <button onClick={() => setStep(s => s + 1)} className="px-5 py-2 bg-mb-green text-white rounded-lg shadow-md hover:bg-mb-green-mid text-sm">Próximo <i className="ti ti-arrow-right"></i></button>
                  ) : (
                    <button onClick={() => setDone(true)} className="px-5 py-2 bg-mb-orange text-white rounded-lg shadow-lg hover:bg-orange-600 text-sm font-medium"><i className="ti ti-check"></i> Gerar Resumo</button>
                  )}
                </div>
              </div>
            )}

            {activeMenu === 'nova' && done && renderResumo()}

            {activeMenu === 'historico' && (
              <div className="text-center py-20 text-gray-500">
                 <i className="ti ti-history text-5xl mb-4 text-gray-300"></i><h2 className="text-xl font-medium text-gray-700">Histórico de Visitas</h2><p className="mt-2 text-sm">Em breve: Suas visitas finalizadas nos últimos 7 dias aparecerão aqui.</p>
              </div>
            )}
            {activeMenu === 'instituicoes' && (
              <div className="text-center py-20 text-gray-500">
                 <i className="ti ti-building text-5xl mb-4 text-gray-300"></i><h2 className="text-xl font-medium text-gray-700">Gerenciador de Locais</h2><p className="mt-2 text-sm">Em breve: Tela para adicionar/editar a lista de instituições.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileNav />

      {/* Modal S-PEN */}
      <div id="spen-modal" className="hidden fixed inset-0 z-[100] bg-black/60 spen-modal-open flex items-center justify-center p-4 md:p-10 no-print">
        <div className="bg-white w-full h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in border-4 border-blue-500">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
             <div className="flex items-center gap-2"><i className="ti ti-ballpen text-xl"></i><h3 className="font-semibold text-lg">Modo Escrita (S-Pen / Apple Pencil)</h3></div>
             <button onClick={() => document.getElementById('spen-modal').classList.add('hidden')} className="text-white/80 hover:text-white"><i className="ti ti-x text-2xl"></i></button>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-800 text-xs flex items-center gap-2 border-b border-yellow-200">
             <i className="ti ti-info-circle text-base"></i> Escreva livremente com a caneta no bloco pautado abaixo. O tablet converterá para texto.
          </div>
          <textarea className="flex-1 w-full p-6 text-lg outline-none resize-none bg-repeat" style={{ backgroundImage: 'linear-gradient(transparent, transparent 29px, #e5e7eb 30px)', backgroundSize: '100% 30px', lineHeight: '30px' }} value={form.orientacoesNutricionista} onChange={e => upd('orientacoesNutricionista', e.target.value)} placeholder="Encoste a caneta aqui..."></textarea>
          <div className="p-4 bg-gray-100 border-t flex justify-end">
            <button onClick={() => document.getElementById('spen-modal').classList.add('hidden')} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow font-medium">Concluído</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
