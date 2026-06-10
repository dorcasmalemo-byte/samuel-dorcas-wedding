# Samuel & Dorcas Wedding Invitation

Site web statique, bilingue et responsive pour l'invitation et le RSVP du mariage de Samuel & Dorcas.

Direction artistique actuelle:

```text
Nuit royale en cristal
```

Ambiance: royal, palace, chandeliers, cristaux, ivoire, beige champagne, or doux et noir elegant.

## Lancer le site localement

Depuis ce dossier:

```bash
python3 -m http.server 4173
```

Puis ouvrir:

```text
http://localhost:4173
```

Pour tester sur un telephone ou une tablette connecte(e) au meme Wi-Fi que ce Mac, ouvrir:

```text
http://192.168.0.185:4173
```

Versions par langue:

```text
http://localhost:4173/?lang=fr
http://localhost:4173/?lang=en
```

## Deployer sur Vercel

Avant de deployer, verifier le projet:

```bash
npm run build
```

Cette commande verifie directement que `config.js` et `app.js` sont valides. Elle ne depend d'aucun fichier de script separe, ce qui evite les erreurs de fichier manquant sur Vercel.

Option simple avec l'interface Vercel:

1. Creer un nouveau projet sur Vercel.
2. Importer ce dossier `samuel-dorcas-wedding` depuis GitHub ou le glisser/deposer dans Vercel.
3. Framework preset: `Other`.
4. Build command: `npm run build`.
5. Output directory: laisser vide ou mettre `.`.
6. Deploy.

Option CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```

## Ou modifier les informations

Tout ce qui doit changer facilement est dans:

```text
config.js
```

### Date du mariage

Modifier:

```js
weddingDate: "2026-12-26T15:00:00+02:00"
```

Le fuseau `+02:00` correspond a Johannesburg.

### Images

Modifier les liens dans:

```js
images: {
  hero: "https://lightroom.adobe.com/...",
  welcome: "https://lightroom.adobe.com/...",
  accommodation: "https://lightroom.adobe.com/...",
  gifts: "https://lightroom.adobe.com/..."
}
```

Les images principales utilisent les vraies photos de couple depuis la galerie Lightroom fournie. Pour une qualite encore meilleure, telecharger les originaux depuis Lightroom et remplacer ces URLs par des fichiers locaux dans `assets/`.

Le hero utilise une galerie de cartes animees dans:

```js
heroGallery: [...]
```

La galerie principale utilise plusieurs cartes avec images tournantes dans:

```js
galleryDecks: [...]
```

Pour utiliser vos vraies photos:

1. Ajouter les fichiers dans `assets/`.
2. Remplacer un lien par exemple par:

```js
hero: "./assets/votre-photo.jpg"
```

Le monogramme est ici:

```text
assets/monogram-sd-transparent.png
```

### Textes francais et anglais

Modifier:

```js
content: {
  fr: { ... },
  en: { ... }
}
```

Chaque cle existe dans les deux langues. Garder la meme structure pour que le bouton FR/EN fonctionne correctement.

### Programme et horaires

Modifier:

```js
schedule: [
  { time: "15:00", title: { fr: "Ceremonie", en: "Ceremony" }, text: { ... } }
]
```

Tu peux changer les heures, titres et descriptions.

### Liens

Modifier:

```js
links: {
  maps: "...",
  accommodation: "https://book.nightsbridge.com/29945"
}
```

Le lien d'hebergement pointe vers la page officielle de reservation Avianto/NightsBridge. La section cadeaux ne contient pas de paiement en ligne ni de lien externe.

### Polices

Les polices principales sont definies dans `styles.css`:

```css
--serif
--display
--script
--sans
```

Le rendu utilise une combinaison proche du faire-part: Bodoni/Didot pour les grands titres et Snell Roundhand/Apple Chancery pour la calligraphie.

## RSVP actuel

Le formulaire envoie les reponses par email via FormSubmit:

```text
https://formsubmit.co/ajax/dorcasmalemo@icloud.com
```

Les reponses sont envoyees a:

```text
dorcasmalemo@icloud.com
```

Important: FormSubmit enverra un email d'activation a `dorcasmalemo@icloud.com` lors du premier test. Il faut cliquer sur le lien d'activation dans cet email pour autoriser les prochains envois.

Une copie locale de secours est aussi sauvegardee dans le navigateur avec `localStorage`, sous la cle `wedding-rsvps`.

## Tester le RSVP

1. Ouvrir le site local ou le site Vercel.
2. Remplir le formulaire RSVP avec un test.
3. Envoyer.
4. Verifier la boite mail `dorcasmalemo@icloud.com`.
5. Si FormSubmit demande une activation, cliquer sur le lien recu.

Les champs envoyes sont:

```text
fullName
email
phone
attendance
guests
language
message
createdAt
pageLanguage
wedding
```

## Structure des fichiers

```text
index.html      Structure du site
styles.css      Design responsive et animations
app.js          Langues, compte a rebours, RSVP, scroll animations
config.js       Textes, images, liens, horaires
assets/         Images et monogramme
vercel.json     Configuration de deploiement Vercel
package.json    Commandes locales et validation Vercel
.vercelignore   Fichiers exclus du deploiement
```
