# AlgoPro IDE

Vizualizues interaktiv për algoritme dhe struktura të dhënash, ndërtuar me Vanilla JavaScript ES Modules, SVG dhe D3.js v7. UI-ja është në shqip dhe shfaq hapat e ekzekutimit, kodin Java të sinkronizuar rresht-për-rresht, kompleksitetin (Time/Space), dhe një log tekstual të plotë të ekzekutimit. Funksionon plotësisht offline — zero varësi nga CDN, çdo librari (D3, Highlight.js, fontet) është e vendosur lokalisht te `vendor/`.

## Nisja

Nuk kërkon instalim varësish. Shërbeje direktoriumin me një server statik dhe hape `index.html`; module-t ES nuk punojnë në mënyrë të besueshme me `file://`.

```bash
npx serve .
```

## Kontrolli i cilësisë

Kërkohet Node.js 18+.

```bash
npm test
npm run check
```

Testet mbulojnë generatorët e renditjes (8 algoritme), Dijkstra/Kruskal, snapshot-in e grafit, validimin e ID-ve, rikuperimin e scheduler-it pas gabimit, dhe operacionet e BST-së (delete + traversal).

## Algoritmet dhe strukturat e mbuluara

- **Renditje**: Bubble, Insertion, Selection, Merge, Quick, Shell, Heap, Radix
- **Kërkim**: Linear, Binary
- **BST**: Insert, Search, Delete (successor in-order), Traversal (In/Pre/Post-order)
- **Grafe**: Dijkstra (me panel të dedikuar distancash), Kruskal (MST)
- **Struktura të dhënash**: Stack, Queue, Linked List, HashMap (me panel Kontekst Ekzekutimi: Key → hash → bucket)

Çdo hap i çdo algoritmi prodhon një mesazh tekstual, i grumbulluar në **Log Ekzekutimin** nën panelin e kodit Java — histori e plotë, e ngjyrosur sipas kuptimit të hapit (krahasim, ndërrim, gjetje, etj.).

## Kërkimi dhe navigimi

Fusha e kërkimit sipër listës së algoritmeve filtron në kohë reale (normalizim ë→e, ç→c), hap automatikisht kategoritë me rezultate, dhe rikthehet te gjendja origjinale kur pastrohet. Në ekranë të ngushtë (≤768px), sidebar-i bëhet drawer i hapshëm me buton hamburger te header-i.

## BST Operations

Krijo pemën me vlera të ndara me presje, pastaj përdor një vlerë të vetme për `Fut`, `Fshi` ose `Kërko`. Fshirja vizualizon leaf, promovimin e një fëmije dhe successor-in in-order për nyjet me dy fëmijë. Butonat `In-order`, `Pre-order` dhe `Post-order` shfaqin rendin e vizitimit hap pas hapi.

## Sjellje e grafit

Grafi është i padrejtuar dhe peshat duhet të jenë pozitive. ID-të e nyjeve nisin me shkronjë dhe lejojnë vetëm shkronja, numra, `_` dhe `-`. Kur Dijkstra ekzekutohet, përdoret një snapshot i grafit dhe kontrollet e editimit bllokohen derisa ekzekutimi të mbarojë. Paneli "Distancat aktuale" shfaq distancat, burimin, paraardhësin, dhe relakson me animacion pulsues në çdo përditësim.

## Vlera Custom

Për algoritmet e renditjes/kërkimit, butoni "Vlera Custom" hap një modal (jo më fushë inline) ku mund të shkruash vlerat e tua të ndara me presje, ose të gjenerosh një grup të rastësishëm.

## Arkitektura

Algoritmet janë ES module generator functions (`function*`) që bëjnë `yield` step-objekte tipizuara (`{ type, message, javaLine, ... }`). `scheduler.js` i konsumon me mbrojtje kundër run-eve të njëkohshme dhe trajtim gabimesh (try/catch/finally), `animator.js` i shpërndan sipas kategorisë te renderer-at përkatës dhe njëkohësisht i regjistron te Log Ekzekutimi. Paneli i kodit Java (`codePanel.js`) e ndërton kodin rresht-për-rresht si `<div>`-e (jo regex mbi HTML), me sinkronizim të saktë highlight-scroll.
## Gjuha: shqip dhe anglisht / Language: Albanian and English

Butoni **SQ | EN** te header ndërron gjithë faqen: ndërfaqen, mesazhet e hapave të animimit, materialin mësimor
(koncepti, përdorimet, karakteristikat, kuizi), pseudokodin dhe mesazhet e gabimit. Zgjedhja ruhet në `localStorage`
(`algopro-lang`) dhe mund të detyrohet me `?lang=en` ose `?lang=sq`. Gjuha e parazgjedhur është shqipja.

The **SQ | EN** switch in the header changes the whole page — UI, step messages, learning material, pseudocode and
error messages. The choice is stored in `localStorage` and can be forced with `?lang=en` / `?lang=sq`.

- `src/i18n/index.js` — `t(çelës, {parametra})`, `setLang`, `onLangChange`, përkthimi i `data-i18n*` te HTML-ja.
- `src/i18n/ui.sq.js` / `ui.en.js` — tekstet e ndërfaqes; `messages.sq.js` / `messages.en.js` — mesazhet e algoritmeve.
- `src/ui/learningData.en.js`, `learningMore.en.js`, `learningTraits.en.js`, `pseudocode.en.js` — materiali mësimor në anglisht.
- **Shtimi i një teksti:** vendos çelësin në **të dyja** gjuhët (`ui.sq.js` dhe `ui.en.js`). `npm test` dështon nëse një çelës
  mungon, nëse parametrat `{…}` nuk përputhen, ose nëse teksti anglisht përmban shkronja shqipe (ë, ç).

## Testimi në shfletues

`npm test` ekzekuton testet e njësisë. Për testet në shfletues (input-et, butonat, rastet kufi, gjuha), shërbe projektin
(`npx serve .`), hap faqen dhe ngarko `e2e/browser-harness.js` (shih komentin në krye të skedarit): `T.A()` … `T.G()` dhe
`T.L()` për gjuhën. Çdo seksion kthen `{ failed, notes, errs, alerts }`.
