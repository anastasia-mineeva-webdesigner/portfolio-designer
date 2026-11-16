"""Build the downloadable CV from the same content as CVPage.tsx."""
from pathlib import Path
import re
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
root=Path(__file__).resolve().parent.parent
source=(root/'src/components/CVPage.tsx').read_text()
# Fonts bundled with this site; inspect their internal family names rather than guessing.
from fontTools.ttLib import TTFont as Font
for path in (root/'public/fonts').glob('*.ttf'):
 f=Font(path); family=f['name'].getDebugName(1)
 if family=='Inter':
  pdfmetrics.registerFont(TTFont('CV',str(path)));break
else: raise RuntimeError('Inter font missing')
styles=getSampleStyleSheet()
for name in ['Normal','BodyText','Title','Heading1','Heading2','Heading3']:
 styles[name].fontName='CV'
styles['BodyText'].fontSize=10;styles['BodyText'].leading=15;styles['BodyText'].spaceAfter=9
styles['Title'].fontSize=32;styles['Title'].leading=38;styles['Title'].alignment=0
styles['Heading1'].fontSize=19;styles['Heading1'].leading=25
styles['Heading2'].fontSize=14;styles['Heading2'].leading=19
styles.add(ParagraphStyle(name='Meta',fontName='CV',fontSize=9,leading=14,textColor=HexColor('#666666'),spaceAfter=10))
def clean(s):return escape(re.sub('<[^>]+>','',s).strip())
story=[]
def p(text,style='BodyText'):story.append(Paragraph(text,styles[style]))
p('Mira Smirnova','Title');p('AI Full Stack Designer','Heading2');p('Moscow · Remote · GMT+3','Meta')
p('From a clear structure to a website with character. I bring design, technology and AI into one continuous process.')
p('7 years of experience · Web · AI · Motion · Project & ongoing collaboration','Meta')
for section in re.findall(r'<section id="cv-.*?</section>',source):
 heading=re.search(r'<h2[^>]*>(.*?)</h2>',section)
 label=re.search(r'<span className="case-step">(.*?)</span>',section)
 p(clean(label[1] if label else heading[1]),'Heading1')
 if 'cv-experience' in section:
  jobs=re.findall(r"\{period:'([^']*)',title:'([^']*)',role:'([^']*)',text:'([^']*)',items:\[(.*?)\]\}",source)
  for period,title,role,desc,items in jobs:
   start=len(story)
   p(escape(title),'Heading2');p(escape(period+' · '+role),'Meta');p(escape(desc))
   for item in re.findall(r"'([^']*)'",items):p('• '+escape(item))
   block=story[start:];del story[start:];story.append(KeepTogether(block))
 elif 'cv-expertise' in section:
  for title,desc in re.findall(r"\['([^']*)','([^']*)'\]",section):p(escape(title),'Heading2');p(escape(desc))
 elif 'cv-tools' in section:
  p('Figma · Claude Code · Codex · ChatGPT · Utopia AI · Blender · Spline');p('Russian — Native<br/>English — B2 · Upper intermediate')
 else:
  for text in re.findall(r'<h3>(.*?)</h3>|<p>(.*?)</p>',section):p(clean(text[0] or text[1]),'Heading2' if text[0] else 'BodyText')
 story.append(Spacer(1,10))
email=re.search(r"email: '([^']+)'",(root/'src/config/links.ts').read_text())[1]
p(escape(email),'Meta')
out=root/'public/downloads/mira-smirnova-cv.pdf'
def footer(canvas,doc):
 canvas.setFont('CV',8);canvas.setFillColor(HexColor('#666666'));canvas.drawString(42,25,'Mira Smirnova · AI Full Stack Designer');canvas.drawRightString(553,25,str(doc.page))
SimpleDocTemplate(str(out),pagesize=(595,842),rightMargin=42,leftMargin=42,topMargin=36,bottomMargin=42,title='Mira Smirnova — CV',author='Mira Smirnova').build(story,onFirstPage=footer,onLaterPages=footer)
print(out)
