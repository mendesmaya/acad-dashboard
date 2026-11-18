// Módulos do CET Cibersegurança (ATEC) e do PRI: nomes, créditos e datas.
// Nomes e créditos do CET: referencial CET_CIBER.pdf. As NOTAS não estão aqui: ficam no ficheiro cifrado data/notas.json.
(function () {
  function m(codigo, nome, creditos, tipo, nota, notaDecimal) {
    return {
      codigo: codigo,
      nome: nome,
      creditos: creditos,
      tipo: tipo,
      estado: nota === null ? "por-cursar" : "com-nota",
      nota: nota,
      notaDecimal: notaDecimal,
      provisoria: null,
    };
  }
  var O = "obrigatoria", P = "opcional";

  var pri = [
    m("7847", "Aplicações informáticas na ótica do utilizador", null, O, null, null),
    m("0749", "Arquitetura de computadores", null, O, null, null),
    m("1570", "Bases de dados de clientes, veículos e reparações", null, O, null, null),
    m("0382", "Gestão do tempo e organização do trabalho", null, O, null, null),
    m("0592", "Legislação laboral", null, O, null, null),
    m("5437", "Noções de economia de empresa", null, O, null, null),
    m("6051", "Programação - algoritmia", null, O, null, null),
    m("6052", "Programação - iniciação", null, O, null, null),
    m("0826", "Redes - instalação e configuração", null, O, null, null),
    m("6130", "Redes de computadores - configuração", null, O, null, null),
    m("6129", "Redes de computadores - instalação", null, O, null, null),
    m("6125", "Redes de comunicações - arquitetura protocolar", null, O, null, null),
    m("6193", "Serviços de rede Linux", null, O, null, null),
    m("6192", "Sistema operativo Linux", null, O, null, null),
    m("6190", "Sistema operativo Windows", null, O, null, null),
  ];

  var cet = [
    // Componente geral e científica
    m("UC01476", "Implementar a legislação relativa à cibersegurança", 2.25, O, null, null),
    m("UC01477", "Aplicar métodos estatísticos", 4.5, O, null, null),
    m("UC00598", "Efetuar operações e cálculos matemáticos aplicados a projetos da área de informática", 4.5, O, null, null),
    m("UC00599", "Interagir em inglês nas atividades do setor da informática", 4.5, O, null, null),
    // Componente tecnológica (obrigatórias)
    m("UC00245", "Desenvolver algoritmos", 2.25, O, null, null),
    m("UC00606", "Desenvolver programas em linguagem estruturada", 4.5, O, null, null),
    m("UC00602", "Modelar bases de dados relacionais", 2.25, O, null, null),
    m("UC00631", "Planear e instalar a infraestrutura de redes locais", 4.5, O, null, null),
    m("UC01478", "Configurar redes de computadores", 2.25, O, null, null),
    m("UC00634", "Instalar, configurar e manter sistema operativo de cliente", 2.25, O, null, null),
    m("UC00633", "Instalar e parametrizar sistemas operativos de servidor (plataforma proprietária)", 4.5, O, null, null),
    m("UC00635", "Configurar serviços de rede", 2.25, O, null, null),
    m("UC01479", "Implementar mecanismos de proteção contra ameaças cibernéticas", 2.25, O, null, null),
    m("UC01480", "Analisar evidências de ataques cibernéticos", 4.5, O, null, null),
    m("UC01481", "Desenvolver scripts aplicados à cibersegurança", 2.25, O, null, null),
    m("UC01482", "Programar scripts de normalização e filtragem de logs", 4.5, O, null, null),
    m("UC01483", "Detetar e analisar vulnerabilidades em soluções web", 4.5, O, null, null),
    m("UC01484", "Detetar e analisar vulnerabilidades em sistemas de rede", 4.5, O, null, null),
    m("UC01485", "Instalar e configurar ferramentas de análise e recolha de logs e evidências", 4.5, O, null, null),
    m("UC01486", "Gerir sistemas de deteção de intrusos (IDS)", 4.5, O, null, null),
    m("UC01487", "Simular cenários de cibersegurança e ciberdefesa (wargamming)", 4.5, O, null, null),
    m("UC00616", "Implementar as normas de segurança e saúde no trabalho no setor de Informática", 2.25, O, null, null),
    // Opcionais escolhidas
    m("UC00613", "Gerir políticas de segurança em sistemas informáticos", 2.25, P, null, null),
    m("UC01488", "Gerir a segurança da informação e criptografia", 2.25, P, null, null),
    m("UC01489", "Implementar procedimentos de recolha e análise forense digital", 4.5, P, null, null),
    m("UC01490", "Executar técnicas de hacking ético", 2.25, P, null, null),
    m("UC00627", "Instalar e configurar servidores Web", 2.25, P, null, null),
  ];

  // Datas previstas (início, fim) de cada módulo CET, lidas do cronograma V10 (revisão de 06/10/2026).
  var DATAS = {
    "UC00245": ["2026-03-31", "2026-04-22"],
    "UC00598": ["2026-04-06", "2026-06-29"],
    "UC00599": ["2026-07-14", "2026-11-19"],
    "UC00602": ["2026-07-09", "2026-09-17"],
    "UC00606": ["2026-04-22", "2026-07-02"],
    "UC00613": ["2027-01-18", "2027-03-08"],
    "UC00616": ["2026-11-04", "2026-12-02"],
    "UC00627": ["2026-03-30", "2026-05-12"],
    "UC00631": ["2026-06-29", "2026-11-16"],
    "UC00633": ["2026-09-07", "2027-01-20"],
    "UC00634": ["2026-07-03", "2026-09-07"],
    "UC00635": ["2026-05-22", "2026-06-29"],
    "UC01476": ["2026-12-02", "2027-02-03"],
    "UC01477": ["2027-02-25", "2027-05-13"],
    "UC01478": ["2026-11-16", "2027-01-11"],
    "UC01479": ["2026-12-22", "2027-02-10"],
    "UC01480": ["2026-10-01", "2026-12-22"],
    "UC01481": ["2026-07-15", "2026-09-09"],
    "UC01482": ["2026-09-09", "2026-11-24"],
    "UC01483": ["2026-11-24", "2027-02-12"],
    "UC01484": ["2027-02-12", "2027-04-02"],
    "UC01485": ["2026-05-12", "2026-09-23"],
    "UC01486": ["2027-03-31", "2027-05-12"],
    "UC01487": ["2027-04-02", "2027-05-17"],
    "UC01488": ["2026-04-02", "2026-05-19"],
    "UC01489": ["2027-02-10", "2027-03-31"],
    "UC01490": ["2026-05-19", "2026-07-01"],
  };
  cet.forEach(function (m) {
    var d = DATAS[m.codigo];
    m.inicio = d ? d[0] : null;
    m.fim = d ? d[1] : null;
  });
  pri.forEach(function (m) { m.inicio = null; m.fim = null; });

  // Descrição breve de cada UC (para o calendário).
  var CURTOS = {
    UC00245: "Algoritmos", UC00606: "Programação estruturada", UC00602: "Bases de dados", UC00631: "Redes locais",
    UC01478: "Configurar redes", UC00634: "SO de cliente", UC00633: "SO de servidor", UC00635: "Serviços de rede",
    UC01479: "Proteção contra ameaças", UC01480: "Evidências de ataques", UC01481: "Scripts de ciber", UC01482: "Scripts de logs",
    UC01483: "Vulnerabilidades web", UC01484: "Vulnerabilidades de rede", UC01485: "Ferramentas de logs", UC01486: "Deteção de intrusos",
    UC01487: "Wargaming", UC00616: "Segurança e saúde", UC01476: "Legislação", UC01477: "Estatística", UC00598: "Matemática",
    UC00599: "Inglês", UC00613: "Políticas de segurança", UC01488: "Criptografia", UC01489: "Análise forense", UC01490: "Hacking ético",
    UC00627: "Servidores Web",
  };
  cet.forEach(function (m) { m.curto = CURTOS[m.codigo] || m.nome; });
  pri.forEach(function (m) { m.curto = m.nome; });

  window.DADOS_INICIAIS = { pri: pri, cet: cet, fimCurso: "2027-08-26" };
})();
