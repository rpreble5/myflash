/* challenge.js — the Challenge: ten topics on a path, beaten one at a
   time. Each run gives HEARTS hearts and every card scored short of a
   clean sweep costs one; run out and the topic is failed and can be
   retried. Beating all ten beats the challenge.

   Separate from the study decks on purpose: nothing here feeds the
   strength model, and the study decks do not feed this. Only objective
   card types belong here — nothing that asks the reader to grade
   themselves. Allowed: mcq, multi, truefalse, number, trend, bucket,
   match.

   The cards below are PLACEHOLDERS so the path can be walked while the
   real questions are written. Replace topic by topic. */

(function (global) {
  'use strict';

  var HEARTS = 7;

  var TOPICS = [
    {
      id: 'ch-cardio',
      name: 'Cardiology',
      cards: [
        { type: 'mcq', q: 'Which murmur gets louder with Valsalva?',
          a: 'Hypertrophic cardiomyopathy', distractors: ['Aortic stenosis', 'Mitral regurgitation', 'Ventricular septal defect'] },
        { type: 'number', q: 'LVEF at or below which heart failure is called reduced ejection fraction?', value: 40, unit: '%' },
        { type: 'truefalse', q: 'A new left bundle branch block with chest pain is treated as a STEMI equivalent.', a: true }
      ]
    },
    {
      id: 'ch-endo',
      name: 'Endocrine',
      cards: [
        { type: 'number', q: 'HbA1c at or above which diabetes is diagnosed?', value: 6.5, unit: '%' },
        { type: 'mcq', q: 'First-line drug for Graves disease in the first trimester of pregnancy?',
          a: 'Propylthiouracil', distractors: ['Methimazole', 'Radioactive iodine', 'Levothyroxine'] },
        { type: 'truefalse', q: 'Subclinical hypothyroidism with a TSH of 6 and no symptoms is routinely treated.', a: false }
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
        { type: 'number', q: 'Gestational age in weeks at which routine gestational diabetes screening is done?', values: [24, 28], join: '–', unit: 'weeks' },
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
