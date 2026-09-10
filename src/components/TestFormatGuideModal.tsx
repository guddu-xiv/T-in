import React, { useState } from "react";
import { X, Copy, Check, FileText, Sparkles, BookOpen, AlertCircle } from "lucide-react";

interface TestFormatGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSampleIntoEditor?: (sampleText: string) => void;
}

export const SAMPLE_BILINGUAL_PROFIT_TEST_TEXT = `==================================================
SSC CGL 2025 PROFIT & LOSS BILINGUAL MOCK
ID: SSC-CGL-25-PROFIT-LOSS-BILINGUAL
Total Questions: 2
Language Mode: Bilingual (English + Hindi)
==================================================

Q1. A mobile phone retailer sells a phone for Rs.P and earns a profit of 20%. For a special festive offer, he marks the same phone at Rs.1.5P. At the offer, he provides a discount of 10%. What will be the percentage profit that he will make during the festive offer?
    एक मोबाइल फोन रिटेलर एक फोन Rs.P में बेचता है और 20% का लाभ कमाता है। एक विशेष त्योहारी ऑफर के लिए, वह उसी फोन को Rs.1.5P पर बेचता है। ऑफर पर, वह 10% की छूट देता है। त्योहारी ऑफर के दौरान उसे कितना प्रतिशत लाभ होगा?
  (A) 0.26
  (B) 0.56
  (C) 0.62
  (D) 0.6
Ans: (C) 0.62
Ex: Selling price Rs.P gives 20% profit, so cost price \\(= \\frac{P}{1.2}\\)
In the festive offer, marked price = 1.5P and discount = 10%
**Selling price = Marked price × (100 − discount%) ÷ 100**
New selling price = 1.5P × 0.9 = 1.35P
Profit% \\(= \\frac{1.35P - \\frac{P}{1.2}}{\\frac{P}{1.2}} = 1.35 \\times 1.2 - 1 = 0.62\\)
**Profit = 0.62 (i.e. 62%)**
**Ans: (3) 0.62**

[Hindi / हिन्दी व्याख्या]:
विक्रय मूल्य Rs.P पर 20% लाभ है, अतः क्रय मूल्य \\(= \\frac{P}{1.2}\\)
त्योहारी ऑफर में अंकित मूल्य = 1.5P तथा छूट = 10%
**विक्रय मूल्य = अंकित मूल्य × (100 − छूट%) ÷ 100**
नया विक्रय मूल्य = 1.5P × 0.9 = 1.35P
लाभ% \\(= \\frac{1.35P - \\frac{P}{1.2}}{\\frac{P}{1.2}} = 1.35 \\times 1.2 - 1 = 0.62\\)
**लाभ = 0.62 (अर्थात् 62%)**
**उत्तर: (3) 0.62**
Source: [CGL, 12 Sep 2025, Shift 3]
--------------------------------------------------

Q2. If an article is sold at a gain of 5% instead of being sold at a loss of 5%, a merchant gains Rs. 50 more. What is the cost price of the article?
    यदि एक वस्तु 5% हानि के स्थान पर 5% लाभ पर बेची जाती है, तो व्यापारी को Rs. 50 अधिक प्राप्त होते हैं। वस्तु का क्रय मूल्य क्या है?
  (A) Rs. 400
  (B) Rs. 500
  (C) Rs. 600
  (D) Rs. 750
Ans: (B) Rs. 500
Ex: Difference between 5% gain and 5% loss = 10% of Cost Price.
Given, 10% of CP = Rs. 50
Therefore, Cost Price (100%) = \\(\\frac{50}{10} \\times 100 = 500\\)
**Cost Price = Rs. 500**
**Ans: (2) Rs. 500**

[Hindi / हिन्दी व्याख्या]:
5% लाभ तथा 5% हानि के बीच अंतर = क्रय मूल्य का 10%
दिया है, 10% CP = Rs. 50
अतः, क्रय मूल्य (100%) = \\(\\frac{50}{10} \\times 100 = 500\\)
**क्रय मूल्य = Rs. 500**
**उत्तर: (2) Rs. 500**
Source: [CGL, 14 Sep 2025, Shift 1]
--------------------------------------------------`;

export const SAMPLE_SSC_TEST_TEXT = `==================================================
SSC 2025 ENGLISH CONFUSING WORDS
ID: SSC-SUB-25-ENGLISH-CONFUSING-WORDS
Total Questions: 16
==================================================

Q1. Choose the most suitable option to replace the highlighted part of the sentence: The man was **effected by** the remarks made by his peers.
  (A) affected with
  (B) effected with
  (C) affected by
  (D) effected to
Ans: (C) affected by
Ex: "Affected by" is the correct phrase meaning influenced by. "Effected" means brought about, so it is incorrect here.
Source: [CHSL, 19 Nov 2025, Shift 3]
--------------------------------------------------

Q2. Choose the most suitable option to replace the highlighted part of the sentence: The **dessert** is a dry piece of land.
  (A) desert
  (B) dissert
  (C) daisert
  (D) desertive
Ans: (A) desert
Ex: The correct word for a dry piece of land is "desert". "Dessert" means a sweet course after a meal. The other options are incorrect spellings or unrelated forms.
Source: [CHSL, 21 Nov 2025, Shift 2]
--------------------------------------------------`;

