import os

css_path = 'assets/css/style.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Define new root variables
old_root = """:root{
  --black:#0d0d0d;
  --white:#f5f0e8;
  --yellow:#FFD600;
  --red:#E84545;
  --green:#00C27C;
  --blue:#3B82F6;
  --border:3px solid var(--black);
  --shadow:4px 4px 0px var(--black);
}
body.dark-mode {
  --black: #e0e0e0;
  --white: #121212;
  --yellow: #d4a000;
}"""

new_root = """:root {
  --bg-color: #f5f0e8;
  --text-color: #0d0d0d;
  --card-bg: #ffffff;
  --accent-bg: #0d0d0d;
  --accent-text: #FFD600;
  --border-color: #0d0d0d;
  --shadow-color: #0d0d0d;
  
  --yellow: #FFD600;
  --red: #E84545;
  --green: #00C27C;
  --blue: #3B82F6;
  --border: 3px solid var(--border-color);
  --shadow: 4px 4px 0px var(--shadow-color);
}
body.dark-mode {
  --bg-color: #121212;
  --text-color: #e0e0e0;
  --card-bg: #1e1e1e;
  --accent-bg: #2a2a2a;
  --accent-text: #FFD600;
  --border-color: #444;
  --shadow-color: #000;
  
  --yellow: #d4a000;
  --red: #ff6b6b;
  --green: #00e676;
}"""

if old_root in css:
    css = css.replace(old_root, new_root)
else:
    # fallback if formatting is slightly different
    pass

# Replacements for semantics:
# body background
css = css.replace('background:var(--white);', 'background:var(--bg-color);', 1)
css = css.replace('color:var(--black);', 'color:var(--text-color);', 1)

# card background
css = css.replace('background:var(--white)', 'background:var(--card-bg)')

# headers / badges / logs (accent bg)
css = css.replace('background:var(--black)', 'background:var(--accent-bg)')
css = css.replace('color:var(--yellow)', 'color:var(--accent-text)')

# text colors
css = css.replace('color:var(--black)', 'color:var(--text-color)')

# border bottoms / specific borders using --black
css = css.replace('solid var(--black)', 'solid var(--border-color)')
css = css.replace('0 var(--black)', '0 var(--shadow-color)')
css = css.replace('2px var(--black)', '2px var(--shadow-color)')

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS updated for better dark mode semantics.")
