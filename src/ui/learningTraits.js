// src/ui/learningTraits.js
// Shpjegim për çdo "karakteristikë" që shfaqet te skeda Përmbledhje (Stable,
// In-place, Greedy, …). Shfaqet kur përdoruesi klikon mbi karakteristikën.

const TRAIT_INFO = {
    'Stable': 'Një renditje është stabile kur dy elementë me vlerë të njëjtë e ruajnë rendin e tyre fillestar. Shembull: nëse studentët ishin të renditur sipas emrit dhe i rendit sipas notës, ata me të njëjtën notë mbeten sipas emrit. Kjo ka rëndësi kur rendit sipas disa kriteresh njëri pas tjetrit.',
    'In-place': 'Algoritmi punon brenda vetë listës dhe përdor vetëm një sasi shumë të vogël memorie shtesë (zakonisht O(1) ose O(log n)). Nuk krijon një kopje të plotë të të dhënave, ndaj kursen memorie. Për krahasim, Merge Sort kërkon O(n) memorie shtesë.',
    'Adaptive': 'Algoritmi shfrytëzon rendin që të dhënat e kanë tashmë: sa më afër të renditura të jenë, aq më pak punë bën. Insertion Sort është O(n) në një listë të renditur dhe O(n²) në një të kundërt.',
    'Divide & conquer': 'Ndan problemin në pjesë më të vogla, zgjidh secilën pjesë (shpesh rekursivisht) dhe i bashkon rezultatet. Merge Sort e ndan listën në gjysma, Quick Sort e ndan rreth një pivoti. Kjo shpesh sjell kohë O(n log n).',
    'Non-comparative': 'Nuk e vendos rendin duke krahasuar elementët me njëri-tjetrin, por duke përdorur vetë vlerat, p.sh. shifrat e numrit. Prandaj mund ta kalojë kufirin O(n log n) të renditjeve me krahasim, por punon vetëm për lloje të caktuara të dhënash, si numra të plotë.',
    'Punon pa renditje': 'Linear Search nuk kërkon që lista të jetë e renditur; mjafton ta kalosh nga fillimi. Çmimi është që në rastin më të keq kontrollon çdo element, pra O(n).',
    'Kërkon varg të renditur': 'Binary Search mund ta përgjysmojë zonën vetëm sepse elementët janë të renditur: nëse vlera është më e vogël se mesi, ajo nuk mund të jetë djathtas. Në një listë të parenditur, rezultati është i gabuar.',
    'Strukturë hierarkike': 'Të dhënat organizohen si pemë: një rrënjë dhe nyje fëmijë, pa cikle. Çdo nyje ka një prind (përveç rrënjës). Kështu pasqyrohen lidhje si dosjet në kompjuter ose pema gjenealogjike.',
    'Greedy': 'Algoritëm lakmitar: në çdo hap zgjedh opsionin që duket më i mirë tani dhe nuk e rishikon më vonë. Dijkstra zgjedh nyjen me distancën më të vogël, Kruskal lidhjen më të lirë. Funksionon vetëm kur kjo strategji garanton zgjidhjen optimale.',
    'Pa pesha negative': 'Dijkstra supozon se asnjë lidhje nuk ka peshë negative. Atëherë, kur një nyje finalizohet, nuk mund të gjendet rrugë më e shkurtër përmes nyjeve të tjera. Me pesha negative përdoret algoritmi Bellman-Ford.',
    'Union-Find': 'Strukturë që ruan grupe nyjesh të ndara dhe përgjigjet shpejt: "a janë këto dy nyje në të njëjtin grup?" dhe "bashkoji dy grupet". Kruskal e përdor për të zbuluar nëse një lidhje e re do të krijonte cikël.',
    'LIFO': 'Last In, First Out: elementi i fundit që hyn është i pari që del, si grumbulli i pjatave. Shton dhe heq vetëm nga maja.',
    'FIFO': 'First In, First Out: elementi i parë që hyn është i pari që del, si radha te arka. Shton në fund dhe heq nga fillimi.',
    'Memorie dinamike': 'Elementet ndahen gjatë ekzekutimit dhe nuk kërkojnë një bllok të vazhdueshëm memorieje. Lista rritet ose zvogëlohet pa kopjuar gjithçka, por çdo nyje mban edhe një referencë shtesë.',
    'Key-value': 'Të dhënat ruhen si çifte: një çelës unik dhe vlera e tij. Çelësi përdoret për ta gjetur vlerën shpejt, si emri në një libër telefoni.',
    'Collision handling': 'Përplasje ndodh kur dy çelësa të ndryshëm japin të njëjtën kovë. Dy mënyra të zakonshme: zinxhirët (çdo kovë mban një listë, siç tregon ky vizualizim) ose adresimi i hapur (kërkon kovën tjetër të lirë).',
};

function getTraitInfo(trait) {
    return TRAIT_INFO[trait] || '';
}

export { TRAIT_INFO, getTraitInfo };