export const SAMPLE_MATH_TEST_TEXT = `==================================================
SSC 2025 MATH TRIGONOMETRY
ID: SSC-SUB-25-MATH-TRIGONOMETRY
Total Questions: 277
Language Mode: Bilingual (English + Hindi)
==================================================

### [ PART-1 ] ###

Q1. What is \\(\\frac{5\\pi}{4}\\) radians in degrees?
    \\(\\frac{5\\pi}{4}\\) रेडियन कितने डिग्री में है?
  (A) 225°
  (B) 180°
  (C) 240°
  (D) 360°
Ans: (A) 225°
Ex: **π radians = 180°**
\\(\\frac{5\\pi}{4} \\times \\frac{180}{\\pi} = 5 \\times 45\\)
So the measure = **225°**
**Ans: (1) 225°**

[Hindi / हिन्दी व्याख्या]:
**π रेडियन = 180°**
\\(\\frac{5\\pi}{4} \\times \\frac{180}{\\pi} = 5 \\times 45\\)
अतः माप = **225°**
**उत्तर: (1) 225°**
Source: [CGL, 12 Sep 2025, Shift 2]
--------------------------------------------------

Q2. Simplify: $$\\frac{\\tan^2\\theta-\\sin^2\\theta}{2+\\tan^2\\theta+\\cot^2\\theta}$$
    सरल कीजिए: $$\\frac{\\tan^2\\theta-\\sin^2\\theta}{2+\\tan^2\\theta+\\cot^2\\theta}$$
  (A) \\(\\sec^6\\theta\\)
  (B) \\(\\sin^6\\theta\\)
  (C) \\(\\cos^2\\theta\\)
  (D) \\(\\sin^2\\theta\\)
Ans: (B) \\(\\sin^6\\theta\\)
Ex: Numerator: \\(tan^2θ - sin^2θ = \\frac{sin^2θ}{cos^2θ}(1 - cos^2θ) = \\frac{sin^4θ}{cos^2θ}\\)
**Denominator: 2 + tan²θ + cot²θ = (tan θ + cot θ)² = \\(\\frac{1}{sin^2θ\\ cos^2θ}\\)**
Dividing, \\(\\frac{sin^4θ}{cos^2θ} \\times sin^2θ\\ cos^2θ\\) = **\\(sin^6θ\\)**
**Ans: (2) \\(\\sin^6\\theta\\)**

[Hindi / हिन्दी व्याख्या]:
अंश: \\(tan^2θ - sin^2θ = \\frac{sin^2θ}{cos^2θ}(1 - cos^2θ) = \\frac{sin^4θ}{cos^2θ}\\)
**हर: 2 + tan²θ + cot²θ = (tan θ + cot θ)² = \\(\\frac{1}{sin^2θ\\ cos^2θ}\\)**
भाग देने पर \\(\\frac{sin^4θ}{cos^2θ} \\times sin^2θ\\ cos^2θ\\) = **\\(sin^6θ\\)**
**उत्तर: (2) \\(\\sin^6\\theta\\)**
Source: [CGL Tier-2]
--------------------------------------------------`;

