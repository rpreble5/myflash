/* challenge.js — the Challenge: ten topics on a path, beaten one at a
   time. Each run gives HEARTS hearts and every card scored short of a
   clean sweep costs one; run out and the topic is failed and can be
   retried. Beating all ten beats the challenge.

   Separate from the study decks on purpose: nothing here feeds the
   strength model, and the study decks do not feed this. Only objective
   card types belong here — nothing that asks the reader to grade
   themselves. Allowed: mcq, multi, truefalse, number, trend, bucket,
   match.

   Cardiology and Endocrine carry sample questions for the demo; the
   other eight hold PLACEHOLDERS so the path can be walked while the
   real questions are written. Replace topic by topic. */

(function (global) {
  'use strict';

  var HEARTS = 7;

  var TOPICS = [
    {
      id: 'ch-cardio',
      name: 'Cardiology',
      /* Art: assets/baddies/<baddie>-{map,taunt,hit,down}.webp */
      baddie: 'ch-cardio',
      cards: [
        { type: 'mcq', q: 'A 62-year-old has crushing chest pain, ST elevation in II, III and aVF, and a BP of 84/50. Which drug do you hold?',
          a: 'Nitroglycerin', distractors: ['Aspirin', 'Heparin', 'Clopidogrel'],
          why: 'An inferior MI with hypotension suggests the right ventricle is involved. The RV is preload-dependent, so nitrates can drop the pressure further. Give fluids and get him to the cath lab.' },
        { type: 'number', q: 'Target time from first medical contact to balloon for primary PCI?', value: 90, unit: 'minutes',
          why: '120 minutes when the patient has to be transferred. If PCI cannot happen within that, fibrinolysis within 30 minutes of arrival is the alternative.' },
        { type: 'truefalse', q: 'Troponin can be normal in the first two hours of a myocardial infarction.', a: true,
          why: 'It starts to rise two to three hours after the injury. That is why a single early troponin never rules out an MI and why the ECG, not the lab, decides who goes to the cath lab.' },
        { type: 'multi', q: 'Which drugs lower mortality in heart failure with reduced ejection fraction?',
          answers: ['Sacubitril/valsartan', 'Carvedilol', 'Spironolactone', 'Dapagliflozin'],
          distractors: ['Furosemide', 'Digoxin'],
          why: 'The four pillars. Loop diuretics relieve congestion and digoxin reduces admissions, but neither changes survival.' },
        { type: 'trend', q: 'The hypertrophic cardiomyopathy murmur with each maneuver', items: [
          { label: 'Valsalva', dir: 'up' },
          { label: 'Standing', dir: 'up' },
          { label: 'Squatting', dir: 'down' },
          { label: 'Handgrip', dir: 'down' }
        ], why: 'Anything that shrinks the left ventricle brings the septum and mitral leaflet closer and worsens the obstruction. Squatting and handgrip fill or load the ventricle and relieve it. Aortic stenosis does the opposite.' },
        { type: 'mcq', q: 'A 70-year-old man has atrial fibrillation, hypertension and type 2 diabetes. What is his CHA₂DS₂-VASc score?',
          a: '3', distractors: ['2', '4', '5'],
          why: 'One point each for age 65–74, hypertension and diabetes. Age 75 and over or a prior stroke would score two.' },
        { type: 'number', q: 'In a man with atrial fibrillation, anticoagulation is recommended from what CHA₂DS₂-VASc score?', value: 2,
          why: 'At 1 it is reasonable to consider. Women score one extra point for sex, so the thresholds are 3 to recommend and 2 to consider.' },
        { type: 'match', q: 'Match the valve lesion to its murmur', pairs: [
          { left: 'Aortic stenosis', right: 'Harsh systolic, neck' },
          { left: 'Mitral regurgitation', right: 'Holosystolic, axilla' },
          { left: 'Aortic regurgitation', right: 'Diastolic decrescendo' },
          { left: 'Mitral stenosis', right: 'Diastolic rumble, snap' }
        ] },
        { type: 'truefalse', q: 'White-coat hypertension confirmed by normal home readings does not need medication.', a: true,
          why: 'It is not treated, but it is not benign either: these patients progress to sustained hypertension more often, so they get lifestyle advice and yearly out-of-office readings.' },
        { type: 'mcq', q: 'A 58-year-old is leaving hospital after an NSTEMI. Which statin intensity does he go home on?',
          a: 'High-intensity', distractors: ['Moderate-intensity', 'Low-intensity', 'Enough to get LDL under 100'],
          why: 'Established atherosclerotic disease gets high-intensity statin regardless of the starting LDL: atorvastatin 40–80 or rosuvastatin 20–40.' },
        { type: 'bucket', q: 'Which blood pressure drug fits the patient?', bins: ['ACE inhibitor', 'Thiazide'], items: [
          { label: 'Diabetes with albuminuria', bin: 'ACE inhibitor' },
          { label: 'Recurrent kidney stones', bin: 'Thiazide' },
          { label: 'Reduced ejection fraction', bin: 'ACE inhibitor' },
          { label: 'Osteoporosis', bin: 'Thiazide' },
          { label: 'Bilateral renal artery stenosis', bin: 'Thiazide' }
        ], why: 'Thiazides cut urinary calcium, which helps both stones and bone. ACE inhibitors protect the diabetic kidney and the failing heart but can drop the GFR sharply when both renal arteries are narrowed.' },
        { type: 'number', q: 'Ejection fraction at or below which a primary-prevention ICD is considered in HFrEF?', value: 35, unit: '%',
          why: 'After at least three months of optimal medical therapy, with NYHA class II–III symptoms and more than a year of expected survival.' }

      ]
    },
    {
      id: 'ch-endo',
      name: 'Endocrine',
      /* Demo of the kawaii style, on loan until Endocrine has its own. */
      baddie: 'heart-kawaii',
      baddieFace: true,   // also has the close-up and nervous poses
      cards: [
        { type: 'number', q: 'Fasting glucose at or above which diabetes is diagnosed?', value: 126, unit: 'mg/dL',
          why: 'Or an A1c of 6.5% or more, a two-hour glucose of 200 or more on a tolerance test, or a random glucose of 200 or more with symptoms. An abnormal result without symptoms is confirmed with a second test.' },
        { type: 'mcq', q: 'A 45-year-old with type 2 diabetes has a BMI of 34 and an A1c of 8.2% on metformin. What do you add?',
          a: 'A GLP-1 receptor agonist', distractors: ['A sulfonylurea', 'Basal insulin', 'Pioglitazone'],
          why: 'Weight is the problem to solve alongside the glucose. GLP-1 agonists lower both; sulfonylureas and insulin add weight and hypoglycemia, and pioglitazone adds fluid and weight.' },
        { type: 'truefalse', q: 'With heart failure or CKD, an SGLT2 inhibitor is added in type 2 diabetes whatever the A1c.', a: true,
          why: 'The benefit on heart failure admissions and kidney decline is independent of glucose lowering, so it is added even when the A1c is already at goal.' },
        { type: 'multi', q: 'Which findings favor type 1 over type 2 diabetes in an adult?',
          answers: ['Positive GAD antibodies', 'Low C-peptide', 'Ketoacidosis at diagnosis'],
          distractors: ['Acanthosis nigricans', 'BMI over 30'],
          why: 'Antibodies and a low C-peptide show the islets are being destroyed rather than resisted. Adults with type 1 are often misdiagnosed as type 2 for years.' },
        { type: 'trend', q: 'Untreated Graves disease', items: [
          { label: 'TSH', dir: 'down' },
          { label: 'Free T4', dir: 'up' },
          { label: 'Radioiodine uptake', dir: 'up' },
          { label: 'TSH receptor antibody', dir: 'up' }
        ], why: 'The gland is being driven by an antibody, so it is overactive and takes up iodine avidly. Thyroiditis gives the same TSH and T4 but low uptake, because the hormone is leaking out, not being made.' },
        { type: 'mcq', q: 'An outpatient has fatigue and weight gain and you suspect her thyroid. Which test do you order first?',
          a: 'TSH', distractors: ['Free T4', 'Total T3', 'Thyroid ultrasound'],
          why: 'TSH is the most sensitive test for a primary thyroid problem. Free T4 is added when the TSH is abnormal or when a pituitary cause is suspected.' },
        { type: 'number', q: 'After changing a levothyroxine dose, how many weeks before you recheck the TSH?', values: [6, 8], join: '–', unit: 'weeks',
          why: 'TSH takes that long to settle after a change. Checking sooner leads to chasing a number that is still moving.' },
        { type: 'match', q: 'Match the lab pattern to the diagnosis', pairs: [
          { left: 'TSH high, T4 low', right: 'Primary hypothyroid' },
          { left: 'TSH low, T4 high', right: 'Hyperthyroid' },
          { left: 'TSH low, T4 low', right: 'Central hypothyroid' },
          { left: 'TSH high, T4 normal', right: 'Subclinical hypo' }
        ] },
        { type: 'truefalse', q: 'Methimazole is the preferred antithyroid drug outside the first trimester of pregnancy.', a: true,
          why: 'Propylthiouracil is used only in the first trimester, because methimazole causes birth defects then; after that the risk of PTU liver failure outweighs it.' },
        { type: 'bucket', q: 'Too much cortisol or too little?', bins: ['Cushing', 'Addison'], items: [
          { label: 'Hyperpigmentation', bin: 'Addison' },
          { label: 'Postural hypotension', bin: 'Addison' },
          { label: 'Central obesity', bin: 'Cushing' },
          { label: 'Hyperkalemia', bin: 'Addison' },
          { label: 'Purple striae', bin: 'Cushing' },
          { label: 'Hyperglycemia', bin: 'Cushing' }
        ], why: 'In Addison disease the pituitary pours out ACTH, which also stimulates melanocytes, and aldosterone is lost too, so potassium rises and the pressure falls.' },
        { type: 'number', q: 'Correcting calcium for albumin: how much do you add per 1 g/dL that albumin is below 4?', value: 0.8, unit: 'mg/dL',
          why: 'Or skip the arithmetic and measure ionized calcium, which is what matters anyway.' },
        { type: 'mcq', q: 'A 30-year-old woman has hypertension, a potassium of 3.1 and a high aldosterone-to-renin ratio. What is the diagnosis?',
          a: 'Primary aldosteronism', distractors: ['Pheochromocytoma', 'Cushing syndrome', 'Renal artery stenosis'],
          why: 'Aldosterone high with renin suppressed means the adrenal is acting on its own. Renal artery stenosis also raises aldosterone, but through high renin, so the ratio is normal.' }

      ]
    },
    {
      id: 'ch-pulm',
      name: 'Pulmonary',
      cards: [
        { type: 'mcq', q: 'FEV1/FVC ratio that defines airflow obstruction on spirometry?',
          a: 'Below 0.70', distractors: ['Below 0.80', 'Below 0.60', 'Below 0.50'] },
        { type: 'truefalse', q: 'Long-term oxygen improves survival in COPD when resting SpO2 is 88% or lower.', a: true },
        { type: 'multi', q: 'Which are features of a high-risk community-acquired pneumonia on CURB-65?',
          answers: ['Confusion', 'Respiratory rate 30 or more', 'Age 65 or older'], distractors: ['Fever over 39', 'Productive cough'] }
      ]
    },
    {
      id: 'ch-gi',
      name: 'Gastro',
      cards: [
        { type: 'mcq', q: 'First-line test for Helicobacter pylori in a patient not on a PPI?',
          a: 'Urea breath test', distractors: ['Serology', 'Upper endoscopy', 'Fecal calprotectin'] },
        { type: 'truefalse', q: 'Alarm features such as weight loss or dysphagia with dyspepsia call for endoscopy before a PPI trial.', a: true },
        { type: 'number', q: 'Age at which average-risk colorectal cancer screening starts?', value: 45, unit: 'years' }
      ]
    },
    {
      id: 'ch-renal',
      name: 'Renal',
      cards: [
        { type: 'mcq', q: 'Earliest ECG change of hyperkalemia?',
          a: 'Peaked T waves', distractors: ['Widened QRS', 'U waves', 'Prolonged QT'] },
        { type: 'number', q: 'eGFR below which chronic kidney disease is stage 3?', value: 60, unit: 'mL/min' },
        { type: 'truefalse', q: 'A creatinine rise of 20% after starting an ACE inhibitor means it should be stopped.', a: false }
      ]
    },
    {
      id: 'ch-women',
      name: "Women's Health",
      cards: [
        { type: 'number', q: 'At what gestational age is routine gestational diabetes screening done?', values: [24, 28], join: '–', unit: 'weeks' },
        { type: 'mcq', q: 'Most effective reversible contraceptive?',
          a: 'Levonorgestrel IUD', distractors: ['Combined pill', 'Depot medroxyprogesterone', 'Contraceptive patch'] },
        { type: 'truefalse', q: 'Cervical screening starts at age 21 regardless of sexual history.', a: true }
      ]
    },
    {
      id: 'ch-peds',
      name: 'Pediatrics',
      cards: [
        { type: 'mcq', q: 'Age by which most children walk independently?',
          a: '15 months', distractors: ['9 months', '12 months', '18 months'] },
        { type: 'truefalse', q: 'Fluoride varnish is applied in primary care from the first tooth until age 5.', a: true },
        { type: 'number', q: 'Temperature in °C at or above which a fever in an infant under 28 days needs a full sepsis workup?', value: 38, unit: '°C' }
      ]
    },
    {
      id: 'ch-msk',
      name: 'Musculoskeletal',
      cards: [
        { type: 'multi', q: 'Which findings are part of the Ottawa ankle rules?',
          answers: ['Tenderness at the posterior malleolus', 'Unable to bear weight four steps', 'Tenderness at the base of the 5th metatarsal'],
          distractors: ['Swelling over the lateral malleolus', 'Bruising within 24 hours'] },
        { type: 'mcq', q: 'First-line treatment for an acute gout flare in a patient with normal kidneys?',
          a: 'NSAID or colchicine', distractors: ['Allopurinol', 'Febuxostat', 'Probenecid'] },
        { type: 'truefalse', q: 'A T-score of −2.0 diagnoses osteoporosis.', a: false }
      ]
    },
    {
      id: 'ch-neuro-psych',
      name: 'Neuro & Psych',
      cards: [
        { type: 'mcq', q: 'First-line preventive medication for migraine with comorbid hypertension?',
          a: 'Propranolol', distractors: ['Sumatriptan', 'Topiramate', 'Amitriptyline'] },
        { type: 'number', q: 'PHQ-9 score at or above which depression is considered moderate?', value: 10 },
        { type: 'truefalse', q: 'Bell palsy spares the forehead on the affected side.', a: false }
      ]
    },
    {
      id: 'ch-id',
      name: 'Infectious Disease',
      cards: [
        { type: 'mcq', q: 'First-line antibiotic for uncomplicated cystitis in a non-pregnant woman?',
          a: 'Nitrofurantoin', distractors: ['Ciprofloxacin', 'Amoxicillin', 'Doxycycline'] },
        { type: 'number', q: 'Ages between which routine one-time HIV screening is recommended?', values: [15, 65], join: '–', unit: 'years' },
        { type: 'truefalse', q: 'A positive Centor score of 4 means antibiotics without testing.', a: false }
      ]
    }
  ];

  global.Challenge = { HEARTS: HEARTS, TOPICS: TOPICS };
})(window);
