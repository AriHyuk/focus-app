import os
import re

html_path = 'index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

s_m = re.search(r'<style>(.*?)</style>', content, flags=re.DOTALL)
if s_m:
    os.makedirs('assets/css', exist_ok=True)
    with open('assets/css/style.css', 'w', encoding='utf-8') as f:
        f.write(s_m.group(1).strip())

j_m = re.search(r'<script>(.*?)</script>', content, flags=re.DOTALL)
if j_m:
    os.makedirs('assets/js', exist_ok=True)
    with open('assets/js/main.js', 'w', encoding='utf-8') as f:
        f.write(j_m.group(1).strip())

new_html = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="assets/css/style.css">', content, flags=re.DOTALL)
new_html = re.sub(r'<script>.*?</script>', '<script type="module" src="assets/js/app.js"></script>', new_html, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Extraction complete.")
