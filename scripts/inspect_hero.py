with open('src/main.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

idx_app_shell = c.find('return <div className="app-shell">')
print("--- APP SHELL ---")
print(c[idx_app_shell:idx_app_shell+250])

idx_hero = c.find('<section className="hero">')
print("--- HERO ---")
print(c[idx_hero:idx_hero+400])

idx_hero_end = c.find('</section>\n\n      <section className="problem', idx_hero)
print("--- HERO END ---")
print(c[idx_hero_end-200:idx_hero_end+80])

