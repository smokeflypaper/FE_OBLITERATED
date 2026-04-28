# Roadmapa webu: Kritika FE modelu pro ceske publikum

## Stav

Auditni body jsou zaznamenane v `docs/problem-register-cs.md`. Tento soubor popisuje, jak z nich udelat web.

## Primarni cil

Vytvorit ceskou interaktivni stranku, ktera srozumitelne ukaze, proc zkoumany Conceptual Flat Earth Model neni funkcni dukaz ploche Zeme.

## Cile pro uzivatele

- Dite pochopi hlavni pointu: "model si bere hotove vysledky a kresli je na plochy obrazek".
- Dospely technicky uzivatel najde konkretni dukazy v kodu.
- Skepticky ctenar muze rozkliknout kazdy problem a overit si argument.

## Navrzene typy stranek

### 1. Hlavni stranka

Obsah:

- kratke vysvetleni, co bylo auditovano,
- hlavni zavery,
- severity mapa problemu,
- interaktivni diagram datoveho toku.

Hlavni vizual:

`DE405 / Meeus / VSOP87 -> RA/Dec -> globe lokalni obloha -> FE disk`

### 2. Stranka "Kde se berou data?"

Resi:

- FE-001,
- FE-002,
- FE-010.

Interakce:

- zapnout/vypnout zdroj dat,
- ukazat, ze bez RA/Dec tabulek model nema stejnou predikcni silu.

### 3. Stranka "Mapa neni svet"

Resi:

- FE-003.

Interakce:

- slider zemepisne sirky,
- porovnani obvodu rovnobezky na kouli a v AE disku,
- barevne zvetseni chyby smerem k Antarktide.

### 4. Stranka "Rucne nastavene nebe"

Resi:

- FE-004,
- FE-006.

Interakce:

- posuvnik deklinace,
- posuvnik rucnich konstant `HEADROOM`, `SUN_RANGE`, radius Slunce/Mesic,
- ukazka, ze vysledek lze ladit cisly.

### 5. Stranka "Zatmeni"

Resi:

- FE-005,
- FE-006.

Interakce:

- kalendar zatmeni,
- prepinac "skutecny katalog" vs "FE prediktor",
- u FE prediktoru ukazat "neni implementovano".

### 6. Stranka "Planety"

Resi:

- FE-007.

Interakce:

- retrogradni pohyb Marsu,
- porovnani realne smycky s GeoC pipeline bez retrogradniho pohybu.

### 7. Stranka "Chyby v kodu"

Resi:

- FE-008,
- FE-009.

Interakce:

- casova osa 2019-2030,
- test roku 2018/2031,
- animace prvniho `update()` pred inicializaci opticke vysky.

### 8. Technicka priloha

Obsah:

- tabulka vsech problemu,
- soubory a funkce,
- citace relevantnich komentaru,
- reprodukcni kroky.

## Komponenty webu

- `ProblemCard`: kratka karta s ID, nazvem, severitou a detskym vysvetlenim.
- `ProblemDetail`: rozkliknuty detail s dukazy.
- `SeverityFilter`: filtrovani podle kriticnosti.
- `DataFlowDiagram`: interaktivni tok dat.
- `ProjectionComparator`: koule vs AE disk.
- `ParallelCalculator`: kalkulacka obvodu rovnobezek.
- `DomeHeightDemo`: rucne nastavene vysky teles.
- `EclipseCatalogDemo`: ukazka katalogu zatmeni.
- `CodeEvidence`: blok s cestou k souboru, radkem a vysvetlenim.
- `KidExplanation`: jednoduche vysvetleni bez technickych slov.
- `TechnicalNote`: presna technicka poznamka.

## Datovy model pro problemy

Kazdy problem bude mit:

- `id`
- `title`
- `severity`
- `kidSummary`
- `whyWrong`
- `meaning`
- `codeEvidence`
- `example`
- `visualization`
- `conclusion`
- `relatedProblems`

## Prvni implementacni milnik

1. Vytvorit staticky webovy projekt v auditni slozce.
2. Pripravit data problemu jako JS/JSON.
3. Udelat hlavni stranku s filtrem severity a rozklikavacimi kartami.
4. Udelat detail pro FE-001 az FE-005.
5. Pridat prvni interaktivni diagram toku dat.
6. Pridat porovnavac mapove projekce.

## Druhy implementacni milnik

1. Doplnit FE-006 az FE-011.
2. Pridat animace a detsky rezim.
3. Pridat technickou prilohu s odkazy na kod.
4. Overit layout na mobilu.
5. Spustit lokalni server a otestovat v prohlizeci.

