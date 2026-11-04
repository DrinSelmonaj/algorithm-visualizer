// src/ui/learningMore.js
// Shpjegim i zgjeruar (rreth 90–150 fjalë) për çdo algoritëm/strukturë — shfaqet
// te butoni "Shiko më shumë…" në skedën Përmbledhje. Çdo hyrje është një listë
// paragrafësh; teksti është statik (pa HTML), ndaj futet me textContent.

const MORE = {
    bubble: [
        'Bubble Sort kalon nëpër listë disa herë. Në çdo kalim krahason dy elementë ngjitur dhe i ndërron nëse janë në rend të gabuar. Pas kalimit të parë, elementi më i madh del në fund, pas të dytit del i dyti më i madh, e kështu me radhë, ndaj çdo kalim ka nevojë për një krahasim më pak.',
        'Në versionin e optimizuar, nëse një kalim nuk bën asnjë ndërrim, lista është e renditur dhe algoritmi ndalon; kjo e bën O(n) për një listë që është tashmë e renditur. Në rastin mesatar dhe më të keq bën rreth n²/2 krahasime, prandaj është i ngadaltë për lista të mëdha. Është stabil, sepse elementët me vlerë të njëjtë ruajnë rendin. Përdoret kryesisht për mësim.',
    ],
    insertion: [
        'Insertion Sort punon si kur rendit letrat në dorë. Pjesa e majtë e listës është gjithmonë e renditur. Merr elementin tjetër, e krahason me ata në të majtë dhe i zhvendos djathtas ata që janë më të mëdhenj, derisa gjen vendin e duhur, dhe aty e fut.',
        'Kur lista është pothuajse e renditur, çdo element zhvendoset pak ose aspak, prandaj kostoja afrohet në O(n). Në rastin më të keq, p.sh. lista e kundërt, çdo element kalon gjithë pjesën e renditur dhe kostoja është O(n²). Është stabil dhe punon në vend, pa memorie shtesë. Për këtë arsye përdoret për lista të vogla, ose si hap i fundit në algoritme më të shpejta.',
    ],
    selection: [
        'Selection Sort ndan listën në dy pjesë: të renditurën në fillim dhe të parenditurën pas saj. Në çdo hap kërkon elementin më të vogël në pjesën e parenditur dhe e ndërron me elementin e parë të kësaj pjese. Kështu, pjesa e renditur rritet me një element çdo herë.',
        'Gjetja e minimumit kërkon gjithmonë të shikohen të gjithë elementët e mbetur, ndaj numri i krahasimeve është rreth n²/2 në çdo rast, edhe kur lista është e renditur. Por bën shumë pak ndërrime, maksimumi n−1. Kjo e bën të dobishëm kur shkrimi në memorie është i kushtueshëm. Nuk është stabil, sepse një ndërrim mund të kalojë një element mbi një tjetër me vlerë të njëjtë.',
    ],
    merge: [
        'Merge Sort përdor strategjinë "ndaj dhe sundo". E ndan listën në dy gjysma, e rendit secilën gjysmë me të njëjtën metodë, pastaj i bashkon dy gjysmat e renditura. Ndarja vazhdon derisa mbetet vetëm një element, i cili është vetvetiu i renditur.',
        'Bashkimi krahason dy elementët e parë të secilës gjysmë dhe merr më të voglin, duke ndërtuar listën e re hap pas hapi. Lista ndahet në rreth log n nivele dhe çdo nivel kërkon O(n) punë, prandaj koha është O(n log n) në çdo rast, edhe në më të keqen. Çmimi është memoria shtesë O(n) për bashkimin. Është stabil, ndaj është zgjedhje e mirë për të dhëna të mëdha dhe për renditje me disa kritere.',
    ],
    quick: [
        'Quick Sort zgjedh një element si pivot dhe e riorganizon listën: elementët më të vegjël shkojnë para pivotit, ata më të mëdhenj pas tij. Pas kësaj pivoti është në vendin e tij përfundimtar. Pastaj i njëjti proces përsëritet te pjesa e majtë dhe e djathtë.',
        'Nëse pivoti ndan listën afërsisht në mes, kemi rreth log n nivele dhe koha është O(n log n). Nëse pivoti është gjithmonë më i vogli ose më i madhi, p.sh. te një listë e renditur me pivot të parin, ndarjet janë shumë të pabalancuara dhe koha bëhet O(n²). Punon në vend dhe në praktikë është shumë i shpejtë, sepse përdor mirë memorien e shpejtë. Nuk është stabil. Zgjedhja e pivotit (mesi, rastësor) e zvogëlon rrezikun e rastit më të keq.',
    ],
    shell: [
        'Shell Sort është një përmirësim i Insertion Sort. Insertion Sort është i ngadaltë sepse lëviz elementët vetëm një pozicion në herë. Shell Sort fillon duke krahasuar elementë me largësi të madhe, të quajtur gap, dhe i rendit ata, pastaj e zvogëlon gap-in derisa bëhet 1.',
        'Me gap 1 algoritmi është Insertion Sort i zakonshëm, por lista tashmë është pothuajse e renditur, ndaj punon shpejt. Shpejtësia varet nga sekuenca e gap-eve: me sekuencën klasike n/2, n/4, … rasti më i keq është O(n²), kurse sekuenca më të mira japin rreth O(n log² n). Punon në vend, pa memorie shtesë, por nuk është stabil. Është një kompromis i thjeshtë për lista mesatare.',
    ],
    heap: [
        'Heap Sort përdor një strukturë të quajtur max-heap: një pemë binare ku çdo prind është më i madh se fëmijët e tij, e ruajtur brenda vetë listës. Së pari ndërton heap-in nga të dhënat. Pastaj përsërit: e ndërron rrënjën, që është më i madhi, me elementin e fundit, e shton te pjesa e renditur dhe e rregullon heap-in për elementët e mbetur.',
        'Rregullimi i heap-it kushton O(log n) dhe bëhet për çdo element, prandaj koha totale është O(n log n) në çdo rast, madje edhe më e keqja. Punon në vend me O(1) memorie shtesë, gjë që Merge Sort nuk e ka. Nuk është stabil dhe në praktikë është zakonisht më i ngadaltë se Quick Sort, sepse i qaset memories në pozicione të shpërndara.',
    ],
    radix: [
        'Radix Sort nuk krahason elementët me njëri-tjetrin. Rendit numrat sipas shifrave, duke filluar nga shifra më pak e rëndësishme (njëshet), pastaj dhjetëshet, qindëshet, e kështu me radhë. Për çdo shifër i vendos numrat në kova nga 0 deri në 9 dhe i lexon sipas rendit të kovave.',
        'Meqë çdo kalim ruan rendin e kalimit të mëparshëm (stabilitet), pas kalimit të fundit lista është e renditur. Nëse numrat kanë maksimumi k shifra, koha është O(n·k) dhe memoria shtesë O(n+k). Kur k është i vogël, kjo mund të jetë më shpejt se O(n log n). Por funksionon vetëm për numra të plotë ose të dhëna që kthehen në shifra, dhe kërkon kujdes me numra negativë.',
    ],
    linear: [
        'Linear Search është kërkimi më i thjeshtë. Fillon nga elementi i parë dhe i krahason një nga një me vlerën që kërkon. Kur gjen një përputhje, kthen pozicionin; nëse arrin në fund pa gjetur, kthen se vlera nuk ekziston.',
        'Nuk kërkon që lista të jetë e renditur, ndaj punon me çdo të dhënë. Në rastin më të mirë vlera është e para dhe mjafton një krahasim, O(1). Në rastin mesatar dhe më të keq kontrollohen shumë ose të gjithë elementët, O(n). Për lista të vogla ose për kërkime të rralla është zgjedhje e mirë, sepse nuk ka kosto përgatitjeje. Për lista të mëdha të renditura, Binary Search është shumë më i shpejtë.',
    ],
    binary: [
        'Binary Search kërkon vlerën në një listë të renditur duke e përgjysmuar zonën e kërkimit. Krahason vlerën me elementin e mesit. Nëse janë të barabartë, e ka gjetur. Nëse vlera është më e vogël, vazhdon vetëm në gjysmën e majtë; nëse është më e madhe, vetëm në të djathtën.',
        'Çdo krahasim heq gjysmën e elementëve të mbetur, prandaj për një milion elementë mjaftojnë rreth 20 krahasime. Kjo jep kohë O(log n) dhe memorie O(1). Kushti kyç është që lista të jetë e renditur; në një listë të parenditur rezultati është i gabuar. Kujdes në kod me mesin: low + (high − low) / 2 shmang tejmbushjen e numrave të plotë.',
    ],
    bst: [
        'Pema binare e kërkimit (BST) ruan vlerat në nyje, me një rregull: çdo vlerë në nën-pemën e majtë është më e vogël se nyja, çdo vlerë në të djathtën është më e madhe. Për të kërkuar ose futur një vlerë, fillon nga rrënja dhe shkon majtas ose djathtas sipas krahasimit, derisa gjen vendin.',
        'Fshirja ka tri raste: nyje pa fëmijë, hiqet drejtpërdrejt; me një fëmijë, fëmija zë vendin e saj; me dy fëmijë, zëvendësohet me pasardhësin në renditje (më të voglin në nën-pemën e djathtë). Nëse pema është e balancuar, kërkimi, futja dhe fshirja janë O(log n). Nëse futen vlera të renditura, pema bëhet si një listë dhe kostoja shkon në O(n). Traversimi in-order jep vlerat të renditura.',
    ],
    dijkstra: [
        'Dijkstra gjen rrugën më të shkurtër nga një nyje fillestare drejt të gjitha nyjeve të tjera në një graf me pesha jo-negative. Fillon me distancë 0 për nyjen fillestare dhe pafundësi për të tjerat. Në çdo hap zgjedh nyjen e pavizituar me distancën më të vogël dhe e shënon si të vizituar.',
        'Pastaj kontrollon çdo fqinj të saj: nëse rruga përmes kësaj nyjeje është më e shkurtër se distanca e njohur, e përditëson distancën dhe ruan paraardhësin. Ky quhet relaksim. Me një varg të thjeshtë për distancat, koha është O(V²); me radhë prioriteti bëhet O((V+E) log V). Është algoritëm lakmitar dhe punon saktë vetëm kur nuk ka pesha negative. Rrugën e fundit e rindërton duke ndjekur paraardhësit mbrapsht.',
    ],
    kruskal: [
        'Kruskal ndërton pemën shtrirëse minimale (MST): një nëngrup lidhjesh që lidh të gjitha nyjet e grafit me peshën totale më të vogël të mundshme dhe pa cikël. Fillon duke renditur të gjitha lidhjet sipas peshës, nga më e vogla.',
        'Pastaj i shqyrton një nga një. Nëse një lidhje bashkon dy nyje që ende nuk janë të lidhura, e pranon; nëse do të krijonte cikël, e refuzon. Për ta zbuluar shpejt përdor strukturën Union-Find, që ruan cilat nyje bëjnë pjesë në të njëjtin komponent. Koha është O(E log E), kryesisht për renditjen. Algoritmi mbaron kur pema ka V−1 lidhje. Përdoret p.sh. për të planifikuar rrjete me kosto minimale.',
    ],
    stack: [
        'Stack, ose stiva, është strukturë LIFO: "i fundit që hyn, i pari që del". Mendoje si një grumbull pjatash: shton dhe heq vetëm nga maja. Operacionet kryesore janë push (shton në majë), pop (heq dhe kthen majën), peek (shikon majën pa e hequr) dhe isEmpty.',
        'Të gjitha këto kushtojnë O(1), sepse prekin vetëm majën. Kujdes me pop ose peek mbi një stivë bosh: ky është gabimi i zakonshëm "stack underflow". Përdoret te call stack-u i programeve, te butoni "Undo", te kontrolli i kllapave të balancuara, te vlerësimi i shprehjeve dhe te kërkimi në thellësi (DFS). Mund të ndërtohet me varg ose me listë të lidhur.',
    ],
    queue: [
        'Queue, ose radha, është strukturë FIFO: "i pari që hyn, i pari që del", si radha para një arke. Elementi i ri futet në fund me enqueue, ndërsa elementi nga fillimi hiqet me dequeue. Peek tregon elementin e parë pa e hequr.',
        'Me një implementim të mirë, të tre operacionet kushtojnë O(1). Nëse e ndërton me varg dhe e heq elementin nga fillimi, çdo dequeue zhvendos të gjithë elementët dhe bëhet O(n); prandaj përdoren dy tregues (fillim dhe fund) ose një listë e lidhur. Radha përdoret për planifikimin e detyrave në sistemin operativ, për buferët e rrjetit, për printimin dhe për kërkimin në gjerësi (BFS) në grafe.',
    ],
    linkedlist: [
        'Lista e lidhur ruan elementët në nyje të ndara, ku çdo nyje mban vlerën dhe një referencë te nyja tjetër. Nuk kërkon memorie të vazhdueshme si vargu. Nyja e parë quhet head, dhe e fundit tregon te null.',
        'Futja në fillim kërkon vetëm ndryshimin e dy referencave, ndaj është O(1). Kërkimi, ose futja në mes, kërkon të ecësh nga head deri te vendi, prandaj është O(n); nuk mund të shkosh drejtpërdrejt te pozicioni i-të siç bën vargu. Gjatë fshirjes duhet ruajtur nyja paraardhëse, që lidhja të mos humbasë. Përdoret kur futjet dhe fshirjet janë të shpeshta dhe numri i elementëve ndryshon shumë.',
    ],
    hashmap: [
        'HashMap ruan çifte çelës–vlerë dhe i gjen shumë shpejt. Një funksion hash e kthen çelësin në një numër, dhe ai numër (me mbetje pas pjesëtimit me numrin e kovave) tregon në cilën kovë (bucket) ruhet çifti. Kështu get, put dhe remove nuk kërkojnë nëpër gjithë të dhënat.',
        'Dy çelësa të ndryshëm mund të bien në të njëjtën kovë, dhe kjo quhet përplasje (collision). Këtu çdo kovë mban një zinxhir elementësh; kërkimi në kovë kalon nëpër zinxhir. Me funksion hash të mirë dhe zinxhirë të shkurtër, koha mesatare është O(1). Nëse shumë çelësa përplasen në një kovë, bie në O(n). Përdoret për cache, numërim frekuencash dhe indekse.',
    ],
};


