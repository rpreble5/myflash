/* decks.js — built-in sample decks.

   Cards are typed. The type determines the interaction; the theme layer
   still randomizes the look on every render.

     recall     { q, a, why? }
     mcq        { q, a, distractors[] }              exactly one right
     multi      { q, answers[], distractors[], why? } select all that apply
     truefalse  { q, a:bool, why }
     number     { q, value, unit, tolerance, step?, min?, max? }
     number     { q, low, high, unit, step?, min?, max? }
     trend      { q, items:[{label, dir:'up'|'down'|'same'}] }
     bucket     { q, bins:[], items:[{label, bin}] }
     order      { q, steps:[] }                    stored in correct order
     match      { q, pairs:[{left, right}] }

   `ref` is optional on any card and will carry the source citation once
   decks are model-generated. Sample content is standard teaching material;
   these are a study aid, not a clinical reference.                        */

(function (global) {
  'use strict';

  var BUILTIN = [
    {
      id: 'tflab',
      name: 'TF LAB',
      blurb: 'True or false — swipe left or right, with and without notes',
      cards: [
        /* No note: the card ends on the buttons alone. */
        { type: 'truefalse', q: 'Naloxone reverses benzodiazepine overdose', a: false },
        { type: 'truefalse', q: 'The vagus nerve is cranial nerve X', a: true },

        /* Short note: renders inline under the buttons. */
        { type: 'truefalse', q: 'In a pure respiratory disorder, pH and PaCO₂ move in opposite directions', a: true,
          why: 'Rising CO₂ drives pH down; falling CO₂ drives pH up.' },
        { type: 'truefalse', q: 'A normal anion gap rules out a metabolic acidosis', a: false,
          why: 'Hyperchloraemic acidoses — diarrhoea, RTA — run a normal gap.' },

        /* Long note: folds behind a WHY? toggle, which must not count as
           the tap that continues. */
        { type: 'truefalse', q: 'Live attenuated vaccines are safe in pregnancy', a: false,
          why: 'Live vaccines — MMR, varicella, intranasal influenza — are contraindicated in pregnancy and in significant immunosuppression, on the theoretical risk of fetal infection. Inactivated vaccines, including Tdap and influenza by injection, are not only safe but actively recommended.' },
        { type: 'truefalse', q: 'Epinephrine is the first-line treatment for anaphylaxis', a: true,
          why: 'Intramuscular epinephrine into the anterolateral thigh comes first and comes early. Antihistamines and steroids treat the rash and may blunt a biphasic reaction, but neither reverses airway oedema or shock, and reaching for them first is the classic fatal delay.' }
      ]
    },
    {
      id: 'trendlab',
      name: 'TREND LAB',
      blurb: 'Up, down or unchanged — two rows up to five, long labels included',
      cards: [
        /* Two rows, and the one case where "unchanged" is the whole point. */
        { type: 'trend', q: 'Subclinical hypothyroidism', items: [
          { label: 'TSH', dir: 'up' },
          { label: 'Free T4', dir: 'same' }
        ] },
        { type: 'trend', q: 'Primary hyperparathyroidism', items: [
          { label: 'Serum calcium', dir: 'up' },
          { label: 'Serum phosphate', dir: 'down' }
        ] },

        /* Three rows. */
        { type: 'trend', q: 'Acute respiratory acidosis', items: [
          { label: 'pH', dir: 'down' },
          { label: 'PaCO₂', dir: 'up' },
          { label: 'HCO₃⁻', dir: 'up' }
        ] },
        { type: 'trend', q: 'Septic (distributive) shock', items: [
          { label: 'CVP / preload', dir: 'down' },
          { label: 'SVR', dir: 'down' },
          { label: 'Cardiac output', dir: 'up' }
        ] },

        /* Four rows, and four with labels long enough to crowd the arrows. */
        { type: 'trend', q: 'Disseminated intravascular coagulation', items: [
          { label: 'Platelets', dir: 'down' },
          { label: 'PT', dir: 'up' },
          { label: 'PTT', dir: 'up' },
          { label: 'Fibrinogen', dir: 'down' }
        ] },
        { type: 'trend', q: 'Intravascular hemolysis', items: [
          { label: 'LDH', dir: 'up' },
          { label: 'Haptoglobin', dir: 'down' },
          { label: 'Indirect bilirubin', dir: 'up' },
          { label: 'Reticulocyte count', dir: 'up' }
        ] },

        /* Five rows — the tallest this card is asked to be. */
        { type: 'trend', q: 'Iron deficiency anemia', items: [
          { label: 'Serum iron', dir: 'down' },
          { label: 'Ferritin', dir: 'down' },
          { label: 'TIBC', dir: 'up' },
          { label: 'Transferrin saturation', dir: 'down' },
          { label: 'Mean corpuscular volume', dir: 'down' }
        ] }
      ]
    },
    {
      id: 'picklab',
      name: 'PICK LAB',
      blurb: 'Choice and select-all — both layouts, short and long options',
      cards: [
        /* Short options: the set lands as a 2×2. */
        { type: 'mcq', q: 'Electrolyte lost in prolonged vomiting', a: 'Chloride',
          distractors: ['Sodium', 'Calcium', 'Phosphate'] },
        { type: 'mcq', q: 'Vitamin deficiency causing megaloblastic anemia with neuropathy', a: 'B12',
          distractors: ['B1', 'B6', 'Folate'] },

        /* Long options: the same mode goes down the page instead. */
        { type: 'mcq', q: 'Most common cause of metabolic alkalosis', a: 'Vomiting or NG suction',
          distractors: ['Severe diarrhea', 'Diabetic ketoacidosis', 'COPD exacerbation'] },
        { type: 'mcq', q: 'First step when a trauma patient arrives unresponsive',
          a: 'Assess and secure the airway',
          distractors: ['Obtain IV access', 'Send a trauma panel', 'Order a CT head'] },

        /* Select-all, short options — six of them, still a grid. */
        { type: 'multi', q: 'Electrolytes that fall in refeeding syndrome',
          answers: ['Phosphate', 'Potassium', 'Magnesium'],
          distractors: ['Sodium', 'Chloride', 'Calcium'],
          why: 'Insulin drives phosphate, potassium and magnesium intracellularly once feeding resumes. Phosphate is the one that kills.' },
        { type: 'multi', q: 'Anion gap acidoses',
          answers: ['Lactic acidosis', 'Ketoacidosis', 'Salicylates'],
          distractors: ['Diarrhea', 'Type 1 RTA'] },

        /* Select-all, long options — list. */
        { type: 'multi', q: 'Features of nephrotic syndrome',
          answers: ['Proteinuria > 3.5 g/day', 'Hypoalbuminemia', 'Hyperlipidemia'],
          distractors: ['RBC casts on urinalysis', 'Oliguria with hypertension'] },
        { type: 'multi', q: 'Live attenuated vaccines',
          answers: ['MMR', 'Varicella', 'Intranasal influenza'],
          distractors: ['Tdap', 'Hepatitis B', 'Inactivated polio'],
          why: 'Live vaccines are contraindicated in pregnancy and in significant immunosuppression.' }
      ]
    },
    {
      id: 'revealtest',
      name: 'REVEAL LAB',
      blurb: 'Recall cards only — for judging the reveal motion',
      cards: [
        { type: 'recall', q: 'Antidote for opioid overdose', a: 'Naloxone' },
        { type: 'recall', q: 'Antidote for benzodiazepine overdose', a: 'Flumazenil' },
        { type: 'recall', q: 'Cranial nerve VII', a: 'Facial nerve' },
        { type: 'recall', q: 'Cranial nerve X', a: 'Vagus nerve' },

        /* Short question, short answer — the reveal at its cleanest. */
        { type: 'recall', q: 'Vitamin B12', a: 'Cobalamin' },
        { type: 'recall', q: 'Universal donor blood type', a: 'O negative' },
        { type: 'recall', q: 'Bones in the adult human body', a: '206' },
        { type: 'recall', q: 'Electrolyte lost in prolonged vomiting', a: 'Chloride' },

        /* Long answer against a short question — the answer face has to
           shrink hard while the question stays huge. */
        { type: 'recall', q: 'Surfactant', a: 'Made by type II pneumocytes' },
        { type: 'recall', q: 'Murmur of aortic stenosis', a: 'Crescendo-decrescendo systolic' },

        /* Long question against a short answer — the reverse mismatch. */
        { type: 'recall', q: 'Most common cause of community-acquired pneumonia', a: 'Streptococcus pneumoniae' },
        { type: 'recall', q: 'Nerve injured in a midshaft humeral fracture', a: 'Radial nerve' },

        /* With explanations — inline, and one long enough to fold. */
        { type: 'recall', q: 'Anticoagulant reversed by protamine', a: 'Heparin',
          why: 'Protamine binds heparin directly. It only partially reverses low molecular weight heparins.' },
        { type: 'recall', q: 'First-line drug for status epilepticus', a: 'IV lorazepam',
          why: 'A benzodiazepine first, then a longer-acting agent such as levetiracetam or fosphenytoin.' },
        { type: 'recall', q: 'Enzyme deficient in classic PKU', a: 'Phenylalanine hydroxylase',
          why: 'Without it phenylalanine cannot be converted to tyrosine, so it accumulates and its metabolites spill into the urine. Tyrosine becomes conditionally essential, which is why treatment is a phenylalanine-restricted diet with tyrosine supplementation rather than enzyme replacement. Untreated, the classic picture is intellectual disability, seizures, and a musty odour.' }
      ]
    },

    {
      id: 'dialtest',
      name: 'DIAL LAB',
      blurb: 'Number cards only — for testing the dial',
      cards: [
        /* Steps from 0.1 to 10000, and both card shapes: a band you can
           land anywhere inside, and an exact value with a tolerance. */
        { type: 'number', q: 'Normal adult respiratory rate', low: 12, high: 20, unit: '/min', step: 1 },
        { type: 'number', q: 'Normal adult heart rate', low: 60, high: 100, unit: 'bpm', step: 5 },
        { type: 'number', q: 'Normal body temperature', value: 37, unit: '°C', tolerance: 0.3, step: 0.1, min: 33, max: 42 },
        { type: 'number', q: 'Adult IM epinephrine dose for anaphylaxis', low: 0.3, high: 0.5, unit: 'mg', step: 0.1 },
        { type: 'number', q: 'Normal serum sodium', low: 135, high: 145, unit: 'mEq/L', step: 1 },
        { type: 'number', q: 'Normal serum osmolality', low: 275, high: 295, unit: 'mOsm/kg', step: 5 },
        { type: 'number', q: 'Approximate adult blood volume', value: 5000, unit: 'mL', tolerance: 500, step: 100, min: 2000, max: 8000 },
        { type: 'number', q: 'Normal platelet count', low: 150000, high: 450000, unit: '/µL', step: 10000, max: 600000 }
      ]
    },

    {
      id: 'acidbase',
      name: 'ACID–BASE',
      blurb: 'Disorders, compensation, and the gap',
      cards: [
        { type: 'trend', q: 'Acute respiratory acidosis', items: [
          { label: 'pH', dir: 'down' },
          { label: 'PaCO₂', dir: 'up' },
          { label: 'HCO₃⁻', dir: 'up' }
        ] },
        { type: 'trend', q: 'Metabolic acidosis with respiratory compensation', items: [
          { label: 'pH', dir: 'down' },
          { label: 'HCO₃⁻', dir: 'down' },
          { label: 'PaCO₂', dir: 'down' }
        ] },
        { type: 'trend', q: 'Metabolic alkalosis with respiratory compensation', items: [
          { label: 'pH', dir: 'up' },
          { label: 'HCO₃⁻', dir: 'up' },
          { label: 'PaCO₂', dir: 'up' }
        ] },
        { type: 'trend', q: 'Acute respiratory alkalosis', items: [
          { label: 'pH', dir: 'up' },
          { label: 'PaCO₂', dir: 'down' },
          { label: 'HCO₃⁻', dir: 'down' }
        ] },
        { type: 'recall', q: 'Anion gap formula', a: 'Na − (Cl + HCO₃)',
          why: 'Unmeasured anions. A raised gap points to added acid — ketones, lactate, salicylate — rather than lost bicarbonate.' },
        { type: 'number', q: 'Upper limit of a normal anion gap', value: 12, unit: 'mEq/L', tolerance: 0 },
        { type: 'number', q: 'Winter\'s formula: expected PaCO₂ when HCO₃⁻ is 12', value: 26, unit: 'mmHg', tolerance: 2 },
        { type: 'bucket', q: 'High anion gap or normal anion gap?',
          bins: ['High gap', 'Normal gap'],
          items: [
            { label: 'Diabetic ketoacidosis', bin: 'High gap' },
            { label: 'Lactic acidosis', bin: 'High gap' },
            { label: 'Salicylate toxicity', bin: 'High gap' },
            { label: 'Severe diarrhea', bin: 'Normal gap' },
            { label: 'Renal tubular acidosis', bin: 'Normal gap' }
          ] },
        { type: 'mcq', q: 'Most common cause of metabolic alkalosis', a: 'Vomiting or NG suction',
          distractors: ['Severe diarrhea', 'Diabetic ketoacidosis', 'COPD exacerbation'] },
        { type: 'truefalse', q: 'In a pure respiratory disorder, pH and PaCO₂ move in opposite directions', a: true,
          why: 'Rising CO₂ drives pH down; falling CO₂ drives pH up. Same-direction movement suggests a metabolic process.' },
        { type: 'recall', q: 'Primary disturbance in a patient with pH 7.52 and PaCO₂ 28', a: 'Respiratory alkalosis',
          why: 'Work it in order. The pH is alkalaemic, so the primary process raises pH. PaCO₂ is low, and a low PaCO₂ raises pH — so the respiratory system is the driver, not the compensator. Had this been a metabolic alkalosis with respiratory compensation, PaCO₂ would be high instead. Check the HCO₃ next to judge whether compensation has had time to develop.' }
      ]
    },

    {
      id: 'labpatterns',
      name: 'LAB PATTERNS',
      blurb: 'Recognizing the shape of a panel',
      cards: [
        { type: 'trend', q: 'Iron deficiency anemia', items: [
          { label: 'Ferritin', dir: 'down' },
          { label: 'TIBC', dir: 'up' },
          { label: 'Transferrin sat', dir: 'down' }
        ] },
        { type: 'trend', q: 'Anemia of chronic disease', items: [
          { label: 'Ferritin', dir: 'up' },
          { label: 'TIBC', dir: 'down' },
          { label: 'Transferrin sat', dir: 'down' }
        ] },
        { type: 'trend', q: 'Primary hypothyroidism', items: [
          { label: 'TSH', dir: 'up' },
          { label: 'Free T4', dir: 'down' }
        ] },
        { type: 'trend', q: 'Subclinical hypothyroidism', items: [
          { label: 'TSH', dir: 'up' },
          { label: 'Free T4', dir: 'same' }
        ] },
        { type: 'trend', q: 'Disseminated intravascular coagulation', items: [
          { label: 'Platelets', dir: 'down' },
          { label: 'PT', dir: 'up' },
          { label: 'PTT', dir: 'up' },
          { label: 'Fibrinogen', dir: 'down' }
        ] },
        { type: 'trend', q: 'Immune thrombocytopenia (ITP)', items: [
          { label: 'Platelets', dir: 'down' },
          { label: 'PT', dir: 'same' },
          { label: 'PTT', dir: 'same' }
        ] },
        { type: 'trend', q: 'Hemophilia A', items: [
          { label: 'PTT', dir: 'up' },
          { label: 'PT', dir: 'same' },
          { label: 'Platelets', dir: 'same' }
        ] },
        { type: 'trend', q: 'Intravascular hemolysis', items: [
          { label: 'LDH', dir: 'up' },
          { label: 'Haptoglobin', dir: 'down' },
          { label: 'Indirect bilirubin', dir: 'up' },
          { label: 'Reticulocytes', dir: 'up' }
        ] },
        { type: 'bucket', q: 'Nephrotic or nephritic?',
          bins: ['Nephrotic', 'Nephritic'],
          items: [
            { label: 'Proteinuria > 3.5 g/day', bin: 'Nephrotic' },
            { label: 'Hypoalbuminemia', bin: 'Nephrotic' },
            { label: 'Hyperlipidemia', bin: 'Nephrotic' },
            { label: 'RBC casts', bin: 'Nephritic' },
            { label: 'Hypertension and oliguria', bin: 'Nephritic' }
          ] },
        { type: 'bucket', q: 'Obstructive or restrictive pattern?',
          bins: ['Obstructive', 'Restrictive'],
          items: [
            { label: 'Reduced FEV1/FVC ratio', bin: 'Obstructive' },
            { label: 'Air trapping, increased TLC', bin: 'Obstructive' },
            { label: 'Reduced TLC', bin: 'Restrictive' },
            { label: 'Normal or increased FEV1/FVC', bin: 'Restrictive' }
          ] },
        { type: 'number', q: 'Normal serum sodium', low: 135, high: 145, unit: 'mEq/L' },
        { type: 'number', q: 'Normal serum potassium', low: 3.5, high: 5.0, unit: 'mEq/L' },
        { type: 'number', q: 'Normal serum calcium', low: 8.5, high: 10.5, unit: 'mg/dL' },
        { type: 'number', q: 'Normal platelet count', low: 150000, high: 450000, unit: '/µL', step: 10000 },
        { type: 'number', q: 'Normal serum osmolality', low: 275, high: 295, unit: 'mOsm/kg', step: 5 },
        { type: 'mcq', q: 'Best single test to distinguish iron deficiency from anemia of chronic disease',
          a: 'Serum ferritin', distractors: ['Hemoglobin', 'Mean corpuscular volume', 'Reticulocyte count'] }
      ]
    },

    {
      id: 'pharm',
      name: 'PHARM',
      blurb: 'Drugs, doses, and antidotes',
      cards: [
        { type: 'match', q: 'Generic → brand', pairs: [
          { left: 'Atorvastatin', right: 'Lipitor' },
          { left: 'Esomeprazole', right: 'Nexium' },
          { left: 'Montelukast', right: 'Singulair' },
          { left: 'Sertraline', right: 'Zoloft' }
        ] },
        { type: 'match', q: 'Drug → class', pairs: [
          { left: 'Metoprolol', right: 'Beta blocker' },
          { left: 'Lisinopril', right: 'ACE inhibitor' },
          { left: 'Amlodipine', right: 'Calcium channel blocker' },
          { left: 'Furosemide', right: 'Loop diuretic' }
        ] },
        { type: 'match', q: 'Antidote → poisoning', pairs: [
          { left: 'Naloxone', right: 'Opioids' },
          { left: 'Flumazenil', right: 'Benzodiazepines' },
          { left: 'N-acetylcysteine', right: 'Acetaminophen' },
          { left: 'Fomepizole', right: 'Methanol' }
        ] },
        { type: 'number', q: 'Adult epinephrine dose in cardiac arrest', value: 1, unit: 'mg IV', tolerance: 0, step: 0.1 },
        { type: 'number', q: 'Adult IM epinephrine dose for anaphylaxis', low: 0.3, high: 0.5, unit: 'mg' },
        { type: 'number', q: 'Epinephrine dosing interval in cardiac arrest', low: 3, high: 5, unit: 'min' },
        { type: 'truefalse', q: 'Metformin should be held around iodinated contrast administration', a: true,
          why: 'If contrast-associated kidney injury develops, metformin accumulates and raises lactic acidosis risk.' },
        { type: 'truefalse', q: 'Flumazenil is routinely recommended for undifferentiated benzodiazepine overdose', a: false,
          why: 'It can precipitate seizures in chronic benzodiazepine users and in mixed overdoses. Supportive care is preferred.' },
        { type: 'truefalse', q: 'ACE inhibitors are contraindicated in pregnancy', a: true,
          why: 'Fetal renal injury, oligohydramnios, and skull hypoplasia, particularly in the second and third trimesters.' },
        { type: 'mcq', q: 'First-line treatment for anaphylaxis', a: 'IM epinephrine',
          distractors: ['IV diphenhydramine', 'IV methylprednisolone', 'Nebulized albuterol'] },
        { type: 'bucket', q: 'Live or inactivated vaccine?',
          bins: ['Live', 'Inactivated'],
          items: [
            { label: 'MMR', bin: 'Live' },
            { label: 'Varicella', bin: 'Live' },
            { label: 'Intranasal influenza', bin: 'Live' },
            { label: 'Hepatitis B', bin: 'Inactivated' },
            { label: 'Tdap', bin: 'Inactivated' }
          ] },
        { type: 'recall', q: 'Antidote for acetaminophen overdose', a: 'N-acetylcysteine',
          why: 'Replenishes glutathione so the toxic NAPQI metabolite can be conjugated. Most effective within 8 hours of ingestion.' },
        { type: 'recall', q: 'Electrolyte to monitor closely on a loop diuretic', a: 'Potassium',
          why: 'Loops increase distal sodium delivery, driving potassium excretion. Magnesium and sodium are worth watching too.' }
      ]
    },

    {
      id: 'protocols',
      name: 'PROTOCOLS',
      blurb: 'Sequences, shock states, and thresholds',
      cards: [
        { type: 'order', q: 'ATLS primary survey', steps: [
          'Airway', 'Breathing', 'Circulation', 'Disability', 'Exposure'
        ] },
        { type: 'order', q: 'Post-op fever by day: the five Ws', steps: [
          'Wind — atelectasis, POD 1–2',
          'Water — UTI, POD 3–5',
          'Walking — DVT, POD 4–6',
          'Wound — infection, POD 5–7',
          'Wonder drugs — POD 7+'
        ] },
        { type: 'order', q: 'Adult BLS sequence', steps: [
          'Check responsiveness',
          'Activate emergency response',
          'Check pulse and breathing',
          'Begin chest compressions',
          'Attach defibrillator'
        ] },
        { type: 'trend', q: 'Cardiogenic shock', items: [
          { label: 'CVP / preload', dir: 'up' },
          { label: 'SVR', dir: 'up' },
          { label: 'Cardiac output', dir: 'down' }
        ] },
        { type: 'trend', q: 'Septic (distributive) shock', items: [
          { label: 'CVP / preload', dir: 'down' },
          { label: 'SVR', dir: 'down' },
          { label: 'Cardiac output', dir: 'up' }
        ] },
        { type: 'trend', q: 'Hypovolemic shock', items: [
          { label: 'CVP / preload', dir: 'down' },
          { label: 'SVR', dir: 'up' },
          { label: 'Cardiac output', dir: 'down' }
        ] },
        { type: 'bucket', q: 'Shockable or not shockable?',
          bins: ['Shockable', 'Not shockable'],
          items: [
            { label: 'Ventricular fibrillation', bin: 'Shockable' },
            { label: 'Pulseless VT', bin: 'Shockable' },
            { label: 'Asystole', bin: 'Not shockable' },
            { label: 'Pulseless electrical activity', bin: 'Not shockable' }
          ] },
        { type: 'number', q: 'Lowest possible Glasgow Coma Scale score', value: 3, unit: '', tolerance: 0 },
        { type: 'number', q: 'GCS at or below which intubation is generally considered', value: 8, unit: '', tolerance: 0 },
        { type: 'number', q: 'Normal intracranial pressure in adults', low: 5, high: 15, unit: 'mmHg' },
        { type: 'number', q: 'Approximate adult blood volume', value: 5000, unit: 'mL', tolerance: 500, step: 100, min: 2000, max: 8000 },
        { type: 'truefalse', q: 'Epinephrine is given every 3–5 minutes during adult cardiac arrest', a: true,
          why: 'Standard ACLS dosing is 1 mg IV/IO every 3–5 minutes for as long as the arrest continues.' },
        { type: 'mcq', q: 'First step when a trauma patient arrives unresponsive', a: 'Assess and secure the airway',
          distractors: ['Obtain IV access', 'Send a trauma panel', 'Order a CT head'] }
      ]
    }
  ];

  global.Decks = { BUILTIN: BUILTIN };
})(window);
