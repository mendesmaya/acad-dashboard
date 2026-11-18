// Ícones de cibersegurança (SVG inline, traço) e o mapa módulo → ícone.
(function () {
  var D = {
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9l3 3-3 3M13 15h4"/>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M12 7.5v4M12 11.5L6.5 16M12 11.5l5.5 4.5"/>',
    router: '<rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 16.5h.01M11 16.5h.01M9 9.5a4.2 4.2 0 0 1 6 0M6.5 7a8 8 0 0 1 11 0"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    server: '<rect x="4" y="3" width="16" height="7" rx="2"/><rect x="4" y="14" width="16" height="7" rx="2"/><path d="M8 6.5h.01M8 17.5h.01M12 6.5h5M12 17.5h5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    magnifier: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
    log: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    bug: '<rect x="8" y="8" width="8" height="11" rx="4"/><path d="M12 8V6M9.5 4.5L10.5 6M14.5 4.5L13.5 6M8 12H4M16 12h4M8 16l-3 2M16 16l3 2M8 9L5 7M16 9l3-2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    helmet: '<path d="M4 16a8 8 0 0 1 16 0z"/><path d="M3 19h18M12 8V5"/>',
    scale: '<path d="M12 4v16M6 20h12M4 8h16M4 8l-2.5 6h5zM20 8l-2.5 6h5z"/>',
    chart: '<path d="M4 20V4M4 20h16"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    sigma: '<path d="M18 5H6l7 7-7 7h12"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
    doclock: '<path d="M6 3h8l4 4v5M6 3v18h6"/><rect x="13" y="15" width="8" height="6" rx="1.5"/><path d="M15 15v-1.5a2 2 0 0 1 4 0V15"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12h.01"/>',
    send: '<path d="M3 11l18-8-8 18-2-8z"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    skull: '<path d="M12 3a8 8 0 0 0-8 8c0 3 1.5 5 3.5 6V21h9v-4c2-1 3.5-3 3.5-6a8 8 0 0 0-8-8z"/><circle cx="9" cy="11.5" r="1.8"/><circle cx="15" cy="11.5" r="1.8"/><path d="M10.5 17v2M13.5 17v2"/>',
    fingerprint: '<path d="M6 10a6 6 0 0 1 12 0v3M9 20c1-2 1-4 1-7a2 2 0 0 1 4 0c0 3-.3 5-1.2 7M6 14c0 2-.3 4-1 6M18 13c0 3 0 5-1 8M12 10v2"/>',
  };

  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">';
  Object.keys(D).forEach(function (n) {
    sprite += '<symbol id="i-' + n + '" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + D[n] + "</g></symbol>";
  });
  sprite += "</svg>";

  var porModulo = {
    UC00245: "gear", UC00606: "code", UC00602: "db", UC00631: "network", UC01478: "router", UC00634: "monitor", UC00633: "server",
    UC00635: "send", UC01479: "shield", UC01480: "skull", UC01481: "terminal", UC01482: "log", UC01483: "bug", UC01484: "target",
    UC01485: "magnifier", UC01486: "eye", UC01487: "flag", UC00616: "helmet", UC01476: "scale", UC01477: "chart", UC00598: "sigma",
    UC00599: "chat", UC00613: "doclock", UC01488: "lock", UC01489: "fingerprint", UC01490: "key", UC00627: "globe",
  };
  var porTipo = { trabalho: "code", teste: "target", quiz: "chat", entrega: "send", outro: "pin" };
  var especiais = { feriado: "star", ferias: "sun", fpct: "briefcase" };

  function svg(nome, cls) {
    var n = D[nome] ? nome : "pin";
    return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-' + n + '"/></svg>';
  }

  // Autocolantes (imagens escolhidas pela dona do site). w = largura da imagem; cx, cy, s = quadrado recortado (px).
  // filtro (CSS) opcional: por omissão clareia um pouco para o fundo ficar branco puro; o dino (fundo cinzento) usa contraste forte.
  var imagens = {
    feriado: { src: "img/stickers/feriado-sapo.jpg", w: 640, cx: 187, cy: 157, s: 270 },
    ferias: { src: "img/stickers/ferias-viajante.jpg", w: 736, cx: 12, cy: 45, s: 715 },
    evento: { src: "img/stickers/trabalho-gato-lapis.jpg", w: 736, cx: 30, cy: 60, s: 680 },
    marcos: [
      { src: "img/stickers/marco-gato-portatil.jpg", w: 495, cx: 15, cy: 20, s: 470 },
      { src: "img/stickers/marco-consola.jpg", w: 736, cx: 8, cy: 5, s: 720 },
      { src: "img/stickers/marco-gato-sacola.jpg", w: 675, cx: 170, cy: 408, s: 420 },
      { src: "img/stickers/marco-dino-deserto.jpg", w: 407, cx: 80, cy: 90, s: 245, filtro: "contrast(4) brightness(1.05)" },
    ],
  };
  // Folga comum: o desenho ocupa cerca de 1/MARGEM (~82%) do recorte, com margem branca à volta.
  var MARGEM = 1.22;
  // Escolha "aleatória" mas estável: a mesma UC/tipo dá sempre a mesma imagem.
  function imagemMarco(uc, tipo) {
    var t = uc + ":" + tipo, h = 0;
    for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
    return imagens.marcos[h % imagens.marcos.length];
  }
  // HTML do autocolante: a imagem é recortada por CSS (largura/posição em % do quadrado visível).
  function figura(it) {
    var s2 = it.s * MARGEM, cx2 = it.cx - (s2 - it.s) / 2, cy2 = it.cy - (s2 - it.s) / 2;
    var st = "width:" + (it.w / s2 * 100).toFixed(2) + "%;left:" + (-cx2 / s2 * 100).toFixed(2) + "%;top:" + (-cy2 / s2 * 100).toFixed(2) + "%;filter:" + (it.filtro || "brightness(1.05)");
    return '<span class="pic"><img src="' + it.src + '" alt="" loading="lazy" style="' + st + '" onerror="this.parentNode.parentNode.style.display=\'none\'"></span>';
  }

  window.Icones = { sprite: sprite, porModulo: porModulo, porTipo: porTipo, especiais: especiais, svg: svg, imagens: imagens, imagemMarco: imagemMarco, figura: figura, margem: MARGEM };
})();
