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

Cette commande lance `scripts/verify-build.js` et verifie que les fichiers critiques sont presents, que le JavaScript est valide et que les references locales ne sont pas cassees.

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
  hero: "...",
  welcome: "...",
  accommodation: "...",
  gifts: "...",
  galleryOne: "...",
  galleryTwo: "...",
  galleryThree: "..."
}
```

Les images actuelles viennent de la galerie Lightroom fournie:

```text
https://lightroom.adobe.com/shares/b69aed502dc74169b658a828368f7739
```

Des images de secours sont aussi definies dans `imageFallbacks` au cas ou Lightroom bloque une image sur un appareil.

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
  accommodation: "#"
}
```

Remplacer `#` par le vrai lien de reservation quand il sera pret. La section cadeaux ne contient plus de paiement en ligne ni de lien externe.

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

Le formulaire fonctionne deja en local: les reponses sont sauvegardees dans le navigateur avec `localStorage`, sous la cle:

```text
wedding-rsvps
```

Pour voir les reponses dans le navigateur:

```js
JSON.parse(localStorage.getItem("wedding-rsvps") || "[]")
```

Cette solution est parfaite pour tester le design, mais pas suffisante pour recevoir les confirmations des invites sur ton email.

## Connecter le RSVP pour recevoir les confirmations

### Option 1: Formspree, la plus simple

1. Creer un formulaire sur https://formspree.io.
2. Copier ton endpoint, par exemple:

```text
https://formspree.io/f/xxxxxxx
```

3. Dans `index.html`, remplacer:

```html
<form class="rsvp-form reveal" data-rsvp-form>
```

par:

```html
<form class="rsvp-form reveal" data-rsvp-form action="https://formspree.io/f/xxxxxxx" method="POST">
```

4. Dans `app.js`, remplacer la fonction `setupForm()` par un envoi `fetch` vers ton endpoint, ou supprimer l'interception JavaScript si tu veux un submit classique.

### Option 2: EmailJS

1. Creer un compte sur https://www.emailjs.com.
2. Creer un service email et un template.
3. Ajouter le SDK EmailJS dans `index.html`.
4. Dans `app.js`, remplacer la sauvegarde `localStorage` par `emailjs.send(...)`.

### Option 3: Supabase

1. Creer un projet Supabase.
2. Creer une table `rsvps` avec les colonnes:
   `full_name`, `contact`, `attendance`, `guests`, `language`, `message`, `created_at`.
3. Ajouter le client Supabase.
4. Dans `app.js`, remplacer la sauvegarde `localStorage` par un insert dans la table.

Supabase est le meilleur choix si tu veux un tableau complet des invites et exporter les reponses.

## Structure des fichiers

```text
index.html      Structure du site
styles.css      Design responsive et animations
app.js          Langues, compte a rebours, RSVP, scroll animations
config.js       Textes, images, liens, horaires
assets/         Images et monogramme
vercel.json     Configuration de deploiement Vercel
package.json    Commandes locales et validation Vercel
scripts/        Verification de build avant deploiement
.vercelignore   Fichiers exclus du deploiement
```
