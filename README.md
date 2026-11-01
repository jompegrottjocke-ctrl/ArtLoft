# ArtLoft

Ett konstquiz för Windows 11 med ett lugnt, museiinspirerat gränssnitt. Varje runda innehåller 20 slumpade målningar, fem unika titlar per fråga, direkt återkoppling och resultat. Klicka på Nästa efter återkopplingen oavsett om svaret var rätt eller fel.

## Kör och bygg på Windows 11

Installera Node.js 24 LTS. Öppna PowerShell i projektmappen:

```powershell
npm ci
npm test
npm start
```

Skapa en Windows-installation:

```powershell
npm run dist:win
```

Installationsfilen skapas i `dist`. Bygget är inte kodsignerat; Windows kan visa SmartScreen. En signerad offentlig release kräver eget kodsigneringscertifikat.

## Konstsamlingen

Windows-bygget hämtar upp till 300 målningar ur Cleveland Museum of Arts CC0-samling. Varje bild kontrolleras före paketering. Minst 100 olika titlar krävs, annars stoppas bygget. Bilder och metadata följer med installationen så att spelet fungerar offline. Titlar, konstnärer, årtal och credits kommer från museets katalog. Samlingen är ett urval och innehåller inte Mona Lisa.

För utveckling: kör `npm run prepare:collection` före `npm start` för samma offlinefunktion. Utan den genererade samlingen försöker utvecklingsversionen hämta från API:t. Genererade bilder i `src/artworks` ska inte checkas in. Bygget genererar `src/collection-data.json` automatiskt.

Nätverk vid förberedelse: `openaccess-api.clevelandart.org` och `openaccess-cdn.clevelandart.org` över HTTPS. Inga konton eller API-nycklar behövs. Källa och villkor: https://github.com/ClevelandMuseumArt/openaccess

## Validering

`npm test` testar svarsalternativ, slumpning och filtrering. Windows-installation och visuell körning behöver verifieras på Windows; en Linux-kontroll av JavaScript är inte ett Windows-test.
