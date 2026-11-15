import html
import re

with open('/tmp/gemini_dump_new.html', 'r', encoding='utf-8', errors='ignore') as f:
    raw = f.read()

# Remove style, script, svg, noscript
clean = re.sub(r'<style[^>]*>.*?</style>', '', raw, flags=re.DOTALL)
clean = re.sub(r'<script[^>]*>.*?</script>', '', clean, flags=re.DOTALL)
clean = re.sub(r'<svg[^>]*>.*?</svg>', '', clean, flags=re.DOTALL)
clean = re.sub(r'<noscript[^>]*>.*?</noscript>', '', clean, flags=re.DOTALL)

# Convert headers, paragraphs, lists, tables to markdown
clean = re.sub(r'<h1[^>]*>(.*?)</h1>', r'\n\n# \1\n\n', clean, flags=re.DOTALL)
clean = re.sub(r'<h2[^>]*>(.*?)</h2>', r'\n\n## \1\n\n', clean, flags=re.DOTALL)
clean = re.sub(r'<h3[^>]*>(.*?)</h3>', r'\n\n### \1\n\n', clean, flags=re.DOTALL)
clean = re.sub(r'<h4[^>]*>(.*?)</h4>', r'\n\n#### \1\n\n', clean, flags=re.DOTALL)
clean = re.sub(r'<li[^>]*>(.*?)</li>', r'\n- \1', clean, flags=re.DOTALL)
clean = re.sub(r'<p[^>]*>(.*?)</p>', r'\n\n\1\n\n', clean, flags=re.DOTALL)
clean = re.sub(r'<code[^>]*>(.*?)</code>', r'`\1`', clean, flags=re.DOTALL)
clean = re.sub(r'<pre[^>]*>(.*?)</pre>', r'\n```\n\1\n```\n', clean, flags=re.DOTALL)
clean = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', clean, flags=re.DOTALL)
clean = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', clean, flags=re.DOTALL)
clean = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', clean, flags=re.DOTALL)
clean = re.sub(r'<i[^>]*>(.*?)</i>', r'*\1*', clean, flags=re.DOTALL)

# Tables
clean = re.sub(r'<tr[^>]*>', '\n| ', clean)
clean = re.sub(r'</tr>', ' |', clean)
clean = re.sub(r'<(td|th)[^>]*>(.*?)</(td|th)>', r'\2 | ', clean, flags=re.DOTALL)

# Remove remaining tags
clean = re.sub(r'<[^>]+>', ' ', clean)
clean = html.unescape(clean)

# Clean up multiple empty lines
clean = re.sub(r'\n{3,}', '\n\n', clean)

with open('MASTER_BLUEPRINT_55_TOOLS.md', 'w', encoding='utf-8') as f:
    f.write(clean.strip())

print('Saved to MASTER_BLUEPRINT_55_TOOLS.md. Size:', len(clean.strip()))
