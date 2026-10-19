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

        { type: 'match', q: 'Complication → cause', pairs: [
          { left: 'Cerebral edema', right: 'Fast osmolar shift' },
          { left: 'Hypokalemia', right: 'Insulin infusion' },
          { left: 'Hyperchloremia', right: 'Saline volume' },
          { left: 'Hypoglycemia', right: 'Missed dextrose' }
        ] }
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
        { type: 'number', q: 'Normal serum sodium', values: [135, 145], join: '–', unit: 'mEq/L' },
        { type: 'number', q: 'Normal serum potassium', values: [3.5, 5.0], join: '–', unit: 'mEq/L' },
        { type: 'number', q: 'Normal serum calcium', values: [8.5, 10.5], join: '–', unit: 'mg/dL' },
        { type: 'number', q: 'Normal platelet count', values: [150, 450], join: '–', unit: '× 10³/µL' },
        { type: 'number', q: 'Normal serum osmolality', values: [275, 295], join: '–', unit: 'mOsm/kg' },
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
        { type: 'mcq', q: 'In the ATLS primary survey, the step right after Circulation',
          a: 'Disability', distractors: ['Airway', 'Breathing', 'Exposure'] },
        { type: 'mcq', q: 'Classic cause of fever on post-op day 1–2 (the five Ws)',
          a: 'Wind — atelectasis', distractors: ['Water — UTI', 'Walking — DVT', 'Wound — infection'] },
        { type: 'mcq', q: 'In adult BLS, the step right after checking pulse and breathing',
          a: 'Begin chest compressions',
          distractors: ['Activate emergency response', 'Attach defibrillator', 'Check responsiveness'] },
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
        { type: 'number', q: 'Normal intracranial pressure in adults', values: [5, 15], join: '–', unit: 'mmHg' },
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
        { type: 'number', q: 'HbA1c range that defines prediabetes', values: [5.7, 6.4], join: '–', unit: '%',
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
        { type: 'number', q: 'Peak flow green zone, as a share of personal best', values: [80, 100], join: '–', unit: '%' }
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

        { type: 'mcq', q: 'Metered-dose inhaler technique: the step right after pressing and breathing in slowly',
          a: 'Hold the breath ten seconds',
          distractors: ['Breathe out fully', 'Seal lips on the mouthpiece', 'Rinse the mouth'] },

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

        { type: 'number', q: 'Weeks of pregnancy at which Tdap is given', values: [27, 36], join: '–', unit: 'weeks',
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
          values: [18, 79], join: '–', unit: 'years',
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
          values: [30, 49], join: '–', unit: '%' },

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
        { type: 'mcq', q: 'Ranks just below the implant and IUD for typical-use effectiveness',
          a: 'Injection', distractors: ['Pill, patch or ring', 'Male condom', 'Withdrawal'] },

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
    },

    /* ═══════════════ FM ITE ═══════════════
       One deck per concept the In-Training Exam tests, written in our
       own words from the concept rather than from the exam's text. */

    /* ── Thyroid: the pilot of a whole topic built from several ITE
       questions (5, 24, 170, 194), their wrong answers, and the
       neighbouring facts the exam tends to ask. ── */

    {
      id: 'ite-thyroid-recognize',
      src: [194],   // ITE 2025 items it draws on
      subject: 'FM ITE',
      topic: 'Thyroid',
      name: 'RECOGNIZE',
      blurb: 'Causes, patterns and the clues that separate them',
      cards: [
        { type: 'recall', q: 'Most common cause of hyperthyroidism in the US', a: 'Graves disease' },
        { type: 'recall', q: 'Most common cause of hypothyroidism in the US', a: 'Hashimoto thyroiditis',
          why: 'Worldwide it is iodine deficiency.' },
        { type: 'match', q: 'Radioiodine uptake pattern → cause', pairs: [
          { left: 'Diffuse, high', right: 'Graves disease' },
          { left: 'One hot spot', right: 'Toxic adenoma' },
          { left: 'Several hot spots', right: 'Multinodular goiter' },
          { left: 'Low', right: 'Thyroiditis' }
        ] },
        { type: 'recall', q: 'Why exophthalmos points to Graves over other causes of hyperthyroidism',
          a: 'Its antibodies also act on tissue behind the eye',
          why: 'TSH receptor antibodies drive both the gland and the eye disease. Toxic nodules and thyroiditis raise hormone levels but never cause orbitopathy.' },
        { type: 'bucket', q: 'Graves disease or thyroiditis?', bins: ['Graves', 'Thyroiditis'], items: [
          { label: 'High, diffuse iodine uptake', bin: 'Graves' },
          { label: 'Low iodine uptake', bin: 'Thyroiditis' },
          { label: 'Exophthalmos', bin: 'Graves' },
          { label: 'Tender gland after a virus', bin: 'Thyroiditis' },
          { label: 'TSH receptor antibodies', bin: 'Graves' },
          { label: 'Settles without thionamides', bin: 'Thyroiditis' }
        ] },
        { type: 'recall', q: 'Diagnosis: painful, tender thyroid and high ESR weeks after a viral illness',
          a: 'Subacute (de Quervain) thyroiditis' },
        { type: 'recall', q: 'Why thyroiditis swings from hyperthyroid to hypothyroid',
          a: 'Stored hormone leaks out, then runs out',
          why: 'It is release, not overproduction. That is why uptake is low, and why it usually settles back to normal.' },
        { type: 'bucket', q: 'Too much thyroid hormone, or too little?', bins: ['Too much', 'Too little'], items: [
          { label: 'Heat intolerance', bin: 'Too much' },
          { label: 'Cold intolerance', bin: 'Too little' },
          { label: 'Frequent loose stools', bin: 'Too much' },
          { label: 'Constipation', bin: 'Too little' },
          { label: 'Slow-relaxing reflexes', bin: 'Too little' },
          { label: 'Fine tremor', bin: 'Too much' }
        ] },
        { type: 'trend', q: 'Labs in untreated Graves disease', items: [
          { label: 'TSH', dir: 'down' },
          { label: 'Free T4', dir: 'up' },
          { label: 'Radioiodine uptake', dir: 'up' }
        ] },
        { type: 'trend', q: 'Labs in subclinical hypothyroidism', items: [
          { label: 'TSH', dir: 'up' },
          { label: 'Free T4', dir: 'same' }
        ] }
      ]
    },

    {
      id: 'ite-thyroid-workup',
      src: [24],   // ITE 2025 items it draws on
      subject: 'FM ITE',
      topic: 'Thyroid',
      name: 'WORKUP',
      blurb: 'Which test, in which order, and when the labs mislead',
      cards: [
        { type: 'mcq', q: 'First test when thyroid disease is suspected',
          a: 'TSH', distractors: ['Free T4', 'Total T3', 'Thyroid ultrasound'] },
        { type: 'recall', q: 'Why TSH is the first thyroid test', a: 'It changes before free T4 leaves the normal range',
          why: 'A small change in T4 makes a large change in TSH, so TSH is the most sensitive screen — as long as the pituitary works.' },
        { type: 'recall', q: 'When a normal TSH can miss hypothyroidism', a: 'Pituitary disease (central hypothyroidism)',
          why: 'TSH is low or inappropriately normal while free T4 is low. If central disease is suspected, measure free T4 directly.' },
        { type: 'recall', q: 'Why a T3 level adds little in suspected hypothyroidism',
          a: 'It stays normal until disease is advanced',
          why: 'TSH and free T4 make the diagnosis. Routine T3 testing was a wrong answer on the 2025 exam.' },
        { type: 'recall', q: 'Test that separates Graves from thyroiditis', a: 'Radioactive iodine uptake scan',
          why: 'High uptake means the gland is making hormone; low uptake means it is leaking stored hormone, or the hormone is coming from outside.' },
        { type: 'recall', q: 'Why uptake is low when someone is secretly taking levothyroxine',
          a: 'Extra hormone shuts off TSH, so the gland rests',
          why: 'Low thyroglobulin separates this from thyroiditis, where thyroglobulin is high because the gland is breaking down.' },
        { type: 'recall', q: 'Next test for a thyroid nodule when the TSH is low', a: 'Radionuclide uptake scan',
          why: 'A hot nodule is rarely cancer and usually needs no biopsy. With a normal or high TSH, the next step is ultrasound.' },
        { type: 'recall', q: 'Antibody that predicts progression of subclinical hypothyroidism', a: 'Anti-TPO (thyroid peroxidase) antibody' },
        { type: 'truefalse', q: 'Thyroid tests are best avoided during acute illness unless thyroid disease is suspected', a: true,
          why: 'Illness lowers T3 and can shift TSH for a while, and those changes resolve on their own. Treating them helps no one.' }
      ]
    },

    {
      id: 'ite-thyroid-treat-hyper',
      src: [194],   // ITE 2025 items it draws on
      subject: 'FM ITE',
      topic: 'Thyroid',
      name: 'TREAT: HYPER',
      blurb: 'Thionamides, iodine ablation, surgery and symptom control',
      cards: [
        { type: 'mcq', q: 'Drug of choice for Graves disease outside the first trimester',
          a: 'Methimazole', distractors: ['Propylthiouracil', 'Levothyroxine', 'Prednisone'] },
        { type: 'recall', q: 'Why methimazole is preferred over PTU', a: 'PTU can cause severe liver injury' },
        { type: 'recall', q: 'Antithyroid drug preferred in the first trimester', a: 'Propylthiouracil',
          why: 'Methimazole is linked to birth defects early in pregnancy, so the liver risk of propylthiouracil is accepted for those weeks only.' },
        { type: 'recall', q: 'Why switch from PTU to methimazole after the first trimester',
          a: 'Liver risk now outweighs birth-defect risk',
          why: 'Organ formation is complete after the first trimester, so the birth-defect concern with methimazole has passed.' },
        { type: 'recall', q: 'Why add a beta blocker when starting methimazole',
          a: 'Eases symptoms while methimazole takes weeks',
          why: 'Tremor, palpitations and anxiety settle within hours; hormone levels take weeks to fall.' },
        { type: 'recall', q: 'Rate control in hyperthyroidism when a beta blocker can\'t be used',
          a: 'A calcium channel blocker such as verapamil' },
        { type: 'multi', q: 'Treatment options for Graves disease',
          answers: ['Antithyroid drugs', 'Radioactive iodine', 'Thyroidectomy'],
          distractors: ['Levothyroxine', 'Prednisone'],
          why: 'The choice rests on the risks of each and on what the patient prefers.' },
        { type: 'recall', q: 'Why radioactive iodine is avoided in active Graves eye disease',
          a: 'It can make the eye disease worse' },
        { type: 'recall', q: 'Usual long-term result of radioactive iodine for Graves', a: 'Hypothyroidism needing levothyroxine' },
        { type: 'truefalse', q: 'Radioactive iodine is contraindicated in pregnancy and breastfeeding', a: true,
          why: 'The fetal thyroid takes up iodine from about 10–12 weeks and would be destroyed along with the mother\'s.' },
        { type: 'truefalse', q: 'Fever or sore throat on methimazole: stop it and check a CBC', a: true,
          why: 'Agranulocytosis is rare but sudden, and those are its first signs.' }
      ]
    },

    {
      id: 'ite-thyroid-storm',
      src: [5],   // ITE 2025 items it draws on
      subject: 'FM ITE',
      topic: 'Thyroid',
      name: 'THYROID STORM',
      blurb: 'What goes first, and why the order matters',
      cards: [
        { type: 'mcq', q: 'First drug in thyroid storm, before iodine',
          a: 'Propylthiouracil', distractors: ['Inorganic iodine', 'Prednisone', 'Plasmapheresis'],
          why: 'A thionamide has to block hormone synthesis first. Iodine given before that can feed new hormone production.' },
        { type: 'recall', q: 'Why PTU is preferred over methimazole in thyroid storm',
          a: 'It also blocks T4-to-T3 conversion',
          why: 'It lowers circulating T3 faster, though clinically the two do about equally well.' },
        { type: 'number', q: 'Thyroid storm: minimum wait after PTU before giving iodine', value: 1, unit: 'hour' },
        { type: 'recall', q: 'Why give iodine at all in thyroid storm', a: 'Blocks release of hormone already stored' },
        { type: 'mcq', q: 'Preferred glucocorticoid in thyroid storm',
          a: 'Hydrocortisone', distractors: ['Prednisone', 'Methylprednisolone', 'Budesonide'],
          why: 'Hydrocortisone or dexamethasone. Prednisone was the wrong answer on the 2025 exam.' },
        { type: 'recall', q: 'Why glucocorticoids help in thyroid storm', a: 'They slow T4-to-T3 conversion',
          why: 'They also cover any relative adrenal insufficiency under the stress of the storm.' },
        { type: 'recall', q: 'Beta blocker classically used in thyroid storm', a: 'Propranolol',
          why: 'Nonselective, and at high doses it also slows T4-to-T3 conversion.' },
        { type: 'recall', q: 'Why aspirin is avoided for fever in thyroid storm',
          a: 'It frees thyroid hormone from binding proteins',
          why: 'That raises the free hormone level. Acetaminophen and cooling instead.' },
        { type: 'recall', q: 'Treatment for thyroid storm that fails medications', a: 'Plasmapheresis' },
        { type: 'recall', q: 'Score that helps decide if thyrotoxicosis is thyroid storm', a: 'Burch-Wartofsky score' }
      ]
    },

    {
      id: 'ite-thyroid-treat-hypo',
      src: [24],   // ITE 2025 items it draws on
      subject: 'FM ITE',
      topic: 'Thyroid',
      name: 'TREAT: HYPO',
      blurb: 'Who to treat, how to dose, and myxedema coma',
      cards: [
        { type: 'mcq', q: 'Standard treatment for hypothyroidism',
          a: 'Levothyroxine', distractors: ['Liothyronine (T3)', 'Desiccated thyroid', 'Levothyroxine plus T3'],
          why: 'T4 alone. Combination and desiccated products have shown no consistent benefit.' },
        { type: 'multi', q: 'Reasons to treat subclinical hypothyroidism outside pregnancy',
          answers: ['TSH above 10', 'Positive TPO antibodies', 'Treatment-resistant depression'],
          distractors: ['Resistant constipation', 'Fatigue alone'],
          why: 'Resistant depression counts; resistant constipation does not. That pair was the trap on the 2025 exam.' },
        { type: 'recall', q: 'Why start levothyroxine low in older or cardiac patients',
          a: 'A full dose can trigger angina or arrhythmia',
          why: 'Start at 25–50 mcg and titrate up.' },
        { type: 'number', q: 'Weeks to wait before rechecking TSH after a levothyroxine dose change', low: 6, high: 8, unit: 'weeks' },
        { type: 'recall', q: 'Why wait 6–8 weeks to recheck TSH after a dose change', a: 'T4 takes that long to reach a steady level',
          why: 'Its half-life is about a week, and it takes about five half-lives to settle.' },
        { type: 'recall', q: 'How levothyroxine should be taken', a: 'Empty stomach, 30–60 min before food',
          why: 'Calcium, iron and food all cut absorption. Separate calcium and iron by about 4 hours.' },
        { type: 'number', q: 'Approximate full replacement dose of levothyroxine', value: 1.6, unit: 'mcg/kg' },
        { type: 'recall', q: 'Life-threatening extreme of hypothyroidism', a: 'Myxedema coma',
          why: 'Hypothermia, confusion, hyponatremia and slow breathing. IV levothyroxine plus stress-dose steroids.' },
        { type: 'recall', q: 'Why steroids come before thyroid hormone in myxedema coma',
          a: 'Thyroid hormone can unmask adrenal insufficiency',
          why: 'Thyroid hormone speeds cortisol use, which can tip an untreated adrenal deficiency into crisis.' }
      ]
    },

    {
      id: 'ite-thyroid-special',
      src: [170],   // ITE 2025 items it draws on
      subject: 'FM ITE',
      topic: 'Thyroid',
      name: 'SPECIAL CASES',
      blurb: 'Pregnancy, older adults, drugs and Down syndrome',
      cards: [
        { type: 'number', q: 'Levothyroxine dose increase once pregnancy is confirmed', low: 25, high: 30, unit: '%' },
        { type: 'recall', q: 'Why levothyroxine is raised as soon as pregnancy is confirmed',
          a: 'The early fetal brain relies on maternal T4' },
        { type: 'recall', q: 'Usual course of postpartum thyroiditis', a: 'Hyper, then hypo, then usually back to normal',
          why: 'It appears within the first year after delivery. Check a TSH when postpartum depression symptoms appear.' },
        { type: 'recall', q: 'Drug that can cause both hypothyroidism and hyperthyroidism', a: 'Amiodarone',
          why: 'It is loaded with iodine and can also inflame the gland directly. Lithium mostly causes hypothyroidism.' },
        { type: 'recall', q: 'How hyperthyroidism often shows up in older adults', a: 'Atrial fibrillation, weight loss, apathy',
          why: 'The classic tremor and anxiety can be absent, which is why it is called apathetic hyperthyroidism.' },
        { type: 'recall', q: 'Why treat subclinical hyperthyroidism over 65 with a TSH under 0.1',
          a: 'It raises atrial fibrillation and bone loss risk' },
        { type: 'number', q: 'TSH screening interval in adults with Down syndrome', low: 1, high: 2, unit: 'years',
          why: 'About half of adults with Down syndrome over 30 have hypothyroidism.' },
        { type: 'truefalse', q: 'The USPSTF recommends screening asymptomatic adults for thyroid disease', a: false,
          why: 'The evidence is insufficient (an I statement). Test when there are symptoms or risk factors.' }
      ]
    },

    {
      id: 'ite-thyroid-traps',
      src: [5, 24],   // ITE 2025 items it draws on
      subject: 'FM ITE',
      topic: 'Thyroid',
      name: 'TRAPS',
      blurb: 'The wrong answers that look right',
      cards: [
        { type: 'recall', q: 'Why iodine must never come first in thyroid storm', a: 'It can fuel new hormone production' },
        { type: 'recall', q: 'Why methimazole is avoided in the first trimester', a: 'It is linked to birth defects' },
        { type: 'recall', q: 'Why methimazole and PTU don\'t help thyroiditis', a: 'The gland is leaking, not overproducing',
          why: 'A beta blocker for symptoms, and an NSAID for the pain of subacute thyroiditis.' },
        { type: 'truefalse', q: 'Constipation that resists treatment is a reason to treat subclinical hypothyroidism', a: false,
          why: 'Treatment-resistant depression is; constipation is not.' },
        { type: 'truefalse', q: 'A normal TSH rules out hypothyroidism caused by pituitary disease', a: false,
          why: 'A failing pituitary cannot raise TSH, so it stays low or normal while free T4 falls.' },
        { type: 'truefalse', q: 'Biotin supplements can make thyroid labs look like Graves disease', a: true,
          why: 'Biotin interferes with many immunoassays. Stopping it for a couple of days before testing avoids the false result.' },
        { type: 'mcq', q: 'Lab finding that separates taking thyroid hormone from thyroiditis',
          a: 'Low thyroglobulin', distractors: ['High thyroglobulin', 'TSH receptor antibodies', 'High, diffuse uptake'] },
        { type: 'truefalse', q: 'Levothyroxine plus T3 works better than levothyroxine alone for most patients', a: false,
          why: 'Trials have not shown a consistent benefit, and T3 swings levels up and down through the day.' }
      ]
    },

    /* ── Thyroid vignettes: original cases, two per deck, each opening
       once its deck's flashcards have been answered right. ── */

    {
      id: 'ite-thyroid-recognize-q', kind: 'questions', for: 'ite-thyroid-recognize',
      subject: 'FM ITE', topic: 'Thyroid', name: 'QUESTIONS', blurb: 'Recognize',
      cards: [
        { type: 'mcq',
          stem: 'A 34-year-old woman has had palpitations, heat intolerance and a 3-kg weight loss over 3 weeks. Five weeks ago she had an upper respiratory infection. Her thyroid is diffusely tender to touch, and there is no proptosis. TSH is undetectable, free T4 is elevated, and the ESR is 68 mm/hr.',
          q: 'Which finding on a radioactive iodine uptake scan is most likely?',
          a: 'Low uptake throughout the gland',
          distractors: ['High, diffuse uptake', 'A single area of high uptake with the rest suppressed', 'Several patchy areas of high uptake'],
          why: 'This is subacute (de Quervain) thyroiditis: a painful gland after a viral illness, with a high ESR. Inflammation releases hormone that was already stored, so the gland is not taking up iodine to make more.',
          whyNot: {
            'High, diffuse uptake': 'That is Graves disease, which is painless and often comes with eye findings.',
            'A single area of high uptake with the rest suppressed': 'That is a toxic adenoma, a nodule making hormone on its own.',
            'Several patchy areas of high uptake': 'That is a toxic multinodular goiter, usually in an older patient with a lumpy gland.'
          } },
        { type: 'mcq',
          stem: 'A 29-year-old woman reports anxiety, tremor and loose stools for 2 months. Her thyroid is smooth, nontender and diffusely enlarged. She has lid lag and proptosis of both eyes. TSH is undetectable and free T4 is high.',
          q: 'Which is the most likely diagnosis?',
          a: 'Graves disease',
          distractors: ['Subacute thyroiditis', 'Toxic multinodular goiter', 'Painless (silent) thyroiditis', 'Taking excess thyroid hormone'],
          why: 'A diffuse goiter with orbitopathy is Graves disease. The eye findings come from TSH receptor antibodies acting on orbital tissue, and no other cause of hyperthyroidism produces them.',
          whyNot: {
            'Subacute thyroiditis': 'The gland would be tender, usually after a viral illness, and there would be no eye disease.',
            'Toxic multinodular goiter': 'The gland would be nodular, the patient usually older, and the eyes normal.',
            'Painless (silent) thyroiditis': 'It causes a small, painless goiter at most, and never orbitopathy.',
            'Taking excess thyroid hormone': 'The gland would be small, not enlarged, and the eyes normal.'
          } }
      ]
    },

    {
      id: 'ite-thyroid-workup-q', kind: 'questions', for: 'ite-thyroid-workup',
      subject: 'FM ITE', topic: 'Thyroid', name: 'QUESTIONS', blurb: 'Workup',
      cards: [
        { type: 'mcq',
          stem: 'A 52-year-old man had transsphenoidal surgery for a pituitary macroadenoma 6 months ago. He now reports fatigue, cold intolerance and constipation. His TSH is 1.2 mIU/L (N 0.4–4.0).',
          q: 'Which is the most appropriate next step?',
          a: 'Measure free T4',
          distractors: ['Reassure him that his thyroid is normal', 'Measure total T3', 'Repeat the TSH in 6 weeks', 'Order a thyroid ultrasound'],
          why: 'After pituitary surgery the TSH cannot be trusted, because a damaged pituitary may not raise it. In central hypothyroidism the TSH is low or normal while free T4 is low, so free T4 is the test that decides.',
          whyNot: {
            'Reassure him that his thyroid is normal': 'A normal TSH only rules out hypothyroidism when the pituitary works.',
            'Measure total T3': 'T3 is the last level to fall and adds little to the diagnosis.',
            'Repeat the TSH in 6 weeks': 'The TSH will mislead just as much next time.',
            'Order a thyroid ultrasound': 'The problem is the pituitary, not the structure of the gland.'
          } },
        { type: 'mcq',
          stem: 'A 26-year-old nurse has palpitations and weight loss. Her thyroid is small and nontender. TSH is suppressed, free T4 is high, and the radioactive iodine uptake is near zero.',
          q: 'Which result would best distinguish taking thyroid hormone from painless thyroiditis?',
          a: 'A low serum thyroglobulin',
          distractors: ['A high serum thyroglobulin', 'Positive anti-TPO antibodies', 'An elevated ESR'],
          why: 'Both cause thyrotoxicosis with low uptake. Thyroiditis breaks down the gland and releases thyroglobulin, so it is high; hormone taken by mouth suppresses the gland, so thyroglobulin is low.',
          whyNot: {
            'A high serum thyroglobulin': 'That points to thyroiditis, the other possibility.',
            'Positive anti-TPO antibodies': 'Common in painless thyroiditis, but their absence does not prove hormone ingestion.',
            'An elevated ESR': 'Raised in painful subacute thyroiditis; it does not separate these two.'
          } }
      ]
    },

    {
      id: 'ite-thyroid-treat-hyper-q', kind: 'questions', for: 'ite-thyroid-treat-hyper',
      subject: 'FM ITE', topic: 'Thyroid', name: 'QUESTIONS', blurb: 'Treat: hyper',
      cards: [
        { type: 'mcq',
          stem: 'A 27-year-old woman with Graves disease, well controlled on methimazole, has a positive home pregnancy test. By her dates she is about 6 weeks pregnant.',
          q: 'Which is the most appropriate change to her treatment?',
          a: 'Switch to propylthiouracil',
          distractors: ['Continue methimazole', 'Stop antithyroid drugs and start a beta blocker', 'Refer for radioactive iodine ablation'],
          why: 'Methimazole is linked to birth defects in the first trimester, so propylthiouracil is used for those weeks. Many patients go back to methimazole afterward because of the liver risk of propylthiouracil.',
          whyNot: {
            'Continue methimazole': 'The first trimester is exactly when its birth-defect risk applies.',
            'Stop antithyroid drugs and start a beta blocker': 'Uncontrolled hyperthyroidism raises the risk of miscarriage and preterm birth.',
            'Refer for radioactive iodine ablation': 'Contraindicated in pregnancy: it would destroy the fetal thyroid too.'
          } },
        { type: 'mcq',
          stem: 'A 41-year-old woman started methimazole for Graves disease 5 weeks ago. She calls the office with a temperature of 39.1 °C (102.4 °F) and a sore throat that began this morning.',
          q: 'Which is the most appropriate next step?',
          a: 'Stop methimazole and check a CBC with differential today',
          distractors: ['Do a rapid strep test and continue methimazole', 'Prescribe amoxicillin and recheck in 1 week', 'Switch to propylthiouracil', 'Halve the methimazole dose'],
          why: 'Fever or sore throat on a thionamide is agranulocytosis until proven otherwise. It usually appears in the first months of treatment, and a same-day CBC decides what happens next.',
          whyNot: {
            'Do a rapid strep test and continue methimazole': 'Strep testing can wait; the drug must stop until the neutrophil count is known.',
            'Prescribe amoxicillin and recheck in 1 week': 'A week is far too long if she is agranulocytic.',
            'Switch to propylthiouracil': 'It can cause agranulocytosis too, and the two cross-react.',
            'Halve the methimazole dose': 'Agranulocytosis is not dose-related enough for this to be safe.'
          } }
      ]
    },

    {
      id: 'ite-thyroid-storm-q', kind: 'questions', for: 'ite-thyroid-storm',
      subject: 'FM ITE', topic: 'Thyroid', name: 'QUESTIONS', blurb: 'Thyroid storm',
      cards: [
        { type: 'mcq',
          stem: 'A 45-year-old woman is brought to the emergency department with a temperature of 40.2 °C (104.4 °F), a heart rate of 154 beats/min, agitation and diarrhea. She stopped her methimazole a month ago. Free T4 is markedly elevated and TSH is undetectable. Intravenous propranolol has been started.',
          q: 'Which should be given next?',
          a: 'Propylthiouracil',
          distractors: ['Potassium iodide', 'Aspirin for the fever', 'Levothyroxine', 'Plasmapheresis'],
          why: 'Block new hormone synthesis first. Iodine follows at least an hour later to stop release of stored hormone, alongside a glucocorticoid and cooling.',
          whyNot: {
            'Potassium iodide': 'Before a thionamide, iodine can become raw material for more hormone.',
            'Aspirin for the fever': 'It frees thyroid hormone from its binding proteins and raises the free level. Use acetaminophen.',
            'Levothyroxine': 'That is thyroid hormone itself.',
            'Plasmapheresis': 'Kept for storm that fails full drug therapy.'
          } },
        { type: 'mcq',
          stem: 'A 38-year-old man with thyroid storm has received propranolol, propylthiouracil, potassium iodide starting an hour after the propylthiouracil, and hydrocortisone. After 48 hours he remains febrile and delirious, with a heart rate of 140 beats/min.',
          q: 'Which is the most appropriate next step?',
          a: 'Plasmapheresis',
          distractors: ['Switch propylthiouracil to methimazole', 'Add aspirin', 'Radioactive iodine ablation', 'Double the potassium iodide'],
          why: 'Plasmapheresis is the rescue for thyroid storm that fails full medical therapy: it removes circulating hormone directly. Urgent thyroidectomy is the other option.',
          whyNot: {
            'Switch propylthiouracil to methimazole': 'No gain: propylthiouracil is the better choice in storm because it also blocks T4-to-T3 conversion.',
            'Add aspirin': 'It raises free thyroid hormone.',
            'Radioactive iodine ablation': 'Too slow for an emergency, and the iodine already given blocks its uptake.',
            'Double the potassium iodide': 'More iodine does not add further benefit.'
          } }
      ]
    },

    {
      id: 'ite-thyroid-treat-hypo-q', kind: 'questions', for: 'ite-thyroid-treat-hypo',
      subject: 'FM ITE', topic: 'Thyroid', name: 'QUESTIONS', blurb: 'Treat: hypo',
      cards: [
        { type: 'mcq',
          stem: 'A 44-year-old woman has a TSH of 7.8 mIU/L on two tests 3 months apart, with a normal free T4 both times. Anti-TPO antibodies are negative. She has major depression that has not responded to two antidepressants, and long-standing constipation.',
          q: 'Which is the most appropriate management of her thyroid results?',
          a: 'Start levothyroxine',
          distractors: ['Recheck TSH in 6–12 months without treatment', 'Measure total T3', 'Treat the constipation and observe'],
          why: 'Outside pregnancy, subclinical hypothyroidism is treated when TSH is over 10, anti-TPO antibodies are positive, or there is treatment-resistant depression. She has the last one.',
          whyNot: {
            'Recheck TSH in 6–12 months without treatment': 'Right for most people with a TSH under 10, but her resistant depression changes that.',
            'Measure total T3': 'It adds nothing to TSH and free T4.',
            'Treat the constipation and observe': 'Constipation is not a reason to treat, but her depression is.'
          } },
        { type: 'mcq',
          stem: 'A 58-year-old man has a TSH of 6.9 mIU/L with a normal free T4 on repeat testing. Anti-TPO antibodies are negative. He feels well apart from mild tiredness and takes no medications.',
          q: 'Which is the most appropriate management?',
          a: 'Monitor TSH without treatment',
          distractors: ['Start levothyroxine at 1.6 mcg/kg daily', 'Start levothyroxine at 25 mcg daily', 'Measure total T3'],
          why: 'A TSH under 10 with negative antibodies, no pregnancy and no resistant depression does not need treatment. Recheck periodically.',
          whyNot: {
            'Start levothyroxine at 1.6 mcg/kg daily': 'Treatment is not indicated, and a full dose would be wrong to start with anyway.',
            'Start levothyroxine at 25 mcg daily': 'A low dose is still treatment he does not need.',
            'Measure total T3': 'It does not change the decision.'
          } }
      ]
    },

    {
      id: 'ite-thyroid-special-q', kind: 'questions', for: 'ite-thyroid-special',
      subject: 'FM ITE', topic: 'Thyroid', name: 'QUESTIONS', blurb: 'Special cases',
      cards: [
        { type: 'mcq',
          stem: 'A 31-year-old woman with Hashimoto thyroiditis takes levothyroxine 100 mcg daily, and her TSH has been normal for years. She has just had a positive pregnancy test at about 5 weeks.',
          q: 'Which is the most appropriate next step?',
          a: 'Increase levothyroxine by about 25–30% now',
          distractors: ['Keep the dose and recheck TSH at 20 weeks', 'Hold levothyroxine until the second trimester', 'Switch to liothyronine (T3)'],
          why: 'Her need rises early in pregnancy, and the fetal brain depends on maternal T4 in the first trimester. A common approach is two extra doses a week, then a TSH every 4 weeks in the first half of pregnancy.',
          whyNot: {
            'Keep the dose and recheck TSH at 20 weeks': 'By then the first trimester, when maternal T4 matters most, has passed.',
            'Hold levothyroxine until the second trimester': 'That deprives the fetus exactly when it depends on maternal hormone.',
            'Switch to liothyronine (T3)': 'The fetal brain needs T4, and T3 replacement is not used in pregnancy.'
          } },
        { type: 'mcq',
          stem: 'Four months after delivery, a 30-year-old woman reports fatigue, low mood and weight gain. About 2 months ago she had a few weeks of palpitations and anxiety that went away on their own. Her thyroid is not tender. TSH is 9.5 mIU/L and free T4 is low.',
          q: 'Which is the most likely diagnosis?',
          a: 'Postpartum thyroiditis',
          distractors: ['Graves disease', 'Postpartum depression alone', 'Sheehan syndrome', 'Subacute thyroiditis'],
          why: 'A hyperthyroid phase, then a hypothyroid phase, within a year of delivery. Most women return to normal, though some stay hypothyroid. It is worth checking a TSH when postpartum mood symptoms appear.',
          whyNot: {
            'Graves disease': 'Graves does not swing to hypothyroidism on its own.',
            'Postpartum depression alone': 'Her thyroid labs are abnormal and explain the symptoms.',
            'Sheehan syndrome': 'Pituitary failure after hemorrhage gives a low or normal TSH, not a high one.',
            'Subacute thyroiditis': 'The gland would be painful and tender.'
          } }
      ]
    },

    {
      id: 'ite-thyroid-traps-q', kind: 'questions', for: 'ite-thyroid-traps',
      subject: 'FM ITE', topic: 'Thyroid', name: 'QUESTIONS', blurb: 'Traps',
      cards: [
        { type: 'mcq',
          stem: 'A 36-year-old woman who takes high-dose biotin for hair and nails has a suppressed TSH and a high free T4 on routine labs. She feels well, her pulse is 72 beats/min, and she has no goiter, tremor or eye findings.',
          q: 'Which is the most appropriate next step?',
          a: 'Stop biotin and repeat the tests in a few days',
          distractors: ['Start methimazole', 'Order a radioactive iodine uptake scan', 'Start propranolol'],
          why: 'Biotin interferes with many immunoassays and can produce a Graves-like pattern on paper. A well patient with abnormal labs and a normal exam should be retested off biotin before anything else.',
          whyNot: {
            'Start methimazole': 'Treating a lab artifact exposes her to agranulocytosis and liver risk for nothing.',
            'Order a radioactive iodine uptake scan': 'Premature: confirm the result is real first.',
            'Start propranolol': 'She has no symptoms to treat.'
          } },
        { type: 'mcq',
          stem: 'A 47-year-old woman on levothyroxine for Hashimoto thyroiditis has a TSH of 1.8 mIU/L but still feels tired. She asks about adding T3, which a friend says helped her.',
          q: 'Which is the most appropriate response?',
          a: 'Continue levothyroxine alone and look for other causes of fatigue',
          distractors: ['Add liothyronine (T3)', 'Switch to desiccated thyroid', 'Raise levothyroxine to suppress the TSH'],
          why: 'Combination and desiccated products have not shown consistent benefit, and over-replacement raises the risk of atrial fibrillation and bone loss. With a normal TSH, the fatigue usually has another cause, such as sleep, mood or anemia.',
          whyNot: {
            'Add liothyronine (T3)': 'Trials show no consistent benefit, and T3 makes levels swing through the day.',
            'Switch to desiccated thyroid': 'No better than levothyroxine, with less predictable dosing.',
            'Raise levothyroxine to suppress the TSH': 'Over-replacement risks atrial fibrillation and bone loss.'
          } }
      ]
    },

    /* ── Screening: built deck by deck from the USPSTF list, with the
       ITE items (16, 27, 29, 59, 80, 84, 104, 116, 133, 136, 150, 153,
       168, 175, 181, 189, 191, 198) setting the emphasis. ── */

    {
      id: 'ite-screen-colorectal',
      src: [29, 189],   // ITE 2025 items it draws on
      subject: 'FM ITE',
      topic: 'Screening',
      name: 'COLORECTAL',
      blurb: 'Average risk, family history, and what follows a polyp',
      cards: [
        { type: 'number', q: 'At average risk, colorectal cancer screening runs from what age to what age?', values: [45, 75], join: '–', unit: 'years',
          why: 'Screening from 45 to 49 is a B recommendation and from 50 to 75 an A. Between 76 and 85 the decision is individual, weighing overall health and prior screening, and after 85 it stops.' },
        { type: 'recall', q: 'Why did the colorectal screening start age drop from 50 to 45?', a: 'Rates are rising in adults under 50',
          why: 'Incidence in adults under 50 has climbed steadily since the 1990s, and modeling showed that starting at 45 adds life-years at an acceptable cost in colonoscopies. The 2021 update made 45 to 49 a B.' },
        { type: 'match', q: 'Match each colorectal screening test to how often it is repeated', pairs: [
          { left: 'Colonoscopy', right: 'Every 10 years' },
          { left: 'FIT', right: 'Every year' },
          { left: 'Stool DNA-FIT', right: 'Every 1–3 years' },
          { left: 'CT colonography', right: 'Every 5 years' }
        ] },
        { type: 'mcq', q: 'A 55-year-old\'s screening FIT comes back positive. What is the next step?',
          a: 'Colonoscopy', distractors: ['Repeat the FIT', 'Stool DNA test', 'CT colonography'],
          why: 'A positive stool test is only half of a screening episode: it has to be completed with colonoscopy, which can both find and remove the source. Any other test, including a repeat FIT, just delays that.' },
        { type: 'recall', q: 'Why doesn\'t a negative repeat FIT cancel out a positive one?', a: 'Polyps and cancers bleed intermittently',
          why: 'A lesion that bled last week may not bleed this week, so a negative repeat is expected even when something is there. The positive result stands until colonoscopy has looked.' },
        { type: 'match', q: 'After a colonoscopy, match the finding to when the next one is due', pairs: [
          { left: '1–2 adenomas under 10 mm', right: '7–10 years' },
          { left: '3–4 adenomas under 10 mm', right: '3–5 years' },
          { left: 'Adenoma 10 mm or larger', right: '3 years' },
          { left: 'More than 10 adenomas', right: '1 year' }
        ] },
        { type: 'recall', q: 'Why can someone with 1–2 small adenomas wait 7–10 years for the next colonoscopy?', a: 'Small adenomas take over a decade to become cancer',
          why: 'The adenoma-to-carcinoma sequence is slow, usually more than ten years, and the index colonoscopy has already cleared what was there. Bringing people back sooner adds procedures and complications without preventing more cancers.' },
        { type: 'recall', q: 'Small hyperplastic polyps in the rectum or sigmoid: when is the next colonoscopy?', a: '10 years, the same as a normal exam',
          why: 'Hyperplastic polyps under 10 mm in the distal colon are not precancerous and do not shorten the interval. The exam likes to put these next to the adenoma intervals to see whether you know the difference.' },
        { type: 'recall', q: 'Your patient\'s father had colon cancer at 52. When does her screening start?', a: 'Age 40, with colonoscopy every 5 years',
          why: 'A first-degree relative diagnosed before 60 means starting at 40 or ten years before their diagnosis, whichever comes first, and using colonoscopy rather than stool tests. Here ten years before 52 is 42, so 40 wins.' },
        { type: 'number', q: 'In Lynch syndrome, colonoscopy starts between what ages?', values: [20, 25], join: '–', unit: 'years',
          why: 'It is then repeated every 1 to 2 years for life. Lynch also raises the risk of endometrial, ovarian, gastric and urinary tract cancers, so surveillance does not stop at the colon.' },
        { type: 'truefalse', q: 'A patient with Lynch syndrome can be screened with yearly FIT instead of colonoscopy', a: false,
          why: 'Cancers in Lynch syndrome arise quickly from flat lesions, so an interval test that depends on bleeding misses them. Colonoscopy every 1 to 2 years is the only accepted option.' },
        { type: 'mcq', q: 'An 80-year-old in good health had a normal colonoscopy at 70. What do you advise about screening now?',
          a: 'Individualize the decision', distractors: ['Colonoscopy now', 'Yearly FIT until 85', 'No more screening'],
          why: 'Between 76 and 85 the USPSTF gives a C: the net benefit is small and depends on overall health and prior screening. Someone never screened gains the most; someone with a recent normal colonoscopy gains little. Over 85, screening stops.' }
      ]
    },

    {
      id: 'ite-screen-pregnancy',
      subject: 'FM ITE',
      topic: 'Screening',
      name: 'PREGNANCY',
      blurb: 'The first-visit panel, glucose, blood pressure and Rh',
      cards: [
        { type: 'multi', q: 'Which of these are screened for at the first prenatal visit?',
          answers: ['HIV', 'Hepatitis B surface antigen', 'Syphilis', 'Asymptomatic bacteriuria'],
          distractors: ['Gestational diabetes', 'Bacterial vaginosis'],
          why: 'The first-visit panel is the set where early treatment changes the outcome for the baby: antiretrovirals for HIV, penicillin for syphilis, immunoglobulin and vaccine at birth for hepatitis B, and antibiotics for bacteriuria. Glucose testing waits until 24 weeks, and BV screening is not recommended.' },
        { type: 'number', q: 'At how many weeks is routine gestational diabetes screening done?', values: [24, 28], join: '–', unit: 'weeks',
          why: 'The usual approach is a 50 g glucose challenge, confirmed with a 100 g three-hour tolerance test if the screen is high. Finding it in this window leaves time for diet, monitoring and, if needed, insulin to reduce macrosomia and birth complications.' },
        { type: 'truefalse', q: 'Testing for gestational diabetes before 24 weeks is recommended for every pregnant patient', a: false,
          why: 'Before 24 weeks the USPSTF grade is I. Early testing is reasonable for patients with risk factors such as obesity or previous gestational diabetes, but that is really a test for pre-existing diabetes rather than universal screening.' },
        { type: 'mcq', q: 'How does the USPSTF recommend screening for preeclampsia?',
          a: 'Blood pressure at every visit', distractors: ['Urine protein at every visit', 'Blood pressure once a trimester', 'Uterine artery Doppler'],
          why: 'Blood pressure at each prenatal visit is a B. Urine protein on its own is not a screening test, because proteinuria is neither sensitive nor specific enough; it is used to confirm once the pressure is high.' },
        { type: 'multi', q: 'Which of these qualify a patient for low-dose aspirin to prevent preeclampsia?',
          answers: ['Prior preeclampsia', 'Chronic hypertension', 'Twin pregnancy', 'Pre-existing diabetes'],
          distractors: ['First pregnancy alone', 'Age 32'],
          why: 'Any one high-risk feature qualifies: previous preeclampsia, chronic hypertension, diabetes, kidney disease, autoimmune disease or multiple gestation. Moderate factors such as a first pregnancy, obesity, age 35 or older or a family history need two or more. The dose is 81 mg daily from 12 to 28 weeks, ideally before 16.' },
        { type: 'recall', q: 'Rh-negative and antibody-negative at the first visit: when is the antibody screen repeated?', a: 'At 24–28 weeks, before giving anti-D',
          why: 'The first-visit type and screen is an A; the repeat at 24 to 28 weeks is a B and is only needed in unsensitized patients, since sensitized ones are managed differently. Anti-D immunoglobulin follows at 28 weeks and again within 72 hours of delivering an Rh-positive baby.' },
        { type: 'recall', q: 'Why is asymptomatic bacteriuria treated in pregnancy but not in other adults?', a: 'In pregnancy it progresses to pyelonephritis',
          why: 'Ureteral dilation and reduced bladder tone let bacteria climb, and about a third of untreated pregnant patients with bacteriuria develop pyelonephritis, with preterm birth and low birth weight downstream. Outside pregnancy treating it offers no benefit and breeds resistance, so screening is a D.' },
        { type: 'recall', q: 'What test is used to screen for asymptomatic bacteriuria in pregnancy?', a: 'A urine culture at 12–16 weeks',
          why: 'A dipstick is not sensitive enough; the USPSTF specifies a culture. One culture early in the pregnancy, at the first visit or between 12 and 16 weeks, is the usual approach.' },
        { type: 'truefalse', q: 'Routine screening for bacterial vaginosis in low-risk pregnancies is recommended', a: false,
          why: 'It is a D for patients not at increased risk of preterm birth and an I for those who are. Treating asymptomatic BV has not been shown to reduce preterm delivery, which was the whole rationale.' },
        { type: 'recall', q: 'Why is syphilis screening repeated in the third trimester for some patients?', a: 'Infection acquired later still infects the baby',
          why: 'Congenital syphilis is rising, and a negative first-trimester test does not protect against infection acquired afterward. In high-prevalence areas or with ongoing risk, testing is repeated at 28 weeks and again at delivery.' },
        { type: 'recall', q: 'Which tool is used to screen for depression during pregnancy and after delivery?', a: 'Edinburgh Postnatal Depression Scale',
          why: 'Screening pregnant and postpartum patients is a B, and the EPDS is validated for both periods. The PHQ-9 is acceptable too; what matters is that a positive screen leads to treatment or referral, since counseling for those at risk is itself a B.' },
        { type: 'recall', q: 'What dose of folic acid is recommended before and during early pregnancy?', a: '400–800 mcg daily',
          why: 'It starts at least a month before conception and continues through the first trimester, because the neural tube closes by 28 days, often before the pregnancy is known. A previous neural tube defect raises the dose to 4 mg.' }
      ]
    },

    {
      id: 'ite-screen-cervical',
      src: [27, 136, 150],   // ITE 2025 items it draws on
      subject: 'FM ITE',
      topic: 'Screening',
      name: 'CERVICAL',
      blurb: 'When to start, which test, and what it takes to stop',
      cards: [
        { type: 'number', q: 'Routine cervical cancer screening runs from what age to what age?', values: [21, 65], join: '–', unit: 'years',
          why: 'Starting is by age alone, regardless of when sexual activity began. Stopping at 65 depends on having enough recent negative results; the age by itself is not permission to stop.' },
        { type: 'recall', q: 'How is cervical screening done between ages 21 and 29?', a: 'Cytology alone every 3 years',
          why: 'HPV testing is not used in this group because infection is so common under 30 that it mostly finds transient infections that will clear on their own. HPV-based testing starts at 30.' },
        { type: 'multi', q: 'Which are acceptable cervical screening options at ages 30–65?',
          answers: ['Cytology every 3 years', 'HPV test alone every 5 years', 'Cotesting every 5 years'],
          distractors: ['Cytology every year', 'HPV test every 10 years'],
          why: 'All three are A-grade options. Primary HPV testing is now preferred where it is available, and a self-collected vaginal sample is acceptable for it.' },
        { type: 'recall', q: 'Why can HPV-based screening be spaced 5 years apart when cytology is every 3?', a: 'HPV precedes cell changes by years',
          why: 'Cervical cancer needs persistent high-risk HPV, and the virus is detectable long before cytology turns abnormal. A negative HPV test therefore rules out trouble for longer than a normal smear does, and the two intervals carry similar risk.' },
        { type: 'recall', q: 'Why doesn\'t cervical screening start before 21, even in sexually active teens?', a: 'HPV usually clears and cancer is very rare',
          why: 'Most infections in the late teens resolve within two years, so screening finds abnormalities that would have gone away. Treating them with excision raises the risk of preterm birth later, so the harm is the treatment, not a missed cancer. Screening before 21 is a D.' },
        { type: 'mcq', q: 'A 66-year-old has had normal Paps at 56, 59 and 62. What do you recommend?',
          a: 'Stop screening', distractors: ['One more Pap, then stop', 'Cotest now', 'HPV test every 5 years'],
          why: 'Stopping after 65 requires adequate negative screening: three consecutive negative cytology results, or two negative HPV or cotests, within the past 10 years, with the most recent inside the last 5. She has exactly that.' },
        { type: 'truefalse', q: 'A 68-year-old who has never been screened can skip cervical screening because of her age', a: false,
          why: 'Age alone does not end screening. Without a documented adequate negative history she is screened until she has one, and older unscreened women account for a disproportionate share of cervical cancer deaths.' },
        { type: 'truefalse', q: 'After a total hysterectomy for fibroids, cervical screening stops', a: true,
          why: 'No cervix and a benign indication means there is nothing to screen. It continues only if the hysterectomy was for high-grade dysplasia or cancer, or if a supracervical procedure left the cervix in place.' },
        { type: 'recall', q: 'After treatment for CIN 2 or worse, how long does screening continue?', a: '25 years, even past age 65',
          why: 'Treated high-grade disease carries a persistent risk, so surveillance runs for 25 years from treatment regardless of age. This is one of the few situations where screening goes beyond 65.' },
        { type: 'recall', q: 'Does HPV vaccination change the cervical screening schedule?', a: 'No, vaccinated patients screen the same way',
          why: 'The vaccine does not cover every oncogenic type, and many people were vaccinated after exposure. Guidelines may eventually relax intervals for fully vaccinated cohorts, but for now the schedule is identical.' },
        { type: 'mcq', q: 'Which group needs more frequent cervical screening than the standard schedule?',
          a: 'Women living with HIV', distractors: ['Women over 30, 3 negative Paps', 'Women who smoke', 'Women with multiple partners'],
          why: 'Immunosuppression lets HPV persist, so screening starts within a year of diagnosis, continues yearly until three normal results, then every 3 years, and does not stop at 65. The same applies after solid-organ transplant and to DES exposure in utero.' }
      ]
    },

    {
      id: 'ite-screen-heart-metabolic',
      src: [80, 133, 191],   // ITE 2025 items it draws on
      subject: 'FM ITE',
      topic: 'Screening',
      name: 'HEART & METABOLIC',
      blurb: 'Blood pressure, glucose, statins, AAA, and the tests not to order',
      cards: [
        { type: 'recall', q: 'Hypertension screening is recommended for whom?', a: 'All adults 18 and older',
          why: 'An A grade. Adults 18–39 with normal pressure and no risk factors can be rechecked every 3 to 5 years; everyone 40 and older, and anyone with elevated readings or obesity, is checked yearly.' },
        { type: 'mcq', q: 'An office BP is 146/92. What does the USPSTF say to do before diagnosing hypertension?',
          a: 'Confirm outside the office', distractors: ['Repeat in the office in 4 weeks', 'Start a thiazide', 'Check for end-organ damage'],
          why: 'Ambulatory monitoring is the reference standard and home readings are the practical alternative. White-coat hypertension is common enough that office readings alone overdiagnose, and treating it brings harm without benefit.' },
        { type: 'number', q: 'Diabetes screening in adults with overweight or obesity runs from what age to what age?', values: [35, 70], join: '–', unit: 'years',
          why: 'A B grade, repeated every 3 years if normal. The point is as much prediabetes as diabetes: a positive result opens the door to intensive lifestyle programs, which are the one intervention with solid evidence.' },
        { type: 'recall', q: 'A 45-year-old with overweight has a fasting glucose of 95. When is it rechecked?', a: 'In 3 years',
          why: 'Normal screening results are repeated every 3 years. Prediabetes (fasting 100–125 or A1c 5.7–6.4) is rechecked yearly, and that is when lifestyle referral starts.' },
        { type: 'mcq', q: 'Which patient meets USPSTF criteria for a statin for primary prevention?',
          a: '55, smoker, 10-year risk 12%', distractors: ['45, no risk factors, risk 6%', '50, hypertension, risk 8%', '78, diabetes, risk 15%'],
          why: 'The B recommendation is adults 40–75 with at least one risk factor (dyslipidemia, diabetes, hypertension or smoking) and a 10-year ASCVD risk of 10% or more. At 7.5 to 10% it is a C, offered selectively. At 76 and older the evidence is insufficient.' },
        { type: 'recall', q: 'Why does the USPSTF require a 10% ten-year risk before recommending a statin?', a: 'Absolute benefit tracks baseline risk',
          why: 'Statins cut relative risk by about a quarter whoever takes them, so the number needed to treat is small only when the starting risk is high. Below 10% most people take a daily pill for years without an event prevented.' },
        { type: 'recall', q: 'Who gets a one-time ultrasound for abdominal aortic aneurysm?', a: 'Men 65–75 who have ever smoked',
          why: 'A B grade; "ever smoked" means 100 cigarettes in a lifetime. Men in that age range who never smoked are a C, offered selectively. For women who have smoked the evidence is insufficient, and women who never smoked are a D.' },
        { type: 'truefalse', q: 'The USPSTF recommends AAA screening for a 70-year-old woman with a 30 pack-year history', a: false,
          why: 'Even with a smoking history, screening women is an I: aneurysms are rarer, rupture later, and the trials enrolled almost no women. A family history of AAA may tip the decision, but it is not a routine recommendation.' },
        { type: 'recall', q: 'Obesity screening in adults: what does a BMI of 30 or more trigger?', a: 'Referral to intensive behavioral counseling',
          why: 'Intensive means multiple sessions over 1 to 2 years covering diet, exercise and self-monitoring; a single conversation does not count. It is a B. Medications and surgery are options for individual patients but are not the screening response.' },
        { type: 'mcq', q: 'A 50-year-old at low cardiovascular risk asks for a screening ECG. What do you tell him?',
          a: 'Not recommended (D)', distractors: ['A resting ECG once', 'An exercise stress test', 'An ECG every 5 years'],
          why: 'In low-risk adults an abnormal screening ECG mostly leads to more testing, including angiography, without changing management or outcomes. For intermediate and high risk the evidence is insufficient. The same logic applies to carotid ultrasound in people without symptoms.' },
        { type: 'truefalse', q: 'Spirometry is recommended to screen adults without symptoms for COPD', a: false,
          why: 'A D. Finding airflow limitation in someone with no symptoms does not change treatment, and inhalers do not slow progression in that group. Spirometry is for people with cough, sputum or breathlessness.' },
        { type: 'recall', q: 'Who should start daily low-dose aspirin for primary prevention under the 2022 USPSTF statement?', a: 'Nobody routinely; 40–59 at ≥10% risk is a C',
          why: 'At 60 and older starting aspirin is a D, because the bleeding risk cancels out the cardiovascular benefit. At 40–59 with a 10-year risk of 10% or more the net benefit is small, so it is an individual decision. This is prevention rather than screening, but the exam files it with the same questions.' },
        { type: 'truefalse', q: 'Vitamin D levels should be checked in adults without symptoms', a: false,
          why: 'An I. There is no agreed threshold for deficiency, assays disagree, and supplementing people found to be low has not improved outcomes in trials, so there is nothing for a screening test to lead to.' }
      ]
    },

    /* ═══════════════ Other AI ═══════════════
       Cardiology decks written by a different model from the format
       prompt, kept verbatim for side-by-side review. */

    {
      "id": "cad-chest-pain-post-mi",
      "subject": "Other AI",
      "topic": "Cardiology",
      "name": "CAD, CHEST PAIN & POST-MI",
      "blurb": "ACS triage, stress testing, antianginals, post-MI complications",
      "cards": [
        {
          "type": "recall",
          "q": "Within how many minutes should a 12-lead EKG be obtained for acute chest pain?",
          "a": "10 minutes"
        },
        {
          "type": "truefalse",
          "q": "A new LBBB with acute chest pain is a STEMI equivalent that needs EMS transfer to a PCI-capable hospital.",
          "a": true,
          "why": "The left bundle is supplied by LAD septal perforators, so new LBBB suggests a large proximal LAD occlusion and masks ST elevation."
        },
        {
          "type": "truefalse",
          "q": "Do not delay EMS transfer of a patient with ST elevation to draw an office troponin.",
          "a": true,
          "why": "Troponin takes 2–3 hours to rise and is only about 40% sensitive at presentation. Never delay EMS transfer for it."
        },
        {
          "type": "mcq",
          "q": "Which finding contraindicates sublingual nitroglycerin in an inferior STEMI?",
          "a": "Right ventricular infarction",
          "distractors": [
            "Q waves in lead III",
            "Elevated troponin",
            "Pleuritic chest pain"
          ],
          "why": "The ischemic RV is preload dependent. Treat hypotension with saline and avoid nitrates, morphine and diuretics."
        },
        {
          "type": "mcq",
          "stem": "A 58-year-old man with type 2 diabetes has recurrent chest pain. Serial troponins are negative and an exercise stress test was normal 8 months ago.",
          "q": "What is the best next diagnostic step?",
          "a": "Coronary CT angiography",
          "distractors": [
            "Repeat treadmill stress test",
            "Cardiac MRI",
            "FFR-CT as a standalone test"
          ],
          "whyNot": {
            "Repeat treadmill stress test": "Functional testing misses non-obstructive plaque and was recently normal.",
            "Cardiac MRI": "Assesses myocardium and viability, not coronary lumen patency.",
            "FFR-CT as a standalone test": "FFR-CT is applied after CCTA shows an intermediate stenosis."
          }
        },
        {
          "type": "mcq",
          "q": "Which stress modality is preferred with nuclear MPI in a patient with LBBB?",
          "a": "Regadenoson or adenosine",
          "distractors": [
            "Treadmill exercise",
            "Dobutamine",
            "Atropine"
          ],
          "why": "Exercise or dobutamine in LBBB or RV pacing causes false-positive septal defects."
        },
        {
          "type": "recall",
          "q": "Best add-on antianginal when angina persists on a beta-blocker with resting HR 52?",
          "a": "Long-acting nitrate or amlodipine"
        },
        {
          "type": "truefalse",
          "q": "Ivabradine is useful for chronic stable angina with a normal LVEF.",
          "a": false,
          "why": "SIGNIFY showed no benefit and more bradycardia and AF. It is approved only for HFrEF with HR ≥70."
        },
        {
          "type": "multi",
          "q": "Which findings suggest a posterior wall MI?",
          "answers": [
            "ST depression in V1–V3",
            "Tall, broad R in V1–V2",
            "Upright T waves in V1–V3"
          ],
          "distractors": [
            "ST elevation in V4R",
            "Diffuse PR depression"
          ]
        },
        {
          "type": "recall",
          "q": "Which papillary muscle most often ruptures after an inferior MI?",
          "a": "Posteromedial",
          "why": "It has a single blood supply from the posterior descending artery."
        },
        {
          "type": "truefalse",
          "q": "Ibuprofen and corticosteroids are preferred for post-MI pericarditis.",
          "a": false,
          "why": "Use high-dose aspirin plus colchicine. Other NSAIDs and steroids impair scar healing and risk free wall rupture."
        },
        {
          "type": "bucket",
          "q": "Sort each post-MI complication by its usual timing.",
          "bins": [
            "1–3 days",
            "3–5 days",
            "5–14 days"
          ],
          "items": [
            {
              "label": "Peri-infarction pericarditis",
              "bin": "1–3 days"
            },
            {
              "label": "Papillary muscle rupture",
              "bin": "3–5 days"
            },
            {
              "label": "Septal rupture (VSD)",
              "bin": "3–5 days"
            },
            {
              "label": "LV free wall rupture",
              "bin": "5–14 days"
            }
          ]
        },
        {
          "type": "match",
          "q": "Match the clue to the post-MI complication.",
          "pairs": [
            {
              "left": "Flash edema, no JVD",
              "right": "Papillary rupture"
            },
            {
              "left": "Step-up in O2 RA to RV",
              "right": "Septal rupture (VSD)"
            },
            {
              "left": "Beck triad, PEA",
              "right": "Free wall rupture"
            },
            {
              "left": "Fever and rub at 2–8 wk",
              "right": "Dressler syndrome"
            }
          ]
        }
      ]
    },

    {
      "id": "heart-failure-hcm",
      "subject": "Other AI",
      "topic": "Cardiology",
      "name": "HEART FAILURE & HCM",
      "blurb": "GDMT pillars, HF drugs to avoid, murmur maneuvers",
      "cards": [
        {
          "type": "recall",
          "q": "LVEF cutoff that defines HFrEF?",
          "a": "≤40%"
        },
        {
          "type": "number",
          "q": "Washout period when switching from an ACE inhibitor to sacubitril/valsartan?",
          "value": 36,
          "unit": "hours",
          "why": "Prevents severe angioedema."
        },
        {
          "type": "multi",
          "q": "Select the mortality-reducing pillars of HFrEF GDMT.",
          "answers": [
            "ARNi",
            "Evidence-based beta-blocker",
            "MRA",
            "SGLT2 inhibitor"
          ],
          "distractors": [
            "Loop diuretic",
            "Digoxin"
          ],
          "why": "Loop diuretics control congestion but do not reduce mortality."
        },
        {
          "type": "truefalse",
          "q": "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status or ejection fraction.",
          "a": true
        },
        {
          "type": "truefalse",
          "q": "After LVEF recovers from 30% to 55% on GDMT, therapy can be safely withdrawn.",
          "a": false,
          "why": "In TRED-HF, 44% relapsed within 6 months of withdrawal. Recovered EF is remission, not cure."
        },
        {
          "type": "mcq",
          "q": "Which diabetes drug is contraindicated in symptomatic heart failure?",
          "a": "Pioglitazone",
          "distractors": [
            "Empagliflozin",
            "Linagliptin",
            "Metformin"
          ],
          "why": "Thiazolidinediones cause renal sodium and fluid retention."
        },
        {
          "type": "mcq",
          "q": "Which claudication drug is contraindicated in heart failure of any severity?",
          "a": "Cilostazol",
          "distractors": [
            "Clopidogrel",
            "Aspirin",
            "Atorvastatin"
          ],
          "why": "Oral PDE-3 inhibitors reduce survival in HF."
        },
        {
          "type": "truefalse",
          "q": "Obesity falsely lowers BNP, while CKD and atrial fibrillation raise it.",
          "a": true
        },
        {
          "type": "number",
          "q": "NT-proBNP level at or above which heart failure is strongly supported?",
          "value": 300,
          "unit": "pg/mL"
        },
        {
          "type": "recall",
          "q": "Switch from spironolactone to what if painful gynecomastia develops?",
          "a": "Eplerenone"
        },
        {
          "type": "truefalse",
          "q": "A normal chest x-ray rules out systolic heart failure.",
          "a": false,
          "why": "About 20% of outpatients with HFrEF have a normal CXR."
        },
        {
          "type": "trend",
          "q": "How does the HCM murmur change with each maneuver?",
          "items": [
            {
              "label": "Valsalva strain",
              "dir": "up"
            },
            {
              "label": "Standing from squat",
              "dir": "up"
            },
            {
              "label": "Squatting",
              "dir": "down"
            },
            {
              "label": "Isometric handgrip",
              "dir": "down"
            },
            {
              "label": "Amyl nitrite",
              "dir": "up"
            }
          ],
          "why": "A smaller LV cavity worsens septal–mitral contact and obstruction. A larger cavity relieves it."
        },
        {
          "type": "trend",
          "q": "How does the aortic stenosis murmur change with each maneuver?",
          "items": [
            {
              "label": "Squatting",
              "dir": "up"
            },
            {
              "label": "Standing",
              "dir": "down"
            },
            {
              "label": "Isometric handgrip",
              "dir": "down"
            },
            {
              "label": "Amyl nitrite",
              "dir": "up"
            }
          ]
        },
        {
          "type": "truefalse",
          "q": "Isometric handgrip increases the MR, AR and VSD murmurs.",
          "a": true,
          "why": "Higher afterload increases the backward driving pressure."
        }
      ]
    },

    {
      "id": "valves-screening-ie",
      "subject": "Other AI",
      "topic": "Cardiology",
      "name": "VALVES, SPORTS SCREENING & IE",
      "blurb": "Severe AS triggers, 14-point screen, endocarditis prophylaxis",
      "cards": [
        {
          "type": "number",
          "q": "Peak aortic velocity that defines severe aortic stenosis?",
          "value": 4,
          "unit": "m/s"
        },
        {
          "type": "number",
          "q": "Mean transvalvular gradient that defines severe aortic stenosis?",
          "value": 40,
          "unit": "mm Hg"
        },
        {
          "type": "recall",
          "q": "Aortic valve area that typically defines severe AS?",
          "a": "≤1.0 cm2"
        },
        {
          "type": "truefalse",
          "q": "Asymptomatic severe AS with an LVEF of 45% warrants valve replacement.",
          "a": true,
          "why": "LVEF <50% signals LV decompensation even without symptoms."
        },
        {
          "type": "truefalse",
          "q": "Symptomatic severe AS carries over 50% two-year mortality without valve replacement.",
          "a": true
        },
        {
          "type": "multi",
          "q": "Select the indications for aortic valve replacement in severe AS.",
          "answers": [
            "Any symptoms",
            "LVEF <50%",
            "Other cardiac surgery planned"
          ],
          "distractors": [
            "Mean gradient 30 mm Hg",
            "Isolated systolic murmur"
          ]
        },
        {
          "type": "truefalse",
          "q": "Asymptomatic athletes with a normal 14-point screen need a routine screening EKG.",
          "a": false,
          "why": "Order an EKG or echo only when at least one of the 14 elements is positive."
        },
        {
          "type": "mcq",
          "q": "Which sports screening finding warrants an EKG or echo?",
          "a": "Exertional syncope",
          "distractors": [
            "Mild COVID ≥14 days ago",
            "Family rheumatic heart disease",
            "Coach request"
          ],
          "whyNot": {
            "Mild COVID ≥14 days ago": "Recovered mild COVID does not require an EKG before return to sport.",
            "Family rheumatic heart disease": "This is not an inherited cardiomyopathy.",
            "Coach request": "A request does not override evidence-based guidelines."
          }
        },
        {
          "type": "recall",
          "q": "Continuous infraclavicular murmur that vanishes when supine or with jugular compression?",
          "a": "Venous hum"
        },
        {
          "type": "truefalse",
          "q": "A pulmonary flow murmur in an adolescent quiets with standing or Valsalva.",
          "a": true
        },
        {
          "type": "bucket",
          "q": "Does the condition require IE prophylaxis before dental procedures?",
          "bins": [
            "Prophylaxis",
            "No prophylaxis"
          ],
          "items": [
            {
              "label": "Prosthetic heart valve",
              "bin": "Prophylaxis"
            },
            {
              "label": "Prior infective endocarditis",
              "bin": "Prophylaxis"
            },
            {
              "label": "Unrepaired cyanotic CHD",
              "bin": "Prophylaxis"
            },
            {
              "label": "Bicuspid aortic valve",
              "bin": "No prophylaxis"
            },
            {
              "label": "Mitral valve prolapse",
              "bin": "No prophylaxis"
            },
            {
              "label": "Native aortic stenosis",
              "bin": "No prophylaxis"
            }
          ]
        },
        {
          "type": "recall",
          "q": "First-line IE prophylaxis regimen before a dental procedure?",
          "a": "Amoxicillin 2 g PO, 30–60 min before"
        },
        {
          "type": "mcq",
          "q": "Which penicillin-allergy alternative is no longer recommended for IE prophylaxis?",
          "a": "Clindamycin",
          "distractors": [
            "Cephalexin",
            "Azithromycin",
            "Doxycycline"
          ],
          "why": "Clindamycin carries a higher C. difficile risk."
        },
        {
          "type": "truefalse",
          "q": "A high-risk patient needs IE prophylaxis before colonoscopy.",
          "a": false,
          "why": "Routine GI and GU procedures never require IE prophylaxis."
        }
      ]
    },

    {
      "id": "arrhythmia-syncope-af",
      "subject": "Other AI",
      "topic": "Cardiology",
      "name": "ARRHYTHMIA, QTc & AF ANTICOAGULATION",
      "blurb": "SVT, WPW, QTc, amiodarone, bridging, syncope workup",
      "cards": [
        {
          "type": "recall",
          "q": "First step for stable, regular narrow-complex SVT?",
          "a": "Vagal maneuvers (modified Valsalva)"
        },
        {
          "type": "truefalse",
          "q": "Adenosine, beta-blockers and CCBs are safe in pre-excited atrial fibrillation.",
          "a": false,
          "why": "AV nodal blockade sends all impulses down the accessory pathway and can cause VF. Use procainamide or ibutilide, or cardiovert if unstable."
        },
        {
          "type": "recall",
          "q": "Drug options for stable pre-excited AF?",
          "a": "IV procainamide or ibutilide"
        },
        {
          "type": "mcq",
          "stem": "A patient has palpitations after escitalopram was increased from 10 mg to 20 mg. The EKG shows a QTc of 500 ms.",
          "q": "What is the best next step?",
          "a": "Stop escitalopram, repeat EKG",
          "distractors": [
            "Reduce to 15 mg only",
            "Start metoprolol",
            "Order an echocardiogram"
          ],
          "why": "Citalopram and escitalopram have the highest dose-dependent QTc risk among SSRIs."
        },
        {
          "type": "truefalse",
          "q": "Methadone maintenance therapy warrants baseline and follow-up EKGs for QTc prolongation.",
          "a": true
        },
        {
          "type": "recall",
          "q": "First-line treatment of torsades de pointes with a pulse?",
          "a": "IV magnesium sulfate 2 g",
          "why": "Give it even if serum magnesium is normal, and replete potassium."
        },
        {
          "type": "multi",
          "q": "Select the baseline tests for starting amiodarone.",
          "answers": [
            "Chest x-ray",
            "PFTs with DLCO",
            "TSH",
            "AST and ALT"
          ],
          "distractors": [
            "Digoxin level",
            "HbA1c"
          ]
        },
        {
          "type": "truefalse",
          "q": "Amiodarone corneal microdeposits are benign and do not require stopping the drug.",
          "a": true
        },
        {
          "type": "truefalse",
          "q": "Bridging heparin before elective surgery benefits AF patients on warfarin with no recent stroke.",
          "a": false,
          "why": "BRIDGE showed more major bleeding (3.2% vs 1.3%) with no reduction in thromboembolism. Just stop warfarin 5 days before."
        },
        {
          "type": "mcq",
          "stem": "A patient has a mechanical aortic valve, prior stroke and DVT, and an eGFR of 25. Surgery is planned.",
          "q": "What is the preferred perioperative bridge?",
          "a": "IV unfractionated heparin",
          "distractors": [
            "Enoxaparin 1 mg/kg BID",
            "Rivaroxaban",
            "No bridging"
          ],
          "whyNot": {
            "Enoxaparin 1 mg/kg BID": "LMWH accumulates in severe CKD.",
            "Rivaroxaban": "DOACs are not used with mechanical valves.",
            "No bridging": "This is a very high thromboembolic risk situation."
          }
        },
        {
          "type": "multi",
          "q": "Which AF patients require warfarin rather than a DOAC?",
          "answers": [
            "Mechanical heart valve",
            "Mod–severe rheumatic MS"
          ],
          "distractors": [
            "Prior stroke",
            "Age ≥75",
            "Diabetes"
          ]
        },
        {
          "type": "truefalse",
          "q": "Adding aspirin to a DOAC after an AF-related stroke, without a recent stent, adds bleeding but no benefit.",
          "a": true
        },
        {
          "type": "truefalse",
          "q": "Syncope with a normal neurologic exam warrants carotid duplex and EEG.",
          "a": false,
          "why": "Yield is under 1%. Start with history, exam with orthostatics, and a 12-lead EKG."
        }
      ]
    },

    {
      "id": "htn-orthostasis-pregnancy",
      "subject": "Other AI",
      "topic": "Cardiology",
      "name": "HYPERTENSION, ORTHOSTASIS & PREGNANCY",
      "blurb": "HTN urgency vs emergency, dissection, secondary HTN, orthostatic BP",
      "cards": [
        {
          "type": "truefalse",
          "q": "Start two first-line antihypertensive classes at once when BP is ≥160/100.",
          "a": true,
          "why": "A single-pill combination, such as CCB plus ACEi or ARB, improves control and adherence."
        },
        {
          "type": "truefalse",
          "q": "For BP above 180/110 with no end-organ damage, give oral clonidine and send to the ED.",
          "a": false,
          "why": "Restart or intensify oral therapy and follow up within 1–7 days. Rapid lowering risks hypoperfusion."
        },
        {
          "type": "recall",
          "q": "Limit on MAP reduction in the first hour of most hypertensive emergencies?",
          "a": "No more than 20–25%"
        },
        {
          "type": "mcq",
          "q": "What is the first drug class in acute aortic dissection?",
          "a": "IV esmolol or labetalol",
          "distractors": [
            "IV nitroprusside alone",
            "IV hydralazine",
            "IV nicardipine alone"
          ],
          "why": "Beta-blockade first lowers HR below 60 and shear stress. Vasodilators first cause reflex tachycardia."
        },
        {
          "type": "number",
          "q": "Target systolic BP range in acute aortic dissection?",
          "values": [
            100,
            120
          ],
          "join": "–",
          "unit": "mm Hg"
        },
        {
          "type": "match",
          "q": "Match the clue to the secondary HTN diagnosis.",
          "pairs": [
            {
              "left": "Low K + resistant HTN",
              "right": "Primary aldosteronism"
            },
            {
              "left": "Spells + labile BP",
              "right": "Pheochromocytoma"
            },
            {
              "left": "Rib notching on CXR",
              "right": "Coarctation"
            },
            {
              "left": "String of beads, age <30",
              "right": "Fibromuscular dysplasia"
            }
          ]
        },
        {
          "type": "truefalse",
          "q": "Most patients with primary hyperaldosteronism are hypokalemic.",
          "a": false,
          "why": "More than 50% are normokalemic."
        },
        {
          "type": "truefalse",
          "q": "A rise in creatinine above 30% after starting an ACEi or ARB suggests renal artery stenosis.",
          "a": true
        },
        {
          "type": "number",
          "q": "Systolic BP drop within 3 minutes of standing that defines orthostatic hypotension?",
          "value": 20,
          "unit": "mm Hg"
        },
        {
          "type": "truefalse",
          "q": "In nonneurogenic orthostatic hypotension, heart rate rises by at least 15 bpm.",
          "a": true,
          "why": "An intact baroreflex gives a robust HR rise. A blunted rise points to neurogenic causes."
        },
        {
          "type": "mcq",
          "stem": "A patient loses weight on semaglutide. BP falls from 110/70 to 85/55 on standing and HR rises from 75 to 90. He takes lisinopril.",
          "q": "What is the best management?",
          "a": "Stop lisinopril",
          "distractors": [
            "Start midodrine",
            "Start fludrocortisone",
            "Tilt-table testing"
          ]
        },
        {
          "type": "recall",
          "q": "First-line drugs for neurogenic orthostatic hypotension when nonpharmacologic measures fail?",
          "a": "Midodrine or droxidopa"
        },
        {
          "type": "multi",
          "q": "Which changes occur in normal pregnancy?",
          "answers": [
            "CO increases 30–50%",
            "Plasma volume increases 40–50%",
            "SVR decreases"
          ],
          "distractors": [
            "Resting HR falls",
            "BP peaks in 2nd trimester"
          ]
        }
      ]
    },

    {
      "id": "ascvd-prevention-activity",
      "subject": "Other AI",
      "topic": "Cardiology",
      "name": "ASCVD PREVENTION & ACTIVITY",
      "blurb": "Statin thresholds, CAC, aspirin, exercise intensity",
      "cards": [
        {
          "type": "mcq",
          "q": "What statin intensity is recommended for clinical ASCVD?",
          "a": "High-intensity",
          "distractors": [
            "Moderate-intensity",
            "Low-intensity",
            "Lifestyle only"
          ]
        },
        {
          "type": "recall",
          "q": "Baseline LDL-C that warrants a high-intensity statin without risk calculation?",
          "a": "≥190 mg/dL"
        },
        {
          "type": "truefalse",
          "q": "USPSTF recommends a statin at ages 40–75 with at least 1 CVD risk factor and 10-year risk ≥10%.",
          "a": true
        },
        {
          "type": "mcq",
          "q": "Statin for a diabetic aged 40–75 with no additional ASCVD risk factors?",
          "a": "Moderate-intensity statin",
          "distractors": [
            "High-intensity statin",
            "No statin",
            "Ezetimibe alone"
          ],
          "why": "Use high-intensity when aged 50–75 or when there are multiple risk factors."
        },
        {
          "type": "bucket",
          "q": "Sort each statin regimen by intensity.",
          "bins": [
            "High-intensity",
            "Moderate-intensity"
          ],
          "items": [
            {
              "label": "Atorvastatin 40–80 mg",
              "bin": "High-intensity"
            },
            {
              "label": "Rosuvastatin 20–40 mg",
              "bin": "High-intensity"
            },
            {
              "label": "Simvastatin 20–40 mg",
              "bin": "Moderate-intensity"
            },
            {
              "label": "Pravastatin 40–80 mg",
              "bin": "Moderate-intensity"
            },
            {
              "label": "Rosuvastatin 5–10 mg",
              "bin": "Moderate-intensity"
            },
            {
              "label": "Atorvastatin 10–20 mg",
              "bin": "Moderate-intensity"
            }
          ]
        },
        {
          "type": "recall",
          "q": "USPSTF intervention for adults under 40 with CVD risk factors?",
          "a": "Behavioral counseling (diet, activity)"
        },
        {
          "type": "truefalse",
          "q": "USPSTF recommends starting low-dose aspirin for primary prevention at age 60 or older.",
          "a": false,
          "why": "This is Grade D because of GI and intracranial bleeding risk."
        },
        {
          "type": "recall",
          "q": "CAC score that allows deferring a statin in borderline or intermediate risk?",
          "a": "CAC = 0",
          "why": "Exceptions are diabetes, active smoking and strong family history of premature CAD."
        },
        {
          "type": "truefalse",
          "q": "A CAC score of 100 or more supports starting a statin.",
          "a": true
        },
        {
          "type": "number",
          "q": "Weekly minutes of moderate-intensity aerobic activity recommended for adults?",
          "value": 150,
          "unit": "min/week"
        },
        {
          "type": "bucket",
          "q": "Classify each activity by intensity.",
          "bins": [
            "Light",
            "Moderate",
            "Vigorous"
          ],
          "items": [
            {
              "label": "Stretching",
              "bin": "Light"
            },
            {
              "label": "Water aerobics",
              "bin": "Moderate"
            },
            {
              "label": "Ballroom dancing",
              "bin": "Moderate"
            },
            {
              "label": "Jogging",
              "bin": "Vigorous"
            },
            {
              "label": "Singles tennis",
              "bin": "Vigorous"
            }
          ]
        },
        {
          "type": "truefalse",
          "q": "Light activity such as stretching counts toward the 150-minute weekly goal.",
          "a": false,
          "why": "Light activity is under 3.0 METs and does not count."
        }
      ]
    },

    {
      "id": "vte-pad-edema",
      "subject": "Other AI",
      "topic": "Cardiology",
      "name": "VTE, AAA, PAD & LEG EDEMA",
      "blurb": "VTE workup and drugs, AAA, ABI, limb ischemia, venous disease",
      "cards": [
        {
          "type": "truefalse",
          "q": "In high pretest probability for PE, a negative D-dimer safely excludes it.",
          "a": false,
          "why": "Go straight to CT pulmonary angiography, or duplex ultrasound for suspected DVT."
        },
        {
          "type": "mcq",
          "q": "Anticoagulant of choice for VTE in triple-positive antiphospholipid syndrome?",
          "a": "Warfarin",
          "distractors": [
            "Apixaban",
            "Rivaroxaban",
            "Dabigatran"
          ],
          "why": "TRAPS showed more arterial thrombosis with DOACs than with warfarin."
        },
        {
          "type": "mcq",
          "stem": "A patient with acute DVT has an eGFR of 25 mL/min/1.73 m2.",
          "q": "Which anticoagulation regimen is appropriate?",
          "a": "Enoxaparin 1 mg/kg once daily",
          "distractors": [
            "Rivaroxaban 15 mg BID",
            "Dabigatran after lead-in",
            "Enoxaparin 1 mg/kg q12h"
          ],
          "why": "Reduce enoxaparin to once daily when CrCl is below 30. Avoid rivaroxaban, edoxaban and dabigatran."
        },
        {
          "type": "number",
          "q": "Duration of anticoagulation for a first VTE with a transient provoking factor?",
          "value": 3,
          "unit": "months"
        },
        {
          "type": "truefalse",
          "q": "Apixaban for acute DVT or PE requires a parenteral heparin lead-in.",
          "a": false,
          "why": "Apixaban and rivaroxaban do not. Dabigatran and edoxaban need 5–10 days of lead-in."
        },
        {
          "type": "mcq",
          "q": "Who gets one-time AAA ultrasound screening (USPSTF Grade B)?",
          "a": "Men 65–75 who ever smoked",
          "distractors": [
            "Women 65–75, never smoked",
            "Men 50–64 with HTN",
            "Diabetic adults over 50"
          ]
        },
        {
          "type": "recall",
          "q": "Size threshold for elective AAA repair in men?",
          "a": "≥5.5 cm",
          "why": "Use ≥5.0 cm in women. Also repair for rapid growth (≥0.5 cm in 6 months) or symptoms."
        },
        {
          "type": "match",
          "q": "Match the AAA diameter to its surveillance interval.",
          "pairs": [
            {
              "left": "3.0–3.9 cm",
              "right": "Every 3 years"
            },
            {
              "left": "4.0–4.9 cm",
              "right": "Every 12 months"
            },
            {
              "left": "5.0–5.4 cm",
              "right": "Every 6 months"
            }
          ]
        },
        {
          "type": "bucket",
          "q": "Interpret each ankle-brachial index.",
          "bins": [
            "Normal",
            "PAD",
            "Noncompressible"
          ],
          "items": [
            {
              "label": "ABI 1.10",
              "bin": "Normal"
            },
            {
              "label": "ABI 0.85",
              "bin": "PAD"
            },
            {
              "label": "ABI 0.35",
              "bin": "PAD"
            },
            {
              "label": "ABI 1.50",
              "bin": "Noncompressible"
            },
            {
              "label": "ABI 1.00",
              "bin": "Normal"
            }
          ],
          "why": "Order a toe-brachial index when ABI is above 1.40."
        },
        {
          "type": "mcq",
          "q": "What is the first-line treatment to improve walking distance in claudication?",
          "a": "Supervised exercise therapy",
          "distractors": [
            "Cilostazol",
            "Pentoxifylline",
            "Angioplasty"
          ]
        },
        {
          "type": "recall",
          "q": "Immediate step in suspected acute limb ischemia?",
          "a": "IV heparin and emergent transfer",
          "why": "Muscle and nerve tolerate only 4–6 hours of complete ischemia. Do not delay for duplex or CTA."
        },
        {
          "type": "number",
          "q": "Compression stocking pressure range for venous stasis ulcers?",
          "values": [
            30,
            40
          ],
          "join": "–",
          "unit": "mm Hg"
        },
        {
          "type": "multi",
          "q": "Which drugs commonly cause bilateral leg edema?",
          "answers": [
            "Amlodipine",
            "Pioglitazone",
            "Pregabalin",
            "Estrogen"
          ],
          "distractors": [
            "Losartan",
            "Furosemide"
          ],
          "why": "Review the medication list before ordering an echocardiogram."
        },
        {
          "type": "recall",
          "q": "Cause to consider for unexplained bilateral edema after cardiac, renal, hepatic and venous workup is negative?",
          "a": "Obstructive sleep apnea"
        },
        {
          "type": "truefalse",
          "q": "Cigarette smoking is the strongest risk factor for abdominal aortic aneurysm.",
          "a": true
        }
      ]
    },

    /* ═══════════════ Cardiology & Vascular ═══════════════
       Built section by section from the user's ITE study guide, under the
       card-writing rules in tools/check.html. Module 1 first. */

    {
      id: 'cv-triage',
      subject: 'Cardiology & Vascular',
      topic: 'CAD & Chest Pain',
      name: 'CHEST PAIN TRIAGE',
      blurb: 'The ECG, what counts as ACS, and what to do while EMS is coming',
      cards: [
        { type: 'number', q: 'How soon should a patient with acute chest pain have a 12-lead ECG?', value: 10, unit: 'minutes',
          why: 'The ECG is the test that decides whether the patient needs the cath lab now, so it comes before anything else. Troponin cannot make that decision early: it takes 2 to 3 hours to rise after the muscle starts to die, and at presentation it is only about 40% sensitive.' },
        { type: 'multi', q: 'Which ECG findings with chest pain mean an acute coronary syndrome and immediate EMS transfer?',
          answers: ['New left bundle branch block', 'ST-segment elevation', 'Dynamic ST depression', 'New T-wave inversions'],
          distractors: ['Sinus tachycardia', 'First-degree AV block'],
          why: 'Any of these means an unstable plaque until proven otherwise, and the place to prove otherwise is a PCI-capable hospital, not the office. Pathologic Q waves with ongoing pain count too.' },
        { type: 'recall', q: 'Why is a new left bundle branch block treated as a STEMI equivalent?', a: 'It usually means a proximal LAD occlusion',
          why: 'The left bundle is fed by septal perforators off the LAD, so a bundle that has just failed points to a large occlusion upstream. The block also distorts the ST segments, hiding the elevation that would otherwise make the diagnosis obvious.' },
        { type: 'mcq', q: 'ST elevation in the office and EMS is on the way. Which of these delays care without helping?',
          a: 'An office troponin', distractors: ['Chewed aspirin 162–325 mg', 'Sublingual nitroglycerin', 'Oxygen if SpO2 is under 90%'],
          why: 'Troponin takes 2 to 3 hours to rise and is only about 40% sensitive at presentation, so a normal value does not change the plan and an abnormal one adds nothing the ECG has not already shown. A stress test or CT angiogram is also wrong at this point: the plaque is unstable, and exercise can provoke ventricular fibrillation.' },
        { type: 'number', q: 'Aspirin dose to give in the office for a suspected MI?', values: [162, 325], join: '–', unit: 'mg',
          why: 'That is two to four 81 mg tablets, or one 325 mg tablet. It is given as soon as the diagnosis is suspected, before EMS arrives.' },
        { type: 'recall', q: 'Why is the aspirin chewed rather than swallowed whole?', a: 'It is absorbed within minutes when chewed',
          why: 'A chewed tablet is absorbed through the mouth and upper GI tract and reaches an antiplatelet effect in a few minutes. A swallowed tablet, and especially an enteric-coated one, can take an hour or more to work, which matters when a clot is forming now.' },
        { type: 'multi', q: 'Before giving sublingual nitroglycerin for chest pain, which three things do you rule out?',
          answers: ['Right ventricular infarction', 'Hypotension', 'Recent sildenafil or tadalafil'],
          distractors: ['Aspirin allergy', 'Diabetes'],
          why: 'Nitroglycerin dilates veins, which lowers the blood returning to the heart and lowers the blood pressure. In a right ventricular infarction the right ventricle needs that venous return to keep the left side filled, so nitrates can cause a severe drop in pressure. The same applies to a patient who is already hypotensive. PDE-5 inhibitors also work through nitric oxide, so combining them with a nitrate produces profound, sometimes fatal hypotension; sildenafil and vardenafil count for 24 hours after a dose, tadalafil for 48.' },
        { type: 'number', q: 'Give supplemental oxygen to a suspected MI patient only when the saturation falls below what?', value: 90, unit: '%',
          why: 'Routine oxygen used to be standard, but in patients with a normal saturation it causes coronary vasoconstriction and has not improved outcomes in trials. It is now given only to correct hypoxemia.' },
        { type: 'recall', q: 'An inferior STEMI arrives with hypotension, distended neck veins and clear lungs. Likely cause?', a: 'Right ventricular infarction',
          why: 'The right ventricle is not pumping blood forward, so the blood pressure falls and the neck veins fill, but the lungs stay clear because the left ventricle is working. Up to 40% of inferior MIs involve the right ventricle. A right-sided ECG confirms it with ST elevation in V4R.' },
        { type: 'mcq', q: 'A 62-year-old has an inferior STEMI and a BP of 84/50. What do you give first?',
          a: 'IV normal saline', distractors: ['Sublingual nitroglycerin', 'IV morphine', 'IV furosemide'],
          why: 'An ischemic right ventricle depends on venous return to push blood through to the left side, so fluid is the treatment for the hypotension. Nitroglycerin, morphine and diuretics all reduce venous return and would make the pressure worse.' },
        { type: 'match', q: 'Match the ECG pattern to the infarct it points to', pairs: [
          { left: 'ST up in II, III, aVF', right: 'Inferior (RCA)' },
          { left: 'ST up in V4R', right: 'Right ventricle' },
          { left: 'ST down V1–V3, tall R', right: 'Posterior wall' },
          { left: 'New LBBB with pain', right: 'Proximal LAD' }
        ] },
        { type: 'recall', q: 'Why does a posterior MI show ST depression rather than elevation in V1–V3?', a: 'V1–V3 see it from the opposite side',
          why: 'The posterior wall faces away from the chest leads, so its ST elevation appears upside down: depression in V1–V3, tall broad R waves instead of Q waves, upright T waves. Posterior leads V7–V9 turn the picture the right way round.' },
        { type: 'recall', q: 'In the Sgarbossa criteria, which finding scores the most points?', a: 'Concordant ST elevation ≥1 mm',
          why: 'In a paced rhythm or an old left bundle branch block the ST segments normally point opposite to the QRS, so ST elevation in the same direction as the QRS is abnormal and is worth 5 points on its own. Concordant ST depression in V1 to V3 is 3 points, and discordant elevation of 5 mm or more, or more than a quarter of the S wave depth, is 2 points.' }
      ]
    },

    {
      id: 'cv-stress',
      subject: 'Cardiology & Vascular',
      topic: 'CAD & Chest Pain',
      name: 'STRESS TESTING',
      blurb: 'Choosing between treadmill, imaging, pharmacologic stress and CT',
      cards: [
        { type: 'mcq', q: 'Intermediate-risk chest pain, negative troponins, normal treadmill test 8 months ago, pain keeps recurring. Next test?',
          a: 'Coronary CT angiography', distractors: ['Repeat treadmill test', 'Cardiac MRI', 'FFR-CT alone'],
          why: 'A stress test only sees a lesion once it narrows the artery by about 70%, so a normal one does not exclude plaque, and repeating it asks the same question again. CT angiography looks at the lumen directly, with a negative predictive value above 95%.' },
        { type: 'recall', q: 'Why can a stress test be normal in someone with significant coronary disease?', a: 'It only detects flow-limiting narrowing',
          why: 'Ischemia only shows when a lesion limits flow, roughly a 70% stenosis. Non-obstructive plaque that will rupture next month is invisible, and balanced three-vessel disease can look normal because every territory is equally underperfused.' },
        { type: 'recall', q: 'When is FFR-CT used?', a: 'After CCTA shows a 40–90% stenosis',
          why: 'It is not a first test. Once CT angiography finds an intermediate narrowing, FFR-CT estimates whether it limits flow — an FFR of 0.80 or less — and so whether the patient needs invasive angiography and a stent.' },
        { type: 'recall', q: 'Best imaging test to evaluate for cardiac amyloidosis or sarcoidosis?', a: 'Cardiac MRI',
          why: 'MRI characterizes the heart muscle itself, so it is the test for infiltrative disease, myocarditis, pericarditis and scar or viability after an infarct. It does not image the coronary lumen, which is why it is not a test for coronary disease.' },
        { type: 'multi', q: 'Which baseline ECG findings make an exercise treadmill ECG uninterpretable?',
          answers: ['Left bundle branch block', 'Ventricular pacing', 'WPW pre-excitation', 'Resting ST depression >1 mm'],
          distractors: ['First-degree AV block', 'Sinus bradycardia'],
          why: 'Each of these distorts the ST segment at rest, so the ST depression that defines a positive test cannot be read. LVH with strain and digoxin do the same. Those patients need imaging — echo or nuclear — added to the stress.' },
        { type: 'recall', q: 'What defines a positive exercise treadmill ECG?', a: '≥1 mm horizontal or downsloping ST depression',
          why: 'Upsloping depression does not count. The patient also has to reach a useful workload, about 5 METs, or a negative test means little.' },
        { type: 'mcq', q: 'A patient with LBBB needs a stress test and can walk. Which protocol?',
          a: 'Regadenoson nuclear MPI', distractors: ['Exercise treadmill ECG', 'Exercise stress echo', 'Dobutamine stress echo'],
          why: 'In left bundle branch block or a paced rhythm the septum contracts late, and under exercise or dobutamine that delayed contraction reduces septal perfusion and shows up as a defect that is not ischemia. Vasodilator stress with nuclear imaging does not have that problem, so it is the protocol of choice.' },
        { type: 'multi', q: 'When are regadenoson and adenosine contraindicated for stress testing?',
          answers: ['Active wheezing', 'Second- or third-degree AV block'],
          distractors: ['A prior stent', 'Hypertension', 'Diabetes'],
          why: 'Both act on adenosine receptors, which constrict airways and slow AV conduction. Caffeine and theophylline block the same receptors, so they are held for 12–24 hours before the test, and aminophylline reverses the drug if things go wrong.' },
        { type: 'recall', q: 'Stress test for a patient who cannot exercise and has severe asthma?', a: 'Dobutamine stress echo',
          why: 'Vasodilators are out because of the bronchospasm, so the stress comes from an inotrope instead. Dobutamine has its own exclusions: uncontrolled hypertension and ventricular arrhythmias.' },
        { type: 'recall', q: 'Why does the heart rate need to be slow for a coronary CT angiogram?', a: 'Motion blurs the coronary lumen',
          why: 'The coronary arteries are small and move with every beat. The scanner captures them during the brief still period in diastole, and the slower the heart, the longer that period is and the sharper the image. Most patients are given a beta-blocker before the scan to get there.' },
        { type: 'number', q: 'Heart rate should be below what before a coronary CT angiogram?', value: 65, unit: 'bpm',
          why: 'Most labs aim for under 60 to 65 and give an oral or IV beta-blocker beforehand. The other requirement is kidney function adequate for iodinated contrast.' },
        { type: 'recall', q: 'Why is coronary CT angiography less useful in an 80-year-old with heavy coronary calcification?', a: 'Calcium blooms and hides the lumen',
          why: 'Dense calcium scatters on CT and appears larger than it is, so a calcium score above 400–1000 obscures the very lumen the test is meant to show. Those patients do better with a functional test.' }
      ]
    },

    {
      id: 'cv-angina',
      subject: 'Cardiology & Vascular',
      topic: 'CAD & Chest Pain',
      name: 'STABLE ANGINA',
      blurb: 'First-line therapy, what to add, and the drugs that do not mix',
      cards: [
        { type: 'recall', q: 'First-line drug class for preventing episodes of chronic stable angina?', a: 'A beta-blocker',
          why: 'It lowers heart rate, contractility and pressure, so the heart needs less oxygen, and a slower rate lengthens diastole, which is when the coronaries actually fill. Both sides of the supply–demand equation move the right way.' },
        { type: 'number', q: 'Target resting heart rate on a beta-blocker for stable angina?', values: [55, 60], join: '–', unit: 'bpm',
          why: 'Below 55, or with second- or third-degree block, the dose is not pushed further; the next step is a second class.' },
        { type: 'mcq', q: 'Angina persists on a maximal beta-blocker and the resting heart rate is 52. What do you add?',
          a: 'Isosorbide mononitrate', distractors: ['Diltiazem', 'Ivabradine', 'A higher beta-blocker dose'],
          why: 'The rate is already low, so the add-on has to work without slowing it further: a long-acting nitrate or a dihydropyridine like amlodipine. Diltiazem and verapamil slow the node and can produce complete heart block on top of a beta-blocker; ivabradine is contraindicated below 60.' },
        { type: 'recall', q: 'Why must long-acting nitrates have a 10–14 hour nitrate-free interval each day?', a: 'Continuous exposure causes tolerance',
          why: 'The vessels stop responding when nitrate is always present, so the drug is dosed to leave a gap, usually overnight. Angina that breaks through in the gap is handled with sublingual nitroglycerin, not by closing the gap.' },
        { type: 'recall', q: 'How do nitrates relieve angina?', a: 'Venodilation lowers preload and wall stress',
          why: 'Less blood returning means a smaller, less stretched ventricle that needs less oxygen. They also dilate the epicardial coronaries. The effect on afterload is minor by comparison.' },
        { type: 'bucket', q: 'Which calcium channel blockers can be combined with a beta-blocker?', bins: ['Safe to combine', 'Avoid combining'], items: [
          { label: 'Amlodipine', bin: 'Safe to combine' },
          { label: 'Nifedipine ER', bin: 'Safe to combine' },
          { label: 'Diltiazem', bin: 'Avoid combining' },
          { label: 'Verapamil', bin: 'Avoid combining' }
        ], why: 'Dihydropyridines dilate vessels and leave the conduction system alone. Diltiazem and verapamil slow the SA and AV nodes, so stacking them on a beta-blocker in a bradycardic patient produces severe bradycardia or heart block.' },
        { type: 'recall', q: 'Which antianginal works without changing heart rate or blood pressure?', a: 'Ranolazine',
          why: 'It blocks the late inward sodium current, which reduces calcium overload in the cell and lets the muscle relax in diastole. That makes it the add-on for the patient whose rate and pressure are already too low for nitrates or calcium channel blockers.' },
        { type: 'recall', q: 'Why is ivabradine not used for stable angina when the ejection fraction is normal?', a: 'No benefit, more bradycardia and AF',
          why: 'Ivabradine slows the sinus node by blocking the funny current and does nothing else. The SIGNIFY trial tested it in stable angina with preserved ejection fraction and found no reduction in cardiac events, with more bradycardia and atrial fibrillation. Its approval is for HFrEF with an ejection fraction of 35% or less, in sinus rhythm, on a maximal beta-blocker.' },
        { type: 'number', q: 'Minimum resting heart rate for starting ivabradine in HFrEF?', value: 70, unit: 'bpm',
          why: 'It is only approved when the rate is still 70 or above on a maximally tolerated beta-blocker, and it is contraindicated when the rate is under 60.' },
        { type: 'truefalse', q: 'Verapamil can replace a beta-blocker as first-line antianginal when beta-blockers are contraindicated.', a: true,
          why: 'It slows the node and reduces demand much as a beta-blocker does, which is exactly why it is a substitute and never an addition.' }
      ]
    },

    {
      id: 'cv-postmi',
      subject: 'Cardiology & Vascular',
      topic: 'CAD & Chest Pain',
      name: 'POST-MI',
      blurb: 'The ruptures, the pericarditis, the aneurysm, and when each happens',
      cards: [
        { type: 'mcq', q: 'Day 4 after an inferior MI: sudden pulmonary edema, hypotension, a new apical holosystolic murmur, no JVD. Diagnosis?',
          a: 'Papillary muscle rupture', distractors: ['Ventricular septal rupture', 'Free wall rupture', 'Peri-infarction pericarditis'],
          why: 'A torn posteromedial papillary muscle lets the mitral valve leak suddenly into a small, stiff left atrium, so the lungs flood and the pressure collapses within minutes. The neck veins stay flat because the right heart is not involved; that is the detail that separates it from a septal rupture.' },
        { type: 'recall', q: 'Why does the posteromedial papillary muscle rupture far more often than the anterolateral?', a: 'It has a single blood supply',
          why: 'The posteromedial muscle is fed only by the posterior descending artery, from the RCA or circumflex, so an inferior or posterior infarct can kill it outright. The anterolateral muscle draws on both the LAD and the circumflex and almost always survives.' },
        { type: 'match', q: 'Match the post-MI complication to when it usually happens', pairs: [
          { left: 'Pericarditis', right: 'Days 1–3' },
          { left: 'Papillary rupture', right: 'Days 3–5' },
          { left: 'Free wall rupture', right: 'Days 5–14' },
          { left: 'Dressler syndrome', right: 'Weeks 2–8' }
        ] },
        { type: 'mcq', q: 'Which finding points to a ventricular septal rupture rather than papillary muscle rupture?',
          a: 'Jugular venous distention', distractors: ['A holosystolic murmur', 'Pulmonary edema', 'Hypotension'],
          why: 'A septal rupture shunts blood left to right, so the right ventricle fails too and the neck veins fill. The murmur sits at the left sternal border with a thrill in half of patients, and a catheter finds the oxygen saturation stepping up from right atrium to right ventricle. Both get an echo, afterload reduction with a balloon pump, and surgery.' },
        { type: 'recall', q: 'Which drugs are used for pericarditis in the first days after an MI?', a: 'High-dose aspirin plus colchicine',
          why: 'Other NSAIDs and steroids are avoided for the first weeks: both impair scar formation in the healing infarct, and a thin scar is what ruptures. Aspirin treats the inflammation without that cost.' },
        { type: 'recall', q: 'Fever, a friction rub and pleuritic chest pain three weeks after an MI. Likely cause?', a: 'Dressler syndrome',
          why: 'This is an autoimmune pericarditis: antibodies form against myocardial antigens exposed by the infarct and cause a pleuropericarditis with fever, malaise, a rub, a raised ESR and CRP, and often pericardial or pleural effusions. It is treated with high-dose aspirin and colchicine; steroids are kept for cases that do not respond.' },
        { type: 'number', q: 'Dressler syndrome usually appears how long after an MI?', values: [2, 8], join: '–', unit: 'weeks',
          why: 'The timing is what separates it from peri-infarction pericarditis, which appears in the first 1 to 3 days and is a direct reaction to the injured muscle rather than an immune response.' },
        { type: 'recall', q: 'Sudden tearing chest pain, syncope and pulseless electrical activity a week after a large anterior MI. Likely cause?', a: 'Left ventricular free wall rupture',
          why: 'The infarcted wall tears and blood fills the pericardium, producing tamponade: hypotension, distended neck veins, muffled heart sounds and a pulsus paradoxus, then PEA. It happens 5 to 14 days after a large anterior or lateral infarct, most often in an older woman with a first MI who was not reperfused. Pericardiocentesis is done immediately, and the repair is surgical.' },
        { type: 'recall', q: 'What does ST elevation that persists more than two weeks after an anterior MI suggest?', a: 'A left ventricular aneurysm',
          why: 'A thinned, scarred segment bulges out with each beat and keeps the ST segments up, alongside deep Q waves. It can hold a mural thrombus, generate ventricular arrhythmias and cause heart failure; a thrombus on echo earns 3 to 6 months of anticoagulation.' },
        { type: 'recall', q: 'Months after an MI: slowly progressive exertional dyspnea and an apical holosystolic murmur to the axilla. Diagnosis?', a: 'Functional mitral regurgitation',
          why: 'As the ventricle remodels and dilates, the papillary muscles are pulled outward and tether the mitral leaflets so they no longer meet. The valve itself is normal; the leak comes from the shape of the ventricle. Because the left atrium has had months to enlarge, this presents gradually in clinic rather than as flash pulmonary edema. The murmur is loudest at the apex, radiates to the axilla, and gets louder lying flat, when venous return is highest.' },
        { type: 'recall', q: 'What do giant V waves on a wedge pressure tracing after an MI indicate?', a: 'Acute mitral regurgitation',
          why: 'Each systole pushes a jet backward into the left atrium, and the V wave is that atrium filling under pressure. It is the catheter-lab signature of papillary muscle rupture.' }
      ]
    },

    {
      id: 'cv-hf-dx',
      subject: 'Cardiology & Vascular',
      topic: 'Heart Failure',
      name: 'HF DIAGNOSIS',
      blurb: 'Echo categories, natriuretic peptides and the chest x-ray',
      cards: [
        { type: 'recall', q: 'Which test classifies heart failure by ejection fraction?', a: 'Transthoracic echocardiogram',
          why: 'Echo measures the ejection fraction directly and also shows the valves, wall thickness and filling pattern, so it both confirms heart failure and tells you which kind it is. Every other test supports the diagnosis; this one defines it.' },
        { type: 'match', q: 'Match the ejection fraction to the heart failure category', pairs: [
          { left: '40% or less', right: 'HFrEF' },
          { left: '41–49%', right: 'HFmrEF' },
          { left: '50% or more', right: 'HFpEF' },
          { left: 'Was ≤40%, now above', right: 'HFimpEF' }
        ] },
        { type: 'number', q: 'NT-proBNP at or above what level supports a diagnosis of heart failure?', value: 300, unit: 'pg/mL',
          why: 'The equivalent cutoff for BNP is 100 pg/mL. The more useful property runs the other way: a normal value excludes acute decompensated heart failure with a negative predictive value above 95%, so a low result in a breathless patient should send you looking elsewhere.' },
        { type: 'multi', q: 'Which conditions raise BNP independently of heart failure?',
          answers: ['Chronic kidney disease', 'Older age', 'Atrial fibrillation'],
          distractors: ['Obesity', 'Young age'],
          why: 'The kidney clears natriuretic peptides, so renal impairment lets the level rise; aging and atrial fibrillation stretch the atria and raise it too. Obesity works in the opposite direction and lowers BNP, so a value that looks normal in an obese patient is less reassuring than it seems.' },
        { type: 'truefalse', q: 'A normal chest x-ray rules out systolic heart failure.', a: false,
          why: 'About one in five outpatients with HFrEF has a normal chest film. Pulmonary congestion on x-ray takes time to develop and chronic patients have adapted lymphatic drainage, so the absence of congestion means little. The echo is the test that answers the question.' },
        { type: 'number', q: 'What percentage of outpatients with HFrEF have a normal chest x-ray?', value: 20, unit: '%',
          why: 'A normal film is common enough that it should never be used to stop a workup when the history and exam suggest heart failure.' }
      ]
    },

    {
      id: 'cv-hf-gdmt',
      subject: 'Cardiology & Vascular',
      topic: 'Heart Failure',
      name: 'THE FOUR PILLARS',
      blurb: 'The drugs that lower mortality in HFrEF, and how each is started',
      cards: [
        { type: 'multi', q: 'Which drug classes are the four pillars of HFrEF therapy?',
          answers: ['ARNi (sacubitril/valsartan)', 'Beta-blocker', 'MRA (spironolactone)', 'SGLT2 inhibitor'],
          distractors: ['Loop diuretic', 'Digoxin'],
          why: 'Each of the four has been shown to reduce mortality on its own, and they add together. Loop diuretics control fluid and digoxin reduces admissions, but neither changes how long the patient lives.' },
        { type: 'number', q: 'Washout between stopping an ACE inhibitor and starting sacubitril/valsartan?', value: 36, unit: 'hours',
          why: 'Both drugs raise bradykinin, ACE inhibitors by blocking its breakdown through ACE and sacubitril by blocking its breakdown through neprilysin. Overlapping them produces severe angioedema, so the ACE inhibitor is stopped 36 hours before the first dose. No washout is needed when switching from an ARB.' },
        { type: 'recall', q: 'Why does sacubitril/valsartan outperform an ACE inhibitor alone?', a: 'It preserves the natriuretic peptides',
          why: 'Sacubitril inhibits neprilysin, the enzyme that breaks down the heart\'s own natriuretic peptides. Keeping those peptides around promotes sodium excretion and vasodilation and suppresses the fibrosis that drives remodeling. Valsartan blocks the angiotensin that neprilysin inhibition would otherwise let rise.' },
        { type: 'multi', q: 'Which beta-blockers have mortality evidence in HFrEF?',
          answers: ['Carvedilol', 'Metoprolol succinate', 'Bisoprolol'],
          distractors: ['Metoprolol tartrate', 'Atenolol', 'Propranolol'],
          why: 'Only these three were studied in the heart failure trials, and the benefit is not assumed to carry across the class. Metoprolol tartrate is the short-acting form and is not a substitute for the succinate used in the trial.' },
        { type: 'recall', q: 'When is it safe to start a beta-blocker in a patient with HFrEF?', a: 'Once the patient is euvolemic and stable',
          why: 'A beta-blocker reduces contractility in the short term before its long-term benefit appears, so starting it during pulmonary edema or cardiogenic shock can make the patient worse. It is begun at a low dose after the congestion has been treated and increased slowly.' },
        { type: 'recall', q: 'Why does a beta-blocker reduce mortality in HFrEF?', a: 'It protects the heart from chronic sympathetic drive',
          why: 'In heart failure the sympathetic nervous system runs constantly, and prolonged catecholamine exposure is toxic to myocytes and promotes arrhythmias. Blocking it allows the ventricle to remodel back toward normal and reduces sudden arrhythmic death by about a third.' },
        { type: 'multi', q: 'Before starting spironolactone for HFrEF, which two labs have to be acceptable?',
          answers: ['eGFR above 30', 'Potassium below 5.0'],
          distractors: ['Sodium above 135', 'Hemoglobin above 12'],
          why: 'Aldosterone blockade causes the kidney to retain potassium, so a patient who already has a high potassium or a kidney that cannot excrete it is at risk of dangerous hyperkalemia. Potassium and creatinine are rechecked within the first week and after any dose change.' },
        { type: 'recall', q: 'A man on spironolactone develops painful gynecomastia. What do you switch to?', a: 'Eplerenone',
          why: 'Spironolactone also blocks androgen receptors, which is what causes the breast tenderness. Eplerenone is selective for the mineralocorticoid receptor, so it gives the same heart failure benefit without that effect.' },
        { type: 'recall', q: 'Why does a mineralocorticoid antagonist reduce mortality in HFrEF?', a: 'It blocks aldosterone-driven fibrosis',
          why: 'Aldosterone does more than retain sodium: it stimulates collagen deposition in the myocardium, which stiffens the ventricle and provides a substrate for arrhythmias. Blocking it reduces mortality by about 30% in NYHA class II to IV patients with an ejection fraction of 35% or less.' },
        { type: 'truefalse', q: 'SGLT2 inhibitors reduce heart failure hospitalizations only in patients with diabetes.', a: false,
          why: 'The benefit is independent of blood glucose. Dapagliflozin and empagliflozin reduce cardiovascular death and heart failure admissions in patients with and without diabetes, and across the whole range of ejection fractions, reduced, mildly reduced and preserved.' },
        { type: 'recall', q: 'Which heart failure drug class relieves congestion but does not reduce mortality?', a: 'Loop diuretics',
          why: 'Furosemide, bumetanide and torsemide are essential for symptoms and volume control, and almost every patient with congestion needs one. But a diuretic treats the fluid, not the disease, and no trial has shown it lengthens life. That is why it is not counted among the pillars.' }
      ]
    },

    {
      id: 'cv-hf-avoid',
      subject: 'Cardiology & Vascular',
      topic: 'Heart Failure',
      name: 'WHAT TO AVOID',
      blurb: 'Why therapy continues after recovery, and the drugs that make HF worse',
      cards: [
        { type: 'mcq', q: 'LVEF has recovered from 30% to 55% on GDMT. What happens to the medications?',
          a: 'Continue all of them', distractors: ['Stop the beta-blocker', 'Taper everything slowly', 'Keep only the ARNi'],
          why: 'The recovered ventricle is in remission, not cured. In the TRED-HF trial, patients with recovered dilated cardiomyopathy had their therapy withdrawn in stages, and 44% relapsed within six months, against none in the group that continued. Treatment is stopped only for a specific adverse effect.' },
        { type: 'recall', q: 'Why is a recovered ejection fraction on GDMT not considered a cure?', a: 'The recovery depends on the drugs',
          why: 'The medications have reversed the remodeling, but the underlying tendency of the ventricle to dilate and weaken is still there. Remove the drugs and the sympathetic and renin-angiotensin drive returns, and the ventricle follows. The relapse in TRED-HF happened quickly, within months.' },
        { type: 'bucket', q: 'Safe or harmful in heart failure with reduced ejection fraction?', bins: ['Safe', 'Harmful'], items: [
          { label: 'Verapamil', bin: 'Harmful' },
          { label: 'Pioglitazone', bin: 'Harmful' },
          { label: 'Saxagliptin', bin: 'Harmful' },
          { label: 'Ibuprofen', bin: 'Harmful' },
          { label: 'Cilostazol', bin: 'Harmful' },
          { label: 'Amlodipine', bin: 'Safe' },
          { label: 'Sitagliptin', bin: 'Safe' },
          { label: 'Empagliflozin', bin: 'Safe' }
        ], why: 'Verapamil and diltiazem reduce contractility. Pioglitazone and NSAIDs make the kidney hold sodium and water. Saxagliptin and alogliptin raise heart failure admissions, while sitagliptin and linagliptin are neutral. Cilostazol is a PDE-3 inhibitor, a class that shortens survival in heart failure. Amlodipine is the one calcium channel blocker that is safe.' },
        { type: 'recall', q: 'Why does pioglitazone worsen heart failure?', a: 'It makes the kidney retain sodium and water',
          why: 'Thiazolidinediones act on the collecting duct and increase sodium reabsorption, which expands plasma volume. In a ventricle that cannot handle extra volume that means edema and decompensation, so the class is contraindicated in symptomatic heart failure.' },
        { type: 'recall', q: 'Which claudication drug is contraindicated in heart failure of any severity?', a: 'Cilostazol',
          why: 'It inhibits phosphodiesterase-3, and oral drugs in that class, such as milrinone taken by mouth, increased mortality in heart failure trials. The warning applies to any degree of heart failure, not only severe disease.' },
        { type: 'recall', q: 'Why do NSAIDs cause problems in heart failure?', a: 'Sodium retention and diuretic resistance',
          why: 'Prostaglandins keep the renal afferent arterioles open and promote sodium excretion. NSAIDs and COX-2 inhibitors remove that, so the kidney retains sodium, the diuretics stop working as well, and the glomerular filtration rate can fall. The combination leads to fluid overload and acute kidney injury.' },
        { type: 'recall', q: 'Which DPP-4 inhibitors increase heart failure hospitalizations?', a: 'Saxagliptin and alogliptin',
          why: 'The signal appeared in their cardiovascular outcome trials and was not seen with sitagliptin or linagliptin. In a diabetic patient with heart failure the better choice is an SGLT2 inhibitor, which actively reduces admissions.' }
      ]
    },

    {
      id: 'cv-hcm',
      subject: 'Cardiology & Vascular',
      topic: 'Heart Failure',
      name: 'HCM & MANEUVERS',
      blurb: 'Why the HCM murmur behaves backwards, and what each maneuver does',
      cards: [
        { type: 'recall', q: 'Why does the HCM murmur get louder when the left ventricle gets smaller?', a: 'The mitral leaflet moves closer to the septum',
          why: 'The obstruction in hypertrophic cardiomyopathy is dynamic: during systole the anterior mitral leaflet is drawn toward the thickened septum and narrows the outflow tract. A smaller ventricle, from less filling, less afterload or a faster rate, brings the leaflet and septum closer together, so the obstruction and the murmur both increase. A larger ventricle pushes them apart and the murmur softens. Every other murmur does the opposite, because they depend on how much blood crosses the valve.' },
        { type: 'trend', q: 'The HCM murmur with each maneuver', items: [
          { label: 'Valsalva strain', dir: 'up' },
          { label: 'Squatting', dir: 'down' },
          { label: 'Isometric handgrip', dir: 'down' },
          { label: 'Amyl nitrite', dir: 'up' }
        ], why: 'Valsalva and amyl nitrite shrink the ventricle, by cutting venous return and by dropping afterload, and make the murmur louder. Squatting fills the ventricle and handgrip raises the pressure it has to push against; both enlarge it and make the murmur softer.' },
        { type: 'trend', q: 'The aortic stenosis murmur with each maneuver', items: [
          { label: 'Squatting', dir: 'up' },
          { label: 'Standing', dir: 'down' },
          { label: 'Isometric handgrip', dir: 'down' },
          { label: 'Amyl nitrite', dir: 'up' }
        ], why: 'Aortic stenosis is a fixed obstruction, so its murmur tracks the volume ejected across the valve: more with squatting, less on standing. Handgrip raises aortic pressure and narrows the gradient between ventricle and aorta, so the murmur softens; amyl nitrite lowers aortic pressure and widens the gradient, so it gets louder.' },
        { type: 'recall', q: 'Why does isometric handgrip make the HCM murmur softer?', a: 'Higher afterload holds the outflow tract open',
          why: 'Handgrip raises systemic vascular resistance, so the ventricle faces a higher aortic pressure and empties less completely. The larger systolic volume keeps the mitral leaflet away from the septum, and the obstruction eases.' },
        { type: 'multi', q: 'Which murmurs get louder with isometric handgrip?',
          answers: ['Mitral regurgitation', 'Aortic regurgitation', 'Ventricular septal defect'],
          distractors: ['Hypertrophic cardiomyopathy', 'Aortic stenosis'],
          why: 'Handgrip raises the pressure in the aorta and left ventricle. Any lesion where blood leaks backward or across a defect driven by left-sided pressure gets more flow and a louder murmur. Aortic stenosis and HCM depend on forward flow through a narrowed outflow and get softer.' },
        { type: 'recall', q: 'What happens to the mitral valve prolapse click when the patient stands up?', a: 'It moves earlier in systole',
          why: 'Standing reduces venous return and the ventricle is smaller, so the redundant leaflet prolapses sooner in systole: the click comes earlier and the murmur that follows it lasts longer. Squatting does the reverse, moving the click later and shortening the murmur.' }
      ]
    },

    {
      id: 'cv-as',
      subject: 'Cardiology & Vascular',
      topic: 'Valves & Screening',
      name: 'SEVERE AS',
      blurb: 'The numbers that define severe, and the four reasons to replace the valve',
      cards: [
        { type: 'number', q: 'Peak aortic jet velocity that defines severe aortic stenosis?', value: 4, unit: 'm/s',
          why: 'Velocity is the most reproducible of the three echo measures. The faster the jet, the tighter the valve, and 4 m/s corresponds roughly to a mean gradient of 40 mm Hg and a valve area of about 1 cm².' },
        { type: 'number', q: 'Mean transvalvular gradient that defines severe aortic stenosis?', value: 40, unit: 'mm Hg',
          why: 'The gradient is the pressure difference the ventricle has to generate to push blood through the valve. It depends on flow as well as valve area, so a failing ventricle can have severe stenosis with a gradient under 40; velocity and valve area are read alongside it.' },
        { type: 'number', q: 'Aortic valve area at or below which stenosis is typically severe?', value: 1, unit: 'cm²',
          why: 'A normal valve opens to 3 to 4 cm². Symptoms usually begin once the area falls to about 1 cm², which is why that number marks the threshold for severe disease.' },
        { type: 'multi', q: 'Which symptoms mark severe aortic stenosis as symptomatic?',
          answers: ['Angina', 'Exertional syncope', 'Dyspnea or heart failure'],
          distractors: ['Palpitations', 'Ankle edema alone'],
          why: 'The three classic symptoms each reflect the ventricle failing to meet demand across the narrowed valve: angina from a thick muscle outgrowing its supply, syncope from an output that cannot rise with exercise, and dyspnea from rising filling pressures. Any one of them changes the plan from watching to replacing.' },
        { type: 'number', q: 'Symptomatic severe aortic stenosis, no valve replacement: roughly what share of patients die within two years?', value: 50, unit: '%',
          why: 'Once symptoms appear the course is short, which is why a symptomatic patient is referred urgently for surgical or transcatheter replacement rather than followed.' },
        { type: 'mcq', q: 'Asymptomatic severe aortic stenosis with an ejection fraction of 45%. What do you do?',
          a: 'Refer for valve replacement', distractors: ['Repeat the echo in 6 months', 'Start a beta-blocker', 'Order an exercise test first'],
          why: 'An ejection fraction under 50% in severe stenosis means the ventricle is already decompensating against the valve, whether or not the patient reports symptoms. Waiting risks dysfunction that does not recover after the valve is replaced.' },
        { type: 'recall', q: 'Why does a falling ejection fraction in asymptomatic severe aortic stenosis call for valve replacement?', a: 'The ventricle is failing against the valve',
          why: 'The stenotic valve is a fixed afterload. For years the ventricle compensates by thickening; when the ejection fraction starts to drop it means the muscle can no longer overcome the obstruction, a state called afterload mismatch. Replacing the valve removes the load, and the earlier it is done the more function returns.' },
        { type: 'multi', q: 'Besides symptoms and a low ejection fraction, which findings justify replacing an asymptomatic severe aortic valve?',
          answers: ['Other cardiac surgery planned', 'BP drops on exercise testing', 'Peak velocity of 5 m/s or more', 'BNP more than 3× normal'],
          distractors: ['Age over 80', 'A soft murmur'],
          why: 'If the chest is being opened anyway, the valve is done at the same time. A supervised exercise test that provokes symptoms or a fall in systolic pressure unmasks a patient who is symptomatic but has been limiting activity. Very high velocity, a markedly raised BNP, or rapid progression of 0.3 m/s a year or more all predict trouble soon.' },
        { type: 'recall', q: 'Why are the coronary arteries imaged before an aortic valve is replaced?', a: 'Coronary disease is fixed at the same time',
          why: 'Aortic stenosis and coronary atherosclerosis share the same risk factors and the same patients, so a significant stenosis is common. If one is found it is bypassed during the same operation, or stented before a transcatheter valve, rather than discovered afterward. Angiography or CT angiography is part of the standard workup.' }
      ]
    },

    {
      id: 'cv-sports',
      subject: 'Cardiology & Vascular',
      topic: 'Valves & Screening',
      name: 'SPORTS SCREENING',
      blurb: 'The 14-point screen, what triggers testing, and the innocent murmurs',
      cards: [
        { type: 'truefalse', q: 'An asymptomatic athlete with a normal 14-point history and exam should have a screening ECG.', a: false,
          why: 'The AHA protocol relies on history and examination. An ECG or echocardiogram is ordered only when one of the fourteen elements is positive. Routine ECGs in athletes with a normal screen produce many false positives and have not been shown to prevent sudden death.' },
        { type: 'multi', q: 'Which items from the athlete\'s own history trigger an ECG or echo on the 14-point screen?',
          answers: ['Exertional chest pain', 'Unexplained syncope', 'Excessive exertional dyspnea', 'A prior heart murmur'],
          distractors: ['Mild COVID 14+ days ago', 'Asthma'],
          why: 'Each of these can be the first sign of a cardiomyopathy or a channelopathy, and syncope during exercise is the most worrying of them. A high blood pressure reading also counts. Full recovery from mild COVID more than two weeks earlier does not require an ECG before return to play.' },
        { type: 'multi', q: 'Which family-history items on the sports screen trigger further testing?',
          answers: ['Sudden cardiac death under 50', 'Known HCM or long QT', 'Marfan syndrome'],
          distractors: ['Rheumatic heart disease', 'Hypertension in a parent'],
          why: 'The screen is looking for inherited conditions: hypertrophic and dilated cardiomyopathy, long QT, Brugada, Marfan. A premature sudden death or disability from heart disease in a close relative under 50 counts even without a named diagnosis.' },
        { type: 'recall', q: 'Why doesn\'t rheumatic heart disease in a relative count on the sports screen?', a: 'It is acquired, not inherited',
          why: 'Rheumatic valve disease follows a streptococcal infection and does not run in families through a gene. The family-history questions exist to find genetic cardiomyopathies and channelopathies, which is why a relative\'s rheumatic disease, however serious, is not a trigger.' },
        { type: 'multi', q: 'Which exam findings on the sports screen prompt an ECG or echo?',
          answers: ['A heart murmur', 'Diminished femoral pulses', 'Marfan features', 'Elevated brachial BP'],
          distractors: ['A split S2', 'Resting heart rate of 48'],
          why: 'The murmur is listened for both supine and standing, because the HCM murmur appears or grows on standing. Weak femoral pulses point to coarctation. A tall, long-limbed athlete with chest wall or lens findings may have Marfan syndrome and an aorta at risk. A slow resting rate is normal in a trained athlete.' },
        { type: 'recall', q: 'Harsh systolic murmur at the left upper sternal border in a teenager that fades with Valsalva. Likely cause?', a: 'Pulmonary flow murmur',
          why: 'This is an innocent murmur from brisk flow across a normal pulmonary valve. It is heard in healthy adolescents, has no click or radiation, and gets quieter when less blood returns to the heart, as with standing or the strain phase of Valsalva. No testing is needed if the rest of the screen is normal.' },
        { type: 'recall', q: 'Continuous humming sound below the clavicle that disappears when lying down or pressing on the jugular vein. Likely cause?', a: 'Venous hum',
          why: 'The sound is blood draining through the jugular veins when the patient is upright. Lying down or gentle pressure on the vein stops the flow and the hum with it, which is what distinguishes it from a patent ductus, whose continuous murmur does not change with position.' },
        { type: 'recall', q: 'Why does an innocent flow murmur get quieter with standing or Valsalva?', a: 'Less venous return means less flow',
          why: 'An innocent murmur is produced by the volume of blood crossing a normal valve. Standing and straining reduce venous return, so less blood crosses the valve and the murmur softens. The murmur of hypertrophic cardiomyopathy does the opposite in the same maneuvers, which is why a murmur that grows on standing is never called innocent.' }
      ]
    },

    {
      id: 'cv-ie',
      subject: 'Cardiology & Vascular',
      topic: 'Valves & Screening',
      name: 'IE PROPHYLAXIS',
      blurb: 'Who gets it, for which procedures, and with what',
      cards: [
        { type: 'bucket', q: 'Antibiotic prophylaxis before dental work?', bins: ['Prophylaxis', 'None'], items: [
          { label: 'Prosthetic heart valve', bin: 'Prophylaxis' },
          { label: 'Prior endocarditis', bin: 'Prophylaxis' },
          { label: 'Unrepaired cyanotic CHD', bin: 'Prophylaxis' },
          { label: 'Transplant valvulopathy', bin: 'Prophylaxis' },
          { label: 'Bicuspid aortic valve', bin: 'None' },
          { label: 'Mitral valve prolapse', bin: 'None' },
          { label: 'Native aortic stenosis', bin: 'None' },
          { label: 'Mitral regurgitation', bin: 'None' }
        ], why: 'The list is short on purpose: prosthetic valves or repair material, a previous episode of endocarditis, unrepaired cyanotic congenital disease or a repair with a residual shunt or a device placed within six months, and valve disease in a transplanted heart. Native valve lesions, including bicuspid valves and prolapse, no longer qualify.' },
        { type: 'recall', q: 'Why is endocarditis prophylaxis limited to prosthetic valves, prior endocarditis and cyanotic defects?', a: 'They have the worst outcomes if infected',
          why: 'The guidelines stopped trying to prevent every case and focused on the patients in whom endocarditis is most likely to be fatal or to destroy a valve. Everyday bacteremia from chewing and brushing far exceeds what a dental visit causes, so antibiotics for a single procedure prevent very few cases in anyone else.' },
        { type: 'multi', q: 'Which procedures need endocarditis prophylaxis in a high-risk patient?',
          answers: ['Tooth extraction', 'Scaling of the gums', 'Tonsillectomy'],
          distractors: ['Colonoscopy', 'Cystoscopy', 'Routine dental x-rays'],
          why: 'Prophylaxis covers dental procedures that manipulate the gums or the root region of a tooth or breach the oral mucosa, and respiratory procedures that cut through mucosa. Routine endoscopy of the gut or urinary tract does not qualify, even in the highest-risk patient.' },
        { type: 'truefalse', q: 'A patient with a prosthetic valve needs antibiotic prophylaxis before a colonoscopy.', a: false,
          why: 'Gastrointestinal and genitourinary procedures were removed from the prophylaxis list because the bacteremia they cause rarely leads to endocarditis. The exception is an active infection at the site, which is treated on its own merits.' },
        { type: 'recall', q: 'First-line prophylaxis regimen before a dental procedure?', a: 'Amoxicillin 2 g, 30–60 minutes before',
          why: 'A single oral dose given shortly before the procedure, 50 mg/kg in children. The aim is a high blood level at the moment the bacteria enter.' },
        { type: 'mcq', q: 'A penicillin-allergic patient needs dental prophylaxis. Which drug is no longer recommended?',
          a: 'Clindamycin', distractors: ['Cephalexin', 'Azithromycin', 'Doxycycline'],
          why: 'Clindamycin was dropped because of the risk of Clostridioides difficile infection, which outweighed any benefit from a single prophylactic dose. Cephalexin is used when the penicillin reaction was not anaphylaxis; azithromycin or doxycycline otherwise.' }
      ]
    },

    {
      id: 'cv-svt',
      subject: 'Cardiology & Vascular',
      topic: 'Arrhythmia & Syncope',
      name: 'SVT & WPW',
      blurb: 'Breaking an SVT, and the one rhythm where the usual drugs can kill',
      cards: [
        { type: 'recall', q: 'First step for a stable patient with a regular narrow-complex SVT?', a: 'Vagal maneuvers',
          why: 'Most regular narrow-complex tachycardias are re-entry circuits that run through the AV node, and a surge of vagal tone can break the circuit. The modified Valsalva works best: the patient strains for 15 seconds half sitting up, then is laid flat with the legs raised to 45 degrees for another 15 seconds. Carotid sinus massage is an alternative when there is no bruit.' },
        { type: 'recall', q: 'Why does the modified Valsalva work better than the standard one?', a: 'Lying back with legs raised boosts venous return',
          why: 'The strain itself raises intrathoracic pressure, but the vagal surge comes afterward, when blood rushes back to the heart and stretches the baroreceptors. Lying the patient flat and lifting the legs at the moment of release makes that return larger, so the reflex is stronger and the conversion rate roughly doubles.' },
        { type: 'mcq', q: 'Vagal maneuvers fail in a stable SVT. What comes next?',
          a: 'Adenosine 6 mg rapid IV push', distractors: ['Amiodarone 150 mg IV', 'Synchronized cardioversion', 'Oral metoprolol'],
          why: 'Adenosine blocks the AV node for a few seconds, which is enough to interrupt a re-entry circuit. It goes in fast through a large proximal vein followed at once by a 20 mL saline flush; if the first dose fails after a minute or two, 12 mg is given. IV diltiazem, verapamil or a beta-blocker are second-line. Cardioversion is for the unstable patient.' },
        { type: 'recall', q: 'Why is adenosine pushed fast and followed immediately by a saline flush?', a: 'Its half-life is under 10 seconds',
          why: 'Red cells and endothelium take adenosine up almost as soon as it enters the blood. A slow push or a distal vein lets it be cleared before it reaches the AV node, and the dose does nothing. The flush drives the bolus into the central circulation in one piece.' },
        { type: 'recall', q: 'SVT with hypotension, chest pain or pulmonary edema. Treatment?', a: 'Synchronized cardioversion',
          why: 'An unstable patient does not get maneuvers or drugs first. Synchronized shock resets the rhythm at once; synchronization times the shock to the QRS so it does not land on the T wave and trigger ventricular fibrillation.' },
        { type: 'multi', q: 'Which ECG findings make up the WPW pattern in sinus rhythm?',
          answers: ['Short PR interval', 'Delta wave', 'Wide QRS'],
          distractors: ['Prolonged QT', 'Peaked T waves'],
          why: 'An accessory pathway, the bundle of Kent, conducts from atrium to ventricle without the AV node\'s delay. The ventricle starts depolarizing early, so the PR is under 120 ms, the first part of the QRS is slurred into a delta wave, and the whole complex widens past 120 ms.' },
        { type: 'mcq', q: 'Irregular wide-complex tachycardia in a stable patient with known WPW. Which drug?',
          a: 'IV procainamide', distractors: ['IV diltiazem', 'IV adenosine', 'IV digoxin'],
          why: 'This is atrial fibrillation conducting down the accessory pathway. Procainamide or ibutilide slow conduction in the pathway itself. Anything that blocks the AV node is contraindicated: adenosine, beta-blockers, calcium channel blockers, digoxin and amiodarone. If the patient is unstable, cardiovert.' },
        { type: 'recall', q: 'Why are AV-nodal blockers dangerous in pre-excited atrial fibrillation?', a: 'They send every impulse down the accessory pathway',
          why: 'In atrial fibrillation the atria fire several hundred times a minute. Normally the AV node filters most of that out. Block the node and the accessory pathway, which has no such filter, carries the full rate to the ventricle, and the result can be ventricular fibrillation.' },
        { type: 'recall', q: 'Definitive treatment for Wolff-Parkinson-White syndrome?', a: 'Catheter ablation of the accessory pathway',
          why: 'Destroying the pathway removes both the re-entry circuit and the risk of pre-excited atrial fibrillation. It is curative in the large majority of patients and is offered to anyone with symptoms.' },
        { type: 'truefalse', q: 'Unstable pre-excited atrial fibrillation is treated with immediate synchronized cardioversion.', a: true,
          why: 'With hypotension or ischemia there is no time for procainamide to work, and the nodal blockers are off the table. Cardioversion restores sinus rhythm regardless of which pathway was conducting.' }
      ]
    },

    {
      id: 'cv-qtc',
      subject: 'Cardiology & Vascular',
      topic: 'Arrhythmia & Syncope',
      name: 'LONG QT',
      blurb: 'The thresholds, the drugs that cause it, and treating torsades',
      cards: [
        { type: 'number', q: 'QTc above what is considered prolonged in a man?', value: 450, unit: 'ms',
          why: 'The cutoff for a woman is 460 ms. The QTc is the QT interval corrected for heart rate, since the raw QT shortens as the rate rises.' },
        { type: 'number', q: 'QTc at or above what carries a high risk of torsades de pointes?', value: 500, unit: 'ms',
          why: 'Risk climbs steeply past 500 ms. At that point an offending drug is stopped rather than reduced, and electrolytes are corrected.' },
        { type: 'mcq', q: 'Palpitations and a QTc of 500 ms two weeks after escitalopram was raised from 10 to 20 mg. Next step?',
          a: 'Stop the escitalopram', distractors: ['Reduce it to 15 mg', 'Add metoprolol', 'Stop the cetirizine'],
          why: 'Among the SSRIs, citalopram and escitalopram carry the highest risk of QT prolongation and it rises with the dose. At a QTc of 500 ms the drug is stopped and the ECG repeated after it has washed out. Cetirizine and intranasal fluticasone do not prolong the QT and are not the cause.' },
        { type: 'recall', q: 'Which opioid maintenance therapy needs baseline and follow-up ECGs for the QTc?', a: 'Methadone',
          why: 'Methadone blocks the cardiac potassium channel that repolarizes the ventricle, and the effect grows with dose. Buprenorphine does not share the problem to the same degree.' },
        { type: 'multi', q: 'Which drugs commonly prolong the QTc?',
          answers: ['Azithromycin', 'Ondansetron', 'Haloperidol', 'Sotalol'],
          distractors: ['Cetirizine', 'Intranasal fluticasone'],
          why: 'The usual offenders are macrolides and fluoroquinolones, ondansetron, antipsychotics such as haloperidol and ziprasidone, tricyclics, and the class IA and III antiarrhythmics: sotalol, dofetilide, quinidine. The risk compounds when two of them are combined or when potassium or magnesium is low.' },
        { type: 'recall', q: 'First-line drug for torsades de pointes in a patient with a pulse?', a: 'IV magnesium sulfate 2 g',
          why: 'Magnesium is given as a bolus even when the serum level is normal, and potassium is replaced to above 4.0. Any QT-prolonging drug is stopped. If the patient loses the pulse or becomes unstable, defibrillate.' },
        { type: 'recall', q: 'Why is magnesium given for torsades even when the serum level is normal?', a: 'It suppresses the triggered beats that start it',
          why: 'Torsades is set off by early afterdepolarizations, small extra depolarizations during a prolonged repolarization. Magnesium stabilizes the myocyte membrane and damps those down independently of how much is in the blood, so a normal level does not mean it will not help.' },
        { type: 'recall', q: 'Torsades de pointes with no pulse. Treatment?', a: 'Unsynchronized defibrillation',
          why: 'The rhythm is polymorphic, so there is no consistent QRS for the machine to synchronize to. It is treated like ventricular fibrillation.' }
      ]
    },

    {
      id: 'cv-amio',
      subject: 'Cardiology & Vascular',
      topic: 'Arrhythmia & Syncope',
      name: 'AMIODARONE',
      blurb: 'What it damages, what to check, and how often',
      cards: [
        { type: 'multi', q: 'Which tests are done before starting amiodarone?',
          answers: ['Chest x-ray', 'PFTs with DLCO', 'TSH', 'AST and ALT'],
          distractors: ['Serum digoxin level', 'HbA1c'],
          why: 'Each baseline covers an organ the drug damages: lungs, thyroid and liver. An ECG is recorded too. The lung tests matter most, because a later fall from baseline is how toxicity is caught.' },
        { type: 'recall', q: 'Most dangerous complication of amiodarone?', a: 'Pulmonary fibrosis',
          why: 'Interstitial pneumonitis and fibrosis occur in 1 to 5% of patients and can be fatal. The chest x-ray is repeated every year, and PFTs with DLCO are repeated as soon as unexplained cough or breathlessness appears.' },
        { type: 'number', q: 'A fall in DLCO of what percentage suggests amiodarone lung toxicity?', value: 20, unit: '%',
          why: 'The diffusing capacity drops before the x-ray changes, which is why a baseline value is needed to compare against.' },
        { type: 'recall', q: 'Why can amiodarone cause both an underactive and an overactive thyroid?', a: 'It carries a large load of iodine',
          why: 'Each tablet delivers many times the daily iodine requirement. In some glands the excess shuts hormone production down, the Wolff-Chaikoff effect, and the patient becomes hypothyroid. In others, particularly nodular glands, the iodine fuels overproduction, or the drug inflames the gland and hormone leaks out, and the patient becomes hyperthyroid.' },
        { type: 'number', q: 'How often is TSH checked on amiodarone?', value: 6, unit: 'months',
          why: 'Liver enzymes are checked on the same schedule, and the drug is stopped if they rise past two to three times the upper limit of normal.' },
        { type: 'truefalse', q: 'Corneal microdeposits on amiodarone require stopping the drug.', a: false,
          why: 'More than 90% of patients develop them, they rarely affect vision, and they are not a reason to stop. The eye finding that matters is optic neuritis: a fall in visual acuity needs an urgent ophthalmology assessment.' },
        { type: 'recall', q: 'A patient on amiodarone reports falling visual acuity. Likely cause?', a: 'Optic neuritis',
          why: 'It is rare but can cause permanent loss, so it is examined urgently with a slit lamp and fundoscopy. The far more common corneal deposits do not reduce acuity, which is the distinction to make.' },
        { type: 'recall', q: 'Slate-blue skin discoloration in a long-term cardiac patient. Likely drug?', a: 'Amiodarone',
          why: 'The drug deposits in the skin and reacts with sunlight, producing photosensitivity and a blue-grey color over exposed areas. Peripheral neuropathy and ataxia are the other long-term effects of the same tissue accumulation.' },
        { type: 'recall', q: 'Why do amiodarone\'s effects persist for weeks after it is stopped?', a: 'A very long half-life in fat and tissue',
          why: 'The drug is lipophilic and stores in fat, lung, liver and skin, then leaks back out slowly. The half-life runs to weeks or months, so toxicity can continue to develop after the last dose and interactions with other drugs outlast the prescription.' }
      ]
    },

    {
      id: 'cv-af',
      subject: 'Cardiology & Vascular',
      topic: 'Arrhythmia & Syncope',
      name: 'AF ANTICOAGULATION',
      blurb: 'Who is anticoagulated, with what, when after a stroke, and around surgery',
      cards: [
        { type: 'multi', q: 'Which CHA₂DS₂-VASc items score two points?',
          answers: ['Age 75 or older', 'Prior stroke or TIA'],
          distractors: ['Hypertension', 'Diabetes', 'Female sex', 'Heart failure'],
          why: 'Everything else is one point: heart failure, hypertension, diabetes, vascular disease, age 65 to 74, and female sex. Age 75 and a previous stroke each double because they carry the most risk.' },
        { type: 'number', q: 'CHA₂DS₂-VASc score at which anticoagulation is recommended for a man?', value: 2,
          why: 'For a woman it is 3, because her sex has already added a point. A DOAC is preferred over warfarin in every patient without a mechanical valve or significant mitral stenosis.' },
        { type: 'recall', q: 'Why does a woman need one more CHA₂DS₂-VASc point than a man before anticoagulation?', a: 'Female sex already counts as a point',
          why: 'Sex is a risk modifier rather than a risk factor on its own; a woman with no other risk scores 1 but does not need anticoagulation. Raising the threshold by one keeps the decision based on the real risk factors.' },
        { type: 'multi', q: 'Which AF patients need warfarin rather than a DOAC?',
          answers: ['Mechanical heart valve', 'Moderate–severe mitral stenosis'],
          distractors: ['Prior stroke', 'Age over 80', 'Bioprosthetic valve'],
          why: 'These two define valvular atrial fibrillation. DOACs caused more thrombosis and bleeding than warfarin in mechanical valve trials and were never tested in rheumatic mitral stenosis. Everyone else, including patients with a bioprosthetic valve, can take a DOAC.' },
        { type: 'number', q: 'After an AF-related TIA or small stroke, a DOAC can safely be started within how many days?', value: 4, unit: 'days',
          why: 'Recent trials found early starting safe and effective for TIA and small-to-moderate infarcts. The window runs to 14 days for a large cortical infarct, where the risk of bleeding into the dead tissue is higher.' },
        { type: 'truefalse', q: 'After an AF-related stroke, aspirin is added to the DOAC for extra protection.', a: false,
          why: 'Adding an antiplatelet raises major bleeding without reducing recurrent stroke. The DOAC is given alone; the exception is a recent coronary stent, which needs its own antiplatelet.' },
        { type: 'mcq', q: 'AF on warfarin, no stroke in the past year, elective laparoscopic cholecystectomy next week. Plan?',
          a: 'Stop warfarin, no bridging', distractors: ['Bridge with enoxaparin', 'Bridge with IV heparin', 'Continue warfarin'],
          why: 'In the BRIDGE trial, bridging patients with atrial fibrillation tripled major bleeding, 3.2% against 1.3%, and prevented no strokes or emboli. Warfarin is stopped five days before and restarted 12 to 24 hours after surgery. Bridging is kept for patients at very high thrombotic risk.' },
        { type: 'number', q: 'Warfarin is stopped how many days before elective surgery?', value: 5, unit: 'days',
          why: 'That is how long the INR takes to fall into a safe range for surgery. It is restarted 12 to 24 hours afterward once hemostasis is secure.' },
        { type: 'multi', q: 'Which patients on warfarin do need bridging around surgery?',
          answers: ['Any mechanical mitral valve', 'Mechanical AVR with prior stroke', 'Stroke or VTE within 3 months'],
          distractors: ['AF with CHA₂DS₂-VASc of 3', 'Bioprosthetic mitral valve'],
          why: 'Bridging is for the patients most likely to clot in the days off warfarin: a mechanical mitral valve, a mechanical aortic valve with an extra risk factor such as atrial fibrillation, prior stroke or VTE, poor LV function or an older valve design, and anyone with a recent stroke or venous thrombosis.' },
        { type: 'mcq', q: 'Mechanical aortic valve, prior stroke, eGFR 25, surgery planned. Bridge with what?',
          a: 'IV unfractionated heparin', distractors: ['Enoxaparin 1 mg/kg twice daily', 'Apixaban until the day before', 'No bridging'],
          why: 'This patient needs a bridge, but enoxaparin is cleared by the kidney and accumulates once the eGFR is under 30. Warfarin is held five days, an unfractionated heparin infusion is started in hospital once the INR drops below 2, and the heparin is held 4 to 6 hours before the incision. DOACs are not used with mechanical valves at all.' },
        { type: 'recall', q: 'Why is enoxaparin avoided for bridging when the eGFR is under 30?', a: 'It is cleared by the kidney and accumulates',
          why: 'Low molecular weight heparin leaves the body through the kidney and its effect cannot be measured with a routine test. In renal failure the drug builds up and the patient bleeds. Unfractionated heparin is cleared independently of the kidney, can be monitored with the aPTT, and switches off within hours.' }
      ]
    },

    {
      id: 'cv-syncope',
      subject: 'Cardiology & Vascular',
      topic: 'Arrhythmia & Syncope',
      name: 'SYNCOPE',
      blurb: 'The three-part workup and the tests that add nothing',
      cards: [
        { type: 'multi', q: 'Which three things make up the initial evaluation of every patient with syncope?',
          answers: ['History', 'Exam with orthostatic vitals', '12-lead ECG'],
          distractors: ['Head CT', 'Carotid duplex', 'EEG'],
          why: 'Between them these three identify the cause in most patients and pick out the dangerous ones: a story of exertional collapse, a murmur, a postural drop, or a conduction abnormality on the ECG. Everything further is ordered only when one of them points somewhere.' },
        { type: 'truefalse', q: 'Syncope with a normal neurologic exam warrants a head CT.', a: false,
          why: 'With no focal deficit, no witnessed seizure and no confusion afterward, brain imaging finds a cause in under 1% of patients. The same is true of carotid ultrasound and EEG, and all three are on the Choosing Wisely list for uncomplicated syncope.' },
        { type: 'recall', q: 'Why is a carotid duplex not useful in the workup of syncope?', a: 'Carotid stenosis causes focal deficits, not syncope',
          why: 'Narrowing of one carotid artery produces a transient ischemic attack in that hemisphere, with weakness or speech loss. Losing consciousness needs the whole brain to lose perfusion at once, which comes from the heart or the blood pressure, not from one neck vessel.' },
        { type: 'recall', q: 'When does syncope call for an exercise stress test?', a: 'When it happened during exertion',
          why: 'Collapse during exercise points to an obstruction such as aortic stenosis or hypertrophic cardiomyopathy, or to an exercise-induced arrhythmia. Testing under supervision reproduces the conditions safely.' },
        { type: 'recall', q: 'When does syncope call for an echocardiogram?', a: 'When structural heart disease is suspected',
          why: 'A murmur, a history of heart disease or an abnormal ECG are the triggers. The echo looks for aortic stenosis, cardiomyopathy and poor ventricular function, the structural causes most likely to recur and to kill.' }
      ]
    },

  ];

  global.Decks = { BUILTIN: BUILTIN };
})(window);
