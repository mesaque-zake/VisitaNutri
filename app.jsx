const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby_v1968jG0XJ2MQDJYOKhHn_wmKzZezjuclDsJNHdAV1yYRS-GUIwdQpHYNw2gLK4hgw/exec";

const { useState, useEffect } = React;
const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // 'success', 'error' ou null

// ==========================================
// 1. BANCO DE DADOS E ARRAYS ORIGINAIS
// ==========================================
const INST = [];
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
// 2. COMPONENTES REUTILIZÁVEIS UI 
// ==========================================
const SLabel = ({ icon, text, color = "green" }) => {
  const colors = {
    green: "text-mb-green",
    orange: "text-orange-500",
    blue: "text-blue-600"
  };
  return (
    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${colors[color]}`}>
      <i className={`ti ti-${icon} text-sm`}></i>{text}
    </p>
  );
};

const Chip = ({ label, active, onClick, className = "", icon = "", color = "green" }) => {
  const colors = {
    green: active ? "bg-mb-green-light border-mb-green text-mb-green font-medium" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
    orange: active ? "bg-orange-50 border-orange-500 text-orange-600 font-medium" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
    blue: active ? "bg-blue-50 border-blue-500 text-blue-600 font-medium" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  return (
    <span onClick={onClick} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] cursor-pointer border transition-all select-none ${colors[color]} ${className}`}>
      {active ? <i className="ti ti-check text-[11px]"></i> : (icon ? <i className={`ti ti-${icon} text-[15px] text-gray-400`}></i> : null)}
      {label}
    </span>
  );
};

