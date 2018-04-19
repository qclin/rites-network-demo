from __future__ import unicode_literals
import sys
import spacy

# load and feed text in right format
nlp = spacy.load('en')
# text = sys.stdin.read().decode('utf8', errors="replace")
text = sys.argv[1].decode('utf8', errors="replace")
doc = nlp(text)
for item in doc:
    print item.text, item.tag_, item.pos_
# send data back to node
print(doc)
sys.stdout.flush()
