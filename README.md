# AlgoPro IDE

Vizualizues interaktiv për algoritme dhe struktura të dhënash, ndërtuar me Vanilla JavaScript ES Modules, SVG dhe D3.js v7. UI-ja është në shqip dhe shfaq hapat e ekzekutimit, kodin Java dhe kompleksitetin.

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

Testet mbulojnë generatorët e renditjes, Dijkstra/Kruskal, snapshot-in e grafit, validimin e ID-ve dhe rikuperimin e scheduler-it pas gabimit.

## BST Operations

Krijo pemën me vlera të ndara me presje, pastaj përdor një vlerë të vetme për `Fut`, `Fshi` ose `Kërko`. Fshirja vizualizon leaf, promovimin e një fëmije dhe successor-in in-order për nyjet me dy fëmijë. Butonat `In-order`, `Pre-order` dhe `Post-order` shfaqin rendin e vizitimit hap pas hapi.

## Sjellje e grafit

Grafi është i padrejtuar dhe peshat duhet të jenë pozitive. ID-të e nyjeve nisin me shkronjë dhe lejojnë vetëm shkronja, numra, `_` dhe `-`. Kur Dijkstra ekzekutohet, përdoret një snapshot i grafit dhe kontrollet e editimit bllokohen derisa ekzekutimi të mbarojë. Paneli “Distancat aktuale” shfaq distancat, burimin, paraardhësin dhe relaksimin më të fundit.
