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
          why: 'The two distractors are HHS. DKA is defined by the acidosis and the ketones, not by how high the glucose runs — euglycaemic DKA exists, notably on SGLT2 inhibitors.' },

        { type: 'truefalse', q: 'Total body potassium is depleted in DKA even when the serum level is high', a: true,
          why: 'Acidosis and insulin deficiency drive potassium out of cells, so serum potassium reads normal or high while total stores are badly down. Insulin reverses the shift within hours, which is why potassium is checked before the drip starts and replaced during it.' },
        { type: 'truefalse', q: 'Bicarbonate is given routinely in DKA', a: false,
          why: 'Reserved for pH below about 6.9. Otherwise it risks hypokalaemia and paradoxical CNS acidosis without improving outcomes.' },

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
          why: 'Work it in order. The pH is alkalaemic, so the primary process raises pH. PaCO₂ is low, and a low PaCO₂ raises pH — so the respiratory system is the driver, not the compensator. Had this been a metabolic alkalosis with respiratory compensation, PaCO₂ would be high instead. Check the HCO₃ next to judge whether compensation has had time to develop.' }
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

        { type: 'truefalse', q: 'Beta blockers are first-line for uncomplicated hypertension', a: false,
          why: 'They are reserved for a compelling indication — post-infarct, heart failure, rate control. As monotherapy for blood pressure alone they protect against stroke less well than the four first-line classes.' },

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
          why: 'No outcome benefit and clearly more harm — hyperkalaemia, acute kidney injury and syncope. The combination was abandoned after ONTARGET.',
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

        { type: 'truefalse', q: 'A 20% creatinine rise after starting an ACE inhibitor means stopping it', a: false,
          why: 'A rise up to about 30% is expected and settles. Stopping there throws away the renoprotection. Above 30%, or a climbing potassium, is the point to stop and look for renovascular disease.' },

        { type: 'multi', q: 'Common causes of a rise in blood pressure on treatment',
          answers: ['NSAIDs', 'Decongestants', 'Excess alcohol', 'Oral contraceptives'],
          distractors: ['Metformin', 'Statins'] },

        { type: 'mcq', q: 'Next step for a dry cough on an ACE inhibitor', a: 'Switch to an ARB',
          distractors: ['Halve the dose', 'Add an antihistamine', 'Add a cough suppressant'],
          why: 'The cough is bradykinin-mediated and dose-independent, so halving it does nothing. ARBs do not raise bradykinin.' },

        { type: 'truefalse', q: 'Clonidine can be stopped abruptly without consequence', a: false,
          why: 'Abrupt withdrawal causes rebound hypertension that can overshoot the original pressure badly. It has to be tapered.' },

        { type: 'truefalse', q: 'Spironolactone added to an ACE inhibitor needs potassium monitoring', a: true,
          why: 'Both raise potassium, and the combination is the classic route to dangerous hyperkalaemia in a patient who felt fine.' }
      ]
    },

    {
      id: 't2dm-presentation',
      topic: 'Type 2 Diabetes',
      name: 'PRESENTATION',
      blurb: 'How it turns up, and telling it from type 1',
      cards: [
        { type: 'multi', q: 'Classic symptoms of sustained hyperglycaemia',
          answers: ['Polyuria', 'Polydipsia', 'Weight loss', 'Blurred vision'],
          distractors: ['Bradycardia', 'Weight gain'] },

        { type: 'truefalse', q: 'Most people with type 2 diabetes have symptoms at diagnosis', a: false,
          why: 'Most are found on screening. Symptoms need sustained glucose high enough to spill into the urine, which is late in the disease.' },
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
        { type: 'truefalse', q: 'Metformin is stopped once a second agent is started', a: false,
          why: 'It is continued unless the kidney function or side effects force it out. Second agents are added to metformin, not swapped for it.' },

        { type: 'truefalse', q: 'Long-term metformin can cause vitamin B12 deficiency', a: true,
          why: 'It reduces B12 absorption in the terminal ileum. The trap is that the resulting neuropathy gets written off as diabetic neuropathy and nobody checks the level.' },

        { type: 'multi', q: 'Checked at least once a year in type 2 diabetes',
          answers: ['Urine albumin-to-creatinine', 'Dilated retinal exam', 'Foot examination', 'Lipid panel'],
          distractors: ['Echocardiogram', 'Carotid ultrasound'] },

        { type: 'number', q: 'Weight loss that meaningfully improves glycaemic control', low: 5, high: 7, unit: '%' },
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
          why: 'Euglycaemic ketoacidosis is the signature complication of this class — the glucose can sit under 200 while the patient is frankly acidotic. Any unwell patient on one needs ketones checked, not just a glucose.' },
        { type: 'recall', q: 'Drug class held before surgery to avoid euglycaemic ketoacidosis', a: 'SGLT2 inhibitor' },
        { type: 'recall', q: 'Common genitourinary side effect of SGLT2 inhibitors', a: 'Genital yeast infection' },

        { type: 'mcq', q: 'Oral agent most likely to cause hypoglycaemia', a: 'Sulfonylurea',
          distractors: ['Metformin', 'SGLT2 inhibitor', 'DPP-4 inhibitor'] },
        { type: 'truefalse', q: 'A sulfonylurea is a safe first choice in an elderly patient with kidney disease', a: false,
          why: 'Both the drug and its active metabolites accumulate, and the hypoglycaemia that follows can be prolonged and severe in exactly the patient least able to notice it.' },

        { type: 'truefalse', q: 'Metformin causes contrast nephropathy', a: false,
          why: 'It does not. It is held around contrast because if the kidney is injured by anything, metformin then accumulates and the risk is lactic acidosis — a different problem in the opposite direction.' },

        { type: 'recall', q: 'Injection-site change that makes insulin absorption erratic', a: 'Lipohypertrophy' }
      ]
    }
  ];

  global.Decks = { BUILTIN: BUILTIN };
})(window);
