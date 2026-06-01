import zipfile
from xml.etree import ElementTree as ET
path = r'uploads/CSO_Database_BRD.docx'
with zipfile.ZipFile(path) as z:
    xml = z.read('word/document.xml')
root = ET.fromstring(xml)
texts = []
ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
for node in root.iter():
    if node.tag == ns + 't':
        texts.append(node.text or '')
print('---START---')
print('\n'.join(texts[:400]))
print('---END---')
