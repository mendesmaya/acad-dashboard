// Cifra das notas no browser: AES-256-GCM, chave derivada da password com PBKDF2-SHA256.
// O envelope guardado no repositório só tem salt, IV e texto cifrado; sem a password é ilegível.
(function () {
  var IT_PADRAO = 250000;
  var enc = new TextEncoder(), dec = new TextDecoder();

  function paraB64(buf) {
    var b = new Uint8Array(buf), s = "";
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s);
  }
  function deB64(s) {
    var bin = atob(s), b = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
    return b;
  }

  // sessao = { chave: CryptoKey, salt: base64, it: iterações }
  function derivar(senha, saltB64, it) {
    var iter = it || IT_PADRAO;
    return crypto.subtle.importKey("raw", enc.encode(senha), "PBKDF2", false, ["deriveKey"]).then(function (base) {
      return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: deB64(saltB64), iterations: iter, hash: "SHA-256" },
        base, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
      );
    }).then(function (chave) { return { chave: chave, salt: saltB64, it: iter }; });
  }

  function novo(senha, it) {
    return derivar(senha, paraB64(crypto.getRandomValues(new Uint8Array(16))), it);
  }

  function cifrar(obj, sessao) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, sessao.chave, enc.encode(JSON.stringify(obj))).then(function (ct) {
      return { versao: 2, cifrado: true, salt: sessao.salt, it: sessao.it, iv: paraB64(iv), ct: paraB64(ct) };
    });
  }

  function decifrar(env, sessao) {
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: deB64(env.iv) }, sessao.chave, deB64(env.ct)).then(
      function (buf) { return JSON.parse(dec.decode(buf)); },
      function () { throw new Error("Password errada ou dados alterados."); }
    );
  }

  function ehEnvelope(o) {
    return !!o && typeof o === "object" && o.cifrado === true && o.versao === 2 &&
      typeof o.salt === "string" && typeof o.iv === "string" && typeof o.ct === "string" && typeof o.it === "number";
  }

  // Para manter a sessão aberta entre páginas (sessionStorage, só neste separador).
  function exportar(sessao) {
    return crypto.subtle.exportKey("raw", sessao.chave).then(function (raw) {
      return JSON.stringify({ k: paraB64(raw), salt: sessao.salt, it: sessao.it });
    });
  }
  function importar(texto) {
    var o = JSON.parse(texto);
    return crypto.subtle.importKey("raw", deB64(o.k), "AES-GCM", true, ["encrypt", "decrypt"]).then(function (chave) {
      return { chave: chave, salt: o.salt, it: o.it };
    });
  }

  window.Cofre = { derivar: derivar, novo: novo, cifrar: cifrar, decifrar: decifrar, ehEnvelope: ehEnvelope, exportar: exportar, importar: importar, IT_PADRAO: IT_PADRAO };
})();
