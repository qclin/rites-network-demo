from __future__ import unicode_literals
import sys
import spacy

# load and feed text in right format
nlp = spacy.load('en')
# text = sys.stdin.read().decode('utf8', errors="replace")

### attempt 2:  to swap from a list
# input_list = sys.argv[1].split(' ')
# print(input_list)

text = sys.argv[1].decode('utf8', errors="replace")
sentence = nlp(text)

terms = sys.argv[2].strip('[]').split(',') # intepret input argv, string unnessary characters
terms_clean = ' '.join(terms).decode('utf8', errors="replace") # convert back to a flat string
terms_parsed = nlp(terms_clean)

# print only ONCE, for DEV
# print("terms",terms, type(terms), terms_clean, type(terms_clean), terms_parsed, type(terms_parsed))


constructed = []
for item in sentence:
    for fragments in terms_parsed:
        if item.tag_[:2] == fragments.tag_[:2]: ## so that NN will match NNP or VB to VBZ
            constructed.append(fragments.text)
        else:
            constructed.append(item.text)
        break ### BUG: it's not getting to the end of the tagg list, but uncommenting break will create duplicates

    output = ' '.join(constructed)  # test if all of the tags have been replaced
print(output) # node expects only one string
sys.stdout.flush()
# send data back to node

### attempt 2:  to swap from a list
# for index, item in enumerate(sentence):
#     # for fragments in terms_parsed:
#     i = 0
#     while i < len(terms_parsed):
#         if item.tag_[:2] == terms_parsed[i].tag_[:2]:
#             print(index, terms_parsed[i].text)
#             input_list[index] = terms_parsed[i].text
#         i += 1
#         break # need to break out of the loop to avoid duplicates
# print(input_list)