export const SAMPLE_VOCAB_DETAILED_ANALYSIS_TEXT = `1. Select the word opposite in meaning to: Niggardly
A) Mingy /// This term characterizes someone as extremely stingy or reluctant to part with money. Since it mirrors the negative trait of being miserly, it acts as a synonym rather than the required opposite. 
Synonyms: Miserly (कंजूस), Parsimonious (मितव्ययी), Penny-pinching (किफ़ायती). 
Antonyms: Munificent (बहुत उदार), Bountiful (उदार), Liberal (दानशील).
B) Inefficient /// This word pertains to a lack of organization or skill in completing a task effectively. Its focus is on poor performance or incompetence, which is unrelated to the financial attitude of stinginess. 
Synonyms: Incompetent (अयोग्य), Inept (अनाड़ी), Unskilled (अकुशल). 
Antonyms: Proficient (निपुण), Capable (सक्षम), Adept (कुशल).
C) Generous ✅ /// This word describes a willingness to give or share money and kindness freely, often exceeding what is expected. It serves as the perfect antonym to being niggardly, which is characterized by extreme stinginess. 
Synonyms: Altruistic (परोपकारी), Philanthropic (समाजसेवी), Benevolent (दयालु). 
Antonyms: Greedy (लालची), Selfish (स्वार्थी), Niggardly (कंजूस).
D) Sinful /// This term refers to actions that are morally wrong or violate religious laws. While it implies bad character, it does not address the specific context of giving or spending money. 
Synonyms: Wicked (दुष्ट), Depraved (चरित्रहीन), Corrupt (भ्रष्ट). 
Antonyms: Virtuous (सदाचारी), Righteous (धर्मी), Pious (धार्मिक).
Ex: Niggardly - कंजूस / अल्प (Showing extreme unwillingness to spend or give)
Mingy - कंजूस / तुच्छ (Unwilling to spend or give freely)
Inefficient - अकुशल / अक्षम (Lacking effectiveness or proper skill)
Generous - उदार / दानी (Willing to give more than expected)
Sinful - पापी / अधर्मी (Against moral or religious principles)
Source: CGL 2017 (16 Aug | Shift-III)
Hence, 'Generous' is the most suitable antonym for 'Niggardly'.


2. Select the word opposite in meaning to: Dissident
A) Alienated /// This word describes someone who feels isolated or excluded from a group or society. While a dissident might feel this way, it describes an emotional state rather than an alignment with established beliefs. 
Synonyms: Estranged (अलग-थलग), Isolated (एकाकी), Detached (पृथक). 
Antonyms: Integrated (एकीकृत), United (संयुक्त), Sociable (मिलनसार).
B) Iconoclast /// This refers to a person who attacks cherished beliefs or traditional institutions. It is a synonym for dissident, as both involve opposing established norms, thus failing to provide an opposite. 
Synonyms: Rebel (विद्रोही), Radical (चरमपंथी), Nonconformist (अपरंपरावादी). 
Antonyms: Believer (आस्तिक), Conformist (अनुपालन करने वाला), Traditionalist (परंपरावादी).
C) Divisive /// This term is used for something that causes strong disagreement or hostility between people. It describes the effect of a person's actions rather than their adherence to traditional rules. 
Synonyms: Discordant (विवादास्पद), Disruptive (विघटनकारी), Alienating (अलगाव पैदा करने वाला). 
Antonyms: Harmonious (सामंजस्यपूर्ण), Unifying (एकीकृत करने वाला), Agreeable (सहमत).
D) Orthodox ✅ /// This word refers to following traditional or generally accepted rules, beliefs, and practices. It is the direct opposite of a dissident, who actively opposes and disagrees with official policies or established norms. 
Synonyms: Conservative (रूढ़िवादी), Traditional (परंपरागत), Conventional (पारंपरिक). 
Antonyms: Heterodox (विधर्मी), Dissident (विरोधी), Eccentric (विलक्षण).
Ex: Dissident - विरोधी (A person who opposes official policy)
Alienated - अलग-थलग (Feeling isolated or estranged)
Iconoclast - स्थापित मान्यताओं का विरोधी (Person who attacks traditional beliefs)
Divisive - फूट डालने वाला (Tending to cause disagreement)
Orthodox - रूढ़िवादी (Following traditional or accepted beliefs)
Source: CGL 2017 (16 Aug | Shift-III)
Hence, 'Orthodox' is the most suitable antonym for 'Dissident'.


3. Select the word opposite in meaning to: Meretricious
A) Brazen /// This word refers to being bold and without shame. While it can describe a flashy personality, it focuses on shamelessness rather than the deceptive attractiveness implied by the given word. 
Synonyms: Audacious (धृष्ट), Bold (साहसी), Shameless (बेशर्म). 
Antonyms: Modest (विनम्र), Shy (शर्मीला), Timid (डरपोक).
B) Natural ✅ /// This word refers to things that are genuine and come from nature, without being artificial or pretentious. It is the perfect antonym for meretricious, which refers to things that are deceptively attractive but lack real value. 
Synonyms: Authentic (वास्तविक), Genuine (असली), Pure (शुद्ध). 
Antonyms: Artificial (बनावटी), Fake (नकली), Affected (दिखावटी).
C) Exemplary /// This term describes something that is so good that it serves as a model or example for others. It indicates high quality but does not specifically contrast with the "showy but worthless" nature of the target word. 
Synonyms: Commendable (प्रशंसनीय), Ideal (आदर्श), Sterling (उत्कृष्ट). 
Antonyms: Deplorable (शोचनीय), Unworthy (अयोग्य), Mediocre (सामान्य).
D) Gaudy /// This word describes something extravagantly bright or showy, often in a tasteless way. It serves as a synonym for the flashy aspect of meretricious and therefore cannot be its opposite. 
Synonyms: Garish (भड़कीला), Flashy (दिखावटी), Ostentatious (आडंबरपूर्ण). 
Antonyms: Plain (सादा), Simple (सरल), Understated (न्यूनतम).
Ex: Meretricious - भड़कीला पर बेकार (Apparently attractive but having no real value)
Brazen - बेशर्म (Bold and without shame)
Natural - प्राकृतिक (Existing in or caused by nature)
Exemplary - आदर्श (Serving as a desirable model)
Gaudy - भड़कीला (Extravagantly bright or showy)
Source: CGL 2017 (09 Aug | Shift-I)
Hence, 'Natural' is the most suitable antonym for 'Meretricious'.`;