// Përdorime konkrete në jetën reale — 3 shembuj të shkurtër për secilin element,
// të shfaqur gjithmonë (jo pas "Shiko më shumë…") në skedën Përmbledhje.
const REAL = {
    bubble: [
        'Përdoret kryesisht në mësim, për të kuptuar krahasimin dhe ndërrimin; në prodhim zëvendësohet nga algoritme më të shpejta.',
        'Ka kuptim në sisteme shumë të vogla ku kodi duhet të jetë minimal dhe lista ka vetëm disa elementë.',
        'Zbulon shpejt nëse një listë është tashmë e renditur: një kalim pa asnjë ndërrim e provon këtë.',
    ],
    insertion: [
        'Biblioteka standarde (p.sh. Timsort në Python dhe Java) e përdorin për pjesët e vogla të listës para se t\'i bashkojnë.',
        'Mirë kur të dhënat vijnë një nga një dhe lista duhet të mbahet gjithmonë e renditur, si tabela e rezultateve live.',
        'Njësoj si kur rendit letrat në dorë gjatë një loje: fut çdo letër të re në vendin e saj.',
    ],
    selection: [
        'Kur shkrimi është i kushtueshëm, p.sh. në memorie flash me jetëgjatësi të kufizuar shkrimesh, sepse bën shumë pak ndërrime.',
        'Për të zgjedhur vetëm k elementët më të vegjël ose më të mëdhenj kur k është shumë i vogël, p.sh. 3 produktet më të lira.',
        'Në mësim, për të treguar idenë e ndarjes në pjesë të renditur dhe të parenditur.',
    ],
    merge: [
        'Renditja e skedarëve shumë të mëdhenj që nuk hyjnë në RAM, kur bazat e të dhënave rendisin copa dhe i bashkojnë (external sorting).',
        'Timsort, algoritmi i renditjes në Python dhe në Java për objekte, bazohet te bashkimi i pjesëve të renditura.',
        'Renditja stabile e tabelave sipas disa kolonave, p.sh. së pari sipas qytetit dhe pastaj sipas emrit, pa e prishur rendin e parë.',
    ],
    quick: [
        'Bërthama e shumë renditjeve në C dhe C++ (introsort te std::sort) është Quick Sort me mbrojtje kundër rastit më të keq.',
        'Renditja e listave në memorie në aplikacione, si produkte, kontakte ose rezultate kërkimi, ku shpejtësia mesatare ka rëndësi.',
        'Varianti Quickselect gjen medianën ose elementin k-të pa renditur gjithë listën, e dobishme në statistika.',
    ],
    shell: [
        'Disa biblioteka të vogla C, p.sh. uClibc, e kanë përdorur në qsort, sepse është i shkurtër dhe nuk kërkon rekursion.',
        'Në sisteme të ngulitura me pak memorie, ku kërkohet një renditje më e shpejtë se Insertion pa memorie shtesë.',
        'Si hap i parë për të sjellë të dhënat pothuajse në rend para një kalimi përfundimtar me Insertion Sort.',
    ],
    heap: [
        'Kerneli i Linux-it e përdor te funksioni sort(), sepse ka garanci O(n log n) dhe nuk kërkon memorie shtesë.',
        'Introsort kalon te Heap Sort kur Quick Sort fillon të degjenerojë, për ta mbajtur kohën nën kontroll.',
        'Heap-i vetë është radhë prioriteti: planifikuesit e detyrave, Dijkstra dhe simulimet e ngjarjeve e përdorin.',
    ],
    radix: [
        'Renditja e numrave me gjatësi fikse: kode postare, numra telefoni, ID-të ose adresat IP të kthyera në numra.',
        'Renditja e shumë numrave të plotë në GPU dhe në përpunim të të dhënave të mëdha, ku e shpejtë është përparësi.',
        'Renditja e datave dhe kohëve (viti, muaji, dita) si shifra, duke filluar nga pjesa më pak e rëndësishme.',
    ],
    linear: [
        'Kërkimi i një kontakti ose emri në një listë të shkurtër, p.sh. te Array.indexOf në JavaScript ose "in" në Python.',
        'Leximi i një skedari log rresht pas rreshti për të gjetur një gabim, siç bën grep.',
        'Kur të dhënat s\'janë të renditura dhe kërkohet vetëm një herë, kjo kushton më pak se renditja e tyre.',
    ],
    binary: [
        'Kërkimi në një fjalor ose libër telefoni: hap në mes dhe vendos nëse vazhdon majtas apo djathtas.',
        'git bisect gjen commit-in që prishi kodin duke përgjysmuar historikun, shpesh në vetëm disa hapa.',
        'Indekset e bazave të të dhënave dhe funksione si Collections.binarySearch (Java) apo bisect (Python).',
    ],
    bst: [
        'TreeMap dhe TreeSet në Java, dhe std::map në C++, janë pemë të kërkimit të vetë-balancuara që ruajnë çelësat të renditur.',
        'Indekset e bazave të të dhënave përdorin pemë të ngjashme (B-tree) për të gjetur rreshta pa lexuar gjithë tabelën.',
        'Kërkimi me intervale, p.sh. "të gjitha porositë ndërmjet dy datave", sepse vlerat janë të renditura.',
    ],
    dijkstra: [
        'Navigimi GPS dhe hartat: rruga më e shkurtër ose më e shpejtë mes dy vendeve (me variante si A*).',
        'Rrugëzimi në rrjete kompjuterike: protokolli OSPF e përdor për të zgjedhur rrugën më të mirë të paketave.',
        'Lojërat dhe robotët që gjejnë rrugën më të lirë nëpër një hartë me kosto të ndryshme për çdo hap.',
    ],
    kruskal: [
        'Planifikimi i rrjeteve me kosto minimale: kabllo fibre, tubacione ose rrjet elektrik që lidh qytete.',
        'Clustering në mësim të makinës: pema minimale shtrirëse ndihmon të gruposh pika të ngjashme.',
        'Përafrimi i problemeve të vështira, si problemi i tregtarit udhëtar, kur nuk duhet zgjidhja e përkryer.',
    ],
    stack: [
        'Butonat Undo dhe Redo në editorë: çdo veprim futet në stivë dhe nxirret në rend të kundërt.',
        'Butoni "Back" i shfletuesit: faqet e vizituara ruhen në stivë, dhe kthimi nxjerr atë të fundit.',
        'Call stack-u i programeve dhe kontrolli i kllapave të balancuara te kompilatorët dhe editorët e kodit.',
    ],
    queue: [
        'Radha e printimit: dokumentet printohen sipas rendit të dërgimit, i pari që dërgohet është i pari që printohet.',
        'Sistemet e mesazheve dhe kërkesave (si RabbitMQ ose Kafka) përpunojnë detyrat sipas radhës së ardhjes.',
        'Kërkimi në gjerësi (BFS) në grafe, p.sh. gjetja e shokëve të shokëve në një rrjet social.',
    ],
    linkedlist: [
        'Playlist-a e muzikës me "Next" dhe "Previous", ku çdo këngë tregon te tjetra.',
        'Menaxhimi i memories në sisteme operative, ku blloqet e lira lidhen si një listë.',
        'Bazë e strukturave të tjera: stiva, radha dhe zinxhirët e përplasjeve në HashMap ndërtohen shpesh me lista të lidhura.',
    ],
    hashmap: [
        'Cache-t si Redis dhe memcached ruajnë çifte çelës–vlerë për t\'i gjetur menjëherë, pa llogaritur përsëri.',
        'Objektet e JSON, fjalorët e Python dhe Map-et e JavaScript janë tabela hash nën kapuç.',
        'Numërimi i frekuencës së fjalëve në një tekst, ose gjetja e kopjeve në një listë, me një kalim të vetëm.',
    ],
};

