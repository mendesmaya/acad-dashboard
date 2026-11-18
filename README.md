# Jornada Ciber (acad-dashboard)

Site pessoal (GitHub Pages) para acompanhar o **CET Técnico/a Especialista em Cibersegurança (ATEC)**:

- **Calendário** (`index.html`, a página inicial): cronograma, feriados e férias, horário semanal e trabalhos/testes. Vista de mês e de semana.
- **Notas** (`notas.html`): média final do curso (média simples das notas arredondadas), PRI à parte, notas provisórias, simulador, gráficos.

Os dados ficam neste repositório, em `data/`. O site lê-os de lá e, com o token ligado, grava-os de volta (cada alteração é um commit).

## Pôr o site online (uma vez)

1. No GitHub: **Settings → Pages**.
2. **Source: Deploy from a branch**, ramo `main`, pasta `/ (root)`. Guardar.
3. O endereço fica `https://<utilizador>.github.io/acad-dashboard/` (demora ~1 minuto na primeira vez).

## Gravar alterações a partir do site (uma vez por dispositivo)

Sem token o site só mostra os dados (as alterações ficam só nesse dispositivo). Para as guardar no repositório:

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access**: *Only select repositories* → `acad-dashboard`.
3. **Permissions → Repository permissions → Contents: Read and write**.
4. Copia o token e, no site, carrega em **Ligar ao GitHub** e cola-o. Fica **só no browser** desse dispositivo (nunca no repositório). Para o retirar, "Remover token" no mesmo diálogo.

## Ficheiros de dados

| Ficheiro | Quem escreve | Conteúdo |
|---|---|---|
| `data/notas.json` | o site | notas lançadas, provisórias e alvo, **cifradas** (AES-256; só abrem com a tua password) |
| `data/agenda.json` | o site | trabalhos e testes, edições à mão do horário |
| `data/horario.json` | Claude, a partir de capturas de ecrã | horário semanal real |
| `data/calendario.json` | gerado dos PDFs | feriados e férias 2026, aulas previstas por dia (cronograma V10), FPCT |

## Atualizar o horário da semana

- **À mão**: vista *Semana* → clicar numa sessão para editar, **+ Sessão** para acrescentar. Fica guardado em `agenda.json` e tem prioridade sobre o ficheiro. **Repor semana** volta à versão do ficheiro.
- **Por captura de ecrã**: enviar a captura a Claude e pedir "atualiza o horário"; Claude atualiza `data/horario.json` e envia a alteração. Se a semana já tinha edições à mão, o site avisa e oferece "Usar a do ficheiro".

Prioridade do que se vê: edição à mão > `horario.json` > previsão do cronograma (sessões "previstas" aparecem a tracejado).

## Notas importantes

- O repositório é **público**: o calendário, o horário e os trabalhos/testes são visíveis a quem tiver o link. As **notas** ficam cifradas (ver abaixo); as notas informativas que escreves nos trabalhos e testes são visíveis. Nomes de formadores **não** são guardados (campo opcional, vazio por omissão).
- As datas do cronograma e as férias de 2026 foram lidas dos PDFs da ATEC e verificadas contra imagens; são previstas e podem mudar numa nova revisão do cronograma.
- Feriados de 2027: calculados (nacionais e municipal de Matosinhos); confirmar quando houver calendário oficial.
- Os trabalhos e testes **não** alteram a média do curso (a nota oficial é a da pauta).

## Testes e desenvolvimento

Sem build. Para ver localmente:

```bash
python -m http.server 8000
```

Abrir `http://localhost:8000/test.html` (testes da lógica; deve mostrar **TESTES OK**) e `http://localhost:8000/`.
Abrir os ficheiros com duplo clique não funciona (o browser bloqueia a leitura dos JSON locais).

## Imagens

- `img/selo-gato.png`: selo postal escolhido pela dona do site.
- `img/stickers/`: autocolantes do calendário (feriados, férias, início/fim de módulo, trabalhos e testes). São **imagens de terceiros** encontradas no Pinterest e escolhidas pela dona do site; não pertencem a este projeto. Se algum autor pedir a remoção, basta apagar o ficheiro e atualizar `js/icones.js`.

## Notas protegidas por password

- A página **Notas** pede uma password. As notas (CET e PRI) são cifradas no browser (AES-256-GCM, chave derivada da password com PBKDF2, 250 000 iterações) antes de irem para `data/notas.json`, por isso no repositório e na cópia local só há texto cifrado.
- **Primeira vez:** define a password e importa o ficheiro de backup (botão no fundo da página). A password nunca sai do browser.
- **Se a esqueceres, as notas não se recuperam.** Guarda o ficheiro de backup exportado (esse **não** está cifrado: trata-o como privado).
- No fundo da página: **Mudar password** (recifra tudo) e **Bloquear** (fecha a sessão neste separador).
- Os módulos, créditos e datas (sem notas) estão em `js/dados-cet.js`; os testes (`test.html`) usam notas inventadas.