export const SAMPLE_HINDI_CONSTITUTION_ANALYSIS_TEXT = `1. 13 दिसंबर 1946 को संविधान सभा में 'उद्देश्य संकल्प' (Objective Resolution) किसने पेश किया था?
A) एस. एन. मुखर्जी /// एस. एन. मुखर्जी संविधान सभा के मुख्य प्रारूपकार (Chief Draftsman) थे। उन्होंने जटिल कानूनी प्रावधानों को संविधान की भाषा में ढालने का महत्वपूर्ण कार्य किया था, लेकिन वे 'उद्देश्य संकल्प' प्रस्तुत करने वाले नेता नहीं थे। उनकी भूमिका मुख्य रूप से प्रशासनिक और ड्राफ्टिंग कार्यों तक सीमित थी।
B) सुभाष चन्द्र बोस /// सुभाष चन्द्र बोस भारतीय स्वतंत्रता संग्राम के एक महान नायक और आजाद हिंद फौज के सर्वोच्च कमांडर थे। हालांकि, 13 दिसंबर 1946 को जब संविधान सभा का यह महत्वपूर्ण सत्र चल रहा था, तब वे सक्रिय रूप से सभा का हिस्सा नहीं थे। उनकी मृत्यु की गुत्थी और 1945 के बाद की उनकी अनुपस्थिति के कारण वे इस प्रक्रिया में शामिल नहीं हो सके।
C) डॉ. भीमराव अम्बेडकर /// डॉ. भीमराव अम्बेडकर को 'भारतीय संविधान का जनक' माना जाता है और वे प्रारूप समिति (Drafting Committee) के अध्यक्ष थे। उन्होंने संविधान के अंतिम स्वरूप को तैयार करने में सबसे बड़ी भूमिका निभाई, लेकिन 13 दिसंबर 1946 को 'उद्देश्य संकल्प' उन्होंने नहीं, बल्कि जवाहरलाल नेहरू ने पेश किया था। अंबेडकर की मुख्य भूमिका अगस्त 1947 के बाद शुरू हुई थी।
D) जवाहर लाल नेहरू ✅ /// पंडित जवाहरलाल नेहरू ने 13 दिसंबर 1946 को संविधान सभा के पहले सत्र में 'उद्देश्य प्रस्ताव' (Objective Resolution) पेश किया था। इस प्रस्ताव ने भावी संविधान के दर्शन, आदर्शों और मूलभूत सिद्धांतों को परिभाषित किया। यही संकल्प बाद में भारतीय संविधान की 'प्रस्तावना' (Preamble) का आधार बना।


Ex: 13 दिसंबर 1946 को पंडित जवाहरलाल नेहरू द्वारा पेश किया गया 'उद्देश्य संकल्प' भारतीय संविधान के इतिहास की एक ऐतिहासिक घटना है। इस प्रस्ताव ने स्पष्ट किया कि भारत एक स्वतंत्र, संप्रभु और गणराज्य (Sovereign Republic) होगा। इसमें सामाजिक, आर्थिक और राजनीतिक न्याय, अवसर की समानता और स्वतंत्रता के सिद्धांतों को रेखांकित किया गया था। संविधान सभा ने इस प्रस्ताव को 22 जनवरी 1947 को सर्वसम्मति से स्वीकार कर लिया था।


संविधान सभा का विचार सर्वप्रथम 1934 में एम.एन. रॉय (M.N. Roy) ने दिया था। आधिकारिक तौर पर 1935 में भारतीय राष्ट्रीय कांग्रेस ने इसकी मांग की, जिसे अंततः 1940 के 'अगस्त प्रस्ताव' के माध्यम से अंग्रेजों ने सैद्धांतिक रूप से स्वीकार किया। अंततः 1946 की 'कैबिनेट मिशन योजना' (Cabinet Mission Plan) के तहत संविधान सभा का गठन किया गया, जिसके सदस्यों का चुनाव प्रांतीय विधानसभाओं द्वारा अप्रत्यक्ष रूप से हुआ था।


प्रारंभ में संविधान सभा में 389 सदस्य थे, लेकिन 1947 में भारत के विभाजन के बाद यह संख्या घटकर 299 रह गई। सभा की पहली बैठक 9 दिसंबर 1946 को हुई थी, जिसकी अध्यक्षता अस्थायी अध्यक्ष के रूप में डॉ. सच्चिदानंद सिन्हा ने की थी। 11 दिसंबर 1946 को डॉ. राजेंद्र प्रसाद को स्थायी अध्यक्ष और एच.सी. मुखर्जी को उपाध्यक्ष चुना गया था। बी.एन. राव (B.N. Rau) को सभा का संवैधानिक सलाहकार नियुक्त किया गया था।


संविधान निर्माण की प्रक्रिया में कुल 2 वर्ष, 11 महीने और 18 दिन का समय लगा। इस दौरान 11 सत्र आयोजित किए गए। संविधान को 26 नवंबर 1949 को अपनाया (Adopt) गया था, जिसे 'संविधान दिवस' के रूप में मनाया जाता है। पूर्ण रूप से संविधान 26 जनवरी 1950 को लागू हुआ, क्योंकि 1930 में इसी दिन 'पूर्ण स्वराज' दिवस मनाया गया था।


परीक्षा की दृष्टि से महत्वपूर्ण अन्य तथ्य: 22 जुलाई 1947 को राष्ट्रीय ध्वज अपनाया गया, 24 जनवरी 1950 को राष्ट्रगान और राष्ट्रगीत अपनाए गए तथा डॉ. राजेंद्र प्रसाद को भारत के प्रथम राष्ट्रपति के रूप में चुना गया। मूल संविधान में 395 अनुच्छेद, 22 भाग और 8 अनुसूचियाँ थीं, जो वर्तमान में संशोधनों के बाद बढ़ गई हैं।
Source: दिल्ली पुलिस कांस्टेबल 2020 (07 दिसम्बर | शिफ्ट-II)


2. भारत का राष्ट्रगान अपने हिंदी संस्करण में कब अपनाया गया था?
A) 26 जनवरी 1950 /// 26 जनवरी 1950 को भारत का संविधान पूर्ण रूप से लागू हुआ और भारत एक गणतंत्र बना। हालांकि, राष्ट्रगान, राष्ट्रगीत और राष्ट्रपति के चुनाव जैसी महत्वपूर्ण घोषणाएं संविधान लागू होने से दो दिन पूर्व ही संविधान सभा की अंतिम बैठक में कर दी गई थीं। इसलिए 26 जनवरी सही तिथि नहीं है।
B) 24 जनवरी 1950 ✅ /// 24 जनवरी 1950 को संविधान सभा की अंतिम बैठक आयोजित की गई थी। इसी ऐतिहासिक दिन पर 'जन गण मन' को आधिकारिक रूप से भारत के राष्ट्रगान के रूप में और 'वंदे मातरम' को राष्ट्रगीत के रूप में अपनाया गया था। साथ ही इसी दिन डॉ. राजेंद्र प्रसाद को भारत का प्रथम राष्ट्रपति चुना गया था।
C) 2 अक्टूबर 1948 /// 2 अक्टूबर महात्मा गांधी की जयंती है, जिसे अंतर्राष्ट्रीय अहिंसा दिवस के रूप में मनाया जाता है। इस तिथि का राष्ट्रगान को अपनाने की प्रक्रिया से कोई सीधा प्रशासनिक संबंध नहीं है। संविधान सभा के कार्यों की समयरेखा में यह तिथि राष्ट्रगान के संदर्भ में महत्वपूर्ण नहीं है।
D) 15 अगस्त 1947 /// 15 अगस्त 1947 को भारत को ब्रिटिश शासन से स्वतंत्रता प्राप्त हुई थी। हालांकि इस दिन लाल किले पर झंडा फहराया गया और उत्सव मनाया गया, लेकिन 'जन गण मन' को संवैधानिक रूप से राष्ट्रगान का दर्जा मिलने की प्रक्रिया 1950 में पूरी हुई थी। 1947 में यह केवल एक लोकप्रिय देशभक्ति गीत था।


Ex: भारत का राष्ट्रगान 'जन गण मन' मूल रूप से गुरुदेव रवींद्रनाथ टैगोर द्वारा बंगाली भाषा में 'भारोतो भाग्यो बिधाता' के नाम से रचा गया था। इसके हिंदी और उर्दू रूपांतरण को 24 जनवरी 1950 को संविधान सभा द्वारा राष्ट्रगान के रूप में स्वीकार किया गया। टैगोर दुनिया के एकमात्र ऐसे कवि हैं जिनकी रचनाओं को दो देशों (भारत और बांग्लादेश) ने अपने राष्ट्रगान के रूप में अपनाया है।


राष्ट्रगान को पहली बार सार्वजनिक रूप से 27 दिसंबर 1911 को भारतीय राष्ट्रीय कांग्रेस के कलकत्ता (अब कोलकाता) अधिवेशन में गाया गया था। इसकी धुन और संगीत को व्यवस्थित करने का श्रेय कैप्टन राम सिंह ठाकुर को जाता है। राष्ट्रगान का हिंदी अनुवाद कैप्टन आबिद अली द्वारा किया गया था, जो आजाद हिंद फौज (INA) से जुड़े थे।


संवैधानिक नियमों के अनुसार, राष्ट्रगान के पूर्ण संस्करण को गाने की मानक अवधि लगभग 52 सेकंड निर्धारित है। विशेष अवसरों पर इसका संक्षिप्त संस्करण (पहली और अंतिम पंक्ति) भी गाया जाता है, जिसमें लगभग 20 सेकंड का समय लगता है। राष्ट्रगान गाते समय सावधान की मुद्रा में खड़े होना और इसके प्रति सम्मान प्रदर्शित करना प्रत्येक नागरिक का मौलिक कर्तव्य है।


परीक्षा उपयोगी तथ्यों में यह ध्यान रखना आवश्यक है कि राष्ट्रगान 'जन गण मन' है, जबकि राष्ट्रगीत 'वंदे मातरम' (बंकिम चंद्र चटर्जी द्वारा रचित) है। दोनों को एक ही दिन, यानी 24 जनवरी 1950 को अपनाया गया था। यह तिथि संविधान सभा के अस्तित्व के अंतिम दिन के रूप में भी महत्वपूर्ण है, जिसके बाद इसे अनंतिम संसद (Provisional Parliament) में बदल दिया गया था।


प्रतियोगी परीक्षाओं में अक्सर 1911 का कलकत्ता अधिवेशन, टैगोर की रचना और 24 जनवरी 1950 की तिथि से जुड़े प्रश्न पूछे जाते हैं। छात्रों को राष्ट्रगान और राष्ट्रगीत के रचनाकारों और उनके अपनाए जाने की तिथियों के बीच के सूक्ष्म अंतर को स्पष्ट रूप से याद रखना चाहिए।
Source: एमटीएस 2019 (07 अगस्त | शिफ्ट-I)`;

