from html.parser import HTMLParser
import re

class MarkdownParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.out = []

    def handle_starttag(self, tag, attrs):
        if tag in ['h1', 'h2', 'h3', 'h4']:
            self.out.append('\n\n' + '#' * int(tag[1]) + ' ')
        elif tag == 'p':
            self.out.append('\n\n')
        elif tag == 'br':
            self.out.append('\n')
        elif tag == 'li':
            self.out.append('\n- ')
        elif tag == 'code':
            self.out.append('`')
        elif tag == 'pre':
            self.out.append('\n```\n')
        elif tag in ['strong', 'b']:
            self.out.append('**')
        elif tag in ['em', 'i']:
            self.out.append('*')
        elif tag in ['td', 'th']:
            self.out.append('| ')

    def handle_endtag(self, tag):
        if tag in ['h1', 'h2', 'h3', 'h4']:
            self.out.append('\n')
        elif tag == 'p':
            self.out.append('\n')
        elif tag == 'code':
            self.out.append('`')
        elif tag == 'pre':
            self.out.append('\n```\n')
        elif tag in ['strong', 'b']:
            self.out.append('**')
        elif tag in ['em', 'i']:
            self.out.append('*')
        elif tag == 'tr':
            self.out.append(' |\n')

    def handle_data(self, data):
        self.out.append(data)

with open('gemini_raw_markdown.html', 'r', encoding='utf-8') as f:
    raw = f.read()

parser = MarkdownParser()
parser.feed(raw)
full_text = ''.join(parser.out)

# Clean up empty lines
clean_text = re.sub(r'\n{3,}', '\n\n', full_text)

with open('MASTER_BLUEPRINT_ACCURATE.md', 'w', encoding='utf-8') as f:
    f.write(clean_text.strip())

print('Parsed successfully. Length:', len(clean_text))
