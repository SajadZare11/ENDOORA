import json

for num in range(140, 175):
    bid = f'book-{num}'
    p = f'Endoora/apps/web/public/book-data/{bid}.json'
    try:
        with open(p, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
        pages = [pg for c in d.get('chapters', []) if c.get('id') != 'overview' for pg in c.get('pages', [])]
        if pages:
            snip = ' '.join(pages[0].get('content', []))[:120].replace('\n', ' ')
            print(f'[{bid}] {d.get("titleEn", "")[:35]} -> P1: "{snip}"')
    except Exception:
        pass
