# Every hour, for Alesha 💌

22 birthday cards from Yameen for Alesha's birthday, 27 October 2026. A new card unlocks every hour, from 2:00 AM to 11:00 PM Lahore time.

Each card has:

- an animated panda scene (hugs, kisses, cuddles, dates)
- a birthday wish, and "Yameen's wish for us"
- a short line from a film, with the film and year
- "Send a kiss back" and "Hug back" buttons
- a box where Alesha writes her own wish. It's saved on her phone, and "Send it to Yameen" opens her share sheet or WhatsApp.

The page shows a live countdown to the next card. It checks the web server's clock, so a wrong phone clock can't open cards early.

## Files

```
index.html   page structure
style.css    design, themes and all the animations
app.js       schedule, countdown, card viewer, wishes
scenes.js    the 22 animated SVG scenes
cards.js     the card text, base64-encoded so it isn't readable at a glance
music.js     "Alesha", the piano love song (optional, tap "Play our song")
```

## Editing a card

The readable card text lives in `private/cards.json`, which is kept out of the repository. Edit it, then rebuild `cards.js`:

```bash
py -3 private/build.py
```

## Credits

The piano is the Salamander Grand Piano by Alexander Holm (CC BY 3.0), loaded from tonejs.github.io. Short film lines are quoted with their titles and years.