const YN = ({ val, onChange, color = "green" }) => {
  const colors = {
    green: "bg-mb-green text-white border-mb-green",
    orange: "bg-orange-500 text-white border-orange-500",
    blue: "bg-blue-600 text-white border-blue-600"
  };
  return (
    <div className="flex gap-2">
      {["Sim", "Não"].map(o => (
        <button key={o} onClick={() => onChange(o)} className={`flex-1 py-2 rounded-lg border transition-all text-sm ${val === o ? colors[color] : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
          {o}
        </button>
      ))}
    </div>
  );
};

const QR = ({ label, value, onChange, icon = "", color = "green" }) => {
  const focusColors = {
    green: "focus:border-mb-green",
    orange: "focus:border-orange-500",
    blue: "focus:border-blue-500"
  };
  return (
    <div className="flex items-center gap-3 mb-2">
      <label className="text-[13px] text-gray-600 flex-1 flex items-center gap-2">
        {icon && <i className={`ti ti-${icon} text-lg text-gray-400`}></i>} {label}
      </label>
      <input type="number" placeholder="0" value={value} onChange={(e) => onChange(e.target.value)} className={`w-20 p-2 rounded-lg border border-gray-300 outline-none ${focusColors[color]} text-center text-sm`} />
    </div>
  );
};

// ==========================================
// 3. O APP PRINCIPAL
// ==========================================
function App() {
  const [activeMenu, setActiveMenu] = useState("nova");
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("mb_visita_rascunho");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Trava de segurança: Limpa cache antigo se estrutura for diferente para não dar tela branca
      if (typeof parsed.equipamentos?.fogao !== 'object') return initForm();
      return parsed;
    }
    return initForm();
  });
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSpenOpen, setIsSpenOpen] = useState(false);

  // Histórico de visitas persistido no navegador deste dispositivo
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("mb_visitas_historico");
    return saved ? JSON.parse(saved) : [];
  });

  // Estado para armazenar as instituições dinâmicas (usa a constante INST como backup)
  const [instituicoes, setInstituicoes] = useState(() => {
    const cache = localStorage.getItem("mb_instituicoes_cache");
    return cache ? JSON.parse(cache) : INST;
  });

  // Estado para controlar o horário do último salvamento automático
  const [lastSaved, setLastSaved] = useState("");

  // Efeito para sincronizar histórico
  useEffect(() => {
    localStorage.setItem("mb_visitas_historico", JSON.stringify(history));
  }, [history]);

  // Rola a tela principal de volta para o topo automaticamente ao mudar de etapa ou concluir
  useEffect(() => {
    const painelRolagem = document.querySelector("main .overflow-y-auto");
    if (painelRolagem) {
      painelRolagem.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, done]);

  // Efeito para sincronizar rascunho de preenchimento e atualizar o horário de salvamento
  useEffect(() => {
    localStorage.setItem("mb_visita_rascunho", JSON.stringify(form));
    const agora = new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
    setLastSaved(agora);
  }, [form]);

  // Função para carregar as instituições da planilha (pode ser chamada no início ou manualmente pelo botão)
  const carregarInstituicoesSheets = async (exibirAlerta = false) => {
    try {
      const sheetId = "1s8BNMG9Ox2PEVVGmgWZG2Oq5PPlXSa67xtEsqF5c6pk";
      const sheetName = "Instituicoes";
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro de conexão");
      const csvText = await response.text();

      const lines = csvText.split(/\r?\n/);
      const listaAtivas = [];

      for (let i = 1; i < lines.length; i++) { // Ignora cabeçalho
        const line = lines[i].trim();
        if (!line) continue;

        const row = [];
        let currentField = '';
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            row.push(currentField.trim());
            currentField = '';
          } else {
            currentField += char;
          }
        }
        row.push(currentField.trim());

        if (row.length >= 3) {
          const codigo = row[0].replace(/^"|"$/g, '').trim();
          const nome = row[1].replace(/^"|"$/g, '').trim();
          const status = row[2].replace(/^"|"$/g, '').trim();

          if (status.toLowerCase() === "ativo") {
            listaAtivas.push(`${codigo} - ${nome}`);
          }
        }
      }

      if (listaAtivas.length > 0) {
        setInstituicoes(listaAtivas);
        localStorage.setItem("mb_instituicoes_cache", JSON.stringify(listaAtivas));
        if (exibirAlerta) alert("Lista de locais sincronizada com sucesso!");
      }
    } catch (error) {
      console.warn("Carregando cache das instituições em modo offline:", error);
      if (exibirAlerta) alert("Não foi possível atualizar online. Carregando dados locais do aparelho.");
    }
  };

  // Coleta dados automaticamente ao carregar o aplicativo
  useEffect(() => {
    carregarInstituicoesSheets();
  }, []);

  // Filtro de busca para as instituições dinâmicas (Definido após as declarações corretas)
  const filteredInstituicoes = instituicoes.filter(i => 
    i.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Salva a visita atual no histórico (se já existir, atualiza com as novas edições)
  const salvarNoHistorico = (dadosForm) => {
    setHistory(prev => {
      const index = prev.findIndex(x => x.id === dadosForm.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = dadosForm;
        return updated;
      } else {
        return [dadosForm, ...prev]; // Entra no topo da lista
      }
    });
  };

  // Função auxiliar para "achatar" o formulário em uma linha plana para a planilha
  const achatarDadosForm = (f) => {
    const eq = f.equipamentos || {};
    const est = f.estoque || {};
    const per = f.periodicidade || {};
    const hig = f.higiene || {};

    return {
      "ID": f.id,
      "Data da Visita": f.data,
      "Instituicao": f.instituicao,
      "Atendido Por": f.atendidoPor,
      "Quem Recebeu": f.quemRecebeu,
      "Cargo": f.cargo === 'Outro' ? f.cargoOutro : f.cargo,
      "N de Atendidos": f.numAtendidos,
      "Alimentos Necessarios": (f.alimentos || []).join(', '),
      "Sobras de Alimentos": f.sobras,
      "Convenio Prefeitura": f.convenio === 'Sim' ? `Sim (${[...f.convenioOpcoes, f.convenioOutros].filter(Boolean).join(', ')})` : 'Não',
      "Refeicoes Oferecidas": (f.refeicoes || []).join(', '),
      "Prioridade de Doacao": f.prioridadeDoacao,
      "Geladeira Domestica": eq.geladeiraDom || "0",
      "Geladeira Industrial": eq.geladeiraInd || "0",
      "Fogao Qtd": eq.fogao?.qtd || "0",
      "Fogao Bocas": eq.fogao?.bocas || "",
      "Freezer Qtd": eq.freezer?.qtd || "0",
      "Freezer Tipos": (eq.freezer?.tipos || []).join(', '),
      "Camara Fria": eq.camaraFria || "0",
      "Balcao Quente": eq.balcaoQuente || "0",
      "Balcao Frio": eq.balcaoFrio || "0",
      "Forno Comum": eq.fornoComum || "0",
      "Forno Combinado": eq.fornoCombinado || "0",
      "Outros Equipamentos": eq.outros || "Nenhum",
      "Caracteristicas Cozinha": [...(f.caracCozinha || []), f.caracOutro].filter(Boolean).join(', '),
      "Funcionarios Cozinheiras": f.funcCozinheira || "0",
      "Funcionarios Auxiliares": f.funcAuxiliar || "0",
      "Escala": f.escala || "Não informada",
      "Status Estoque FLV": est.flv || "Não informado",
      "Freq Entrega FLV": per.flv || "Não informada",
      "Status Estoque Estocaveis": est.estocaveis || "Não informado",
      "Freq Entrega Estocaveis": per.estocaveis || "Não informada",
      "Status Estoque Carnes": est.carnes || "Não informado",
      "Freq Entrega Carnes": per.carnes || "Não informada",
      "Higiene Geral": hig.geral || "Não informada",
      "Higiene Manipuladores": (hig.manipuladores || []).join(', '),
      "Higiene Cozinha Refeitorio Obs": hig.cozinhaRefeitorio || "Nenhuma",
      "Aplica Orientacoes Cursos": f.orientacoesAplicadas || "Não informado",
      "Assistidos com Patologia": f.patologia === 'Sim' ? `Sim (${f.patologiaDesc})` : 'Não',
      "Tags de Orientacao Aplicadas": (f.orientacoesRapidas || []).join(', '),
      "Conclusao Nutricionista": f.orientacoesNutricionista || ""
    };
  };

  // Função responsável pelo envio assíncrono para o Google Sheets
  const enviarParaSheets = async (dadosOriginais) => {
    if (!SHEET_WEBAPP_URL || SHEET_WEBAPP_URL.includes("SUA_URL_DO_APPS_SCRIPT_AQUI")) {
      console.warn("URL do Google Sheets não configurada.");
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const dadosAchatados = achatarDadosForm(dadosOriginais);
      const response = await fetch(SHEET_WEBAPP_URL, {
        method: "POST",
        mode: "no-cors", // Garante envio direto sem bloqueios CORS de navegadores móveis
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAchatados)
      });
      
      // Como no-cors impede leitura de resposta detalhada, consideramos sucesso se a requisição não disparou erro
      setSyncStatus("success");
    } catch (error) {
      console.error("Erro ao sincronizar com Google Sheets:", error);
      setSyncStatus("error");
    } finally {
      setIsSyncing(false);
    }
  };

  const finalizarVisita = () => {
    salvarNoHistorico(form);
    setDone(true);
    enviarParaSheets(form); // Dispara envio automático
  };

  // Carrega a visita de volta para edição/geração de documentos
  const reabrirVisita = (visita) => {
    setForm(visita);
    setDone(false);
    setStep(0);
    setActiveMenu("nova");
  };

  // Exclui uma visita permanentemente do histórico do aparelho
  const excluirVisita = (id) => {
    if (confirm("Deseja realmente excluir este relatório do histórico?")) {
      setHistory(prev => prev.filter(x => x.id !== id));
    }
  };

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

  // GERADOR DE TEXTO (COPIAR INTELIGENTE)
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
    if(eq.fogao?.qtd) eqStr.push(`Fogão: ${eq.fogao.qtd} (${eq.fogao.bocas} bocas)`);
    if(eq.freezer?.qtd) eqStr.push(`Freezer: ${eq.freezer.qtd} (${eq.freezer.tipos.join(', ')})`);
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

  // GERADOR DE EXCEL (PLANILHA)
  const exportToExcel = () => {
    const f = form;
    const eq = f.equipamentos;
    
    // Organiza os dados da visita em uma estrutura tabular limpa
    const data = [
      { "Categoria": "IDENTIFICAÇÃO", "Campo": "Data da Visita", "Valor": f.data },
      { "Categoria": "IDENTIFICAÇÃO", "Campo": "Instituição", "Valor": f.instituicao },
      { "Categoria": "IDENTIFICAÇÃO", "Campo": "Atendido Por", "Valor": f.atendidoPor },
      { "Categoria": "IDENTIFICAÇÃO", "Campo": "Quem Recebeu", "Valor": f.quemRecebeu },
      { "Categoria": "IDENTIFICAÇÃO", "Campo": "Cargo", "Valor": f.cargo === 'Outro' ? f.cargoOutro : f.cargo },
      { "Categoria": "IDENTIFICAÇÃO", "Campo": "Nº de Atendidos", "Valor": f.numAtendidos },
      
      { "Categoria": "ALIMENTAÇÃO", "Campo": "Necessidades", "Valor": f.alimentos.join(', ') },
      { "Categoria": "ALIMENTAÇÃO", "Campo": "Sobras de Alimentos", "Valor": f.sobras },
      { "Categoria": "ALIMENTAÇÃO", "Campo": "Convênio Prefeitura", "Valor": f.convenio === 'Sim' ? `Sim (${[...f.convenioOpcoes, f.convenioOutros].filter(Boolean).join(', ')})` : 'Não' },
      { "Categoria": "ALIMENTAÇÃO", "Campo": "Refeições Oferecidas", "Valor": f.refeicoes.join(', ') },
      { "Categoria": "ALIMENTAÇÃO", "Campo": "Prioridade de Doações", "Valor": f.prioridadeDoacao },
      
      { "Categoria": "EQUIPAMENTOS", "Campo": "Geladeira Doméstica", "Valor": eq.geladeiraDom || "0" },
      { "Categoria": "EQUIPAMENTOS", "Campo": "Geladeira Industrial", "Valor": eq.geladeiraInd || "0" },
      { "Categoria": "EQUIPAMENTOS", "Campo": "Fogão", "Valor": eq.fogao?.qtd ? `${eq.fogao.qtd} (${eq.fogao.bocas} bocas)` : "0" },
      { "Categoria": "EQUIPAMENTOS", "Campo": "Freezer", "Valor": eq.freezer?.qtd ? `${eq.freezer.qtd} (${eq.freezer.tipos.join(', ')})` : "0" },
      { "Categoria": "EQUIPAMENTOS", "Campo": "Câmara Fria", "Valor": eq.camaraFria || "0" },
      { "Categoria": "EQUIPAMENTOS", "Campo": "Balcão Quente", "Valor": eq.balcaoQuente || "0" },
      { "Categoria": "EQUIPAMENTOS", "Campo": "Balcão Frio", "Valor": eq.balcaoFrio || "0" },
      { "Categoria": "EQUIPAMENTOS", "Campo": "Forno Comum", "Valor": eq.fornoComum || "0" },
      { "Categoria": "EQUIPAMENTOS", "Campo": "Forno Combinado", "Valor": eq.fornoCombinado || "0" },
      { "Categoria": "EQUIPAMENTOS", "Campo": "Outros Equipamentos", "Valor": eq.outros || "Nenhum" },
      
      { "Categoria": "INFRAESTRUTURA", "Campo": "Características da Cozinha", "Valor": [...f.caracCozinha, f.caracOutro].filter(Boolean).join(', ') },
      { "Categoria": "INFRAESTRUTURA", "Campo": "Cozinheiras (Qtd)", "Valor": f.funcCozinheira || "0" },
      { "Categoria": "INFRAESTRUTURA", "Campo": "Auxiliares (Qtd)", "Valor": f.funcAuxiliar || "0" },
      { "Categoria": "INFRAESTRUTURA", "Campo": "Escala de Trabalho", "Valor": f.escala || "Não informada" },
      
      { "Categoria": "ESTOQUE", "Campo": "Status FLV", "Valor": `${f.estoque.flv || 'Não informado'} (${f.periodicidade.flv || 'Não informada'})` },
      { "Categoria": "ESTOQUE", "Campo": "Status Estocáveis", "Valor": `${f.estoque.estocaveis || 'Não informado'} (${f.periodicidade.estocaveis || 'Não informada'})` },
      { "Categoria": "ESTOQUE", "Campo": "Status Carnes", "Valor": `${f.estoque.carnes || 'Não informado'} (${f.periodicidade.carnes || 'Não informada'})` },
      
      { "Categoria": "HIGIENE", "Campo": "Geral", "Valor": f.higiene.geral || "Não informada" },
      { "Categoria": "HIGIENE", "Campo": "Manipuladores (Obs)", "Valor": f.higiene.manipuladores.join(', ') || "Nenhuma" },
      { "Categoria": "HIGIENE", "Campo": "Cozinha/Refeitório (Obs)", "Valor": f.higiene.cozinhaRefeitorio || "Nenhuma" },
      { "Categoria": "HIGIENE", "Campo": "Aplica Orientações dos Cursos", "Valor": f.orientacoesAplicadas || "Não informado" },
      
      { "Categoria": "PATOLOGIAS & DIETAS", "Campo": "Assistidos com Patologia", "Valor": f.patologia === 'Sim' ? `Sim (${f.patologiaDesc})` : 'Não' },
      
      { "Categoria": "ORIENTAÇÕES", "Campo": "Tags de Orientação Aplicadas", "Valor": f.orientacoesRapidas.join(', ') || "Nenhuma" },
      { "Categoria": "ORIENTAÇÕES", "Campo": "Instruções do Nutricionista", "Valor": f.orientacoesNutricionista || "Sem instruções" }
    ];

    // Converte os dados para formato de planilha do SheetJS
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório Visita");

    // Ajusta as larguras das colunas para não cortar os textos no Excel
    const colWidths = [
      { wch: 20 }, // Largura da Coluna Categoria
      { wch: 32 }, // Largura da Coluna Campo
      { wch: 55 }  // Largura da Coluna Valor
    ];
    worksheet["!cols"] = colWidths;

    // Define o nome de arquivo amigável baseado na instituição e data da visita
    const nomeLimpoInst = f.instituicao ? f.instituicao.substring(0, 30).replace(/[^a-zA-Z0-9]/g, "_") : "Visita";
    const nomeArquivo = `Relatorio_${nomeLimpoInst}_${f.data.replace(/\//g, "-")}.xlsx`;

    // Baixa o arquivo do Excel no navegador
    XLSX.writeFile(workbook, nomeArquivo);
  };

  // ==========================================
  // NOVA NAVEGAÇÃO: CABEÇALHO E MENU GAVETA
  // ==========================================
  const Header = () => (
    <header className="w-full bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between no-print shrink-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsDrawerOpen(true)} 
          className="w-10 h-10 flex items-center justify-center rounded-xl text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <i className="ti ti-menu-2 text-2xl"></i>
        </button>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl text-blue-600 font-bold tracking-wide select-none" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Visitas
          </span>
          <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-blue-600 select-none">
            Nutricionais
          </span>
        </div>
      </div>
      
      {/* Indicador de Salvamento Automático Discreto */}
      {lastSaved && activeMenu === 'nova' && !done && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 select-none bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>Salvo às {lastSaved}</span>
        </div>
      )}
    </header>
  );

  const Drawer = () => (
    <>
      {/* Fundo escurecido semi-transparente */}
      {isDrawerOpen && (
        <div 
          onClick={() => setIsDrawerOpen(false)} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity no-print"
        />
      )}
      
      {/* Gaveta que desliza da esquerda */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between no-print border-r border-slate-100 ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Topo do Menu Gaveta */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-blue-600 font-bold tracking-wide" style={{ fontFamily: "'Dancing Script', cursive" }}>
                Visitas
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-blue-600">
                Nutricionais
              </span>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)} 
              className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <i className="ti ti-x text-lg"></i>
            </button>
          </div>

          {/* Links de Ação */}
          <nav className="mt-6 flex flex-col gap-2 px-4">
            <button 
              onClick={() => { setActiveMenu('nova'); setDone(false); setIsDrawerOpen(false); }} 
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'nova' && !done 
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm shadow-blue-500/5' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className="ti ti-clipboard-plus text-xl"></i>
              <span className="text-sm">Nova Visita</span>
            </button>

            <button 
              onClick={() => { setActiveMenu('historico'); setIsDrawerOpen(false); }} 
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'historico' 
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm shadow-blue-500/5' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className="ti ti-history text-xl"></i>
              <span className="text-sm">Histórico</span>
            </button>

            <button 
              onClick={() => { carregarInstituicoesSheets(true); setIsDrawerOpen(false); }} 
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <i className="ti ti-refresh text-xl"></i>
              <span className="text-sm">Atualizar Locais</span>
            </button>
          </nav>
        </div>

        {/* Rodapé com Autores */}
        <div className="mb-6 px-6 text-slate-400 text-[10px] select-none flex flex-col">
          <span>Powered with <span className="text-rose-500">&#10084;</span> by</span>
          <span className="mt-0.5 font-semibold text-slate-600">Mesaque & Lorrana</span>
        </div>
      </div>
    </>
  );
  // ==========================================
  // RENDERIZAÇÃO DAS TRÊS ETAPAS (CARDS)
  // ==========================================
  const renderStepGeral = () => {
    const f = form;
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <SLabel icon="building" text="Identificação" color="orange" />
          {/* Seletor Suspenso Customizado com Busca e Codigo em Pill */}
          <div className="relative mb-4">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white cursor-pointer flex justify-between items-center text-sm shadow-sm hover:border-orange-500 transition-all select-none"
            >
              {f.instituicao ? (
                <div className="flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-md">
                    {f.instituicao.split(" - ")[0]}
                  </span>
                  <span className="font-semibold text-slate-700 truncate">
                    {f.instituicao.split(" - ").slice(1).join(" - ")}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400">Selecione a instituição...</span>
              )}
              <i className={`ti ti-chevron-down text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-3 max-h-[350px] flex flex-col animate-fade-in ring-1 ring-black/5">
                {/* Campo de Busca Interno */}
                <div className="relative mb-2">
                  <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input 
                    type="text" 
                    placeholder="Buscar pelo nome ou código..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 p-2 rounded-lg border border-gray-200 outline-none text-sm focus:border-orange-500"
                    autoFocus
                  />
                </div>
                
                {/* Lista de Opções */}
                <div className="overflow-y-auto flex-1 space-y-1 pr-1 custom-scrollbar">
                  {filteredInstituicoes.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">Nenhum local ativo encontrado</p>
                  ) : (
                    filteredInstituicoes.map((inst) => {
                      const parts = inst.split(" - ");
                      const code = parts[0];
                      const name = parts.slice(1).join(" - ");
                      const isSelected = f.instituicao === inst;
                      
                      return (
                        <div 
                          key={inst}
                          onClick={() => {
                            upd("instituicao", inst);
                            setIsDropdownOpen(false);
                            setSearchTerm("");
                          }}
                          className={`p-2 rounded-lg text-sm flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected ? 'bg-orange-50/70 text-orange-700' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                              isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {code}
                            </span>
                            <span className={`truncate ${isSelected ? 'font-semibold' : ''}`}>{name}</span>
                          </div>
                          {isSelected && <i className="ti ti-check text-orange-500 shrink-0"></i>}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Atendimento feito por (Seu nome)" value={f.atendidoPor} onChange={e => upd('atendidoPor', e.target.value)} className="w-full p-2.5 rounded-lg border outline-none text-sm focus:border-orange-500" />
            <input type="number" placeholder="Nº de atendidos pelo local" value={f.numAtendidos} onChange={e => upd('numAtendidos', e.target.value)} className="w-full p-2.5 rounded-lg border outline-none text-sm focus:border-orange-500" />
          </div>

          <p className="text-xs font-semibold text-gray-500 mb-2">Quem recebeu e Cargo</p>
          <input type="text" placeholder="Nome de quem recebeu" value={f.quemRecebeu} onChange={e => upd('quemRecebeu', e.target.value)} className="w-full p-2.5 rounded-lg border outline-none text-sm mb-3 focus:border-orange-500" />
          <div className="flex flex-wrap gap-2 mb-2">
            {CARGOS.map(c => <Chip key={c} label={c} active={f.cargo === c} onClick={() => upd("cargo", c)} color="orange" />)}
          </div>
          {f.cargo === "Outro" && <input type="text" placeholder="Especifique o cargo" value={f.cargoOutro} onChange={e => upd('cargoOutro', e.target.value)} className="w-full p-2.5 rounded-lg border outline-none text-sm mt-2 focus:border-orange-500" />}
        </div>
        
        <hr className="border-gray-100" />
        
        <div>
          <SLabel icon="basket" text="Alimentação e Refeições" color="orange" />
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Alimentos mais necessários</p>
            <div className="flex flex-wrap gap-2">
              {["FLV", "Pães", "Cesta básica", "Industrializados", "Carnes", "Laticínios", "Todos"].map(a => {
                const iconMap = {"FLV": "apple", "Pães": "baguette", "Cesta básica": "package", "Industrializados": "box", "Carnes": "meat", "Laticínios": "milk", "Todos": "basket"};
                return <Chip key={a} label={a} icon={iconMap[a]} active={f.alimentos.includes(a)} onClick={() => tog("alimentos", a)} color="orange" />
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div><p className="text-xs text-gray-500 mb-2">Sobras de alimentos</p><YN val={f.sobras} onChange={v => upd("sobras", v)} color="orange" /></div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Convênio prefeitura?</p><YN val={f.convenio} onChange={v => upd("convenio", v)} color="orange" />
              {f.convenio === "Sim" && (
                <div className="mt-3 space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">{["ONG Prato Cheio", "ONG Banco de Alimentos", "Empresas parceiras"].map(o => <Chip key={o} label={o} active={f.convenioOpcoes.includes(o)} onClick={() => tog("convenioOpcoes", o)} color="orange" />)}</div>
                  <input type="text" placeholder="Outras..." value={f.convenioOutros} onChange={e => upd("convenioOutros", e.target.value)} className="w-full p-2 rounded border text-sm focus:border-orange-500 outline-none" />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Refeições oferecidas</p>
            <div className="flex flex-wrap gap-2">
              {REFEICOES.map(r => {
                const refIcon = {"Café da manhã": "coffee", "Lanche da manhã": "croissant", "Almoço": "soup", "Lanche da tarde": "cup", "Jantar": "tools-kitchen-2", "Ceia": "moon"};
                return <Chip key={r} label={r} icon={refIcon[r]} active={f.refeicoes.includes(r)} onClick={() => tog("refeicoes", r)} color="orange" />
              })}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2">Prioridade para doações</p>
            <div className="flex flex-wrap gap-2">{PRIORIDADES.map(p => <Chip key={p} label={p} active={f.prioridadeDoacao === p} onClick={() => upd("prioridadeDoacao", p)} className="flex-1 text-center justify-center" color="orange" />)}</div>
          </div>
        </div>

        {/* Botões Internos do Card Geral */}
        <div className="flex justify-between items-center pt-4 border-t border-orange-100">
          <div className="flex items-center gap-3">
            <button onClick={() => {if(confirm("Apagar rascunho?")){setForm(initForm());setStep(0);}}} className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors">Limpar Form</button>
            {lastSaved && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-400 select-none">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>Salvo às {lastSaved}</span>
              </div>
            )}
          </div>
          <button onClick={() => setStep(1)} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-md shadow-orange-500/10 text-sm font-semibold transition-all">Próximo <i className="ti ti-arrow-right ml-1"></i></button>
        </div>
      </div>
    );
  };

  const renderStepInfra = () => {
    const f = form; const eq = f.equipamentos;
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <SLabel icon="tool" text="Equipamentos" color="green" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <QR icon="fridge" label="Geladeira doméstica" value={eq.geladeiraDom} onChange={v => updN("equipamentos", "geladeiraDom", v)} color="green" />
            <QR icon="fridge" label="Geladeira industrial" value={eq.geladeiraInd} onChange={v => updN("equipamentos", "geladeiraInd", v)} color="green" />
            <div>
              <QR icon="cooker" label="Quantidade de fogões" value={eq.fogao?.qtd || ""} onChange={v => setForm(f => ({...f, equipamentos: {...f.equipamentos, fogao: {...f.equipamentos.fogao, qtd: v}}}))} color="green" />
              {eq.fogao?.qtd > 0 && <div className="flex gap-2 mb-2">{["4", "6", "8", "Mais de 8"].map(b => <Chip key={b} label={b+" bocas"} active={eq.fogao?.bocas === b} onClick={() => setForm(f => ({...f, equipamentos: {...f.equipamentos, fogao: {...f.equipamentos.fogao, bocas: b}}}))} color="green" />)}</div>}
            </div>
            <div>
              <QR icon="snowflake" label="Quantidade de freezers" value={eq.freezer?.qtd || ""} onChange={v => setForm(f => ({...f, equipamentos: {...f.equipamentos, freezer: {...f.equipamentos.freezer, qtd: v}}}))} color="green" />
              {eq.freezer?.qtd > 0 && <div className="flex gap-2 flex-wrap mb-2">{["Vert. 1P", "Horiz. 1P", "Horiz. 2P"].map(t => <Chip key={t} label={t} active={eq.freezer?.tipos.includes(t)} onClick={() => setForm(f => ({...f, equipamentos: {...f.equipamentos, freezer: {...f.equipamentos.freezer, tipos: eq.freezer.tipos.includes(t) ? eq.freezer.tipos.filter(x=>x!==t) : [...eq.freezer.tipos, t]}}}))} color="green" />)}</div>}
            </div>
            <QR icon="box" label="Câmara fria" value={eq.camaraFria} onChange={v => updN("equipamentos", "camaraFria", v)} color="green" />
            <QR icon="flame" label="Balcão quente" value={eq.balcaoQuente} onChange={v => updN("equipamentos", "balcaoQuente", v)} color="green" />
            <QR icon="ice-cream" label="Balcão frio" value={eq.balcaoFrio} onChange={v => updN("equipamentos", "balcaoFrio", v)} color="green" />
            <QR icon="microwave" label="Forno comum" value={eq.fornoComum} onChange={v => updN("equipamentos", "fornoComum", v)} color="green" />
            <QR icon="cooker" label="Forno combinado" value={eq.fornoCombinado} onChange={v => updN("equipamentos", "fornoCombinado", v)} color="green" />
          </div>
          <input type="text" placeholder="Outros equipamentos..." value={eq.outros} onChange={e => updN("equipamentos", "outros", e.target.value)} className="w-full p-2.5 rounded-lg border outline-none text-sm mt-2 focus:border-mb-green" />
        </div>

        <hr className="border-gray-100" />

        <div>
          <SLabel icon="tools-kitchen-2" text="Cozinha" color="green" />
          <div className="flex flex-wrap gap-2 mb-3">{CARACT.map(c => <Chip key={c} label={c} active={f.caracCozinha.includes(c)} onClick={() => tog("caracCozinha", c)} color="green" />)}</div>
          <input type="text" placeholder="Outras características..." value={f.caracOutro} onChange={e => upd("caracOutro", e.target.value)} className="w-full p-2 rounded-lg border outline-none text-sm mb-4 focus:border-mb-green" />
          
          <SLabel icon="chef-hat" text="Funcionários" color="green" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div><label className="text-xs text-gray-500">Cozinheiras</label><input type="number" value={f.funcCozinheira} onChange={e => upd("funcCozinheira", e.target.value)} className="w-full p-2 border rounded focus:border-mb-green outline-none" /></div>
            <div><label className="text-xs text-gray-500">Auxiliares</label><input type="number" value={f.funcAuxiliar} onChange={e => upd("funcAuxiliar", e.target.value)} className="w-full p-2 border rounded focus:border-mb-green outline-none" /></div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Escala</label>
              <div className="flex gap-2">{["5x2", "12x36"].map(e => <Chip key={e} label={e} active={f.escala === e} onClick={() => upd("escala", e)} color="green" />)}</div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <SLabel icon="package" text="Estoque e Periodicidade" color="green" />
          <div className="grid grid-cols-3 gap-4 mb-6">
            {["flv", "estocaveis", "carnes"].map(k => (
              <div key={k} className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase">{k}</label>
                <select value={f.estoque[k]} onChange={e => updN("estoque", k, e.target.value)} className="p-2 border rounded text-sm bg-white outline-none focus:border-mb-green">
                  <option value="">Status...</option><option>Poucos</option><option>Satisfatório</option><option>Muito</option>
                </select>
                <input type="text" placeholder="Freq..." value={f.periodicidade[k]} onChange={e => updN("periodicidade", k, e.target.value)} className="p-2 border rounded text-sm outline-none focus:border-mb-green" />
              </div>
            ))}
          </div>
        </div>

        {/* Botões Internos do Card Infra */}
        <div className="flex justify-between items-center pt-4 border-t border-mb-green-light">
          <button onClick={() => setStep(0)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors"><i className="ti ti-arrow-left mr-1"></i> Voltar</button>
          <button onClick={() => setStep(2)} className="px-5 py-2 bg-mb-green hover:bg-mb-green-mid text-white rounded-lg shadow-md shadow-emerald-500/10 text-sm font-semibold transition-all">Próximo <i className="ti ti-arrow-right ml-1"></i></button>
        </div>
      </div>
    );
  };

  const renderStepHigiene = () => {
    const f = form;
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <SLabel icon="sparkles" text="Higiene" color="blue" />
          <div className="flex gap-2 mb-4">{["Satisfatória", "Insatisfatória"].map(o => <Chip key={o} label={o} active={f.higiene.geral === o} onClick={() => updN("higiene", "geral", o)} color="blue" />)}</div>
          <SLabel icon="chef-hat" text="Manipuladores" color="blue" />
          <div className="flex flex-wrap gap-2 mb-4">{MANIP_OPTS.map(o => <Chip key={o} label={o} active={f.higiene.manipuladores.includes(o)} onClick={() => togN("higiene", "manipuladores", o)} color="blue" />)}</div>
          <input type="text" placeholder="Obs: Cozinha e Refeitório" value={f.higiene.cozinhaRefeitorio} onChange={e => updN("higiene", "cozinhaRefeitorio", e.target.value)} className="w-full p-2.5 border rounded-lg outline-none text-sm focus:border-blue-500" />
        </div>

        <hr className="border-gray-100" />

        

        <SLabel icon="ballpen" text="Considerações" color="blue" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-xs text-gray-500 mb-2">Aplica orientações dos cursos?</p><YN val={f.orientacoesAplicadas} onChange={v => upd("orientacoesAplicadas", v)} color="blue" /></div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Assistidos com patologia?</p><YN val={f.patologia} onChange={v => upd("patologia", v)} color="blue" />
            {f.patologia === "Sim" && <input type="text" placeholder="Descreva..." value={f.patologiaDesc} onChange={e => upd("patologiaDesc", e.target.value)} className="w-full mt-2 p-2 border rounded text-sm focus:border-blue-500 outline-none" />}
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <SLabel icon="speakerphone" text="Orientações Rápidas (Tags)" color="blue" />
          <div className="flex flex-wrap gap-2 mb-4">{ORIENT_RAP.map(o => <Chip key={o} label={o} active={f.orientacoesRapidas.includes(o)} onClick={() => f.orientacoesRapidas.includes(o) ? remO(o) : addO(o)} className="text-[11px] border-dashed" color="blue" />)}</div>
          
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-md relative">
             <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-blue-600 uppercase tracking-wide">Conclusão (Nutricionista)</label>
                <button onClick={() => setIsSpenOpen(true)} className="flex items-center gap-1.5 text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 shadow-sm shadow-blue-500/10 transition-colors cursor-pointer">
                  <i className="ti ti-ballpen"></i> Usar S-Pen (Manuscrito)
                </button>
             </div>
             <textarea className="w-full p-3 rounded bg-gray-50 border-none outline-none resize-vertical text-sm text-slate-800 focus:ring-1 focus:ring-blue-100" rows="6" placeholder="Orientações selecionadas aparecerão aqui..." value={f.orientacoesNutricionista} onChange={e => upd('orientacoesNutricionista', e.target.value)}></textarea>
          </div>
        </div>

        {/* Botões Internos do Card Higiene */}
        <div className="flex justify-between items-center pt-4 border-t border-blue-100">
          <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors"><i className="ti ti-arrow-left mr-1"></i> Voltar</button>
          <button onClick={finalizarVisita} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-600/10 text-sm font-semibold transition-all"><i className="ti ti-check mr-1"></i> Gerar Resumo</button>
        </div>
      </div>
    );
  };

  // ==========================================
  // TELA DE RESUMO E IMPRESSÃO
  // ==========================================

  // Função de mapeamento para direcionar cada card à sua respectiva função
  const renderStep = (targetStep) => {
    if (targetStep === 0) return renderStepGeral();
    if (targetStep === 1) return renderStepInfra();
    if (targetStep === 2) return renderStepHigiene();
    return null;
  };
  
  const renderResumo = () => (
    <div className="animate-fade-in print-container bg-white rounded-2xl md:shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-mb-green p-6 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-white text-lg font-bold leading-tight">Relatório de Visita Nutricional</h2>
            
            {/* Badges de Sincronização Inteligentes */}
            {isSyncing && (
              <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse no-print">
                <i className="ti ti-loader rotate-anime"></i> Sincronizando...
              </span>
            )}
            {!isSyncing && syncStatus === "success" && (
              <span className="bg-emerald-500/35 text-white border border-emerald-300/30 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 no-print">
                <i className="ti ti-cloud-check text-xs"></i> Salvo na Nuvem
              </span>
            )}
            {!isSyncing && (syncStatus === "error" || syncStatus === null) && (
              <button 
                onClick={() => enviarParaSheets(form)} 
                className="bg-amber-500 text-white hover:bg-amber-600 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 transition cursor-pointer no-print"
                title="Tentar enviar para a planilha novamente"
              >
                <i className="ti ti-cloud-off text-xs animate-bounce"></i> Offline (Sincronizar)
              </button>
            )}
          </div>
          <p className="text-white/70 text-sm">{form.instituicao || "Instituição não informada"} • {form.data}</p>
        </div>
        <div className="flex gap-2 no-print">
          <button onClick={() => { navigator.clipboard.writeText(gerarTexto()); alert("Texto copiado (Apenas campos preenchidos)!"); }} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition"><i className="ti ti-copy"></i> Copiar</button>
          <button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition"><i className="ti ti-file-spreadsheet"></i> Planilha</button>
          <button onClick={() => window.print()} className="bg-white text-mb-green font-medium px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-100 transition"><i className="ti ti-file-text"></i> PDF</button>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-6 no-print"><i className="ti ti-info-circle"></i>Os relatórios de visita abaixo são armazenados por 7 dias no dispositivo utilizado para realizar o registro.</p>
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed print-only-text">{gerarTexto()}</pre>
        <div className="mt-8 pt-4 border-t flex justify-end no-print">
           <button onClick={() => setDone(false)} className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">Voltar e Editar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <Header />
      <Drawer />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeMenu === 'nova' && !done && (
              <div className="space-y-6">
                {/* Deck de 3 Cards Sobrepostos em Leque (Alinhados ao Topo para Altura Independente) */}
                <div className="flex flex-col lg:flex-row items-start w-full overflow-hidden lg:overflow-visible py-4">
                  {[0, 1, 2].map((i) => {
                    const isActive = step === i;
                    
                    // Definição de profundidade para evitar transparências misturadas
                    let zIndex = "z-10";
                    if (isActive) {
                      zIndex = "z-30";
                    } else {
                      if (step === 0) zIndex = i === 1 ? "z-20" : "z-10";
                      else if (step === 1) zIndex = i === 0 ? "z-20" : "z-10";
                      else if (step === 2) zIndex = i === 1 ? "z-20" : "z-10";
                    }

                    // Temas otimizados com sombras coloridas e sem bordas pretas feias
                    const cardThemes = [
                      {
                        active: "border-0 shadow-[0_20px_50px_rgba(249,115,22,0.18)] bg-white",
                        inactive: "border border-gray-200/50 bg-slate-100 opacity-100 grayscale scale-[0.98]",
                        header: "bg-orange-50 text-orange-700 border-b border-orange-100",
                        title: "1. Geral",
                        icon: "ti-info-circle text-orange-500"
                      },
                      {
                        active: "border-0 shadow-[0_20px_50px_rgba(26,107,58,0.18)] bg-white",
                        inactive: "border border-gray-200/50 bg-slate-100 opacity-100 grayscale scale-[0.98]",
                        header: "bg-mb-green-light text-mb-green border-b border-mb-green/10",
                        title: "2. Infraestrutura",
                        icon: "ti-building text-mb-green"
                      },
                      {
                        active: "border-0 shadow-[0_20px_50px_rgba(37,99,235,0.18)] bg-white",
                        inactive: "border border-gray-200/50 bg-slate-100 opacity-100 grayscale scale-[0.98]",
                        header: "bg-blue-50 text-blue-700 border-b border-blue-100",
                        title: "3. Higiene & Fim",
                        icon: "ti-sparkles text-blue-500"
                      }
                    ];
                    const theme = cardThemes[i];

                    return (
                      <div
                        key={i}
                        onClick={() => { if (!isActive) setStep(i); }}
                        className={`w-full lg:w-[70%] shrink-0 rounded-2xl transition-all duration-500 overflow-hidden cursor-pointer ${
                          i < 2 ? 'lg:-mr-[55%]' : ''
                        } ${isActive ? theme.active + ' ' + zIndex + ' translate-y-0' : theme.inactive + ' ' + zIndex + ' lg:hover:-translate-y-2'}`}
                      >
                        {/* Cabeçalho do Card */}
                        <div className={`p-4 flex items-center justify-between ${isActive ? theme.header : 'bg-gray-100 text-gray-500 border-b border-gray-200/50'}`}>
                          <div className="flex items-center gap-2 font-bold text-sm">
                            <i className={`ti ${theme.icon} text-lg`}></i>
                            <span>{theme.title}</span>
                          </div>
                          {!isActive && (
                            <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">Ativar</span>
                          )}
                        </div>
                        
                        {/* Conteúdo do Card - Alturas independentes, oculta no celular, fica super apagado no desktop de fundo */}
                        <div className={`p-5 transition-all duration-500 ${isActive ? 'block' : 'hidden lg:block lg:pointer-events-none lg:opacity-10'}`}>
                          {renderStep(i)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeMenu === 'nova' && done && renderResumo()}

            {activeMenu === 'historico' && (
              <div className="space-y-6 animate-fade-in">
                {/* Cabeçalho da Lista */}
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Histórico de Visitas</h2>
                    <p className="text-xs text-slate-500">Relatórios finalizados salvos localmente neste aparelho</p>
                  </div>
                  {history.length > 0 && (
                    <button 
                      onClick={() => { if(confirm("Deseja apagar TODO o histórico deste aparelho?")) setHistory([]); }}
                      className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Limpar Tudo
                    </button>
                  )}
                </div>

                {/* Exibição se estiver vazio ou se houver itens */}
                {history.length === 0 ? (
                  <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <i className="ti ti-history text-5xl mb-3 text-slate-300"></i>
                    <h3 className="text-lg font-medium text-slate-700">Nenhum relatório salvo</h3>
                    <p className="mt-1 text-xs text-slate-400">Os relatórios finalizados aparecerão guardados de forma segura aqui.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {history.map((h) => (
                      <div key={h.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-200 transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{h.data}</span>
                            {h.atendidoPor && <span className="text-[10px] text-slate-400">por {h.atendidoPor}</span>}
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base">{h.instituicao || "Instituição não informada"}</h4>
                          {h.quemRecebeu && (
                            <p className="text-xs text-slate-500 mt-1">
                              <i className="ti ti-user text-[11px] mr-1"></i> {h.quemRecebeu} ({h.cargo === 'Outro' ? h.cargoOutro : h.cargo})
                            </p>
                          )}
                        </div>
                        
                        {/* Botões específicos de Reabrir e Excluir */}
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => reabrirVisita(h)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <i className="ti ti-folder-open text-sm"></i> Reabrir
                          </button>
                          <button 
                            onClick={() => excluirVisita(h.id)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                            title="Excluir"
                          >
                            <i className="ti ti-trash text-sm"></i> <span className="sm:hidden">Excluir</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal S-PEN (Visual Caderno de Anotações Premium) */}
      {isSpenOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md spen-modal-open flex items-center justify-center p-4 md:p-10 no-print">
          <div className="bg-[#fcfbf9] w-full h-[85vh] max-w-5xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in border border-stone-200">
            
            {/* Header Elegante */}
            <div className="bg-white p-5 flex justify-between items-center border-b border-stone-100">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                   <i className="ti ti-ballpen text-xl"></i>
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 text-lg">Modo Escrita Manual</h3>
                   <p className="text-xs text-slate-400">Desenvolvido para S-Pen, Apple Pencil ou escrita por toque</p>
                 </div>
               </div>
               <button onClick={() => setIsSpenOpen(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 hover:text-stone-700 transition-colors cursor-pointer">
                 <i className="ti ti-x text-lg"></i>
               </button>
            </div>
            
            {/* Bloco de Escrita Realista com Margem de Caderno */}
            <div className="flex-1 w-full relative bg-[#fcfbf9]">
              <textarea 
                autoFocus
                className="w-full h-full p-6 pl-24 pr-8 text-lg font-serif outline-none resize-none bg-repeat text-slate-700 focus:ring-0" 
                style={{ 
                  backgroundImage: 'linear-gradient(90deg, transparent 79px, #fecaca 79px, #fecaca 81px, transparent 81px), linear-gradient(#f1f5f9 1px, transparent 1px)', 
                  backgroundSize: '100% 100%, 100% 40px', 
                  lineHeight: '40px',
                  paddingTop: '8px'
                }} 
                value={form.orientacoesNutricionista} 
                onChange={e => upd('orientacoesNutricionista', e.target.value)} 
                placeholder="Comece a escrever aqui com sua S-Pen..."
              ></textarea>
            </div>
            
            {/* Rodapé do Modal */}
            <div className="p-4 bg-white border-t border-stone-100 flex justify-end gap-3">
              <button onClick={() => setIsSpenOpen(false)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/15 transition-all text-sm font-semibold cursor-pointer">
                Concluir Escrita
              </button>
            </div>
          </div>
        </div>
      )}
    </div> // <-- Fecha a div principal do retorno do App
  ); // <-- Fecha o parênteses do return (
} // <-- Fecha a function App()

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
