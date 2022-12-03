
#Triple Extraction
# Load your usual SpaCy model (one of SpaCy English models)
import neuralcoref
import spacy
nlp = spacy.load('en_core_web_lg')

# Add neural coref to SpaCy's pipe
neuralcoref.add_to_pipe(nlp)

#Now neuralcoref can be used to manipulate Spacy
doc = nlp('''A patient visited an Endocrinologist with a concern of getting affected with Diabetes. Diabetes is a disease that occurs when your blood glucose, 
also called blood sugar, is too high. Blood glucose is your main source of energy and comes from the food you eat. Insulin, a hormone made by the pancreas, 
helps glucose from food get into your cells to be used for energy. The patient has symptoms fatigue, high sugar level, restlessness, lethargy, polyuria. 
The patient has precautions balanced diet, exercise, regularly checking sugar levels, medication.''')

triples = []
s = ''
p = ''
o = ''

sTags = ['nsubj', 'nsubj:move', 'csubj', 'csubj:move','expl:move']
oTags = ['det', 'obj']
cTags = ['conj']

for token in doc:
    pass
print()


#Dependency Parsing
for chunk in doc.nounChunks:
    print(chunk.text, '|', chunk.root.text, '|',
          chunk.root.dep_, '|', chunk.root.head.text)
    if chunk.root.dep_ in sTags:
        s = chunk.text
        o = ''
    elif chunk.root.dep_ in oTags:
        p = chunk.root.head.text
        o = chunk.text
        if s:
            triples.append((s, p, o))
    elif chunk.root.dep_ in cTags:
        if p and s:
            triples.append((s, p, chunk.text))
    elif chunk.root.dep_ == 'pobj':
        if s and p:
            triples.append((o, chunk.root.head.text, chunk.text))
print()

for x in triples:
    print(x)
print()

# To check for resolved conferences
for x in doc._.coref_clusters:
    print(x)
