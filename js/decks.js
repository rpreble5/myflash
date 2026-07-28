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

   A deck may carry `topic`, a plain string. Decks sharing one are grouped
   and ranked together on the home screen. One flat level: a string is one
   more field for a generator to fill in, where nesting is a structure it
   can get wrong.

   `ref` is optional on any card and will carry the source citation once
   decks are model-generated. Sample content is standard teaching material;
   these are a study aid, not a clinical reference.                        */

(function (global) {
  'use strict';

  var BUILTIN = [
    /* One topic through every card type — a worked example of what a
       generated deck can look like when the format follows the content
       rather than the other way round. */
    {
      id: 'dka',
      topic: 'Endocrine',
      name: 'DKA',
      blurb: 'Diabetic ketoacidosis, worked through all nine card types',
      cards: [
        { type: 'recall', q: 'First intravenous fluid in DKA', a: 'Isotonic saline' },
        { type: 'recall', q: 'Insulin route of choice in DKA', a: 'IV regular insulin infusion' },
        { type: 'recall', q: 'Ketone measured to track DKA resolution', a: 'Beta-hydroxybutyrate',
          why: 'Urine ketones lag: they measure acetoacetate, which rises as beta-hydroxybutyrate is converted back during treatment, so urine can look worse while the patient improves.' },

        { type: 'mcq', q: 'Most common precipitant of DKA in a known diabetic', a: 'Infection',
          distractors: ['Pancreatitis', 'Myocardial infarction', 'Corticosteroids'] },
        { type: 'mcq', q: 'Electrolyte that must be checked before starting insulin', a: 'Potassium',
          distractors: ['Sodium', 'Calcium', 'Magnesium'] },

        { type: 'multi', q: 'Diagnostic criteria for DKA',
          answers: ['Glucose > 250 mg/dL', 'Anion gap acidosis', 'Ketonemia'],
          distractors: ['Glucose > 600 mg/dL', 'Osmolality > 320 mOsm/kg'],
          why: 'The two distractors are HHS. DKA is defined by the acidosis and the ketones, not by how high the glucose runs — euglycemic DKA exists, notably on SGLT2 inhibitors.' },

        { type: 'truefalse', q: 'Total body potassium is depleted in DKA even when the serum level is high', a: true,
          why: 'Acidosis and insulin deficiency drive potassium out of cells, so serum potassium reads normal or high while total stores are badly down. Insulin reverses the shift within hours, which is why potassium is checked before the drip starts and replaced during it.' },
        { type: 'truefalse', q: 'Bicarbonate is given routinely in DKA', a: false,
          why: 'Reserved for pH below about 6.9. Otherwise it risks hypokalemia and paradoxical CNS acidosis without improving outcomes.' },

        { type: 'number', q: 'Hold insulin until serum potassium is at least', value: 3.3, unit: 'mEq/L',
          tolerance: 0, step: 0.1, min: 2.5, max: 5.5 },
        { type: 'number', q: 'Add dextrose to the fluids once glucose falls to', value: 200, unit: 'mg/dL',
          tolerance: 0, step: 25, min: 100, max: 400 },
        { type: 'number', q: 'Hours of overlap before stopping the insulin drip', low: 1, high: 2, unit: 'h',
          step: 0.5, min: 0, max: 6 },

        { type: 'trend', q: 'Untreated DKA', items: [
          { label: 'Arterial pH', dir: 'down' },
          { label: 'Anion gap', dir: 'up' },
          { label: 'Serum bicarbonate', dir: 'down' },
          { label: 'Serum potassium', dir: 'up' }
        ] },
        { type: 'trend', q: 'First hours of insulin therapy in DKA', items: [
          { label: 'Serum glucose', dir: 'down' },
          { label: 'Serum potassium', dir: 'down' },
          { label: 'Anion gap', dir: 'down' }
        ] },

        { type: 'bucket', q: 'DKA or HHS?',
          bins: ['DKA', 'HHS'],
          items: [
            { label: 'Ketones strongly positive', bin: 'DKA' },
            { label: 'Anion gap acidosis', bin: 'DKA' },
            { label: 'Type 1 diabetes more often', bin: 'DKA' },
            { label: 'Glucose over 600', bin: 'HHS' },
            { label: 'Osmolality over 320', bin: 'HHS' }
          ] },

        { type: 'order', q: 'DKA management sequence', steps: [
          'Isotonic fluid resuscitation',
          'Check serum potassium',
          'Start IV insulin infusion',
          'Add dextrose at glucose 200',
          'Overlap subcutaneous insulin'
        ] },

        { type: 'match', q: 'Complication → cause', pairs: [
          { left: 'Cerebral edema', right: 'Fast osmolar shift' },
          { left: 'Hypokalemia', right: 'Insulin infusion' },
          { left: 'Hyperchloremia', right: 'Saline volume' },
          { left: 'Hypoglycemia', right: 'Missed dextrose' }
        ] }
      ]
    },
    {
      id: 'tflab', lab: true,
      topic: 'Design lab',
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
          why: 'Hyperchloremic acidoses — diarrhea, RTA — run a normal gap.' },

        /* Long note: folds behind a WHY? toggle, which must not count as
           the tap that continues. */
        { type: 'truefalse', q: 'Live attenuated vaccines are safe in pregnancy', a: false,
          why: 'Live vaccines — MMR, varicella, intranasal influenza — are contraindicated in pregnancy and in significant immunosuppression, on the theoretical risk of fetal infection. Inactivated vaccines, including Tdap and influenza by injection, are not only safe but actively recommended.' },
        { type: 'truefalse', q: 'Epinephrine is the first-line treatment for anaphylaxis', a: true,
          why: 'Intramuscular epinephrine into the anterolateral thigh comes first and comes early. Antihistamines and steroids treat the rash and may blunt a biphasic reaction, but neither reverses airway edema or shock, and reaching for them first is the classic fatal delay.' }
      ]
    },
    {
      id: 'trendlab', lab: true,
      topic: 'Design lab',
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
      id: 'picklab', lab: true,
      topic: 'Design lab',
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
      id: 'revealtest', lab: true,
      topic: 'Design lab',
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
      id: 'dialtest', lab: true,
      topic: 'Design lab',
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
      topic: 'Renal',
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
          why: 'Work it in order. The pH is alkalemic, so the primary process raises pH. PaCO₂ is low, and a low PaCO₂ raises pH — so the respiratory system is the driver, not the compensator. Had this been a metabolic alkalosis with respiratory compensation, PaCO₂ would be high instead. Check the HCO₃ next to judge whether compensation has had time to develop.' }
      ]
    },

    {
      id: 'labpatterns',
      topic: 'Diagnostics',
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
      topic: 'Pharmacology',
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
      topic: 'Emergencies',
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
    },

    /* ══════════════════════════════════════════════════════════════
       Two clinic diseases in the sub-deck shape: the topic is the
       disease, the decks are its facets. Difficulty is deliberately
       mixed inside each deck rather than sorted — the point is that a
       first-year gets the basics back and an attending still meets
       something they had half-forgotten.

       Hypertension gets three facets, not four. It presents by being
       silent, so there is no honest PRESENTATION deck in it, and an
       invented one would be worse than none.
       ══════════════════════════════════════════════════════════════ */

    {
      id: 'htn-diagnosis',
      topic: 'Hypertension',
      name: 'DIAGNOSIS',
      blurb: 'Thresholds, confirmation, and when to look for a cause',
      cards: [
        { type: 'number', q: 'Systolic at or above which stage 2 hypertension begins', value: 140, unit: 'mmHg',
          tolerance: 0, ref: 'ACC/AHA 2017' },
        { type: 'number', q: 'Diastolic at or above which stage 2 hypertension begins', value: 90, unit: 'mmHg',
          tolerance: 0, ref: 'ACC/AHA 2017' },
        { type: 'recall', q: 'Blood pressure range that defines stage 1 hypertension', a: '130–139 / 80–89 mmHg',
          ref: 'ACC/AHA 2017' },

        { type: 'truefalse', q: 'One high office reading is enough to diagnose hypertension', a: false,
          why: 'It takes at least two readings on two separate occasions. Treating a single high reading is how white coat hypertension becomes a lifelong prescription.' },
        { type: 'recall', q: 'Test that confirms office hypertension before starting drugs', a: 'Home or ambulatory monitoring' },

        { type: 'truefalse', q: 'Masked hypertension carries less risk than white coat hypertension', a: false,
          why: 'It is the more dangerous of the two. Office readings look normal, so nobody treats it, while the cardiovascular risk approaches that of sustained hypertension.' },

        { type: 'multi', q: 'Part of the initial workup for new hypertension',
          answers: ['Basic metabolic panel', 'Urinalysis', 'ECG', 'Lipid panel'],
          distractors: ['Renal artery ultrasound', 'Echocardiogram'],
          why: 'Imaging is not routine. It is ordered when something in the history or labs points to a secondary cause.' },

        { type: 'bucket', q: 'Primary or secondary hypertension?',
          bins: ['Primary', 'Secondary'],
          items: [
            { label: 'Gradual rise through the 50s', bin: 'Primary' },
            { label: 'Onset before age 30', bin: 'Secondary' },
            { label: 'Unprovoked hypokalemia', bin: 'Secondary' },
            { label: 'Obesity and family history', bin: 'Primary' },
            { label: 'Abrupt loss of long control', bin: 'Secondary' },
            { label: 'Responds to one agent', bin: 'Primary' }
          ] },

        { type: 'recall', q: 'Commonest secondary cause found in resistant hypertension', a: 'Primary aldosteronism' },
        { type: 'mcq', q: 'Screening test for primary aldosteronism', a: 'Aldosterone-to-renin ratio',
          distractors: ['Urine metanephrines', 'Renal artery duplex', 'Dexamethasone suppression'],
          why: 'The other three screen for phaeochromocytoma, renovascular disease and Cushing syndrome — the differential worth knowing, not distractors for their own sake.' }
      ]
    },

    {
      id: 'htn-management',
      topic: 'Hypertension',
      name: 'MANAGEMENT',
      blurb: 'What to start, what to add, and in what order',
      cards: [
        { type: 'number', q: 'Systolic target for most treated adults', value: 130, unit: 'mmHg',
          tolerance: 0, ref: 'ACC/AHA 2017' },

        { type: 'multi', q: 'First-line classes for uncomplicated hypertension',
          answers: ['Thiazide diuretic', 'ACE inhibitor', 'ARB', 'Calcium channel blocker'],
          distractors: ['Beta blocker', 'Alpha blocker'] },

        { type: 'truefalse', q: 'Beta blockers are reserved for a compelling indication in hypertension', a: true,
          why: 'Post-infarct, heart failure, rate control. As monotherapy for blood pressure alone they protect against stroke less well than the four first-line classes, which is why they sit outside the first line.' },

        { type: 'order', q: 'Escalating drug therapy in hypertension',
          steps: ['One first-line agent', 'Add a second class', 'Add a third with a diuretic', 'Add spironolactone'] },

        { type: 'mcq', q: 'Preferred fourth agent in resistant hypertension', a: 'Spironolactone',
          distractors: ['Doxazosin', 'Bisoprolol', 'Clonidine'],
          why: 'PATHWAY-2 tested spironolactone against exactly these comparators and it beat both.',
          ref: 'PATHWAY-2, 2015' },

        { type: 'recall', q: 'Blood pressure above goal that justifies starting two drugs at once', a: 'By 20/10 mmHg' },
        { type: 'recall', q: 'Thiazide-like diuretic preferred over hydrochlorothiazide', a: 'Chlorthalidone',
          why: 'Longer half-life, more potent milligram for milligram, and the better outcome data. It also drops potassium harder, so it needs watching.' },

        { type: 'mcq', q: 'Class of choice in chronic kidney disease with albuminuria', a: 'ACE inhibitor or ARB',
          distractors: ['Thiazide diuretic', 'Calcium channel blocker', 'Beta blocker'] },
        { type: 'number', q: 'eGFR below which a thiazide stops working well', value: 30, unit: 'mL/min' },

        { type: 'truefalse', q: 'An ACE inhibitor and an ARB may be combined for extra lowering', a: false,
          why: 'No outcome benefit and clearly more harm — hyperkalemia, acute kidney injury and syncope. The combination was abandoned after ONTARGET.',
          ref: 'ONTARGET, 2008' },

        { type: 'trend', q: 'First weeks after starting an ACE inhibitor', items: [
          { label: 'Serum creatinine', dir: 'up' },
          { label: 'Serum potassium', dir: 'up' },
          { label: 'Urine protein', dir: 'down' }
        ], why: 'The creatinine rise is expected, not a complication. Falling proteinuria is the renoprotection you were after.' }
      ]
    },

    {
      id: 'htn-pitfalls',
      topic: 'Hypertension',
      name: 'PITFALLS',
      blurb: 'What gets missed and what gets stopped too early',
      cards: [
        { type: 'recall', q: 'Direction of error when the cuff is too small for the arm', a: 'Falsely high' },
        { type: 'recall', q: 'Commonest reason hypertension looks resistant', a: 'Non-adherence' },
        { type: 'recall', q: 'Position often skipped when measuring pressure in the elderly', a: 'Standing' },

        { type: 'truefalse', q: 'A creatinine rise up to about 30% after starting an ACE inhibitor is expected', a: true,
          why: 'It settles, and stopping there throws away the renoprotection you were after. Above 30%, or a climbing potassium, is the point to stop and go looking for renovascular disease.' },

        { type: 'multi', q: 'Common causes of a rise in blood pressure on treatment',
          answers: ['NSAIDs', 'Decongestants', 'Excess alcohol', 'Oral contraceptives'],
          distractors: ['Metformin', 'Statins'] },

        { type: 'mcq', q: 'Next step for a dry cough on an ACE inhibitor', a: 'Switch to an ARB',
          distractors: ['Halve the dose', 'Add an antihistamine', 'Add a cough suppressant'],
          why: 'The cough is bradykinin-mediated and dose-independent, so halving it does nothing. ARBs do not raise bradykinin.' },

        { type: 'truefalse', q: 'Clonidine can be stopped abruptly without consequence', a: false,
          why: 'Abrupt withdrawal causes rebound hypertension that can overshoot the original pressure badly. It has to be tapered.' },

        { type: 'truefalse', q: 'Spironolactone added to an ACE inhibitor needs potassium monitoring', a: true,
          why: 'Both raise potassium, and the combination is the classic route to dangerous hyperkalemia in a patient who felt fine.' }
      ]
    },

    {
      id: 't2dm-presentation',
      topic: 'Type 2 Diabetes',
      name: 'PRESENTATION',
      blurb: 'How it turns up, and telling it from type 1',
      cards: [
        { type: 'multi', q: 'Classic symptoms of sustained hyperglycemia',
          answers: ['Polyuria', 'Polydipsia', 'Weight loss', 'Blurred vision'],
          distractors: ['Bradycardia', 'Weight gain'] },

        { type: 'truefalse', q: 'Most type 2 diabetes is found by screening rather than by symptoms', a: true,
          why: 'Symptoms need sustained glucose high enough to spill into the urine, which is late in the disease. Waiting for a symptomatic patient means diagnosing years after the damage started.' },
        { type: 'truefalse', q: 'Complications can already be present the day diabetes is diagnosed', a: true,
          why: 'Retinopathy and neuropathy are found at diagnosis often enough that both are screened for immediately — the disease has usually been running silently for years.' },

        { type: 'recall', q: 'Velvety dark thickening in the axillae that signals insulin resistance', a: 'Acanthosis nigricans' },
        { type: 'recall', q: 'Antibody checked when adult-onset diabetes may be type 1', a: 'GAD65' },
        { type: 'number', q: 'Age at which routine screening for type 2 diabetes begins', value: 35, unit: 'years',
          tolerance: 0, ref: 'ADA Standards of Care, 2022 onward' },

        { type: 'bucket', q: 'Type 1 or type 2 at first presentation?',
          bins: ['Type 1', 'Type 2'],
          items: [
            { label: 'Ketosis at onset', bin: 'Type 1' },
            { label: 'Acanthosis nigricans', bin: 'Type 2' },
            { label: 'Low C-peptide', bin: 'Type 1' },
            { label: 'GAD antibodies present', bin: 'Type 1' },
            { label: 'Central obesity', bin: 'Type 2' },
            { label: 'Controlled on oral agents', bin: 'Type 2' }
          ] }
      ]
    },

    {
      id: 't2dm-diagnosis',
      topic: 'Type 2 Diabetes',
      name: 'DIAGNOSIS',
      blurb: 'The four criteria, and when the HbA1c lies',
      cards: [
        { type: 'number', q: 'HbA1c at or above which diabetes is diagnosed', value: 6.5, unit: '%',
          tolerance: 0, ref: 'ADA Standards of Care' },
        { type: 'number', q: 'Fasting glucose at or above which diabetes is diagnosed', value: 126, unit: 'mg/dL',
          tolerance: 0, ref: 'ADA Standards of Care' },
        { type: 'number', q: 'Two-hour glucose on an OGTT that diagnoses diabetes', value: 200, unit: 'mg/dL',
          tolerance: 0, ref: 'ADA Standards of Care' },
        { type: 'number', q: 'HbA1c range that defines prediabetes', low: 5.7, high: 6.4, unit: '%',
          ref: 'ADA Standards of Care' },

        { type: 'multi', q: 'Results that can establish a diagnosis of diabetes',
          answers: ['HbA1c 6.5% or above', 'Fasting glucose 126 or above', 'Two-hour OGTT 200 or above'],
          distractors: ['Random glucose 140 or above', 'Fasting glucose 100 or above'],
          why: 'The two distractors are prediabetes thresholds, not diagnostic ones. A random glucose only counts at 200 or above, and only with symptoms.' },

        { type: 'truefalse', q: 'One abnormal test diagnoses diabetes in someone without symptoms', a: false,
          why: 'It takes two abnormal results — either two different tests on one sample, or the same test repeated. A single value is how a lab error becomes a diagnosis.' },

        { type: 'multi', q: 'Conditions that make the HbA1c unreliable',
          answers: ['Recent transfusion', 'Hemolytic anemia', 'Iron deficiency', 'Advanced kidney disease'],
          distractors: ['Obesity', 'Statin therapy'],
          why: 'Anything that changes how long red cells live changes the HbA1c. Iron deficiency pushes it up and hemolysis pulls it down, so the number can move without the glucose moving at all.' }
      ]
    },

    {
      id: 't2dm-management',
      topic: 'Type 2 Diabetes',
      name: 'MANAGEMENT',
      blurb: 'First drug, second drug, and what gets checked every year',
      cards: [
        { type: 'recall', q: 'First-line drug for type 2 diabetes', a: 'Metformin' },
        { type: 'number', q: 'HbA1c target for most non-pregnant adults', value: 7, unit: '%',
          tolerance: 0, ref: 'ADA Standards of Care' },
        { type: 'number', q: 'eGFR below which metformin must be stopped', value: 30, unit: 'mL/min' },

        { type: 'mcq', q: 'Class to add for type 2 diabetes with heart failure', a: 'SGLT2 inhibitor',
          distractors: ['Sulfonylurea', 'DPP-4 inhibitor', 'Thiazolidinedione'],
          why: 'A thiazolidinedione is the trap: it causes fluid retention and is avoided in heart failure, so the intuitive-sounding answer is the harmful one.' },
        { type: 'mcq', q: 'Class to add when weight loss matters most', a: 'GLP-1 receptor agonist',
          distractors: ['Sulfonylurea', 'Insulin', 'DPP-4 inhibitor'],
          why: 'Sulfonylureas and insulin both drive weight up, which is the wrong direction in a patient whose insulin resistance is the problem.' },

        { type: 'truefalse', q: 'An SGLT2 inhibitor is worth adding in diabetic kidney disease even at target HbA1c', a: true,
          why: 'The kidney and heart benefit is largely independent of glucose lowering, so it is added for organ protection rather than for the number.' },
        { type: 'truefalse', q: 'Metformin is continued when a second agent is added', a: true,
          why: 'It stays unless kidney function or side effects force it out. Second agents are added to metformin rather than swapped for it, which is why the pill count grows.' },

        { type: 'truefalse', q: 'Long-term metformin can cause vitamin B12 deficiency', a: true,
          why: 'It reduces B12 absorption in the terminal ileum. The trap is that the resulting neuropathy gets written off as diabetic neuropathy and nobody checks the level.' },

        { type: 'multi', q: 'Checked at least once a year in type 2 diabetes',
          answers: ['Urine albumin-to-creatinine', 'Dilated retinal exam', 'Foot examination', 'Lipid panel'],
          distractors: ['Echocardiogram', 'Carotid ultrasound'] },

        { type: 'number', q: 'Weight loss that meaningfully improves glycemic control', low: 5, high: 7, unit: '%' },
        { type: 'mcq', q: 'Statin intensity for a 55-year-old diabetic with no vascular disease', a: 'Moderate intensity',
          distractors: ['High intensity', 'Low intensity', 'No statin'] }
      ]
    },

    {
      id: 't2dm-pitfalls',
      topic: 'Type 2 Diabetes',
      name: 'PITFALLS',
      blurb: 'The traps in the newer drugs and the old ones',
      cards: [
        { type: 'truefalse', q: 'Ketoacidosis on an SGLT2 inhibitor always comes with a high glucose', a: false,
          why: 'Euglycemic ketoacidosis is the signature complication of this class — the glucose can sit under 200 while the patient is frankly acidotic. Any unwell patient on one needs ketones checked, not just a glucose.' },
        { type: 'recall', q: 'Drug class held before surgery to avoid euglycemic ketoacidosis', a: 'SGLT2 inhibitor' },
        { type: 'recall', q: 'Common genitourinary side effect of SGLT2 inhibitors', a: 'Genital yeast infection' },

        { type: 'mcq', q: 'Oral agent most likely to cause hypoglycemia', a: 'Sulfonylurea',
          distractors: ['Metformin', 'SGLT2 inhibitor', 'DPP-4 inhibitor'] },
        { type: 'truefalse', q: 'A sulfonylurea is a safe first choice in an elderly patient with kidney disease', a: false,
          why: 'Both the drug and its active metabolites accumulate, and the hypoglycemia that follows can be prolonged and severe in exactly the patient least able to notice it.' },

        { type: 'truefalse', q: 'Metformin causes contrast nephropathy', a: false,
          why: 'It does not. It is held around contrast because if the kidney is injured by anything, metformin then accumulates and the risk is lactic acidosis — a different problem in the opposite direction.' },

        { type: 'recall', q: 'Injection-site change that makes insulin absorption erratic', a: 'Lipohypertrophy' }
      ]
    },

    /* Asthma is the first disease here whose content genuinely supports
       all nine card types, which makes it the real test of the restraint
       rule: each type is used once, where the material actually is that
       shape, rather than once each because nine were available.

       No citations — the trials that matter are named in `why` as prose
       where the trial is itself the fact worth knowing. */

    {
      id: 'asthma-presentation',
      topic: 'Asthma',
      name: 'PRESENTATION',
      blurb: 'The picture, the variants, and the signs that mean trouble',
      cards: [
        { type: 'multi', q: 'Symptoms that make up the classic asthma picture',
          answers: ['Wheeze', 'Cough', 'Chest tightness', 'Breathlessness'],
          distractors: ['Fever', 'Hemoptysis'] },

        { type: 'truefalse', q: 'Asthma symptoms are typically worse at night and early morning', a: true,
          why: 'Diurnal variation is one of the more useful things in the history. A cough that reliably wakes someone at four in the morning is asthma until proven otherwise.' },

        { type: 'recall', q: 'Asthma variant in which cough is the only symptom', a: 'Cough-variant asthma' },
        { type: 'recall', q: 'Two atopic conditions that commonly accompany asthma', a: 'Eczema and allergic rhinitis' },

        { type: 'truefalse', q: 'A silent chest during an acute attack is a reassuring sign', a: false,
          why: 'Wheeze needs air moving to make a sound. When a deteriorating asthmatic goes quiet it means almost nothing is moving at all, which makes the silent chest a sign of life-threatening obstruction. It is a reason to escalate immediately, not to relax — and it is the classic way an attack gets underestimated at exactly the wrong moment.' },

        { type: 'truefalse', q: 'A normal PaCO2 in a visibly distressed asthmatic is reassuring', a: false,
          why: 'Someone working that hard should be blowing off carbon dioxide and running low. A CO2 that has climbed back to normal means they are tiring, and it is the last quiet moment before respiratory failure.' },

        { type: 'bucket', q: 'Asthma or COPD?',
          bins: ['Asthma', 'COPD'],
          items: [
            { label: 'Onset in childhood', bin: 'Asthma' },
            { label: 'Symptoms vary day to day', bin: 'Asthma' },
            { label: 'Largely reversible', bin: 'Asthma' },
            { label: 'Long smoking history', bin: 'COPD' },
            { label: 'Progressive fixed decline', bin: 'COPD' },
            { label: 'Reduced gas transfer', bin: 'COPD' }
          ] }
      ]
    },

    {
      id: 'asthma-diagnosis',
      topic: 'Asthma',
      name: 'DIAGNOSIS',
      blurb: 'Proving variable obstruction, and why one normal test proves nothing',
      cards: [
        { type: 'number', q: 'Rise in FEV1 that counts as significant reversibility', value: 12, unit: '%',
          tolerance: 0 },
        { type: 'number', q: 'Absolute FEV1 rise also needed to call it reversible', value: 200, unit: 'mL',
          tolerance: 0,
          why: 'Both criteria have to be met. A twelve percent rise off a very low baseline can be a handful of milliliters, which is noise rather than reversibility.' },

        { type: 'trend', q: 'Spirometry in obstructive disease', items: [
          { label: 'FEV1', dir: 'down' },
          { label: 'FVC', dir: 'same' },
          { label: 'FEV1/FVC ratio', dir: 'down' }
        ], why: 'The ratio falls because the numerator falls and the denominator largely does not. That is the whole definition of an obstructive pattern.' },

        { type: 'truefalse', q: 'Spirometry can be completely normal between asthma episodes', a: true,
          why: 'Asthma is variable by definition, so a normal result in someone well at that moment excludes nothing. That is exactly why challenge testing and serial peak flows exist.' },

        { type: 'multi', q: 'Objective ways to confirm variable airflow obstruction',
          answers: ['Bronchodilator reversibility', 'Peak flow variability', 'Methacholine challenge'],
          distractors: ['Chest radiograph', 'Sweat chloride test'] },

        { type: 'recall', q: 'Agent most often used in a bronchoprovocation challenge', a: 'Methacholine' },
        { type: 'recall', q: 'Test to consider when spirometry is normal but asthma is still likely',
          a: 'Bronchoprovocation testing' },
        { type: 'number', q: 'Peak flow green zone, as a share of personal best', low: 80, high: 100, unit: '%' }
      ]
    },

    {
      id: 'asthma-management',
      topic: 'Asthma',
      name: 'MANAGEMENT',
      blurb: 'Controllers, relievers, and the two things never given alone',
      cards: [
        { type: 'recall', q: 'Cornerstone controller therapy in asthma', a: 'Inhaled corticosteroid' },

        { type: 'truefalse', q: 'A short-acting beta agonist alone is adequate for mild asthma', a: false,
          why: 'It relieves the bronchospasm and does nothing to the inflammation underneath, so the disease carries on while the symptoms are masked. Heavy reliever use tracks with worse outcomes including death, which is why the inhaled steroid is no longer something only moderate asthmatics get.' },

        { type: 'truefalse', q: 'A long-acting beta agonist may be prescribed on its own', a: false,
          why: 'LABA monotherapy increases asthma deaths. It is always paired with an inhaled corticosteroid, and combination inhalers exist largely so the pairing cannot be taken apart by accident.' },

        { type: 'match', q: 'Inhaler → class', pairs: [
          { left: 'Albuterol', right: 'SABA' },
          { left: 'Salmeterol', right: 'LABA' },
          { left: 'Budesonide', right: 'Inhaled steroid' },
          { left: 'Tiotropium', right: 'LAMA' }
        ] },

        { type: 'order', q: 'Using a metered-dose inhaler', steps: [
          'Breathe out fully',
          'Seal lips on the mouthpiece',
          'Press and breathe in slowly',
          'Hold the breath ten seconds',
          'Rinse the mouth'
        ] },

        { type: 'recall', q: 'Reason the mouth is rinsed after an inhaled steroid', a: 'To prevent oral thrush' },

        { type: 'mcq', q: 'Add-on worth considering when allergic rhinitis is prominent',
          a: 'Leukotriene antagonist',
          distractors: ['Theophylline', 'Oral corticosteroid', 'Cromolyn sodium'] },

        { type: 'mcq', q: 'Class added for severe eosinophilic asthma', a: 'Biologic therapy',
          distractors: ['Oral theophylline', 'Long-term antibiotics', 'Inhaled cromolyn'] },

        { type: 'multi', q: 'Part of every routine asthma review',
          answers: ['Inhaler technique', 'Adherence', 'Symptom control', 'Trigger review'],
          distractors: ['Chest radiograph', 'Sputum culture'] },

        { type: 'truefalse', q: 'Inhaled corticosteroids permanently stunt growth in children', a: false,
          why: 'There is a real but small effect — a slowing of growth velocity early on, amounting to about a centimetre of final adult height. Set against the harm of asthma left undertreated, that is a trade worth making, and saying so plainly is usually what settles the conversation with a parent.' }
      ]
    },

    {
      id: 'asthma-pitfalls',
      topic: 'Asthma',
      name: 'PITFALLS',
      blurb: 'Why it looks refractory when it is not',
      cards: [
        { type: 'multi', q: 'Check these before escalating therapy',
          answers: ['Inhaler technique', 'Adherence', 'Ongoing trigger exposure', 'Untreated rhinitis'],
          distractors: ['Serum IgE level', 'Chest CT'],
          why: 'A large share of patients use the device wrong enough that little of the drug reaches the airway. Escalating the prescription before watching someone actually take a puff treats a problem that was never there.' },

        { type: 'number', q: 'Reliever uses per week above which control is inadequate', value: 2,
          unit: 'per week', tolerance: 0,
          why: 'Reliever frequency is the most informative question in the review and the easiest to ask. Rising use is usually the first sign of losing control, well before the peak flow moves.' },

        { type: 'mcq', q: 'Drug class that can precipitate bronchospasm in asthma',
          a: 'Non-selective beta blocker',
          distractors: ['ACE inhibitor', 'Calcium channel blocker', 'Thiazide diuretic'],
          why: 'Blocking beta-2 receptors in the airway removes the bronchodilator tone. Cardioselective agents are much safer and are not automatically off limits when there is a real cardiac indication.' },

        { type: 'recall', q: 'Analgesic class that can trigger severe asthma in susceptible people', a: 'NSAIDs' },
        { type: 'recall', q: 'Triad of asthma, nasal polyps and aspirin sensitivity', a: "Samter's triad" },
        { type: 'recall', q: 'Reflux condition that quietly worsens asthma control', a: 'GERD' },

        { type: 'truefalse', q: 'Most asthma exacerbations need no antibiotic', a: true,
          why: 'They are viral or trigger-driven. Without something actively pointing at a bacterial infection, an antibiotic adds side effects and nothing else.' }
      ]
    },

    /* ══════════════════════════════════════════════════════════════
       Three more clinic diseases, written for explanation rather than
       recall alone: most cards carry a `why`, and many of the questions
       ask why something is true instead of only what is true. These are
       diseases where the mechanism is the useful part — knowing that
       atrial stunning outlasts the rhythm, or that TSH lags six weeks
       behind a dose change, is what stops a correct fact being applied
       at the wrong moment.
       ══════════════════════════════════════════════════════════════ */

    {
      id: 'af-presentation',
      topic: 'Atrial Fibrillation',
      name: 'PRESENTATION',
      blurb: 'How it feels, how it sounds, and what it costs the heart',
      cards: [
        { type: 'recall', q: 'Pulse finding that suggests atrial fibrillation', a: 'Irregularly irregular',
          why: 'There is no organized atrial contraction, so the ventricle is fired by whatever crosses the AV node at random. Nothing sets a rhythm, so nothing repeats.' },

        { type: 'multi', q: 'Common presenting symptoms of new atrial fibrillation',
          answers: ['Palpitations', 'Breathlessness', 'Fatigue', 'Chest discomfort'],
          distractors: ['Hemoptysis', 'Productive cough'],
          why: 'Fatigue alone is the one most often dismissed, particularly in older patients who have slowed down gradually and put it down to age.' },

        { type: 'truefalse', q: 'Atrial fibrillation is often found in someone with no symptoms at all', a: true,
          why: 'A large share is picked up incidentally, and the stroke risk is exactly the same as in someone who feels every beat. Symptoms guide how hard you chase rhythm; they say nothing about whether to anticoagulate.' },

        { type: 'number', q: 'Share of ventricular filling contributed by atrial contraction', low: 20, high: 30, unit: '%',
          why: 'Losing it goes unnoticed at rest by a healthy ventricle and is badly missed by a stiff, hypertrophied one — which is why the same rhythm is an inconvenience in one patient and decompensation in another.' },

        { type: 'multi', q: 'Reversible precipitants worth hunting in new atrial fibrillation',
          answers: ['Thyrotoxicosis', 'Sepsis', 'Alcohol binge', 'Electrolyte disturbance'],
          distractors: ['Iron deficiency', 'Vitamin D deficiency'],
          why: 'Treat the trigger and the rhythm often follows. Missing a thyrotoxic cause means chasing the arrhythmia with drugs that were never going to hold it.' },

        { type: 'recall', q: 'Term for atrial fibrillation that stops on its own within seven days',
          a: 'Paroxysmal',
          why: 'The label describes the pattern, not the danger. Paroxysmal atrial fibrillation carries broadly the same stroke risk as persistent, which is the point most often got wrong.' },

        { type: 'recall', q: 'Rhythm mistaken for atrial fibrillation but with a saw-tooth baseline',
          a: 'Atrial flutter',
          why: 'Flutter is organized and usually conducts in a fixed ratio, so the pulse can be regular. It carries the same stroke risk and is anticoagulated the same way.' }
      ]
    },

    {
      id: 'af-diagnosis',
      topic: 'Atrial Fibrillation',
      name: 'DIAGNOSIS',
      blurb: 'The ECG, the workup, and scoring the risk',
      cards: [
        { type: 'recall', q: 'ECG finding that defines atrial fibrillation', a: 'Absent P waves',
          why: 'The atria are depolarising chaotically at 400 to 600 a minute, so no single coordinated wavefront exists to write a P wave. What is left is an irregular baseline.' },

        { type: 'multi', q: 'Baseline tests in newly diagnosed atrial fibrillation',
          answers: ['ECG', 'Thyroid function', 'Echocardiogram', 'Basic metabolic panel'],
          distractors: ['Coronary angiography', 'Chest CT'],
          why: 'The echocardiogram is not for the rhythm. It is looking for the structural disease and valve lesions that change which anticoagulant is allowed.' },

        { type: 'recall', q: 'Valve lesion that rules out a direct oral anticoagulant',
          a: 'Moderate to severe mitral stenosis',
          why: 'The DOAC trials excluded it, along with mechanical valves. Warfarin remains the only anticoagulant with evidence in those two settings, which is what "valvular" actually means here.' },

        { type: 'multi', q: 'Components of CHA2DS2-VASc that score two points',
          answers: ['Prior stroke or TIA', 'Age 75 or over'],
          distractors: ['Hypertension', 'Diabetes', 'Heart failure'],
          why: 'These two carry double weight because they predict recurrence hardest — a previous stroke is the single strongest signal that another one is coming.' },

        { type: 'number', q: 'CHA2DS2-VASc score in men at or above which anticoagulation is advised',
          value: 2, unit: 'points',
          why: 'The threshold is one point higher in women, because female sex only modifies risk in the presence of other factors rather than creating it.' },

        { type: 'recall', q: 'Test used when paroxysmal atrial fibrillation is suspected but the ECG is normal',
          a: 'Ambulatory ECG monitoring',
          why: 'A ten-second ECG taken between paroxysms is normal by definition. A normal trace excludes nothing, and treating it as reassurance is how paroxysmal disease goes unanticoagulated for years.' },

        { type: 'recall', q: 'Score used to assess bleeding risk in atrial fibrillation', a: 'HAS-BLED',
          why: 'It exists to find the modifiable risks worth correcting — blood pressure, alcohol, interacting drugs — not to give a reason for withholding anticoagulation. A high score usually means fix something, not stop.' }
      ]
    },

    {
      id: 'af-management',
      topic: 'Atrial Fibrillation',
      name: 'MANAGEMENT',
      blurb: 'Rate, rhythm, and the anticoagulation that runs underneath both',
      cards: [
        { type: 'multi', q: 'First-line drug classes for rate control',
          answers: ['Beta blocker', 'Diltiazem', 'Verapamil'],
          distractors: ['Adenosine', 'Flecainide'],
          why: 'Adenosine blocks the AV node for seconds — useful to unmask a rhythm, useless to control one. Flecainide is rhythm control and is dangerous in fibrillation without AV blockade on board.' },

        { type: 'truefalse', q: 'Rate control matches rhythm control for survival in most patients', a: true,
          why: 'Rate control is not the compromise it looks like. Restoring sinus rhythm did not improve mortality in the large trials, so rhythm control is chosen for symptoms, for young patients, or where the rhythm itself is causing a cardiomyopathy.' },

        { type: 'bucket', q: 'Rate control or rhythm control?',
          bins: ['Rate', 'Rhythm'],
          items: [
            { label: 'Young and very symptomatic', bin: 'Rhythm' },
            { label: 'First detected episode', bin: 'Rhythm' },
            { label: 'AF-induced cardiomyopathy', bin: 'Rhythm' },
            { label: 'Elderly, barely symptomatic', bin: 'Rate' },
            { label: 'Long-standing persistent', bin: 'Rate' },
            { label: 'Several failed cardioversions', bin: 'Rate' }
          ] },

        { type: 'mcq', q: 'Anticoagulant of choice in non-valvular atrial fibrillation',
          a: 'A direct oral anticoagulant',
          distractors: ['Warfarin', 'Aspirin', 'Clopidogrel'],
          why: 'DOACs match or beat warfarin for stroke prevention and cause markedly less intracranial bleeding, with no monitoring. Warfarin is now the exception rather than the default.' },

        { type: 'truefalse', q: 'Aspirin is a reasonable substitute when a patient declines anticoagulation', a: false,
          why: 'It gives very little stroke protection in atrial fibrillation while keeping most of the bleeding risk — the worst of both. Offering it as a compromise treats the conversation rather than the patient.' },

        { type: 'mcq', q: 'Rate control agent to avoid in reduced ejection fraction', a: 'Verapamil',
          distractors: ['Metoprolol', 'Digoxin', 'Bisoprolol'],
          why: 'Non-dihydropyridine calcium channel blockers are negative inotropes. In a ventricle that is already failing, the rate improves and the output falls.' },

        { type: 'number', q: 'Weeks of anticoagulation needed before elective cardioversion',
          value: 3, unit: 'weeks',
          why: 'Any thrombus already in the appendage needs time to organize and adhere. Shocking sooner risks converting a sitting clot into a stroke at the moment the atrium starts contracting again.' },

        { type: 'number', q: 'Weeks of anticoagulation required after successful cardioversion',
          value: 4, unit: 'weeks',
          why: 'The atrium is electrically normal long before it is mechanically normal. Stunning leaves it contracting poorly for days to weeks, so the stasis — and the stroke risk — outlast the rhythm on the monitor.' },

        { type: 'order', q: 'Elective cardioversion pathway', steps: [
          'Three weeks anticoagulated',
          'Synchronized cardioversion',
          'Four more weeks anticoagulated',
          'Decide on long-term therapy'
        ] },

        { type: 'recall', q: 'Procedure offered when drugs fail in symptomatic paroxysmal atrial fibrillation',
          a: 'Catheter ablation',
          why: 'Most paroxysmal atrial fibrillation is triggered by ectopic foci in the pulmonary veins, so isolating them electrically removes the trigger rather than suppressing the response.' },

        { type: 'trend', q: 'Atrial fibrillation with a rapid ventricular response', items: [
          { label: 'Heart rate', dir: 'up' },
          { label: 'Diastolic filling time', dir: 'down' },
          { label: 'Cardiac output', dir: 'down' }
        ], why: 'Filling happens in diastole, and diastole is what a fast rate shortens first. Beyond a point every extra beat moves less blood, so output falls as the rate climbs.' }
      ]
    },

    {
      id: 'af-pitfalls',
      topic: 'Atrial Fibrillation',
      name: 'PITFALLS',
      blurb: 'Where the rhythm looks handled and is not',
      cards: [
        { type: 'truefalse', q: 'Good rate control removes the need for anticoagulation', a: false,
          why: 'Rate control changes how the patient feels, not how the appendage empties. The stasis is unchanged, so the stroke decision is made on CHA2DS2-VASc alone and is entirely independent of whether the rate or the rhythm has been sorted out.' },

        { type: 'truefalse', q: 'Digoxin controls the ventricular rate well during exertion', a: false,
          why: 'It works largely by increasing vagal tone, which sympathetic drive overrides the moment someone moves. The rate looks respectable sitting in clinic and runs away on the stairs.' },

        { type: 'mcq', q: 'Antiarrhythmic that requires a structurally normal heart', a: 'Flecainide',
          distractors: ['Amiodarone', 'Digoxin', 'Metoprolol'],
          why: 'Class Ic agents slow conduction through scarred or ischemic tissue enough to set up reentry. In a structurally normal heart that does not happen; in a damaged one the drug is proarrhythmic.' },

        { type: 'recall', q: 'Reason a direct oral anticoagulant dose must be revisited over time',
          a: 'Renal function falls with age',
          why: 'These drugs are cleared renally to varying degrees, so a dose that was correct at diagnosis quietly becomes an overdose as eGFR drifts down. It is a prescription that expires without announcing it.' },

        { type: 'recall', q: 'Three organs needing monitoring on long-term amiodarone',
          a: 'Thyroid, liver and lung',
          why: 'It is iodine-rich and highly lipophilic, so it accumulates for months and disturbs several systems at once. Effective drug, expensive surveillance.' },

        { type: 'recall', q: 'Reason atrial flutter is anticoagulated like atrial fibrillation',
          a: 'The same risk of atrial thrombus',
          why: 'The atrium is still not contracting effectively, so stasis in the appendage is unchanged. A regular pulse makes flutter look safer than it is.' },

        { type: 'mcq', q: 'Best first response to atrial fibrillation with hemodynamic collapse',
          a: 'Synchronized cardioversion',
          distractors: ['IV beta blocker', 'Oral diltiazem', 'Start a DOAC'],
          why: 'When the rhythm is the reason the patient is shocked, drugs are too slow and most rate control agents lower the blood pressure further. The three-week anticoagulation rule yields to instability.' }
      ]
    },

    {
      id: 'hf-presentation',
      topic: 'Heart Failure',
      name: 'PRESENTATION',
      blurb: 'Which side is failing, and what the body does about it',
      cards: [
        { type: 'multi', q: 'Symptoms of left-sided heart failure',
          answers: ['Exertional breathlessness', 'Orthopnea', 'Nocturnal dyspnea', 'Fatigue'],
          distractors: ['Ankle swelling', 'Abdominal distension'],
          why: 'The distractors are right-sided. Congestion backs up behind whichever ventricle is failing — into the lungs on the left, into the legs and abdomen on the right.' },

        { type: 'recall', q: 'Reason orthopnea appears within minutes of lying flat',
          a: 'Fluid redistributes to the chest',
          why: 'Lying down returns blood pooled in the legs and splanchnic bed to the thorax. A failing left ventricle cannot accept the extra preload, so pulmonary venous pressure rises almost immediately.' },

        { type: 'recall', q: 'Heart sound that suggests volume overload in heart failure',
          a: 'Third heart sound',
          why: 'An S3 is rapid early filling striking a dilated, poorly compliant ventricle. It is one of the few bedside findings specific enough to change what you think.' },

        { type: 'bucket', q: 'Left-sided or right-sided failure?',
          bins: ['Left', 'Right'],
          items: [
            { label: 'Orthopnea', bin: 'Left' },
            { label: 'Pulmonary crackles', bin: 'Left' },
            { label: 'Nocturnal dyspnea', bin: 'Left' },
            { label: 'Raised jugular pressure', bin: 'Right' },
            { label: 'Peripheral edema', bin: 'Right' },
            { label: 'Enlarged tender liver', bin: 'Right' }
          ] },

        { type: 'number', q: 'Ejection fraction at or below which heart failure is called reduced',
          value: 40, unit: '%',
          why: 'The number is a gateway rather than a severity grade. Below it, four drug classes have proven mortality benefit; above it almost nothing has, which is why the classification decides treatment.' },

        { type: 'mcq', q: 'Heart failure type most associated with long-standing hypertension',
          a: 'Preserved ejection fraction',
          distractors: ['Reduced ejection fraction', 'High output failure', 'Right heart failure'],
          why: 'Years of pressure overload produce a thick, stiff ventricle that empties normally and fills badly. The pump looks fine on the echo report and the patient is still breathless.' },

        { type: 'truefalse', q: 'About half of all heart failure has a preserved ejection fraction', a: true,
          why: 'The symptoms are indistinguishable at the bedside, so the echo is needed to tell the two apart rather than to make the diagnosis. A normal ejection fraction excludes nothing.' }
      ]
    },

    {
      id: 'hf-diagnosis',
      topic: 'Heart Failure',
      name: 'DIAGNOSIS',
      blurb: 'What BNP can and cannot tell you',
      cards: [
        { type: 'recall', q: 'Blood test used to rule out heart failure when the picture is unclear',
          a: 'BNP or NT-proBNP',
          why: 'Its strength is the negative result. A normal level in an untreated breathless patient makes heart failure very unlikely, whereas a raised one has too many other causes to confirm anything on its own.' },

        { type: 'multi', q: 'Conditions that raise BNP without heart failure',
          answers: ['Atrial fibrillation', 'Renal impairment', 'Pulmonary embolism', 'Sepsis'],
          distractors: ['Obesity', 'Diuretic overuse'],
          why: 'Obesity is the trap, and it runs the other way: BNP is lower in obese patients, so a reassuringly normal value in a large breathless person may be falsely normal.' },

        { type: 'number', q: 'NT-proBNP below which chronic heart failure is unlikely',
          value: 125, unit: 'pg/mL',
          why: 'The cut-off for an acute presentation is several times higher. Applying the chronic threshold in the emergency department, or the acute one in clinic, is the commonest way this test is misread.' },

        { type: 'recall', q: 'Investigation that establishes which type of heart failure is present',
          a: 'Echocardiogram',
          why: 'It supplies the ejection fraction, and that single number splits management into two pathways with almost no overlap in evidence.' },

        { type: 'multi', q: 'Chest radiograph findings in heart failure',
          answers: ['Cardiomegaly', 'Kerley B lines', 'Pleural effusions', 'Upper lobe diversion'],
          distractors: ['Hyperinflation', 'Focal cavitation'],
          why: 'Upper lobe diversion comes first and is the easiest to miss: raised pulmonary venous pressure recruits the apical vessels that are normally the emptiest when upright.' },

        { type: 'trend', q: 'Worsening decompensated heart failure', items: [
          { label: 'NT-proBNP', dir: 'up' },
          { label: 'Jugular venous pressure', dir: 'up' },
          { label: 'Cardiac output', dir: 'down' }
        ], why: 'Natriuretic peptide is released in response to wall stretch, so it tracks filling pressure rather than pump performance. Pressure up, flow down.' },

        { type: 'recall', q: 'Reason weight is a better congestion monitor than symptoms',
          a: 'Weight rises before breathlessness',
          why: 'Two or three kilograms accumulate before the patient notices anything, so a daily weight and a written action plan buy several days of warning that symptoms alone would not.' }
      ]
    },

    {
      id: 'hf-management',
      topic: 'Heart Failure',
      name: 'MANAGEMENT',
      blurb: 'What prolongs life, what only helps, and how to tell them apart',
      cards: [
        { type: 'multi', q: 'Drug classes that improve survival in reduced ejection fraction',
          answers: ['Beta blocker', 'ARNI or ACE inhibitor', 'MRA', 'SGLT2 inhibitor'],
          distractors: ['Loop diuretic', 'Digoxin'],
          why: 'The two distractors both make people feel better and neither extends life. That distinction is the whole shape of heart failure care: the four are pushed to target dose regardless of symptoms, the diuretic is dosed to whatever keeps the patient dry.' },

        { type: 'mcq', q: 'Heart failure drug titrated to symptoms rather than to a target dose',
          a: 'Furosemide',
          distractors: ['Bisoprolol', 'Sacubitril-valsartan', 'Dapagliflozin'],
          why: 'The survival drugs are pushed toward the doses used in the trials, because that is where the benefit was demonstrated. The diuretic has no such target — it is titrated against congestion alone.' },

        { type: 'truefalse', q: 'Beta blockers should be started during an acute decompensation', a: false,
          why: 'They are negative inotropes, and a wet, low-output patient has no reserve to lend. Start low once euvolemic and go up slowly; the benefit comes from reverse remodelling over months, so there is nothing to gain by rushing.' },

        { type: 'trend', q: 'Weeks to months after starting a beta blocker', items: [
          { label: 'Resting heart rate', dir: 'down' },
          { label: 'Ejection fraction', dir: 'up' },
          { label: 'Exercise tolerance', dir: 'up' }
        ], why: 'A transient dip in how the patient feels during the first days is expected and is not a reason to stop. The gain arrives later, once the ventricle has remodelled.' },

        { type: 'recall', q: 'Reason an ARNI is never combined with an ACE inhibitor',
          a: 'Unacceptable angioedema risk',
          why: 'An ARNI already contains an angiotensin receptor blocker, and neprilysin inhibition raises bradykinin. Adding an ACE inhibitor raises it further, which is why a washout is required rather than a taper.' },

        { type: 'number', q: 'Washout hours needed between an ACE inhibitor and starting an ARNI',
          value: 36, unit: 'hours' },

        { type: 'mcq', q: 'Electrolyte to watch when starting a mineralocorticoid antagonist',
          a: 'Potassium',
          distractors: ['Sodium', 'Calcium', 'Magnesium'],
          why: 'Blocking aldosterone means retaining potassium, and almost every patient is already on an ACE inhibitor or ARB doing the same thing. The two risks compound rather than add.' },

        { type: 'mcq', q: 'Class with the clearest benefit in preserved ejection fraction',
          a: 'SGLT2 inhibitor',
          distractors: ['Digoxin', 'Beta blocker', 'Nitrate'],
          why: 'It is the first class to show consistent benefit in a group where trial after trial had shown none, which is why it now appears regardless of whether the patient has diabetes.' },

        { type: 'multi', q: 'Advice worth repeating at every heart failure review',
          answers: ['Daily weight monitoring', 'Medication adherence', 'Symptom action plan', 'Annual influenza vaccine'],
          distractors: ['Strict bed rest', 'Routine antibiotics'],
          why: 'Bed rest is not neutral, it is harmful — supervised exercise improves both symptoms and admissions, and deconditioning makes everything worse.' },

        { type: 'recall', q: 'Device considered when ejection fraction stays low on optimal therapy',
          a: 'Implantable defibrillator',
          why: 'A large share of deaths in reduced ejection fraction are sudden and arrhythmic. No drug addresses that mode of death directly, which is the gap the device fills.' }
      ]
    },

    {
      id: 'hf-pitfalls',
      topic: 'Heart Failure',
      name: 'PITFALLS',
      blurb: 'The avoidable decompensations',
      cards: [
        { type: 'multi', q: 'Common avoidable triggers for decompensation',
          answers: ['Non-adherence', 'Dietary salt load', 'New atrial fibrillation', 'NSAID use'],
          distractors: ['Influenza vaccination', 'Cardiac rehabilitation'],
          why: 'NSAIDs cause sodium and water retention and blunt diuretics at the same time, which makes them one of the most reliable ways to put a stable patient back in hospital. The two distractors are protective and still get blamed.' },

        { type: 'recall', q: 'Calcium channel blocker type contraindicated in reduced ejection fraction',
          a: 'Non-dihydropyridine',
          why: 'Verapamil and diltiazem depress contractility. If a calcium channel blocker is genuinely needed, amlodipine is the one that has been shown not to cause harm.' },

        { type: 'truefalse', q: 'Digoxin improves survival in heart failure', a: false,
          why: 'It reduces hospital admissions and leaves mortality unchanged, which is why it sits well down the list — useful for symptoms, or for rate control when atrial fibrillation coexists, and not a substitute for any of the four pillars.' },

        { type: 'recall', q: 'Electrolyte disturbance that predisposes to digoxin toxicity',
          a: 'Hypokalemia',
          why: 'Digoxin and potassium compete for the same site on the sodium-potassium pump, so a low potassium leaves more of the pump available to bind the drug. Loop diuretics lower potassium, and the two are routinely prescribed together.' },

        { type: 'mcq', q: 'Best first action when a heart failure patient gains three kilos in three days',
          a: 'Increase the diuretic dose',
          distractors: ['Stop the beta blocker', 'Restrict all fluids', 'Reassure and review later'],
          why: 'That is exactly what a written action plan is for. Stopping a survival drug to treat congestion trades a long-term benefit for a problem the diuretic already handles.' },

        { type: 'recall', q: 'Reason a heart failure patient can be congested with clear lungs',
          a: 'Congestion is mainly right-sided',
          why: 'Chronic heart failure gives the lymphatics time to adapt, so the lungs stay dry while the legs, abdomen and jugular venous pressure carry the volume. Listening to the chest alone will call this patient euvolemic.' }
      ]
    },

    {
      id: 'hypo-presentation',
      topic: 'Hypothyroidism',
      name: 'PRESENTATION',
      blurb: 'A slow disease that imitates several others',
      cards: [
        { type: 'multi', q: 'Symptoms of hypothyroidism',
          answers: ['Fatigue', 'Cold intolerance', 'Constipation', 'Weight gain'],
          distractors: ['Heat intolerance', 'Diarrhea'],
          why: 'The distractors are the hyperthyroid mirror image. Almost every symptom here is the metabolic rate falling, which is why the picture is so easy to attribute to age or low mood.' },

        { type: 'recall', q: 'Commonest cause of hypothyroidism where iodine intake is adequate',
          a: 'Hashimoto thyroiditis',
          why: 'Autoimmune destruction of the gland, usually with anti-TPO antibodies present years before the TSH ever moves. It is why a positive antibody in a euthyroid patient is a reason to keep watching.' },

        { type: 'mcq', q: 'Thyroid function pattern in primary hypothyroidism',
          a: 'High TSH, low free T4',
          distractors: ['Low TSH, low free T4', 'High TSH, high free T4', 'Low TSH, high free T4'],
          why: 'The pituitary is working properly and shouting at a gland that cannot answer. The first distractor is the central pattern — rare, and missed precisely because everyone screens on TSH alone.' },

        { type: 'recall', q: 'Type of hypothyroidism with a low TSH and a low free T4',
          a: 'Central hypothyroidism',
          why: 'The failure is in the pituitary or hypothalamus, so TSH cannot rise to signal it. Screening on TSH will read this patient as normal, and titrating on TSH will leave them under-replaced.' },

        { type: 'truefalse', q: 'Hypothyroidism can present as low mood or cognitive slowing alone', a: true,
          why: 'It is one of the few genuinely treatable mimics of depression and of cognitive decline, which is why thyroid function is checked in both. The reverse mistake — blaming everything on the thyroid — is also common.' },

        { type: 'recall', q: 'Reflex sign classically described in hypothyroidism',
          a: 'Delayed relaxation phase',
          why: 'Contraction is roughly normal and relaxation is slow, because the energy-dependent step that pumps calcium back into the sarcoplasmic reticulum is the one that suffers.' },

        { type: 'recall', q: 'Life-threatening extreme of untreated hypothyroidism', a: 'Myxedema coma',
          why: 'Hypothermia, bradycardia, hyponatremia and depressed consciousness, usually in an older untreated patient tipped over by infection or cold. It is treated before the confirmatory tests return.' }
      ]
    },

    {
      id: 'hypo-diagnosis',
      topic: 'Hypothyroidism',
      name: 'DIAGNOSIS',
      blurb: 'Why TSH moves first, and when not to believe it',
      cards: [
        { type: 'recall', q: 'First-line test for suspected hypothyroidism', a: 'Serum TSH',
          why: 'TSH responds logarithmically to free T4, so a small fall in hormone produces a large rise in TSH. It moves well before free T4 leaves its reference range, which is what makes it the sensitive test.' },

        { type: 'mcq', q: 'Pattern that defines subclinical hypothyroidism',
          a: 'High TSH, normal free T4',
          distractors: ['High TSH, low free T4', 'Normal TSH, low free T4', 'Low TSH, normal free T4'],
          why: 'The gland is failing but keeping up under extra pituitary drive. Whether that needs treating depends on how high the TSH is, whether antibodies are present, and whether there are symptoms at all.' },

        { type: 'number', q: 'TSH above which treating subclinical hypothyroidism is usually advised',
          value: 10, unit: 'mIU/L',
          why: 'Above this the progression to overt disease is likely enough to act on. Below it the evidence for benefit is thin and a good proportion normalize on a repeat test, so treating early mostly commits people to lifelong therapy they did not need.' },

        { type: 'recall', q: 'Antibody that confirms autoimmune thyroid disease', a: 'Anti-TPO antibody',
          why: 'Its presence predicts progression, so it changes how closely a borderline TSH is followed even when nothing is treated today.' },

        { type: 'truefalse', q: 'TSH should be repeated before committing someone to lifelong treatment', a: true,
          why: 'It varies with time of day, with acute illness and with recovery from it. Repeating it, with free T4 and antibodies, is what separates a real diagnosis from a snapshot.' },

        { type: 'recall', q: 'Reason thyroid tests are unreliable during acute illness',
          a: 'Non-thyroidal illness syndrome',
          why: 'TSH and T3 fall during serious illness and TSH can overshoot upward during recovery, so a level taken on a sick inpatient may describe the illness rather than the thyroid. Repeat it once they are well.' },

        { type: 'number', q: 'Approximate upper limit of the usual TSH reference range',
          low: 4, high: 5, unit: 'mIU/L',
          why: 'It varies between laboratories and drifts upward with age, which is why a mildly raised value in an older patient is often normal for them rather than early disease.' }
      ]
    },

    {
      id: 'hypo-management',
      topic: 'Hypothyroidism',
      name: 'MANAGEMENT',
      blurb: 'One drug, and the several ways it stops working',
      cards: [
        { type: 'recall', q: 'Drug used to treat hypothyroidism', a: 'Levothyroxine' },

        { type: 'recall', q: 'Reason levothyroxine is taken on an empty stomach',
          a: 'Food and drink block absorption',
          why: 'Absorption happens in the small bowel and is reduced by food, coffee and a long list of drugs. Thirty to sixty minutes before breakfast, or well after the last meal at night, is what makes the dose reproducible.' },

        { type: 'number', q: 'Weeks to wait before rechecking TSH after a dose change',
          value: 6, unit: 'weeks',
          why: 'The pituitary takes about six weeks to re-equilibrate to a new thyroid hormone level. A TSH drawn earlier is still reporting on the old dose, and adjusting against it sets off an oscillation that can take months to settle.' },

        { type: 'multi', q: 'Things that block levothyroxine absorption',
          answers: ['Calcium carbonate', 'Ferrous sulfate', 'Proton pump inhibitors', 'Bile acid sequestrants'],
          distractors: ['Acetaminophen', 'Atorvastatin'],
          why: 'Separating them by four hours usually solves it. This is the first thing to ask about when a dose that worked for years suddenly stops — a new supplement is a far more likely explanation than the gland changing.' },

        { type: 'mcq', q: 'How to start levothyroxine in an elderly patient with cardiac disease',
          a: 'Low dose, increased slowly',
          distractors: ['Full replacement immediately', 'Weekly dosing', 'Liothyronine instead'],
          why: 'Raising the metabolic rate raises myocardial oxygen demand. In a heart with limited coronary reserve, a full replacement dose can precipitate angina or an arrhythmia before it does any good.' },

        { type: 'number', q: 'Approximate full replacement dose of levothyroxine per kilogram',
          value: 1.6, unit: 'mcg/kg',
          why: 'A starting estimate rather than a prescription. It is a reasonable opening dose in a young healthy adult and the wrong opening dose in almost everyone else.' },

        { type: 'truefalse', q: 'Levothyroxine requirements rise during pregnancy', a: true,
          why: 'Demand climbs early, often by a quarter to a third, and maternal hypothyroidism affects fetal neurodevelopment. The dose is usually increased as soon as pregnancy is confirmed rather than waiting for the next test.' },

        { type: 'recall', q: 'Measurement used to titrate levothyroxine in primary hypothyroidism',
          a: 'Serum TSH' },

        { type: 'recall', q: 'Reason TSH cannot be used to titrate central hypothyroidism',
          a: 'The pituitary itself is failing',
          why: 'TSH is already inappropriately low, so it cannot report whether replacement is adequate. Free T4 is used instead, aimed at the upper half of the range.' }
      ]
    },

    {
      id: 'hypo-pitfalls',
      topic: 'Hypothyroidism',
      name: 'PITFALLS',
      blurb: 'Over-replacement, and the order things must be treated in',
      cards: [
        { type: 'recall', q: 'Hormone deficiency that must be corrected before starting levothyroxine',
          a: 'Cortisol',
          why: 'If adrenal insufficiency is present and untreated, raising the metabolic rate accelerates cortisol clearance and can precipitate an adrenal crisis. Steroid first, thyroid second — the order is the whole point.' },

        { type: 'truefalse', q: 'A suppressed TSH on treatment is harmless if the patient feels well', a: false,
          why: 'It is subclinical thyrotoxicosis, and it carries a real risk of atrial fibrillation and accelerated bone loss, particularly in older and postmenopausal patients. Over-replacement is the commonest iatrogenic harm in thyroid care and it feels good on the way there.' },

        { type: 'mcq', q: 'First thing to check when TSH rises on a previously stable dose',
          a: 'Adherence and dose timing',
          distractors: ['Add liothyronine', 'Double the dose', 'Recheck antibodies'],
          why: 'Missed doses and newly started supplements explain most of these. Escalating the dose against poor adherence produces alternating over- and under-replacement rather than control.' },

        { type: 'truefalse', q: 'Adding T3 to T4 is standard when symptoms persist on a normal TSH', a: false,
          why: 'Trials have not shown consistent benefit and it is not standard care. Persistent symptoms with a normal TSH are more often anemia, sleep apnoea, depression or something else entirely, and that is the more useful place to look.' },

        { type: 'recall', q: 'Drug that can cause both hypothyroidism and hyperthyroidism',
          a: 'Amiodarone',
          why: 'It is around forty percent iodine by weight. Depending on the gland it meets, that load either shuts hormone synthesis down or drives excess release, which is why thyroid function is checked before starting and periodically after.' },

        { type: 'recall', q: 'Reason a mildly raised TSH in an older patient may need no treatment',
          a: 'The range shifts up with age',
          why: 'The distribution of normal TSH rises across the decades, so a value slightly above the printed range can be normal for that person. Treating it has not been shown to help and carries the over-replacement risk.' },

        { type: 'recall', q: 'Electrolyte disturbance commonly found in myxedema coma', a: 'Hyponatremia',
          why: 'Reduced free water clearance, made worse by whatever precipitated the crisis. Correcting it too quickly carries its own risk, so the sodium is treated cautiously alongside the thyroid hormone.' }
      ]
    },

    /* ══════════════════════════════════════════════════════════════
       Two topics chosen for the family medicine boards rather than for
       the wards. Preventive care is the most distinctly family-medicine
       material on that exam and nothing here covered it; behavioral
       health is a comparable share of the blueprint and was equally
       absent.

       Preventive care also stretches the structure on purpose. Its
       facets are not presentation-diagnosis-management-pitfalls, because
       it is not a disease — the two layers are just a topic and its
       decks, and nothing requires the second layer to be a clinical
       course. Guideline bodies are named in `why` as prose where the
       body is the fact worth knowing.
       ══════════════════════════════════════════════════════════════ */

    {
      id: 'prev-cancer',
      topic: 'Preventive Care',
      name: 'CANCER SCREENING',
      blurb: 'Who, when, how often, and when to stop',
      cards: [
        { type: 'number', q: 'Age at which average-risk colorectal screening now begins', value: 45, unit: 'years',
          why: 'Lowered from fifty because incidence in younger adults has been climbing for two decades. It is one of the few screening ages to have moved down rather than up.' },

        { type: 'number', q: 'Interval between colonoscopies in average-risk screening', value: 10, unit: 'years',
          why: 'It reflects how long an adenoma takes to become cancer. Repeating sooner adds perforation and sedation risk without adding yield, which is why the interval is long rather than cautious.' },

        { type: 'number', q: 'Age at which cervical cancer screening begins', value: 21, unit: 'years',
          why: 'HPV infection is common in the late teens and usually clears on its own. Screening earlier finds transient abnormality and leads to procedures that can weaken the cervix in a later pregnancy — the harm here is the treatment, not a missed cancer.' },

        { type: 'mcq', q: 'Preferred cervical screening strategy from age 30 to 65',
          a: 'HPV testing every five years',
          distractors: ['Cytology every year', 'HPV testing every year', 'Cytology every five years'],
          why: 'Primary HPV testing looks for the cause rather than the consequence, and a negative result predicts low risk for years — which is what buys the longer interval.' },

        { type: 'number', q: 'Age at which cervical screening can usually stop', value: 65, unit: 'years',
          why: 'Provided prior screening was adequate and negative. Knowing when to stop matters as much as when to start: continuing finds almost nothing and generates procedures in women least able to benefit.' },

        { type: 'multi', q: 'Criteria for annual low-dose CT lung cancer screening',
          answers: ['Age 50 to 80', '20 pack-year history', 'Quit within 15 years'],
          distractors: ['Any smoking history', 'Chronic cough', 'Family history of lung cancer'],
          why: 'All three must hold. Outside that group the cancers found are too few against a high rate of nodules that lead to further scans and biopsies.' },

        { type: 'number', q: 'Age at which USPSTF now advises breast cancer screening to begin',
          value: 40, unit: 'years',
          why: 'Moved down from fifty in 2024, biennially through seventy-four. Other bodies still differ, so the useful thing is the direction of travel and the reason — rising incidence in younger women and better modelling of the trade-off.' },

        { type: 'recall', q: 'Mammography interval under current USPSTF advice', a: 'Every two years',
          why: 'Annual screening finds slightly more and roughly doubles false positives and biopsies for a small difference in mortality. The interval is where that trade-off was struck.' },

        { type: 'mcq', q: 'How prostate cancer screening should be handled in men 55 to 69',
          a: 'Shared decision making',
          distractors: ['Routine annual PSA', 'No discussion needed', 'PSA only if symptomatic'],
          why: 'The mortality benefit is small and the harms are real — overdiagnosis, biopsy complications, and treatment of cancers that would never have surfaced. When benefit and harm are that close, the decision belongs to the patient.' }
      ]
    },

    {
      id: 'prev-immunisation',
      topic: 'Preventive Care',
      name: 'IMMUNIZATIONS',
      blurb: 'The adult schedule and the ones with a reason behind them',
      cards: [
        { type: 'mcq', q: 'Vaccine repeated every year because its target changes',
          a: 'Influenza vaccine',
          distractors: ['Tdap', 'Zoster', 'Hepatitis B'],
          why: 'The circulating strains drift each season, so last year antibody no longer matches. Nothing else on the adult schedule chases a moving target.' },

        { type: 'number', q: 'Age at which recombinant zoster vaccination is recommended', value: 50, unit: 'years',
          why: 'Two doses. Both zoster and postherpetic neuralgia climb steeply after fifty, and the recombinant vaccine can be used in immunocompromised patients where the older live one could not.' },

        { type: 'recall', q: 'Vaccine given during every pregnancy', a: 'Tdap',
          why: 'Maternal antibody crosses the placenta and protects the newborn from pertussis in the months before their own vaccinations begin. It is given every pregnancy regardless of when the last dose was.' },

        { type: 'number', q: 'Weeks of pregnancy at which Tdap is given', low: 27, high: 36, unit: 'weeks',
          why: 'Late enough to produce a good antibody response, early enough for it to cross before delivery. Either end of that window loses part of the point.' },

        { type: 'recall', q: 'Adolescent vaccine given specifically to prevent cancer', a: 'HPV vaccine',
          why: 'Routine at eleven to twelve, before exposure rather than after it. It prevents nearly all cervical cancer and a large share of oropharyngeal and anal cancers.' },

        { type: 'mcq', q: 'Extra vaccine needed by an adult without a functioning spleen',
          a: 'Meningococcal vaccine',
          distractors: ['Hepatitis A', 'Rabies', 'Typhoid'],
          why: 'The spleen clears encapsulated organisms, so asplenia leaves a specific gap against meningococcus, pneumococcus and Haemophilus. The vaccines fill exactly that gap.' },

        { type: 'truefalse', q: 'Influenza vaccine can be given to someone with an egg allergy', a: true,
          why: 'It stopped being treated as a contraindication some years ago, and no special observation period is required. Any age-appropriate vaccine can be used.' },

        { type: 'recall', q: 'Vaccine type avoided during pregnancy', a: 'Live attenuated vaccines',
          why: 'A theoretical risk of fetal infection rather than a demonstrated one, but enough to defer. Inactivated vaccines are not merely permitted in pregnancy, several are actively recommended.' }
      ]
    },

    {
      id: 'prev-other',
      topic: 'Preventive Care',
      name: 'OTHER SCREENING',
      blurb: 'Aneurysms, bones, infections, and what not to order',
      cards: [
        { type: 'mcq', q: 'Who gets a one-time ultrasound to screen for abdominal aortic aneurysm',
          a: 'Men 65 to 75 who ever smoked',
          distractors: ['All adults over 65', 'Women 65 to 75', 'Anyone with hypertension'],
          why: 'Prevalence outside this group is low enough that the scan mostly produces small aneurysms needing years of surveillance rather than lives saved.' },

        { type: 'truefalse', q: 'A normal aneurysm screening ultrasound is repeated every five years', a: false,
          why: 'It is a one-time test. An aorta of normal calibre at that age is very unlikely to become an aneurysm needing repair within the remaining life expectancy.' },

        { type: 'number', q: 'Age at which bone density screening begins for women', value: 65, unit: 'years',
          why: 'Earlier if risk factors bring the fracture risk up to that of a 65-year-old. The trigger is the calculated risk rather than the birthday, which is the part most often missed.' },

        { type: 'number', q: 'Age range in which every adult should be screened once for hepatitis C',
          low: 18, high: 79, unit: 'years',
          why: 'Once curable, screening became worth doing broadly rather than only in the high-risk. It is a single test for most people, not a repeated one.' },

        { type: 'multi', q: 'Screened for at least once in an average adult',
          answers: ['HIV', 'Hepatitis C', 'Blood pressure', 'Depression'],
          distractors: ['Thyroid function', 'Vitamin D level'],
          why: 'The two distractors are among the highest-volume low-value tests in primary care. Neither is recommended for screening someone without symptoms.' },

        { type: 'truefalse', q: 'Routine vitamin D screening is recommended for healthy adults', a: false,
          why: 'There is no evidence that finding and correcting a low level in an asymptomatic adult changes any outcome. It mostly generates supplementation and repeat testing.' },

        { type: 'recall', q: 'Blood pressure screening frequency in adults aged 40 and over',
          a: 'At least once a year',
          why: 'Younger adults with a normal reading can go three to five years. The interval shortens with age because that is when the incidence climbs.' },

        { type: 'recall', q: 'Counselling with the largest mortality benefit available in a routine visit',
          a: 'Smoking cessation',
          why: 'Nothing else offered in ten minutes changes life expectancy as much. Brief advice alone raises quit rates measurably, and adding pharmacotherapy roughly doubles them.' }
      ]
    },

    {
      id: 'prev-pitfalls',
      topic: 'Preventive Care',
      name: 'PITFALLS',
      blurb: 'Why screening looks better than it is',
      cards: [
        { type: 'recall', q: 'Bias that makes screened cancers appear to be survived longer',
          a: 'Lead-time bias',
          why: 'Finding a cancer earlier moves the diagnosis date backwards without moving the death date. Survival time lengthens and nothing about the outcome has changed, which is why screening is judged on mortality rather than on survival.' },

        { type: 'recall', q: 'Bias by which screening preferentially catches slow-growing disease',
          a: 'Length-time bias',
          why: 'Aggressive cancers arise and kill between screening rounds; indolent ones sit there waiting to be found. The screened group is therefore enriched with the cancers that were least dangerous to begin with.' },

        { type: 'recall', q: 'Term for finding disease that would never have caused harm', a: 'Overdiagnosis',
          why: 'Different from a false positive: the disease is genuinely there, it simply would never have surfaced. It is the hardest harm to see, because the patient it happens to believes screening saved them.' },

        { type: 'truefalse', q: 'Screening should stop when life expectancy is under about ten years', a: true,
          why: 'The benefit of most cancer screening arrives a decade later while the harms are immediate. Below that horizon a patient is offered the harm and cannot live long enough to collect the benefit.' },

        { type: 'truefalse', q: 'A positive screening test is a diagnosis', a: false,
          why: 'Screening tests are tuned for sensitivity, so in a low-prevalence population most positives are false. A positive result starts a diagnostic pathway rather than ending one.' },

        { type: 'mcq', q: 'Main reason whole-body CT screening is not recommended',
          a: 'It mostly finds incidentalomas',
          distractors: ['It is too slow', 'It misses most cancers', 'The radiation is negligible'],
          why: 'The findings are real but almost never consequential, and each one generates follow-up imaging or a biopsy. The harm arrives reliably and the benefit does not.' },

        { type: 'truefalse', q: 'Shared decision making belongs where benefit and harm are close', a: true,
          why: 'When a test clearly helps, offering it is enough; when it clearly does not, it should not be offered. The discussion earns its time precisely in the middle, which is where PSA and several others sit.' }
      ]
    },

    {
      id: 'dep-presentation',
      topic: 'Depression',
      name: 'PRESENTATION',
      blurb: 'What has to be there, and who does not look depressed',
      cards: [
        { type: 'multi', q: 'Core symptoms, one of which must be present to diagnose depression',
          answers: ['Depressed mood', 'Loss of interest'],
          distractors: ['Weight change', 'Fatigue', 'Poor concentration'],
          why: 'The distractors all count toward the total but none can carry the diagnosis alone. Without one of the two core symptoms it is not major depression however many others are present.' },

        { type: 'number', q: 'Minimum weeks of symptoms required for major depression', value: 2, unit: 'weeks',
          why: 'It is what separates an episode from an understandable reaction to something. Duration is doing the work that severity alone cannot.' },

        { type: 'recall', q: 'Screening and severity tool used for depression in primary care', a: 'PHQ-9',
          why: 'Its nine items map onto the diagnostic criteria, so the same instrument screens, grades severity and tracks response to treatment.' },

        { type: 'number', q: 'PHQ-9 score at or above which moderate depression begins', value: 10, unit: 'points',
          why: 'The usual threshold for offering active treatment. Below it, follow-up and watchful waiting are often enough and treatment adds side effects for little gain.' },

        { type: 'recall', q: 'Presentation of depression more typical of older adults',
          a: 'Somatic and cognitive complaints',
          why: 'Pain, sleep disturbance and memory trouble dominate while low mood is denied outright. It is missed, or mistaken for early dementia, which is why the screening question is asked rather than inferred.' },

        { type: 'truefalse', q: 'Depression in adolescents often presents as irritability rather than sadness', a: true,
          why: 'Irritability is written into the diagnostic criteria for young people for exactly this reason. Waiting for a teenager to describe low mood is how the diagnosis gets delayed for years.' },

        { type: 'mcq', q: 'Question that must be asked of every depressed patient',
          a: 'About thoughts of suicide',
          distractors: ['About family history', 'About diet', 'About exercise'],
          why: 'It is the one omission that can be fatal, and the only reliable way to find the risk. The others matter and can wait for the next visit.' }
      ]
    },

    {
      id: 'dep-diagnosis',
      topic: 'Depression',
      name: 'DIAGNOSIS',
      blurb: 'What it is not, and the one question asked before treating',
      cards: [
        { type: 'multi', q: 'Conditions worth excluding before settling on major depression',
          answers: ['Hypothyroidism', 'Anemia', 'Substance use', 'Bipolar disorder'],
          distractors: ['Hyperlipidemia', 'Osteoarthritis'],
          why: 'The first two are treatable mimics found by a blood test. Missing bipolar disorder is the one that changes treatment most dangerously.' },

        { type: 'truefalse', q: 'Bipolar disorder should be asked about before starting an antidepressant', a: true,
          why: 'An antidepressant given alone in bipolar depression can precipitate mania or rapid cycling. A history of elevated mood, reduced need for sleep or uncharacteristically impulsive episodes is what to ask for.' },

        { type: 'recall', q: 'Blood test that most often reveals a treatable mimic of depression',
          a: 'Thyroid function',
          why: 'Hypothyroidism produces fatigue, low mood and cognitive slowing that are indistinguishable from depression at the bedside, and it resolves with replacement rather than an antidepressant.' },

        { type: 'bucket', q: 'Depression or grief?',
          bins: ['Depression', 'Grief'],
          items: [
            { label: 'Persistent anhedonia', bin: 'Depression' },
            { label: 'Global guilt and worthlessness', bin: 'Depression' },
            { label: 'Self-loathing', bin: 'Depression' },
            { label: 'Waves of sadness on reminders', bin: 'Grief' },
            { label: 'Preserved capacity for joy', bin: 'Grief' },
            { label: 'Wish to join the deceased', bin: 'Grief' }
          ],
          why: 'The useful axis is self-worth. Grief leaves it intact and comes in waves; depression corrodes it and stays flat, and a wish to join the deceased is not the same as a wish to be dead.' },

        { type: 'number', q: 'PHQ-9 score at or above which depression is called severe', value: 20, unit: 'points',
          why: 'Severity guides intensity rather than choice of drug: it is what moves the conversation toward combined therapy and closer follow-up.' },

        { type: 'recall', q: 'Term for depressive symptoms lasting two years or more',
          a: 'Persistent depressive disorder',
          why: 'It is often milder day to day and does more cumulative damage, precisely because it gets accepted as a personality rather than recognized as an illness.' },

        { type: 'recall', q: 'Finding that most clearly warrants urgent psychiatric referral',
          a: 'Active suicidal intent with a plan',
          why: 'Intent and a plan are a different category from passive thoughts of not wanting to be here. The distinction is what the risk assessment is actually for.' }
      ]
    },

    {
      id: 'dep-management',
      topic: 'Depression',
      name: 'MANAGEMENT',
      blurb: 'Which drug, how long to wait, and how long to continue',
      cards: [
        { type: 'recall', q: 'First-line drug class for major depression', a: 'SSRI',
          why: 'Not more effective than the alternatives, but better tolerated and far safer in overdose — which is what decides first-line status in a population where overdose is one of the risks being treated.' },

        { type: 'number', q: 'Weeks before judging whether an antidepressant has worked', low: 4, high: 6, unit: 'weeks',
          why: 'Some lift often appears within two weeks, but a full response takes longer. Switching earlier is the commonest reason a patient ends up with a list of drugs that all supposedly failed.' },

        { type: 'number', q: 'Months to continue an antidepressant after remission', low: 6, high: 12, unit: 'months',
          why: 'The point of feeling well is when relapse risk is highest and when people stop. Treatment continues through the vulnerable period rather than until the mood lifts.' },

        { type: 'truefalse', q: 'Psychotherapy alone is a reasonable choice in mild to moderate depression', a: true,
          why: 'It performs comparably to medication in that range, and combining the two beats either for moderate to severe. Patient preference is a legitimate deciding factor here rather than a concession.' },

        { type: 'mcq', q: 'Antidepressant to avoid in a patient with an eating disorder',
          a: 'Bupropion',
          distractors: ['Sertraline', 'Mirtazapine', 'Escitalopram'],
          why: 'It lowers the seizure threshold, and the electrolyte disturbance that comes with purging lowers it further. The two risks compound rather than add.' },

        { type: 'mcq', q: 'Antidepressant chosen when poor appetite and insomnia dominate',
          a: 'Mirtazapine',
          distractors: ['Fluoxetine', 'Bupropion', 'Venlafaxine'],
          why: 'Sedation and appetite stimulation are side effects to be tolerated everywhere else and the whole reason to pick it here — the same property, valued differently.' },

        { type: 'mcq', q: 'SSRI generally preferred in pregnancy and breastfeeding',
          a: 'Sertraline',
          distractors: ['Paroxetine', 'Fluoxetine', 'Citalopram'],
          why: 'Low transfer into breast milk and the most reassuring data in pregnancy. Paroxetine is the one specifically avoided.' },

        { type: 'recall', q: 'Reason an SSRI is tapered rather than simply stopped',
          a: 'Discontinuation syndrome',
          why: 'Dizziness, flu-like aching and electric-shock sensations, worst with short half-life drugs such as paroxetine and venlafaxine. Fluoxetine effectively tapers itself, which is why it is the exception.' },

        { type: 'multi', q: 'Non-drug measures with real evidence in depression',
          answers: ['Structured exercise', 'Behavioral activation', 'Cognitive behavioral therapy', 'Sleep regulation'],
          distractors: ['Vitamin D supplements', 'Detox diets'],
          why: 'Behavioral activation is the one most often left out and among the easiest to start: scheduling rewarding activity, deliberately, before the motivation to do it returns.' }
      ]
    },

    {
      id: 'dep-pitfalls',
      topic: 'Depression',
      name: 'PITFALLS',
      blurb: 'Interactions, warnings, and the reasons people quietly stop',
      cards: [
        { type: 'truefalse', q: 'Asking about suicide increases the risk of it', a: false,
          why: 'It does not, and the belief that it does is why the question gets skipped. Asking directly is the only reliable way to assess the risk, and patients generally answer.' },

        { type: 'recall', q: 'Syndrome caused by combining serotonergic drugs', a: 'Serotonin syndrome',
          why: 'Agitation, clonus, hyperreflexia and fever. The triggers worth remembering are the ones prescribed casually — tramadol, triptans, linezolid — rather than the psychiatric drugs everybody already watches.' },

        { type: 'mcq', q: 'Common analgesic that can precipitate serotonin syndrome with an SSRI',
          a: 'Tramadol',
          distractors: ['Acetaminophen', 'Ibuprofen', 'Codeine'],
          why: 'It inhibits serotonin reuptake as well as acting at opioid receptors, which is easy to forget when it is being prescribed for back pain by someone who did not start the antidepressant.' },

        { type: 'truefalse', q: 'Antidepressants carry a warning about suicidality in young people', a: true,
          why: 'An increase in suicidal thinking in under-25s during the first weeks. The response is closer follow-up early on, not withholding treatment — untreated depression carries the larger risk.' },

        { type: 'recall', q: 'Electrolyte disturbance SSRIs can cause in older adults', a: 'Hyponatremia',
          why: 'Through SIADH, typically a few weeks in. Worth checking when an older patient becomes confused or unsteady shortly after starting, before it gets attributed to age.' },

        { type: 'truefalse', q: 'Sexual side effects on an SSRI usually settle within a few weeks', a: false,
          why: 'They often persist, and they are among the commonest reasons people stop without saying so. Asking directly, rather than waiting to be told, is what keeps someone in treatment.' },

        { type: 'mcq', q: 'First step when there has been no response after an adequate trial',
          a: 'Check adherence and dose',
          distractors: ['Add a second antidepressant', 'Refer immediately', 'Stop treatment'],
          why: 'Partial adherence and a dose never titrated past the starting one explain most apparent non-response, and both are fixable before anything is added or blamed.' }
      ]
    },

    /* ══════════════════════════════════════════════════════════════
       Three more chosen by blueprint weight rather than by interest.
       Musculoskeletal is the largest single category on the family
       medicine boards and nothing here touched it; lipids sit inside
       cardiovascular prevention and were the gap left after hypertension
       and heart failure; reproductive health was entirely absent.

       Low back pain uses RED FLAGS in place of DIAGNOSIS, because on
       this condition the diagnostic task is almost entirely about
       deciding who is not ordinary — and lipids has no presentation at
       all, so it does not get a deck pretending otherwise.
       ══════════════════════════════════════════════════════════════ */

    {
      id: 'lbp-presentation',
      topic: 'Low Back Pain',
      name: 'PRESENTATION',
      blurb: 'Ordinary backs, irritated roots, and narrow canals',
      cards: [
        { type: 'recall', q: 'Term for back pain with no specific identifiable cause',
          a: 'Non-specific low back pain',
          why: 'It covers the great majority, and naming it that way is not a failure to diagnose — it is the diagnosis. It changes management by calling off the search for a lesion.' },

        { type: 'truefalse', q: 'Most acute low back pain improves substantially within six weeks', a: true,
          why: 'The natural history is genuinely favorable. It is the single most useful thing to tell a patient, and it is the reason early imaging changes nothing.' },

        { type: 'recall', q: 'Feature of leg pain that suggests a compressed nerve root',
          a: 'Pain radiating below the knee',
          why: 'Pain that stops at the buttock or thigh is usually referred from the joints or muscles. Below the knee, in a band that follows a dermatome, is what points at a root.' },

        { type: 'mcq', q: 'Nerve roots most often compressed by a lumbar disc herniation',
          a: 'L5 and S1',
          distractors: ['L1 and L2', 'T11 and T12', 'S3 and S4'],
          why: 'The two lowest discs carry the most load and degenerate first, so the roots crossing them are the ones that suffer.' },

        { type: 'recall', q: 'Bedside test that stretches the sciatic nerve', a: 'Straight leg raise',
          why: 'The useful positive is pain reproduced between about thirty and seventy degrees and radiating below the knee. Tightness in the hamstring is not the same thing.' },

        { type: 'recall', q: 'Classic history of lumbar spinal stenosis',
          a: 'Leg pain walking, eased by bending',
          why: 'The canal opens in flexion, so leaning on a trolley or riding a bicycle is comfortable while walking upright is not. That posture dependence is what separates it from vascular claudication.' },

        { type: 'bucket', q: 'Radicular or non-specific?',
          bins: ['Radicular', 'Non-specific'],
          items: [
            { label: 'Pain below the knee', bin: 'Radicular' },
            { label: 'Numbness in a dermatome', bin: 'Radicular' },
            { label: 'Positive straight leg raise', bin: 'Radicular' },
            { label: 'Diffuse lumbar ache', bin: 'Non-specific' },
            { label: 'Worse after prolonged sitting', bin: 'Non-specific' },
            { label: 'No neurological signs', bin: 'Non-specific' }
          ] }
      ]
    },

    {
      id: 'lbp-redflags',
      topic: 'Low Back Pain',
      name: 'RED FLAGS',
      blurb: 'The few backs that are not ordinary backs',
      cards: [
        { type: 'multi', q: 'Features of cauda equina syndrome',
          answers: ['Saddle anesthesia', 'New bladder dysfunction', 'Progressive leg weakness', 'Bilateral sciatica'],
          distractors: ['Pain worse on sitting', 'Paraspinal muscle spasm'],
          why: 'Any one of them is enough to act on. Waiting for the full picture is how the diagnosis gets made too late to matter.' },

        { type: 'recall', q: 'Emergency signalled by saddle anesthesia with urinary retention',
          a: 'Cauda equina syndrome',
          why: 'Compression of the lumbosacral roots below the cord. Decompression is time-critical: delay costs bladder, bowel and sexual function permanently, and none of it comes back.' },

        { type: 'mcq', q: 'Imaging to obtain when cauda equina syndrome is suspected',
          a: 'Urgent MRI',
          distractors: ['Plain radiograph', 'CT without contrast', 'Bone scan'],
          why: 'Only MRI shows the roots and the disc together. A normal radiograph here is worse than no test, because it reassures.' },

        { type: 'multi', q: 'Features raising concern for malignancy as the cause',
          answers: ['History of cancer', 'Unexplained weight loss', 'Pain at night or at rest', 'Age over 50 with new pain'],
          distractors: ['Pain relieved by rest', 'Onset after heavy lifting'],
          why: 'Pain that does not ease on lying down is the discriminator worth carrying. Mechanical pain almost always settles in some position.' },

        { type: 'multi', q: 'Features raising concern for spinal infection',
          answers: ['Fever', 'Injection drug use', 'Recent spinal procedure', 'Immunosuppression'],
          distractors: ['Morning stiffness', 'Sedentary work'] },

        { type: 'recall', q: 'Feature separating inflammatory back pain from mechanical',
          a: 'It improves with exercise',
          why: 'Mechanical pain worsens with activity and eases with rest; inflammatory pain does the reverse, with morning stiffness lasting over half an hour and onset before forty.' },

        { type: 'number', q: 'Age above which new back pain raises the index of suspicion', value: 50, unit: 'years',
          why: 'Fifty is not dangerous in itself. The pre-test probability of malignancy, fracture and infection all rise together, so the identical story means something different.' },

        { type: 'mcq', q: 'Red flag most suggestive of vertebral compression fracture',
          a: 'Prolonged corticosteroid use',
          distractors: ['Pain on flexion', 'Paraspinal tenderness', 'Sedentary occupation'],
          why: 'Steroids and osteoporosis together mean a fracture can follow trivial trauma or none at all, so the absence of an injury does not argue against it.' }
      ]
    },

    {
      id: 'lbp-management',
      topic: 'Low Back Pain',
      name: 'MANAGEMENT',
      blurb: 'What helps, what does not, and how long to wait',
      cards: [
        { type: 'truefalse', q: 'Acute low back pain without red flags needs no imaging', a: true,
          why: 'Imaging early does not improve outcomes and reliably finds degenerative change that is present in pain-free people too. It then gets treated, which is how a scan makes a patient worse.' },

        { type: 'recall', q: 'Advice that most improves recovery from acute low back pain', a: 'Stay active',
          why: 'Bed rest delays recovery and worsens outcomes. Continuing ordinary activity within the limits of pain is the most effective single instruction available, and it costs nothing.' },

        { type: 'mcq', q: 'First-line drug for acute low back pain',
          a: 'NSAID',
          distractors: ['Opioid', 'Gabapentin', 'Systemic corticosteroid'],
          why: 'Modest benefit, but the best evidence of the options. Opioids are no better for pain and clearly worse for function; gabapentinoids and steroids have little to show at all.' },

        { type: 'multi', q: 'Non-drug treatments with evidence in chronic low back pain',
          answers: ['Exercise therapy', 'Cognitive behavioral therapy', 'Spinal manipulation', 'Multidisciplinary rehab'],
          distractors: ['Bed rest', 'Lumbar traction'],
          why: 'The effects are modest and they are what there is. Exercise type matters far less than doing some, which makes patient preference the sensible way to choose.' },

        { type: 'number', q: 'Weeks of conservative care before imaging, absent red flags', value: 6, unit: 'weeks',
          why: 'Most people have recovered by then, so waiting removes the majority of scans that would have found nothing worth acting on.' },

        { type: 'mcq', q: 'Indication for surgical referral in lumbar disc herniation',
          a: 'Progressive neurological deficit',
          distractors: ['Pain for two weeks', 'Positive straight leg raise', 'Disc bulge on MRI'],
          why: 'Surgery speeds relief of leg pain but does not change where patients are at a year. That makes a worsening deficit the real indication, not the severity of the pain or the picture.' },

        { type: 'truefalse', q: 'Most lumbar disc herniations settle without surgery', a: true,
          why: 'The extruded material is resorbed over weeks to months, and the larger herniations often resorb fastest. Knowing this is what makes waiting a plan rather than a delay.' },

        { type: 'recall', q: 'Muscle relaxant harm that limits its usefulness in older patients',
          a: 'Sedation and falls',
          why: 'A short course can help genuine spasm, but the sedation is not trivial in an older person, where a fall costs far more than the back pain it was prescribed for.' }
      ]
    },

    {
      id: 'lbp-pitfalls',
      topic: 'Low Back Pain',
      name: 'PITFALLS',
      blurb: 'How a sore back becomes a disabled patient',
      cards: [
        { type: 'truefalse', q: 'Degenerative changes on MRI explain where the pain comes from', a: false,
          why: 'Disc bulges, degeneration and even herniations are common in people with no pain at all, and get commoner with age. Reporting them as the cause creates a patient who believes their spine is crumbling.' },

        { type: 'recall', q: 'Harm done by telling a patient their spine is degenerating',
          a: 'Fear-avoidance and disability',
          why: 'The belief that movement damages the back drives inactivity, deconditioning and chronicity. The words chosen in the consultation are part of the treatment, not a preamble to it.' },

        { type: 'mcq', q: 'Strongest predictor of chronic disability after acute back pain',
          a: 'Psychosocial factors',
          distractors: ['Loss of disc height', 'Severity of initial pain', 'Age'],
          why: 'Distress, fear of movement and dissatisfaction at work predict the one-year outcome far better than anything visible on a scan — which is why the scan is not where to look.' },

        { type: 'recall', q: 'Reason plain radiographs are rarely useful in back pain',
          a: 'They show bone and nothing else',
          why: 'They miss the discs and nerves that cause radicular pain, while delivering gonadal radiation and a list of degenerative findings that will be read as an explanation.' },

        { type: 'truefalse', q: 'A normal neurological examination excludes cauda equina syndrome', a: false,
          why: 'Early cauda equina can present with retention or saddle sensory change before any weakness appears. The history carries more weight than the examination here, and the bladder question has to be asked out loud.' },

        { type: 'recall', q: 'Question that must be asked in every significant episode of back pain',
          a: 'About bladder and bowel function',
          why: 'It is the only reliable way to catch cauda equina while it is still reversible, and patients almost never volunteer it — partly through embarrassment, partly because they do not connect it to their back.' }
      ]
    },

    {
      id: 'lipid-who',
      topic: 'Lipids',
      name: 'WHO TO TREAT',
      blurb: 'The four groups, and the number that starts a conversation',
      cards: [
        { type: 'multi', q: 'Groups in which statin benefit is established',
          answers: ['Clinical ASCVD', 'LDL 190 or above', 'Diabetes aged 40 to 75', '10-year risk 7.5% or more'],
          distractors: ['Raised triglycerides alone', 'Family history alone'],
          why: 'These four are where the trial evidence sits. Everything outside them is a risk discussion rather than an indication.' },

        { type: 'number', q: 'LDL at or above which a statin is indicated whatever the risk score',
          value: 190, unit: 'mg/dL',
          why: 'At this level a genetic cause is likely and what matters is lifetime exposure, which a ten-year calculator systematically understates in a younger patient.' },

        { type: 'recall', q: 'Condition to suspect with an LDL over 190 and a family history',
          a: 'Familial hypercholesterolemia',
          why: 'Roughly one in 250 people, and mostly undiagnosed. Finding it in one patient means the siblings, parents and children all need testing — the diagnosis travels.' },

        { type: 'number', q: 'Ten-year ASCVD risk at or above which a statin is generally advised',
          value: 7.5, unit: '%',
          why: 'Between 5 and 7.5 it is a conversation and above 20 it is emphatic. The threshold is a prompt to discuss rather than a switch to flip.' },

        { type: 'number', q: 'Age from which ten-year ASCVD risk is routinely calculated', value: 40, unit: 'years' },

        { type: 'mcq', q: 'Statin intensity for someone with established cardiovascular disease',
          a: 'High intensity',
          distractors: ['Moderate intensity', 'Low intensity', 'Any statin at any dose'],
          why: 'Absolute risk is highest here and benefit scales with the size of the LDL reduction, so secondary prevention takes the largest reduction that can be tolerated.' },

        { type: 'truefalse', q: 'Most adults with diabetes aged 40 to 75 warrant a statin', a: true,
          why: 'Diabetes carries risk comparable to established disease given enough years, which is why that group enters the benefit list directly rather than through the calculator.' },

        { type: 'recall', q: 'Test used when the decision to start a statin is genuinely borderline',
          a: 'Coronary artery calcium score',
          why: 'A score of zero moves risk down far enough to defer in many people; a high score settles it the other way. It is a tie-breaker, not a screening test, and it only earns its radiation in the middle.' }
      ]
    },

    {
      id: 'lipid-treatment',
      topic: 'Lipids',
      name: 'TREATMENT',
      blurb: 'Statins first, then what, and the one number that is not about arteries',
      cards: [
        { type: 'recall', q: 'First-line drug class for lowering LDL cholesterol', a: 'Statin',
          why: 'The only class with consistent mortality benefit across the widest range of patients, which is why everything else is defined by what it adds to a statin.' },

        { type: 'number', q: 'Minimum LDL reduction that defines high-intensity statin therapy',
          value: 50, unit: '%',
          why: 'The definition is a percentage rather than a dose, because different statins reach it at very different milligram strengths.' },

        { type: 'number', q: 'LDL reduction expected from moderate-intensity statin therapy',
          low: 30, high: 49, unit: '%' },

        { type: 'mcq', q: 'Drug added when a maximally tolerated statin is not enough',
          a: 'Ezetimibe',
          distractors: ['Fenofibrate', 'Niacin', 'Omega-3 acid'],
          why: 'It adds a further LDL reduction with outcome evidence behind it. The distractors move other lipid fractions without a matching effect on events, which is the distinction that matters.' },

        { type: 'recall', q: 'Class used when statin and ezetimibe still leave LDL too high',
          a: 'PCSK9 inhibitor' },

        { type: 'mcq', q: 'Lipid abnormality treated mainly to prevent something other than heart attack',
          a: 'Severe hypertriglyceridemia',
          distractors: ['High LDL', 'Low HDL', 'High Lp(a)'],
          why: 'Past a certain level the immediate danger stops being vascular and becomes acute pancreatitis, which changes both the urgency and the drug.' },

        { type: 'number', q: 'Triglyceride level above which pancreatitis risk drives treatment',
          value: 500, unit: 'mg/dL' },

        { type: 'multi', q: 'Lifestyle measures with a real effect on lipids',
          answers: ['Reduced saturated fat', 'Regular aerobic exercise', 'Weight loss', 'Reduced alcohol'],
          distractors: ['Vitamin E', 'Garlic supplements'],
          why: 'Alcohol acts mainly on triglycerides and is the one most often left unasked, particularly in the patient whose triglycerides refuse to come down.' }
      ]
    },

    {
      id: 'lipid-monitoring',
      topic: 'Lipids',
      name: 'MONITORING',
      blurb: 'When to recheck, and what a muscle ache actually means',
      cards: [
        { type: 'number', q: 'Weeks after starting a statin before rechecking the lipid panel',
          low: 4, high: 12, unit: 'weeks',
          why: 'The effect is essentially complete by then. Checking earlier underestimates the response and invites an unnecessary dose increase.' },

        { type: 'truefalse', q: 'A fasting sample is required for a lipid panel', a: false,
          why: 'Non-fasting samples are fine for screening and risk estimation, and asking people to fast is a barrier that delays testing. Only a markedly raised triglyceride usually prompts a fasting repeat.' },

        { type: 'mcq', q: 'Best response when a patient reports muscle aches on a statin',
          a: 'Check CK and reassess',
          distractors: ['Stop statins permanently', 'Ignore it', 'Switch to a fibrate'],
          why: 'Most aches on a statin turn out not to be caused by it. Rechallenge, a different statin or alternate-day dosing keeps the majority on treatment, and abandoning the class forfeits the benefit for good.' },

        { type: 'recall', q: 'Commonest reason a statin fails to lower LDL as much as expected',
          a: 'It is not being taken',
          why: 'Adherence at a year is poor and rarely volunteered. Asking before adding a second drug avoids treating a pharmacological problem that is not pharmacological.' },

        { type: 'truefalse', q: 'A statin started for secondary prevention is continued indefinitely', a: true,
          why: 'The risk it treats does not go away, and stopping returns it. This is one of the clearest cases in medicine for lifelong therapy rather than a course.' },

        { type: 'recall', q: 'Blood test worth a baseline before a statin but not routine repeats',
          a: 'Liver transaminases',
          why: 'Scheduled monitoring was abandoned because it found transient rises that led to stopping an effective drug. Rechecking is driven by symptoms now, not by the calendar.' }
      ]
    },

    {
      id: 'lipid-pitfalls',
      topic: 'Lipids',
      name: 'PITFALLS',
      blurb: 'Interactions, myths, and a number that is calculated rather than measured',
      cards: [
        { type: 'truefalse', q: 'Statins commonly cause clinically significant liver injury', a: false,
          why: 'Transaminase rises are usually transient and serious injury is rare enough to be reportable. Fear of it has stopped far more statins than the event ever has.' },

        { type: 'mcq', q: 'Antibiotic that raises statin levels and myopathy risk',
          a: 'Clarithromycin',
          distractors: ['Amoxicillin', 'Azithromycin', 'Doxycycline'],
          why: 'It inhibits CYP3A4. The macrolide chosen matters — azithromycin does not do this, which is why it is the one to reach for in a patient on simvastatin.' },

        { type: 'recall', q: 'Juice that raises levels of some statins', a: 'Grapefruit juice',
          why: 'The same CYP3A4 route. It affects simvastatin and atorvastatin and leaves pravastatin and rosuvastatin alone, so the advice depends on which statin the patient is actually on.' },

        { type: 'truefalse', q: 'Statins modestly raise the chance of developing diabetes', a: true,
          why: 'Real, small, and outweighed by the cardiovascular benefit in anyone who meets the criteria for treatment. Worth knowing so it can be answered honestly when a patient has read about it.' },

        { type: 'truefalse', q: 'Statins are generally stopped during pregnancy', a: true,
          why: 'Cholesterol is needed for fetal development, and the benefit to the mother accrues over decades rather than months. Treatment is paused rather than abandoned.' },

        { type: 'mcq', q: 'Value on a standard lipid panel that is calculated rather than measured',
          a: 'LDL cholesterol',
          distractors: ['Total cholesterol', 'HDL cholesterol', 'Triglycerides'],
          why: 'It is derived from the other three, and the equation becomes unreliable when triglycerides are high — so the sample that most needs an accurate LDL is the one least able to give it.' },

        { type: 'recall', q: 'Lipid measure that stays reliable when triglycerides are high',
          a: 'Non-HDL cholesterol',
          why: 'Total minus HDL. No calculation, no fasting, and it captures every atherogenic particle rather than one of them.' }
      ]
    },

    {
      id: 'contra-effectiveness',
      topic: 'Contraception',
      name: 'EFFECTIVENESS',
      blurb: 'What actually works, and why typical use is the number that counts',
      cards: [
        { type: 'order', q: 'Methods from most to least effective in typical use', steps: [
          'Implant and IUD',
          'Injection',
          'Pill, patch or ring',
          'Male condom',
          'Withdrawal'
        ] },

        { type: 'recall', q: 'Term for the methods with the lowest typical-use failure',
          a: 'Long-acting reversible contraception',
          why: 'Their advantage comes from removing the user from the equation. Nothing to remember daily means typical use and perfect use converge.' },

        { type: 'truefalse', q: 'Typical use and perfect use are almost identical for long-acting methods', a: true,
          why: 'That gap is the whole story of contraceptive effectiveness. It is widest for pills, patches and condoms, and nearly absent for an implant or an IUD.' },

        { type: 'number', q: 'Approximate typical-use failure rate of the combined pill over a year',
          value: 7, unit: '%',
          why: 'Perfect use is well under one percent. The difference is missed pills, and it is the entire argument for a method that does not depend on memory.' },

        { type: 'number', q: 'Approximate typical-use failure rate of male condoms over a year',
          value: 13, unit: '%' },

        { type: 'recall', q: 'Only contraceptive that also protects against infection', a: 'Condoms',
          why: 'Which is why dual method use is advised even when a highly effective method is already in place — the two are solving different problems.' },

        { type: 'mcq', q: 'Contraception recommended as first-line for adolescents',
          a: 'A long-acting reversible method',
          distractors: ['Combined pill', 'Condoms alone', 'Fertility awareness'],
          why: 'Daily adherence is hardest in this group and the consequences of failure are largest, so effectiveness that does not depend on behavior matters most exactly here.' }
      ]
    },

    {
      id: 'contra-eligibility',
      topic: 'Contraception',
      name: 'ELIGIBILITY',
      blurb: 'Who cannot have estrogen, and who is refused it for no reason',
      cards: [
        { type: 'multi', q: 'Absolute contraindications to combined hormonal contraception',
          answers: ['Migraine with aura', 'History of VTE', 'Uncontrolled hypertension', 'Smoker aged 35 or over'],
          distractors: ['Migraine without aura', 'Family history of VTE'],
          why: 'The estrogen is the problem in every one of them. The two distractors are among the commonest reasons women are wrongly denied a method that would have suited them.' },

        { type: 'recall', q: 'Migraine feature that rules out estrogen-containing contraception', a: 'Aura',
          why: 'Aura carries an increased ischemic stroke risk on its own, and estrogen multiplies it. Migraine without aura does not, so the question to ask is specifically about visual or sensory warning.' },

        { type: 'number', q: 'Age from which smoking makes combined contraception unsafe', value: 35, unit: 'years',
          why: 'Arterial risk from smoking and estrogen together climbs steeply from here, and the number of cigarettes matters too — this is a threshold with a gradient behind it.' },

        { type: 'mcq', q: 'Suitable contraception for a woman with a history of thrombosis',
          a: 'Progestin-only or copper IUD',
          distractors: ['Combined pill', 'Contraceptive patch', 'Vaginal ring'],
          why: 'All three distractors contain estrogen and differ only in how it is delivered. Progestin-only methods and the copper IUD do not raise thrombotic risk.' },

        { type: 'truefalse', q: 'Progestin-only methods are suitable while breastfeeding', a: true,
          why: 'They do not reduce milk supply and can start immediately after delivery, whereas estrogen is avoided in the early weeks for both thrombotic and lactation reasons.' },

        { type: 'number', q: 'Weeks postpartum before combined contraception becomes acceptable',
          value: 3, unit: 'weeks',
          why: 'The thrombotic risk of pregnancy takes weeks to fall away. Adding estrogen before it does stacks two risks that are each highest at the same moment.' },

        { type: 'mcq', q: 'Method with the fewest medical contraindications',
          a: 'Copper IUD',
          distractors: ['Combined pill', 'Contraceptive patch', 'Depot injection'],
          why: 'No hormones at all, so the cardiovascular, thrombotic and migraine considerations that limit everything else simply do not apply.' },

        { type: 'truefalse', q: 'A pelvic examination is required before prescribing the pill', a: false,
          why: 'It is not, and requiring it delays contraception for no gain. Blood pressure and a history are what the decision actually rests on.' }
      ]
    },

    {
      id: 'contra-methods',
      topic: 'Contraception',
      name: 'METHODS',
      blurb: 'What each one does besides prevent pregnancy',
      cards: [
        { type: 'recall', q: 'Main mechanism of the copper IUD', a: 'It is toxic to sperm',
          why: 'It prevents fertilization rather than implantation. Worth being able to say plainly, because the belief that it works after conception is a common and answerable objection.' },

        { type: 'recall', q: 'Non-contraceptive benefit of the levonorgestrel IUD',
          a: 'Much lighter menstrual bleeding',
          why: 'It is a first-line treatment for heavy menstrual bleeding in its own right, which makes it two solutions in one device for a common pair of problems.' },

        { type: 'mcq', q: 'Method most likely to cause unpredictable bleeding in the first months',
          a: 'Progestin implant',
          distractors: ['Combined pill', 'Copper IUD', 'Vaginal ring'],
          why: 'Irregular bleeding is the commonest reason for early removal. Warning about it beforehand markedly improves continuation, because an expected side effect is tolerated and a surprise one is not.' },

        { type: 'mcq', q: 'Method associated with reversible loss of bone density',
          a: 'Depot injection',
          distractors: ['Implant', 'Copper IUD', 'Combined pill'],
          why: 'It recovers after stopping and is not a reason to withhold the method, but it is worth weighing in adolescents who are still accruing peak bone mass.' },

        { type: 'recall', q: 'Most effective form of emergency contraception', a: 'Copper IUD',
          why: 'Far more effective than any pill, and it stays in as ongoing contraception — so the emergency visit solves the next problem as well as this one.' },

        { type: 'number', q: 'Days after unprotected sex within which a copper IUD still works',
          value: 5, unit: 'days' },

        { type: 'mcq', q: 'Emergency contraceptive pill that stays effective the longest',
          a: 'Ulipristal acetate',
          distractors: ['Levonorgestrel', 'Combined pill', 'Progestin implant'],
          why: 'It works up to five days and holds its effect closer to ovulation, which is exactly where levonorgestrel loses most of its.' },

        { type: 'recall', q: 'Reason conception may be delayed for months after stopping the injection',
          a: 'Slow return of fertility',
          why: 'It can take up to a year for ovulation to resume, which matters a great deal to someone planning pregnancy soon and is a reason to choose something else.' }
      ]
    },

    {
      id: 'contra-pitfalls',
      topic: 'Contraception',
      name: 'PITFALLS',
      blurb: 'The myths that cost people effective contraception',
      cards: [
        { type: 'truefalse', q: 'Antibiotics generally reduce the effectiveness of the combined pill', a: false,
          why: 'Only rifampin and rifabutin do, by inducing hepatic enzymes. The blanket warning attached to every antibiotic is a myth that generates unnecessary backup and real anxiety.' },

        { type: 'mcq', q: 'Drug class that genuinely reduces hormonal contraceptive effectiveness',
          a: 'Enzyme-inducing anticonvulsants',
          distractors: ['Penicillins', 'SSRIs', 'Statins'],
          why: 'Carbamazepine, phenytoin and topiramate induce hepatic metabolism. The copper IUD and the depot injection are unaffected, which makes them the sensible choice in epilepsy.' },

        { type: 'recall', q: 'What to do when a combined pill is more than 48 hours late',
          a: 'Take one now and use backup',
          why: 'Seven consecutive days of hormone are needed to re-suppress ovulation, and that is where the length of the backup interval comes from rather than from caution.' },

        { type: 'truefalse', q: 'Emergency contraception can end an established pregnancy', a: false,
          why: 'It prevents or delays ovulation and has no effect once implantation has occurred. Being able to state that plainly resolves most objections to prescribing it.' },

        { type: 'truefalse', q: 'An IUD can be placed in a woman who has never been pregnant', a: true,
          why: 'Nulliparity is not a contraindication, and the belief that it is still keeps the most effective methods away from the people with the most to lose from an unplanned pregnancy.' },

        { type: 'mcq', q: 'Timing rule that allows an IUD to be placed at the same visit',
          a: 'Any day if pregnancy is excluded',
          distractors: ['Only during menstruation', 'Only after a negative scan', 'Only in the luteal phase'],
          why: 'Restricting insertion to menstruation is a barrier with no basis. Reasonable certainty that a woman is not pregnant is what permits same-day placement, and most women meet it.' }
      ]
    }
  ];

  global.Decks = { BUILTIN: BUILTIN };
})(window);