export const SAMPLE_FORMAT1_AND_2_COMBINED_TEXT = `${SAMPLE_HINDI_CONSTITUTION_ANALYSIS_TEXT}\n\n${SAMPLE_VOCAB_DETAILED_ANALYSIS_TEXT}`;

export const TestFormatGuideModal: React.FC<TestFormatGuideModalProps> = ({
  isOpen,
  onClose,
  onLoadSampleIntoEditor
}) => {
  const [activeTab, setActiveTab] = useState<"format1" | "format2" | "combined" | "bilingual" | "general" | "math">("format1");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentSampleText =
    activeTab === "format1"
      ? SAMPLE_HINDI_CONSTITUTION_ANALYSIS_TEXT
      : activeTab === "format2"
      ? SAMPLE_VOCAB_DETAILED_ANALYSIS_TEXT
      : activeTab === "combined"
      ? SAMPLE_FORMAT1_AND_2_COMBINED_TEXT
      : activeTab === "bilingual"
      ? SAMPLE_BILINGUAL_PROFIT_TEST_TEXT
      : activeTab === "math"
      ? SAMPLE_MATH_TEST_TEXT
      : SAMPLE_SSC_TEST_TEXT;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSampleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="test-format-guide-modal"
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150"
    >
      <div className="bg-white border border-gray-200 rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col relative overflow-hidden">
        {/* Top Header Accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#009CFC] via-indigo-500 to-amber-500" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>SSC / CBT .txt Test Format Guide</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                  MathJax & LaTeX Supported
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Attach .txt files or paste questions. Supports LaTeX formulas, MathJax, and HTML entities.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Main Format Rule Card (Bilingual / Hindi & English) */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Format Standard: Question, Options, Answer, Explanation & Bold Syntax</span>
              </span>
              <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                Standard Rule
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-white p-3 rounded-xl border border-indigo-150 space-y-1.5 font-mono text-[11px] leading-relaxed">
                <div className="text-blue-700 font-bold">Q1. Question text here with **important bold term**</div>
                <div className="text-emerald-700">  (A) Option 1 text</div>
                <div className="text-emerald-700">  (B) Option 2 text</div>
                <div className="text-emerald-700">  (C) Option 3 text</div>
                <div className="text-emerald-700">  (D) Option 4 text</div>
                <div className="text-purple-700 font-bold">Ans: (A) Option 1 text</div>
                <div className="text-amber-800">Ex: Explanation text with **bold keywords** or formulas...</div>
                <div className="text-gray-500">Source: [SSC CGL 2024 / Book Name]</div>
              </div>

              <div className="space-y-2 text-slate-700">
                <p className="font-semibold leading-relaxed">
                  <strong>हिंदी व English फ़ॉर्मेट नियम:</strong>
                </p>
                <ul className="space-y-1 text-[11px] leading-snug">
                  <li><strong>Question:</strong> हमेशा <code className="bg-white px-1.5 py-0.5 rounded font-bold text-blue-700 border border-indigo-100">Q1. </code>, <code className="bg-white px-1.5 py-0.5 rounded font-bold text-blue-700 border border-indigo-100">Q2. </code> या <code className="bg-white px-1.5 py-0.5 rounded font-bold text-blue-700 border border-indigo-100">1. </code> से शुरू करें।</li>
                  <li><strong>Options:</strong> विकल्प <code className="bg-white px-1.5 py-0.5 rounded font-bold text-emerald-700 border border-indigo-100">(A)</code>, <code className="bg-white px-1.5 py-0.5 rounded font-bold text-emerald-700 border border-indigo-100">(B)</code>, <code className="bg-white px-1.5 py-0.5 rounded font-bold text-emerald-700 border border-indigo-100">(C)</code>, <code className="bg-white px-1.5 py-0.5 rounded font-bold text-emerald-700 border border-indigo-100">(D)</code> (या 1, 2, 3, 4) से शुरू करें।</li>
                  <li><strong>Bold Formatting:</strong> जिस शब्द या वाक्य को गहरा/बोल्ड करना हो, उसे <code className="bg-white px-1.5 py-0.5 rounded font-bold text-indigo-700 border border-indigo-100">** **</code> के बीच लिखें (जैसे: <code className="bg-white px-1.5 py-0.5 rounded font-bold text-indigo-700 border border-indigo-100">**bold text**</code>)।</li>
                  <li><strong>Answer:</strong> सही उत्तर <code className="bg-white px-1.5 py-0.5 rounded font-bold text-purple-700 border border-indigo-100">Ans: (A)</code> या <code className="bg-white px-1.5 py-0.5 rounded font-bold text-purple-700 border border-indigo-100">उत्तर: (B)</code> लिखें।</li>
                  <li><strong>Explanation:</strong> व्याख्या <code className="bg-white px-1.5 py-0.5 rounded font-bold text-amber-800 border border-indigo-100">Ex: </code> या <code className="bg-white px-1.5 py-0.5 rounded font-bold text-amber-800 border border-indigo-100">व्याख्या: </code> से शुरू करें।</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Antonyms & Synonyms Vocab Rule Card */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 border-2 border-amber-300 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-amber-950 tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Antonyms, Synonyms & Option Analysis Format (विलोम शब्द व विस्तृत व्याख्या)</span>
              </span>
              <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                Vocab Special
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1 font-mono text-[11px] leading-relaxed">
                <div className="text-blue-700 font-bold">1. Select the word opposite in meaning to: Puissant</div>
                <div className="text-emerald-700 font-bold">A) Feeble ✅ /// Direct opposite of powerful...</div>
                <div className="text-amber-800 text-[10px]">Synonyms: Weak (कमज़ोर), Fragile (नाज़ुक)</div>
                <div className="text-amber-800 text-[10px]">Antonyms: Robust (मज़बूत), Powerful (शक्तिशाली)</div>
                <div className="text-emerald-700">B) Robust /// Refers to strong and healthy...</div>
                <div className="text-emerald-700">C) Powerful /// Direct synonym of puissant...</div>
                <div className="text-emerald-700">D) Strong /// Refers to physical power...</div>
                <div className="text-amber-900 font-bold">Ex: Puissant - शक्तिशाली, Feeble - कमज़ोर...</div>
                <div className="text-gray-500">Source: [CGL 2025]</div>
              </div>

              <div className="space-y-2 text-slate-700">
                <p className="font-semibold leading-relaxed">
                  <strong>विलोम व पर्यायवाची प्रारूप की विशेषताएं:</strong>
                </p>
                <ul className="space-y-1 text-[11px] leading-snug">
                  <li><strong>Triple Slash (///):</strong> विकल्प के तुरंत बाद <code className="bg-white px-1.5 py-0.5 rounded font-bold text-amber-700 border border-amber-200">///</code> लगाकर विकल्प का अर्थ या विश्लेषण लिखें।</li>
                  <li><strong>Synonyms & Antonyms:</strong> प्रत्येक विकल्प के नीचे अलग लाइन पर <code className="bg-white px-1 py-0.5 rounded font-bold text-amber-900 border border-amber-200">Synonyms: ...</code> और <code className="bg-white px-1 py-0.5 rounded font-bold text-amber-900 border border-amber-200">Antonyms: ...</code> लिख सकते हैं।</li>
                  <li><strong>Checkmark (✅):</strong> सही विकल्प के साथ <code className="bg-white px-1.5 py-0.5 rounded font-bold text-emerald-700 border border-amber-200">✅</code> लगा देने पर वही सही उत्तर मान लिया जाएगा।</li>
                  <li><strong>Student Portal में:</strong> छात्र को टेस्ट सबमिट करने के बाद प्रत्येक विकल्प का Antonym/Synonym रंगीन कार्ड्स में व्यवस्थित दिखता है।</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Format Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-black uppercase text-blue-900 block">1. Header (Optional)</span>
              <p className="text-[11px] text-blue-950 leading-snug">
                Put title, <code className="bg-white px-1 rounded font-bold">ID:</code>, and <code className="bg-white px-1 rounded font-bold">Total Questions:</code> between <code className="bg-white px-1 rounded font-bold">===</code> lines.
              </p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-900 block">2. Options & Ans:</span>
              <p className="text-[11px] text-emerald-950 leading-snug">
                Supports <code className="bg-white px-1 rounded font-bold">(A), (B), (C), (D)</code>, LaTeX math options, and <code className="bg-white px-1 rounded font-bold">Ans: (B)</code>.
              </p>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-900 block">3. MathJax & LaTeX</span>
              <p className="text-[11px] text-amber-950 leading-snug">
                Use <code className="bg-white px-1 rounded font-bold">\(\frac{'{a}'}{'{b}'}\)</code>, <code className="bg-white px-1 rounded font-bold">$$...$$</code>, <code className="bg-white px-1 rounded font-bold">225°</code> or <code className="bg-white px-1 rounded font-bold">&deg;</code>.
              </p>
            </div>
          </div>

          {/* Sample Format Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("format1")}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "format1"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🏛️ Format 1: Hindi GS (/// + ✅)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("format2")}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "format2"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              📖 Format 2: Vocab Antonyms & Synonyms (///)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("combined")}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "combined"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ⚡ Format 1 & 2 Combined (दोनों प्रारूप साथ में)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bilingual")}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "bilingual"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🌐 Bilingual (English + Hindi)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "general"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              📝 English CBT
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("math")}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "math"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              📐 Math LaTeX
            </button>
          </div>

          {/* Sample Text Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {activeTab === "format1"
                    ? "Format 1: Hindi GS & Detailed Option Analysis (/// + ✅ + Multi-para Ex) (.txt):"
                    : activeTab === "format2"
                    ? "Format 2: Antonyms & Synonyms / Vocab Analysis (/// + Synonyms/Antonyms) (.txt):"
                    : activeTab === "combined"
                    ? "Format 1 & Format 2 Combined (Mixed Question Styles in One .txt):"
                    : activeTab === "bilingual"
                    ? "Bilingual SSC 2025 Test Text (.txt):"
                    : activeTab === "math"
                    ? "Math Trigonometry / LaTeX Sample (.txt):"
                    : "Example SSC 2025 Test Text (.txt):"}
                </span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-indigo-200 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied Sample!" : "Copy Sample Format"}</span>
                </button>
                {onLoadSampleIntoEditor && (
                  <button
                    type="button"
                    onClick={() => {
                      onLoadSampleIntoEditor(currentSampleText);
                      onClose();
                    }}
                    className="bg-[#009CFC] hover:bg-[#e05a2b] text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span>Load This Sample</span>
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[260px] border border-slate-800 shadow-inner select-all">
                {currentSampleText}
              </pre>
            </div>
          </div>

          {/* Quick Syntax Rules */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#009CFC]" />
              <span>Key Syntax Rules at a Glance</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Math & Formulas:</strong> Inline formulas like <code className="bg-white px-1 rounded border border-slate-200 font-mono">\(\frac{'{5\\pi}'}{'{4}'}\)</code>, <code className="bg-white px-1 rounded border border-slate-200 font-mono">\(\sec^6\theta\)</code> or display formulas like <code className="bg-white px-1 rounded border border-slate-200 font-mono">$$\frac{'{...}'}{'{...}'}$$</code> render with high quality MathJax.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Bilingual Support:</strong> Hindi questions directly beneath the English question line or inside <code className="bg-white px-1 rounded border border-slate-200 font-mono">[Hindi / हिन्दी व्याख्या]:</code> explanation blocks are fully supported.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Questions:</strong> Start each question with <code className="bg-white px-1 rounded border border-slate-200 font-mono">Q1. </code>, <code className="bg-white px-1 rounded border border-slate-200 font-mono">Q1: </code>, or <code className="bg-white px-1 rounded border border-slate-200 font-mono">1. </code> (bolding like <code className="bg-white px-1 rounded border border-slate-200 font-mono">**Q1. ...**</code> is also supported).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Options:</strong> <code className="bg-white px-1 rounded border border-slate-200 font-mono">(A) option</code>, <code className="bg-white px-1 rounded border border-slate-200 font-mono">(B) option</code>, <code className="bg-white px-1 rounded border border-slate-200 font-mono">(C) option</code>, <code className="bg-white px-1 rounded border border-slate-200 font-mono">(D) option</code> (or 1, 2, 3, 4).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Answer:</strong> <code className="bg-white px-1 rounded border border-slate-200 font-mono">Ans: (C) affected by</code> or <code className="bg-white px-1 rounded border border-slate-200 font-mono">Ans: (B) \(\sin^6\theta\)</code> or inline <code className="bg-white px-1 rounded border border-slate-200 font-mono">✅</code> checkmark.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Explanation:</strong> <code className="bg-white px-1 rounded border border-slate-200 font-mono">Ex: Explanation text...</code> (multi-line formulas and bullet points are preserved).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Source:</strong> <code className="bg-white px-1 rounded border border-slate-200 font-mono">Source: [CGL, 12 Sep 2025, Shift 2]</code> or <code className="bg-white px-1 rounded border border-slate-200 font-mono">Source: SSC CGL 2025</code>.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