/** Numëron fjalët e shembujve të jetës reale për një çelës (përdoret nga testet). */
function countRealWords(key) {
    return (REAL[key] || []).join(' ').split(/\s+/).filter(Boolean).length;
}


// Përdorimi teknik — 50–80 fjalë për secilin; bashkë me shembujt e jetës reale (REAL)
// formojnë seksionin "Përdorimet" (gjithsej 50–200 fjalë).
const TECH = {
    bubble: 'Në nivel teknik, Bubble Sort ka kuptim kur lista është shumë e vogël, kodi duhet të jetë minimal dhe nuk lejohet memorie shtesë, ose kur duhet zbuluar shpejt nëse të dhënat janë tashmë të renditura (një kalim pa ndërrime). Është stabil dhe in-place. Për lista të mëdha kostoja O(n²) e bën të papërshtatshëm, prandaj në prodhim zëvendësohet nga Merge, Quick ose Timsort; vlera e tij kryesore është pedagogjike.',
    insertion: 'Teknikisht, Insertion Sort është zgjedhja më e mirë për lista të vogla (rreth 10–50 elemente) dhe për të dhëna pothuajse të renditura, ku kostoja afrohet në O(n). Algoritmet hibride, si Timsort dhe introsort, e përdorin për pjesët e vogla. Është online: mund të renditë të dhëna ndërsa vijnë, pa pritur listën e plotë. Është stabil dhe in-place, me konstante të vogla, ndaj shpesh i mund algoritmet O(n log n) në lista të shkurtra.',
    selection: 'Selection Sort përdoret kur numri i shkrimeve në memorie ka rëndësi më shumë se numri i krahasimeve: bën maksimumi n−1 ndërrime, kundrejt O(n²) te Bubble Sort. Kjo ka kuptim në memorie flash ose EEPROM me cikle të kufizuara shkrimi. Është e dobishme edhe për të nxjerrë vetëm k elementët më të vegjël pa renditur gjithçka. Kostoja është O(n²) krahasime në çdo rast dhe nuk është stabil.',
    merge: 'Merge Sort përdoret kur kërkohet kohë e garantuar O(n log n) dhe stabilitet: renditje sipas disa kriteresh, ose të dhëna që nuk hyjnë në RAM (renditje e jashtme: renditen copa, pastaj bashkohen). Është i përshtatshëm për lista të lidhura, ku bashkimi nuk kërkon memorie shtesë, dhe për paralelizim, sepse gjysmat renditen të pavarura. Për vargje kërkon O(n) memorie shtesë.',
    quick: 'Quick Sort është zgjedhja e zakonshme për renditje në memorie, sepse ka konstante të vogla dhe e përdor mirë cache-n e procesorit. Bibliotekat standarde e kombinojnë me algoritme të tjera: introsort kalon te Heap Sort kur thellësia e rekursionit rritet shumë. Kërkon kujdes me pivotin: pivot i rastësishëm ose "mediani i tre" shmang rastin O(n²). Punon në vend, por nuk është stabil.',
    shell: 'Shell Sort përdoret kur duhet një renditje më e shpejtë se O(n²), por e thjeshtë, pa rekursion dhe pa memorie shtesë: sisteme të ngulitura dhe biblioteka të vogla C. Performanca varet nga sekuenca e gap-eve, ndaj zgjedhja e saj është pjesa teknike kryesore. Nuk është stabil dhe analiza e saktë e kohës është e vështirë, prandaj Quick ose Heap Sort e zëvendësojnë kur ka vend për to.',
    heap: 'Heap Sort përdoret kur nevojitet garanci O(n log n) në çdo rast me memorie shtesë O(1), p.sh. në kernel dhe në sisteme me kohë reale ku rasti më i keq ka rëndësi. Struktura e heap-it përdoret edhe përtej renditjes: radhë prioriteti, gjetja e k-elementëve më të mëdhenj, planifikimi i detyrave. Nuk është stabil dhe qasja e shpërndarë në memorie e bën zakonisht më të ngadaltë se Quick Sort.',
    radix: 'Radix Sort përdoret kur çelësat janë numra të plotë ose vargje me gjatësi të kufizuar dhe n është shumë i madh: koha O(n·k) mund ta mposhtë O(n log n). Kërkon një renditje stabile për çdo shifër (zakonisht Counting Sort), memorie shtesë O(n + b) dhe kujdes me numrat negativë dhe me bazën b. Nuk përshtatet për çelësa që nuk kthehen lehtë në shifra.',
    linear: 'Linear Search përdoret kur të dhënat nuk janë të renditura dhe nuk ia vlen kostoja e renditjes ose e ndërtimit të një indeksi: lista të shkurtra, kërkime të rralla, ose burime që lexohen vetëm në sekuencë, si skedarët dhe stream-et. Është O(n), por ka kosto të ulët për hap dhe punon me çdo strukturë që mund të kalohet, edhe me listë të lidhur.',
    binary: 'Binary Search përdoret kur të dhënat janë të renditura dhe kërkohet shpesh: kërkimi është O(log n), pasi renditja bëhet një herë. Zbatohet edhe si "kërkim mbi përgjigjen", p.sh. gjetja e vlerës minimale që plotëson një kusht monoton. Gabimet e zakonshme janë tejmbushja te (low+high)/2, kufijtë low/high dhe kushti i ciklit. Punon mirë me vargje, jo me lista të lidhura.',
    bst: 'BST përdoret kur duhet mbajtur një bashkësi e renditur dinamike me kërkim, futje dhe fshirje në O(log n) dhe me kalim në renditje (in-order). Pemët e thjeshta mund të degjenerojnë në O(n), prandaj në praktikë përdoren variante të vetë-balancuara (AVL, red-black), si te TreeMap ose std::map. Mbështet edhe pyetje me intervale, si dhe gjetjen e pasardhësit dhe paraardhësit.',
    dijkstra: 'Dijkstra përdoret për rrugën më të shkurtër nga një burim kur pesha janë jo-negative: rrugëzim në rrjete, harta, planifikim. Me radhë prioriteti (heap) kushton O((V+E) log V), me varg O(V²), që është më mirë për grafe të dendur. Dështon me pesha negative (atje përdoret Bellman-Ford). Për një objektiv të vetëm, A* e përshpejton duke shtuar një heuristikë.',
    kruskal: 'Kruskal përdoret për të ndërtuar pemën minimale shtrirëse: lidhje me kosto totale minimale që lidhin të gjitha nyjet pa cikël. Teknikisht kërkon renditjen e lidhjeve (O(E log E)) dhe Union-Find për zbulimin e cikleve. Është i përshtatshëm për grafe të rrallë; për grafe të dendur, algoritmi i Prim-it shpesh është më i mirë. Në graf të palidhur jep një pyll minimal.',
    stack: 'Stack përdoret kur duhet kthyer mbrapsht në rend të kundërt: call stack-u i funksioneve, rekursioni, DFS, analizimi i shprehjeve dhe kllapave, historia e Undo. Të gjitha operacionet janë O(1). Në implementim me varg fiks ka rrezik overflow, ndërsa pop mbi stivë bosh është gabimi underflow. Rekursioni shumë i thellë mund të shkaktojë stack overflow të vërtetë.',
    queue: 'Queue përdoret kur përpunimi duhet të ndjekë rendin e ardhjes: planifikimi i detyrave, buferët e rrjetit, sistemet e mesazheve dhe BFS. Operacionet janë O(1) me buffer qarkor ose listë të lidhur. Variantet: deque (dy skaje), radhë prioriteti (jo FIFO) dhe radhë të kufizuara, që krijojnë presion mbrapsht kur prodhuesi është më i shpejtë se konsumatori.',
    linkedlist: 'Lista e lidhur përdoret kur futjet dhe fshirjet në pozicion të njohur janë të shpeshta dhe numri i elementëve ndryshon: O(1) në head ose pas një nyjeje të dhënë. Mangësia: nuk ka qasje direkte (O(n)) dhe qasja në memorie është më e dobët për cache se te vargu. Përdoret si bazë për stiva, radhë, zinxhirë përplasjesh dhe lista të lira të alokuesve të memories.',
    hashmap: 'HashMap përdoret kur nevojitet qasje mesatare O(1) me çelës: cache, indekse, numërim frekuencash, heqje dublikatash. Performanca varet nga funksioni hash, nga përplasjet dhe nga load factor-i; kur kalon një prag (p.sh. 0.75), tabela zgjerohet dhe rihashohet. Nuk ruan rend të renditur dhe në rastin më të keq, me shumë përplasje, kalon në O(n).',
};

/** Numëron fjalët e seksionit "Përdorimet" (teknik + jeta reale) për një çelës. */
function countUsesWords(key) {
    return [TECH[key] || '', ...(REAL[key] || [])].join(' ').split(/\s+/).filter(Boolean).length;
}

/** Numëron fjalët e shpjegimit të zgjeruar për një çelës (përdoret nga testet). */
function countMoreWords(key) {
    return (MORE[key] || []).join(' ').split(/\s+/).filter(Boolean).length;
}

export { MORE, REAL, TECH, countMoreWords, countRealWords, countUsesWords };
