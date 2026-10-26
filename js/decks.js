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
        { type: 'number', q: 'Peak flow, as a percent of personal best, above which a patient is in the green zone?', value: 80, unit: '%',
          why: 'Green is 80 to 100 percent of personal best, yellow 50 to 80 and red under 50. The zones drive the written action plan: yellow means a short-acting bronchodilator and a review of control, red means urgent care.' }
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
        { type: 'number', q: 'Chewed aspirin dose for a suspected acute MI?', low: 162, high: 325, unit: 'mg',
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
        { type: 'recall', q: 'Sudden severe mitral regurgitation three to five days after an inferior MI. Likely cause?', a: 'Papillary muscle rupture',
          why: 'The posteromedial papillary muscle dies with the inferior wall and tears a few days later, when the infarcted tissue is at its weakest. The patient goes from stable to pulmonary edema and shock within minutes, with a new holosystolic murmur at the apex.' },
        { type: 'recall', q: 'Why does papillary muscle rupture cause pulmonary edema within minutes?', a: 'The leak hits a small, stiff left atrium',
          why: 'In chronic mitral regurgitation the atrium has had years to enlarge and can absorb the backward jet. After a rupture the atrium is normal-sized and non-compliant, so the whole regurgitant volume raises the pressure at once and is passed straight back into the pulmonary veins and lungs.' },
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
        { type: 'recall', q: 'Why does mitral regurgitation develop gradually in the months after an MI?', a: 'The dilating ventricle tethers the leaflets',
          why: 'As the ventricle remodels and enlarges, the papillary muscles are pulled outward and hold the mitral leaflets apart so they no longer meet. The valve itself is normal; the leak comes from the shape of the ventricle, which is why it is called functional or secondary regurgitation. The left atrium enlarges alongside, so it presents as slowly worsening exertional dyspnea and an apical murmur to the axilla rather than as an emergency.' },
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
        { type: 'recall', q: 'Why is cilostazol contraindicated in heart failure of any severity?', a: 'It is a phosphodiesterase-3 inhibitor',
          why: 'Oral phosphodiesterase-3 inhibitors such as milrinone increased mortality in heart failure trials, so cilostazol carries a boxed warning for any degree of heart failure, not only severe disease. It is otherwise the main drug for claudication symptoms, so heart failure has to be excluded before it is prescribed.' },
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

    {
      id: 'cv-htn-start',
      subject: 'Cardiology & Vascular',
      topic: 'Hypertension',
      name: 'STARTING TREATMENT',
      blurb: 'First-line classes, when to start with two, and why race no longer picks the drug',
      cards: [
        { type: 'multi', q: 'Which drug classes are first-line for hypertension?',
          answers: ['Thiazide diuretic', 'Dihydropyridine CCB', 'ACE inhibitor', 'ARB'],
          distractors: ['Beta-blocker', 'Clonidine'],
          why: 'These four lower blood pressure and reduce strokes and heart attacks in trials. Beta-blockers are kept for patients with a separate reason to take one, such as angina or heart failure, and clonidine is a late add-on because of rebound hypertension and sedation.' },
        { type: 'number', q: 'Start two drugs at once when the systolic pressure is at or above what?', value: 160, unit: 'mm Hg',
          why: 'Stage 2 hypertension is 160/100 or higher, or more than 20/10 above the patient\'s goal. At that level a single drug almost never reaches target, so two first-line agents from different classes are started together, ideally as one combination pill.' },
        { type: 'mcq', q: 'A new patient has a BP of 168/104 on two visits. How do you start treatment?',
          a: 'Amlodipine plus an ACE inhibitor', distractors: ['Lisinopril alone, titrate up', 'Hydrochlorothiazide alone', 'Metoprolol alone'],
          why: 'Stage 2 hypertension gets two agents from the start. A calcium channel blocker or a thiazide paired with an ACE inhibitor or ARB is the usual combination, and a single pill containing both improves the chance the patient keeps taking it.' },
        { type: 'recall', q: 'Why is stage 2 hypertension started on two drugs rather than one titrated up?', a: 'One drug rarely brings it to goal',
          why: 'Most patients this far above target need at least two drugs eventually. Starting with both reaches control sooner, with fewer visits and smaller doses of each, which means fewer side effects than pushing one drug to its maximum.' },
        { type: 'truefalse', q: 'A Black patient with stage 2 hypertension should be started on a calcium channel blocker alone.', a: false,
          why: 'Older guidance picked monotherapy by race on the idea that renin levels differed between groups. Current guidelines treat race as a social category rather than a biological one and start everyone with stage 2 hypertension on two drugs. A CCB or thiazide combined with an ACE inhibitor or ARB covers the whole range of renin profiles and protects the kidney.' },
        { type: 'recall', q: 'Why does pairing a CCB or thiazide with an ACE inhibitor work whatever the patient\'s renin level?', a: 'The pair covers low- and high-renin disease',
          why: 'Hypertension driven by volume and salt responds to the diuretic or the vasodilator, and hypertension driven by the renin-angiotensin system responds to the ACE inhibitor or ARB. Giving one of each means the combination works without having to guess which kind the patient has.' }
      ]
    },

    {
      id: 'cv-htn-emerg',
      subject: 'Cardiology & Vascular',
      topic: 'Hypertension',
      name: 'URGENCY & EMERGENCY',
      blurb: 'Severe pressure without damage, with damage, and the dissection exception',
      cards: [
        { type: 'mcq', q: 'BP 196/114 in clinic, no symptoms, normal exam, ran out of pills a month ago. What do you do?',
          a: 'Restart the pills, see in a week', distractors: ['Oral clonidine now', 'Send to the emergency department', 'Stat troponin and ECG'],
          why: 'Severe hypertension without acute organ damage is treated by restarting or stepping up the oral regimen and seeing the patient again within a week. There is no benefit from lowering it quickly in clinic, no role for a loading dose of clonidine or short-acting nifedipine, and no reason for emergency labs in someone without symptoms.' },
        { type: 'recall', q: 'Why isn\'t severe asymptomatic hypertension brought down quickly in clinic?', a: 'Rapid lowering causes organ hypoperfusion',
          why: 'In a patient whose pressure has been high for months, the brain, heart and kidneys have reset their autoregulation to that higher range. A sudden drop takes the pressure below what those organs now need, and strokes and heart attacks have followed. Oral drugs over days bring it down at a pace the organs can follow.' },
        { type: 'number', q: 'After severe asymptomatic hypertension in clinic, follow-up is arranged within how long?', values: [1, 7], join: '–', unit: 'days',
          why: 'Soon enough to confirm the patient is taking the medicine and the pressure is coming down, without the urgency of an emergency.' },
        { type: 'multi', q: 'Which findings turn severe hypertension into a hypertensive emergency?',
          answers: ['Encephalopathy', 'Pulmonary edema', 'Acute kidney injury', 'Acute MI'],
          distractors: ['Headache alone', 'Nosebleed'],
          why: 'An emergency is defined by acute damage to a target organ: the brain (encephalopathy, hemorrhage, stroke), the heart (infarction, unstable angina, pulmonary edema), the kidney, or eclampsia in pregnancy. A headache or a nosebleed without those is still an urgency. Emergencies go to intensive care for a titratable IV drug such as nicardipine, clevidipine, labetalol or nitroprusside.' },
        { type: 'number', q: 'In most hypertensive emergencies, lower the mean arterial pressure by no more than what in the first hour?', values: [20, 25], join: '–', unit: '%',
          why: 'Then toward 160/100 over the next two to six hours. The limit exists for the same reason as in urgency: organs adapted to high pressure cannot tolerate a sudden fall.' },
        { type: 'mcq', q: 'Tearing chest pain radiating to the back, BP 190/110, widened mediastinum. First drug?',
          a: 'IV esmolol', distractors: ['IV nitroprusside', 'IV hydralazine', 'IV nicardipine'],
          why: 'Aortic dissection is the one emergency where the pressure comes down fast, and the beta-blocker goes first. Esmolol or labetalol brings the heart rate under 60 and the systolic pressure to 100 to 120 within about 20 minutes. A vasodilator is added only once the rate is controlled.' },
        { type: 'recall', q: 'Why is the beta-blocker given before any vasodilator in aortic dissection?', a: 'A vasodilator alone causes reflex tachycardia',
          why: 'What extends a dissection is the force of each heartbeat against the torn wall, the rate of rise of pressure. A vasodilator given on its own drops the pressure and the heart speeds up to compensate, which increases that force and can propagate the tear. Blocking the rate first prevents the reflex.' },
        { type: 'number', q: 'Target systolic blood pressure in acute aortic dissection?', values: [100, 120], join: '–', unit: 'mm Hg',
          why: 'Reached within about 20 minutes, which is far faster than any other hypertensive emergency allows.' },
        { type: 'number', q: 'Heart rate is brought below what in acute aortic dissection?', value: 60, unit: 'bpm',
          why: 'The rate target comes first and the pressure target second, both with the same aim of reducing the shear stress on the aortic wall.' }
      ]
    },

    {
      id: 'cv-htn-2ry',
      subject: 'Cardiology & Vascular',
      topic: 'Hypertension',
      name: 'SECONDARY CAUSES',
      blurb: 'The clues that point to a cause, and the first test for each',
      cards: [
        { type: 'match', q: 'Match the clue to the cause of secondary hypertension', pairs: [
          { left: 'Low K, resistant HTN', right: 'Primary aldosteronism' },
          { left: 'Spells, labile BP', right: 'Pheochromocytoma' },
          { left: 'Rib notching on CXR', right: 'Coarctation' },
          { left: 'Young woman, sudden HTN', right: 'Fibromuscular dysplasia' }
        ] },
        { type: 'recall', q: 'Screening test for primary aldosteronism?', a: 'Aldosterone-to-renin ratio',
          why: 'A morning blood sample. Excess aldosterone from the adrenal suppresses renin, so the ratio is high. Spironolactone and eplerenone are stopped for at least four weeks beforehand because they distort the result.' },
        { type: 'truefalse', q: 'Most patients with primary aldosteronism are hypokalemic.', a: false,
          why: 'More than half have a normal potassium. The classic picture of resistant hypertension with a low potassium is real but is the minority, so the test is ordered for resistant hypertension, an adrenal mass or hypokalemia on a diuretic, not only for a low potassium.' },
        { type: 'recall', q: 'Why is spironolactone held for four weeks before an aldosterone-to-renin ratio?', a: 'It raises renin and masks the ratio',
          why: 'Blocking the aldosterone receptor makes the body behave as if aldosterone were low, so renin rises. A high renin pulls the ratio back toward normal and the diagnosis is missed. Four weeks lets the drug and its effect wash out.' },
        { type: 'recall', q: 'Screening test for pheochromocytoma?', a: 'Plasma free metanephrines',
          why: 'Metanephrines are the breakdown products of the catecholamines the tumor releases, and they are produced steadily even between spells, which makes them more sensitive than catecholamines themselves. A 24-hour urine for fractionated metanephrines is the alternative.' },
        { type: 'mcq', q: 'Creatinine rises 40% after starting lisinopril in a 68-year-old smoker with an abdominal bruit. Likely cause?',
          a: 'Renal artery stenosis', distractors: ['Primary aldosteronism', 'Coarctation', 'ACE inhibitor allergy'],
          why: 'A rise of more than 30% after an ACE inhibitor or ARB, in an older patient with vascular disease and a bruit, points to atherosclerotic narrowing of the renal arteries. Recurrent flash pulmonary edema is another clue. It is treated mainly with medication; stenting rarely helps.' },
        { type: 'recall', q: 'Why does an ACE inhibitor drop the GFR sharply in bilateral renal artery stenosis?', a: 'Angiotensin II was holding the filtration pressure',
          why: 'With the arteries narrowed, the kidney maintains its filtration pressure by constricting the efferent arteriole, the vessel leaving the glomerulus, and angiotensin II is what does that. Block angiotensin and the efferent arteriole relaxes, the pressure inside the glomerulus falls, and filtration drops.' },
        { type: 'recall', q: 'Sudden severe hypertension in a 26-year-old woman, a "string of beads" on angiography. Treatment?', a: 'Angioplasty without a stent',
          why: 'This is fibromuscular dysplasia, a non-atherosclerotic narrowing of the renal artery seen mostly in young women. Unlike atherosclerotic stenosis, it responds well to balloon angioplasty, and a stent is not usually needed.' },
        { type: 'recall', q: 'Hypertension in the arms, lower pressure in the legs, and a brachial-femoral pulse delay. Diagnosis?', a: 'Coarctation of the aorta',
          why: 'The narrowing sits past the vessels to the arms, so the arms see high pressure and the legs see low. Blood finds its way around the narrowing through enlarged intercostal arteries, which erode the undersides of the ribs and produce the notching seen on a chest film.' }
      ]
    },

    {
      id: 'cv-ortho',
      subject: 'Cardiology & Vascular',
      topic: 'Hypertension',
      name: 'ORTHOSTASIS',
      blurb: 'The definition, the heart rate that tells you why, and the treatment',
      cards: [
        { type: 'number', q: 'Systolic drop within three minutes of standing that defines orthostatic hypotension?', value: 20, unit: 'mm Hg',
          why: 'Or a diastolic drop of 10 mm Hg. The fall has to be sustained, measured after one and three minutes upright or on a tilt table.' },
        { type: 'recall', q: 'What separates neurogenic from non-neurogenic orthostatic hypotension at the bedside?', a: 'The heart rate response on standing',
          why: 'When the pressure falls on standing, an intact baroreflex speeds the heart up to compensate. A rise of 15 beats per minute or more means the reflex is working and the problem is volume or a drug. A rise under 15 means the autonomic nervous system itself has failed.' },
        { type: 'number', q: 'How much must the heart rate rise on standing to call orthostatic hypotension non-neurogenic?', value: 15, unit: 'bpm',
          why: 'Another way to express it is the ratio of heart rate change to systolic change: above 0.5 beats per mm Hg is non-neurogenic, below it is neurogenic.' },
        { type: 'mcq', q: 'Lost 30 lb on semaglutide. Standing BP 110/70 → 85/55, HR 75 → 90. Takes lisinopril. Best step?',
          a: 'Stop or reduce the lisinopril', distractors: ['Start midodrine', 'Start fludrocortisone', 'Tilt-table test'],
          why: 'The heart rate rose 15 beats, so the baroreflex is intact and this is not autonomic failure. He has lost weight and volume, and the dose of blood pressure medicine that suited him before is now too much. Reducing or stopping it is the treatment; a pressor would be treating the wrong problem.' },
        { type: 'recall', q: 'Why does a brisk heart rate rise on standing point away from autonomic failure?', a: 'The baroreflex is still working',
          why: 'The rise is the sympathetic nervous system responding to a drop in pressure. In autonomic failure that response is blunted or absent, so the pressure falls and the heart rate barely moves. A working reflex means the nerves are fine and the cause is elsewhere: dehydration, blood loss, or a medication.' },
        { type: 'multi', q: 'Which conditions cause neurogenic orthostatic hypotension?',
          answers: ['Parkinson disease', 'Multiple system atrophy', 'Diabetic autonomic neuropathy'],
          distractors: ['Dehydration', 'Weight loss'],
          why: 'Each damages the sympathetic nerves that constrict blood vessels on standing. Dehydration and weight loss cause orthostatic hypotension through volume, with a normal reflex and a brisk heart rate rise.' },
        { type: 'recall', q: 'First-line drug for neurogenic orthostatic hypotension once conservative measures have failed?', a: 'Midodrine or droxidopa',
          why: 'Midodrine is an alpha-1 agonist that constricts the vessels the failed nerves no longer reach; droxidopa is converted to norepinephrine. They come after the simple measures: a bolus of water before standing, extra salt, an abdominal binder, waist-high compression stockings and sleeping with the head of the bed raised.' },
        { type: 'recall', q: 'Why is fludrocortisone second-line for neurogenic orthostatic hypotension?', a: 'It raises the pressure lying down as well',
          why: 'It works by making the kidney retain salt and water, so the pressure goes up in every position. Supine hypertension damages the heart and kidneys over time, and the extra volume brings edema and heart failure in older patients. It also wastes potassium. Midodrine acts only while the patient is upright and active, which is why it comes first; atomoxetine is used only as an add-on.' }
      ]
    },

    {
      id: 'cv-preg',
      subject: 'Cardiology & Vascular',
      topic: 'Hypertension',
      name: 'PREGNANCY',
      blurb: 'What the heart and circulation do in a normal pregnancy',
      cards: [
        { type: 'number', q: 'Cardiac output rises by roughly how much in a normal pregnancy?', values: [30, 50], join: '–', unit: '%',
          why: 'The rise begins early in the first trimester and peaks between 16 and 28 weeks. A woman with a fixed obstruction such as mitral stenosis can decompensate as the output climbs.' },
        { type: 'multi', q: 'Which changes drive the rise in cardiac output in pregnancy?',
          answers: ['Plasma volume up 40–50%', 'Lower systemic resistance', 'Heart rate up 10–20 bpm'],
          distractors: ['Higher blood pressure', 'Rising hematocrit'],
          why: 'More volume returning to the heart raises the stroke volume, progesterone and nitric oxide relax the arteries so the heart pumps against less resistance, and the resting rate climbs. The pressure falls rather than rises, and the hematocrit drops because the plasma expands faster than the red cells.' },
        { type: 'truefalse', q: 'Blood pressure normally rises through the second trimester of pregnancy.', a: false,
          why: 'It falls, reaching its lowest point in the second trimester as the vessels dilate, then drifts back toward the pre-pregnancy level by term. A pressure that is rising in the second trimester is not normal.' },
        { type: 'recall', q: 'Why does a healthy pregnant woman develop a mild anemia?', a: 'Plasma expands more than red cell mass',
          why: 'Plasma volume grows by 40 to 50% while red cell mass grows by 20 to 30%, so the same cells are diluted in more fluid. The hemoglobin falls even though the total amount of red cells has gone up. It is physiologic and needs no treatment on its own.' }
      ]
    },

    {
      id: 'cv-statins',
      subject: 'Cardiology & Vascular',
      topic: 'Prevention',
      name: 'STATINS',
      blurb: 'Who gets one, at what intensity, under which guideline',
      cards: [
        { type: 'recall', q: 'Statin intensity for a patient with established atherosclerotic disease?', a: 'High-intensity',
          why: 'Anyone with a prior MI or acute coronary syndrome, stable angina, revascularization, ischemic stroke or TIA, or peripheral artery disease is on secondary prevention. The target is an LDL reduction of at least 50% and an LDL under 70, or under 55 at very high risk; ezetimibe and then a PCSK9 inhibitor are added if the statin alone does not get there.' },
        { type: 'number', q: 'LDL at or above which an adult gets a high-intensity statin without a risk calculation?', value: 190, unit: 'mg/dL',
          why: 'This applies at any age from 20. The usual ten-year risk calculator is skipped because it badly underestimates the lifetime risk of someone who has carried an LDL that high since birth.' },
        { type: 'recall', q: 'Why does an LDL of 190 skip the risk calculator?', a: 'It usually means familial hypercholesterolemia',
          why: 'An LDL that high is rarely diet alone; most of these patients have a genetic defect in LDL clearance and have been exposed to it for decades. The calculator weighs age heavily, so a 30-year-old with an LDL of 200 scores low even though the arteries have been under attack the whole time.' },
        { type: 'mcq', q: 'A 45-year-old with diabetes, no other risk factors, LDL 130. Statin intensity?',
          a: 'Moderate-intensity', distractors: ['High-intensity', 'Low-intensity', 'None, lifestyle only'],
          why: 'Diabetes between 40 and 75 earns at least a moderate-intensity statin regardless of the calculated risk. It becomes high-intensity when the patient is 50 or older or has additional risk factors such as smoking or hypertension.' },
        { type: 'mcq', q: 'A 62-year-old smoker with diabetes and hypertension. Statin intensity?',
          a: 'High-intensity', distractors: ['Moderate-intensity', 'Low-intensity', 'Decide after a calcium score'],
          why: 'Diabetes with multiple risk factors, or diabetes at 50 to 75, gets high-intensity therapy aimed at an LDL reduction of 50% or more and an LDL under 70. A calcium score is for the uncertain middle, not for someone this clearly at risk.' },
        { type: 'multi', q: 'Which count as cardiovascular risk factors in the USPSTF statin recommendation?',
          answers: ['Dyslipidemia', 'Diabetes', 'Hypertension', 'Smoking'],
          distractors: ['Obesity', 'Family history'],
          why: 'The USPSTF recommends a statin for adults 40 to 75 with at least one of these four and a ten-year risk of 10% or more. Between 7.5 and 10% it is a shared decision. Obesity and family history raise risk but are not on the list the recommendation uses.' },
        { type: 'number', q: 'USPSTF: ten-year cardiovascular risk at or above which a statin is recommended for primary prevention?', value: 10, unit: '%',
          why: 'Together with at least one risk factor, in adults aged 40 to 75. That is a grade B. From 7.5 to 10% the recommendation drops to a grade C and the decision is shared with the patient.' },
        { type: 'number', q: 'ACC/AHA: ten-year ASCVD risk at or above which a high-intensity statin is favored in primary prevention?', value: 20, unit: '%',
          why: 'The ACC/AHA scheme starts a moderate-intensity statin at 7.5% and steps up to high-intensity at 20%. It is a different threshold from the USPSTF\'s, and the exam expects you to know which guideline a question is using.' },
        { type: 'bucket', q: 'High- or moderate-intensity statin?', bins: ['High', 'Moderate'], items: [
          { label: 'Atorvastatin 40–80 mg', bin: 'High' },
          { label: 'Rosuvastatin 20–40 mg', bin: 'High' },
          { label: 'Atorvastatin 10–20 mg', bin: 'Moderate' },
          { label: 'Rosuvastatin 5–10 mg', bin: 'Moderate' },
          { label: 'Simvastatin 20–40 mg', bin: 'Moderate' },
          { label: 'Pravastatin 40–80 mg', bin: 'Moderate' }
        ], why: 'Only atorvastatin and rosuvastatin reach high intensity, and only at their upper doses. The intensity is defined by the LDL reduction it produces: 50% or more for high, 30 to 49% for moderate.' },
        { type: 'number', q: 'A high-intensity statin lowers the LDL by at least how much?', value: 50, unit: '%',
          why: 'A moderate-intensity statin lowers it by 30 to 49%. The percentage, not the absolute LDL, is how the intensities are defined, which is why a patient\'s response is judged against their own baseline.' },
        { type: 'recall', q: 'USPSTF advice for a 35-year-old with hypertension and obesity who does not qualify for a statin?', a: 'Intensive behavioral counseling',
          why: 'Adults under 40 with cardiovascular risk factors but below the statin thresholds are referred to structured programs on diet and physical activity. It is a grade B recommendation, and it is the answer when a young patient\'s risk factors are listed and no drug fits.' }
      ]
    },

    {
      id: 'cv-cac',
      subject: 'Cardiology & Vascular',
      topic: 'Prevention',
      name: 'CAC & ASPIRIN',
      blurb: 'When a calcium score settles the statin question, and who should not start aspirin',
      cards: [
        { type: 'recall', q: 'When is a coronary artery calcium score worth ordering?', a: 'Borderline or intermediate risk, statin undecided',
          why: 'In adults 40 to 75 with a ten-year risk of 5 to 19.9% where the patient or clinician is unsure about a statin. It is not for patients who already clearly qualify, and not for those with established disease.' },
        { type: 'recall', q: 'What does a coronary calcium score of zero allow in an intermediate-risk patient?', a: 'Deferring the statin',
          why: 'A score of zero means no calcified plaque, and the event rate over the next several years is low enough that a statin can wait, with the score repeated in about five years. The exceptions are diabetes, active smoking and a strong family history of early coronary disease, where a statin is still started.' },
        { type: 'multi', q: 'Select the patients who still start a statin despite a calcium score of zero.',
          answers: ['Diabetes', 'Active smoking', 'Family history of early CAD'],
          distractors: ['Age over 60', 'Hypertension'],
          why: 'In these three the risk comes from processes a calcium score does not capture well, and events occur despite a zero score often enough that the statin is given anyway.' },
        { type: 'number', q: 'Calcium score at or above which a statin is clearly indicated?', value: 100, unit: 'Agatston',
          why: 'A score of 100 or more, or at or above the 75th percentile for age and sex, settles the question in favor of a statin. A score of 1 to 99 favors one, especially from age 55 on.' },
        { type: 'recall', q: 'Why does a calcium score of zero carry so much weight?', a: 'Very few events happen without any calcified plaque',
          why: 'Calcium is a late stage of atherosclerosis, so its complete absence in a middle-aged adult means the disease has not progressed far. In the cohorts that were followed, people with a zero score had event rates low enough that a statin would prevent very few, which is why it is allowed to override an intermediate calculated risk.' },
        { type: 'mcq', q: 'A 64-year-old with a 12% ten-year risk asks about starting daily aspirin. USPSTF advice?',
          a: 'Do not start aspirin', distractors: ['81 mg daily', '325 mg daily', 'Only if the LDL is high'],
          why: 'From age 60 the USPSTF recommends against starting aspirin for primary prevention, a grade D, because the bleeding it causes outweighs the heart attacks it prevents. The question is about starting; someone already taking it for a prior event is a different decision.' },
        { type: 'number', q: 'Age at which the USPSTF recommends against starting aspirin for primary prevention?', value: 60, unit: 'years',
          why: 'For adults 40 to 59 with a ten-year risk of 10% or more and no bleeding risk, starting low-dose aspirin is an individual decision, a grade C. The benefit is small either way.' },
        { type: 'recall', q: 'Why did the USPSTF stop recommending aspirin for primary prevention at 60 and older?', a: 'Bleeding outweighs the benefit',
          why: 'Aspirin prevents a modest number of heart attacks and strokes but causes gastrointestinal and intracranial bleeding, and the bleeding risk climbs steeply with age while the benefit does not. Past 60 the trade-off turns negative for someone who has never had an event.' }
      ]
    },

    {
      id: 'cv-activity',
      subject: 'Cardiology & Vascular',
      topic: 'Prevention',
      name: 'PHYSICAL ACTIVITY',
      blurb: 'The weekly targets and how intensity is classified',
      cards: [
        { type: 'number', q: 'How much moderate-intensity aerobic activity do adults need each week?', value: 150, unit: 'min/week',
          why: 'Thirty minutes on five days is the usual way to get there. Vigorous activity counts double, so 75 minutes a week of that is equivalent, and the two can be mixed.' },
        { type: 'number', q: 'How much vigorous aerobic activity substitutes for the moderate target?', value: 75, unit: 'min/week',
          why: 'Vigorous means six METs or more: jogging, swimming laps, singles tennis. Each minute counts for two minutes of moderate activity.' },
        { type: 'number', q: 'How many days a week should adults do muscle-strengthening activity?', value: 2, unit: 'days',
          why: 'This is in addition to the aerobic target, covering the major muscle groups. It is the part of the recommendation most often left out of exam answers.' },
        { type: 'bucket', q: 'Moderate or vigorous intensity?', bins: ['Moderate', 'Vigorous'], items: [
          { label: 'Water aerobics', bin: 'Moderate' },
          { label: 'Brisk walking', bin: 'Moderate' },
          { label: 'Ballroom dancing', bin: 'Moderate' },
          { label: 'Doubles tennis', bin: 'Moderate' },
          { label: 'Jogging', bin: 'Vigorous' },
          { label: 'Swimming laps', bin: 'Vigorous' },
          { label: 'Singles tennis', bin: 'Vigorous' },
          { label: 'Cycling over 10 mph', bin: 'Vigorous' }
        ], why: 'Moderate is 3 to 5.9 METs: you can talk but not sing. Vigorous is 6 METs or more: you cannot say more than a few words. Water aerobics is the one the exam used, and it is moderate.' },
        { type: 'truefalse', q: 'Slow walking and stretching count toward the 150-minute weekly goal.', a: false,
          why: 'Both are light activity, under 3 METs, and do not count. Walking has to be brisk, about 2.5 miles an hour or faster, before it reaches moderate intensity.' },
        { type: 'number', q: 'METs at or above which an activity counts as moderate intensity?', value: 3, unit: 'METs',
          why: 'One MET is the energy used sitting still. Moderate runs from 3 to just under 6, and vigorous starts at 6.' }
      ]
    },

    {
      id: 'cv-vte',
      subject: 'Cardiology & Vascular',
      topic: 'Vascular',
      name: 'VTE',
      blurb: 'Working up a clot, picking the anticoagulant, and how long to treat',
      cards: [
        { type: 'mcq', q: 'Wells score for PE of 5, which is high probability. Next test?',
          a: 'CT pulmonary angiography', distractors: ['D-dimer', 'Lower-extremity duplex', 'Chest x-ray'],
          why: 'With a high pretest probability the D-dimer is skipped and imaging is done directly: CT angiography of the chest for PE, or a V/Q scan when contrast is not possible because of allergy or kidney failure. For a suspected DVT the equivalent is a proximal compression duplex.' },
        { type: 'recall', q: 'Why isn\'t a D-dimer used when the pretest probability of PE is high?', a: 'A negative result cannot rule it out',
          why: 'The D-dimer excludes a clot only when the chance of one was low to begin with. When half the patients tested actually have a PE, a negative test still leaves too many of them undiagnosed, so it is not safe to stop on the strength of it.' },
        { type: 'number', q: 'Age-adjusted D-dimer cutoff for a 70-year-old?', value: 700, unit: 'µg/L',
          why: 'Age times 10 in µg/L for anyone over 50. D-dimer rises with age, so the fixed cutoff of 500 produces more false positives in older patients. An 80-year-old is negative below 800. In very low risk patients the PERC rule can exclude PE without any blood test.' },
        { type: 'recall', q: 'First-line anticoagulant for an uncomplicated outpatient DVT with normal kidneys?', a: 'Apixaban or rivaroxaban',
          why: 'Both can be started by mouth on day one without heparin: apixaban 10 mg twice daily for a week then 5 mg twice daily, rivaroxaban 15 mg twice daily for three weeks then 20 mg daily. The patient goes home from clinic.' },
        { type: 'truefalse', q: 'Apixaban for a new DVT requires several days of heparin first.', a: false,
          why: 'Apixaban and rivaroxaban are given as monotherapy from the start, with a higher loading dose instead. Dabigatran and edoxaban are the two that need five to ten days of a parenteral anticoagulant before they begin.' },
        { type: 'mcq', q: 'Acute DVT in a patient with an eGFR of 25. Anticoagulant?',
          a: 'Enoxaparin 1 mg/kg once daily', distractors: ['Rivaroxaban', 'Dabigatran', 'Enoxaparin 1 mg/kg twice daily'],
          why: 'Below a creatinine clearance of 30 the enoxaparin dose is halved to once daily because the drug is cleared by the kidney. Rivaroxaban, edoxaban and dabigatran are avoided at that level for the same reason. Intravenous unfractionated heparin bridging to warfarin is the other option.' },
        { type: 'mcq', q: 'VTE in a patient with triple-positive antiphospholipid syndrome. Anticoagulant?',
          a: 'Warfarin', distractors: ['Apixaban', 'Rivaroxaban', 'Dabigatran'],
          why: 'In the TRAPS trial, patients with triple-positive antiphospholipid syndrome on a DOAC had far more arterial thrombosis and strokes than those on warfarin. Warfarin is dosed to an INR of 2 to 3. In pregnancy the treatment is therapeutic LMWH with low-dose aspirin.' },
        { type: 'recall', q: 'First-line anticoagulant for VTE in a patient with active cancer?', a: 'An oral factor Xa inhibitor',
          why: 'Apixaban, edoxaban or rivaroxaban, with LMWH as the alternative. The exception is an unresected cancer of the gut or urinary tract, where rivaroxaban and edoxaban cause more bleeding from the tumor; those patients get LMWH or apixaban.' },
        { type: 'recall', q: 'Why is rivaroxaban avoided for VTE in a patient with an unresected GI cancer?', a: 'More bleeding from the tumor surface',
          why: 'Rivaroxaban and edoxaban pass through the gut lining at higher concentrations and were associated with more mucosal bleeding from luminal tumors in the trials. Apixaban did not show the same excess, and LMWH bypasses the gut entirely.' },
        { type: 'number', q: 'Duration of anticoagulation for a first VTE provoked by surgery or a cast?', value: 3, unit: 'months',
          why: 'A clot caused by a transient risk factor — surgery, trauma, immobilization, estrogen, an acute illness — is treated for three months and then stopped. Once the provoking factor is gone, the recurrence rate is under 3% a year, lower than the bleeding risk of continuing.' },
        { type: 'recall', q: 'VTE with active cancer or antiphospholipid syndrome: how long is anticoagulation continued?', a: 'Indefinitely, while the risk persists',
          why: 'A persistent risk factor means a persistent risk of recurrence, so treatment continues as long as the condition does and the bleeding risk stays acceptable. The same applies to recurrent unprovoked VTE, and most patients with a first unprovoked proximal DVT or PE and a low bleeding risk are also kept on long-term therapy.' }
      ]
    },

    {
      id: 'cv-pad',
      subject: 'Cardiology & Vascular',
      topic: 'Vascular',
      name: 'AAA & PAD',
      blurb: 'Aneurysm screening and repair, the ABI, claudication, and the ischemic limb',
      cards: [
        { type: 'recall', q: 'Strongest risk factor for abdominal aortic aneurysm?', a: 'Cigarette smoking',
          why: 'Smoking accounts for about three quarters of aneurysms 4 cm or larger and raises the rupture rate. Male sex, age over 65, a family history and hypertension add to the risk. Diabetes, unusually, is associated with fewer aneurysms.' },
        { type: 'truefalse', q: 'Diabetes increases the risk of abdominal aortic aneurysm.', a: false,
          why: 'It is one of the few conditions negatively associated with aneurysm formation, possibly through changes in the aortic wall matrix. It is the odd one out on any list of vascular risk factors and the exam likes to use it.' },
        { type: 'recall', q: 'Who gets a one-time ultrasound to screen for abdominal aortic aneurysm?', a: 'Men 65–75 who have ever smoked',
          why: '"Ever smoked" means 100 cigarettes in a lifetime; the recommendation is a grade B. Men in that age range who never smoked are screened selectively, a C, and women who never smoked are not screened, a D.' },
        { type: 'number', q: 'Aneurysm of 3.0–3.9 cm: repeat the ultrasound in how long?', value: 3, unit: 'years',
          why: 'Small aneurysms grow slowly, about 2 to 3 mm a year, and almost never rupture below 4 cm, so a long interval is safe.' },
        { type: 'number', q: 'Aneurysm of 4.0–4.9 cm: repeat the ultrasound in how long?', value: 12, unit: 'months',
          why: 'Growth speeds up as the aneurysm enlarges, and from 4 cm the yearly scan is also looking for the rapid expansion that would move repair forward.' },
        { type: 'number', q: 'Aneurysm of 5.0–5.4 cm: repeat the ultrasound in how long?', value: 6, unit: 'months',
          why: 'This is the last interval before the repair threshold. A woman in this range is already referred, since women are repaired from 5.0 cm.' },
        { type: 'number', q: 'Aneurysm diameter at which elective repair is offered to a man?', value: 5.5, unit: 'cm',
          why: 'Women are repaired from 5.0 cm, because their aortas are smaller and rupture at smaller diameters. Repair is also offered for growth of 0.5 cm in six months or 1 cm in a year, and for any aneurysm that causes pain or tenderness.' },
        { type: 'recall', q: 'Why is an aneurysm repaired for rapid growth even below 5.5 cm?', a: 'Fast growth predicts rupture',
          why: 'The rupture risk follows the wall stress, and a wall that is expanding quickly is one that is weakening quickly. Growth of half a centimeter in six months is treated as the same warning as reaching the size threshold.' },
        { type: 'match', q: 'Match the ankle-brachial index to its meaning', pairs: [
          { left: 'Above 1.40', right: 'Noncompressible' },
          { left: '1.00–1.40', right: 'Normal' },
          { left: '0.91–0.99', right: 'Borderline' },
          { left: '0.90 or less', right: 'PAD' }
        ] },
        { type: 'recall', q: 'Ankle-brachial index above 1.40. Next test?', a: 'Toe-brachial index',
          why: 'A value that high means the leg arteries are too calcified to compress, which is common in diabetes and kidney disease, and the index is meaningless. The toe vessels calcify less; a toe-brachial index below 0.70 confirms peripheral artery disease.' },
        { type: 'recall', q: 'Exertional leg pain with a normal resting ankle-brachial index. Next test?', a: 'Exercise treadmill ABI',
          why: 'A stenosis that does not limit flow at rest can limit it during walking, when the muscles demand more. Measuring the index right after exercise brings out a drop that the resting value missed.' },
        { type: 'mcq', q: 'First-line treatment to improve walking distance in intermittent claudication?',
          a: 'Supervised exercise program', distractors: ['Cilostazol', 'Pentoxifylline', 'Angioplasty'],
          why: 'The patient walks to near-maximal pain, rests until it settles and repeats, for 30 to 45 minutes at least three times a week for at least twelve weeks. Every patient also gets smoking cessation, a high-intensity statin, blood pressure control and a single antiplatelet to prevent heart attack and stroke; those protect the patient but do not lengthen the walking distance.' },
        { type: 'recall', q: 'Second-line drug for claudication when exercise alone is not enough?', a: 'Cilostazol',
          why: 'A phosphodiesterase-3 inhibitor at 100 mg twice daily, which improves walking distance modestly. It is contraindicated in heart failure of any degree. Pentoxifylline is no longer recommended because it does not work. Revascularization is reserved for lifestyle-limiting claudication that fails exercise and medication, or for rest pain, non-healing ulcers or gangrene.' },
        { type: 'recall', q: 'Why does supervised walking lengthen the distance a patient with claudication can walk?', a: 'Collateral vessels grow and muscle uses oxygen better',
          why: 'Repeated ischemia stimulates collateral arteries around the blockage and makes the leg muscles more efficient at extracting oxygen, so the same narrowed artery supports more work. The improvement equals or exceeds what a stent achieves, and lasts as long as the walking continues.' },
        { type: 'multi', q: 'Which are among the six P\'s of acute limb ischemia?',
          answers: ['Pallor', 'Pulselessness', 'Paresthesia', 'Paralysis'],
          distractors: ['Pitting edema', 'Purpura'],
          why: 'The six are pain, pallor, poikilothermia (a cold limb), pulselessness, paresthesia and paralysis. Numbness and weakness come last and mean the nerves and muscle are already dying.' },
        { type: 'recall', q: 'Suspected acute limb ischemia in the office. Immediate action?', a: 'IV heparin and emergency transfer',
          why: 'Heparin stops the clot from extending while the patient is moved to a center with vascular surgery or interventional radiology for thrombolysis or thrombectomy. Nothing is allowed to delay the transfer: no duplex, no ankle-brachial index, no CT angiogram in the office.' },
        { type: 'number', q: 'How long can muscle and nerve survive complete ischemia before the damage is permanent?', values: [4, 6], join: '–', unit: 'hours',
          why: 'Beyond that window the muscle dies, releasing myoglobin and potassium, and the limb is usually lost. The clock starts at the moment of occlusion, not at the moment of presentation.' }
      ]
    },

    {
      id: 'cv-edema',
      subject: 'Cardiology & Vascular',
      topic: 'Vascular',
      name: 'VEINS & EDEMA',
      blurb: 'Venous ulcers and compression, and working up swollen legs',
      cards: [
        { type: 'recall', q: 'Shallow, weeping ulcer over the medial malleolus with brown skin staining around it. Likely cause?', a: 'Venous stasis ulcer',
          why: 'Venous ulcers sit in the gaiter area above the inner ankle, have irregular borders and a granulating base, and are surrounded by hemosiderin pigmentation and thickened skin. The pedal pulses are intact. An arterial ulcer, by contrast, is punched out, dry and painful, on the toes or heel.' },
        { type: 'number', q: 'Compression pressure needed to heal a venous stasis ulcer?', values: [30, 40], join: '–', unit: 'mm Hg',
          why: 'Worn consistently, this pressure heals more than 90% of venous ulcers. Lower grades are for symptoms without ulceration; higher grades are for lymphedema.' },
        { type: 'recall', q: 'Why check the pulses or an ankle-brachial index before prescribing high compression?', a: 'Compression can worsen arterial ischemia',
          why: 'A stocking at 30 to 40 mm Hg squeezes the leg harder than a narrowed artery can push against. In a patient with unrecognized peripheral artery disease it can cause ischemia and necrosis. An ankle-brachial index above 0.8 to 0.9 is needed before high compression is safe.' },
        { type: 'match', q: 'Match the compression pressure to its use', pairs: [
          { left: 'Under 20 mm Hg', right: 'Tired legs, prevention' },
          { left: '20–30 mm Hg', right: 'Varicose veins' },
          { left: '30–40 mm Hg', right: 'Venous ulcers' },
          { left: 'Over 50 mm Hg', right: 'Severe lymphedema' }
        ] },
        { type: 'mcq', q: 'Bilateral ankle edema, normal heart and lung exam, started amlodipine two months ago. First step?',
          a: 'Stop the amlodipine', distractors: ['Echocardiogram', 'Bilateral venous duplex', 'Furosemide'],
          why: 'In a patient who feels well with a normal examination, the medication list is reviewed before any imaging. Dihydropyridine calcium channel blockers are the commonest culprit, along with estrogens, NSAIDs, pioglitazone, gabapentin and pregabalin, steroids, hydralazine and minoxidil.' },
        { type: 'recall', q: 'Why doesn\'t ankle edema from amlodipine respond to a loop diuretic?', a: 'It is from arteriolar dilation, not extra fluid',
          why: 'The drug dilates the small arteries feeding the capillaries but not the veins draining them, so pressure inside the capillaries rises and fluid leaks into the tissue. The body is not overloaded, so a diuretic has nothing to remove. Adding an ACE inhibitor or ARB, which dilates the venous side too, reduces it; stopping the drug resolves it.' },
        { type: 'multi', q: 'Which drugs commonly cause bilateral leg edema?',
          answers: ['Amlodipine', 'Pioglitazone', 'Pregabalin', 'Estrogen'],
          distractors: ['Losartan', 'Furosemide'],
          why: 'Calcium channel blockers do it through capillary pressure, thiazolidinediones and steroids through sodium retention, hormones through fluid retention, and gabapentinoids by a mechanism that is not well understood. Losartan, if anything, reduces calcium channel blocker edema.' },
        { type: 'multi', q: 'After the medication review, which systemic causes of bilateral edema are checked?',
          answers: ['Heart failure (BNP, echo)', 'Nephrotic syndrome (UACR)', 'Cirrhosis (albumin, LFTs)', 'Hypothyroidism (TSH)'],
          distractors: ['Anemia (CBC)', 'Gout (uric acid)'],
          why: 'Each of these causes edema through a different route: raised venous pressure in heart failure, protein loss in nephrotic syndrome, low albumin and portal pressure in cirrhosis, and myxedema in hypothyroidism. A creatinine and urinalysis cover the kidney; BNP and an echo cover the heart.' },
        { type: 'recall', q: 'Bilateral edema with a normal cardiac, renal, hepatic, thyroid and venous workup. What do you test for next?', a: 'Obstructive sleep apnea',
          why: 'Especially in a patient with obesity or resistant hypertension. The test is polysomnography. It is the cause that is missed because nobody thinks to ask about snoring in a swollen-leg workup.' },
        { type: 'recall', q: 'Why does obstructive sleep apnea cause leg edema?', a: 'Night-time hypoxia drives salt and water retention',
          why: 'Each apnea drops the oxygen level, which constricts the pulmonary arteries and over time raises the pressure on the right side of the heart. The hypoxia also activates the sympathetic nervous system and the renin-angiotensin-aldosterone system, and the kidney holds on to sodium and water. Treating the apnea reverses it.' }
      ]
    },

    /* ═══════════════ Endocrine & Metabolism ═══════════════
       From the user's ITE endocrinology study guide, module by module. */

    {
      id: 'en-dm-dx',
      subject: 'Endocrine & Metabolism',
      topic: 'Diabetes',
      name: 'SCREENING & DIAGNOSIS',
      blurb: 'Who is screened, the numbers that diagnose, and when the A1c lies',
      cards: [
        { type: 'number', q: 'USPSTF: diabetes screening for adults with overweight or obesity starts at what age?', value: 35, unit: 'years',
          why: 'Screening runs from 35 to 70, every three years if normal, for a BMI of 25 or more. The ADA goes further and screens every adult from 35 regardless of weight, and earlier when there is overweight plus another risk factor.' },
        { type: 'number', q: 'USPSTF: routine diabetes screening stops at what age?', value: 70, unit: 'years',
          why: 'The recommendation covers 35 to 70. The upper limit was the point of a 2024 question; the ADA sets no upper age.' },
        { type: 'number', q: 'BMI at or above which an Asian American adult is screened for diabetes?', value: 23, unit: 'kg/m²',
          why: 'The usual threshold is a BMI of 25. Asian Americans develop insulin resistance and diabetes at lower body weights, so the screening cutoff is lowered to 23.' },
        { type: 'truefalse', q: 'The USPSTF recommends screening asymptomatic children and adolescents for type 2 diabetes.', a: false,
          why: 'The evidence is insufficient to recommend for or against it, a grade I. That is different from the adult recommendation and is the kind of distinction the exam tests.' },
        { type: 'number', q: 'Fasting glucose at or above which diabetes is diagnosed?', value: 126, unit: 'mg/dL',
          why: 'After a fast of at least eight hours. Below 100 is normal and 100 to 125 is impaired fasting glucose, one form of prediabetes.' },
        { type: 'number', q: 'Two-hour glucose on a 75-g tolerance test at or above which diabetes is diagnosed?', value: 200, unit: 'mg/dL',
          why: 'Below 140 is normal and 140 to 199 is impaired glucose tolerance. The tolerance test picks up some patients the fasting value misses, particularly those whose problem is after meals.' },
        { type: 'number', q: 'Hemoglobin A1c at or above which diabetes is diagnosed?', value: 6.5, unit: '%',
          why: 'Below 5.7 is normal and 5.7 to 6.4 is prediabetes. The A1c reflects roughly three months of glucose and needs no fasting, but it is unreliable whenever red cell turnover is abnormal.' },
        { type: 'match', q: 'Match the prediabetes range to its test', pairs: [
          { left: '100–125 mg/dL', right: 'Fasting glucose' },
          { left: '140–199 mg/dL', right: 'Two-hour OGTT' },
          { left: '5.7–6.4%', right: 'Hemoglobin A1c' }
        ] },
        { type: 'recall', q: 'When does one random glucose of 200 or more diagnose diabetes without a repeat test?', a: 'When classic symptoms are present',
          why: 'Polyuria, polydipsia, polyphagia, blurred vision or unexplained weight loss, or a hyperglycemic crisis, make the diagnosis on the spot. Without symptoms, two abnormal results are needed.' },
        { type: 'recall', q: 'Why does an asymptomatic patient need two abnormal results before diabetes is diagnosed?', a: 'A single value has too many false positives',
          why: 'Glucose varies with stress, illness and the day, and labs have error. Requiring two abnormal values, either two tests from the same sample such as a fasting glucose with an A1c, or the same test on two days, keeps a one-off reading from labeling someone diabetic for life.' },
        { type: 'multi', q: 'Which conditions falsely lower the hemoglobin A1c?',
          answers: ['Hemolytic anemia', 'Sickle cell disease', 'Pregnancy', 'Recent transfusion'],
          distractors: ['Iron deficiency', 'Asplenia'],
          why: 'Anything that shortens red cell survival or floods the blood with young cells lowers the A1c, because the cells have had less time to pick up glucose: hemolysis, sickle disease or trait, G6PD deficiency, blood loss or transfusion, the second and third trimesters, erythropoietin and dialysis. In those patients use a fasting glucose or a tolerance test instead.' },
        { type: 'recall', q: 'Why does iron deficiency anemia falsely raise the hemoglobin A1c?', a: 'Old red cells stay in circulation longer',
          why: 'When the marrow cannot make new cells, the existing ones age in the circulation and accumulate more glucose. Iron, B12 and folate deficiency and asplenia all push the A1c up for the same reason, so a high value in those patients should be confirmed with a glucose measurement.' }
      ]
    },

    {
      id: 'en-prediab',
      subject: 'Endocrine & Metabolism',
      topic: 'Diabetes',
      name: 'PREDIABETES',
      blurb: 'What prevents progression, and when metformin joins in',
      cards: [
        { type: 'recall', q: 'First-line intervention for prediabetes?', a: 'An intensive lifestyle program',
          why: 'Programs modeled on the Diabetes Prevention Program: structured coaching toward 7% weight loss and 150 minutes a week of moderate activity such as brisk walking. It outperformed metformin in the trial and the gap was widest in older adults.' },
        { type: 'number', q: 'Weight loss target in the Diabetes Prevention Program?', value: 7, unit: '%',
          why: 'Alongside 150 minutes a week of moderate-intensity activity. Both targets are modest, which is part of why the program works in practice.' },
        { type: 'number', q: 'In the DPP trial, lifestyle change reduced the three-year incidence of diabetes by how much?', value: 58, unit: '%',
          why: 'Metformin reduced it by 31%. In adults 60 and older the lifestyle arm reduced it by 71%, while metformin did little in that group.' },
        { type: 'truefalse', q: 'In the DPP trial, metformin prevented more cases of diabetes than lifestyle change.', a: false,
          why: 'Lifestyle change prevented nearly twice as many, 58% against 31%. Metformin is an add-on for those at highest risk, not a substitute for the program.' },
        { type: 'multi', q: 'In which patients with prediabetes is metformin considered in addition to lifestyle change?',
          answers: ['BMI 35 or higher', 'Age under 60', 'A1c 6.0% or higher', 'History of gestational diabetes'],
          distractors: ['Age over 70', 'BMI 25'],
          why: 'These mark the patients most likely to progress, and metformin worked best in the trial in the young and the heavy. A fasting glucose of 110 or more is the other criterion.' }
      ]
    },

    {
      id: 'en-dm-choose',
      subject: 'Endocrine & Metabolism',
      topic: 'Diabetes',
      name: 'CHOOSING THE DRUG',
      blurb: 'Which class the comorbidity picks, independent of the A1c',
      cards: [
        { type: 'mcq', q: 'Type 2 diabetes with heart failure, A1c 7.8% on metformin. What do you add?',
          a: 'An SGLT2 inhibitor', distractors: ['A GLP-1 agonist', 'Pioglitazone', 'Glipizide'],
          why: 'SGLT2 inhibitors reduce heart failure hospitalizations and cardiovascular death whether the ejection fraction is reduced or preserved and whether or not the patient has diabetes. The same class is chosen for chronic kidney disease. The A1c does not change the decision.' },
        { type: 'mcq', q: 'Type 2 diabetes, BMI 36, prior MI. Best add-on to metformin?',
          a: 'A GLP-1 receptor agonist', distractors: ['A sulfonylurea', 'Basal insulin', 'A DPP-4 inhibitor'],
          why: 'GLP-1 agonists reduce major cardiovascular events in established atherosclerotic disease and produce the most weight loss of any class. Semaglutide also slows kidney disease and improves steatotic liver disease. A sulfonylurea or insulin would add weight and hypoglycemia.' },
        { type: 'recall', q: 'First-line drug for type 2 diabetes when there is no heart or kidney disease?', a: 'Metformin',
          why: 'It lowers hepatic glucose production and improves insulin sensitivity, is weight neutral, costs little and does not cause hypoglycemia on its own. Cardiorenal disease is what moves an SGLT2 inhibitor or GLP-1 agonist ahead of it.' },
        { type: 'recall', q: 'Why do SGLT2 inhibitors help heart failure even without diabetes?', a: 'They cause natriuresis, not just glycosuria',
          why: 'Blocking the sodium-glucose transporter in the proximal tubule spills glucose and sodium into the urine together. The sodium loss offloads the heart and lowers blood pressure modestly, and the benefit on hospitalizations appears in patients whose glucose was normal to begin with. They do not cause hypoglycemia.' },
        { type: 'number', q: 'An SGLT2 inhibitor can be started for kidney protection down to what eGFR?', value: 20, unit: 'mL/min',
          why: 'The benefit is largest with albuminuria, a UACR of 200 mg/g or more. Below 20 the drug is not started, though one already running may be continued.' },
        { type: 'recall', q: 'Which cancer in the personal or family history contraindicates a GLP-1 agonist?', a: 'Medullary thyroid cancer',
          why: 'Also in multiple endocrine neoplasia type 2, which carries that cancer. The class is avoided in severe gastroparesis because it slows gastric emptying further, and it causes nausea, gallstones and occasionally pancreatitis.' },
        { type: 'recall', q: 'Biopsy-proven MASH with fibrosis in a patient with type 2 diabetes. Which drug has evidence?', a: 'Pioglitazone',
          why: 'It activates PPAR-gamma and improves insulin sensitivity in fat and muscle, which reduces liver fat and inflammation. It also lowered recurrent stroke in insulin-resistant patients in the IRIS trial. Its side effects limit it to these niches.' },
        { type: 'recall', q: 'Why are a DPP-4 inhibitor and a GLP-1 agonist never combined?', a: 'They work through the same pathway',
          why: 'A DPP-4 inhibitor blocks the breakdown of the body\'s own GLP-1. If a GLP-1 agonist is already supplying far more of that signal than the body makes, protecting the native hormone adds nothing. One or the other, never both.' },
        { type: 'recall', q: 'Which DPP-4 inhibitor needs no dose adjustment at any kidney function?', a: 'Linagliptin',
          why: 'It is cleared through the bile rather than the kidney. Sitagliptin and saxagliptin need lower doses as the eGFR falls.' }
      ]
    },

    {
      id: 'en-dm-harm',
      subject: 'Endocrine & Metabolism',
      topic: 'Diabetes',
      name: 'SIDE EFFECTS',
      blurb: 'What each class does wrong, and who should not take it',
      cards: [
        { type: 'multi', q: 'Which adverse effects go with SGLT2 inhibitors?',
          answers: ['Genital yeast infections', 'Volume depletion', 'Euglycemic DKA'],
          distractors: ['Hypoglycemia', 'Weight gain'],
          why: 'Glucose in the urine feeds candida and pulls water with it, so thrush, urinary infections and orthostasis follow. Ketoacidosis can develop at a near-normal glucose during illness, fasting or surgery. The class causes modest weight loss and no hypoglycemia on its own.' },
        { type: 'number', q: 'Hold an SGLT2 inhibitor how long before elective surgery?', values: [3, 4], join: '–', unit: 'days',
          why: 'Fasting and surgical stress on top of the drug are the setting for euglycemic ketoacidosis. The glycosuria persists for up to two weeks after stopping, so the window is longer than for most drugs.' },
        { type: 'number', q: 'Metformin is contraindicated below what eGFR?', value: 30, unit: 'mL/min',
          why: 'The risk is lactic acidosis. It is not started between 30 and 45, and it is held for iodinated contrast when the eGFR is under 60, and during any acute illness with hypoxia or dehydration.' },
        { type: 'recall', q: 'Which vitamin deficiency does long-term metformin cause?', a: 'Vitamin B12',
          why: 'The level is checked yearly in anyone on metformin who develops neuropathy or anemia, since the deficiency produces a neuropathy that is easily mistaken for diabetic nerve damage.' },
        { type: 'recall', q: 'Why does metformin cause B12 deficiency?', a: 'It blocks absorption in the terminal ileum',
          why: 'Uptake of the B12-intrinsic factor complex in the ileum depends on calcium, and metformin interferes with that step. The effect builds over years, which is why it is a long-term complication rather than an early one.' },
        { type: 'multi', q: 'Which are adverse effects of pioglitazone?',
          answers: ['Fluid retention', 'Weight gain', 'Fractures in women', 'Bladder cancer'],
          distractors: ['Hypoglycemia', 'Lactic acidosis'],
          why: 'The fluid retention makes it contraindicated in class III and IV heart failure. The fractures are distal, in women, from an effect on bone. It does not cause hypoglycemia on its own.' },
        { type: 'recall', q: 'Which sulfonylurea is avoided in older adults and in kidney disease?', a: 'Glyburide',
          why: 'Its metabolites are active and cleared by the kidney, so they accumulate and cause prolonged hypoglycemia; it is on the Beers list. Glipizide is the sulfonylurea to use when one is needed in CKD.' },
        { type: 'recall', q: 'Why do sulfonylureas cause hypoglycemia when metformin does not?', a: 'They force insulin release regardless of glucose',
          why: 'They close the potassium channels on the beta cell, which triggers insulin secretion whether the glucose is high or low. Metformin lowers glucose production rather than raising insulin, and the GLP-1 and DPP-4 drugs only stimulate insulin when glucose is up.' },
        { type: 'truefalse', q: 'Saxagliptin and alogliptin increase hospitalizations for heart failure.', a: true,
          why: 'The signal appeared in their outcome trials and was not seen with sitagliptin or linagliptin. In a diabetic with heart failure an SGLT2 inhibitor is the choice in any case.' }
      ]
    },

    {
      id: 'en-dm-nerve-skin',
      subject: 'Endocrine & Metabolism',
      topic: 'Diabetes',
      name: 'NEUROPATHY & SKIN',
      blurb: 'Treating painful neuropathy, and the skin findings that point to diabetes',
      cards: [
        { type: 'recall', q: 'Burning, tingling pain in a stocking-and-glove pattern, worse at night, in a diabetic. Diagnosis?', a: 'Painful diabetic peripheral neuropathy',
          why: 'It is distal and symmetric, and on examination the 10-g monofilament and 128-Hz vibration sense at the great toe are reduced. Loss of protective sensation is also what sets up foot ulcers.' },
        { type: 'multi', q: 'Which drug classes are first-line for painful diabetic neuropathy?',
          answers: ['Gabapentinoids', 'SNRIs (duloxetine)', 'Tricyclics'],
          distractors: ['Opioids', 'SSRIs'],
          why: 'Pregabalin or gabapentin, duloxetine or venlafaxine, and amitriptyline or nortriptyline are about equally effective; the choice follows side effects and comorbidities, with tricyclics used cautiously in older patients and in conduction disease. Opioids, including tramadol and tapentadol, and SSRIs are not recommended.' },
        { type: 'recall', q: 'Why aren\'t opioids used for chronic diabetic neuropathic pain?', a: 'No lasting benefit and a high risk of addiction',
          why: 'They relieve pain for a while, but tolerance erodes the effect, and the risks of dependence and overdose grow with time. Tramadol and tapentadol are included in that advice despite being weaker opioids.' },
        { type: 'recall', q: 'A patient on long-term metformin develops neuropathy. Which lab do you check first?', a: 'Vitamin B12',
          why: 'B12 deficiency from metformin produces a neuropathy that mimics diabetic nerve damage, and it is reversible if caught. It should be excluded before the symptoms are attributed to the diabetes.' },
        { type: 'recall', q: 'Vomiting and a new sensorimotor neuropathy months after bariatric surgery. Likely deficiency?', a: 'Thiamine',
          why: 'This is dry beriberi. Thiamine stores last only a few weeks, so prolonged vomiting after surgery depletes them quickly. It is replaced before glucose is given, since glucose can precipitate Wernicke encephalopathy in a thiamine-deficient patient.' },
        { type: 'recall', q: 'Yellow-brown waxy atrophic plaques with raised violet borders on the shins. Likely cause?', a: 'Necrobiosis lipoidica',
          why: 'Strongly associated with diabetes, with visible surface telangiectasias, and prone to ulcerating after minor trauma. It is treated with potent topical or intralesional corticosteroids.' },
        { type: 'recall', q: 'Recurrent painful nodules, abscesses and sinus tracts in the axillae and groin. Diagnosis?', a: 'Hidradenitis suppurativa',
          why: 'A chronic inflammatory disease of the apocrine skin folds that leaves rope-like scars. It is strongly associated with type 2 diabetes, obesity and the metabolic syndrome, which is why it appears in an endocrine guide.' },
        { type: 'recall', q: 'Why does insulin resistance cause acanthosis nigricans?', a: 'High insulin stimulates IGF-1 receptors in skin',
          why: 'The hyperinsulinemia that accompanies resistance activates insulin-like growth factor receptors in keratinocytes and fibroblasts, which thicken and darken the skin of the neck, axillae and groin into velvety plaques.' },
        { type: 'recall', q: 'Most common skin finding in diabetes?', a: 'Diabetic dermopathy',
          why: 'The "shin spots": small hyperpigmented atrophic patches on the shins. They are benign, cause no symptoms and need no treatment, but they mark long-standing disease.' }
      ]
    },

    {
      id: 'en-dka-dx',
      subject: 'Endocrine & Metabolism',
      topic: 'Hyperglycemic Emergencies',
      name: 'DKA VS HHS',
      blurb: 'Telling the three apart by numbers, breathing and mental state',
      cards: [
        { type: 'recall', q: 'pH of 7.20 with ketones and a glucose of 190 in a patient on empagliflozin. Diagnosis?', a: 'Euglycemic DKA',
          why: 'The acidosis and ketones make it DKA; the glucose is only low because the SGLT2 inhibitor keeps spilling it into the urine. Classic DKA runs 300 to 600, and the hyperosmolar state runs over 600 with a near-normal pH. Treat it as DKA with insulin and dextrose together.' },
        { type: 'number', q: 'Classic DKA is defined by a plasma glucose above what value?', value: 250, unit: 'mg/dL',
          why: 'Typically 300 to 600. The glucose is the least important of the three criteria; the acidosis and the ketones are what make it DKA, which is why it can occur below 250.' },
        { type: 'number', q: 'Arterial pH at or below which DKA is diagnosed?', value: 7.3,
          why: 'With a bicarbonate of 18 or less and an anion gap above 12. HHS, by contrast, has a pH above 7.30 and a bicarbonate above 18.' },
        { type: 'number', q: 'Serum bicarbonate at or below which DKA is diagnosed?', value: 18, unit: 'mEq/L', unit: 'mEq/L',
          why: 'The bicarbonate is consumed buffering the ketoacids. It is also one of the values watched to decide when the acidosis has resolved.' },
        { type: 'number', q: 'Plasma glucose above which the hyperosmolar hyperglycemic state is defined?', value: 600, unit: 'mg/dL',
          why: 'Often 800 to 1200 or higher. The glucose climbs that far because the patient has been diuresing for days without the acidosis that would have brought a DKA patient to hospital sooner.' },
        { type: 'number', q: 'Effective serum osmolality above which HHS is diagnosed?', value: 320, unit: 'mOsm/kg',
          why: 'The osmolality drives the mental status: obtundation, coma, seizures and focal deficits. The total body water deficit is enormous, 8 to 12 liters.' },
        { type: 'recall', q: 'Why does HHS produce no significant ketoacidosis?', a: 'Enough insulin remains to block lipolysis',
          why: 'Type 2 patients still make some insulin, and only a small amount is needed to switch off fat breakdown and ketone production. It is not enough to control the glucose, so the sugar rises, water follows it into the urine, and the patient becomes profoundly dehydrated without turning acidotic.' },
        { type: 'recall', q: 'Why can DKA develop at a glucose of 190 on an SGLT2 inhibitor?', a: 'Glycosuria keeps the glucose down while ketones rise',
          why: 'The drug keeps dumping glucose into the urine, so the blood level stays near normal even as insulin deficiency, illness, fasting or surgery drive ketogenesis. A clinician who checks only a fingerstick misses it. The glycosuria persists 10 to 14 days after the drug is stopped.' },
        { type: 'recall', q: 'Which breathing pattern marks DKA and is absent in HHS?', a: 'Kussmaul respirations',
          why: 'Deep, rapid breathing is the lungs blowing off carbon dioxide to compensate for the acidosis. HHS has no acidosis to compensate for, so the patient is obtunded rather than hyperventilating.' },
        { type: 'multi', q: 'Which features point to HHS rather than DKA?',
          answers: ['Onset over days to weeks', 'Obtundation or coma', 'Osmolality above 320', 'Absent or trace ketones'],
          distractors: ['Kussmaul breathing', 'Fruity breath'],
          why: 'DKA comes on within a day with nausea, vomiting, abdominal pain, acetone on the breath and Kussmaul breathing. HHS creeps up in an older type 2 patient, who arrives profoundly dehydrated with altered consciousness and sometimes focal neurologic signs.' },
        { type: 'recall', q: 'Which ketone is measured to diagnose and follow DKA?', a: 'Serum β-hydroxybutyrate',
          why: 'It is the predominant ketoacid in DKA. The urine dipstick detects acetoacetate instead, which can read low early and paradoxically rise during recovery as β-hydroxybutyrate converts back to it.' }
      ]
    },

    {
      id: 'en-dka-tx',
      subject: 'Endocrine & Metabolism',
      topic: 'Hyperglycemic Emergencies',
      name: 'TREATING DKA & HHS',
      blurb: 'Fluids, then potassium, then insulin, then dextrose, then the handover',
      cards: [
        { type: 'recall', q: 'First step in treating DKA or HHS?', a: 'IV isotonic saline',
          why: 'Normal saline or a balanced crystalloid at 15 to 20 mL/kg in the first hour, about 1 to 1.5 liters, to restore circulating volume and kidney perfusion. In HHS the fluid alone lowers the glucose by 35 to 70 mg/dL an hour.' },
        { type: 'number', q: 'Isotonic saline rate in the first hour of DKA or HHS?', values: [15, 20], join: '–', unit: 'mL/kg/h',
          why: 'The patient has lost liters to osmotic diuresis. Restoring volume comes before anything else, including insulin.' },
        { type: 'recall', q: 'Why must fluids come before insulin in HHS?', a: 'Insulin shifts water into cells and drops the pressure',
          why: 'Insulin moves glucose into cells and water follows it out of the vascular space. In a patient who is already several liters down, that shift can collapse the circulation. Filling the tank first makes the insulin safe.' },
        { type: 'recall', ctx: 'DKA · fluids', q: 'After the first hour of 0.9% saline, when is the fluid switched to 0.45%?', a: 'When the corrected sodium is normal or high',
          why: 'The sodium is corrected for the glucose, adding 1.6 mEq/L for every 100 mg/dL above 100. A normal or high corrected sodium means the patient is short of free water, so half-normal saline at 250 to 500 mL/h follows. A low corrected sodium means normal saline continues.' },
        { type: 'number', q: 'Serum potassium below which insulin is held in DKA?', value: 3.3, unit: 'mEq/L',
          why: 'Insulin drives potassium into cells. Starting it with a potassium already under 3.3 can cause fatal arrhythmias or respiratory muscle paralysis. Potassium chloride is given at 20 to 40 mEq an hour until the level is 3.3 or above, and only then does insulin begin.' },
        { type: 'recall', q: 'Why is the potassium often normal or high at presentation despite a large total deficit?', a: 'Acidosis shifts potassium out of cells',
          why: 'The patient has lost 3 to 5 mEq/kg in the urine, but acidosis and hyperosmolality pull potassium out of the cells into the blood, so the measured level looks fine. Insulin and correction of the acidosis reverse the shift within hours, and the true deficit appears.' },
        { type: 'mcq', q: 'DKA with a serum potassium of 4.2. How is insulin started?',
          a: 'Insulin, with KCl in the fluids', distractors: ['Hold insulin until K is 5', 'Insulin, no potassium', 'Potassium only, no insulin'],
          why: 'Between 3.3 and 5.2 insulin starts and 20 to 30 mEq of potassium chloride is added to each liter of fluid to hold the level between 4 and 5. Above 5.2 insulin starts without added potassium and the level is rechecked every two hours. Below 3.3 insulin is held.' },
        { type: 'number', q: 'Starting rate of continuous IV regular insulin in DKA?', value: 0.1, unit: 'units/kg/h',
          why: 'With or without a 0.1 units/kg bolus first. Hourly fingersticks follow, and the glucose should fall by 50 to 75 mg/dL an hour.' },
        { type: 'number', q: 'In DKA, dextrose is added to the fluids when the glucose falls to what?', values: [200, 250], join: '–', unit: 'mg/dL',
          why: 'In HHS the switch is made at 250 to 300. The fluid becomes 5% dextrose in half-normal saline and the insulin rate drops to 0.02 to 0.05 units/kg/h.' },
        { type: 'recall', ctx: 'DKA · insulin', q: 'Why is dextrose added once glucose nears 200 rather than stopping the insulin?', a: 'The acidosis clears more slowly than the glucose',
          why: 'Glucose normalizes in 4 to 6 hours, but clearing the ketoacids and closing the anion gap takes 10 to 12 hours or more, and that requires insulin. Dextrose lets the insulin keep running at a lower rate without causing hypoglycemia or cerebral edema.' },
        { type: 'multi', q: 'Which criteria allow the switch from IV to subcutaneous insulin in DKA?',
          answers: ['Glucose under 200', 'Able to eat', 'Anion gap 12 or less', 'Bicarbonate 15–18 or more'],
          distractors: ['Normal potassium', 'Urine ketones negative'],
          why: 'The glucose must be under 200 and the patient eating, plus at least two of: anion gap 12 or less, bicarbonate 15 to 18 or more, venous pH above 7.30. Urine ketones lag behind and are not used.' },
        { type: 'number', q: 'Give the subcutaneous basal insulin how long before stopping the IV infusion?', values: [1, 2], join: '–', unit: 'hours',
          why: 'The long-acting insulin needs that long to start working. Stopping the drip before it does leaves a gap with no insulin at all.' },
        { type: 'recall', q: 'Why does stopping IV insulin without an overlap cause rebound DKA?', a: 'IV insulin is gone within minutes',
          why: 'Regular insulin given intravenously has a half-life of 4 to 5 minutes. Once the infusion stops, the patient has no insulin on board until the subcutaneous dose is absorbed, and ketogenesis restarts in that gap.' }
      ]
    },

    {
      id: 'en-hyper',
      subject: 'Endocrine & Metabolism',
      topic: 'Thyroid',
      name: 'HYPERTHYROIDISM',
      blurb: 'Sorting the causes by scan and antibodies, and treating each',
      cards: [
        { type: 'recall', q: 'First tests when the TSH comes back suppressed?', a: 'Free T4 and total T3',
          why: 'They confirm thyrotoxicosis and show how severe it is. If the examination does not settle the cause, TSH receptor antibodies or a radioiodine uptake scan come next; the scan is contraindicated in pregnancy and breastfeeding.' },
        { type: 'recall', q: 'Why is a radioiodine uptake scan contraindicated in a breastfeeding woman?', a: 'The isotope reaches the baby through the milk',
          why: 'Iodine is concentrated in breast milk, and a radioactive dose would land in the infant\'s thyroid. In pregnancy it crosses the placenta and ablates the fetal gland. Antibodies and clinical features are used instead.' },
        { type: 'match', q: 'Match the uptake scan pattern to the diagnosis', pairs: [
          { left: 'Diffusely high uptake', right: 'Graves disease' },
          { left: 'Single hot nodule', right: 'Toxic adenoma' },
          { left: 'Patchy hot nodules', right: 'Multinodular goiter' },
          { left: 'Near-zero uptake', right: 'Thyroiditis' }
        ] },
        { type: 'recall', q: 'Why is the radioiodine uptake near zero in thyroiditis?', a: 'Stored hormone leaks; none is being made',
          why: 'In thyroiditis the inflamed gland releases hormone it has already made, so the patient is thyrotoxic without the gland doing any work. A gland that is not making hormone takes up no iodine. The same is true of someone taking thyroid hormone tablets.' },
        { type: 'multi', q: 'Which findings are specific to Graves disease among the causes of thyrotoxicosis?',
          answers: ['Exophthalmos', 'Pretibial myxedema', 'Thyroid bruit', 'Positive TRAb'],
          distractors: ['Tachycardia', 'Weight loss'],
          why: 'The eye and skin changes come from the same antibody acting on tissue behind the eye and in the shin, and the bruit comes from blood flow through an overactive gland. Tachycardia, tremor and weight loss occur with any cause of excess hormone.' },
        { type: 'recall', q: 'Preferred antithyroid drug for Graves disease outside the first trimester?', a: 'Methimazole',
          why: 'Once-daily dosing, faster return to normal, and less liver toxicity than propylthiouracil. Radioactive iodine or surgery are the alternatives; radioiodine is avoided in active eye disease, which it can worsen, and in pregnancy.' },
        { type: 'recall', q: 'Antithyroid drug for Graves disease in the first trimester of pregnancy?', a: 'Propylthiouracil',
          why: 'Methimazole in early pregnancy causes aplasia cutis and choanal or esophageal atresia. After the first trimester the patient is switched back to methimazole, because propylthiouracil can cause fulminant liver failure.' },
        { type: 'recall', q: 'A patient on methimazole develops a fever and sore throat. What do you do?', a: 'Stop the drug and check a CBC',
          why: 'Agranulocytosis is the dangerous reaction to both thionamides. The drug is stopped at once and an urgent white count with differential is drawn; the patient is not told to finish the course and call back.' },
        { type: 'recall', q: 'Definitive treatment for a toxic adenoma or toxic multinodular goiter?', a: 'Radioactive iodine or surgery',
          why: 'Nodules do not remit the way Graves disease can, so a thionamide only controls the hormone until the nodule is ablated or removed. These patients are typically older and are at particular risk of atrial fibrillation.' },
        { type: 'recall', q: 'Palpitations three months after delivery, near-zero uptake, TPO antibodies positive. Treatment?', a: 'A beta-blocker only',
          why: 'This is postpartum thyroiditis: a hyperthyroid phase from leaked hormone, then a hypothyroid phase at four to eight months, then recovery in about 80%. Propranolol or metoprolol covers the symptoms. Levothyroxine is given in the hypothyroid phase if she is symptomatic or trying to conceive, and tapered after 6 to 12 months to see whether the gland has recovered.' },
        { type: 'recall', q: 'Why are methimazole and PTU useless in postpartum or subacute thyroiditis?', a: 'There is no new hormone synthesis to block',
          why: 'Thionamides work by stopping the gland from making hormone. In thyroiditis the gland is leaking what it already stored, so blocking synthesis does nothing. The excess hormone runs out on its own.' },
        { type: 'recall', q: 'Exquisitely tender thyroid after a viral illness, ESR 80. Diagnosis?', a: 'Subacute thyroiditis',
          why: 'De Quervain thyroiditis: a firm, painful gland with pain radiating to the jaw and ears, fever, and a markedly raised ESR and CRP. NSAIDs or high-dose aspirin treat the pain; prednisone 40 mg tapered over four to six weeks is used when it is severe, and a beta-blocker covers the thyrotoxic symptoms.' },
        { type: 'recall', q: 'Thyrotoxicosis with no goiter, no eye signs and an undetectable thyroglobulin. Likely cause?', a: 'Exogenous thyroid hormone',
          why: 'Taking levothyroxine or liothyronine, often for weight loss, suppresses the gland so it shrinks and stops releasing thyroglobulin. The hormone is stopped or reduced and a beta-blocker given. Left alone it causes atrial fibrillation in 10 to 25% and bone loss.' },
        { type: 'recall', q: 'Why is thyroglobulin low in factitious thyrotoxicosis but high in Graves disease and thyroiditis?', a: 'The suppressed gland is releasing nothing',
          why: 'Thyroglobulin is the protein the gland stores hormone in, and it leaks out whenever the gland is active or damaged. An overactive gland in Graves disease and an inflamed one in thyroiditis both release it. Tablets shut the gland down completely, so the level falls.' }
      ]
    },

    {
      id: 'en-storm',
      subject: 'Endocrine & Metabolism',
      topic: 'Thyroid',
      name: 'THYROID STORM',
      blurb: 'Recognizing it, and the four drugs in strict order',
      cards: [
        { type: 'multi', q: 'Which features turn thyrotoxicosis into thyroid storm?',
          answers: ['Fever above 38.5°C', 'Heart rate above 140', 'Delirium or coma', 'Heart failure'],
          distractors: ['Weight loss', 'Tremor'],
          why: 'Storm is decompensated thyrotoxicosis, set off by infection, surgery, trauma, DKA, delivery or an iodine load. High fever, extreme tachycardia or atrial fibrillation, high-output heart failure, agitation progressing to coma, and vomiting, diarrhea or jaundice separate it from ordinary hyperthyroidism.' },
        { type: 'recall', q: 'First drug given in thyroid storm?', a: 'Propranolol',
          why: '60 to 80 mg by mouth every four to six hours, or an esmolol infusion. Propranolol is chosen over other beta-blockers because at high doses it also blocks conversion of T4 to the active T3.' },
        { type: 'recall', q: 'Thionamide preferred in thyroid storm?', a: 'Propylthiouracil',
          why: 'A loading dose of 500 to 1000 mg, then 250 mg every four hours. It is preferred over methimazole here because it blocks peripheral conversion of T4 to T3 as well as new synthesis, and in a storm every source of T3 matters.' },
        { type: 'number', q: 'Wait at least how long after PTU before giving iodine in thyroid storm?', value: 1, unit: 'hour',
          why: 'The thionamide has to be blocking synthesis before the iodine arrives. Potassium iodide or Lugol solution then shuts off the release of stored hormone.' },
        { type: 'recall', q: 'Why is iodine given only after the thionamide in thyroid storm?', a: 'Given first, it fuels new hormone synthesis',
          why: 'A hyperactive gland uses iodine as raw material. If it arrives before synthesis is blocked, the gland makes a surge of new hormone and the storm gets worse. Once PTU is on board, the same iodine load does the opposite and stops release of what is stored.' },
        { type: 'recall', q: 'Fourth drug in the thyroid storm sequence, after the iodine?', a: 'IV hydrocortisone or dexamethasone',
          why: 'Steroids block conversion of T4 to T3, cover the relative adrenal insufficiency that comes with a storm, because cortisol is cleared faster, and steady the circulation. Hydrocortisone 100 mg every eight hours or dexamethasone 2 mg every six.' },
        { type: 'truefalse', q: 'Aspirin is the antipyretic of choice in thyroid storm.', a: false,
          why: 'Salicylates displace T4 and T3 from thyroid-binding globulin and raise the free hormone level. The fever is treated with acetaminophen and cooling blankets.' },
        { type: 'recall', q: 'Why does high-dose propranolol help beyond slowing the heart in thyroid storm?', a: 'It blocks conversion of T4 to active T3',
          why: 'Most T3 is made in the tissues from T4 by the deiodinase enzyme. Propranolol at the doses used in storm inhibits that enzyme, so it lowers the active hormone as well as blunting its effects on the heart.' }
      ]
    },

    {
      id: 'en-hypo',
      subject: 'Endocrine & Metabolism',
      topic: 'Thyroid',
      name: 'HYPO & NODULES',
      blurb: 'Replacing hormone, when subclinical disease is treated, and working up a nodule',
      cards: [
        { type: 'recall', q: 'Most common cause of primary hypothyroidism?', a: 'Hashimoto thyroiditis',
          why: 'An autoimmune destruction of the gland with positive anti-TPO antibodies. The pattern is a raised TSH with a low free T4.' },
        { type: 'number', q: 'Full replacement dose of levothyroxine in a young, healthy adult?', value: 1.6, unit: 'µg/kg/day',
          why: 'Older patients and anyone with coronary disease start far lower, at 25 to 50 µg a day, and work up.' },
        { type: 'number', q: 'Starting levothyroxine dose in a patient over 60 or with coronary disease?', values: [25, 50], join: '–', unit: 'µg/day',
          why: 'Increased slowly, with the TSH rechecked at each step, to avoid provoking angina or an infarction.' },
        { type: 'recall', q: 'Why is levothyroxine started low in a patient with coronary disease?', a: 'A sudden rise in metabolism can provoke angina',
          why: 'Thyroid hormone raises heart rate, contractility and oxygen demand. A heart with narrowed coronaries that has adapted to a slow metabolism can be pushed into angina or infarction by a full dose, so the dose is built up over weeks.' },
        { type: 'recall', q: 'How should levothyroxine be taken?', a: 'Empty stomach, 30–60 minutes before breakfast',
          why: 'Food reduces absorption, and calcium, iron, proton pump inhibitors and bile acid sequestrants reduce it further; those are separated from the dose by at least four hours. Inconsistent timing is the commonest reason a TSH will not settle.' },
        { type: 'number', q: 'Recheck the TSH how long after a levothyroxine dose change?', values: [6, 8], join: '–', unit: 'weeks',
          why: 'The TSH takes that long to reach a new steady state. Checking earlier gives a number that is still moving.' },
        { type: 'recall', q: 'A woman on levothyroxine has a positive pregnancy test. What changes?', a: 'Increase the dose by about 25–30%',
          why: 'Two extra tablets a week, started immediately. The fetus depends on maternal hormone in the first trimester, and the mother\'s requirement rises as soon as she is pregnant.' },
        { type: 'mcq', q: 'A 68-year-old has a TSH of 7.2, a normal free T4 and no symptoms. Treatment?',
          a: 'No treatment, recheck later', distractors: ['Levothyroxine 25 µg', 'Levothyroxine 1.6 µg/kg', 'Liothyronine'],
          why: 'Subclinical hypothyroidism with a TSH between 4.5 and 10 is not treated in an asymptomatic older adult. In the TRUST trial, treating it improved nothing — fatigue, cognition, weight or cardiovascular outcomes — and carried a real risk of atrial fibrillation and bone loss from overtreatment.' },
        { type: 'multi', q: 'Which findings make subclinical hypothyroidism worth treating?',
          answers: ['TSH above 10', 'Positive TPO antibodies', 'Pregnancy or trying to conceive', 'Resistant depression'],
          distractors: ['Age over 65', 'Fatigue alone'],
          why: 'A TSH over 10 progresses to overt disease and raises coronary risk; positive antibodies predict progression; pregnancy and infertility need a normal TSH for the fetus and for conception. Treatment-resistant depression or convincing symptoms with a goiter in a younger adult are also reasons to treat.' },
        { type: 'number', q: 'TSH above which subclinical hypothyroidism is treated regardless of symptoms?', value: 10, unit: 'mIU/L',
          why: 'Below 10, in an adult who is not pregnant and has no symptoms or antibodies, the trials show no benefit from treatment.' },
        { type: 'number', q: 'Longest interval between TSH checks for an adult with Down syndrome?', value: 2, unit: 'years',
          why: 'Autoimmune thyroid disease affects 30 to 50% of people with trisomy 21, and the symptoms of hypothyroidism are easily missed in this group. Screening also runs throughout childhood.' },
        { type: 'recall', q: 'First two tests for any thyroid nodule?', a: 'TSH and a thyroid ultrasound',
          why: 'The TSH decides the next branch: a suppressed TSH leads to a nuclear scan, a normal or high TSH leads straight to ultrasound criteria for biopsy. The ultrasound characterizes the nodule either way.' },
        { type: 'mcq', q: 'A thyroid nodule with a suppressed TSH. Next step?',
          a: 'Radionuclide thyroid scan', distractors: ['FNA biopsy', 'Repeat ultrasound in 6 months', 'Start methimazole'],
          why: 'A low TSH raises the chance that the nodule is making hormone. If the scan shows it is hot, it is almost never malignant and is not biopsied; the hyperthyroidism is treated with radioiodine or surgery. If it is cold, ultrasound features decide whether to biopsy.' },
        { type: 'recall', q: 'Why isn\'t a hot thyroid nodule biopsied?', a: 'Hot nodules are almost never malignant',
          why: 'Fewer than 1% of autonomously functioning nodules are cancer. A biopsy would add risk and ambiguity without changing the plan, which is to treat the hyperthyroidism.' },
        { type: 'number', q: 'A high-suspicion thyroid nodule is biopsied from what size?', value: 1, unit: 'cm',
          why: 'Low-suspicion nodules from 1.5 cm and very low suspicion from 2 cm. Purely cystic nodules are benign and are never biopsied. A nuclear scan is not ordered when the TSH is normal or high.' },
        { type: 'multi', q: 'Which ultrasound features make a thyroid nodule high suspicion?',
          answers: ['Microcalcifications', 'Hypoechoic solid', 'Irregular margins', 'Taller than wide'],
          distractors: ['Purely cystic', 'Spongiform'],
          why: 'These are the TI-RADS and ATA features that predict papillary cancer, along with extension beyond the thyroid. Cystic and spongiform nodules are at the benign end and are followed rather than biopsied.' }
      ]
    },

    {
      id: 'en-hyperca',
      subject: 'Endocrine & Metabolism',
      topic: 'Calcium & Bone',
      name: 'HIGH CALCIUM',
      blurb: 'Confirming it, the PTH that sorts the causes, and when to operate',
      cards: [
        { type: 'recall', q: 'First step when a calcium level comes back high?', a: 'Correct it for albumin, or check ionized calcium',
          why: 'Add 0.8 mg/dL for every 1 g/dL the albumin is below 4. A low albumin makes the total calcium read low, so a borderline value in a well-nourished patient can be real hypercalcemia once corrected, and a high value in a malnourished one may not be.' },
        { type: 'recall', q: 'Mandatory first test once hypercalcemia is confirmed?', a: 'Intact PTH',
          why: 'Primary hyperparathyroidism, the commonest cause in outpatients, and malignancy, the commonest in inpatients, together account for more than 90% of cases, and the PTH separates them: high or inappropriately normal in the first, suppressed in the second.' },
        { type: 'match', q: 'Match the lab pattern to the cause of hypercalcemia', pairs: [
          { left: 'High Ca, PTH high', right: 'Primary hyperpara' },
          { left: 'High Ca, PTH <20', right: 'Malignancy' },
          { left: 'High Ca, urine Ca <100', right: 'FHH' }
        ] },
        { type: 'recall', q: 'Most common cause of primary hyperparathyroidism?', a: 'A single parathyroid adenoma',
          why: 'About 85%. The rest is hyperplasia of all four glands and, rarely, carcinoma. The phosphate is low or low-normal because PTH wastes it, and the 24-hour urine calcium is normal or high.' },
        { type: 'multi', q: 'Which findings in asymptomatic primary hyperparathyroidism call for parathyroidectomy?',
          answers: ['Age under 50', 'Calcium >1 above normal', 'T-score −2.5 or lower', 'eGFR under 60'],
          distractors: ['Age over 70', 'Mild fatigue'],
          why: 'Any symptomatic patient — stones, a fragility fracture — is operated on. In the asymptomatic, the triggers are age under 50, calcium more than 1 mg/dL above the upper limit, osteoporosis or a vertebral fracture on imaging, an eGFR under 60, a 24-hour urine calcium over 400, or stones or nephrocalcinosis on renal imaging.' },
        { type: 'number', q: 'Asymptomatic primary hyperparathyroidism: surgery is advised under what age?', value: 50, unit: 'years',
          why: 'A younger patient has decades ahead for the bone and kidney damage to accumulate, so the operation is offered even without symptoms or other triggers.' },
        { type: 'recall', q: 'How is familial hypocalciuric hypercalcemia told apart from primary hyperparathyroidism?', a: 'A 24-hour urine calcium under 100 mg',
          why: 'Both have a high calcium with a PTH that is normal or mildly raised. In FHH the kidney holds on to calcium, so the urine calcium is low and the calcium-to-creatinine clearance ratio is under 0.01. In hyperparathyroidism the urine calcium is normal or high.' },
        { type: 'recall', q: 'Why must familial hypocalciuric hypercalcemia never be treated with parathyroidectomy?', a: 'The problem is the receptor, not the glands',
          why: 'An inherited inactivating mutation of the calcium-sensing receptor resets the set point in both the parathyroid and the kidney. Removing the glands does not change the kidney\'s handling of calcium and leaves the patient hypoparathyroid. The condition is benign and is simply observed.' },
        { type: 'multi', q: 'Which mechanisms cause hypercalcemia of malignancy?',
          answers: ['PTHrP secretion', 'Osteolytic metastases', 'Calcitriol from lymphoma'],
          distractors: ['Excess PTH', 'Milk-alkali'],
          why: 'PTH-related peptide from squamous cancers of the lung and head and neck, renal, breast and bladder cancer; direct bone destruction by myeloma and breast metastases; and activated vitamin D made by lymphoma or granulomas. In all of them the real PTH is suppressed, usually below 20.' },
        { type: 'recall', q: 'Calcium of 14.5 with confusion. Treatment?', a: 'IV saline, calcitonin, then zoledronic acid',
          why: 'Four to six liters of normal saline rehydrates and makes the kidney excrete calcium. Calcitonin works within four to six hours but wears off. Zoledronic acid takes two to four days to act and then holds the calcium down for weeks.' },
        { type: 'recall', q: 'Why is calcitonin given alongside the bisphosphonate in severe hypercalcemia?', a: 'It works in hours; the bisphosphonate takes days',
          why: 'Calcitonin lowers calcium quickly by blocking osteoclasts and increasing renal excretion, but the receptors downregulate within two days and it stops working. The bisphosphonate is slow to start and long to last. Together they cover both the first day and the following weeks.' },
        { type: 'recall', q: 'Low calcium, high phosphate and a very high PTH in stage 3 kidney disease. Diagnosis?', a: 'Secondary hyperparathyroidism',
          why: 'Chronic kidney disease mineral and bone disorder. The treatment works on the causes: dietary phosphate restriction, phosphate binders such as sevelamer or calcium acetate, calcitriol to replace the active vitamin D the kidney can no longer make, and cinacalcet to quiet the glands.' },
        { type: 'recall', q: 'Why does kidney failure drive the PTH up?', a: 'Retained phosphate and low calcitriol drop the calcium',
          why: 'The failing kidney cannot excrete phosphate, which binds calcium, and cannot convert vitamin D to its active form, so less calcium is absorbed from the gut. The low calcium stimulates the parathyroids continuously, and over years they enlarge.' }
      ]
    },

    {
      id: 'en-hypoca',
      subject: 'Endocrine & Metabolism',
      topic: 'Calcium & Bone',
      name: 'LOW CALCIUM',
      blurb: 'Recognizing tetany, the magnesium trap, and reading the phosphate',
      cards: [
        { type: 'recall', q: 'Carpal spasm when a blood pressure cuff is inflated above systolic. Sign?', a: 'Trousseau sign',
          why: 'A sign of hypocalcemia, along with Chvostek sign, a facial twitch on tapping the facial nerve. Perioral and fingertip tingling and muscle cramps usually come first; laryngospasm and seizures come late.' },
        { type: 'recall', q: 'Why does low calcium cause tetany?', a: 'It lowers the threshold for nerves to fire',
          why: 'Extracellular calcium stabilizes voltage-gated sodium channels. With less of it the channels open more easily, nerves and muscle fire spontaneously, and the patient gets paresthesias, cramps and spasms.' },
        { type: 'multi', q: 'Which cardiac findings go with hypocalcemia?',
          answers: ['Prolonged QTc', 'Heart block'],
          distractors: ['Short QT', 'Peaked T waves', 'Delta wave'],
          why: 'Calcium shapes the plateau of the action potential, so a low level prolongs repolarization and the QT. Hypercalcemia does the opposite and shortens it. Peaked T waves belong to potassium.' },
        { type: 'recall', q: 'Hypocalcemia that will not correct with calcium. What do you check?', a: 'Magnesium',
          why: 'Low magnesium is the usual reason calcium replacement fails. Until the magnesium is repleted the calcium will not stay up, however much is given.' },
        { type: 'recall', q: 'Why does low magnesium cause refractory hypocalcemia?', a: 'It blocks PTH release',
          why: 'The parathyroid glands need magnesium to secrete PTH, and the bone and kidney need it to respond to PTH. With both steps impaired, the body cannot defend its calcium, and infusing calcium only works briefly.' },
        { type: 'recall', q: 'Low calcium with a high phosphate and a low PTH after thyroid surgery. Cause?', a: 'Surgical hypoparathyroidism',
          why: 'The parathyroid glands were removed or lost their blood supply. Without PTH the kidney stops wasting phosphate, so the phosphate climbs while the calcium falls.' },
        { type: 'recall', q: 'Low calcium, low phosphate and a high PTH. Likely cause?', a: 'Vitamin D deficiency',
          why: 'Less calcium is absorbed from the gut, the parathyroids respond by making more PTH, and the extra PTH wastes phosphate in the urine. The direction of the phosphate is what separates this from hypoparathyroidism.' }
      ]
    },

    {
      id: 'en-osteo-dx',
      subject: 'Endocrine & Metabolism',
      topic: 'Calcium & Bone',
      name: 'OSTEOPOROSIS: DX',
      blurb: 'Who gets a DXA, and the three ways the diagnosis is made',
      cards: [
        { type: 'number', q: 'DXA screening for all women starts at what age?', value: 65, unit: 'years',
          why: 'Regardless of risk factors, a grade B. The scan is of the hip and lumbar spine.' },
        { type: 'recall', q: 'When is a postmenopausal woman under 65 screened with DXA?', a: 'One risk factor plus a FRAX of 8.4% or more',
          why: 'A ten-year major fracture risk of 8.4% is the risk of an average 65-year-old woman, so a younger woman who matches it is screened the same way.' },
        { type: 'multi', q: 'Which count as osteoporosis risk factors for screening a woman under 65?',
          answers: ['Parent with a hip fracture', 'Current smoking', '3+ drinks a day', 'BMI under 18.5–20'],
          distractors: ['Aunt with a hip fracture', 'Caffeine'],
          why: 'Also prednisone 5 mg or more a day for three months or longer, rheumatoid arthritis, and secondary causes of bone loss. The family history has to be a parent; an aunt does not count, and the exam has used exactly that distractor.' },
        { type: 'truefalse', q: 'The USPSTF recommends routine DXA screening for men at 70.', a: false,
          why: 'For men without a fragility fracture or a secondary cause such as androgen deprivation or chronic steroids, the evidence is insufficient, a grade I. Men with those exposures are evaluated on their own merits.' },
        { type: 'recall', q: 'Vertebral compression fracture with a T-score of −1.9. Diagnosis?', a: 'Osteoporosis',
          why: 'A fragility fracture of the hip or spine makes the diagnosis whatever the T-score says, and it calls for drug treatment. More than half of fragility fractures happen in people whose scan is in the osteopenic range.' },
        { type: 'recall', q: 'Why does a fragility fracture diagnose osteoporosis even when the T-score is osteopenic?', a: 'The fracture itself proves the bone is fragile',
          why: 'The T-score estimates fracture risk from bone density, but density is only one part of bone strength. A bone that broke under low trauma has already demonstrated the outcome the scan was trying to predict.' },
        { type: 'recall', q: 'DXA T-score that defines osteoporosis?', a: '−2.5 or lower',
          why: 'At the femoral neck, total hip, lumbar spine or distal third of the radius. Between −1.0 and −2.5 is osteopenia.' },
        { type: 'multi', q: 'In osteopenia, which FRAX results justify starting treatment?',
          answers: ['Hip fracture risk 3% or more', 'Major fracture risk 20% or more'],
          distractors: ['Any FRAX above 1%', 'Age over 60 alone', 'Hip risk 1.5%'],
          why: 'This is the third route to treatment, alongside a T-score of −2.5 or below and a fragility fracture. The ten-year probabilities are calculated from the T-score plus the clinical risk factors.' }
      ]
    },

    {
      id: 'en-osteo-tx',
      subject: 'Endocrine & Metabolism',
      topic: 'Calcium & Bone',
      name: 'OSTEOPOROSIS: RX',
      blurb: 'Bisphosphonates and their rules, denosumab, and the anabolic tier',
      cards: [
        { type: 'recall', q: 'First-line drug for osteoporosis at high fracture risk?', a: 'An oral bisphosphonate',
          why: 'Alendronate or risedronate. They bind to bone and slow the osteoclasts that resorb it, and they are cheap and well studied.' },
        { type: 'recall', q: 'How is an oral bisphosphonate taken?', a: 'Fasting, with water, upright for 30–60 minutes',
          why: 'First thing in the morning with a full glass of plain water and nothing else, then staying upright before eating or drinking. Food blocks absorption almost completely, and lying down lets the tablet sit in the esophagus and burn it.' },
        { type: 'multi', q: 'Which conditions rule out an oral bisphosphonate?',
          answers: ['Achalasia or stricture', 'Barrett esophagus', 'Cannot sit upright 30 min', 'Prior gastric bypass'],
          distractors: ['Hypertension', 'Type 2 diabetes'],
          why: 'Anything that keeps the tablet in the esophagus or alters absorption. Severe esophagitis on the drug is also a reason to stop. These patients switch to yearly IV zoledronic acid or denosumab 60 mg every six months.' },
        { type: 'number', q: 'Bisphosphonates are contraindicated below what creatinine clearance?', values: [30, 35], join: '–', unit: 'mL/min',
          why: 'Oral and intravenous alike. In severe kidney disease denosumab is used instead, with close watching for hypocalcemia.' },
        { type: 'recall', q: 'Why can denosumab be used in severe kidney disease when bisphosphonates cannot?', a: 'It is an antibody, not cleared by the kidney',
          why: 'Denosumab is a monoclonal antibody against RANKL that is broken down like any protein, so renal function does not affect its clearance. Bisphosphonates leave through the kidney and accumulate when it fails. The caution with denosumab in CKD is hypocalcemia.' },
        { type: 'number', q: 'Consider a drug holiday after how many years of an oral bisphosphonate?', value: 5, unit: 'years',
          why: 'Or three years of IV zoledronic acid, in a moderate-risk patient with a T-score above −2.5 and no fractures. The pause reduces the rare risks of jaw osteonecrosis and atypical femur fractures; the drug stays in bone and keeps working for a while.' },
        { type: 'truefalse', q: 'Denosumab can be paused for a drug holiday like a bisphosphonate.', a: false,
          why: 'Stopping it causes a rebound in bone turnover and a burst of vertebral fractures within months. If it has to stop, the patient is moved straight onto a bisphosphonate.' },
        { type: 'recall', q: 'Why does stopping denosumab cause rebound fractures?', a: 'Suppressed osteoclasts rebound and resorb fast',
          why: 'Denosumab does not stay in bone; it blocks RANKL only while it is in the blood. When it clears, the osteoclasts it had held back come back in excess and bone turnover overshoots, dissolving the gained bone quickly. A bisphosphonate given at that point blunts the surge.' },
        { type: 'multi', q: 'Which findings put a patient in the very-high fracture risk group?',
          answers: ['T-score below −3.0', 'Fragility fracture in past year', 'Multiple fragility fractures', 'Fracture on osteoporosis therapy'],
          distractors: ['T-score −2.6', 'Age over 65'],
          why: 'Also a very high FRAX: 4.5% or more for hip or 30% or more for a major fracture. Very-high risk changes the first drug from a bisphosphonate to an anabolic agent.' },
        { type: 'recall', q: 'First-line treatment for very-high fracture risk?', a: 'An anabolic agent such as teriparatide',
          why: 'Teriparatide or abaloparatide, daily injections for up to two years, build new bone by stimulating osteoblasts; romosozumab is the one-year alternative. Starting with an antiresorptive in these patients leaves them under-treated.' },
        { type: 'recall', q: 'Why must an anabolic course be followed by a bisphosphonate or denosumab?', a: 'Otherwise the new bone is lost again',
          why: 'Anabolic agents build bone only while they are given; after they stop, resorption takes the gains away within a year or two. An antiresorptive afterward locks in the new bone.' },
        { type: 'recall', q: 'Which osteoporosis drug is avoided after a heart attack or stroke in the past year?', a: 'Romosozumab',
          why: 'The sclerostin inhibitor carried a signal for cardiovascular events in its trials. Teriparatide or abaloparatide are used instead in those patients.' }
      ]
    },

    {
      id: 'en-ai',
      subject: 'Endocrine & Metabolism',
      topic: 'Adrenal & Pituitary',
      name: 'ADRENAL FAILURE',
      blurb: 'Primary versus secondary, replacement, sick days and the crisis',
      cards: [
        { type: 'multi', q: 'Which features point to primary rather than secondary adrenal insufficiency?',
          answers: ['Hyperpigmentation', 'Hyperkalemia', 'Salt craving'],
          distractors: ['Hyponatremia', 'Fatigue'],
          why: 'In primary disease the whole cortex is destroyed, so aldosterone goes too: potassium rises, salt is craved, and the volume depletion is worse. The high ACTH darkens the skin. Hyponatremia and fatigue occur in both, because cortisol deficiency alone impairs water excretion.' },
        { type: 'recall', q: 'Why does primary adrenal insufficiency darken the skin?', a: 'ACTH is made alongside melanocyte-stimulating hormone',
          why: 'With no cortisol to feed back, the pituitary pours out pro-opiomelanocortin, which is cut into ACTH and alpha-MSH together. The MSH drives pigment into sun-exposed skin, palmar creases, knuckles, elbows and the lining of the mouth. In secondary disease ACTH is low, so there is no pigmentation.' },
        { type: 'recall', q: 'Why is the potassium normal in secondary adrenal insufficiency?', a: 'The renin-aldosterone system is intact',
          why: 'Aldosterone is controlled by renin and potassium, not by ACTH. When the problem is in the pituitary, the adrenal still makes aldosterone normally, so potassium is handled and there is no hyperkalemia.' },
        { type: 'recall', q: 'Confirmatory test for adrenal insufficiency?', a: 'Cosyntropin stimulation test',
          why: '250 µg of synthetic ACTH; a cortisol that fails to reach 18 to 20 µg/dL at 30 or 60 minutes confirms the diagnosis. An 8 AM cortisol under 3 to 5 with a plasma ACTH more than twice the upper limit points to primary disease before the test is even done.' },
        { type: 'recall', q: 'Preferred glucocorticoid for chronic replacement in Addison disease?', a: 'Hydrocortisone in two or three doses',
          why: '15 to 25 mg a day, for example 10 mg on waking and 5 mg in the early afternoon. Its short half-life mimics the normal daily rhythm of cortisol better than prednisone or dexamethasone. A mineralocorticoid, fludrocortisone 0.05 to 0.2 mg daily, is given as well.' },
        { type: 'recall', q: 'What guides hydrocortisone dose changes in Addison disease?', a: 'Symptoms and signs, not cortisol or ACTH levels',
          why: 'Weight, blood pressure, energy and the absence of nausea are the guide. Serum or salivary cortisol, ACTH levels, repeat stimulation tests and adrenal imaging do not reflect the adequacy of replacement and should not be used to change the dose.' },
        { type: 'mcq', q: 'Addison patient on hydrocortisone 10 mg and 5 mg has fatigue, nausea and weight loss. Next step?',
          a: 'Raise the dose by 2.5–5 mg', distractors: ['Check a serum cortisol', 'Repeat the cosyntropin test', 'Order an adrenal CT'],
          why: 'Those are the signs of under-replacement, and the response is a small increase in the daily dose with a clinical review in a week. None of the tests would answer the question.' },
        { type: 'number', q: 'By what factor is hydrocortisone increased during a febrile illness in a patient on replacement?', low: 2, high: 3, unit: 'times the dose',
          why: 'Doubled or tripled for two to three days during a febrile illness, gastroenteritis or minor surgery. Patients also carry an intramuscular hydrocortisone autoinjector for when they cannot keep tablets down, and wear a medical alert bracelet.' },
        { type: 'recall', q: 'Known Addison disease, now vomiting and hypotensive, with hyponatremia and hyperkalemia. Diagnosis?', a: 'Adrenal crisis',
          why: 'Intercurrent illness or missed doses leave a patient with no cortisol or aldosterone reserve. The potassium is high because this is primary disease; a crisis from steroid withdrawal or pituitary failure spares the potassium. Treat on suspicion, before any cortisol result.' },
        { type: 'recall', q: 'First drug in a suspected adrenal crisis?', a: 'IV hydrocortisone 100 mg',
          why: 'Given at once with rapid IV saline, then 50 mg every six hours or an infusion. Draw cortisol and ACTH before the dose if you can, but never wait for them. If the diagnosis is still open, dexamethasone 4 mg is the alternative that does not interfere with a later cortisol assay, though it has no mineralocorticoid effect.' },
        { type: 'recall', q: 'Why isn\'t fludrocortisone needed during an adrenal crisis?', a: 'High-dose hydrocortisone acts as a mineralocorticoid',
          why: 'At 50 mg a day or more, hydrocortisone saturates the renal enzyme that normally inactivates it, and it occupies the aldosterone receptor directly. Fludrocortisone is restarted once the dose comes back down.' },
        { type: 'multi', q: 'Which harms rise after even a short course of oral steroids?',
          answers: ['Sepsis', 'Venous thromboembolism', 'Fractures', 'Mood and sleep disturbance'],
          distractors: ['Hypokalemia alone', 'Hair loss'],
          why: 'Cohort studies of courses under two to four weeks found sepsis about five times more likely, venous thromboembolism three times, and fractures nearly twice, in the following 30 days, along with insomnia, mania, anxiety, hyperglycemia and raised blood pressure. A prednisone burst for bronchitis is not free.' }
      ]
    },

    {
      id: 'en-adrenal',
      subject: 'Endocrine & Metabolism',
      topic: 'Adrenal & Pituitary',
      name: 'ALDO & MASSES',
      blurb: 'Screening for Conn syndrome, and the two questions for every adrenal mass',
      cards: [
        { type: 'multi', q: 'Who is screened for primary hyperaldosteronism?',
          answers: ['Resistant hypertension', 'Hypertension with hypokalemia', 'Hypertension + adrenal mass', 'Hypertension with sleep apnea'],
          distractors: ['Any new hypertension', 'Isolated hypokalemia'],
          why: 'Resistant means uncontrolled on three drugs including a diuretic, or controlled on four. A family history of early hypertension or stroke under 40 also qualifies. More than half of patients have a normal potassium, so hypokalemia is a trigger, not a requirement.' },
        { type: 'recall', q: 'Aldosterone-to-renin ratio that screens positive?', a: 'Above 20–30, with aldosterone of 10–15 or more',
          why: 'A morning sample. A positive screen is confirmed with oral sodium loading or a saline infusion test, then the side is determined with adrenal CT and adrenal vein sampling before any surgery.' },
        { type: 'number', q: 'Stop spironolactone how long before an aldosterone-to-renin ratio?', values: [4, 6], join: '–', unit: 'weeks',
          why: 'Mineralocorticoid antagonists, potassium-wasting diuretics and amiloride all raise renin and falsify the ratio. ACE inhibitors, ARBs, calcium channel blockers and beta-blockers can usually stay for the initial screen.' },
        { type: 'recall', q: 'Which antihypertensives can be continued during aldosterone screening?', a: 'Most: ACE inhibitors, ARBs, CCBs',
          why: 'Beta-blockers too. If a result is borderline the patient is switched to drugs that do not touch the system: slow-release verapamil, hydralazine, doxazosin or prazosin. The ones that must stop are spironolactone, eplerenone, amiloride and potassium-wasting diuretics.' },
        { type: 'recall', q: 'Two questions for every adrenal incidentaloma of 1 cm or more?', a: 'Is it functional, and is it malignant?',
          why: 'Both are asked in parallel. Function is tested with hormones; malignancy is judged from the size and the CT appearance. The answers decide between observation and adrenalectomy.' },
        { type: 'recall', q: 'Screening test for cortisol excess in an adrenal incidentaloma?', a: '1-mg overnight dexamethasone test',
          why: 'One milligram at 11 PM, cortisol at 8 AM; 1.8 µg/dL or less is normal. Every incidentaloma gets this. Metanephrines are added unless the CT already excludes pheochromocytoma, and an aldosterone-to-renin ratio is added if the patient is hypertensive or hypokalemic.' },
        { type: 'number', q: 'Unenhanced CT attenuation at or below which an adrenal incidentaloma is a lipid-rich adenoma?', value: 10, unit: 'HU',
          why: 'Pheochromocytomas are dense, vascular tumors and do not measure that low. A smooth, homogeneous mass under 4 cm with an attenuation of 10 Hounsfield units or less is a benign adenoma, and metanephrines add nothing.' },
        { type: 'multi', q: 'Which adrenal incidentaloma features call for adrenalectomy?',
          answers: ['Hormonally functional', '4 cm or larger', 'Lipid-poor (>20 HU)', 'Growth >5 mm a year'],
          distractors: ['2 cm, ≤10 HU', 'Any mass over 1 cm'],
          why: 'A pheochromocytoma, an aldosterone-producing or cortisol-producing adenoma is removed whatever its size. Size over 4 cm, high attenuation, heterogeneity or necrosis, and rapid growth all raise the chance of adrenocortical carcinoma.' },
        { type: 'truefalse', q: 'An adrenal mass should be biopsied with fine-needle aspiration to establish the diagnosis.', a: false,
          why: 'Biopsy cannot tell a benign adenoma from an adrenocortical carcinoma, and sticking a needle into an unsuspected pheochromocytoma can set off a fatal hypertensive crisis. The one exception is confirming a metastasis in a patient with a known cancer, after pheochromocytoma has been excluded biochemically.' },
        { type: 'recall', q: 'A 3-cm homogeneous adrenal mass at 15 HU in a hypertensive patient. Next step?', a: 'Adrenal-protocol CT plus hormone testing',
          why: 'Between 2 and 4 cm with intermediate attenuation is indeterminate. A washout CT or chemical-shift MRI characterizes it, while the dexamethasone test, metanephrines and an aldosterone-to-renin ratio check function. If it is nonfunctional and stable it is re-imaged in 6 to 12 months.' }
      ]
    },

    {
      id: 'en-pit',
      subject: 'Endocrine & Metabolism',
      topic: 'Adrenal & Pituitary',
      name: 'PITUITARY & GONADS',
      blurb: 'Prolactinoma, acromegaly, diabetes insipidus and low testosterone',
      cards: [
        { type: 'recall', q: 'Galactorrhea, amenorrhea and bitemporal hemianopsia. Likely cause?', a: 'A prolactinoma',
          why: 'The commonest functioning pituitary tumor. The visual field loss means a macroadenoma of 10 mm or more pressing on the optic chiasm. In men it presents with low libido, erectile dysfunction and headache.' },
        { type: 'multi', q: 'Before imaging the pituitary for a raised prolactin, which causes are excluded?',
          answers: ['Pregnancy', 'Primary hypothyroidism', 'Renal failure', 'Dopamine-antagonist drugs'],
          distractors: ['Diabetes', 'Hyperthyroidism'],
          why: 'Each raises prolactin without a tumor. The drugs are risperidone, haloperidol, metoclopramide and verapamil. Only once these are excluded is a gadolinium-enhanced pituitary MRI ordered.' },
        { type: 'recall', q: 'Why does primary hypothyroidism raise prolactin?', a: 'TRH stimulates prolactin release',
          why: 'When the thyroid fails, the hypothalamus makes more thyrotropin-releasing hormone to drive the TSH up, and TRH also acts on the lactotrophs. Treating the hypothyroidism normalizes the prolactin; no MRI is needed.' },
        { type: 'mcq', q: 'Prolactinoma with visual field loss. First-line treatment?',
          a: 'Cabergoline', distractors: ['Transsphenoidal surgery', 'Radiation', 'Bromocriptine'],
          why: 'Prolactinomas are the one pituitary tumor treated medically first, even when they are large enough to press on the chiasm. Cabergoline normalizes prolactin, restores menses and shrinks the tumor by 50 to 80%, and it is more effective and better tolerated than bromocriptine.' },
        { type: 'recall', q: 'Why is a prolactinoma the one pituitary tumor not sent to surgery first?', a: 'Dopamine agonists shrink it reliably',
          why: 'Lactotrophs are directly inhibited by dopamine, so a dopamine agonist both stops the hormone and shrinks the tumor, usually within weeks. Other adenomas have no drug that reliably reduces their size, so they go to transsphenoidal surgery.' },
        { type: 'recall', q: 'Best screening test for acromegaly?', a: 'Serum IGF-1',
          why: 'IGF-1 reflects growth hormone output over the whole day. A raised level is confirmed with an oral glucose tolerance test in which growth hormone fails to suppress below 1 ng/mL, then a pituitary MRI, then transsphenoidal resection.' },
        { type: 'recall', q: 'Why is a random growth hormone level useless for acromegaly?', a: 'GH is pulsatile with a 20-minute half-life',
          why: 'Growth hormone is released in bursts and disappears quickly, so a single value can be high in a normal person and low in a patient between pulses. IGF-1 is produced steadily in response to the integrated signal.' },
        { type: 'multi', q: 'Which features suggest acromegaly?',
          answers: ['Growing ring or shoe size', 'Bilateral carpal tunnel', 'Obstructive sleep apnea', 'Frontal bossing'],
          distractors: ['Weight loss', 'Heat intolerance'],
          why: 'Soft tissue and bone grow slowly over years: coarse features, prognathism, a large tongue, sweating, skin tags, joint pain. The internal effects are hypertension, diabetes, cardiomyopathy and colon polyps.' },
        { type: 'recall', q: 'Polyuria and thirst that continue, with a rising sodium, when fluids are withheld. Diagnosis?', a: 'Diabetes insipidus',
          why: 'More than three liters a day of dilute urine, osmolality under 300 and specific gravity under 1.005, with nocturia. In primary polydipsia, restricting fluid concentrates the urine and the polyuria stops; in diabetes insipidus it continues and the patient becomes hypernatremic.' },
        { type: 'recall', q: 'Most common cause of nephrogenic diabetes insipidus in adults?', a: 'Chronic lithium',
          why: 'Lithium enters the collecting duct cells and blocks the signaling that puts aquaporin-2 water channels in place, so the kidney cannot respond to vasopressin. It affects 20 to 40% of long-term users. Hypercalcemia, severe hypokalemia and demeclocycline do the same.' },
        { type: 'recall', q: 'Treatment for lithium-induced nephrogenic diabetes insipidus?', a: 'Amiloride',
          why: 'Along with a low-sodium diet and a thiazide, which paradoxically reduce urine volume. Desmopressin does not work, because the kidney cannot respond to it.' },
        { type: 'recall', q: 'Why does amiloride help lithium-induced diabetes insipidus?', a: 'It blocks lithium entry into the collecting duct',
          why: 'Lithium gets into the principal cells through the epithelial sodium channel, which is exactly what amiloride blocks. Keeping lithium out of the cells lets the aquaporin channels return.' },
        { type: 'recall', q: 'Urine osmolality rises by more than 50% after desmopressin. Which type of diabetes insipidus?', a: 'Central',
          why: 'The kidney responds, so the problem is a lack of the hormone: injury to the hypothalamus or posterior pituitary from surgery, head trauma, a craniopharyngioma or sarcoidosis. Intranasal or oral desmopressin is the treatment.' },
        { type: 'recall', q: 'Most specific physical sign of true androgen deficiency in a man?', a: 'Loss of axillary and pubic hair',
          why: 'Fatigue, low mood, weight gain and erectile dysfunction are common and nonspecific. Loss of body hair, fewer morning erections, small testes under 15 mL, gynecomastia and loss of muscle and bone are the findings that mean real deficiency.' },
        { type: 'recall', q: 'How is male hypogonadism confirmed?', a: 'Two morning fasting testosterone levels under 300',
          why: 'Drawn between 8 and 10 AM, because testosterone peaks in the morning and is lowered by food and acute illness. LH and FSH then sort primary testicular failure, with high levels as in Klinefelter syndrome, from a pituitary cause, with low or normal levels, which leads to a prolactin, iron studies and a pituitary MRI.' },
        { type: 'multi', q: 'Which conditions contraindicate testosterone replacement?',
          answers: ['Desire for fertility soon', 'Prostate cancer', 'Hematocrit above 50–54%', 'Untreated severe sleep apnea'],
          distractors: ['Type 2 diabetes', 'Mild depression'],
          why: 'Also an unevaluated PSA above 4 or a prostate nodule, breast cancer, uncontrolled heart failure, and a heart attack or stroke within six months. Testosterone drives red cell production, so a high hematocrit climbs further.' },
        { type: 'recall', q: 'Why does testosterone replacement cause infertility?', a: 'It suppresses GnRH, LH and FSH',
          why: 'The pituitary reads the external testosterone as plenty and stops the signals that drive the testes, so sperm production falls to zero. A man who wants children soon is given hCG or clomiphene instead, which stimulate his own production.' }
      ]
    },

    /* ═══════════════ GI & Hepatology ═══════════════
       From the user's ITE gastroenterology study guide, module by module. */

    {
      id: 'gi-dysphagia',
      subject: 'GI & Hepatology',
      topic: 'Esophagus & Stomach',
      name: 'DYSPHAGIA',
      blurb: 'Transfer versus esophageal, motility versus mechanical, and each cause',
      cards: [
        { type: 'recall', q: 'Coughing or choking the moment a swallow starts, with nasal regurgitation. Which type of dysphagia?', a: 'Oropharyngeal (transfer) dysphagia',
          why: 'The problem is getting the bolus out of the mouth and past the pharynx, which is neuromuscular: stroke, Parkinson disease, ALS, myasthenia gravis, polymyositis. Esophageal dysphagia is felt lower and a few seconds later, as food sticking behind the sternum.' },
        { type: 'recall', q: 'First test for oropharyngeal dysphagia?', a: 'Modified barium swallow',
          why: 'A videofluoroscopic swallowing study watches the bolus move in real time and shows aspiration and where the transfer fails. Endoscopy and manometry look at the esophagus, which is not where the problem is.' },
        { type: 'recall', q: 'What separates a motility disorder from a mechanical obstruction in esophageal dysphagia?', a: 'Solids and liquids from the start, versus solids only',
          why: 'A narrowed lumen lets liquids through and catches solids first, then liquids later as it tightens. A muscle or nerve problem fails for both from the beginning, because the esophagus cannot propel anything.' },
        { type: 'recall', q: 'Dysphagia to solids and liquids from the outset, regurgitation of undigested food and weight loss. Likely cause?', a: 'Achalasia',
          why: 'The inhibitory neurons of the myenteric plexus degenerate, so the lower sphincter cannot relax and the body of the esophagus stops contracting. Food sits above the sphincter, comes back bland and undigested, and causes nocturnal cough from aspiration.' },
        { type: 'recall', q: 'Gold standard test for achalasia?', a: 'High-resolution esophageal manometry',
          why: 'It shows absent peristalsis and a sphincter that does not relax. A barium esophagram shows the dilated esophagus tapering to a bird\'s beak and is often done first, but manometry makes the diagnosis.' },
        { type: 'recall', q: 'Why is endoscopy done before treating presumed achalasia?', a: 'To rule out cancer at the GE junction',
          why: 'An adenocarcinoma at the gastroesophageal junction can infiltrate the sphincter and mimic achalasia exactly, on barium and on manometry. Pseudoachalasia is the concern especially in a patient over 50 with rapid weight loss, and treating it with a myotomy would be a disaster.' },
        { type: 'multi', q: 'Which are definitive treatments for achalasia?',
          answers: ['Laparoscopic Heller myotomy', 'Peroral endoscopic myotomy', 'Pneumatic dilation'],
          distractors: ['Daily PPI', 'Botulinum toxin first-line'],
          why: 'All three disrupt the lower sphincter mechanically. Botulinum toxin injection, nifedipine and nitrates give temporary relief and are kept for patients who are too frail for a procedure.' },
        { type: 'recall', q: 'A young man with asthma and eczema has a piece of steak stuck in his esophagus. Likely cause?', a: 'Eosinophilic esophagitis',
          why: 'An allergic, Th2-driven inflammation of the esophageal lining in young atopic patients, presenting as intermittent solid dysphagia or acute food impaction. Endoscopy shows stacked rings, linear furrows, white exudates and sometimes strictures.' },
        { type: 'number', q: 'Eosinophils per high-power field that diagnose eosinophilic esophagitis on biopsy?', value: 15, unit: '/hpf',
          why: 'Biopsies are taken even when the mucosa looks normal, because the count is what makes the diagnosis.' },
        { type: 'recall', q: 'First-line medical treatment for eosinophilic esophagitis?', a: 'Swallowed topical steroids',
          why: 'Oral budesonide suspension or fluticasone puffs swallowed without a spacer, and/or a high-dose PPI. A six-food elimination diet (milk, wheat, egg, soy, nuts, seafood) is the dietary route. Dupilumab is for refractory disease and strictures are dilated.' },
        { type: 'recall', q: 'Intermittent solid-food dysphagia with occasional meat impaction that never worsens. Likely cause?', a: 'Schatzki ring',
          why: 'A thin mucosal ring at the squamocolumnar junction. It catches a large bolus now and then, the "steakhouse syndrome", but does not progress. Treated with endoscopic dilation and a PPI.' },
        { type: 'recall', q: 'Steadily progressive solid-food dysphagia in a patient with years of severe reflux. Likely cause?', a: 'Peptic stricture',
          why: 'Chronic acid injury lays down concentric collagen in the distal esophagus. It is dilated endoscopically and the patient stays on a daily PPI for life to stop it re-forming.' },
        { type: 'recall', q: 'Why is every esophageal stricture biopsied?', a: 'To exclude adenocarcinoma',
          why: 'A malignant stricture can look like a benign peptic one, and both occur in the same reflux patients. Dilating a cancer without diagnosing it delays treatment that is time-critical.' },
        { type: 'recall', q: 'Dysphagia progressing from solids to liquids over weeks, with weight loss and iron deficiency. Likely cause?', a: 'Esophageal cancer',
          why: 'Adenocarcinoma of the distal third arising from Barrett esophagus is the common type in the US; squamous cell cancer of the upper and middle thirds follows heavy smoking and alcohol. Endoscopy with biopsy confirms it and endoscopic ultrasound with PET-CT stages it.' },
        { type: 'recall', q: 'Foul breath, gurgling in the neck, and regurgitation of old food hours after eating in a 70-year-old. Likely cause?', a: 'Zenker diverticulum',
          why: 'A pouch of mucosa pushed out through Killian triangle above the upper sphincter when the cricopharyngeus fails to relax. It is diagnosed with a barium esophagram and treated with cricopharyngeal myotomy and removal or suspension of the pouch.' },
        { type: 'recall', q: 'Why is a blind nasogastric tube dangerous in a patient with a Zenker diverticulum?', a: 'The tube can enter and perforate the pouch',
          why: 'The pouch sits in line with the path of a tube or endoscope, and its wall is only mucosa and submucosa. Anything passed blindly can lodge in it and push through. The same caution applies to endoscopy.' }
      ]
    },

    {
      id: 'gi-gerd',
      subject: 'GI & Hepatology',
      topic: 'Esophagus & Stomach',
      name: 'GERD & H. PYLORI',
      blurb: 'Reflux treatment, Barrett surveillance, dyspepsia triage and eradication',
      cards: [
        { type: 'recall', q: 'Heartburn twice a week with no alarm features. First treatment?', a: 'An 8-week trial of a daily PPI',
          why: 'Taken 30 to 60 minutes before the first meal, with weight loss, raising the head of the bed, no meals within three hours of bedtime, and avoiding tobacco, alcohol, chocolate, peppermint and fatty food.' },
        { type: 'recall', q: 'Why isn\'t famotidine first-line for GERD?', a: 'Tachyphylaxis within weeks and less healing',
          why: 'H2 blockers lose much of their effect within two to six weeks as the stomach adapts, and they heal erosive esophagitis far less reliably than a scheduled PPI. As-needed PPI dosing also underperforms a daily dose.' },
        { type: 'multi', q: 'Which alarm features in GERD mean prompt endoscopy?',
          answers: ['Dysphagia', 'Unintentional weight loss', 'GI bleeding or anemia', 'Persistent vomiting'],
          distractors: ['Nocturnal heartburn', 'Symptoms twice a week'],
          why: 'Odynophagia and a palpable epigastric mass are the others. Any of these can mean a stricture, cancer or an ulcer, so the empiric PPI trial is skipped and the esophagus is looked at.' },
        { type: 'recall', q: 'Who is screened with endoscopy for Barrett esophagus?', a: 'GERD for 5+ years plus 3 risk factors',
          why: 'The risk factors are male sex, age over 50, White race, central obesity, current or past smoking, and a first-degree relative with Barrett or esophageal adenocarcinoma.' },
        { type: 'recall', q: 'What on biopsy defines Barrett esophagus?', a: 'Intestinal metaplasia with goblet cells',
          why: 'Salmon-colored columnar lining extending at least 1 cm above the gastroesophageal junction, with the biopsy showing the stomach-type lining has become intestine-type. The goblet cells are the diagnostic feature.' },
        { type: 'match', q: 'Match the Barrett biopsy result to its management', pairs: [
          { left: 'No dysplasia', right: 'EGD every 3–5 years' },
          { left: 'Low-grade dysplasia', right: 'Ablation or EGD 6–12 mo' },
          { left: 'High-grade dysplasia', right: 'EMR then ablation' }
        ] },
        { type: 'number', q: 'Age at which uninvestigated dyspepsia goes straight to endoscopy even without alarm features?', value: 60, unit: 'years',
          why: 'At 60 and over, or at any age with alarm features, endoscopy comes first to exclude gastric and esophageal cancer. Under 60 without alarm features the approach is test-and-treat for H. pylori.' },
        { type: 'recall', q: 'Dyspepsia at 45 with no alarm features. First step?', a: 'Test and treat for H. pylori',
          why: 'With a urea breath test or a monoclonal stool antigen, both over 90% sensitive and specific for active infection. If the test is negative, a four to eight week trial of a daily PPI follows.' },
        { type: 'recall', q: 'Why isn\'t H. pylori serology used?', a: 'It can\'t tell active from past infection',
          why: 'Antibodies stay positive for years after the organism is gone, so a positive result has a low positive predictive value and would lead to treating people who are no longer infected. Guidelines recommend against ordering it.' },
        { type: 'number', q: 'How long before an H. pylori breath or stool test must a PPI be stopped?', value: 2, unit: 'weeks',
          why: 'Antibiotics and bismuth are stopped for four weeks. Both suppress the organism enough to give a false negative. H2 blockers and antacids can bridge the symptoms until 24 to 48 hours before the test.' },
        { type: 'recall', q: 'Preferred first-line regimen for H. pylori?', a: 'Bismuth quadruple therapy, 10–14 days',
          why: 'A standard-dose PPI twice daily, bismuth four times daily, tetracycline 500 mg four times daily and metronidazole 500 mg three or four times daily.' },
        { type: 'recall', q: 'Why is clarithromycin triple therapy no longer the default?', a: 'Resistance now exceeds 15–20%',
          why: 'Clarithromycin resistance across North America has climbed past the level at which the regimen reliably works. It is used only where local resistance is documented under 15% and the patient has never had a macrolide for any reason.' },
        { type: 'recall', q: 'After H. pylori treatment, what must every patient have?', a: 'A test of cure four or more weeks later',
          why: 'With a breath test or stool antigen, after holding the PPI for two weeks. Rising resistance means a meaningful fraction of first courses fail, and an untreated infection carries on toward ulcers and gastric cancer.' }
      ]
    },

    {
      id: 'gi-ugib',
      subject: 'GI & Hepatology',
      topic: 'Esophagus & Stomach',
      name: 'UPPER GI BLEED',
      blurb: 'Resuscitation, the PPI, the transfusion threshold, varices and the perforated ulcer',
      cards: [
        { type: 'recall', q: 'Melena with a BUN-to-creatinine ratio of 25. Where is the bleeding from?', a: 'The upper GI tract',
          why: 'Melena is black, tarry stool from digested blood. A ratio above 20 to 30 supports an upper source; a brisk upper bleed can also present as red blood per rectum with hemodynamic instability.' },
        { type: 'number', q: 'BUN-to-creatinine ratio above which a GI bleed is likely from an upper source?', value: 20, unit: 'ratio',
          why: 'Blood in the small bowel is digested and its protein absorbed as urea, so BUN rises while creatinine does not. Above 20 favors an upper source and above 30 is strongly suggestive. A lower bleed adds no urea, so the ratio stays normal.' },
        { type: 'recall', q: 'Why does an upper GI bleed raise the BUN out of proportion to the creatinine?', a: 'Blood proteins are digested and reabsorbed',
          why: 'Blood in the small intestine is broken down into amino acids and absorbed, and the liver turns the nitrogen into urea. Blood that enters below the small bowel is not digested, so a colonic bleed does not raise the BUN.' },
        { type: 'multi', q: 'Before endoscopy for a non-variceal upper GI bleed, what is done?',
          answers: ['Two large IVs, crystalloid', 'High-dose IV PPI', 'Transfuse only if Hb ≤7', 'IV erythromycin before EGD'],
          distractors: ['Octreotide', 'Transfuse to Hb 10'],
          why: 'Two 18-gauge or larger lines with Ringer\'s or saline, an 80 mg bolus of pantoprazole or esomeprazole on arrival, a restrictive transfusion threshold, and erythromycin 250 mg 30 to 90 minutes before the scope to empty the stomach of clot.' },
        { type: 'recall', q: 'Why is a high-dose PPI given before endoscopy for an upper GI bleed?', a: 'Acid dissolves the clot over the bleeding vessel',
          why: 'Acid and pepsin break down the platelet plug that has sealed the vessel. Raising the gastric pH above 6 lets that clot hold, downgrades the high-risk appearances the endoscopist would otherwise find, such as a spurting vessel, and reduces the need for endoscopic treatment.' },
        { type: 'number', q: 'Transfusion threshold in a hemodynamically stable patient with an upper GI bleed?', value: 7, unit: 'g/dL',
          why: 'Raised to 8 in patients with coronary disease, an acute coronary syndrome or recent bypass surgery. Transfusing more liberally than this increases rebleeding and mortality.' },
        { type: 'recall', q: 'Why does transfusing above a hemoglobin of 7 worsen outcomes in a GI bleed?', a: 'It raises portal and splanchnic pressure',
          why: 'Extra volume raises pressure in the portal and splanchnic vessels, including at the bleeding site, so the clot that has sealed the bleeding vessel is more likely to be pushed off. The trials showed more rebleeding and more deaths with a liberal threshold.' },
        { type: 'number', q: 'Endoscopy for an upper GI bleed should happen within how many hours?', value: 24, unit: 'hours',
          why: 'After the patient has been resuscitated. A suspected variceal bleed in a cirrhotic is scoped sooner, within 12 hours.' },
        { type: 'multi', q: 'A cirrhotic presents with hematemesis. What is added to the standard bleed care?',
          answers: ['IV octreotide', 'IV ceftriaxone', 'EGD within 12 hours'],
          distractors: ['Higher transfusion target', 'IV vitamin K first'],
          why: 'Octreotide, a bolus then infusion for three to five days, lowers splanchnic blood flow and portal pressure. Ceftriaxone 1 g daily for up to seven days. The transfusion threshold stays at 7, because more volume means more portal pressure. Band ligation is done at the early endoscopy.' },
        { type: 'recall', q: 'Why do cirrhotics with a variceal bleed get prophylactic antibiotics?', a: 'They cut infections, rebleeding and death',
          why: 'Gut bacteria cross into the bloodstream during a variceal bleed, and the resulting infections drive rebleeding and mortality. A short course of ceftriaxone reduces all three, which is why it is given to every cirrhotic with an upper GI bleed, not only those who look infected.' },
        { type: 'recall', q: 'Imaging of choice for a suspected perforated peptic ulcer?', a: 'CT of the abdomen and pelvis',
          why: 'CT is about 98% sensitive for free intraperitoneal air and shows where the perforation is. Upright plain films miss 15 to 30% of perforations, particularly retroperitoneal duodenal ones, and do not localize them.' },
        { type: 'recall', q: 'Why is endoscopy contraindicated when a perforated ulcer is suspected?', a: 'Insufflated air can cause tension pneumoperitoneum',
          why: 'The endoscope inflates the stomach to see. Air pushed through a hole converts a contained leak into free peritonitis and a tense abdomen. The diagnosis is made with CT and the patient goes to surgery.' },
        { type: 'recall', q: 'Definitive treatment for a perforated peptic ulcer?', a: 'Surgical repair with an omental patch',
          why: 'The Graham patch closes the hole with a piece of omentum. Laparotomy is reserved for repair after CT confirmation, or for a patient too unstable to image.' }
      ]
    },

    {
      id: 'gi-bariatric',
      subject: 'GI & Hepatology',
      topic: 'Bariatric & Nutrition',
      name: 'BARIATRIC SURGERY',
      blurb: 'Which operation, and the two kinds of dumping',
      cards: [
        { type: 'recall', q: 'Which bariatric operation gives the most weight loss and the highest diabetes remission?', a: 'Roux-en-Y gastric bypass',
          why: 'About 30 to 35% total body weight loss at two years against 25 to 28% for sleeve gastrectomy and 15% for a band. Bariatric surgery is the most effective long-term treatment for severe obesity, with remission of type 2 diabetes, hypertension, sleep apnea and fatty liver, and lower mortality.' },
        { type: 'recall', q: 'Why does gastric bypass improve diabetes beyond the weight loss?', a: 'Bypassing the duodenum boosts GLP-1 and PYY',
          why: 'Food reaches the jejunum quickly and undigested, which drives a much larger release of the gut hormones that stimulate insulin and suppress appetite. Glucose often improves within days of surgery, before any weight has come off.' },
        { type: 'truefalse', q: 'Sleeve gastrectomy is the preferred operation for a patient with severe GERD or Barrett esophagus.', a: false,
          why: 'The sleeve raises pressure in a narrow stomach tube and worsens reflux. Roux-en-Y bypass diverts acid away from the esophagus and is the choice when reflux is already a problem.' },
        { type: 'recall', q: 'Cramping, bloating, explosive diarrhea and palpitations 20 minutes after a meal, after a bypass. Diagnosis?', a: 'Early dumping syndrome',
          why: 'Concentrated food enters the small bowel at once and pulls fluid out of the circulation into the gut, distending the bowel and dropping the blood volume. Flushing, tachycardia and lightheadedness within 30 minutes of eating complete the picture.' },
        { type: 'recall', q: 'Sweating, tremor and confusion two hours after a meal, after a bypass. Diagnosis?', a: 'Late dumping syndrome',
          why: 'Reactive hypoglycemia, with a glucose under 55 to 60 one to three hours after eating, relieved by glucose. It is the Whipple triad occurring after meals.' },
        { type: 'recall', q: 'Why does late dumping cause hypoglycemia?', a: 'Rapid carbohydrate delivery triggers an insulin surge',
          why: 'Simple sugars hit the jejunum fast and provoke an exaggerated GLP-1 response and a burst of insulin that outlasts the glucose it was meant for. An hour or two later the glucose crashes.' },
        { type: 'multi', q: 'First-line measures for dumping syndrome?',
          answers: ['Six small meals a day', 'Cut out simple sugars', 'No liquids within 30 min of food', 'Protein and complex carbs'],
          distractors: ['Large low-fat meals', 'Drink with meals'],
          why: 'Smaller, slower, less sugary meals, with soluble fiber, and liquids kept apart from solids so the stomach does not flush its contents straight through. Diet alone controls most patients.' },
        { type: 'recall', q: 'Drug for late dumping when diet is not enough?', a: 'Acarbose',
          why: 'An alpha-glucosidase inhibitor that slows carbohydrate absorption and blunts the glucose spike that triggers the insulin surge. Subcutaneous octreotide is the alternative for either form of dumping.' }
      ]
    },

    {
      id: 'gi-nutrition',
      subject: 'GI & Hepatology',
      topic: 'Bariatric & Nutrition',
      name: 'VITAMINS & REFEEDING',
      blurb: 'What goes missing after surgery, refeeding syndrome, and cannabis hyperemesis',
      cards: [
        { type: 'recall', q: 'Which vitamin deficiency causes dry beriberi?', a: 'Thiamine',
          why: 'A symmetric distal sensory and motor neuropathy with burning feet, foot drop and lost reflexes. It follows persistent vomiting after bariatric surgery, hyperemesis gravidarum, alcohol use, or refeeding without thiamine.' },
        { type: 'number', q: 'Body stores of thiamine last how many days?', values: [18, 20], join: '–', unit: 'days',
          why: 'That is why a few weeks of vomiting after surgery is enough to produce beriberi or Wernicke encephalopathy, and why thiamine is given before glucose in any patient who may be depleted.' },
        { type: 'multi', q: 'Which make up the triad of Wernicke encephalopathy?',
          answers: ['Confusion', 'Nystagmus or lateral gaze palsy', 'Gait ataxia'],
          distractors: ['Peripheral edema', 'Macrocytosis'],
          why: 'Thiamine deficiency hitting the brain. Wet beriberi is the same deficiency hitting the heart: a high-output dilated cardiomyopathy with edema.' },
        { type: 'recall', q: 'Where is vitamin B12 absorbed?', a: 'The terminal ileum',
          why: 'Bound to intrinsic factor from the gastric parietal cells. Deficiency follows resection of the distal ileum, Crohn ileitis, Roux-en-Y bypass, pernicious anemia, a strict vegan diet and long-term metformin.' },
        { type: 'recall', q: 'Which lab separates B12 deficiency from folate deficiency?', a: 'Methylmalonic acid, high only in B12 deficiency',
          why: 'Homocysteine rises in both. Methylmalonic acid needs B12 specifically, so it rises only when B12 is short, and it catches the deficiency before the blood count changes.' },
        { type: 'recall', q: 'Lost vibration sense, a positive Romberg and spastic weakness with a macrocytic anemia. Diagnosis?', a: 'Subacute combined degeneration',
          why: 'B12 deficiency damaging the dorsal columns, which carry vibration and position sense, and the lateral corticospinal tracts, which give the spasticity. The anemia is megaloblastic with hypersegmented neutrophils, and glossitis often accompanies it.' },
        { type: 'multi', q: 'Which nutrients are absorbed in the duodenum, and so lost after a gastric bypass?',
          answers: ['Iron', 'Calcium', 'Copper'],
          distractors: ['Folate', 'Vitamin B12'],
          why: 'The bypass skips the duodenum, and celiac disease damages it. Folate is absorbed in the jejunum and B12 in the terminal ileum, so each deficiency points to a different stretch of bowel.' },
        { type: 'recall', q: 'B12-like myelopathy with a normal B12, neutropenia, and heavy zinc supplement use. Deficiency?', a: 'Copper',
          why: 'Excess zinc blocks copper absorption in the gut. Copper deficiency mimics subacute combined degeneration and adds a sideroblastic anemia and neutropenia. It is the answer when the picture says B12 but the level is normal.' },
        { type: 'multi', q: 'Who is at high risk for refeeding syndrome?',
          answers: ['BMI under 16', 'Weight loss >15% in 3–6 months', 'Little intake for over 10 days', 'Low phosphate before feeding'],
          distractors: ['BMI over 30', 'Recent steroid course'],
          why: 'The NICE criteria, along with anorexia nervosa, chronic alcohol use, and a low potassium or magnesium before feeding. The common thread is a body that has run its intracellular stores down.' },
        { type: 'recall', q: 'Why does refeeding cause a dangerous fall in phosphate?', a: 'Insulin drives phosphate into depleted cells',
          why: 'Starvation empties the cells of phosphate, potassium and magnesium while the blood levels stay deceptively normal. The first carbohydrate load releases insulin, which pulls all three into the cells at once. Without phosphate the cells cannot make ATP, and the heart, respiratory muscles and red cells fail.' },
        { type: 'recall', q: 'First step before feeding a severely malnourished patient?', a: 'Thiamine, at least 30 minutes before food',
          why: '100 to 300 mg a day with a multivitamin, continued for the first five to ten days. Phosphate, potassium and magnesium are checked and replaced before and during feeding, with levels every day for the first week.' },
        { type: 'number', q: 'Start nutrition in a high-risk refeeding patient at what fraction of estimated caloric needs?', values: [25, 50], join: '–', unit: '%',
          why: 'About 10 to 20 kcal/kg a day, or 5 to 10 in extreme malnutrition, advanced slowly over four to seven days.' },
        { type: 'recall', q: 'Cyclic bouts of intractable vomiting in a daily cannabis user, relieved by hot showers. Diagnosis?', a: 'Cannabinoid hyperemesis syndrome',
          why: 'Years of near-daily use, episodes of vomiting five to ten times a day for a day or two with colicky pain, a normal workup apart from dehydration, and the learned habit of long hot showers or baths. Permanent abstinence is the only cure.' },
        { type: 'recall', q: 'Why do hot showers relieve cannabinoid hyperemesis?', a: 'Heat activates TRPV1 receptors',
          why: 'Chronic THC disrupts the hypothalamic centers that control temperature and vomiting. Skin heat above 41°C, or topical capsaicin, stimulates the TRPV1 receptors in skin and brainstem and restores that regulation, which is why capsaicin cream on the abdomen works in the emergency department.' },
        { type: 'recall', q: 'Acute treatment for cannabinoid hyperemesis in the emergency department?', a: 'IV fluids with haloperidol or capsaicin cream',
          why: 'Ondansetron and the other standard antiemetics usually fail. Haloperidol or droperidol work through dopamine blockade in the chemoreceptor trigger zone. Opioids are avoided because they worsen the nausea and gastric stasis.' }
      ]
    },

    {
      id: 'gi-enzymes', subject: 'GI & Hepatology', topic: 'Liver & Pancreas', name: 'LIVER ENZYME PATTERNS',
      blurb: 'Reading the hepatic panel: hepatocellular, alcoholic, massive and cholestatic patterns.',
      cards: [
        { type: 'bucket', q: 'Sort each finding by the liver injury pattern it points to.', bins: ['Hepatocellular', 'Cholestatic'],
          items: [
            { label: 'ALT rises more than ALP', bin: 'Hepatocellular' },
            { label: 'ALP and GGT 4 times normal', bin: 'Cholestatic' },
            { label: 'Dilated bile ducts on ultrasound', bin: 'Cholestatic' },
            { label: 'Positive hepatitis C antibody', bin: 'Hepatocellular' },
            { label: 'Itching, high direct bilirubin', bin: 'Cholestatic' },
            { label: 'Transferrin saturation of 55%', bin: 'Hepatocellular' }
          ],
          why: 'Hepatocellular injury leaks aminotransferases out of damaged liver cells. Cholestasis backs up bile, so the duct-lining enzymes ALP and GGT rise together with direct bilirubin and itching. Deciding the pattern first tells you whether the next step is a serologic workup or an ultrasound of the ducts.' },
        { type: 'recall', q: 'Most common cause of mildly elevated ALT in a US adult with no alcohol use?', a: 'Metabolic dysfunction associated steatotic liver disease',
          why: 'MASLD, formerly fatty liver disease, follows obesity and insulin resistance and now explains most asymptomatic transaminase elevations. Still check hepatitis B surface antigen and hepatitis C antibody before settling on it, since chronic viral hepatitis produces the same mild ALT-predominant picture.' },
        { type: 'recall', q: 'Why order hepatitis B and C serologies for a mild ALT elevation that looks like MASLD?', a: 'Chronic viral hepatitis looks the same',
          why: 'Chronic hepatitis B and C are often silent with ALT only slightly above normal, and both are treatable. Order HBsAg and hepatitis C antibody with reflex RNA. Missing them leaves a curable or suppressible infection to progress to cirrhosis while you counsel weight loss.' },
        { type: 'number', q: 'Transferrin saturation at or above which value should prompt HFE gene testing for hemochromatosis?', value: 45, unit: '%',
          why: 'Transferrin saturation is the most sensitive screening test because it rises before ferritin or any organ damage. A saturation of 45 percent or more plus an elevated ferritin leads to HFE C282Y testing. Ferritin alone is unreliable because it is an acute-phase reactant.' },
        { type: 'recall', q: 'Arthropathy of the second and third metacarpophalangeal joints with elevated transaminases and new diabetes. Diagnosis?', a: 'Hereditary hemochromatosis',
          why: 'Iron deposits in the liver, pancreas, skin and joints. The hook-shaped osteophytes at the second and third MCP joints are the classic radiographic clue. Confirm with transferrin saturation and ferritin, then HFE testing, and treat with serial phlebotomy before cirrhosis develops.' },
        { type: 'recall', q: 'First-line treatment for hereditary hemochromatosis?', a: 'Therapeutic phlebotomy',
          why: 'Removing a unit of blood removes about 250 mg of iron, and repeated phlebotomy brings ferritin down to a target near 50 to 100 ng/mL. Chelation is reserved for patients who cannot tolerate phlebotomy. Started before cirrhosis, phlebotomy restores a normal life expectancy.' },
        { type: 'multi', q: 'Select the serologic findings that support autoimmune hepatitis.',
          answers: ['Elevated IgG', 'Antinuclear antibody', 'Anti-smooth muscle antibody'],
          distractors: ['Antimitochondrial antibody', 'Low ceruloplasmin', 'Elevated IgM'],
          why: 'Autoimmune hepatitis is typically a young woman with hepatocellular enzymes, a high IgG and positive ANA and anti-smooth muscle antibody. Antimitochondrial antibody and high IgM point to primary biliary cholangitis instead, and low ceruloplasmin points to Wilson disease.' },
        { type: 'recall', q: 'Patient under 40 with elevated transaminases, new psychiatric symptoms and tremor. Diagnosis to exclude?', a: 'Wilson disease',
          why: 'Copper accumulates in the liver and basal ganglia, so liver disease plus neuropsychiatric change in a young patient is Wilson disease until proven otherwise. Look for Kayser-Fleischer rings on slit-lamp exam, a low ceruloplasmin and a high 24-hour urine copper. It is treatable with chelation, so missing it is costly.' },
        { type: 'recall', q: 'Why does alcoholic hepatitis produce an AST to ALT ratio of 2 to 1 or more?', a: 'Alcohol depletes the vitamin B6 that ALT synthesis needs',
          why: 'ALT depends more heavily on the active form of vitamin B6 than AST does, and chronic drinkers are deficient in it. Alcohol also damages mitochondria, releasing mitochondrial AST. The ratio flips the usual ALT-predominant pattern, and the absolute values typically stay under 300 to 400.' },
        { type: 'number', q: 'Alcoholic hepatitis almost never raises AST or ALT above roughly what level?', value: 400, unit: 'U/L',
          why: 'Alcohol injures the liver chronically and modestly, so aminotransferases stay in the low hundreds. Values over 500 to 1000 in a drinker mean something else has been added, most often acetaminophen taken for a hangover, acute viral hepatitis or ischemic injury from hypotension.' },
        { type: 'multi', q: 'Select the three causes of aminotransferases above 1000 U/L.',
          answers: ['Acetaminophen toxicity', 'Acute viral hepatitis', 'Ischemic hepatitis'],
          distractors: ['Alcoholic hepatitis', 'MASLD', 'Primary biliary cholangitis'],
          why: 'Only massive hepatocyte necrosis pushes enzymes into the thousands. Acetaminophen, acute viral hepatitis and shock liver are the three. Alcohol tops out in the low hundreds, MASLD is mild, and PBC is a cholestatic pattern. The history and the speed of the fall separate the three.' },
        { type: 'recall', q: 'Transaminases above 5000 and LDH above 3000 after hypotension, falling by half within days. Likely cause?', a: 'Ischemic hepatitis',
          why: 'Shock liver follows any period of poor perfusion, such as cardiac arrest, sepsis or a large bleed. The hallmark is the very high LDH alongside the aminotransferases and a rapid fall once perfusion returns. Viral hepatitis has a prodrome and resolves over weeks, not days.' },
        { type: 'recall', q: 'Antidote for acetaminophen hepatotoxicity?', a: 'N-acetylcysteine',
          why: 'N-acetylcysteine replenishes glutathione so the toxic metabolite NAPQI can be detoxified. It works best within 8 hours of ingestion but still helps late, even once enzymes are in the thousands. Give it whenever the history suggests acetaminophen rather than waiting on levels.' },
        { type: 'recall', q: 'First test when the hepatic panel shows a cholestatic pattern?', a: 'Right upper quadrant ultrasound',
          why: 'The one question a cholestatic pattern raises is whether the bile ducts are dilated. Dilated ducts mean an obstruction such as a stone, a pancreatic head mass or cholangiocarcinoma, which needs MRCP, endoscopic ultrasound or ERCP. Normal ducts point to an intrahepatic cause such as PBC or a drug.' },
        { type: 'recall', q: 'Why confirm an elevated alkaline phosphatase with a GGT before working up the liver?', a: 'Normal GGT means the ALP is from bone, not liver',
          why: 'Alkaline phosphatase also comes from bone, placenta and intestine. GGT rises only with hepatobiliary disease, so an elevated ALP with a normal GGT points to bone turnover, growth or Paget disease and spares the patient a liver workup.' },
        { type: 'recall', q: 'Painless jaundice with a palpable nontender gallbladder and dilated ducts on ultrasound. Likely cause?', a: 'Pancreatic head cancer',
          why: 'A tumor at the pancreatic head obstructs the distal common bile duct slowly, so the gallbladder stretches without the inflammation that stones cause. That palpable painless gallbladder is the Courvoisier sign. Stones produce pain and usually a fibrotic gallbladder that cannot distend.' },
        { type: 'recall', q: 'Cholestatic enzyme pattern with normal bile ducts and a positive antimitochondrial antibody. Diagnosis?', a: 'Primary biliary cholangitis',
          why: 'PBC destroys the small intrahepatic bile ducts, so the large ducts look normal on imaging while ALP and GGT climb. Antimitochondrial antibody is positive in over 95 percent and is specific enough that biopsy is rarely needed. Treatment is ursodeoxycholic acid.' },
        { type: 'multi', q: 'Select the drugs that classically cause cholestatic liver injury.',
          answers: ['Amoxicillin-clavulanate', 'Anabolic steroids', 'Oral contraceptives', 'Chlorpromazine'],
          distractors: ['Statins', 'Isoniazid', 'Acetaminophen'],
          why: 'Amoxicillin-clavulanate is the most common drug cause of cholestatic injury, and anabolic steroids, estrogens and chlorpromazine are the classic others. Statins, isoniazid and acetaminophen injure hepatocytes and raise transaminases instead. The distinction guides which drug to stop.' },
        { type: 'recall', q: 'Isolated indirect bilirubin of 2 to 4 with normal enzymes and hemoglobin, worse with fasting or illness. Diagnosis?', a: 'Gilbert syndrome',
          why: 'Reduced UGT1A1 activity slows bilirubin conjugation, so unconjugated bilirubin rises when the enzyme is stressed by fasting, illness or exertion. It affects 5 to 8 percent of people, is benign and needs only reassurance. A normal hemoglobin and reticulocyte count exclude hemolysis, the other indirect cause.' }
      ]
    },

    {
      id: 'gi-masld', subject: 'GI & Hepatology', topic: 'Liver & Pancreas', name: 'MASLD & CIRRHOSIS',
      blurb: 'Fatty liver management, fibrosis staging, ascites and spontaneous bacterial peritonitis.',
      cards: [
        { type: 'number', q: 'Minimum weight loss that reduces liver steatosis in MASLD?', value: 5, unit: '%',
          why: 'Weight loss is the only treatment that works for everyone with MASLD. Five percent clears fat, 7 to 10 percent resolves steatohepatitis and can regress fibrosis. Set the smaller target first so the patient sees a reachable goal.' },
        { type: 'number', q: 'Weight loss needed to resolve steatohepatitis and regress fibrosis in MASH?', value: 7, unit: '%',
          why: 'Seven to ten percent of body weight is the threshold at which inflammation resolves and scarring begins to reverse. Most patients need structured support or a GLP-1 agonist to get there. Alcohol abstinence adds to the benefit at every stage.' },
        { type: 'truefalse', q: 'Statins are safe to continue in patients with MASLD and elevated transaminases.', a: true,
          why: 'Cardiovascular disease, not liver disease, is the leading cause of death in MASLD, and statins reduce that risk. Mild transaminase elevations do not increase statin hepatotoxicity. Hold statins only in decompensated cirrhosis.' },
        { type: 'number', q: 'FIB-4 score below which advanced fibrosis is effectively ruled out?', value: 1.3, unit: 'score',
          why: 'FIB-4 combines age, AST, ALT and platelets. Below 1.30 the negative predictive value for advanced fibrosis is over 90 percent, so the patient can be managed in primary care with repeat scoring every 1 to 2 years. Scores of 1.30 to 2.67 need elastography, and above 2.67 go to hepatology.' },
        { type: 'recall', q: 'Next step for a MASLD patient with a FIB-4 score of 2.0?', a: 'Transient elastography (FibroScan)',
          why: 'The indeterminate range of 1.30 to 2.67 cannot rule fibrosis in or out. Elastography measures liver stiffness noninvasively and sorts these patients into low or high risk. Only scores above 2.67, or a stiff liver on elastography, warrant hepatology referral.' },
        { type: 'multi', q: 'Select the drugs with evidence of benefit in MASH.',
          answers: ['Pioglitazone', 'Semaglutide', 'Resmetirom', 'Vitamin E'],
          distractors: ['Metformin', 'Sitagliptin', 'Vitamin D'],
          why: 'Pioglitazone and vitamin E have histologic evidence, GLP-1 agonists and tirzepatide reduce steatohepatitis through weight loss, and resmetirom is approved for noncirrhotic F2 to F3 fibrosis. Metformin, sulfonylureas, DPP-4 inhibitors and vitamin D improve glucose or bone but not the liver.' },
        { type: 'recall', q: 'Why is pioglitazone contraindicated in symptomatic heart failure?', a: 'It causes fluid retention',
          why: 'Thiazolidinediones increase renal sodium reabsorption and expand plasma volume, which precipitates or worsens heart failure. Pioglitazone also adds 3 to 5 kg of weight and raises fracture and bladder cancer risk. Reserve it for MASH patients without heart failure who understand those tradeoffs.' },
        { type: 'recall', q: 'Which MASH patients should receive vitamin E 800 IU daily?', a: 'Nondiabetic patients without cirrhosis',
          why: 'Vitamin E improved steatohepatitis in the PIVENS trial, which enrolled nondiabetic noncirrhotic adults. Benefit in diabetics is unproven and high-dose vitamin E carries a small increase in prostate cancer and hemorrhagic stroke, so it is limited to the population studied.' },
        { type: 'number', q: 'Serum-ascites albumin gradient at or above which ascites is attributed to portal hypertension?', value: 1.1, unit: 'g/dL',
          why: 'A high gradient means pressure, not protein leak, is pushing fluid into the peritoneum. Cirrhosis, heart failure and Budd-Chiari all produce a SAAG of 1.1 or more. A low gradient points to peritoneal carcinomatosis, tuberculosis, pancreatitis or nephrotic syndrome.' },
        { type: 'bucket', q: 'Sort each cause of ascites by its serum-ascites albumin gradient.', bins: ['SAAG high', 'SAAG low'],
          items: [
            { label: 'Cirrhosis', bin: 'SAAG high' },
            { label: 'Peritoneal carcinomatosis', bin: 'SAAG low' },
            { label: 'Right heart failure', bin: 'SAAG high' },
            { label: 'Tuberculous peritonitis', bin: 'SAAG low' },
            { label: 'Nephrotic syndrome', bin: 'SAAG low' },
            { label: 'Budd-Chiari syndrome', bin: 'SAAG high' }
          ],
          why: 'Any cause of high pressure in the hepatic sinusoids, from cirrhosis to hepatic vein outflow obstruction to right heart failure, gives a gradient of 1.1 or more. Peritoneal disease and low oncotic pressure leak protein-rich or protein-poor fluid without portal hypertension, so the gradient is low.' },
        { type: 'recall', q: 'Why are spironolactone and furosemide dosed in a 100 to 40 ratio for cirrhotic ascites?', a: 'That ratio keeps potassium balanced',
          why: 'Spironolactone blocks the aldosterone excess that drives sodium retention in cirrhosis and raises potassium, while furosemide wastes potassium. At 100 mg to 40 mg the two effects cancel. Both are titrated up together, with 2 grams of sodium restriction as the base.' },
        { type: 'number', q: 'Starting doses of spironolactone and furosemide for cirrhotic ascites, in that order?', values: [100, 40], join: ':', unit: 'mg',
          why: 'The 100 to 40 ratio keeps potassium balanced, and the pair is raised together in the same proportion, to a maximum of 400 and 160, until weight falls by about half a kilogram a day. Spironolactone alone works for a first mild episode; the combination is faster and safer for recurrent or tense ascites.' },
        { type: 'number', q: 'Ascitic fluid neutrophil count at or above which spontaneous bacterial peritonitis is diagnosed?', value: 250, unit: 'cells/µL',
          why: 'Cultures are slow and negative in up to 40 percent of cases, so treatment starts on the cell count alone. Tap every cirrhotic with ascites who is admitted or has fever, abdominal pain or encephalopathy. A single organism on culture supports SBP; multiple organisms suggest a perforated viscus.' },
        { type: 'recall', q: 'First-line antibiotic for spontaneous bacterial peritonitis?', a: 'IV ceftriaxone 2 g daily for 5 days',
          why: 'Gut gram-negatives such as E. coli and Klebsiella and streptococci cause most SBP, and a third-generation cephalosporin covers them. Five days is as effective as longer courses. Fluoroquinolones are avoided for treatment if the patient was taking one for prophylaxis.' },
        { type: 'recall', q: 'Why does IV albumin on days 1 and 3 improve survival in spontaneous bacterial peritonitis?', a: 'It prevents hepatorenal syndrome',
          why: 'SBP triggers vasodilation and a fall in effective circulating volume that tips the kidneys into hepatorenal syndrome. Albumin at 1.5 g/kg on day 1 and 1 g/kg on day 3 cuts the incidence of renal failure and mortality by more than half. Give it when creatinine exceeds 1, BUN exceeds 30 or bilirubin exceeds 4.' },
        { type: 'multi', q: 'Select the indications for long-term antibiotic prophylaxis against spontaneous bacterial peritonitis.',
          answers: ['Prior episode of SBP', 'Low ascitic protein, Child ≥9'],
          distractors: ['Any cirrhosis with ascites', 'Ascitic protein above 2 g/dL', 'Compensated, no ascites'],
          why: 'After one episode of SBP recurrence is 70 percent within a year, and daily ciprofloxacin or TMP-SMX cuts that below 20 percent. Low ascitic protein with Child-Pugh 9 or higher, bilirubin 3 or more, or kidney dysfunction is the other indication. Most cirrhotics with ascites do not qualify, and overuse breeds resistant organisms.' },
        { type: 'recall', q: 'Why does a cirrhotic with an acute upper GI bleed receive 7 days of ceftriaxone?', a: 'It prevents bacterial infection and SBP during the bleed',
          why: 'Bleeding increases bacterial translocation across the gut wall, and up to half of cirrhotics bleeding from varices develop an infection within a week. Prophylactic antibiotics reduce infection, rebleeding and death. This short course is separate from long-term prophylaxis.' }
      ]
    },

    {
      id: 'gi-hepatitis', subject: 'GI & Hepatology', topic: 'Liver & Pancreas', name: 'VIRAL HEPATITIS',
      blurb: 'Hepatitis A, hepatitis B serology and hepatitis C screening and cure.',
      cards: [
        { type: 'recall', q: 'Test that diagnoses acute hepatitis A?', a: 'Anti-HAV IgM',
          why: 'IgM appears with symptoms and persists for a few months, so it marks current infection. IgG anti-HAV means past infection or vaccination and lifelong immunity. Hepatitis A is fecal-oral, self-limited and never becomes chronic, so management is supportive.' },
        { type: 'number', q: 'Average incubation period of hepatitis A?', value: 28, unit: 'days',
          why: 'Infection appears about four weeks after exposure, with a range of 15 to 50 days. Patients shed virus in stool for about two weeks before jaundice, which is why outbreaks spread through food handlers before anyone is sick. Vaccine or immune globulin within two weeks of exposure prevents disease.' },
        { type: 'truefalse', q: 'Hepatitis A infection can progress to chronic hepatitis.', a: false,
          why: 'Hepatitis A causes an acute, self-limited illness that resolves in weeks to a few months and leaves lifelong immunity. Chronic infection is a feature of hepatitis B and C only. Rare fulminant cases occur mostly in older adults or those with existing liver disease.' },
        { type: 'recall', q: 'Hepatitis B serology shows HBsAg positive, anti-HBs negative and anti-HBc IgM positive. Stage?', a: 'Acute hepatitis B',
          why: 'Surface antigen means the virus is present, and IgM core antibody means the infection is recent. Surface antibody has not yet formed. Most adults clear the virus within six months and seroconvert to anti-HBs positive.' },
        { type: 'recall', q: 'Hepatitis B serology shows only anti-HBc IgM positive, with HBsAg and anti-HBs both negative. Stage?', a: 'Window period',
          why: 'Surface antigen has fallen below detection but surface antibody has not yet risen, so IgM core antibody is the only marker of the recent infection. It is a transition between acute infection and recovery. Repeat serologies in a few weeks usually show anti-HBs appearing.' },
        { type: 'recall', q: 'Why does a positive anti-HBc IgG with a negative anti-HBs and negative HBsAg still matter?', a: 'Hepatitis B can reactivate with immunosuppression',
          why: 'Isolated core antibody means past infection that may still harbor covalently closed circular DNA in hepatocytes. Rituximab and other B-cell depleting or high-dose steroid regimens can reactivate it, sometimes fatally. Check HBV DNA and give entecavir or tenofovir prophylaxis before starting those drugs.' },
        { type: 'number', q: 'Anti-HBs titer at or above which a person is considered immune to hepatitis B?', value: 10, unit: 'mIU/mL',
          why: 'Ten milli-international units per milliliter is the protective threshold after vaccination. Documented immunity at that level means no post-exposure prophylaxis after a needlestick from an HBsAg-positive source, no HBIG and no booster. Nonresponders get a repeat vaccine series.' },
        { type: 'bucket', q: 'Sort each hepatitis B serologic profile by how the immunity was acquired.', bins: ['Vaccinated', 'Past infection'],
          items: [
            { label: 'Anti-HBs only', bin: 'Vaccinated' },
            { label: 'Anti-HBs and anti-HBc IgG', bin: 'Past infection' },
            { label: 'Immune, no reactivation risk', bin: 'Vaccinated' },
            { label: 'Prophylaxis before rituximab', bin: 'Past infection' }
          ],
          why: 'The vaccine contains only surface antigen, so it raises surface antibody and nothing else. Natural infection also produces core antibody, which stays positive for life. Core antibody is therefore the marker that separates a resolved infection, with its reactivation risk, from vaccination.' },
        { type: 'recall', q: 'HBsAg has remained positive for more than six months. Diagnosis?', a: 'Chronic hepatitis B',
          why: 'Persistence of surface antigen past six months defines chronic infection. Stage it with HBeAg, HBV DNA, ALT and a FIB-4 score. Immune-active disease, meaning high DNA with elevated ALT, and any cirrhosis are treated with entecavir or tenofovir, and all chronic carriers get hepatocellular carcinoma surveillance.' },
        { type: 'recall', q: 'First-line antiviral options for chronic hepatitis B?', a: 'Entecavir or tenofovir',
          why: 'Both have a high barrier to resistance and suppress HBV DNA in nearly all patients. Treatment is for immune-active disease or cirrhosis, not every carrier. Tenofovir is preferred in pregnancy and lamivudine is avoided because resistance develops quickly.' },
        { type: 'recall', q: 'USPSTF hepatitis C screening recommendation?', a: 'Screen all adults 18 to 79 once, and every pregnancy',
          why: 'Half of infected people do not know it, and risk-based screening misses most of them. A single lifetime test, repeated during each pregnancy and in anyone with ongoing risk, is a grade B recommendation. Order the antibody with reflex RNA so a positive is confirmed on the same sample.' },
        { type: 'recall', q: 'Hepatitis C antibody positive with undetectable RNA. Interpretation?', a: 'Cleared or cured infection, not active',
          why: 'The antibody stays positive for life after any exposure, whether the virus was cleared spontaneously, cured by treatment or still present. Only RNA proves active infection. These patients need no treatment, but a new exposure would require RNA testing because the antibody cannot show reinfection.' },
        { type: 'number', q: 'FIB-4 score below which a hepatitis C patient can be treated in primary care without hepatology referral?', value: 1.45, unit: 'score',
          why: 'A low FIB-4 excludes cirrhosis, and simplified treatment then needs no imaging, no genotype and no specialist. Glecaprevir-pibrentasvir for 8 weeks or sofosbuvir-velpatasvir for 12 weeks cures over 97 percent. Decompensated cirrhosis, prior treatment failure and hepatitis B coinfection are the main reasons to refer.' },
        { type: 'multi', q: 'Select the things that should NOT delay hepatitis C treatment in primary care.',
          answers: ['Ongoing alcohol use', 'Active injection drug use', 'Unfinished hepatitis vaccines', 'No liver ultrasound yet'],
          distractors: ['Decompensated cirrhosis', 'Prior treatment failure'],
          why: 'Substance use is not a contraindication and treating people who inject drugs reduces transmission. Vaccines can be given alongside treatment. Ultrasound and repeat RNA are unnecessary before starting in a noncirrhotic patient. Only decompensation, prior failure and other complex features need specialty care.' },
        { type: 'recall', q: 'Test that confirms cure after hepatitis C treatment?', a: 'Undetectable RNA 12 weeks after finishing therapy',
          why: 'Sustained virologic response at 12 weeks, SVR12, is equivalent to cure and relapse after it is rare. Cure regresses fibrosis and lowers liver cancer and mortality risk. Patients with cirrhosis still need ongoing hepatocellular carcinoma surveillance even after SVR.' }
      ]
    },

    {
      id: 'gi-biliary', subject: 'GI & Hepatology', topic: 'Liver & Pancreas', name: 'GALLBLADDER & PANCREAS',
      blurb: 'Choledocholithiasis, cholecystitis, cholangitis, primary biliary cholangitis and acute pancreatitis.',
      cards: [
        { type: 'recall', q: 'Constant RUQ pain with jaundice, no fever, normal white count and a 9 mm common bile duct. Diagnosis?', a: 'Choledocholithiasis',
          why: 'A stone in the common bile duct obstructs without infecting, so bilirubin, ALP and GGT rise while the patient stays afebrile. A duct wider than 6 to 8 mm on ultrasound is the clue. Confirm with MRCP or endoscopic ultrasound and clear the stone with ERCP and sphincterotomy.' },
        { type: 'number', q: 'Common bile duct diameter above which ultrasound suggests a retained stone?', value: 6, unit: 'mm',
          why: 'A normal duct is under 6 mm, allowing a little more with age and after cholecystectomy. Dilation with a cholestatic enzyme pattern makes choledocholithiasis likely enough to go to MRCP or straight to ERCP. Ultrasound sees the stone itself in fewer than half of cases.' },
        { type: 'recall', q: 'Why does cholecystitis raise the white count and temperature while choledocholithiasis usually does not?', a: 'Cholecystitis is inflammation of the gallbladder wall',
          why: 'A stone impacted in the cystic duct distends the gallbladder, and the trapped wall becomes inflamed and secondarily infected, producing fever, leukocytosis and a Murphy sign after more than six hours of pain. A stone in the common duct obstructs flow but does not inflame a wall, so bilirubin rises without fever.' },
        { type: 'multi', q: 'Select the ultrasound findings of acute cholecystitis.',
          answers: ['Gallbladder wall over 3 mm', 'Pericholecystic fluid', 'Sonographic Murphy sign'],
          distractors: ['Dilated common bile duct', 'Elevated bilirubin', 'Intrahepatic duct dilation'],
          why: 'Cholecystitis is a gallbladder-wall problem, so ultrasound shows a thickened wall, surrounding fluid and tenderness when the probe presses on the gallbladder. Duct dilation and elevated bilirubin mean a common duct stone instead. When ultrasound is equivocal, a HIDA scan showing nonfilling confirms the diagnosis.' },
        { type: 'number', q: 'Laparoscopic cholecystectomy for acute cholecystitis should happen within how many hours of admission at the latest?', value: 72, unit: 'hours',
          why: 'Early surgery within 24 to 72 hours shortens hospital stay and avoids the complications of waiting for inflammation to settle. Antibiotics are started on admission but are not a substitute for removing the gallbladder. Delayed surgery is reserved for patients too sick to operate on.' },
        { type: 'recall', q: 'Fever, jaundice and right upper quadrant pain together. Diagnosis?', a: 'Acute cholangitis',
          why: 'Charcot triad means bile behind an obstruction has become infected and is under pressure. Adding hypotension and confusion makes Reynolds pentad, which signals septic shock. Give IV antibiotics and arrange urgent ERCP to decompress the duct, since antibiotics alone cannot clear an infected obstructed system.' },
        { type: 'recall', q: 'Definitive treatment for acute cholangitis?', a: 'Urgent ERCP with biliary decompression',
          why: 'Antibiotics buy time, but the infected bile under pressure keeps seeding the bloodstream until the obstruction is relieved. ERCP within 24 hours, or sooner in the unstable, drains the duct and removes the stone. Percutaneous drainage is the fallback when ERCP fails.' },
        { type: 'recall', q: 'Middle-aged woman with pruritus, fatigue, xanthelasma and elevated alkaline phosphatase. Diagnosis?', a: 'Primary biliary cholangitis',
          why: 'PBC is an autoimmune attack on small intrahepatic bile ducts, so cholestasis develops without duct dilation. Itching often precedes jaundice by years, and Sjögren syndrome commonly coexists. Antimitochondrial antibody confirms it in over 95 percent.' },
        { type: 'recall', q: 'First-line treatment for primary biliary cholangitis?', a: 'Ursodeoxycholic acid 13 to 15 mg/kg daily',
          why: 'Ursodiol replaces toxic hydrophobic bile acids with a gentler one, slows progression and improves transplant-free survival in responders. Cholestyramine treats the pruritus. Patients who fail ursodiol move to obeticholic acid or fibrates.' },
        { type: 'number', q: 'ALT above which value gives a 95 percent positive predictive value for a gallstone cause of acute pancreatitis?', value: 150, unit: 'U/L',
          why: 'A stone passing through the ampulla briefly obstructs the bile duct and spikes the ALT before the pancreas inflames. Gallstones cause about 40 percent of pancreatitis and alcohol 30 percent. A biliary cause changes management because the patient needs cholecystectomy during the same admission.' },
        { type: 'multi', q: 'Select the drugs that cause acute pancreatitis.',
          answers: ['Azathioprine', 'Valproate', 'Thiazide diuretics', 'GLP-1 receptor agonists'],
          distractors: ['Metformin', 'Lisinopril', 'Amoxicillin'],
          why: 'Azathioprine, valproate, thiazides, GLP-1 agonists and didanosine are the drugs most often tested. Hypertriglyceridemia over 1000, hypercalcemia and post-ERCP injury are the other nonbiliary nonalcoholic causes to screen for when the usual two are excluded.' },
        { type: 'number', q: 'Triglyceride level above which hypertriglyceridemia is accepted as the cause of pancreatitis?', value: 1000, unit: 'mg/dL',
          why: 'Lipase hydrolyzes excess triglycerides into free fatty acids that injure acinar cells. Levels this high usually come from familial dyslipidemia unmasked by diabetes, alcohol or estrogen. Treatment is insulin infusion and fasting, with fibrates to prevent recurrence.' },
        { type: 'recall', q: 'When should a patient with mild acute pancreatitis start eating?', a: 'Within 24 hours, with a low-fat solid diet',
          why: 'Early feeding preserves the gut barrier and reduces infection and length of stay. Pain does not need to resolve and lipase does not need to normalize first. The old rule of resting the pancreas with NPO status has been abandoned.' },
        { type: 'recall', q: 'Preferred nutrition route when a pancreatitis patient cannot eat by 48 to 72 hours?', a: 'Enteral feeding by nasogastric or nasojejunal tube',
          why: 'Enteral feeding maintains the mucosal barrier and lowers infected necrosis and mortality compared with parenteral nutrition. Nasogastric is as safe as nasojejunal for most patients. TPN is a last resort for intolerance of tube feeding.' }
      ]
    },

    {
      id: 'gi-celiac-diarrhea', subject: 'GI & Hepatology', topic: 'Bowel & Colon', name: 'CELIAC & DIARRHEA',
      blurb: 'Celiac testing, IgA deficiency, infectious diarrhea and the pathogens worth knowing.',
      cards: [
        { type: 'recall', q: 'First-line serologic test for celiac disease?', a: 'IgA tissue transglutaminase with a total IgA',
          why: 'IgA tTG is over 90 percent sensitive and specific when the patient is eating gluten. Total IgA is ordered alongside because IgA deficiency makes the tTG falsely negative. A positive result is confirmed with duodenal biopsies before committing someone to a lifelong gluten-free diet.' },
        { type: 'recall', q: 'Why must celiac testing be done while the patient is still eating gluten?', a: 'Antibodies and villous damage resolve off gluten',
          why: 'Within weeks of removing gluten the tTG falls and the villi begin to regrow, so both serology and biopsy turn falsely negative. A patient already gluten-free needs a gluten challenge of several weeks before testing, or HLA DQ2 and DQ8 typing, which can only exclude the disease when negative.' },
        { type: 'recall', q: 'Test that confirms celiac disease after a positive IgA tTG?', a: 'Upper endoscopy with duodenal biopsies',
          why: 'Biopsy shows villous atrophy, crypt hyperplasia and intraepithelial lymphocytes. Serology alone misses the rare false positive and the diet is burdensome and permanent, so adults get histologic confirmation. Children with very high titers may skip biopsy under pediatric guidelines.' },
        { type: 'multi', q: 'Select the histologic findings of celiac disease.',
          answers: ['Villous atrophy', 'Crypt hyperplasia', 'Intraepithelial lymphocytes'],
          distractors: ['Noncaseating granulomas', 'Crypt abscesses', 'Collagen band'],
          why: 'Gluten-driven inflammation flattens the villi, the crypts lengthen to compensate and lymphocytes infiltrate the epithelium. Granulomas belong to Crohn disease, crypt abscesses to ulcerative colitis and a thick collagen band to microscopic colitis.' },
        { type: 'recall', q: 'Why can celiac disease be missed by IgA tissue transglutaminase in a patient with recurrent sinopulmonary infections?', a: 'Selective IgA deficiency makes the test falsely negative',
          why: 'IgA deficiency is the most common primary immunodeficiency and is 10 to 15 times more frequent in celiac disease. With no IgA to measure, the IgA-based test reads negative. Check total IgA and, if low, use IgG deamidated gliadin peptide or IgG tTG and go to biopsy.' },
        { type: 'recall', q: 'Celiac test to use when total IgA is low?', a: 'IgG deamidated gliadin peptide or IgG tTG',
          why: 'Switching the antibody isotype restores sensitivity. These patients also need biopsy confirmation. Remember that IgA-deficient patients can have anaphylaxis to blood products containing IgA, so washed products are used if they ever need a transfusion.' },
        { type: 'recall', q: 'Why do acute watery diarrhea cases under 7 days without fever or blood need no stool studies or antibiotics?', a: 'They are viral and self-limited',
          why: 'Norovirus and rotavirus cause most acute diarrhea, and cultures and ova and parasite exams return nothing actionable. Oral rehydration plus loperamide or bismuth is enough. Blood, fever, severe pain, more than a week of symptoms or immunocompromise are the triggers for a workup.' },
        { type: 'recall', q: 'Bloody diarrhea with little or no fever after eating undercooked ground beef. Likely cause?', a: 'Shiga toxin-producing E. coli O157:H7',
          why: 'STEC damages the colon with Shiga toxin rather than invading it, so the patient is often afebrile despite the blood. Unpasteurized dairy, leafy greens and petting zoos are the other sources. The main job is to avoid drugs that raise the risk of hemolytic uremic syndrome and to watch for it.' },
        { type: 'recall', q: 'Why are antibiotics and antimotility drugs avoided in Shiga toxin-producing E. coli infection?', a: 'They double the risk of hemolytic uremic syndrome',
          why: 'Antibiotics lyse the bacteria and release more Shiga toxin, and slowing the gut keeps the toxin in contact with the mucosa longer. HUS develops in about 10 percent of children about a week in. Monitor hemoglobin, platelets and creatinine, and give fluids only.' },
        { type: 'multi', q: 'Select the labs to trend for hemolytic uremic syndrome after a STEC infection.',
          answers: ['Hemoglobin', 'Platelet count', 'Creatinine'],
          distractors: ['Lipase', 'Alkaline phosphatase', 'Troponin'],
          why: 'HUS is the triad of microangiopathic hemolytic anemia, thrombocytopenia and acute kidney injury. A falling hemoglobin and platelet count with a rising creatinine, usually 5 to 10 days after the diarrhea starts, means admission. A peripheral smear showing schistocytes confirms the hemolysis.' },
        { type: 'recall', q: 'Profuse rice-water stools after eating raw oysters. Likely cause?', a: 'Vibrio cholerae',
          why: 'Cholera toxin activates adenylate cyclase, raising cAMP and driving chloride and water into the lumen, which produces the painless watery stools without inflammation. Raw shellfish and coastal water are the US sources. Aggressive oral or IV rehydration is the treatment and doxycycline shortens the course.' },
        { type: 'recall', q: 'Greasy floating stools with sulfur-smelling belching after a camping trip. Likely cause?', a: 'Giardia',
          why: 'Giardia coats the small bowel and causes malabsorption, which explains the fatty stools, bloating and weight loss. Streams, well water and daycare centers are the usual exposures. Diagnose with stool antigen or nucleic acid testing, since microscopy misses many, and treat with metronidazole or tinidazole.' },
        { type: 'recall', q: 'Why can swimming in a chlorinated pool still transmit Cryptosporidium?', a: 'Its oocysts resist chlorine',
          why: 'Cryptosporidium survives standard pool chlorination for days, so pools and water parks drive summer outbreaks of 1 to 2 weeks of watery diarrhea. Infected people should stay out of the water for two weeks after symptoms resolve. In AIDS patients with CD4 under 100 it becomes chronic and needs nitazoxanide plus antiretrovirals.' },
        { type: 'recall', q: 'Treatment for chronic Cryptosporidium diarrhea in a patient with AIDS and CD4 below 100?', a: 'Nitazoxanide plus antiretroviral therapy',
          why: 'Nitazoxanide alone works poorly without immune recovery, so restoring the CD4 count with antiretrovirals is the real treatment. Immunocompetent patients clear the infection on their own within two weeks. Stool antigen or nucleic acid testing makes the diagnosis.' },
        { type: 'match', q: 'Match each exposure to its diarrheal pathogen.',
          pairs: [
            { left: 'Raw oysters', right: 'Vibrio' },
            { left: 'Mountain stream water', right: 'Giardia' },
            { left: 'Water park', right: 'Cryptosporidium' },
            { left: 'Undercooked ground beef', right: 'E. coli O157:H7' }
          ] }
      ]
    },

    {
      id: 'gi-ibs-ibd', subject: 'GI & Hepatology', topic: 'Bowel & Colon', name: 'IBS, IBD & MICROSCOPIC',
      blurb: 'Irritable bowel diagnosis and drugs, microscopic colitis, ulcerative colitis versus Crohn disease.',
      cards: [
        { type: 'recall', q: 'Why can irritable bowel syndrome be diagnosed without a colonoscopy?', a: 'Rome criteria with no alarm features are enough',
          why: 'IBS is defined clinically by abdominal pain at least one day a week for three months tied to defecation or a change in stool frequency or form. A normal CRP and fecal calprotectin and a negative celiac screen exclude the mimics. Colonoscopy is reserved for alarm features such as blood, weight loss, nocturnal symptoms or onset after 50.' },
        { type: 'number', q: 'Minimum number of days per week of abdominal pain the Rome IV criteria require for irritable bowel syndrome?', value: 1, unit: 'days/week',
          why: 'Rome IV requires recurrent pain at least one day a week over the last three months, with symptom onset at least six months ago. The pain must link to two of three features: relation to defecation, a change in stool frequency, or a change in stool form.' },
        { type: 'recall', q: 'Why is psyllium recommended for IBS but wheat bran is not?', a: 'Soluble fiber helps and insoluble fiber worsens bloating',
          why: 'Soluble fiber forms a gel that normalizes stool consistency in both diarrhea and constipation subtypes. Insoluble fiber such as wheat bran ferments and distends the gut, making pain and bloating worse. A low-FODMAP diet and enteric-coated peppermint oil are the other first-line measures.' },
        { type: 'bucket', q: 'Sort each IBS drug by the subtype it treats.', bins: ['IBS-D', 'IBS-C'],
          items: [
            { label: 'Rifaximin', bin: 'IBS-D' },
            { label: 'Linaclotide', bin: 'IBS-C' },
            { label: 'Eluxadoline', bin: 'IBS-D' },
            { label: 'Lubiprostone', bin: 'IBS-C' },
            { label: 'Low-dose amitriptyline', bin: 'IBS-D' },
            { label: 'Plecanatide', bin: 'IBS-C' },
            { label: 'Alosetron', bin: 'IBS-D' },
            { label: 'Polyethylene glycol', bin: 'IBS-C' }
          ],
          why: 'Diarrhea-predominant disease is treated with agents that slow the gut or alter its flora: loperamide, a 14-day course of rifaximin, eluxadoline, alosetron and a low-dose tricyclic. Constipation-predominant disease gets secretagogues such as linaclotide, plecanatide and lubiprostone, or polyethylene glycol.' },
        { type: 'recall', q: 'Why is eluxadoline contraindicated after cholecystectomy?', a: 'It causes sphincter of Oddi spasm and pancreatitis',
          why: 'Eluxadoline is a mu-opioid agonist, and without a gallbladder to buffer pressure its effect on the sphincter of Oddi produces pancreatitis within the first week. It is also avoided with heavy alcohol use and biliary disease. Pick rifaximin or a tricyclic for these patients instead.' },
        { type: 'recall', q: 'Older woman with months of watery nocturnal diarrhea and a normal-appearing colonoscopy. Diagnosis?', a: 'Microscopic colitis',
          why: 'The mucosa looks normal to the eye, so the diagnosis rests on random biopsies showing a collagen band over 10 micrometers or a lymphocytic infiltrate. NSAIDs, SSRIs, PPIs and smoking are the triggers to stop. Budesonide 9 mg daily for 6 to 8 weeks induces remission.' },
        { type: 'recall', q: 'Why take random biopsies during a normal-looking colonoscopy for chronic watery diarrhea?', a: 'Microscopic colitis is invisible to the endoscope',
          why: 'Collagenous and lymphocytic colitis change the mucosa only at the histologic level. Without biopsies the patient is labeled IBS and the treatable inflammation is missed. Budesonide works far better than the loperamide and fiber that IBS would get.' },
        { type: 'multi', q: 'Select the drugs that trigger microscopic colitis.',
          answers: ['NSAIDs', 'SSRIs', 'Proton pump inhibitors'],
          distractors: ['Metformin', 'Amlodipine', 'Levothyroxine'],
          why: 'NSAIDs, SSRIs and PPIs are the most consistently associated medications, and stopping them resolves symptoms in a fair share of patients. Smoking is the other modifiable trigger. Metformin causes diarrhea by a different mechanism and does not inflame the colon.' },
        { type: 'recall', q: 'First-line drug for microscopic colitis?', a: 'Budesonide 9 mg daily for 6 to 8 weeks',
          why: 'Budesonide delivers a topical steroid to the colon with heavy first-pass metabolism, so systemic effects are minimal. Most patients respond within two weeks. Relapse is common after stopping, and a low maintenance dose or a repeat course handles it.' },
        { type: 'bucket', q: 'Sort each feature by the inflammatory bowel disease it belongs to.', bins: ['UC', 'Crohn'],
          items: [
            { label: 'Continuous from the rectum', bin: 'UC' },
            { label: 'Skip lesions', bin: 'Crohn' },
            { label: 'Transmural inflammation', bin: 'Crohn' },
            { label: 'Crypt abscesses', bin: 'UC' },
            { label: 'Perianal fistulas', bin: 'Crohn' },
            { label: 'Bloody diarrhea with tenesmus', bin: 'UC' },
            { label: 'Noncaseating granulomas', bin: 'Crohn' },
            { label: 'Lead-pipe colon', bin: 'UC' }
          ],
          why: 'Ulcerative colitis is a mucosal disease that starts at the rectum and spreads proximally without gaps, so it bleeds, causes tenesmus and loses haustra. Crohn disease inflames the full wall anywhere from mouth to anus with skipped segments, which is why it fistulizes, strictures and forms granulomas.' },
        { type: 'recall', q: 'Why does Crohn disease cause vitamin B12 deficiency while ulcerative colitis does not?', a: 'Crohn disease inflames the terminal ileum',
          why: 'B12 is absorbed only in the terminal ileum, the segment Crohn disease favors. Ileal inflammation or resection also lets bile acids and fat reach the colon, where fat binds calcium and leaves oxalate free to be absorbed, causing calcium oxalate kidney stones. UC stays in the colon and spares both.' },
        { type: 'recall', q: 'Liver disease most associated with ulcerative colitis?', a: 'Primary sclerosing cholangitis',
          why: 'PSC causes strictures and beading of the large bile ducts and coexists with UC in the majority of cases. It raises colon cancer risk enough that surveillance colonoscopy starts at diagnosis and repeats every year rather than waiting eight years.' },
        { type: 'multi', q: 'Select the vaccines that are safe for a patient on a TNF inhibitor for Crohn disease.',
          answers: ['PCV20', 'Recombinant zoster (Shingrix)', 'Hepatitis B', 'Inactivated influenza'],
          distractors: ['MMR', 'Varicella', 'Live attenuated influenza'],
          why: 'Inactivated and recombinant vaccines cannot replicate, so they are safe and are actively recommended because immunosuppression raises infection risk. Live vaccines can cause disseminated infection on biologics, steroids above 20 mg or thiopurines. Give any needed live vaccines at least four weeks before starting therapy.' },
        { type: 'number', q: 'Years after onset of pancolitis that colon cancer surveillance colonoscopy begins?', value: 8, unit: 'years',
          why: 'Cancer risk in colitis rises with the duration and extent of inflammation, and becomes meaningful at about eight years for pancolitis, left-sided UC or Crohn disease involving a third or more of the colon. Surveillance then repeats every 1 to 3 years with chromoendoscopy or targeted biopsies.' },
        { type: 'recall', q: 'How does primary sclerosing cholangitis change colon cancer surveillance in a patient with inflammatory bowel disease?', a: 'Colonoscopy every year, starting at diagnosis',
          why: 'PSC multiplies the colitis-associated cancer risk, and the cancers tend to be right-sided and hard to see. The usual eight-year wait is dropped and surveillance becomes annual from the time PSC is found. These patients also need gallbladder imaging and cholangiocarcinoma surveillance.' }
      ]
    },

    {
      id: 'gi-lower', subject: 'GI & Hepatology', topic: 'Bowel & Colon', name: 'LOWER GI',
      blurb: 'Hematochezia, ischemic colitis, diverticular disease, bowel obstruction and anal fissure.',
      cards: [
        { type: 'recall', q: 'First imaging step for hemodynamically unstable hematochezia?', a: 'CT angiography',
          why: 'CT angiography localizes active bleeding at rates as low as 0.3 mL per minute within minutes, and a positive study goes straight to catheter embolization. Colonoscopy cannot see through a brisk bleed. Remember that 10 to 15 percent of brisk hematochezia comes from an upper source, so EGD is considered too.' },
        { type: 'number', q: 'Percent of brisk hematochezia that turns out to have an upper GI source?', value: 15, unit: '%',
          why: 'A fast upper bleed passes through the gut before it can turn black, so bright red blood does not exclude the stomach or duodenum. A high BUN to creatinine ratio or hemodynamic instability raises the suspicion. An EGD is done early in unstable patients before or alongside the lower workup.' },
        { type: 'recall', q: 'Older patient with cramping left-sided abdominal pain followed within a day by bloody diarrhea. Likely cause?', a: 'Ischemic colitis',
          why: 'Low flow in a patient with vascular disease, recent hypotension or dehydration starves the watershed zones of the colon. Pain comes first and blood 12 to 24 hours later as the mucosa sloughs. Most cases resolve with fluids, bowel rest and antibiotics, without surgery.' },
        { type: 'recall', q: 'Why do the splenic flexure and rectosigmoid junction suffer ischemic colitis first?', a: 'They are watershed zones between arterial territories',
          why: 'Griffith point at the splenic flexure sits between the superior and inferior mesenteric arteries, and Sudeck point at the rectosigmoid sits between the inferior mesenteric and hypogastric supply. Each depends on small collaterals, so any fall in flow hits them first. CT shows thumbprinting from submucosal edema.' },
        { type: 'bucket', q: 'Sort each cause of lower GI bleeding by whether it is painful.', bins: ['Painful', 'Painless'],
          items: [
            { label: 'Ischemic colitis', bin: 'Painful' },
            { label: 'Diverticulosis', bin: 'Painless' },
            { label: 'Angiodysplasia', bin: 'Painless' },
            { label: 'Infectious colitis', bin: 'Painful' },
            { label: 'Colon cancer', bin: 'Painless' },
            { label: 'Inflammatory bowel disease', bin: 'Painful' }
          ],
          why: 'Inflammation or ischemia of the bowel wall hurts, so colitis of any cause presents with pain. Bleeding from a vessel in a diverticulum, a vascular malformation or a tumor is painless because nothing inflames the wall. Diverticulosis is the most common source of major lower GI bleeding.' },
        { type: 'recall', q: 'Most common cause of major lower GI bleeding?', a: 'Diverticulosis',
          why: 'The vasa recta run over the dome of each diverticulum and erode, producing sudden painless large-volume hematochezia. Most stop spontaneously, and colonoscopy within a day can clip or inject a visible vessel. Recurrence after a second bleed is high enough to consider colectomy.' },
        { type: 'recall', q: 'Why is angiodysplasia associated with aortic stenosis?', a: 'The stenotic valve shears von Willebrand multimers',
          why: 'High shear across a tight aortic valve unfolds and cleaves the large von Willebrand multimers, creating an acquired bleeding disorder. The vascular malformations themselves are common in the right colon of older adults and in ESRD; the bleeding diathesis makes them bleed. Valve replacement resolves the Heyde syndrome.' },
        { type: 'recall', q: 'Imaging to confirm suspected acute diverticulitis?', a: 'CT abdomen and pelvis with IV contrast',
          why: 'CT shows the inflamed diverticulum, pericolic fat stranding and any abscess, perforation or fistula that changes management. Colonoscopy is avoided in the acute phase because insufflation risks perforation, but it is done 6 to 8 weeks later to exclude a cancer that mimicked diverticulitis.' },
        { type: 'truefalse', q: 'Patients with diverticulosis should avoid nuts, seeds, corn and popcorn.', a: false,
          why: 'Large cohort data showed no increase in diverticulitis or bleeding with these foods, and nut intake was if anything protective. What does help is a high-fiber diet of 25 to 30 grams a day, regular exercise, a normal body weight, not smoking and avoiding non-aspirin NSAIDs.' },
        { type: 'multi', q: 'Select the measures that reduce the risk of diverticulitis.',
          answers: ['High-fiber diet', 'Regular exercise', 'Avoiding non-aspirin NSAIDs', 'Not smoking'],
          distractors: ['Avoiding nuts and seeds', 'Low-residue diet', 'Daily probiotics'],
          why: 'Fiber, exercise, a normal body weight and not smoking each lower the risk, and NSAIDs raise it. Nut and seed avoidance was disproven. A low-residue diet is used only briefly during an acute attack, and probiotics have no proven preventive role.' },
        { type: 'recall', q: 'Imaging for suspected malignant bowel obstruction?', a: 'CT abdomen and pelvis with IV contrast',
          why: 'CT finds the transition point, shows the mass and detects ischemia, perforation or metastases that decide between surgery, stenting and palliation. Plain films only confirm dilated loops and air-fluid levels. Oral contrast is unnecessary and risks aspiration in a vomiting patient.' },
        { type: 'recall', q: 'Why is a chronic anal fissure found in the posterior midline in 90 percent of cases?', a: 'That location has the poorest blood supply',
          why: 'The posterior commissure of the anal canal has the least perfusion, and internal sphincter spasm reduces it further, so a tear there cannot heal. A sentinel skin tag, hypertrophied papilla and visible sphincter fibers mark chronicity beyond 6 to 8 weeks. Fissures off the midline raise concern for Crohn disease, HIV or cancer.' },
        { type: 'recall', q: 'First-line treatment for a chronic anal fissure?', a: 'Topical diltiazem or nitroglycerin for 6 to 8 weeks',
          why: 'These relax the internal sphincter, restore blood flow and let the fissure heal in about two thirds of patients. Calcium channel blockers are preferred because nitroglycerin causes headaches. Acute fissures need only sitz baths and fiber; steroids and pramoxine relieve symptoms but do not heal the tear.' },
        { type: 'recall', q: 'Treatment for a chronic anal fissure that fails topical therapy?', a: 'Lateral internal sphincterotomy',
          why: 'Dividing part of the internal sphincter permanently relieves the spasm and heals over 90 percent of fissures. The trade-off is a small risk of incontinence to flatus, which is why it is reserved for failures of 8 weeks of topical treatment. Botulinum toxin injection is the intermediate option.' }
      ]
    },

    {
      id: 'gi-crc', subject: 'GI & Hepatology', topic: 'Bowel & Colon', name: 'CRC SCREENING',
      blurb: 'Average-risk screening, post-polypectomy intervals, family history, Lynch syndrome and FAP.',
      cards: [
        { type: 'number', q: 'Age at which USPSTF colorectal cancer screening begins for average-risk adults?', value: 45, unit: 'years',
          why: 'Rising incidence in younger adults moved the start from 50 to 45, a grade B recommendation. Screening from 50 to 75 is grade A. From 76 to 85 it is individualized by health and prior screening, and it stops after 85 because the harms outweigh the benefit.' },
        { type: 'number', q: 'Age after which USPSTF recommends against colorectal cancer screening?', value: 85, unit: 'years',
          why: 'A colon cancer takes about 10 years to develop from an adenoma, so a person unlikely to live that long cannot benefit while still facing the risks of colonoscopy. Between 76 and 85 the decision is individualized, with the most benefit for those never screened.' },
        { type: 'match', q: 'Match each average-risk screening test to its repeat interval.',
          pairs: [
            { left: 'Colonoscopy', right: '10 years' },
            { left: 'FIT', right: '1 year' },
            { left: 'CT colonography', right: '5 years' },
            { left: 'Stool DNA-FIT', right: '1 to 3 years' }
          ] },
        { type: 'recall', q: 'Next step after a positive FIT or stool DNA test?', a: 'Colonoscopy',
          why: 'A positive stool test is a screen, not a diagnosis, and only colonoscopy can find and remove the source. Repeating the stool test to see if it stays positive delays a cancer diagnosis and is never appropriate. Set up the colonoscopy directly and treat the FIT as done.' },
        { type: 'recall', q: 'Why are stool-based tests not used to screen patients with prior adenomas, IBD or a strong family history?', a: 'They are validated only for average-risk screening',
          why: 'Stool tests detect blood or DNA shed by larger lesions and miss many adenomas. Patients with elevated risk need the lesions found and removed, which only colonoscopy does. Any history of polyps, colitis, a first-degree relative with cancer or a hereditary syndrome moves the patient to colonoscopy alone.' },
        { type: 'number', q: 'Repeat colonoscopy interval after removal of 1 or 2 tubular adenomas under 10 mm?', value: 7, unit: 'years',
          why: 'Small low-risk adenomas carry nearly the same future risk as no polyps, so the 2020 US Multi-Society Task Force extended the interval to 7 to 10 years. Three or four small adenomas or one or two sessile serrated polyps shorten it to 3 to 5 years.' },
        { type: 'number', q: 'Repeat colonoscopy interval after an adenoma of 10 mm or larger?', value: 3, unit: 'years',
          why: 'Size is one marker of an advanced adenoma, which predicts further advanced neoplasia. Villous histology, high-grade dysplasia and five to ten adenomas of any size share the same 3-year interval. More than ten adenomas shorten it to one year and warrant genetic testing for a polyposis syndrome.' },
        { type: 'multi', q: 'Select the polyp findings that set a 3-year repeat colonoscopy.',
          answers: ['Adenoma 10 mm or larger', 'Villous histology', 'High-grade dysplasia', '5 to 10 adenomas'],
          distractors: ['1 or 2 small tubular adenomas', 'Small distal hyperplastic polyp'],
          why: 'Each of these marks an advanced adenoma or a heavy burden and predicts further advanced neoplasia. One or two small tubular adenomas go 7 to 10 years and a small distal hyperplastic polyp is treated as a normal exam at 10 years.' },
        { type: 'number', q: 'Number of adenomas on one colonoscopy above which the patient needs a repeat in one year and genetic testing?', value: 10, unit: 'adenomas',
          why: 'More than ten adenomas raises suspicion for familial adenomatous polyposis, MUTYH-associated polyposis or another hereditary syndrome. The one-year interval clears the remaining burden while germline testing proceeds. Younger age and a family history strengthen the case.' },
        { type: 'recall', q: 'Why does a hyperplastic polyp in the rectum or sigmoid not shorten the screening interval?', a: 'Small distal hyperplastic polyps are benign',
          why: 'Hyperplastic polyps under 10 mm in the rectosigmoid are a benign finding, and the next colonoscopy stays at 10 years. Sessile serrated polyps, which are proximal and histologically different, do carry risk and shorten the interval to 3 to 5 years.' },
        { type: 'number', q: 'Age to start colonoscopy in a patient whose first-degree relative had colon cancer at 55?', value: 40, unit: 'years',
          why: 'With a first-degree relative diagnosed before 60, screening starts at 40 or 10 years before the relative\'s age, whichever is earlier, and repeats every 5 years. A relative diagnosed at 55 gives 45 by the subtraction rule, so 40 wins. The same rule applies to an advanced adenoma in a relative.' },
        { type: 'recall', q: 'Colonoscopy interval when one first-degree relative had colon cancer at age 65?', a: 'Every 5 to 10 years, starting at 40',
          why: 'A single relative diagnosed at 60 or older roughly doubles risk but does not need the 5-year interval. Start at 40 and repeat every 5 to 10 years. A relative under 60 or two first-degree relatives at any age shortens the interval to every 5 years.' },
        { type: 'multi', q: 'Select the genes whose mutations cause Lynch syndrome.',
          answers: ['MLH1', 'MSH2', 'MSH6', 'PMS2'],
          distractors: ['APC', 'MUTYH'],
          why: 'Lynch syndrome is a defect in DNA mismatch repair, and tumors show microsatellite instability. APC causes familial adenomatous polyposis, MUTYH causes a recessive polyposis and BRCA1 drives breast and ovarian cancer. Tumor testing for mismatch repair proteins is how most cases are first found.' },
        { type: 'recall', q: 'Colonoscopy schedule for a patient with Lynch syndrome?', a: 'Every 1 to 2 years, starting at age 20 to 25',
          why: 'Lynch cancers arise from flat adenomas that progress in two to three years rather than ten, so the usual intervals miss them. Start at 20 to 25 or 2 to 5 years before the youngest family diagnosis. Lifetime colon cancer risk reaches 80 percent without surveillance.' },
        { type: 'recall', q: 'Most common cancer outside the colon in Lynch syndrome?', a: 'Endometrial cancer',
          why: 'Women with Lynch syndrome face a 40 to 60 percent lifetime risk of endometrial cancer, often before the colon cancer. Ovarian, gastric and urothelial cancers follow. Annual endometrial sampling from 30 to 35 and risk-reducing hysterectomy after childbearing are offered.' },
        { type: 'recall', q: 'Why is prophylactic colectomy recommended in familial adenomatous polyposis?', a: 'Colon cancer is nearly certain by age 40 to 50',
          why: 'Hundreds to thousands of adenomas develop in the teens, and with that burden cancer cannot be prevented by polypectomy. Annual sigmoidoscopy or colonoscopy begins at 10 to 12, and colectomy follows once polyps become numerous, usually in the late teens or twenties.' },
        { type: 'number', q: 'Age to begin annual sigmoidoscopy or colonoscopy in familial adenomatous polyposis?', value: 10, unit: 'years',
          why: 'Polyps appear in the second decade, so surveillance starts at 10 to 12 in anyone with an APC mutation. Upper endoscopy is added because duodenal and periampullary adenomas are the main cancer threat after colectomy. Desmoid tumors and retinal pigment hypertrophy are the extraintestinal clues.' },
        { type: 'recall', q: 'Why does familial adenomatous polyposis still need upper endoscopy after colectomy?', a: 'Duodenal and periampullary adenomas become cancer',
          why: 'Once the colon is gone, periampullary cancer becomes the leading cause of cancer death in FAP. Duodenal polyps are staged by the Spigelman score to set the endoscopy interval. Desmoid tumors in the mesentery are the other major post-colectomy problem.' }
      ]
    },

    {
      id: 'ms-shoulder', subject: 'MSK & Sports Medicine', topic: 'Upper Extremity', name: 'SHOULDER',
      blurb: 'Frozen shoulder, labral tears, anterior dislocation and the rotator cuff.',
      cards: [
        { type: 'recall', q: 'Exam finding that separates adhesive capsulitis from rotator cuff disease?', a: 'Loss of passive range of motion',
          why: 'A contracted capsule blocks the joint no matter who moves it, so both active and passive motion are lost, worst in external rotation and abduction. A painful or torn cuff limits active motion through pain and weakness, but the examiner can still move the arm through a full passive arc.' },
        { type: 'recall', q: 'Why is passive external rotation the most restricted movement in adhesive capsulitis?', a: 'The coracohumeral ligament contracts first',
          why: 'Fibroblastic proliferation thickens the rotator interval and coracohumeral ligament, which are the main restraints to external rotation. Passive external rotation under half of the other side is the hallmark. Diabetes raises the risk to as high as 20 percent, and hypothyroidism, Parkinson disease and immobilization are the other associations.' },
        { type: 'recall', q: 'Why are plain radiographs ordered in suspected adhesive capsulitis when the diagnosis is clinical?', a: 'To exclude arthritis or a locked posterior dislocation',
          why: 'Both of those also take away passive motion and both look like a frozen shoulder on exam. The films in true adhesive capsulitis are normal. MRI adds nothing to the diagnosis and is not needed.' },
        { type: 'recall', q: 'First-line treatment for adhesive capsulitis?', a: 'Intra-articular steroid injection plus physical therapy',
          why: 'The combination restores motion and relieves pain faster than therapy or NSAIDs alone, especially in the painful freezing phase. A sling is the one thing to avoid because immobilization feeds the contracture. The condition runs through freezing, frozen and thawing phases over one to two years.' },
        { type: 'recall', q: 'Overhead athlete with deep shoulder pain and catching or popping, and a positive O\'Brien test. Diagnosis?', a: 'Superior labral (SLAP) tear',
          why: 'Repetitive overhead loading or a fall on the outstretched arm tears the labrum at the biceps anchor, producing mechanical symptoms that cuff tendinopathy does not. The anterior slide and O\'Brien active compression tests are the provocative maneuvers. Start with scapular stabilization and posterior capsule stretching.' },
        { type: 'recall', q: 'Best nonoperative imaging for a suspected labral tear?', a: 'MR arthrography',
          why: 'Intra-articular gadolinium distends the joint and outlines the labrum, which plain MRI often misses. Order it when therapy fails and arthroscopic repair or biceps tenodesis is being considered, not as a first step.' },
        { type: 'recall', q: 'Nerve to examine before and after reducing an anterior shoulder dislocation?', a: 'Axillary nerve',
          why: 'The axillary nerve wraps around the surgical neck of the humerus and is stretched when the head dislocates anteroinferiorly. Test sensation over the lateral deltoid, the regimental badge area, because deltoid strength cannot be tested in a dislocated or freshly reduced shoulder. Document it both times so a reduction is not blamed for the injury.' },
        { type: 'recall', q: 'Avulsion of the anteroinferior labrum after an anterior shoulder dislocation. Name of the lesion?', a: 'Bankart lesion',
          why: 'The humeral head tears the labrum off the front of the glenoid rim as it leaves the socket, which removes the main restraint to the next dislocation. It is the lesion the arthroscopic stabilization repairs.' },
        { type: 'recall', q: 'Compression fracture of the posterolateral humeral head after an anterior dislocation. Name of the lesion?', a: 'Hill-Sachs defect',
          why: 'The soft back of the humeral head is driven against the hard anterior glenoid rim and dented. A large defect engages the rim with the arm abducted and externally rotated and drives recurrence. The axillary view shows it best.' },
        { type: 'number', q: 'Recurrence rate of anterior shoulder dislocation in young athletes treated with a sling alone?', value: 85, unit: '%',
          why: 'Eighty to ninety percent of patients under 25 to 30 redislocate after nonoperative care because the torn labrum does not heal back to the glenoid. That is why a first-time dislocation in a young contact or overhead athlete goes to arthroscopic Bankart stabilization rather than a second trial of the sling.' },
        { type: 'recall', q: 'Why is a first-time anterior dislocation in a 19-year-old rugby player referred for surgery?', a: 'Nonoperative treatment fails in most young athletes',
          why: 'Young age and contact sport are the strongest predictors of recurrence, and each redislocation enlarges the Hill-Sachs defect and the bone loss on the glenoid. Early arthroscopic Bankart repair cuts recurrence to a fraction. Older adults rarely redislocate and are managed in a sling.' },
        { type: 'recall', q: 'Complication to look for in a 55-year-old whose shoulder stays weak 3 weeks after reduction of a dislocation?', a: 'Rotator cuff tear',
          why: 'Forty to sixty percent of patients over 40 tear the cuff during an anterior dislocation, because the aging tendon fails before the labrum does. Persistent weakness two to three weeks out needs MRI or ultrasound, since a delayed repair allows muscle atrophy and fatty infiltration.' },
        { type: 'multi', q: 'Select the radiographic views needed before and after reducing a shoulder dislocation.',
          answers: ['Anteroposterior', 'Scapular Y', 'Axillary'],
          distractors: ['Lateral humerus', 'Stryker notch', 'Oblique clavicle'],
          why: 'The AP view shows the dislocation, the scapular Y confirms direction and the axillary view catches a posterior dislocation and a Hill-Sachs defect that the other two miss. Films before reduction document fractures that a reduction would otherwise be blamed for.' },
        { type: 'match', q: 'Match each exam maneuver to the rotator cuff muscle it tests.',
          pairs: [
            { left: 'Empty can', right: 'Supraspinatus' },
            { left: 'External rotation', right: 'Infraspinatus' },
            { left: 'Lift-off test', right: 'Subscapularis' },
            { left: 'Drop-arm test', right: 'Full-thickness tear' }
          ] },
        { type: 'recall', q: 'Lateral shoulder pain reaching overhead, worse lying on that side at night, painful arc 60 to 120 degrees. Diagnosis?', a: 'Rotator cuff tendinopathy',
          why: 'The supraspinatus is pinched under the acromion through the middle of abduction, which is where the arc hurts, and lying on the shoulder compresses the inflamed tendon. Night pain is the classic complaint. Treat with eccentric cuff and scapular stabilizer strengthening, NSAIDs and a subacromial steroid injection if needed.' },
        { type: 'recall', q: 'Exam test that indicates a full-thickness rotator cuff tear rather than tendinopathy?', a: 'Drop-arm test',
          why: 'With the supraspinatus torn through, the patient cannot lower the abducted arm slowly and it drops. The empty can and impingement signs are positive in both tendinopathy and tear, so they cannot make the distinction.' },
        { type: 'recall', q: 'Why does an acute full-thickness cuff tear in a young patient need repair within 6 weeks?', a: 'The detached muscle atrophies and turns to fat',
          why: 'Once the tendon retracts, the detached muscle undergoes fatty infiltration that does not reverse, and a late repair fails or retears. Prompt MRI and early surgery give the best function. Degenerative tears in older adults are managed with therapy first.' }
      ]
    },

    {
      id: 'ms-hand', subject: 'MSK & Sports Medicine', topic: 'Upper Extremity', name: 'WRIST & HAND',
      blurb: 'Scaphoid fracture, pediatric buckle fracture, fingertip injuries and finger dislocations.',
      cards: [
        { type: 'recall', q: 'Most commonly fractured carpal bone?', a: 'Scaphoid',
          why: 'A fall on the outstretched hand with the wrist hyperextended and radially deviated drives the scaphoid against the radius. Look for anatomic snuffbox tenderness, tenderness over the volar scaphoid tubercle and pain with axial compression of the thumb.' },
        { type: 'number', q: 'Percent of acute scaphoid fractures missed on initial radiographs?', value: 20, unit: '%',
          why: 'Fifteen to twenty-five percent are invisible on the first films, even with a dedicated scaphoid view. That is why snuffbox tenderness with a normal x-ray is treated as a fracture until proven otherwise.' },
        { type: 'recall', q: 'Why does a missed scaphoid waist fracture lead to avascular necrosis?', a: 'Blood enters distally and flows to the proximal pole',
          why: 'Branches of the radial artery enter at the distal pole, so a fracture through the waist cuts off the proximal fragment. Untreated, that fragment dies, the fracture fails to unite and the wrist develops arthritis, the SNAC wrist. Early immobilization protects the supply while it heals.' },
        { type: 'recall', q: 'Management of snuffbox tenderness with normal wrist radiographs?', a: 'Thumb spica splint and repeat films in 10 to 14 days',
          why: 'Bone resorbs along an occult fracture line over two weeks and makes it visible on the repeat films. If an athlete or manual worker needs an immediate answer, a noncontrast MRI or CT settles it the same day. Never discharge on the strength of the first x-ray.' },
        { type: 'recall', q: 'Why is a pediatric buckle fracture of the distal radius stable?', a: 'One cortex buckles and the periosteum stays intact',
          why: 'A child\'s porous metaphysis crumples on the dorsal side under axial load while the volar cortex and thick periosteum hold, so the fracture cannot displace. That stability is the whole reason it can be treated so simply.' },
        { type: 'recall', q: 'Treatment for a pediatric distal radius buckle fracture?', a: 'Removable wrist splint for 2 to 3 weeks',
          why: 'Trials show a prefabricated splint or soft bandage heals these as well as a cast, with no orthopedic referral, no follow-up visit and no repeat films. Parents remove the splint once the child is pain free. Greenstick and complete fractures can angulate and still need casting and follow-up.' },
        { type: 'truefalse', q: 'A pediatric buckle fracture of the distal radius needs a repeat radiograph to confirm healing.', a: false,
          why: 'The fracture is inherently stable and cannot displace, so repeat imaging changes nothing and adds radiation and a visit. Clinical recovery is the endpoint. Repeat films are reserved for greenstick and bicortical fractures that can lose position.' },
        { type: 'recall', q: 'Splint for a distal phalanx tuft fracture?', a: 'DIP joint in extension for 4 to 6 weeks, PIP free',
          why: 'A stack or aluminum splint protects the fingertip while the crush injury heals. Including the PIP joint in the splint stiffens a joint that was never injured, so it is left free to move.' },
        { type: 'number', q: 'Subungual hematoma covering less than what fraction of the nail bed needs no drainage?', value: 50, unit: '%',
          why: 'A small hematoma that is not causing severe throbbing pain resolves on its own. Trephinate with cautery or an 18-gauge needle only for an acutely painful, throbbing collection. Removing the nail to repair the bed is obsolete as long as the nail edges are intact.' },
        { type: 'recall', q: 'Structure disrupted in a dorsal PIP dislocation?', a: 'Volar plate',
          why: 'Hyperextension with axial load, the jammed finger, tears the volar plate as the middle phalanx rides dorsally. Reduce under digital block, test stability and get a post-reduction lateral film to measure any volar lip fracture.' },
        { type: 'recall', q: 'Management of a stable dorsal PIP dislocation with a volar lip fragment under 30 percent of the joint surface?', a: 'Short extension splint, then buddy taping 3 to 6 weeks',
          why: 'A few days in an extension splint settles the pain, and buddy taping to the neighbor finger then allows early protected motion, which prevents the stiffness that prolonged splinting causes. Unstable joints or fragments over 30 to 40 percent go to hand surgery for extension-block splinting or fixation.' },
        { type: 'recall', q: 'Why does a central slip rupture produce PIP flexion with DIP hyperextension?', a: 'The lateral bands slip volar to the PIP axis',
          why: 'Without the central slip holding them dorsally, the lateral bands drop below the joint axis and become PIP flexors while still pulling the DIP into extension. That is the boutonniere deformity. The Elson test catches the rupture before the deformity appears.' },
        { type: 'recall', q: 'Splint for a central slip rupture?', a: 'PIP in full extension for 6 weeks',
          why: 'Holding the PIP straight lets the central slip heal, and actively bending the DIP pulls the lateral bands back dorsally where they belong. Splinting both joints would leave the lateral bands displaced and the deformity fixed.' },
        { type: 'recall', q: 'Ball strikes an extended fingertip and the patient cannot actively extend the DIP joint. Diagnosis?', a: 'Mallet finger',
          why: 'Forced flexion avulses the terminal extensor tendon from the distal phalanx, with or without a small dorsal bone fragment. The fingertip droops and cannot be lifted actively but extends passively. Refer if the fragment is over a third of the joint surface or the joint subluxes volarly.' },
        { type: 'number', q: 'Minimum weeks of continuous DIP extension splinting for a mallet finger?', value: 6, unit: 'weeks',
          why: 'Six to eight weeks of uninterrupted extension lets the tendon scar back to bone. If the patient takes the splint off and lets the tip droop even once, the healing tendon pulls apart and the clock restarts. The PIP is left free throughout.' },
        { type: 'recall', q: 'Cannot actively flex the DIP joint of the ring finger after grabbing an opponent\'s jersey. Diagnosis?', a: 'Jersey finger',
          why: 'Forced extension of an actively flexed finger avulses the flexor digitorum profundus from the distal phalanx, and 75 percent occur in the ring finger. Test by holding the PIP in extension and asking for DIP flexion. The tendon retracts into the palm, so it cannot heal with a splint.' },
        { type: 'recall', q: 'Why does jersey finger need urgent surgical referral while mallet finger is splinted?', a: 'The retracted flexor tendon cannot reach bone on its own',
          why: 'The profundus tendon snaps back into the sheath or palm and loses its blood supply, so reinsertion within 7 to 10 days is the only way to restore DIP flexion. The extensor in mallet finger stays near the bone and heals in a splint.' }
      ]
    },

    {
      id: 'ms-hip', subject: 'MSK & Sports Medicine', topic: 'Hip & Knee', name: 'HIP & GROIN',
      blurb: 'Localizing hip pain, hip fracture imaging, osteoarthritis, trochanteric pain and hernias.',
      cards: [
        { type: 'bucket', q: 'Sort each cause of hip pain by where the patient feels it.', bins: ['Groin', 'Lateral'],
          items: [
            { label: 'Osteoarthritis', bin: 'Groin' },
            { label: 'Gluteus medius tendinopathy', bin: 'Lateral' },
            { label: 'Femoral neck stress fracture', bin: 'Groin' },
            { label: 'Labral tear', bin: 'Groin' },
            { label: 'Snapping iliotibial band', bin: 'Lateral' },
            { label: 'Avascular necrosis', bin: 'Groin' }
          ],
          why: 'Anything inside the hip joint refers to the groin and is reproduced by rotating the flexed hip, the log-roll, FADIR and FABER tests. Lateral pain over the greater trochanter comes from the abductor tendons and the iliotibial band outside the joint. Posterior buttock pain points to the sacroiliac joint, the lumbar spine or the piriformis.' },
        { type: 'recall', q: 'Why does intra-articular hip pathology present as groin pain rather than pain over the hip?', a: 'The capsule shares nerves with the groin and thigh',
          why: 'The hip capsule shares its nerve supply with the anterior thigh and groin, so arthritis, labral tears, stress fractures and avascular necrosis all refer there. Patients who point to the side of the hip usually have a tendon problem, and those pointing to the buttock have a spine or sacroiliac problem.' },
        { type: 'recall', q: 'Leg position after a displaced hip fracture?', a: 'Shortened and externally rotated',
          why: 'The fractured femur loses its lever against the acetabulum, the muscles pull the shaft upward and the short external rotators and iliopsoas turn it out. A fall with groin pain, inability to bear weight and this leg position is a hip fracture until the films say otherwise.' },
        { type: 'recall', q: 'Next test when hip radiographs are negative but the patient still cannot bear weight after a fall?', a: 'MRI of the hip without contrast',
          why: 'Two to ten percent of hip fractures in osteoporotic older adults are invisible on the first films. MRI is nearly 100 percent sensitive within 24 hours and shows the marrow edema of an occult femoral neck fracture. CT or bone scan is the fallback only when MRI is contraindicated.' },
        { type: 'recall', q: 'Hip range of motion lost first in osteoarthritis?', a: 'Internal rotation',
          why: 'Osteophytes and capsular thickening restrict internal rotation before any other plane, and less than 15 degrees with groin pain is a strong clinical sign. Morning stiffness lasts under 30 minutes, unlike inflammatory arthritis.' },
        { type: 'recall', q: 'Why are topical NSAIDs not recommended for hip osteoarthritis when they work for the knee and hand?', a: 'The hip joint is too deep for the drug to reach',
          why: 'Topical diclofenac penetrates a centimeter or two, enough for superficial joints but not for a joint buried under the gluteal and thigh muscles. Hip osteoarthritis gets land-based or aquatic exercise, weight loss and oral NSAIDs instead.' },
        { type: 'recall', q: 'Next step for hip osteoarthritis that persists despite physical therapy and oral NSAIDs?', a: 'Image-guided intra-articular corticosteroid injection',
          why: 'The hip cannot be injected reliably by landmarks, so ultrasound or fluoroscopy guides the needle. Steroid gives weeks to months of relief. Hyaluronic acid injection into the hip is recommended against because it has not shown benefit.' },
        { type: 'recall', q: 'Why is "trochanteric bursitis" now called greater trochanteric pain syndrome?', a: 'It is abductor tendinopathy, not an inflamed bursa',
          why: 'MRI and histology show degenerative tendinopathy or tears of the abductor tendons where they insert on the trochanter, with little inflammation in the bursa. Thinking of it as the rotator cuff of the hip explains why eccentric loading and abductor strengthening work better than rest.' },
        { type: 'recall', q: 'Lateral hip pain lying on that side, tenderness over the greater trochanter and a Trendelenburg gait. Diagnosis?', a: 'Gluteus medius tendinopathy',
          why: 'The abductor tendons insert on the trochanter, so pressure on it and resisted abduction hurt, and a weakened gluteus medius lets the opposite side of the pelvis drop when standing on the affected leg. Pain with resisted hip abduction confirms the source.' },
        { type: 'recall', q: 'Next step when lateral hip pain fails NSAIDs, physical therapy and a corticosteroid injection?', a: 'MRI or ultrasound for a gluteus medius tear',
          why: 'A full-thickness abductor tear does not respond to conservative care and may need surgical repair. Imaging separates it from tendinopathy that just needs more time. Persistent Trendelenburg weakness is the clue that a tear is present.' },
        { type: 'recall', q: 'Imaging needed before referring a palpable, symptomatic inguinal hernia for repair?', a: 'None',
          why: 'A groin bulge that aches with standing, lifting or coughing is diagnosed by history and exam, and ultrasound or CT adds nothing. Imaging is reserved for occult groin pain when no hernia can be felt. Minimally symptomatic reducible hernias in men can be watched safely.' },
        { type: 'recall', q: 'Why does a femoral hernia always need prompt surgical repair while a small inguinal hernia can be watched?', a: 'Femoral hernias strangulate in 20 to 40 percent',
          why: 'The femoral canal is a narrow rigid ring below and lateral to the pubic tubercle, so bowel that enters it is easily trapped and loses its blood supply. These hernias are more common in women and are often mistaken for inguinal hernias. Watchful waiting is only for asymptomatic reducible inguinal hernias.' }
      ]
    },

    {
      id: 'ms-knee', subject: 'MSK & Sports Medicine', topic: 'Hip & Knee', name: 'KNEE',
      blurb: 'Ottawa knee rule, overuse syndromes by location, and ligament and meniscal tears.',
      cards: [
        { type: 'multi', q: 'Select the Ottawa knee rule criteria that call for radiographs after acute knee trauma.',
          answers: ['Age 55 or older', 'Isolated patellar tenderness', 'Fibular head tenderness', 'Cannot flex to 90 degrees', 'Cannot take 4 steps'],
          distractors: ['Joint effusion', 'Joint line tenderness'],
          why: 'Any one of the five criteria means films, and together they catch 98 to 100 percent of clinically significant fractures. Effusion, joint line tenderness, bruising and a limp are common after soft-tissue injuries and are deliberately left out. The four-step test counts even if the patient limps.' },
        { type: 'number', q: 'Age at or above which the Ottawa knee rule mandates radiographs after any acute knee injury?', value: 55, unit: 'years',
          why: 'Bone quality falls with age and fractures occur with lower-energy mechanisms, so age alone is a criterion. Inability to bear weight for four steps both at the time of injury and in the exam room is the other criterion that applies regardless of where the tenderness is.' },
        { type: 'truefalse', q: 'A moderate knee effusion after injury is an Ottawa criterion for radiographs.', a: false,
          why: 'Effusions follow ligament and meniscal injuries far more often than fractures, so including them would make the rule order films on nearly everyone. The rule relies on bony tenderness at the patella and fibular head, age, flexion and weight bearing.' },
        { type: 'recall', q: 'Lateral knee pain in a runner, worse downhill, with point tenderness 2 to 3 cm above the lateral joint line. Diagnosis?', a: 'Iliotibial band syndrome',
          why: 'The distal band rubs over the lateral femoral epicondyle at about 30 degrees of flexion, exactly where the tenderness sits. The Noble compression test reproduces it as the knee extends through 30 degrees and the Ober test shows band tightness. Treat with hip abductor strengthening and band stretching.' },
        { type: 'recall', q: 'Why does hip abductor strengthening treat iliotibial band syndrome at the knee?', a: 'Weak abductors let the knee drift in and load the band',
          why: 'When the gluteus medius fatigues, the pelvis drops and the femur adducts and internally rotates, stretching the band across the lateral epicondyle with every stride. Strengthening the abductors corrects the mechanics that cause the friction.' },
        { type: 'recall', q: 'Young woman with dull pain behind the kneecap after prolonged sitting, squatting and descending stairs. Diagnosis?', a: 'Patellofemoral pain syndrome',
          why: 'Patellar maltracking loads the retropatellar cartilage whenever the knee is held or moved under flexion, which is why sitting through a movie hurts. There is no effusion or instability and no imaging is needed. Treat with vastus medialis and hip abductor and external rotator strengthening.' },
        { type: 'match', q: 'Match each knee overuse condition to the site of tenderness.',
          pairs: [
            { left: 'Patellar tendinopathy', right: 'Inferior patellar pole' },
            { left: 'Osgood-Schlatter', right: 'Tibial tubercle' },
            { left: 'Pes anserine', right: 'Below medial joint line' },
            { left: 'Iliotibial band', right: 'Lateral epicondyle' }
          ] },
        { type: 'recall', q: 'Why does Osgood-Schlatter disease occur only in adolescents?', a: 'It is traction on an open tibial tubercle apophysis',
          why: 'During the growth spurt the patellar tendon pulls on cartilage that has not yet fused to the tibia, producing pain, swelling and a bony bump at the tubercle. Once the apophysis closes the condition resolves. Sport can continue as tolerated, with ice and eccentric quadriceps work, and steroid injections are avoided.' },
        { type: 'recall', q: 'Treatment of choice for patellar tendinopathy?', a: 'Eccentric decline-board quadriceps strengthening',
          why: 'Loading the tendon eccentrically on a decline board remodels the degenerated collagen, which rest alone does not do. Corticosteroid injection weakens the tendon and risks rupture, so it is avoided. Basketball and volleyball players are the typical patients.' },
        { type: 'recall', q: 'Older woman with obesity and medial knee pain 4 to 5 cm below the joint line, worse climbing stairs. Diagnosis?', a: 'Pes anserine bursitis',
          why: 'The sartorius, gracilis and semitendinosus insert together on the proximal medial tibia below the joint line, and that conjoined insertion is the point of tenderness. Pain at the joint line itself would suggest the meniscus or arthritis instead. Treat with hamstring stretching, NSAIDs, weight loss or a local steroid injection.' },
        { type: 'recall', q: 'Why does an ACL tear swell within 2 to 4 hours while a meniscal tear swells the next day?', a: 'The ACL bleeds, the meniscus has almost no vessels',
          why: 'The torn ligament tears its own blood supply and produces a rapid hemarthrosis, usually with a pop and inability to continue playing. Most of the meniscus has no blood vessels, so a tear causes a slower reactive effusion over 12 to 24 hours with locking or catching.' },
        { type: 'recall', q: 'Most sensitive and specific exam test for an ACL tear?', a: 'Lachman test',
          why: 'Pulling the tibia forward at 20 to 30 degrees of flexion isolates the ACL without hamstring guarding, giving sensitivity and specificity above 85 to 95 percent. The anterior drawer is less reliable in the acute swollen knee and the pivot shift is hard to perform awake.' },
        { type: 'recall', q: 'Knee struck on the dashboard with the tibia pushed backward and a positive posterior sag sign. Diagnosis?', a: 'Posterior cruciate ligament tear',
          why: 'A blow to the front of the flexed tibia drives it backward and tears the PCL. The tibia then sags behind the femur when the knee is flexed, and the posterior drawer test is positive. It is often missed because the swelling is modest compared with an ACL tear.' },
        { type: 'recall', q: 'Most accurate physical exam test for a meniscal tear?', a: 'Thessaly test',
          why: 'Standing on the affected leg with the knee flexed 20 degrees and rotating the body loads the meniscus under body weight, reproducing pain or catching. It outperforms McMurray and joint line tenderness alone. Confirm with MRI when the result would change management.' }
      ]
    },

    {
      id: 'ms-footfx', subject: 'MSK & Sports Medicine', topic: 'Foot & Ankle', name: 'ANKLE & FOOT FRACTURES',
      blurb: 'Ottawa ankle and foot rules, fifth metatarsal zones, Lisfranc injury and stress fractures.',
      cards: [
        { type: 'multi', q: 'Select the Ottawa ankle rule findings that call for ankle radiographs.',
          answers: ['Back of lateral malleolus tender', 'Back of medial malleolus tender', 'Cannot take 4 steps'],
          distractors: ['Anterior talofibular tender', 'Lateral ankle swelling', 'Ecchymosis over the malleolus'],
          why: 'The rule asks about bone, not ligament. Tenderness along the posterior edge or tip of either malleolus over its distal 6 cm, or inability to bear weight for four steps both at injury and in the exam room, means films. Swelling, bruising and tenderness over the ligaments in front of the malleolus do not.' },
        { type: 'multi', q: 'Select the Ottawa foot rule findings that call for midfoot radiographs.',
          answers: ['Fifth metatarsal base tender', 'Navicular tender', 'Cannot take 4 steps'],
          distractors: ['Cuboid tender', 'Heel pain', 'Forefoot swelling'],
          why: 'Midfoot pain plus bony tenderness at the base of the fifth metatarsal or the navicular, or inability to bear weight for four steps, triggers a foot series. Those two bones are where the fractures that change management occur. The rule is for the midfoot zone only.' },
        { type: 'number', q: 'Ottawa rules measure malleolar bony tenderness along how many centimeters of the posterior edge?', value: 6, unit: 'cm',
          why: 'The distal 6 cm of the posterior edge and tip of each malleolus is where ankle fractures are tender. Palpating the anterior edge or the ligaments in front of the malleolus picks up sprains and would make the rule order unnecessary films.' },
        { type: 'recall', q: 'Why does a zone 1 fifth metatarsal tuberosity avulsion heal while a zone 2 Jones fracture often does not?', a: 'Zone 2 lies in a vascular watershed',
          why: 'The tuberosity has a rich metaphyseal blood supply and unites over 95 percent of the time with weight bearing in a boot. The metaphyseal-diaphyseal junction sits between the nutrient artery and the metaphyseal vessels, so a Jones fracture has the highest nonunion rate of any foot bone, 15 to 30 percent or more.' },
        { type: 'recall', q: 'Treatment of a nondisplaced zone 1 fifth metatarsal tuberosity fracture?', a: 'Weight bearing in a boot or stiff shoe for 3 to 6 weeks',
          why: 'The inversion injury pulls the tuberosity off through the peroneus brevis and plantar fascia, and the fragment is well vascularized. Surgery is only for displacement over 2 mm or involvement of more than 30 percent of the cubometatarsal joint.' },
        { type: 'recall', q: 'Treatment of a zone 2 Jones fracture in a nonathlete?', a: 'Non-weight-bearing short-leg cast for 6 to 8 weeks',
          why: 'Unloading the watershed zone gives the poor blood supply its best chance to unite. Competitive athletes, active patients and all zone 3 stress fractures go to early intramedullary screw fixation because casting takes too long and fails too often.' },
        { type: 'recall', q: 'Why is a Jones fracture in a competitive athlete referred for intramedullary screw fixation rather than cast?', a: 'The screw heals the fracture faster and more reliably',
          why: 'Casting a watershed fracture takes 6 to 8 weeks of non-weight-bearing with a 15 to 30 percent chance of nonunion. A screw compresses the fracture, allows earlier return and cuts the nonunion rate, which matters when a season is at stake.' },
        { type: 'bucket', q: 'Sort each fifth metatarsal fracture by how it is managed.', bins: ['Weight bear', 'Non-weight bear'],
          items: [
            { label: 'Zone 1 tuberosity avulsion', bin: 'Weight bear' },
            { label: 'Zone 2 Jones fracture', bin: 'Non-weight bear' },
            { label: 'Zone 3 diaphyseal stress', bin: 'Non-weight bear' },
            { label: 'Nondisplaced distal shaft', bin: 'Weight bear' }
          ],
          why: 'The tuberosity and the distal shaft have good blood supply and heal in a walking boot or hard-soled shoe with weight bearing as tolerated. The proximal metaphyseal-diaphyseal junction and proximal shaft lie in the watershed and must be unloaded in a cast or fixed with a screw.' },
        { type: 'recall', q: 'Treatment of a nondisplaced fracture of the distal fifth metatarsal shaft, the dancer\'s fracture?', a: 'Walking boot or hard-soled shoe, weight bearing',
          why: 'The distal diaphysis has good blood supply, so a fracture with under 3 to 4 mm of displacement and under 10 degrees of angulation heals in 3 to 6 weeks of protected weight bearing. It is the proximal zone 2 and 3 fractures that need unloading.' },
        { type: 'recall', q: 'Exam finding that is pathognomonic for a Lisfranc injury?', a: 'Plantar arch ecchymosis',
          why: 'Bruising on the sole of the midfoot after a twisting or axial load on a plantar-flexed foot means the tarsometatarsal ligaments have torn. Severe midfoot swelling, pain with passive pronation and abduction of the forefoot and inability to stand on tiptoe go with it.' },
        { type: 'recall', q: 'Why do normal foot radiographs not exclude a Lisfranc injury?', a: 'Non-weight-bearing films miss about a fifth of them',
          why: 'The tarsometatarsal joints only separate under load, so standard films show nothing in 16 to 20 percent of cases. With midfoot tenderness and arch bruising, immobilize non-weight-bearing and get a CT or MRI, or weight-bearing films looking for over 2 mm between the first and second metatarsal bases.' },
        { type: 'number', q: 'Diastasis between the first and second metatarsal bases on weight-bearing films that indicates a Lisfranc injury?', value: 2, unit: 'mm',
          why: 'The Lisfranc ligament ties the medial cuneiform to the base of the second metatarsal, and when it tears the gap opens under load. Missed injuries collapse the arch and leave chronic pain and post-traumatic arthritis, so the threshold is deliberately low.' },
        { type: 'recall', q: 'Focal bony pain during impact exercise that first eased with rest and now hurts with walking. Diagnosis?', a: 'Stress fracture',
          why: 'Repetitive loading outpaces bone remodeling, usually in the tibia, metatarsals, navicular, femoral neck or pelvis. Pinpoint bony tenderness is the sign. The progression from pain only with activity to pain with daily walking marks a fracture line forming.' },
        { type: 'number', q: 'Percent of early stress fractures with normal plain radiographs?', value: 70, unit: '%',
          why: 'Sixty to eighty-five percent are invisible at first because periosteal callus takes 2 to 4 weeks to appear. When the diagnosis has to be made now, MRI without contrast is the test, with the highest sensitivity, grading from marrow edema to cortical fracture and no radiation.' },
        { type: 'bucket', q: 'Sort each stress fracture site by its risk of nonunion.', bins: ['High risk', 'Low risk'],
          items: [
            { label: 'Femoral neck', bin: 'High risk' },
            { label: 'Posteromedial tibia', bin: 'Low risk' },
            { label: 'Tarsal navicular', bin: 'High risk' },
            { label: 'Second metatarsal shaft', bin: 'Low risk' },
            { label: 'Anterior tibial cortex', bin: 'High risk' },
            { label: 'Fibula', bin: 'Low risk' },
            { label: 'Great toe sesamoid', bin: 'High risk' },
            { label: 'Calcaneus', bin: 'Low risk' }
          ],
          why: 'Sites under tension or with poor blood supply, including the femoral neck, patella, anterior tibial cortex, medial malleolus, talus, navicular, proximal fifth metatarsal and sesamoids, progress to complete fracture or nonunion and need immediate non-weight-bearing and referral. Compression-side sites heal with activity modification and protected weight bearing.' },
        { type: 'recall', q: 'Why is a tension-side femoral neck stress fracture treated as an emergency?', a: 'It can displace and cause avascular necrosis of the head',
          why: 'The superior femoral neck is under tension with every step, so a crack there propagates to a complete displaced fracture, which tears the retinacular vessels and kills the femoral head. Immediate non-weight-bearing and orthopedic referral, often for prophylactic screw fixation, prevents that.' }
      ]
    },

    {
      id: 'ms-foottendon', subject: 'MSK & Sports Medicine', topic: 'Foot & Ankle', name: 'TENDONS & DIABETIC',
      blurb: 'Posterior tibial tendon, Achilles, plantar fasciitis and diabetic foot osteomyelitis.',
      cards: [
        { type: 'recall', q: 'Pain and swelling behind the medial malleolus with a new flatfoot and a positive too-many-toes sign. Diagnosis?', a: 'Posterior tibial tendinopathy',
          why: 'The tibialis posterior holds up the medial arch, and as it fails the arch collapses, the heel drifts into valgus and the forefoot abducts so extra toes show when the heels are viewed from behind. Middle-aged women with obesity, hypertension or diabetes and workers standing on concrete are typical.' },
        { type: 'recall', q: 'Why can a patient with posterior tibial tendon dysfunction not perform a single-leg heel raise?', a: 'The tendon inverts the heel as it lifts',
          why: 'Rising onto the toes needs the tibialis posterior to lock the hindfoot in inversion so the calf can push through a rigid lever. A failing tendon leaves the heel in valgus and the foot flexible, so the patient cannot lift or the heel fails to invert. It is the most useful functional test.' },
        { type: 'recall', q: 'First-line treatment for posterior tibial tendinopathy?', a: 'Arch supports plus eccentric strengthening therapy',
          why: 'Orthotics unload the tendon and support the arch while eccentric exercise remodels it. A lace-up brace or walking boot helps during an acute flare. Corticosteroid is never injected into this tendon because rupture completes the flatfoot deformity.' },
        { type: 'recall', q: 'Why should corticosteroid never be injected into the posterior tibial tendon?', a: 'It risks complete tendon rupture',
          why: 'Steroid weakens collagen in a tendon that is already degenerating under load, and a rupture converts a treatable tendinopathy into a rigid flatfoot that needs reconstruction. The same caution applies to the Achilles and patellar tendons.' },
        { type: 'recall', q: 'First-line treatment for Achilles tendinopathy?', a: 'Eccentric heavy-load heel drops',
          why: 'Alfredson eccentric heel drops remodel the thickened degenerated tendon and have the best evidence of any treatment. Heel lifts and relative rest help. Steroid injection and fluoroquinolones both cause rupture and are avoided.' },
        { type: 'recall', q: 'Why are fluoroquinolones avoided in a patient with Achilles tendinopathy?', a: 'They cause Achilles tendon rupture',
          why: 'Fluoroquinolones damage tenocytes and collagen, and the risk is highest in older adults, those on corticosteroids and tendons already degenerated. Rupture can occur within days of starting the drug or weeks after stopping. Pick another antibiotic class.' },
        { type: 'recall', q: 'Exam test for an acute Achilles rupture?', a: 'Thompson calf-squeeze test',
          why: 'Squeezing the calf of a prone patient normally plantar flexes the foot through the intact tendon. With a rupture the foot does not move. Patients can sometimes still plantar flex weakly through the other flexors, so active motion alone does not exclude rupture.' },
        { type: 'recall', q: 'Sharp medial heel pain worst with the first steps out of bed, tender at the anteromedial calcaneus. Diagnosis?', a: 'Plantar fasciitis',
          why: 'The fascia tightens overnight and tears microscopically with the first loaded steps, which is why the pain eases as it warms up and returns after sitting. The windlass test reproduces it by dorsiflexing the toes. Treat with fascia and calf stretching, arch supports or heel cups, night splints and NSAIDs.' },
        { type: 'recall', q: 'Why does a night splint help plantar fasciitis?', a: 'It stops the fascia tightening overnight',
          why: 'Holding the ankle in dorsiflexion through the night prevents the contracture that makes the first morning steps so painful. Combined with daytime stretching of the fascia and calf, most cases settle within months without injections.' },
        { type: 'multi', q: 'Select the features of a diabetic foot ulcer that raise suspicion for underlying osteomyelitis.',
          answers: ['Present more than 2 weeks', 'Overlies a bony prominence', 'Deeper than 3 mm', 'Visible bone'],
          distractors: ['Surrounding callus', 'Clear drainage', 'Located on the dorsum'],
          why: 'Chronicity, depth, size over 2 square centimeters and a position over bone all mean the infection has had the opportunity to reach it. Any of these calls for a probe-to-bone test, ESR and CRP and plain films, then MRI if the films are equivocal.' },
        { type: 'recall', q: 'Bedside test with a positive predictive value above 85 percent for diabetic foot osteomyelitis?', a: 'Probe-to-bone test',
          why: 'A sterile blunt probe that strikes hard gritty bone at the ulcer base means the infection has reached it. In a high-risk diabetic patient that is nearly diagnostic, and a negative probe in a low-risk patient largely rules it out. It costs nothing and is done before any imaging.' },
        { type: 'number', q: 'ESR at or above which value is highly specific for diabetic foot osteomyelitis?', value: 70, unit: 'mm/hr',
          why: 'An ESR of 70 or more has about 85 percent specificity for bone infection under a diabetic foot ulcer and is tracked to follow the response to treatment. A lower ESR does not exclude it, which is why the probe and imaging are done alongside.' },
        { type: 'recall', q: 'Why can plain radiographs be normal in early diabetic foot osteomyelitis?', a: 'Cortical destruction takes 10 to 21 days to appear',
          why: 'Bone must lose 30 to 50 percent of its mineral before periosteal reaction, osteopenia or cortical erosion show on film. Films are still ordered first because they are cheap and show a positive case, but a negative or equivocal study goes to MRI, which is over 90 percent sensitive and specific.' },
        { type: 'recall', q: 'Why is a superficial wound swab not used to choose antibiotics for diabetic foot osteomyelitis?', a: 'Swabs grow colonizing skin flora, not the bone pathogen',
          why: 'The organisms on the ulcer surface rarely match what is in the bone, so swab-guided therapy misses the real pathogen. Percutaneous or intraoperative bone biopsy for culture and histology is the gold standard and directs weeks of antibiotics.' }
      ]
    },

    {
      id: 'ms-spine', subject: 'MSK & Sports Medicine', topic: 'Spine & Chronic Pain', name: 'TMJ & LOW BACK',
      blurb: 'Temporomandibular dysfunction, lumbar radiculopathy, red flags and sacroiliac pain.',
      cards: [
        { type: 'recall', q: 'Ear pain with a normal canal and eardrum, worse with chewing, and clicking over the jaw joint. Diagnosis?', a: 'Temporomandibular joint dysfunction',
          why: 'The joint sits just in front of the ear and shares sensory nerves with it, so TMJ pain is one of the most common causes of referred otalgia. Look for restricted opening under 35 to 40 mm, jaw deviation, nocturnal grinding and tender masseter and temporalis muscles. An otoscope that shows nothing is the clue.' },
        { type: 'recall', q: 'Imaging needed to diagnose temporomandibular joint dysfunction?', a: 'None',
          why: 'It is a clinical diagnosis made from the history and palpation of the joint and the muscles of mastication. Radiographs, CT and MRI are reserved for trauma, suspected tumor or failure of months of conservative care.' },
        { type: 'recall', q: 'First-line drug treatment for temporomandibular joint dysfunction?', a: 'Short course of an NSAID plus cyclobenzaprine',
          why: 'The NSAID treats joint inflammation and the muscle relaxant breaks the masticatory muscle spasm, alongside a soft diet, avoiding wide yawning and gum, compresses and jaw exercises. A low-dose tricyclic or an occlusal nightguard helps chronic bruxism. Opioids and irreversible dental occlusal adjustments are avoided.' },
        { type: 'number', q: 'Percent of acute lumbar radiculopathy cases that resolve with conservative care within 6 to 12 weeks?', value: 85, unit: '%',
          why: 'Eighty to ninety percent of L4-5 and L5-S1 disc herniations improve on their own as the herniated fragment shrinks. That is why imaging and referral wait 4 to 6 weeks in the absence of red flags. Staying active, heat, NSAIDs, physical therapy and spinal manipulation are the first-line measures.' },
        { type: 'recall', q: 'Why is bed rest avoided in acute sciatica?', a: 'It slows recovery compared with staying active',
          why: 'Rest deconditions the trunk muscles, stiffens the spine and reinforces fear of movement, and trials show longer disability than with ordinary activity as tolerated. Patients are told to keep moving, use superficial heat and NSAIDs, and start physical therapy.' },
        { type: 'truefalse', q: 'A short oral prednisone taper speeds recovery from acute sciatica.', a: false,
          why: 'Randomized trials show systemic corticosteroids give no meaningful improvement in pain or function for acute low back pain or radiculopathy, and they add hyperglycemia and insomnia. They are a classic board distractor. Epidural steroid injection is a separate question with modest short-term benefit.' },
        { type: 'multi', q: 'Select the red flags that justify an early lumbar MRI in acute back pain.',
          answers: ['New urinary retention', 'Progressive foot drop', 'Fever in an injection drug user', 'History of cancer'],
          distractors: ['Pain radiating below the knee', 'Positive straight-leg raise', 'Pain at night in bed'],
          why: 'Urinary retention points to cauda equina, progressive weakness to a compressive lesion, fever with drug use to an epidural abscess and cancer history to metastasis, and each needs imaging now. Radiating pain and a positive straight-leg raise only confirm an ordinary radiculopathy that gets 4 to 6 weeks of conservative care first.' },
        { type: 'recall', q: 'Symptom that signals cauda equina syndrome in a patient with sciatica?', a: 'New urinary retention',
          why: 'Compression of the sacral roots paralyzes the bladder before anything else, and retention with overflow is the most consistent early sign, often with saddle numbness and bilateral leg symptoms. It is a surgical emergency, so the patient goes for urgent MRI and decompression rather than a trial of therapy.' },
        { type: 'recall', q: 'Postpartum one-sided buttock pain when rising from a chair or climbing stairs, normal neurologic exam. Diagnosis?', a: 'Sacroiliac joint dysfunction',
          why: 'Relaxin loosens the pelvic ligaments and delivery strains the joint, so the pain is mechanical, worst with transitional movements and lying on that side, and rarely goes below the knee. The Fortin finger sign, pinpoint tenderness just inferomedial to the posterior superior iliac spine, and provocation tests such as FABER and thigh thrust confirm it.' },
        { type: 'recall', q: 'Exam sign where the patient points with one finger to the spot just below and inside the posterior superior iliac spine?', a: 'Fortin finger sign',
          why: 'Sacroiliac pain is remarkably well localized, and a patient who puts a single finger on the joint line inferomedial to the PSIS is pointing at the diagnosis. Combine it with FABER, thigh thrust, compression, distraction and Gaenslen tests. Treat with a pelvic stabilization belt, physical therapy or manipulation and NSAIDs.' },
        { type: 'recall', q: 'Why does sacroiliac pain rarely radiate below the knee while an L5 radiculopathy does?', a: 'It is referred joint pain, not nerve root compression',
          why: 'The sacroiliac joint refers to the buttock and posterior thigh through its own sensory supply and does not involve a nerve root, so there is no dermatomal pattern, no weakness and no reflex loss. A positive straight-leg raise or pain into the foot points back to the disc.' }
      ]
    },

    {
      id: 'ms-painsyn', subject: 'MSK & Sports Medicine', topic: 'Spine & Chronic Pain', name: 'FIBROMYALGIA & CRPS',
      blurb: 'Central sensitization, what works and what does not, and complex regional pain syndrome.',
      cards: [
        { type: 'recall', q: 'Why does fibromyalgia hurt everywhere when the muscles and joints are normal?', a: 'The central nervous system amplifies pain signals',
          why: 'Central sensitization means ordinary input is processed as pain, with reduced descending serotonergic and noradrenergic inhibition. That is why exam, ESR, CRP, CK and TSH are all normal and why drugs that act on central pain pathways work while anti-inflammatories do not.' },
        { type: 'multi', q: 'Select the features of the fibromyalgia clinical triad.',
          answers: ['Widespread pain over 3 months', 'Fatigue and nonrestorative sleep', 'Cognitive fog'],
          distractors: ['Objective joint swelling', 'Elevated inflammatory markers', 'Proximal muscle weakness'],
          why: 'Chronic pain above and below the waist on both sides, profound fatigue with unrefreshing sleep and difficulty concentrating make the diagnosis, often alongside irritable bowel, migraine, TMJ dysfunction and depression. Swelling, raised markers or weakness mean a different disease.' },
        { type: 'truefalse', q: 'ANA and rheumatoid factor should be ordered routinely in suspected fibromyalgia.', a: false,
          why: 'Low-titer ANA is common in healthy people and a positive result sends the patient down a lupus workup for a disease they do not have. Order ESR, CRP, CK, TSH and a blood count, which are normal in fibromyalgia, and reserve autoantibodies for true synovitis on exam.' },
        { type: 'recall', q: 'Treatment with the strongest evidence in fibromyalgia?', a: 'Graded aerobic and strength exercise',
          why: 'Exercise improves pain, function and sleep more reliably than any drug and is the foundation every other treatment is added to. Cognitive behavioral therapy and sleep hygiene are the other nonpharmacologic pillars. Starting low and building gradually keeps patients from flaring and quitting.' },
        { type: 'multi', q: 'Select the first-line medications for fibromyalgia.',
          answers: ['Duloxetine', 'Pregabalin', 'Amitriptyline', 'Cyclobenzaprine'],
          distractors: ['Naproxen', 'Tramadol', 'Prednisone'],
          why: 'SNRIs such as duloxetine and milnacipran, the anticonvulsant pregabalin and low-dose amitriptyline or cyclobenzaprine at bedtime all act on central pain processing. NSAIDs, acetaminophen, corticosteroids and opioids including tramadol have no proven benefit and are avoided.' },
        { type: 'recall', q: 'Why do NSAIDs and opioids fail in fibromyalgia?', a: 'There is no peripheral inflammation to treat',
          why: 'The pain is generated centrally, so blocking prostaglandins in normal tissue does nothing, and opioids can worsen central sensitization and add dependence. Drugs that raise serotonin and norepinephrine or calm hyperexcitable neurons address the actual mechanism.' },
        { type: 'recall', q: 'Fibromyalgia drug to favor when sleep disturbance is the dominant complaint?', a: 'Amitriptyline or cyclobenzaprine at bedtime',
          why: 'Both are sedating at low doses and improve sleep quality, which in turn eases pain and fatigue. Duloxetine is better when depression coexists, and pregabalin when pain and anxiety dominate. Matching the drug to the leading symptom is the usual exam question.' },
        { type: 'recall', q: 'Burning pain out of proportion to a healed wrist fracture, skin cold, mottled and painful to light touch. Diagnosis?', a: 'Complex regional pain syndrome',
          why: 'CRPS develops 4 to 6 weeks after a distal radius fracture, ankle injury or limb surgery through autonomic and neuroinflammatory dysregulation. Allodynia, temperature or color asymmetry, swelling or sweating changes and trophic skin and nail changes make up the Budapest criteria. Pain that crosses nerve territories separates it from a nerve injury.' },
        { type: 'multi', q: 'Select the Budapest criteria categories for complex regional pain syndrome.',
          answers: ['Sensory: allodynia', 'Vasomotor: temperature asymmetry', 'Sudomotor: swelling or sweating', 'Motor or trophic changes'],
          distractors: ['Dermatomal numbness', 'Positive Tinel sign', 'Elevated CRP'],
          why: 'The diagnosis needs continuing disproportionate pain plus symptoms and signs across these four categories. Dermatomal findings and a Tinel sign belong to a single nerve lesion, and inflammatory markers are normal. Radiographs late on show patchy periarticular osteopenia.' },
        { type: 'number', q: 'Skin temperature difference between limbs that counts as vasomotor asymmetry in complex regional pain syndrome?', value: 1, unit: '°C',
          why: 'A difference of more than one degree, measured side to side, is the vasomotor criterion, alongside red, mottled or cyanotic color change. Patients often describe the limb as cold and discolored, and the asymmetry can swing warm early and cold later.' },
        { type: 'recall', q: 'Supplement that reduces the risk of complex regional pain syndrome after a distal radius fracture?', a: 'Vitamin C 500 mg daily for 50 days',
          why: 'Vitamin C is an antioxidant that appears to blunt the neuroinflammatory response after injury, and trials show fewer cases of CRPS when it is started at the time of the fracture. It is cheap and safe, so it is given routinely.' },
        { type: 'recall', q: 'First-line treatment for complex regional pain syndrome?', a: 'Early multimodal physical and occupational therapy',
          why: 'Tactile desensitization, graded motor imagery and mirror box therapy retrain the brain\'s map of the limb and restore movement, which immobilization makes worse. Gabapentin or pregabalin, duloxetine, tricyclics, bisphosphonates or an early short steroid burst support the therapy, and sympathetic blocks are for refractory pain.' },
        { type: 'recall', q: 'Why is immobilization harmful in complex regional pain syndrome?', a: 'Disuse deepens the sensitization and trophic changes',
          why: 'Splinting a painful limb seems kind but it feeds the cortical reorganization behind the condition and lets the skin, bone and joints atrophy. Movement is the treatment, so the limb is unloaded only as much as the therapy requires.' }
      ]
    },

    {
      id: 'ms-sports', subject: 'MSK & Sports Medicine', topic: 'Sports Medicine', name: 'PPE & SIDELINE',
      blurb: 'Preparticipation disqualifications, mononucleosis, solitary organs, Down syndrome, sickle trait and the cervical spine on the field.',
      cards: [
        { type: 'recall', q: 'Why is an athlete with infectious mononucleosis kept out of all sport, not just contact sport?', a: 'The swollen spleen can rupture with exertion alone',
          why: 'EBV infiltrates the spleen and stretches its capsule, and rupture is the leading cause of fatal abdominal hemorrhage in athletes. It can happen with a Valsalva during lifting or a minor bump, not only a tackle, so vigorous exercise of any kind is withheld.' },
        { type: 'number', q: 'Minimum weeks from symptom onset before an athlete with mononucleosis may return to sport?', value: 3, unit: 'weeks',
          why: 'Three to four weeks covers the period when the spleen is largest and most fragile. Return also requires being afebrile, asymptomatic, well hydrated and free of palpable splenomegaly. Ultrasound is not needed when the exam is normal at that point.' },
        { type: 'truefalse', q: 'A spleen ultrasound is required before an athlete with resolved mononucleosis returns to play.', a: false,
          why: 'Normal spleen size varies so widely that ultrasound cannot reliably say whether an individual\'s spleen has returned to its baseline. The decision rests on time since onset, resolution of symptoms and a nonpalpable spleen on exam.' },
        { type: 'number', q: 'Months of rest required after myocarditis before an athlete can be considered for return?', value: 3, unit: 'months',
          why: 'Myocarditis causes exertional arrhythmias and sudden death, so athletes rest for three to six months and return only after a normal echocardiogram, Holter and exercise ECG. Any acute febrile illness also disqualifies until it has fully resolved.' },
        { type: 'number', q: 'Best-corrected vision in the poorer eye below which an athlete is functionally one-eyed?', values: [20, 40], join: '/', unit: 'Snellen',
          why: 'Losing the better eye would leave the athlete legally impaired, so polycarbonate goggles are mandatory and sports with no eye protection such as boxing are discouraged. The same counseling-plus-protection rule applies to a solitary testicle, which needs a protective cup.' },
        { type: 'multi', q: 'Select the solitary-kidney findings that exclude an athlete from contact and collision sport.',
          answers: ['Hydronephrosis', 'Multicystic dysplasia', 'Pelvic ectopia'],
          distractors: ['Compensatory hypertrophy', 'Prior pyelonephritis'],
          why: 'A normal solitary kidney is well protected and participation is allowed after counseling. An abnormal or ectopic kidney is more exposed to injury, and losing it means dialysis, so contact and collision sport is advised against.' },
        { type: 'recall', q: 'Why are routine cervical spine radiographs no longer recommended for asymptomatic athletes with Down syndrome?', a: 'They do not predict spinal cord injury',
          why: 'Atlantoaxial laxity on film is common and poorly correlated with neurologic events, and films change over time. Imaging and restriction from contact, diving and tumbling are now reserved for athletes with myelopathic symptoms or signs.' },
        { type: 'multi', q: 'Select the findings in an athlete with Down syndrome that call for cervical imaging and sport restriction.',
          answers: ['Neck pain', 'Torticollis', 'Gait change', 'Hand clumsiness', 'Hyperreflexia'],
          distractors: ['Short stature', 'Hypotonia since infancy'],
          why: 'These are signs of cervical myelopathy from atlantoaxial instability, and any one of them triggers radiographs or MRI and withdrawal from contact, diving and tumbling until the spine is cleared. Hypotonia and short stature are baseline features of the syndrome, not warning signs.' },
        { type: 'truefalse', q: 'Sickle cell trait is a contraindication to participation in strenuous sport.', a: false,
          why: 'Athletes with sickle cell trait compete at every level. The risk is exertional sickling collapse during all-out exertion in heat, prevented by gradual heat acclimatization, generous hydration and not running timed maximal sprints on the first days of practice.' },
        { type: 'recall', q: 'On the field, which equipment is removed from a helmeted football player with a suspected cervical spine injury?', a: 'Only the facemask, and only if airway access is needed',
          why: 'The helmet and shoulder pads are left in place together for spine boarding and transport. The facemask comes off with a cordless screwdriver or loop-strap cutter if the player is unresponsive or needs ventilation. Helmet and pads are removed as a pair at the hospital.' },
        { type: 'recall', q: 'Why must the helmet and shoulder pads be removed together rather than one at a time?', a: 'Removing one alone bends the neck out of neutral',
          why: 'The two are built as a coupled unit that holds the cervical spine in neutral when the player lies supine. Taking off only the helmet drops the occiput into hyperextension, and taking off only the pads forces hyperflexion. Either movement can convert an unstable fracture into a cord injury.' },
        { type: 'bucket', q: 'Sort each preparticipation finding by whether the athlete may play.', bins: ['Clear to play', 'Hold out'],
          items: [
            { label: 'Sickle cell trait', bin: 'Clear to play' },
            { label: 'Palpable spleen after mono', bin: 'Hold out' },
            { label: 'Single testicle with a cup', bin: 'Clear to play' },
            { label: 'Fever today', bin: 'Hold out' },
            { label: 'Myocarditis 6 weeks ago', bin: 'Hold out' },
            { label: 'Asymptomatic Down syndrome', bin: 'Clear to play' }
          ],
          why: 'Temporary disqualifiers are an active febrile illness, splenomegaly and myocarditis within its rest period. Sickle trait, a solitary organ with protection and counseling, and Down syndrome without myelopathic signs are all cleared. The exam tests whether you know which common findings are not barriers.' }
      ]
    },

    {
      id: 'ms-gout', subject: 'MSK & Sports Medicine', topic: 'Rheumatology', name: 'GOUT & CPPD',
      blurb: 'Acute gout diagnosis and treatment, urate-lowering therapy rules, and pseudogout.',
      cards: [
        { type: 'recall', q: 'Gold-standard test for an acute gout flare?', a: 'Needle-shaped negatively birefringent crystals in joint fluid'.slice(0,0)+'Negatively birefringent needles in joint fluid',
          why: 'Arthrocentesis under polarized light shows intracellular monosodium urate crystals, yellow when parallel to the compensator, with a white count of 10,000 to 60,000 and a negative Gram stain. It is essential whenever septic arthritis cannot be excluded, since the two look identical at the bedside.' },
        { type: 'recall', q: 'Lab that supports a clinical diagnosis of gout in classic podagra when the joint is not tapped?', a: 'Serum uric acid above 6.8 mg/dL',
          why: 'Above 6.8 urate exceeds its solubility and crystals can form. ESR, CRP and white count rise with any inflammation and prove nothing. Remember that urate can read normal during a flare because interleukin-6 drives renal excretion, so a normal level does not exclude gout.' },
        { type: 'recall', q: 'Why can serum uric acid be normal during an acute gout flare?', a: 'Interleukin-6 increases urate excretion by the kidney',
          why: 'The cytokine surge of the flare is uricosuric, so a level drawn that day can fall into the normal range in a patient whose baseline is high. Recheck two weeks after the flare settles before deciding the patient does not have hyperuricemia.' },
        { type: 'multi', q: 'Select the common triggers of a gout flare.',
          answers: ['Beer and spirits', 'Thiazide diuretics', 'Fructose-sweetened drinks', 'Organ meats and shellfish', 'Surgery or trauma'],
          distractors: ['Dairy products', 'Coffee'],
          why: 'Alcohol, purine-rich food and fructose raise urate production, diuretics, low-dose aspirin, kidney disease and dehydration reduce its excretion, and the stress of surgery or trauma mobilizes crystals. Low-fat dairy and coffee are if anything protective.' },
        { type: 'number', q: 'First dose of colchicine for an acute gout flare?', value: 1.2, unit: 'mg',
          why: 'The first dose is followed by 0.6 mg one hour later, then 0.6 mg once or twice daily until the flare settles. It works best within 36 hours of onset and is avoided in severe kidney or liver failure and with strong CYP3A4 or P-glycoprotein inhibitors such as clarithromycin.' },
        { type: 'number', q: 'Total colchicine dose on the first day of a gout flare with the low-dose regimen?', value: 1.8, unit: 'mg',
          why: 'A total of 1.8 mg on day one is as effective as the old high-dose regimen with far less diarrhea, followed by 0.6 mg once or twice daily until the flare settles. It works best within 36 hours of onset and is avoided in severe kidney or liver failure and with strong CYP3A4 or P-glycoprotein inhibitors such as clarithromycin.' },
        { type: 'recall', q: 'Preferred treatment for an acute gout flare in a patient with stage 4 chronic kidney disease?', a: 'Corticosteroids',
          why: 'NSAIDs worsen kidney function and colchicine accumulates to toxic levels when clearance is low. Oral prednisone 30 to 40 mg for 5 to 7 days, or an intra-articular injection for a single large joint, is safe and equally effective. Heart failure, ulcers and anticoagulation also push toward steroids.' },
        { type: 'multi', q: 'Select the indications for long-term urate-lowering therapy.',
          answers: ['2 or more flares a year', 'A subcutaneous tophus', 'Radiographic joint damage', 'One flare with CKD stage 3+'],
          distractors: ['One flare, normal kidneys', 'Asymptomatic hyperuricemia'],
          why: 'Recurrent flares, tophi, erosions on film, or even one flare in a patient with kidney disease, urate over 9 or kidney stones justify lifelong therapy. One uncomplicated flare and asymptomatic hyperuricemia are managed with diet and trigger review alone.' },
        { type: 'recall', q: 'First-line urate-lowering drug in a gout patient with stage 3 chronic kidney disease?', a: 'Allopurinol',
          why: 'Allopurinol remains first line at every level of kidney function. The adjustment is the starting dose, 100 mg or less a day and 50 mg in stage 4, titrated every 2 to 5 weeks. Febuxostat is reserved for intolerance because of its cardiovascular signal.' },
        { type: 'number', q: 'Target serum uric acid on urate-lowering therapy for a patient without tophi?', value: 6, unit: 'mg/dL',
          why: 'Below 6 mg/dL crystals dissolve faster than they form and flares stop over months. With tophi the target drops below 5 to shrink the deposits. Dose is titrated to the level, not left at the starting dose.' },
        { type: 'recall', q: 'Gene to test before starting allopurinol in a patient of Han Chinese, Korean or Thai descent?', a: 'HLA-B*5801',
          why: 'Carriers have a high risk of allopurinol hypersensitivity syndrome and Stevens-Johnson syndrome, which is often fatal. The allele is common enough in Southeast Asian and Black patients that screening is recommended before the first dose, and carriers get febuxostat instead.' },
        { type: 'recall', q: 'Why does starting allopurinol trigger gout flares?', a: 'Falling urate mobilizes crystals from tissue deposits',
          why: 'As the serum level drops, crystals dissolve off the surface of deposits and shed into the joint, where they ignite inflammation. That is why daily low-dose colchicine, or an NSAID or low-dose prednisone, is co-prescribed for the first 3 to 6 months of therapy.' },
        { type: 'number', q: 'Months of flare prophylaxis co-prescribed when starting urate-lowering therapy?', value: 3, unit: 'months',
          why: 'Three to six months covers the period of crystal mobilization while the serum urate settles at target. Stopping prophylaxis early is a common reason patients abandon allopurinol after a run of flares they were not warned about.' },
        { type: 'truefalse', q: 'Established allopurinol should be stopped during an acute gout flare.', a: false,
          why: 'Stopping it drops and then raises urate again, which destabilizes crystals and prolongs the episode. Continue the usual dose and treat the flare on top. Allopurinol can even be started during a flare as long as acute anti-inflammatory treatment is given.' },
        { type: 'recall', q: 'Acute knee arthritis in an older adult with rhomboid, weakly positively birefringent crystals. Diagnosis?', a: 'Calcium pyrophosphate deposition, pseudogout',
          why: 'CPPD crystals are the mirror image of urate: rhomboid rather than needle-shaped and weakly positive rather than strongly negative. The knee and wrist are the usual joints and radiographs show chondrocalcinosis in the menisci or triangular fibrocartilage.' },
        { type: 'multi', q: 'Select the metabolic conditions associated with calcium pyrophosphate deposition.',
          answers: ['Hyperparathyroidism', 'Hemochromatosis', 'Hypophosphatasia', 'Hypomagnesemia'],
          distractors: ['Hyperthyroidism', 'Hyperkalemia', 'Hyperuricemia'],
          why: 'The four H\'s. Each alters calcium, pyrophosphate or the enzymes that clear it from cartilage. Pseudogout under 55, or in several joints, should prompt calcium, PTH, ferritin, phosphatase and magnesium levels. Hyperuricemia belongs to gout.' },
        { type: 'bucket', q: 'Sort each finding by the crystal arthritis it belongs to.', bins: ['Gout', 'Pseudogout'],
          items: [
            { label: 'Needle-shaped crystals', bin: 'Gout' },
            { label: 'Rhomboid crystals', bin: 'Pseudogout' },
            { label: 'Strongly negative birefringence', bin: 'Gout' },
            { label: 'Chondrocalcinosis on x-ray', bin: 'Pseudogout' },
            { label: 'First MTP joint', bin: 'Gout' },
            { label: 'Hemochromatosis association', bin: 'Pseudogout' }
          ],
          why: 'Urate crystals are needles with strong negative birefringence and favor the big toe. Pyrophosphate crystals are rhomboids with weak positive birefringence, calcify cartilage visibly on film and favor the knee and wrist of older adults with the four H conditions.' }
      ]
    },

    {
      id: 'ms-rheum', subject: 'MSK & Sports Medicine', topic: 'Rheumatology', name: 'LUPUS, PMR & MYOSITIS',
      blurb: 'Systemic lupus serology and hydroxychloroquine, polymyalgia rheumatica, and dermatomyositis.',
      cards: [
        { type: 'recall', q: 'Screening test for systemic lupus erythematosus?', a: 'Antinuclear antibody',
          why: 'An ANA of 1:80 or more is over 98 percent sensitive, so a negative result effectively rules lupus out. It is not specific, which is why a positive ANA is followed by anti-dsDNA and anti-Smith rather than treated as the diagnosis.' },
        { type: 'match', q: 'Match each lupus-related antibody to what it tells you.',
          pairs: [
            { left: 'ANA', right: 'Sensitive screen' },
            { left: 'Anti-dsDNA', right: 'Tracks nephritis' },
            { left: 'Anti-Smith', right: 'Most specific' },
            { left: 'Anti-histone', right: 'Drug-induced lupus' }
          ] },
        { type: 'recall', q: 'Why are anti-dsDNA titers and complement levels followed in a lupus patient?', a: 'They rise and fall with disease activity',
          why: 'Anti-dsDNA climbs and C3 and C4 drop as immune complexes form during a flare, especially lupus nephritis. A rising titer with falling complement prompts a urinalysis for proteinuria and red cell casts before the kidney is damaged.' },
        { type: 'multi', q: 'Select the drugs that cause drug-induced lupus.',
          answers: ['Hydralazine', 'Procainamide', 'Isoniazid', 'Minocycline', 'TNF inhibitors'],
          distractors: ['Metformin', 'Amlodipine'],
          why: 'These produce anti-histone antibodies with arthralgia, serositis and fever, usually sparing the kidneys and brain, and resolve when the drug is stopped. Anti-dsDNA is typically negative, which separates it from idiopathic lupus.' },
        { type: 'recall', q: 'Drug that every patient with systemic lupus should take?', a: 'Hydroxychloroquine',
          why: 'It reduces flares, organ damage, thrombosis and mortality in every lupus patient regardless of severity. Steroids, mycophenolate, cyclophosphamide, belimumab and voclosporin are added for nephritis or organ-threatening disease on top of it.' },
        { type: 'recall', q: 'Why does long-term hydroxychloroquine require annual eye examinations?', a: 'It can cause irreversible bull\'s-eye retinopathy',
          why: 'The drug accumulates in the retinal pigment epithelium, and damage is permanent once vision changes. A baseline exam then annual automated visual fields and spectral-domain OCT begin after five years of use, earlier with kidney disease or high doses.' },
        { type: 'recall', q: 'Adult over 50 with weeks of shoulder and hip girdle aching, an hour of morning stiffness, normal strength. Diagnosis?', a: 'Polymyalgia rheumatica',
          why: 'Pain limits active motion, so patients struggle to comb their hair or rise from a chair, but when pain is set aside the muscles test at full strength. ESR and CRP are markedly raised. It occurs only after 50 and responds to low-dose prednisone within days.' },
        { type: 'recall', q: 'Why is creatine kinase measured in suspected polymyalgia rheumatica?', a: 'A normal CK rules out myositis and statin myopathy',
          why: 'Polymyalgia inflames the bursae and synovium around the shoulders and hips, not the muscle, so CK and aldolase are completely normal. An elevated CK means the weakness is real muscle disease and redirects the workup toward polymyositis or a drug effect.' },
        { type: 'recall', q: 'Treatment for polymyalgia rheumatica?', a: 'Prednisone 12.5 to 20 mg daily',
          why: 'A low dose produces a dramatic response within 24 to 72 hours, so dramatic that failure to respond should make you question the diagnosis. The taper runs slowly over one to two years, and relapses on the way down are common.' },
        { type: 'multi', q: 'Select the symptoms to ask every polymyalgia rheumatica patient about at every visit.',
          answers: ['New headache', 'Jaw claudication', 'Scalp tenderness', 'Visual change'],
          distractors: ['Knee swelling', 'Heartburn', 'Numb fingers'],
          why: 'Fifteen to twenty percent develop giant cell arteritis, which can blind within days. Any of these symptoms means high-dose steroids immediately and a temporal artery biopsy or ultrasound, without waiting for the result.' },
        { type: 'recall', q: 'Why does dermatomyositis cause trouble climbing stairs and lifting overhead while grip stays normal?', a: 'It is a proximal myopathy',
          why: 'Inflammation targets the shoulder and hip girdle muscles first, so the tasks that need them fail while distal strength is preserved early on. Dysphagia from pharyngeal muscle involvement is common. CK is often 10 to 50 times normal.' },
        { type: 'multi', q: 'Select the skin findings specific to dermatomyositis.',
          answers: ['Heliotrope rash', 'Gottron papules', 'Shawl sign', 'Mechanic\'s hands'],
          distractors: ['Malar rash', 'Discoid plaques', 'Livedo reticularis'],
          why: 'Violaceous periorbital edema, scaly papules over the knuckles, erythema over the upper back and chest, and cracked fingertips are the pathognomonic signs. The malar rash and discoid plaques belong to lupus. Polymyositis has the same weakness without any rash.' },
        { type: 'recall', q: 'Antibody in myositis that predicts interstitial lung disease?', a: 'Anti-Jo-1',
          why: 'Anti-Jo-1 marks the antisynthetase syndrome, with interstitial lung disease, mechanic\'s hands, arthritis and Raynaud phenomenon. A positive result means pulmonary function tests and high-resolution CT at diagnosis. Anti-Mi-2 is the other dermatomyositis antibody and carries a better prognosis.' },
        { type: 'recall', q: 'Why does a new diagnosis of dermatomyositis in an adult trigger a full cancer screen?', a: 'Up to 30 percent have an occult malignancy',
          why: 'Dermatomyositis is often a paraneoplastic process, most commonly from ovarian, lung, pancreatic, gastric, colorectal or breast cancer or lymphoma. Age-appropriate screening is extended to CT of the chest, abdomen and pelvis, mammography, pelvic ultrasound with CA-125 and colonoscopy at diagnosis.' },
        { type: 'recall', q: 'First-line treatment for dermatomyositis?', a: 'High-dose steroids plus methotrexate or azathioprine',
          why: 'Steroids control the inflammation quickly, and a steroid-sparing agent is started at the same time because the course is long and steroid myopathy would confuse the picture. Strength and CK are followed to judge response.' },
        { type: 'bucket', q: 'Sort each finding by the condition it points to.', bins: ['PMR', 'Myositis'],
          items: [
            { label: 'Normal creatine kinase', bin: 'PMR' },
            { label: 'CK 20 times normal', bin: 'Myositis' },
            { label: 'Normal strength, painful motion', bin: 'PMR' },
            { label: 'True proximal weakness', bin: 'Myositis' },
            { label: 'Cured by 15 mg prednisone', bin: 'PMR' },
            { label: 'Heliotrope rash', bin: 'Myositis' }
          ],
          why: 'Polymyalgia is pain and stiffness with intact muscle and a normal CK, cured within days by low-dose steroid. Myositis is genuine weakness with muscle enzyme release, needs high-dose steroids plus an immunosuppressant, and in dermatomyositis carries a rash and a cancer search.' }
      ]
    },

    {
      id: 'mx-shoulder', subject: 'MSK & Sports Medicine', topic: 'Exam & Diagnosis', name: 'SHOULDER EXAM',
      blurb: 'The shoulder tests the ITE uses and what a positive one tells you.',
      cards: [
        { type: 'recall', q: 'Arm abducted to 90 degrees, thumbs pointing down, examiner pushes down and it hurts or gives way. Test and muscle?', a: 'Empty can test, supraspinatus',
          why: 'Internal rotation with the thumb down isolates the supraspinatus and lifts it under the acromion. Pain means tendinopathy or impingement; frank weakness or giving way suggests a tear. It is the single most used cuff test on the exam.' },
        { type: 'recall', q: 'Pain only between 60 and 120 degrees of active abduction, free above and below. Finding and meaning?', a: 'Painful arc, subacromial impingement',
          why: 'The supraspinatus tendon passes under the acromion through the middle of the arc and is pinched there. Pain at the very top of abduction points to the acromioclavicular joint instead, and pain through the whole arc points to adhesive capsulitis or arthritis.' },
        { type: 'recall', q: 'Patient cannot slowly lower the abducted arm and it falls to the side. Test and meaning?', a: 'Drop-arm test, full-thickness supraspinatus tear',
          why: 'Tendinopathy hurts but the tendon still holds. A complete tear removes the brake on the lowering arm. The drop-arm test is how you tell a tear from impingement at the bedside, and a positive result in a young patient is an indication for MRI and early repair.' },
        { type: 'recall', q: 'Hand placed behind the back, patient cannot lift it away from the spine. Test and muscle?', a: 'Lift-off test, subscapularis',
          why: 'Pushing the hand backward off the lumbar spine is pure internal rotation, which only the subscapularis provides in that position. The belly-press test, pushing the palm into the abdomen with the elbow forward, tests the same muscle for patients who cannot reach behind.' },
        { type: 'recall', q: 'Elbows at the side bent to 90 degrees, patient cannot push the hands outward against resistance. Muscles tested?', a: 'Infraspinatus and teres minor',
          why: 'Resisted external rotation with the arm at the side isolates the posterior cuff. Weakness with pain is a tear; pain alone is tendinopathy. Combined with the empty can and lift-off tests this covers the whole cuff in under a minute.' },
        { type: 'recall', q: 'Arm abducted and externally rotated, patient looks alarmed and resists further rotation. Test and meaning?', a: 'Apprehension test, anterior instability',
          why: 'The position reproduces the moment of an anterior dislocation and the patient senses the head about to slip. Pressing the humeral head backward relieves the fear, the relocation test, which confirms instability rather than cuff pain. A history of dislocation plus these two tests makes the diagnosis.' },
        { type: 'recall', q: 'Arm forward flexed to 90 degrees and adducted, thumb down hurts and thumb up does not. Test and meaning?', a: "O'Brien test, superior labral tear",
          why: 'With the thumb down the biceps anchor is loaded and a SLAP tear catches; turning the palm up unloads it. Deep pain or a click with the thumb down that eases with the palm up is positive. Pain on top of the shoulder in both positions points to the acromioclavicular joint instead.' },
        { type: 'recall', q: 'Arm passively forced into full forward flexion while the scapula is held down. Test and meaning?', a: 'Neer impingement sign',
          why: 'Forcing the greater tuberosity under the acromion pinches the supraspinatus and bursa. Hawkins does the same by internally rotating the forward-flexed arm. Both are sensitive for impingement but not specific, so they are paired with the empty can and drop-arm tests.' },
        { type: 'recall', q: 'Shoulder pain with every motion and the examiner also cannot move it past 50 percent of external rotation. Diagnosis?', a: 'Adhesive capsulitis',
          why: 'Lost passive motion is the finding no cuff problem produces. A torn or inflamed cuff limits what the patient can do but not what you can do for them. Films are normal and the treatment is steroid injection plus therapy, never a sling.' },
        { type: 'match', q: 'Match each shoulder test to what a positive result means.',
          pairs: [
            { left: 'Empty can', right: 'Supraspinatus' },
            { left: 'Drop arm', right: 'Full cuff tear' },
            { left: 'Apprehension', right: 'Anterior instability' },
            { left: "O'Brien", right: 'Labral tear' }
          ] },
        { type: 'bucket', q: 'Sort each shoulder finding by the diagnosis it points to.', bins: ['Cuff disease', 'Frozen shoulder'],
          items: [
            { label: 'Passive motion preserved', bin: 'Cuff disease' },
            { label: 'Passive motion lost', bin: 'Frozen shoulder' },
            { label: 'Night pain lying on the side', bin: 'Cuff disease' },
            { label: 'Diabetic, 50s, insidious onset', bin: 'Frozen shoulder' },
            { label: 'Positive empty can', bin: 'Cuff disease' },
            { label: 'Normal films, stiff all round', bin: 'Frozen shoulder' }
          ],
          why: 'The one question to ask of any stiff painful shoulder is whether passive motion is normal. If you can move it and they cannot, think cuff. If neither of you can move it and the films are clean, it is adhesive capsulitis.' },
        { type: 'recall', q: 'Pain at the top of the shoulder when the arm is brought across the chest. Test and diagnosis?', a: 'Cross-body adduction test, acromioclavicular joint',
          why: 'Adduction compresses the AC joint, and the pain sits on top of the shoulder where the patient can point to it, unlike cuff pain over the lateral deltoid. Tenderness directly over the joint and pain at the very top of abduction confirm it.' }
      ]
    },

    {
      id: 'mx-elbowhand', subject: 'MSK & Sports Medicine', topic: 'Exam & Diagnosis', name: 'ELBOW, WRIST & HAND',
      blurb: 'Epicondylitis, nerve entrapments, de Quervain, scaphoid, skier\'s thumb and finger tendons.',
      cards: [
        { type: 'recall', q: 'Lateral elbow pain reproduced by resisted wrist extension with the elbow straight. Diagnosis?', a: 'Lateral epicondylitis',
          why: 'The wrist extensors originate on the lateral epicondyle and resisted extension of the wrist or middle finger loads the degenerated tendon origin. Tenderness just distal to the epicondyle confirms it. Gripping and lifting with the palm down bring it on, hence tennis elbow.' },
        { type: 'recall', q: 'Medial elbow pain reproduced by resisted wrist flexion and forearm pronation. Diagnosis?', a: 'Medial epicondylitis',
          why: 'The flexor-pronator mass originates on the medial epicondyle, so the resisted motions that load it reproduce the pain. Golfers and throwers are typical. Numbness in the ring and little fingers alongside it means the ulnar nerve is irritated too.' },
        { type: 'recall', q: 'Numbness of the ring and little fingers brought on by holding the elbow fully flexed for a minute. Diagnosis?', a: 'Cubital tunnel syndrome',
          why: 'Flexion stretches and compresses the ulnar nerve behind the medial epicondyle. The elbow flexion test and a Tinel sign at the cubital tunnel reproduce the symptoms. Weak finger abduction and wasting of the first dorsal interosseous appear late.' },
        { type: 'recall', q: 'Toddler holds the arm pronated and slightly flexed, will not use it, after being pulled by the hand. Diagnosis?', a: 'Radial head subluxation, nursemaid\'s elbow',
          why: 'Traction slips the annular ligament over the radial head. There is no swelling and radiographs are unnecessary when the history is classic. Reduce by hyperpronation or supination with flexion while pressing the radial head; the child uses the arm within minutes.' },
        { type: 'recall', q: 'Night-time numbness of the thumb, index and middle fingers, relieved by shaking the hand. Diagnosis?', a: 'Carpal tunnel syndrome',
          why: 'The median nerve is compressed under the transverse carpal ligament, and wrist flexion during sleep worsens it. Sparing of the little finger is the key to separating it from cubital tunnel. Thenar atrophy means a severe, long-standing lesion.' },
        { type: 'recall', q: 'Backs of the hands pressed together with the wrists fully flexed for 60 seconds reproduces finger tingling. Test?', a: 'Phalen test',
          why: 'Sustained flexion raises pressure in the carpal tunnel and provokes median nerve symptoms. Tapping over the carpal tunnel, Tinel sign, and pressing on it with the thumbs, the Durkan compression test, are the other bedside tests. Nerve conduction studies confirm before surgery.' },
        { type: 'recall', q: 'Radial wrist pain when the thumb is tucked in a fist and the wrist bent toward the little finger. Test and diagnosis?', a: 'Finkelstein test, de Quervain tenosynovitis',
          why: 'Ulnar deviation with the thumb enclosed stretches the abductor pollicis longus and extensor pollicis brevis through the inflamed first dorsal compartment. New mothers lifting infants are the classic patients. Treat with a thumb spica and a steroid injection into the sheath.' },
        { type: 'recall', q: 'Tenderness in the anatomic snuffbox after a fall on the outstretched hand with normal films. Working diagnosis?', a: 'Occult scaphoid fracture',
          why: 'Snuffbox tenderness, tenderness over the volar scaphoid tubercle and pain with axial loading of the thumb are the three signs, and together they outweigh a normal first radiograph. Splint in a thumb spica and reimage in 10 to 14 days or get an MRI.' },
        { type: 'recall', q: 'Thumb MCP joint opens on sideways stress after a fall holding a ski pole. Diagnosis?', a: 'Ulnar collateral ligament tear, skier\'s thumb',
          why: 'Forced abduction of the thumb tears the ulnar collateral ligament of the MCP joint. Valgus stress at 30 degrees of flexion that opens more than the other side is positive. A complete tear with a Stener lesion will not heal in a cast and needs surgical repair.' },
        { type: 'recall', q: 'Finger catches or locks in flexion and then snaps straight, with a tender nodule in the palm. Diagnosis?', a: 'Trigger finger',
          why: 'A thickened flexor tendon catches at the A1 pulley at the base of the finger. Diabetics are prone to it. Steroid injection into the sheath relieves most cases and surgical release is for failures.' },
        { type: 'recall', q: 'Painless cord in the palm pulling the ring and little fingers into flexion. Diagnosis?', a: 'Dupuytren contracture',
          why: 'Fibrous thickening of the palmar fascia, common in older men of northern European descent, diabetics and drinkers. Referral is for a contracture over 30 degrees at the MCP joint or any PIP contracture; the tabletop test, inability to lay the palm flat, is the trigger.' },
        { type: 'recall', q: 'Joint that cannot actively straighten in mallet finger and cannot actively bend in jersey finger?', a: 'DIP in both',
          why: 'Mallet finger is the extensor pulled off the distal phalanx, so the tip droops and cannot extend. Jersey finger is the flexor profundus pulled off the same bone, so the tip cannot flex when the PIP is held straight. Same joint, opposite tendon, opposite management.' },
        { type: 'match', q: 'Match each wrist and hand test to the diagnosis it supports.',
          pairs: [
            { left: 'Phalen', right: 'Carpal tunnel' },
            { left: 'Finkelstein', right: 'De Quervain' },
            { left: 'Snuffbox tenderness', right: 'Scaphoid fracture' },
            { left: 'Thumb valgus stress', right: "Skier's thumb" }
          ] },
        { type: 'bucket', q: 'Sort each finding by the nerve that is compressed.', bins: ['Median', 'Ulnar'],
          items: [
            { label: 'Numb thumb and index', bin: 'Median' },
            { label: 'Numb ring and little finger', bin: 'Ulnar' },
            { label: 'Positive Phalen test', bin: 'Median' },
            { label: 'Positive elbow flexion test', bin: 'Ulnar' },
            { label: 'Thenar wasting', bin: 'Median' },
            { label: 'Weak finger spreading', bin: 'Ulnar' }
          ],
          why: 'Which fingers are numb decides the nerve. The median nerve supplies the radial three and a half digits and the thenar muscles; the ulnar nerve supplies the ulnar one and a half digits and the interossei that spread the fingers. The site of compression follows: wrist for median, elbow for ulnar.' }
      ]
    },

    {
      id: 'mx-hip', subject: 'MSK & Sports Medicine', topic: 'Exam & Diagnosis', name: 'HIP EXAM',
      blurb: 'Reading hip pain by location and the tests that confirm each source.',
      cards: [
        { type: 'recall', q: 'Hip flexed to 90 degrees, then adducted and internally rotated, reproduces groin pain. Test and meaning?', a: 'FADIR test, intra-articular hip pathology',
          why: 'Flexion, adduction and internal rotation drive the femoral neck against the acetabular rim, so it is positive in femoroacetabular impingement and labral tears. Groin pain with this maneuver means the problem is inside the joint and warrants imaging.' },
        { type: 'recall', q: 'Heel on the opposite knee, bent knee pressed toward the table. Test, and the two sources a positive can mean?', a: 'FABER test, hip joint or sacroiliac joint',
          why: 'Flexion, abduction and external rotation stress both structures. Pain in the groin is the hip; pain in the back or buttock is the sacroiliac joint. Where the patient feels it is the whole point of the test.' },
        { type: 'recall', q: 'Examiner rolls the straight leg in and out on the table and it hurts in the groin. Test and meaning?', a: 'Log-roll test, intra-articular hip pathology',
          why: 'Rolling the leg moves only the femoral head within the acetabulum, with no load on the muscles, tendons or spine. Pain is therefore very specific to the joint itself. It is the gentlest first test in a patient who might have a fracture.' },
        { type: 'recall', q: 'Standing on one leg, the opposite side of the pelvis drops. Sign and meaning?', a: 'Trendelenburg sign, weak gluteus medius',
          why: 'The gluteus medius on the stance side holds the pelvis level. When it is weak or its tendon torn, the other side sags. With lateral hip pain and trochanteric tenderness this points to gluteus medius tendinopathy or tear, the real cause of what used to be called trochanteric bursitis.' },
        { type: 'recall', q: 'Side-lying patient, top leg extended and abducted then released, and it stays up instead of dropping. Test and meaning?', a: 'Ober test, tight iliotibial band',
          why: 'A tight band holds the leg suspended in abduction. It supports iliotibial band syndrome at the knee and external snapping hip. Treatment is band stretching and hip abductor strengthening.' },
        { type: 'recall', q: 'Short, externally rotated leg after a fall with groin pain and inability to bear weight. Diagnosis?', a: 'Hip fracture',
          why: 'Muscle pull on the broken femur shortens it and rolls it outward. Films catch over 90 percent; a negative film with this picture gets an MRI, because up to a tenth of osteoporotic hip fractures are occult and a missed one displaces.' },
        { type: 'recall', q: 'Runner with groin pain that began after long runs and now hurts walking and hopping on that leg. Diagnosis to exclude?', a: 'Femoral neck stress fracture',
          why: 'Progressive activity-related groin pain in a runner, especially a woman with low energy availability, is a femoral neck stress fracture until MRI says otherwise. Films are usually normal early. A tension-side fracture can displace, so stop running and image now.' },
        { type: 'recall', q: 'Limping 6-year-old with groin pain, limited hip internal rotation, no fever, normal labs. Diagnosis?', a: 'Legg-Calvé-Perthes disease',
          why: 'Idiopathic avascular necrosis of the femoral head in young children. The lack of fever and normal inflammatory markers separate it from septic arthritis, and the age separates it from slipped capital femoral epiphysis. Films show a flattened sclerotic head.' },
        { type: 'recall', q: 'Obese adolescent with weeks of knee pain and a limp, hip rolls into external rotation when flexed. Diagnosis?', a: 'Slipped capital femoral epiphysis',
          why: 'The femoral head slips posteriorly off the neck through the growth plate, so flexion forces obligatory external rotation. Knee pain is referred and misleads. Get frog-leg lateral films of both hips, make the patient non-weight-bearing and refer for pinning the same day.' },
        { type: 'recall', q: 'Febrile child refusing to bear weight, hip held flexed and externally rotated, ESR raised. Diagnosis?', a: 'Septic arthritis of the hip',
          why: 'Fever, refusal to bear weight, ESR over 40 and white count over 12,000 are the Kocher criteria; three or four of them make septic arthritis likely and the joint is aspirated urgently. Transient synovitis looks similar but the child is well and afebrile.' },
        { type: 'match', q: 'Match each hip test to what a positive result points to.',
          pairs: [
            { left: 'FADIR', right: 'Labral tear, impingement' },
            { left: 'Log roll', right: 'Intra-articular pain' },
            { left: 'Trendelenburg', right: 'Gluteus medius' },
            { left: 'Ober', right: 'Tight iliotibial band' }
          ] },
        { type: 'bucket', q: 'Sort each pediatric hip presentation by diagnosis.', bins: ['SCFE', 'Perthes'],
          items: [
            { label: 'Obese 13-year-old', bin: 'SCFE' },
            { label: 'Thin 6-year-old', bin: 'Perthes' },
            { label: 'Externally rotates on flexion', bin: 'SCFE' },
            { label: 'Flattened femoral head on film', bin: 'Perthes' },
            { label: 'Urgent pinning', bin: 'SCFE' },
            { label: 'Observation and bracing', bin: 'Perthes' }
          ],
          why: 'Age and body habitus do most of the work. Perthes is the thin young child with avascular necrosis that revascularizes over years. SCFE is the heavy adolescent whose epiphysis is sliding off and must be pinned before it slips further.' }
      ]
    },

    {
      id: 'mx-knee', subject: 'MSK & Sports Medicine', topic: 'Exam & Diagnosis', name: 'KNEE EXAM',
      blurb: 'Ligament and meniscal tests, and telling the common knee diagnoses apart by history and site.',
      cards: [
        { type: 'recall', q: 'Knee flexed 20 to 30 degrees, examiner pulls the tibia forward and feels no firm endpoint. Test and meaning?', a: 'Lachman test, ACL tear',
          why: 'At slight flexion the hamstrings cannot guard, so the test works even in a swollen acute knee, which is why it beats the anterior drawer. A soft or absent endpoint is positive. Sensitivity and specificity are both above 85 percent.' },
        { type: 'recall', q: 'Knee flexed to 90 degrees, examiner pulls the tibia forward on the femur. Test and limitation?', a: 'Anterior drawer, hamstring guarding masks laxity',
          why: 'At 90 degrees a painful knee tenses the hamstrings and masks ACL laxity, and the posterior horn of the meniscus can block translation. It is still taught, but Lachman is the answer when the question asks for the best test.' },
        { type: 'recall', q: 'Knee flexed to 90 degrees and the tibia already sits back behind the femur before any force. Finding and meaning?', a: 'Posterior sag sign, PCL tear',
          why: 'Gravity pulls the unrestrained tibia backward. Pushing it further back, the posterior drawer, confirms. The classic history is the shin striking a dashboard or a fall onto a flexed knee. If the sag is missed, the anterior drawer looks falsely positive as the tibia returns to neutral.' },
        { type: 'recall', q: 'Knee flexed and extended while the tibia is rotated, with a painful click at the joint line. Test and meaning?', a: 'McMurray test, meniscal tear',
          why: 'Rotation traps the torn fragment between femur and tibia. External rotation tests the medial meniscus and internal rotation the lateral. A click alone is not enough; it must be painful or palpable at the joint line.' },
        { type: 'recall', q: 'Patient stands on one leg with the knee bent 20 degrees and twists the body left and right. Test and meaning?', a: 'Thessaly test, meniscal tear',
          why: 'Rotating the loaded knee reproduces joint line pain or catching and is the most accurate meniscal test at the bedside. Joint line tenderness and McMurray back it up. A twisting injury with delayed swelling and locking is the matching history.' },
        { type: 'recall', q: 'Knee bent 30 degrees, pushed inward from the outside, and the medial joint opens. Test and structure?', a: 'Valgus stress test, medial collateral ligament',
          why: 'Force applied to the outside of the knee gaps the medial side. Laxity at 30 degrees means an isolated MCL tear; laxity at full extension means the cruciates are also gone. Varus stress tests the lateral collateral the same way.' },
        { type: 'recall', q: 'Noncontact pivot, a pop, unable to continue, knee swollen within 2 hours. Diagnosis?', a: 'ACL tear',
          why: 'The rapid hemarthrosis is the giveaway, because the ligament bleeds. Lachman confirms. Patellar dislocation is the other cause of a fast effusion after a pivot, and the patient usually reports the kneecap moving.' },
        { type: 'recall', q: 'Twist on a planted foot, able to finish the game, swelling the next day, and now the knee catches and locks. Diagnosis?', a: 'Meniscal tear',
          why: 'The avascular meniscus swells slowly and a displaced fragment catches in the joint. Joint line tenderness, Thessaly and McMurray confirm, MRI stages it. True locking that will not release is a bucket-handle tear and goes to orthopedics.' },
        { type: 'recall', q: 'Pushing the kneecap sideways makes the patient grab the examiner\'s hand or tense up. Test and meaning?', a: 'Patellar apprehension test, patellar instability',
          why: 'Lateral pressure recreates the sensation of the kneecap dislocating. It follows a dislocation or in a patient with generalized laxity. Different from patellofemoral pain, where the patellar grind test hurts but nothing feels unstable.' },
        { type: 'recall', q: 'Fluid pushed up from the medial side of the knee and tapped back from the lateral side produces a visible wave. Finding?', a: 'Effusion, bulge sign',
          why: 'The bulge sign detects a small effusion; a large one is confirmed by ballotting the patella. An acute effusion after injury is a ligament tear, fracture or patellar dislocation. A spontaneous warm effusion is gout, pseudogout or infection and needs a tap.' },
        { type: 'match', q: 'Match each knee test to the structure it examines.',
          pairs: [
            { left: 'Lachman', right: 'ACL' },
            { left: 'Posterior drawer', right: 'PCL' },
            { left: 'Thessaly', right: 'Meniscus' },
            { left: 'Valgus stress', right: 'MCL' }
          ] },
        { type: 'match', q: 'Match each knee pain location to its diagnosis.',
          pairs: [
            { left: 'Behind the kneecap', right: 'Patellofemoral pain' },
            { left: 'Lateral epicondyle', right: 'Iliotibial band' },
            { left: 'Inferior patellar pole', right: 'Patellar tendinopathy' },
            { left: 'Below medial joint line', right: 'Pes anserine' }
          ] },
        { type: 'bucket', q: 'Sort each feature by the knee injury it fits.', bins: ['ACL', 'Meniscus'],
          items: [
            { label: 'Swollen within 2 hours', bin: 'ACL' },
            { label: 'Swollen the next day', bin: 'Meniscus' },
            { label: 'Heard a pop, could not continue', bin: 'ACL' },
            { label: 'Locking and catching', bin: 'Meniscus' },
            { label: 'Soft Lachman endpoint', bin: 'ACL' },
            { label: 'Joint line tenderness', bin: 'Meniscus' }
          ],
          why: 'Speed of swelling and mechanical symptoms sort the two. Blood arrives in hours, reactive fluid overnight. A ligament gives instability, a meniscus gives locking. Both are confirmed by MRI, but the exam should already have told you which one.' }
      ]
    },

    {
      id: 'mx-ankle', subject: 'MSK & Sports Medicine', topic: 'Exam & Diagnosis', name: 'ANKLE & FOOT EXAM',
      blurb: 'Sprain tests, syndesmosis, Achilles rupture, plantar fasciitis, posterior tibial tendon and Morton neuroma.',
      cards: [
        { type: 'recall', q: 'Heel pulled forward with the tibia held and the talus slides forward. Test and ligament?', a: 'Ankle anterior drawer, anterior talofibular ligament',
          why: 'The ATFL is the first ligament torn in an inversion sprain and the anterior drawer tests it directly. The talar tilt test, inverting the heel, adds the calcaneofibular ligament when it opens more than the other side. Grade by laxity and ability to bear weight.' },
        { type: 'recall', q: 'Squeezing the tibia and fibula together at mid-calf causes pain at the ankle. Test and diagnosis?', a: 'Squeeze test, syndesmotic (high ankle) sprain',
          why: 'Compression above the ankle spreads the distal tibiofibular joint and hurts if the syndesmosis is torn. External rotation of the foot with the knee bent does the same. High ankle sprains follow external rotation injuries, heal slowly and may need surgical fixation if the mortise widens.' },
        { type: 'recall', q: 'Prone patient, calf squeezed, and the foot does not plantar flex. Test and diagnosis?', a: 'Thompson test, Achilles rupture',
          why: 'An intact tendon transmits the squeeze to the heel. Patients often describe being kicked in the back of the leg and can still weakly plantar flex using the other flexors, so active motion does not exclude rupture. A palpable gap confirms it.' },
        { type: 'recall', q: 'Dorsiflexing the big toe reproduces heel pain at the medial calcaneal tuberosity. Test and diagnosis?', a: 'Windlass test, plantar fasciitis',
          why: 'Toe extension tightens the fascia like a windlass and pulls on its inflamed origin. The history of stabbing pain with the first steps of the morning completes the picture. Radiographs and the presence or absence of a heel spur are irrelevant.' },
        { type: 'recall', q: 'From behind, more toes show on one side and the heel will not invert on a single-leg heel raise. Diagnosis?', a: 'Posterior tibial tendon dysfunction',
          why: 'The failing tendon lets the arch collapse and the forefoot drift outward, the too-many-toes sign, and cannot lock the heel into inversion for a heel raise. Pain and swelling behind the medial malleolus is where it starts. Orthotics and eccentric therapy, never a steroid injection.' },
        { type: 'recall', q: 'Burning pain between the third and fourth toes in tight shoes, with a click when the forefoot is squeezed. Diagnosis?', a: 'Morton neuroma',
          why: 'The interdigital nerve is thickened under the intermetatarsal ligament, and squeezing the metatarsal heads together produces pain and a palpable click, the Mulder sign. Wider shoes and a metatarsal pad are first line, then a steroid injection.' },
        { type: 'recall', q: 'Tender base of the fifth metatarsal after an inversion injury. What on the film decides the management?', a: 'Whether the fracture is at the tuberosity or 2 cm distal',
          why: 'Both are tender in the same place. The avulsion is at the very tip of the tuberosity and heals with weight bearing. The Jones fracture sits 1.5 to 3 cm distal at the metaphyseal-diaphyseal junction and needs a non-weight-bearing cast or a screw. The management hinges on a few millimeters.' },
        { type: 'recall', q: 'Midfoot swelling and bruising on the sole of the arch after stumbling on a plantar-flexed foot. Diagnosis?', a: 'Lisfranc injury',
          why: 'Plantar ecchymosis is pathognomonic for tarsometatarsal ligament disruption. Pain with passive pronation and abduction of the forefoot and inability to stand on tiptoe go with it. Normal films do not exclude it; get weight-bearing views or CT.' },
        { type: 'recall', q: 'Tenderness at the posterior edge of the lateral malleolus after an ankle sprain. What does it change?', a: 'Radiographs are required by the Ottawa rule',
          why: 'Ligament tenderness in front of the malleolus is a sprain; bony tenderness on the posterior edge or tip may be a fracture. The distinction between palpating the ligament and palpating the bone is exactly what the Ottawa question tests.' },
        { type: 'match', q: 'Match each ankle and foot test to its diagnosis.',
          pairs: [
            { left: 'Thompson', right: 'Achilles rupture' },
            { left: 'Squeeze test', right: 'High ankle sprain' },
            { left: 'Windlass', right: 'Plantar fasciitis' },
            { left: 'Anterior drawer', right: 'ATFL sprain' }
          ] },
        { type: 'match', q: 'Match each heel and foot pain location to its diagnosis.',
          pairs: [
            { left: 'Medial heel tuberosity', right: 'Plantar fasciitis' },
            { left: 'Behind medial malleolus', right: 'Posterior tibial tendon' },
            { left: 'Third web space', right: 'Morton neuroma' },
            { left: '2 to 6 cm above the heel', right: 'Achilles tendinopathy' }
          ] }
      ]
    },

    {
      id: 'mx-spine', subject: 'MSK & Sports Medicine', topic: 'Exam & Diagnosis', name: 'SPINE & NERVE ROOTS',
      blurb: 'Straight-leg raise, Spurling, sacroiliac provocation and the root levels the ITE expects.',
      cards: [
        { type: 'recall', q: 'Supine patient, straight leg lifted between 30 and 70 degrees reproduces pain shooting below the knee. Test and meaning?', a: 'Straight-leg raise, L5 or S1 nerve root irritation',
          why: 'Lifting the leg stretches the sciatic nerve and a herniated disc tethering a root reproduces the leg pain. Back pain alone is negative. Dorsiflexing the foot at the point of pain increases it and confirms the sign.' },
        { type: 'recall', q: 'Lifting the unaffected leg reproduces pain down the painful leg. Test and meaning?', a: 'Crossed straight-leg raise, disc herniation',
          why: 'The crossed sign is less sensitive than the ordinary straight-leg raise but far more specific, around 90 percent, for a herniated disc compressing a root. It is the exam finding that makes a disc the most likely cause rather than a muscular or facet problem.' },
        { type: 'match', q: 'Match each lumbar nerve root to the finding that localizes it.',
          pairs: [
            { left: 'L4', right: 'Knee jerk, quadriceps' },
            { left: 'L5', right: 'Big toe dorsiflexion' },
            { left: 'S1', right: 'Ankle jerk, toe walking' },
            { left: 'Cauda equina', right: 'Urinary retention' }
          ] },
        { type: 'recall', q: 'Numbness of the top of the foot and big toe with weak dorsiflexion and a normal ankle reflex. Root?', a: 'L5',
          why: 'L5 has no reflex of its own, so weakness of the extensor hallucis longus and sensory loss over the dorsum of the foot and first web space localize it. Weak heel walking is the functional test. L5-S1 and L4-5 disc herniations are the two commonest.' },
        { type: 'recall', q: 'Numbness of the lateral foot and little toe with a lost ankle reflex. Root?', a: 'S1',
          why: 'S1 carries the ankle jerk and supplies the lateral border of the foot and plantar flexion. Weak toe walking is the functional test. Loss of the reflex is the most objective sign of root compression at this level.' },
        { type: 'recall', q: 'Neck extended and tilted toward the painful side, head pressed down, reproduces arm pain. Test and meaning?', a: 'Spurling test, cervical radiculopathy',
          why: 'The position narrows the neural foramen and pinches the root. Pain shooting into the arm is positive; neck pain alone is not. Relief when the patient rests the hand on top of the head, the shoulder abduction sign, supports it.' },
        { type: 'match', q: 'Match each cervical nerve root to its reflex or motor finding.',
          pairs: [
            { left: 'C5', right: 'Deltoid, biceps reflex' },
            { left: 'C6', right: 'Brachioradialis reflex' },
            { left: 'C7', right: 'Triceps, triceps reflex' },
            { left: 'C8', right: 'Finger flexion' }
          ] },
        { type: 'recall', q: 'Thumb and index finger numbness with a reduced brachioradialis reflex. Root?', a: 'C6',
          why: 'C6 supplies the thumb side of the hand, wrist extension and the brachioradialis reflex. It is confused with carpal tunnel syndrome, but neck pain, a positive Spurling test and the reflex change place the lesion at the root.' },
        { type: 'recall', q: 'Back pain that eases when the patient leans forward on a shopping cart and worsens walking downhill. Diagnosis?', a: 'Lumbar spinal stenosis',
          why: 'Flexion opens the spinal canal and extension narrows it, so the posture that relieves the symptoms is the diagnostic clue. Neurogenic claudication is bilateral leg heaviness with standing and walking that resolves with sitting. Vascular claudication eases with standing still and has reduced pulses.' },
        { type: 'recall', q: 'Young man with months of low back stiffness, worst in the morning and better with exercise. Diagnosis to consider?', a: 'Ankylosing spondylitis',
          why: 'Inflammatory back pain starts before 40, comes on gradually, wakes the patient in the second half of the night and improves with activity rather than rest. Reduced lumbar flexion on the Schober test and sacroiliitis on imaging confirm. HLA-B27 supports it.' },
        { type: 'recall', q: 'Pinpoint tenderness just below and inside the posterior superior iliac spine with a positive thigh thrust. Diagnosis?', a: 'Sacroiliac joint dysfunction',
          why: 'The Fortin finger sign localizes the pain to the joint, and provocation tests such as FABER, thigh thrust, compression, distraction and Gaenslen reproduce it. The neurologic exam is normal and pain rarely passes the knee, which separates it from a radiculopathy.' },
        { type: 'bucket', q: 'Sort each back pain feature by whether it suggests a mechanical or inflammatory cause.', bins: ['Mechanical', 'Inflammatory'],
          items: [
            { label: 'Worse with activity', bin: 'Mechanical' },
            { label: 'Better with exercise', bin: 'Inflammatory' },
            { label: 'Stiffness under 30 minutes', bin: 'Mechanical' },
            { label: 'Wakes in the early hours', bin: 'Inflammatory' },
            { label: 'Onset after lifting', bin: 'Mechanical' },
            { label: 'Onset before 40, insidious', bin: 'Inflammatory' }
          ],
          why: 'Mechanical pain follows load and eases with rest. Inflammatory pain is the reverse: it stiffens with rest, loosens with movement and disturbs sleep. Picking up the inflammatory pattern in a young adult is how spondyloarthritis gets diagnosed years earlier.' }
      ]
    },

    {
      id: 'nu-ckd', subject: 'Nephrology & Urology', topic: 'Kidney Disease', name: 'CKD STAGING & CARE',
      blurb: 'KDIGO definition and stages, the drugs that slow progression, and the complications to screen for.',
      cards: [
        { type: 'number', q: 'Minimum duration of reduced GFR or kidney damage markers required to diagnose chronic kidney disease?', value: 3, unit: 'months',
          why: 'Chronicity is the whole definition. An eGFR under 60 or a marker of damage such as albuminuria, abnormal sediment or a structural abnormality has to persist for three months. Anything shorter is acute kidney injury or acute kidney disease, which may still recover.' },
        { type: 'number', q: 'eGFR below which chronic kidney disease is diagnosed even without albuminuria or other damage markers?', value: 60, unit: 'mL/min',
          why: 'Stage G3a begins at 59, and below that the GFR alone defines the disease once it has lasted three months. Above 60 the patient needs a marker of damage, most often a urine albumin-to-creatinine ratio of 30 mg/g or more, to carry the diagnosis.' },
        { type: 'number', q: 'Urine albumin-to-creatinine ratio at or above which albuminuria is moderately increased (A2)?', value: 30, unit: 'mg/g',
          why: 'A1 is under 30 and normal, A2 is 30 to 300, and A3 is over 300 and severely increased. Persistent A2 or worse is a kidney damage marker that makes the diagnosis at any GFR and is the trigger for an ACE inhibitor or ARB and an SGLT2 inhibitor.' },
        { type: 'number', q: 'eGFR below which CKD becomes stage G3b?', value: 45, unit: 'mL/min',
          why: 'G3a runs 45 to 59 and G3b 30 to 44. The split matters because cardiovascular and progression risk step up through stage 3, and drug dosing such as metformin changes at 45.' },
        { type: 'number', q: 'eGFR below which CKD becomes stage G4?', value: 30, unit: 'mL/min',
          why: 'Stage G4 is 15 to 29. It is the stage of mandatory nephrology referral, dialysis education and vein preservation, and the point where several drugs including metformin and most DOACs are stopped.' },
        { type: 'number', q: 'eGFR below which CKD becomes stage G5, kidney failure?', value: 15, unit: 'mL/min',
          why: 'G5 is under 15 or on dialysis. The number itself does not start dialysis; refractory acidosis, hyperkalemia, intoxication, overload or uremic symptoms do.' },
        { type: 'recall', q: 'eGFR at which complication screening for mineral bone disease and anemia begins in CKD?', a: 'Below 60, stage G3',
          why: 'Phosphate retention, falling calcitriol and erythropoietin deficiency all start as nephron mass drops into stage 3. Check calcium, phosphate, intact PTH, alkaline phosphatase and 25-hydroxyvitamin D, plus a blood count, reticulocytes, ferritin and transferrin saturation.' },
        { type: 'number', q: 'eGFR below which metformin must be stopped?', value: 30, unit: 'mL/min',
          why: 'Metformin accumulates as clearance falls and the risk of lactic acidosis rises. It is stopped under 30 and not started between 30 and 44, with a dose reduction in that range for those already on it. NSAIDs are avoided at every CKD stage.' },
        { type: 'number', q: 'eGFR below which nephrology referral is mandatory?', value: 30, unit: 'mL/min',
          why: 'Stage G4 is when renal replacement planning begins: education on dialysis and transplant options, and protecting the nondominant arm veins for a future fistula. Earlier referral is reasonable for rapid decline, heavy albuminuria or unclear cause.' },
        { type: 'recall', q: 'Why are PICC lines and subclavian catheters avoided in a patient with stage 4 CKD?', a: 'They scar the veins needed for a future dialysis fistula',
          why: 'Central stenosis after a subclavian line and thrombosis after a PICC can make the arm unusable for an arteriovenous fistula, which is the best long-term dialysis access. Blood draws and IVs go in the dominant arm or hand veins, and the nondominant upper arm is kept untouched.' },
        { type: 'multi', q: 'Select the anticoagulants that are appropriate for a patient with stage 4 CKD.',
          answers: ['Warfarin', 'Unfractionated heparin', 'Renal-dosed enoxaparin'],
          distractors: ['Rivaroxaban', 'Dabigatran'],
          why: 'Dabigatran is mostly renally cleared and rivaroxaban substantially so, and both accumulate and bleed at low GFR. Warfarin and unfractionated heparin are not renally cleared. Enoxaparin can be used at 1 mg/kg once daily rather than twice when the eGFR is under 30.' },
        { type: 'multi', q: 'Select the indications for urgent dialysis.',
          answers: ['Refractory acidosis', 'Refractory hyperkalemia', 'Lithium or methanol poisoning', 'Refractory pulmonary edema', 'Uremic pericarditis'],
          distractors: ['eGFR of 12 with no symptoms', 'Mild hyperphosphatemia'],
          why: 'AEIOU: acidosis, electrolytes, intoxications, overload and uremia, each when refractory to medical treatment. The GFR number itself is not an indication; dialysis starts for symptoms and complications, not for a threshold.' },
        { type: 'recall', q: 'Why do ACE inhibitors and ARBs reduce albuminuria?', a: 'Efferent dilation lowers glomerular pressure',
          why: 'Angiotensin II constricts the efferent arteriole, which raises pressure inside the glomerulus and forces protein through. Blocking it drops that pressure. The same mechanism explains the expected creatinine bump when the drug is started.' },
        { type: 'number', q: 'Maximum acceptable rise in serum creatinine after starting an ACE inhibitor or ARB in CKD?', value: 30, unit: '%',
          why: 'A rise of up to 30 percent within 2 to 4 weeks is the expected result of lowering glomerular pressure and is actually a sign the drug is working. Continue it. A rise beyond 30 percent or potassium above 5.5 means stop and look for bilateral renal artery stenosis, volume depletion or NSAID use.' },
        { type: 'truefalse', q: 'Combining an ACE inhibitor with an ARB gives additional kidney protection in CKD.', a: false,
          why: 'Dual blockade adds hyperkalemia and acute kidney injury without slowing progression, as the ONTARGET and VA NEPHRON-D trials showed. Use one agent at the maximal tolerated dose and add an SGLT2 inhibitor instead.' },
        { type: 'recall', q: 'Why do SGLT2 inhibitors slow CKD progression even in patients without diabetes?', a: 'Afferent constriction by tubuloglomerular feedback',
          why: 'Blocking proximal sodium reabsorption delivers more sodium to the macula densa, which constricts the afferent arteriole and relieves hyperfiltration. That lowers intraglomerular pressure and albuminuria independent of glucose. They can be started down to an eGFR of 20.' },
        { type: 'number', q: 'Lowest eGFR at which an SGLT2 inhibitor can be started for CKD?', value: 20, unit: 'mL/min',
          why: 'The glucose-lowering effect fades at low GFR but the kidney and heart protection persist, so the trials enrolled down to 20. Once started it can be continued until dialysis. The initial eGFR dip of a few points is expected and not a reason to stop.' },
        { type: 'recall', q: 'Drug added for a type 2 diabetic with persistent albuminuria despite a maximal ACE inhibitor and an SGLT2 inhibitor?', a: 'Finerenone',
          why: 'The nonsteroidal mineralocorticoid receptor antagonist reduces progression and cardiovascular events on top of standard therapy. Potassium must be 4.8 or lower to start because it raises potassium like spironolactone, though less so.' },
        { type: 'recall', q: 'Why do thiazide diuretics stop working for edema when eGFR falls below 30?', a: 'Too little drug reaches the tubule to act',
          why: 'Thiazides act from inside the distal tubule and depend on proximal secretion into the urine, which falls with GFR. Loop diuretics are more potent and still work at low GFR, though they need higher doses for the same reason. Furosemide, bumetanide or torsemide is the choice in advanced CKD.' },
        { type: 'recall', q: 'Why does advanced CKD cause secondary hyperparathyroidism?', a: 'Phosphate retention and low calcitriol lower calcium',
          why: 'Failing nephrons cannot excrete phosphate, FGF-23 rises, and 1-alpha-hydroxylase activity falls so less active vitamin D is made. Hyperphosphatemia and low calcium both stimulate PTH. Untreated, this produces renal osteodystrophy and vascular calcification.' },
        { type: 'recall', q: 'What must be checked and corrected before starting an erythropoiesis-stimulating agent for anemia of CKD?', a: 'Iron stores',
          why: 'Iron deficiency is common in CKD and an ESA cannot build red cells without it. Replete iron when transferrin saturation is 30 percent or less and ferritin 500 or less, then reassess. Starting an ESA on empty iron stores wastes the drug and raises the dose and its risks.' },
        { type: 'number', q: 'Upper limit of the target hemoglobin when treating anemia of CKD with an erythropoiesis-stimulating agent?', value: 11.5, unit: 'g/dL',
          why: 'Targeting 10 to 11.5 relieves symptoms and avoids transfusion. Aiming for 13 or above increased stroke, venous thromboembolism and death in the CHOIR, CREATE and TREAT trials. The ESA dose is lowered or held as hemoglobin approaches the ceiling.' },
        { type: 'number', q: 'Starting daily dose of allopurinol in a gout patient with stage 4 CKD?', value: 50, unit: 'mg',
          why: 'Allopurinol remains first line at every level of kidney function. The low start, 100 mg or less and 50 mg in stage 4, with slow titration to a urate under 6, keeps the risk of hypersensitivity down. Flare prophylaxis uses renally adjusted colchicine or low-dose prednisone, never an NSAID.' }
      ]
    },

    {
      id: 'nu-aki', subject: 'Nephrology & Urology', topic: 'Kidney Disease', name: 'ACUTE KIDNEY INJURY',
      blurb: 'Prerenal, tubular, interstitial and glomerular injury and the urine findings that separate them.',
      cards: [
        { type: 'recall', q: 'BUN to creatinine ratio above which acute kidney injury is likely prerenal?', a: '20 to 1',
          why: 'Low tubular flow lets the proximal tubule reabsorb urea avidly while creatinine is not reabsorbed, so BUN climbs out of proportion. Tubular necrosis damages the reabsorbing cells and the ratio stays near 10 to 15 to 1.' },
        { type: 'number', q: 'Fractional excretion of sodium below which acute kidney injury is prerenal?', value: 1, unit: '%',
          why: 'Intact tubules respond to low perfusion by holding onto sodium, so under one percent of filtered sodium escapes and urine sodium is under 20. Necrotic tubules leak it, giving a FENa over 2 percent and urine sodium over 40.' },
        { type: 'recall', q: 'Why is fractional excretion of urea used instead of sodium in a patient on diuretics?', a: 'Diuretics force sodium loss regardless of volume status',
          why: 'A loop diuretic makes the kidney waste sodium even when the patient is dry, so FENa reads falsely high. Urea handling is unaffected, and a fractional excretion of urea under 35 percent still identifies prerenal injury.' },
        { type: 'recall', q: 'Why is urine osmolality above 500 in prerenal injury but below 350 in tubular necrosis?', a: 'Damaged tubules cannot concentrate the urine',
          why: 'Volume depletion raises ADH and healthy tubules concentrate the urine to conserve water. Necrotic tubules lose their concentrating ability and produce urine with the osmolality of plasma, isosthenuria, whatever the body needs.' },
        { type: 'match', q: 'Match each urine sediment finding to the type of kidney injury.',
          pairs: [
            { left: 'Hyaline casts', right: 'Prerenal' },
            { left: 'Muddy brown casts', right: 'Tubular necrosis' },
            { left: 'White cell casts', right: 'Interstitial nephritis' },
            { left: 'Red cell casts', right: 'Glomerulonephritis' }
          ] },
        { type: 'recall', q: 'Fever, rash and peripheral eosinophilia with rising creatinine a week after starting an antibiotic. Diagnosis?', a: 'Acute interstitial nephritis',
          why: 'A drug hypersensitivity in the interstitium, classically from beta-lactams, sulfa drugs, NSAIDs or proton pump inhibitors. Urine shows sterile pyuria, white cell casts and eosinophils. Stop the drug, and give steroids if function does not recover quickly.' },
        { type: 'multi', q: 'Select the drug classes that cause acute interstitial nephritis.',
          answers: ['Beta-lactam antibiotics', 'Sulfonamides', 'NSAIDs', 'Proton pump inhibitors'],
          distractors: ['Statins', 'Beta blockers', 'Metformin'],
          why: 'These four account for most cases, and PPIs are the one most often missed because the nephritis is subacute without the classic triad. Any new drug in the weeks before an unexplained creatinine rise with pyuria is suspect.' },
        { type: 'recall', q: 'Hematuria with red cell casts, proteinuria, hypertension and edema. Diagnosis?', a: 'Acute glomerulonephritis',
          why: 'Red cell casts form only when blood enters the tubule from an inflamed glomerulus, so they are diagnostic of glomerular bleeding. Dysmorphic red cells say the same thing. This is a nephrology referral, often with serologies and biopsy, not a urology workup.' },
        { type: 'recall', q: 'Why do NSAIDs and ACE inhibitors cause prerenal acute kidney injury in a volume-depleted patient?', a: 'They undo the arteriolar compensation for low flow',
          why: 'When perfusion falls, prostaglandins dilate the afferent arteriole and angiotensin II constricts the efferent one to hold up glomerular pressure. NSAIDs take away the first and ACE inhibitors the second. In a dehydrated patient, or with both drugs plus a diuretic, filtration collapses.' },
        { type: 'bucket', q: 'Sort each finding by whether it points to prerenal injury or acute tubular necrosis.', bins: ['Prerenal', 'ATN'],
          items: [
            { label: 'FENa under 1 percent', bin: 'Prerenal' },
            { label: 'Urine sodium over 40', bin: 'ATN' },
            { label: 'Urine osmolality over 500', bin: 'Prerenal' },
            { label: 'Muddy brown casts', bin: 'ATN' },
            { label: 'BUN to creatinine over 20', bin: 'Prerenal' },
            { label: 'Improves with fluids', bin: 'Prerenal' }
          ],
          why: 'Prerenal injury is a working kidney starved of flow, so it conserves sodium and water and the labs show it. Tubular necrosis is a kidney that has lost that ability, so the urine is salty and dilute with the debris of dead cells in it. Fluids fix the first and not the second.' },
        { type: 'recall', q: 'Postrenal acute kidney injury in an older man with a distended bladder. First test?', a: 'Bladder ultrasound or catheterization',
          why: 'Obstruction from prostatic enlargement is the commonest postrenal cause and is reversed by draining the bladder. A post-void residual or bladder scan confirms retention, and renal ultrasound shows hydronephrosis if the obstruction is higher. Relief of obstruction can trigger a post-obstructive diuresis that needs monitoring.' }
      ]
    },

    {
      id: 'nu-sodium', subject: 'Nephrology & Urology', topic: 'Electrolytes', name: 'HYPONATREMIA',
      blurb: 'The encephalopathy emergency, safe correction limits and the diagnostic algorithm.',
      cards: [
        { type: 'recall', q: 'Sodium of 108 with confusion and a seizure. Immediate treatment?', a: '100 mL bolus of 3 percent saline over 10 to 20 minutes',
          why: 'Symptoms, not the number, decide the treatment. Cerebral edema is killing the patient now, and hypertonic saline is the only thing that pulls water out of the brain fast enough. Repeat the bolus up to two or three times until symptoms settle or sodium has risen 4 to 6.' },
        { type: 'number', q: 'Rise in serum sodium that halts seizures and herniation in acute hyponatremic encephalopathy?', value: 5, unit: 'mEq/L',
          why: 'A rise of 4 to 6 in the first one to two hours cuts intracranial pressure by about half. That small change is the whole goal of the boluses. Once symptoms are controlled, correction slows to the 24-hour limit.' },
        { type: 'recall', q: 'Why does isotonic saline worsen hyponatremia in SIADH?', a: 'The kidney excretes the salt and keeps the water',
          why: 'With ADH fixed on, urine osmolality often exceeds 500. The sodium in a liter of normal saline leaves in under 600 mL of concentrated urine and the remaining free water is retained, a process called desalination. Hypertonic saline for symptoms or fluid restriction for the chronic state are the right tools.' },
        { type: 'number', q: 'Maximum 24-hour sodium correction in a patient at high risk of osmotic demyelination?', value: 8, unit: 'mEq/L',
          why: 'In chronic hyponatremia the brain has shed osmolytes to adapt, and raising sodium too fast shrinks astrocytes and strips myelin in the pons 2 to 6 days later. High risk means a starting sodium of 105 or less, hypokalemia, alcohol use disorder, malnutrition or cirrhosis. Average-risk patients can tolerate 10 to 12.' },
        { type: 'recall', q: 'Treatment when sodium has overcorrected past the daily limit?', a: 'D5W and desmopressin',
          why: 'A brisk water diuresis once ADH switches off is the usual reason for overshoot. Giving free water and DDAVP re-lowers sodium before demyelination is set in motion. Checking sodium every 2 to 4 hours during correction is what catches it in time.' },
        { type: 'recall', q: 'Dysarthria, dysphagia and quadriparesis developing 4 days after rapid correction of hyponatremia. Diagnosis?', a: 'Osmotic demyelination syndrome',
          why: 'Central pontine myelinolysis destroys the corticobulbar and corticospinal tracts in the pons, producing a pseudobulbar palsy and, at worst, a locked-in state. The delay of several days is characteristic. It is largely irreversible, which is why the correction limits are strict.' },
        { type: 'recall', q: 'Sodium of 128 with a glucose of 900. What kind of hyponatremia?', a: 'Hypertonic, from glucose pulling water into the plasma',
          why: 'Each 100 mg/dL of glucose above 100 lowers measured sodium by about 1.6 to 2.4. The serum osmolality is high, not low, so the brain is not swelling and the sodium corrects itself as the glucose comes down. Mannitol does the same thing.' },
        { type: 'recall', q: 'Low sodium with a normal serum osmolality in a patient with severe hypertriglyceridemia. Interpretation?', a: 'Pseudohyponatremia',
          why: 'Lipid or paraprotein takes up volume in the sample and the analyzer reports sodium per liter of total serum rather than per liter of water. The patient is not hyponatremic and needs no treatment for it. Multiple myeloma is the other classic cause.' },
        { type: 'recall', q: 'Hypotonic hyponatremia with a urine osmolality under 100 in a heavy beer drinker who eats little. Cause?', a: 'Beer potomania, low solute intake',
          why: 'Maximally dilute urine means ADH is appropriately suppressed and the kidney is doing its best. The problem is that excreting free water requires solute, and a diet of beer or tea and toast provides almost none. Primary polydipsia gives the same picture through sheer water volume.' },
        { type: 'recall', q: 'Most common drug cause of severe hyponatremia?', a: 'Thiazide diuretics',
          why: 'Thiazides impair urinary dilution while leaving concentration intact and often come with increased water intake, so sodium can fall within days of starting, especially in older women. Urine sodium is over 30 because the loss is renal. Stop the drug and give isotonic saline if hypovolemic.' },
        { type: 'multi', q: 'Select the tests to check before diagnosing SIADH.',
          answers: ['TSH', 'Morning cortisol'],
          distractors: ['Serum uric acid', 'Chest CT', 'Renin and aldosterone'],
          why: 'Hypothyroidism and secondary adrenal insufficiency both produce euvolemic hyponatremia with concentrated urine, and both are treatable. SIADH is a diagnosis of exclusion once they are ruled out. A low uric acid supports SIADH but does not exclude the mimics.' },
        { type: 'multi', q: 'Select the recognized causes of SIADH.',
          answers: ['Small cell lung cancer', 'SSRIs', 'Carbamazepine', 'Subarachnoid hemorrhage', 'Legionella pneumonia'],
          distractors: ['Thiazide diuretics', 'Heart failure'],
          why: 'Ectopic ADH from small cell cancer, drugs that stimulate ADH release, intracranial disease and pulmonary infection are the classic sources, along with pain, nausea and MDMA. Thiazides cause renal sodium loss and heart failure causes hypervolemic hyponatremia, both different mechanisms.' },
        { type: 'recall', q: 'First-line treatment for chronic asymptomatic SIADH?', a: 'Fluid restriction under 1 liter a day',
          why: 'Limiting intake below the amount the kidney can excrete lets sodium drift up slowly. If that fails, add salt tablets with a loop diuretic, oral urea, or tolvaptan, which is avoided in liver disease. Stop any drug that could be the cause first.' },
        { type: 'bucket', q: 'Sort each cause of hypotonic hyponatremia by the volume status it produces.', bins: ['Hypovolemic', 'Hypervolemic'],
          items: [
            { label: 'Vomiting and diarrhea', bin: 'Hypovolemic' },
            { label: 'Cirrhosis with ascites', bin: 'Hypervolemic' },
            { label: 'Thiazide diuretic', bin: 'Hypovolemic' },
            { label: 'Heart failure', bin: 'Hypervolemic' },
            { label: 'Primary adrenal insufficiency', bin: 'Hypovolemic' },
            { label: 'Nephrotic syndrome', bin: 'Hypervolemic' }
          ],
          why: 'Volume status picks the treatment. Hypovolemic patients get isotonic saline, which restores volume and switches off ADH. Hypervolemic patients have too much total sodium and water with a low effective circulating volume, and get fluid and salt restriction with a loop diuretic, never saline.' },
        { type: 'number', q: 'Urine sodium above which hypovolemic hyponatremia is from renal sodium loss?', value: 30, unit: 'mEq/L',
          why: 'A kidney that is losing volume through the gut or skin conserves sodium, so the urine is nearly sodium-free. Thiazides, adrenal insufficiency and cerebral salt wasting force sodium out, so urine sodium stays high despite volume depletion.' }
      ]
    },

    {
      id: 'nu-potassium', subject: 'Nephrology & Urology', topic: 'Electrolytes', name: 'POTASSIUM EMERGENCIES',
      blurb: 'Hyperkalemia on the ECG and its three-step treatment, and severe hypokalemia.',
      cards: [
        { type: 'recall', q: 'High potassium in an asymptomatic patient with normal kidneys and a normal ECG. First step?', a: 'Repeat a free-flowing sample for pseudohyperkalemia',
          why: 'Hemolysis from a traumatic draw, fist clenching or a long tourniquet, and very high white or platelet counts release potassium in the tube. A normal ECG with an unexplained high value is the clue. Treating a lab artifact can cause real hypokalemia.' },
        { type: 'recall', q: 'Earliest ECG change of hyperkalemia?', a: 'Tall peaked T waves',
          why: 'Potassium between 5.5 and 6.5 speeds repolarization, giving narrow symmetric peaked T waves and a shorter QT. The changes then march through PR prolongation and loss of P waves to QRS widening as the level climbs.' },
        { type: 'trend', q: 'How does each interval change as potassium rises from 6.5 to 7.5?',
          items: [
            { label: 'PR interval', dir: 'up' },
            { label: 'P wave amplitude', dir: 'down' },
            { label: 'QRS duration', dir: 'up' },
            { label: 'T wave height', dir: 'up' }
          ],
          why: 'Hyperkalemia slows conduction everywhere it depends on sodium channels. The atria go quiet first, lengthening PR and flattening then losing the P wave, and the ventricles depolarize slowly, widening the QRS. The T wave stays tall throughout.' },
        { type: 'recall', q: 'ECG pattern of potassium above 7.5 to 8 that precedes arrest?', a: 'Sine wave',
          why: 'The widened QRS merges with the tall T into a smooth undulating pattern. Ventricular fibrillation, pulseless electrical activity or asystole follows within minutes. Calcium is given immediately on seeing it, before any lab result.' },
        { type: 'recall', q: 'First drug for hyperkalemia with QRS widening, and why?', a: 'IV calcium gluconate, to stabilize the heart membrane',
          why: 'One gram of 10 percent calcium gluconate over 2 to 3 minutes raises the threshold potential and restores normal excitability within minutes. It does not lower potassium at all, so the shifting and removal steps must follow. The effect lasts 30 to 60 minutes and the dose can be repeated.' },
        { type: 'truefalse', q: 'IV calcium gluconate lowers the serum potassium concentration.', a: false,
          why: 'Calcium antagonizes the effect of potassium on the cardiac membrane and buys time; the level is unchanged. Insulin with dextrose and nebulized albuterol shift potassium into cells, and diuretics, binders or dialysis remove it from the body.' },
        { type: 'recall', q: 'Regimen that shifts potassium into cells within 15 to 30 minutes?', a: 'IV regular insulin 10 units with 25 to 50 g dextrose',
          why: 'Insulin drives the sodium-potassium pump, and the dextrose prevents hypoglycemia, which is omitted only when glucose is already above 250. High-dose nebulized albuterol adds to the shift. The effect lasts 2 to 4 hours, after which potassium returns unless it has been removed.' },
        { type: 'recall', q: 'When is IV sodium bicarbonate useful in acute hyperkalemia?', a: 'Only with a severe non-gap metabolic acidosis',
          why: 'Bicarbonate shifts potassium only in proportion to how much it corrects acidemia, and in a patient with a normal pH it does little. It is not a routine step. Insulin and albuterol are the reliable shifting agents.' },
        { type: 'multi', q: 'Select the ways to remove potassium from the body.',
          answers: ['IV loop diuretic', 'Sodium zirconium cyclosilicate', 'Patiromer', 'Hemodialysis'],
          distractors: ['Calcium gluconate', 'Insulin and dextrose', 'Nebulized albuterol'],
          why: 'Furosemide works if the patient makes urine, the newer binders clear potassium through the gut within hours, and dialysis is fastest and definitive for anuric patients or massive tissue breakdown. Calcium, insulin and albuterol only protect the heart or hide potassium inside cells.' },
        { type: 'recall', q: 'Why is sodium polystyrene sulfonate no longer preferred as a potassium binder?', a: 'It can cause fatal intestinal necrosis',
          why: 'Kayexalate works slowly and has caused colonic necrosis, especially with sorbitol or in postoperative and ileus patients. Sodium zirconium cyclosilicate starts within an hour and patiromer within hours, and neither carries that risk.' },
        { type: 'multi', q: 'Select the ECG findings of severe hypokalemia.',
          answers: ['Flattened T waves', 'Prominent U waves', 'ST depression', 'Prolonged QTc'],
          distractors: ['Peaked T waves', 'Widened QRS', 'Shortened QT'],
          why: 'Low potassium delays repolarization, flattening the T wave, raising a U wave after it and stretching the QT toward torsades. Peaked T waves and a wide QRS belong to hyperkalemia. Muscle weakness, ileus and rhabdomyolysis are the other features.' },
        { type: 'number', q: 'Serum potassium below which a patient with anorexia nervosa needs inpatient admission?', value: 3, unit: 'mEq/L',
          why: 'Purging, laxatives, diuretics and refeeding all drive potassium down, and under 3.0 the risk of a fatal arrhythmia justifies telemetry and IV repletion. Bradycardia, hypotension and hypophosphatemia are the other admission triggers in eating disorders.' },
        { type: 'recall', q: 'Why does hypokalemia fail to correct until magnesium is replaced?', a: 'Low magnesium lets the kidney waste potassium',
          why: 'Magnesium blocks the ROMK channel in the collecting duct from the inside. Without it the channel leaks potassium into the urine as fast as it is given. Check magnesium with every significant hypokalemia and replete both together.' }
      ]
    },

    {
      id: 'nu-hematuria', subject: 'Nephrology & Urology', topic: 'Hematuria & Stones', name: 'HEMATURIA',
      blurb: 'Confirming true hematuria, glomerular versus urologic bleeding, and the AUA risk tiers.',
      cards: [
        { type: 'number', q: 'Minimum red cells per high-power field that defines microscopic hematuria?', value: 3, unit: 'RBC/hpf',
          why: 'The dipstick reacts to heme, so myoglobin from rhabdomyolysis and free hemoglobin from hemolysis both turn it positive with no red cells present. A positive dipstick is always confirmed by microscopy before any workup begins.' },
        { type: 'truefalse', q: 'Hematuria in a patient on warfarin or a DOAC can be attributed to the anticoagulant without further workup.', a: false,
          why: 'Anticoagulated patients have the same rate of underlying urologic cancer as everyone else; the drug unmasks the lesion rather than causing the bleeding. They get the full risk-stratified evaluation. This is one of the most reliable board traps in the topic.' },
        { type: 'multi', q: 'Select the urinalysis findings that point to a glomerular source of hematuria.',
          answers: ['Dysmorphic red cells', 'Red cell casts', 'Significant proteinuria'],
          distractors: ['Red cells of uniform shape', 'Clots in the urine', 'Isolated pyuria'],
          why: 'Red cells squeezed through an inflamed glomerular basement membrane are deformed, and those packed in the tubule form casts. Protein leaks alongside. These findings, or a rising creatinine, send the patient to nephrology rather than down the urothelial cancer pathway. Clots never come from the glomerulus.' },
        { type: 'multi', q: 'Select the features that place a patient in the AUA high-risk hematuria tier.',
          answers: ['Age 60 or older', 'Over 30 pack-years of smoking', 'Over 25 RBC per hpf', 'Any gross hematuria'],
          distractors: ['Age 45 with 5 pack-years', '5 RBC per hpf', 'Anticoagulant use'],
          why: 'One high-risk feature is enough. Age, heavy smoking, a heavy microscopic count and any visible blood each carry a urothelial cancer rate that justifies the full evaluation. Occupational exposure to aromatic amines, prior pelvic radiation, cyclophosphamide and a chronic indwelling catheter also qualify.' },
        { type: 'recall', q: 'Evaluation for a high-risk microscopic hematuria patient?', a: 'CT urography plus cystoscopy',
          why: 'Multiphasic CT without and with contrast images the kidneys, ureters and collecting systems, and cystoscopy sees the bladder, which CT misses. Together they cover the whole urinary tract. Urine cytology and tumor markers are not part of the initial evaluation.' },
        { type: 'recall', q: 'Evaluation for an intermediate-risk microscopic hematuria patient?', a: 'Renal ultrasound plus cystoscopy',
          why: 'Men of 40 to 59, women of 60 or more, 10 to 30 pack-years, or 11 to 25 red cells per field sit in the middle tier, where ultrasound is enough to screen the upper tract and cystoscopy still covers the bladder. A low-risk patient who stays positive on repeat urinalysis moves into this tier.' },
        { type: 'recall', q: 'Options for a low-risk patient with 5 red cells per field on a single urinalysis?', a: 'Repeat UA in 6 months, or ultrasound and cystoscopy',
          why: 'A woman under 60 or a man under 40 who never smoked, with 3 to 10 cells and no other risk factors, has a very low cancer rate. Shared decision-making chooses between watching and testing. If the repeat urinalysis is positive the patient is evaluated with ultrasound and cystoscopy.' },
        { type: 'truefalse', q: 'Urine cytology should be ordered as part of the initial workup of microscopic hematuria.', a: false,
          why: 'Cytology and urine tumor markers are insensitive for low-grade tumors and add false positives without changing the plan, which is imaging plus cystoscopy by risk tier. Cytology is reserved for specific situations such as suspected carcinoma in situ.' },
        { type: 'bucket', q: 'Sort each hematuria finding by the workup it sends the patient to.', bins: ['Nephrology', 'Urology'],
          items: [
            { label: 'Red cell casts', bin: 'Nephrology' },
            { label: 'Gross painless hematuria', bin: 'Urology' },
            { label: 'Dysmorphic red cells', bin: 'Nephrology' },
            { label: '40 pack-year smoker', bin: 'Urology' },
            { label: 'Proteinuria, rising creatinine', bin: 'Nephrology' },
            { label: 'Prior cyclophosphamide', bin: 'Urology' }
          ],
          why: 'Glomerular bleeding leaves fingerprints in the sediment and comes with protein and falling function, so it is a medical kidney workup. Isomorphic cells with cancer risk factors mean the bleeding is from the urinary tract lining and the question is whether a tumor is there.' }
      ]
    },

    {
      id: 'nu-stones', subject: 'Nephrology & Urology', topic: 'Hematuria & Stones', name: 'KIDNEY STONES',
      blurb: 'Renal colic imaging and pain control, when to decompress, prevention, and the stone types.',
      cards: [
        { type: 'recall', q: 'Imaging of choice for suspected renal colic?', a: 'Noncontrast helical CT',
          why: 'Low-dose noncontrast CT finds nearly every stone including radiolucent uric acid stones and shows the degree of obstruction. Ultrasound is used first in pregnancy, children and patients with known recurrent stones to spare radiation.' },
        { type: 'recall', q: 'Why are NSAIDs at least as effective as opioids for renal colic?', a: 'They block the prostaglandins that cause ureteral spasm',
          why: 'Obstruction raises prostaglandin release, which drives ureteral spasm and afferent arteriolar dilation that increases pressure in the collecting system. Ketorolac treats the mechanism. Avoid NSAIDs in CKD, pregnancy and GI bleeding, where opioids become the fallback.' },
        { type: 'number', q: 'Stone size at or below which spontaneous passage occurs in over 80 percent of cases?', value: 5, unit: 'mm',
          why: 'Small stones pass on their own with fluids and analgesia. The patient strains the urine so the stone can be analyzed, which guides prevention. Stones over 10 mm rarely pass and go to urology for lithotripsy or ureteroscopy.' },
        { type: 'recall', q: 'Medical expulsive therapy for a 7 mm distal ureteral stone?', a: 'Tamsulosin 0.4 mg daily for up to 4 weeks',
          why: 'Alpha-1 blockade relaxes the distal ureteral smooth muscle and improves passage of stones in the 5 to 10 mm range. The benefit is clearest for distal stones. Calcium channel blockers are a less effective alternative.' },
        { type: 'multi', q: 'Select the findings that require immediate decompression of an obstructing stone.',
          answers: ['Fever or urosepsis', 'Acute kidney injury', 'Solitary kidney', 'Intractable pain or vomiting'],
          distractors: ['Stone of 6 mm', 'Microscopic hematuria', 'Mild flank tenderness'],
          why: 'An infected obstructed kidney can become septic shock within hours, so a stent or nephrostomy is placed first and the stone is dealt with later. Obstruction of the only functioning kidney or anuria is renal failure in progress. Size alone is not an emergency.' },
        { type: 'recall', q: 'Why is lithotripsy delayed in a patient with fever and an obstructing stone?', a: 'Breaking an infected stone seeds the bloodstream',
          why: 'Fragmenting the stone in an infected system seeds the bloodstream and worsens sepsis. Decompress with a stent or nephrostomy, treat the infection with antibiotics, and remove the stone once the urine is sterile.' },
        { type: 'number', q: 'Target daily urine output for preventing recurrent kidney stones?', value: 2, unit: 'L/day',
          why: 'Two to two and a half liters of urine a day dilutes every stone-forming solute and is the single most effective intervention for every stone type. Citrus drinks add citrate. The fluid target is set by urine volume, not by intake.' },
        { type: 'truefalse', q: 'Patients with calcium oxalate stones should restrict dietary calcium.', a: false,
          why: 'Dietary calcium binds oxalate in the gut so it is excreted in stool rather than absorbed. Restricting calcium leaves oxalate free to be absorbed and raises urinary oxalate, which makes more stones. Normal intake of 1000 to 1200 mg a day from food is the goal.' },
        { type: 'recall', q: 'Why does a high-sodium diet promote calcium stones?', a: 'Sodium excretion drags calcium into the urine',
          why: 'Sodium and calcium reabsorption are linked in the proximal tubule and loop, so every extra gram of sodium excreted raises urinary calcium. Restrict sodium to under 2 to 2.3 g a day. Animal protein is limited too, since it raises uric acid and calcium excretion and lowers citrate.' },
        { type: 'match', q: 'Match each preventive drug to the urine abnormality it corrects.',
          pairs: [
            { left: 'Thiazide', right: 'Hypercalciuria' },
            { left: 'Potassium citrate', right: 'Hypocitraturia' },
            { left: 'Allopurinol', right: 'Hyperuricosuria' },
            { left: 'Tiopronin', right: 'Cystinuria' }
          ] },
        { type: 'recall', q: 'Why does a thiazide prevent calcium stones?', a: 'It increases distal tubular calcium reabsorption',
          why: 'Thiazides lower urinary calcium while raising serum calcium slightly, the opposite of loop diuretics, which waste calcium. Hydrochlorothiazide, chlorthalidone or indapamide is the choice for recurrent calcium stones with hypercalciuria once fluids alone have failed.' },
        { type: 'recall', q: 'Why does potassium citrate prevent both calcium and uric acid stones?', a: 'Citrate binds calcium and alkalinizes the urine',
          why: 'Urinary citrate complexes calcium so it cannot crystallize with oxalate or phosphate, and the alkali load raises urine pH, which dissolves uric acid and keeps cystine in solution. It is the drug for hypocitraturia, uric acid stones and cystine stones.' },
        { type: 'recall', q: 'Stone that is invisible on a plain abdominal film but visible on CT, forming in persistently acidic urine?', a: 'Uric acid stone',
          why: 'Uric acid is radiolucent, and it precipitates when urine pH stays under 5.5, as in gout, metabolic syndrome and chronic diarrhea. Alkalinizing the urine to 6.5 to 7 with potassium citrate dissolves existing stones, which no other stone type allows.' },
        { type: 'recall', q: 'Large branching staghorn calculus in a patient with recurrent Proteus infections. Stone type?', a: 'Struvite',
          why: 'Urease-producing organisms such as Proteus, Klebsiella, Pseudomonas and Staphylococcus saprophyticus split urea into ammonia, driving urine pH above 7.2 and precipitating magnesium ammonium phosphate. E. coli lacks urease. The stone harbors the infection, so complete surgical removal plus antibiotics is the treatment.' },
        { type: 'recall', q: 'Hexagonal crystals in the urine of a young patient with recurrent stones. Diagnosis?', a: 'Cystinuria',
          why: 'An autosomal recessive defect in the proximal tubular transporter for cystine, ornithine, lysine and arginine lets cystine spill into urine, where it is poorly soluble. The cyanide-nitroprusside test confirms. Treatment is over 3 liters of fluid a day, potassium citrate to a pH above 7, and tiopronin if that fails.' },
        { type: 'recall', q: 'Why does Roux-en-Y gastric bypass cause calcium oxalate stones?', a: 'Malabsorbed fat binds calcium and frees oxalate',
          why: 'Unabsorbed fatty acids in the gut saponify calcium, so none is left to bind oxalate and the colon absorbs it. Crohn ileitis, short bowel and chronic pancreatitis do the same. The treatment includes normal dietary calcium with meals, which is counterintuitive but correct.' },
        { type: 'match', q: 'Match each stone type to its crystal shape.',
          pairs: [
            { left: 'Calcium oxalate', right: 'Envelope' },
            { left: 'Uric acid', right: 'Rhomboid' },
            { left: 'Struvite', right: 'Coffin lid' },
            { left: 'Cystine', right: 'Hexagon' }
          ] },
        { type: 'bucket', q: 'Sort each stone type by whether it shows on a plain abdominal radiograph.', bins: ['Radiopaque', 'Radiolucent'],
          items: [
            { label: 'Calcium oxalate', bin: 'Radiopaque' },
            { label: 'Uric acid', bin: 'Radiolucent' },
            { label: 'Struvite', bin: 'Radiopaque' },
            { label: 'Calcium phosphate', bin: 'Radiopaque' }
          ],
          why: 'Calcium-containing and struvite stones are bright on a plain film. Uric acid stones are invisible on it and show only on CT or ultrasound. Cystine is faintly radiopaque with a ground-glass look. A patient with colic and a clean plain film still needs a CT.' }
      ]
    },

    {
      id: 'nu-incont', subject: 'Nephrology & Urology', topic: 'Bladder & Infection', name: 'INCONTINENCE & OAB',
      blurb: 'The workup every incontinent patient gets, the three types, and the drugs by age.',
      cards: [
        { type: 'recall', q: 'Test ordered in every patient presenting with new urinary incontinence?', a: 'Urinalysis',
          why: 'Infection, glycosuria and hematuria are reversible or important causes that history alone misses. The rest of the initial evaluation is a focused history with a voiding diary, a medication review and a pelvic or genitourinary exam. Post-void residual is measured only when overflow or poor emptying is suspected.' },
        { type: 'multi', q: 'Select the reversible causes of incontinence in the DIAPPERS mnemonic.',
          answers: ['Delirium', 'Urinary infection', 'Atrophic vaginitis', 'Diuretics and sedatives', 'Stool impaction'],
          distractors: ['Detrusor overactivity', 'Multiparity'],
          why: 'Delirium, infection, atrophic vaginitis, pharmaceuticals, psychological causes, excess urine output, restricted mobility and stool impaction are the transient causes to fix before labeling the type. Detrusor overactivity and pelvic floor weakness are the established mechanisms, not reversible triggers.' },
        { type: 'number', q: 'Post-void residual volume above which urinary retention is diagnosed?', value: 200, unit: 'mL',
          why: 'Normal is under 50 to 100 mL. A residual over 200 to 300 mL means the bladder is not emptying, from detrusor underactivity or outlet obstruction, and points to overflow incontinence. It is checked only when the history suggests poor emptying.' },
        { type: 'recall', q: 'Leakage of small amounts of urine with coughing, sneezing or lifting, with a normal post-void residual. Type?', a: 'Stress incontinence',
          why: 'A weak urethral sphincter or hypermobile pelvic floor cannot hold against a rise in abdominal pressure. Multiparity, obesity and prostatectomy are the usual causes. There is no urgency and the bladder empties normally.' },
        { type: 'recall', q: 'First-line treatment for stress urinary incontinence?', a: 'Pelvic floor muscle training and weight loss',
          why: 'Kegel exercises strengthen the sphincter complex and an 8 percent weight loss roughly halves leakage episodes. Topical vaginal estrogen helps when genitourinary syndrome of menopause is present. A pessary or midurethral sling is second line.' },
        { type: 'truefalse', q: 'Systemic oral estrogen improves stress urinary incontinence in postmenopausal women.', a: false,
          why: 'Oral estrogen worsens incontinence, as the WHI trial showed, and alpha blockers do too. Only topical vaginal estrogen helps, and only for the atrophic component. No oral drug is FDA approved for stress incontinence.' },
        { type: 'recall', q: 'Sudden compelling urge to void with leakage on the way to the bathroom and frequency over 8 times a day. Type?', a: 'Urge incontinence, overactive bladder',
          why: 'Uninhibited detrusor contractions produce the urgency, and leakage happens before the patient can reach the toilet. Nocturia is common and the post-void residual is normal. Bladder training with scheduled voiding and urge suppression is first line.' },
        { type: 'recall', q: 'Preferred second-line drug class for overactive bladder in an older adult?', a: 'Beta-3 agonists, mirabegron or vibegron',
          why: 'They relax the detrusor during filling without anticholinergic effects, so there is no cognitive impairment, delirium, dry mouth or constipation. Antimuscarinics such as oxybutynin are on the Beers list and add to the burden of other anticholinergics the patient may already take.' },
        { type: 'recall', q: 'Why is mirabegron avoided when blood pressure is 180 over 110?', a: 'Beta-3 stimulation raises blood pressure',
          why: 'Mirabegron has mild sympathomimetic effect and is contraindicated in severe uncontrolled hypertension, with blood pressure monitored in everyone else. Vibegron does not raise blood pressure and is the alternative in hypertensive patients.' },
        { type: 'multi', q: 'Select the conditions in which antimuscarinic drugs for overactive bladder should be avoided.',
          answers: ['Cognitive impairment', 'Narrow-angle glaucoma', 'Urinary retention', 'Gastric retention'],
          distractors: ['Hypertension', 'Osteoporosis', 'Type 2 diabetes'],
          why: 'M3 blockade impairs memory, raises intraocular pressure in a narrow angle, and slows both bladder and stomach emptying. Hypertension is the mirabegron concern, not the antimuscarinic one. Trospium crosses the blood-brain barrier least if an antimuscarinic is unavoidable.' },
        { type: 'multi', q: 'Select the third-line options for refractory overactive bladder.',
          answers: ['Intradetrusor onabotulinumtoxinA', 'Sacral neuromodulation', 'Tibial nerve stimulation'],
          distractors: ['Midurethral sling', 'Oral estrogen', 'Tamsulosin'],
          why: 'When behavioral therapy and drugs fail, botulinum toxin paralyzes the overactive detrusor, and sacral or percutaneous tibial nerve stimulation modulates the reflex arc. The sling treats stress incontinence and has no role in urgency.' },
        { type: 'recall', q: 'Constant dribbling with a weak hesitant stream and a residual of 400 mL. Type?', a: 'Overflow incontinence',
          why: 'The bladder is chronically overfilled and leaks from the top, either because the detrusor cannot contract, as in diabetic neuropathy, multiple sclerosis or anticholinergic use, or because the outlet is blocked by prostatic enlargement, prolapse or stricture. The high residual is the defining finding.' },
        { type: 'recall', q: 'Treatment for overflow incontinence from neurogenic detrusor underactivity?', a: 'Clean intermittent catheterization',
          why: 'A bladder that cannot contract has to be emptied mechanically, and intermittent catheterization carries less infection risk than an indwelling catheter. Anticholinergics and opioids are stopped. When the cause is obstruction, an alpha blocker and 5-alpha-reductase inhibitor or surgery relieve it instead.' },
        { type: 'bucket', q: 'Sort each feature by the type of incontinence it belongs to.', bins: ['Stress', 'Urge'],
          items: [
            { label: 'Leaks with a cough', bin: 'Stress' },
            { label: 'Cannot defer the urge', bin: 'Urge' },
            { label: 'After prostatectomy', bin: 'Stress' },
            { label: 'Nocturia and frequency', bin: 'Urge' },
            { label: 'Treated with a sling', bin: 'Stress' },
            { label: 'Treated with mirabegron', bin: 'Urge' }
          ],
          why: 'Stress leakage is mechanical and happens with pressure; urge leakage is neurologic and happens with a bladder contraction. Both have a normal residual, which is what separates them from overflow. Mixed incontinence has features of both and is treated for the dominant symptom.' }
      ]
    },

    {
      id: 'nu-uti', subject: 'Nephrology & Urology', topic: 'Bladder & Infection', name: 'UTI & PROSTATITIS',
      blurb: 'Acute and chronic prostatitis, cystitis regimens, and who gets treated for asymptomatic bacteriuria.',
      cards: [
        { type: 'recall', q: 'High fever, dysuria, perineal pain and an exquisitely tender boggy prostate. Diagnosis?', a: 'Acute bacterial prostatitis',
          why: 'Gram-negative organisms ascend into the gland and it becomes swollen, warm and tender. Examine gently and once; vigorous massage pushes bacteria into the bloodstream. Get urine and blood cultures and start a fluoroquinolone or TMP-SMX for 2 to 4 weeks, or IV therapy if septic.' },
        { type: 'recall', q: 'Why is prostatic massage avoided in acute bacterial prostatitis?', a: 'It precipitates bacteremia',
          why: 'Squeezing an acutely infected gland forces organisms into the prostatic venous plexus and can cause sepsis. A gentle digital exam to confirm tenderness is enough. Massage for expressed secretions is reserved for chronic prostatitis evaluation.' },
        { type: 'recall', q: 'Man with recurrent urinary infections from the same E. coli strain, with dull perineal ache between episodes. Diagnosis?', a: 'Chronic bacterial prostatitis',
          why: 'The prostate acts as a reservoir that reseeds the bladder after each course of antibiotics. Pain with ejaculation, low back or testicular ache and a normal or mildly tender prostate between flares complete the picture. Fever is absent.' },
        { type: 'recall', q: 'Why do fluoroquinolones treat chronic prostatitis when beta-lactams and nitrofurantoin fail?', a: 'They cross the blood-prostate barrier',
          why: 'In chronic infection the prostatic epithelium is not inflamed, so its lipid barrier is intact and only lipid-soluble zwitterionic drugs reach therapeutic levels inside. Ciprofloxacin or levofloxacin for 4 to 6 weeks cures over 70 percent. TMP-SMX and doxycycline are the second-line alternatives.' },
        { type: 'number', q: 'Duration of fluoroquinolone treatment for chronic bacterial prostatitis?', value: 6, unit: 'weeks',
          why: 'Four to six weeks is needed to sterilize a poorly perfused gland. The 2 to 4 weeks used for acute prostatitis and the 3 to 5 days for cystitis leave chronic infection behind and guarantee another recurrence.' },
        { type: 'multi', q: 'Select the first-line regimens for uncomplicated cystitis in a nonpregnant woman.',
          answers: ['Nitrofurantoin 5 days', 'TMP-SMX 3 days', 'Fosfomycin single dose'],
          distractors: ['Ciprofloxacin 3 days', 'Cephalexin 7 days', 'Amoxicillin 7 days'],
          why: 'These three concentrate in the bladder with little collateral damage. Fluoroquinolones are held in reserve for their tendon, nerve and resistance problems, and oral beta-lactams cure less reliably. TMP-SMX is used only where local E. coli resistance is under 20 percent.' },
        { type: 'recall', q: 'Why is nitrofurantoin not used for pyelonephritis?', a: 'It does not reach therapeutic levels in kidney tissue',
          why: 'Nitrofurantoin is concentrated in the urine but not in the renal parenchyma or blood, so it treats the bladder and nothing above it. It is also avoided when creatinine clearance is under 30, where too little reaches the urine to work.' },
        { type: 'multi', q: 'Select the only two groups who should be screened and treated for asymptomatic bacteriuria.',
          answers: ['Pregnant women', 'Before TURP or lithotripsy'],
          distractors: ['Nursing home residents', 'Patients with diabetes', 'Catheterized patients', 'Women planning pregnancy'],
          why: 'In pregnancy, bacteriuria progresses to pyelonephritis and preterm birth, and before TURP or lithotripsy mucosal bleeding seeds the blood. Everyone else, including older adults, diabetics and catheterized patients, gains nothing and acquires resistant organisms and C. difficile from treatment.' },
        { type: 'recall', q: 'When in pregnancy is screening for asymptomatic bacteriuria done?', a: 'Urine culture at 12 to 16 weeks',
          why: 'A single culture early in the second trimester catches most cases. Treat with cephalexin, amoxicillin-clavulanate, fosfomycin or nitrofurantoin, avoiding nitrofurantoin at term and in G6PD deficiency and TMP-SMX in the first trimester and at term.' },
        { type: 'truefalse', q: 'An 80-year-old nursing home resident with bacteriuria and no urinary symptoms should be treated with antibiotics.', a: false,
          why: 'Half of nursing home residents carry bacteria in the urine, and treating it does not reduce infections, improve function or lengthen life. It does breed resistance. Nonspecific changes such as confusion without urinary symptoms call for a search for other causes, not reflexive antibiotics.' },
        { type: 'bucket', q: 'Sort each feature by the prostatitis it belongs to.', bins: ['Acute', 'Chronic'],
          items: [
            { label: 'High fever and chills', bin: 'Acute' },
            { label: 'Same organism recurring', bin: 'Chronic' },
            { label: 'Exquisitely tender gland', bin: 'Acute' },
            { label: 'Pain after ejaculation', bin: 'Chronic' },
            { label: 'Treat 2 to 4 weeks', bin: 'Acute' },
            { label: 'Treat 4 to 6 weeks', bin: 'Chronic' }
          ],
          why: 'Acute prostatitis is a febrile illness with an inflamed gland that most antibiotics can reach. Chronic prostatitis is an afebrile relapsing infection behind an intact barrier that only fluoroquinolones penetrate well, and it takes longer to clear.' }
      ]
    },

    {
      id: 'nu-bph', subject: 'Nephrology & Urology', topic: 'Male Urology', name: 'BPH & PSA',
      blurb: 'Stepwise BPH drugs and their traps, surgical indications, PSA screening and the newly elevated PSA.',
      cards: [
        { type: 'number', q: 'International Prostate Symptom Score at or above which drug treatment for BPH is started?', value: 8, unit: 'points',
          why: 'Seven or less is mild and gets watchful waiting with behavioral changes: less evening fluid, caffeine and alcohol, double voiding, and avoiding decongestants and anticholinergics. Moderate to severe scores of 8 and above start an alpha blocker.' },
        { type: 'recall', q: 'Why does an alpha-1 blocker relieve BPH symptoms within days regardless of prostate size?', a: 'It relaxes prostate and bladder neck smooth muscle',
          why: 'Alpha-1A receptors in the prostatic stroma, capsule and bladder neck hold the outlet closed. Blocking them opens it immediately, which is why flow improves within days to a few weeks. Nothing shrinks, so the gland size does not matter.' },
        { type: 'recall', q: 'Main side effect of the selective alpha-1A blockers tamsulosin and silodosin?', a: 'Retrograde ejaculation',
          why: 'Their selectivity spares the vasculature, so orthostasis is minimal, but the same receptors drive bladder neck closure during ejaculation. Doxazosin and terazosin are the nonselective ones that lower blood pressure and need bedtime titration for first-dose syncope.' },
        { type: 'recall', q: 'Why ask about planned cataract surgery before starting tamsulosin?', a: 'It causes intraoperative floppy iris syndrome',
          why: 'Alpha blockers, tamsulosin most of all, cause intraoperative floppy iris syndrome, which complicates cataract surgery even years after the drug is stopped. The ophthalmologist needs to know, and starting the drug can wait until after the operation.' },
        { type: 'recall', q: 'Which BPH patients benefit from a 5-alpha-reductase inhibitor?', a: 'Men with an enlarged prostate',
          why: 'Finasteride and dutasteride shrink epithelial volume by 20 to 30 percent by blocking conversion of testosterone to DHT, so they only help when there is bulk to shrink: volume over 30 to 40 mL, palpable enlargement or a PSA above 1.5. They take 3 to 6 months to work and reduce retention and the need for surgery.' },
        { type: 'number', q: 'Months before a 5-alpha-reductase inhibitor improves BPH symptoms?', value: 3, unit: 'months',
          why: 'Shrinking the gland takes three to six months, so patients need an alpha blocker alongside for symptom relief in the meantime. Combination therapy is the choice for severe symptoms with a large prostate.' },
        { type: 'recall', q: 'How is a PSA interpreted in a man taking finasteride for a year?', a: 'Double the measured value',
          why: '5-alpha-reductase inhibitors halve PSA after 6 to 12 months, so a reading of 2.5 represents a true 5. Any rise in PSA while on the drug is suspicious for cancer even if the absolute number looks normal.' },
        { type: 'recall', q: 'Drug for a man with both BPH symptoms and erectile dysfunction?', a: 'Daily tadalafil 5 mg',
          why: 'Low-dose daily tadalafil improves lower urinary tract symptoms and erectile function together. It is never combined with nitrates and is used cautiously with nonselective alpha blockers because of additive hypotension.' },
        { type: 'multi', q: 'Select the absolute indications for BPH surgery.',
          answers: ['Refractory urinary retention', 'Obstructive kidney injury', 'Recurrent urinary infections', 'Recurrent gross hematuria', 'Bladder stones'],
          distractors: ['Nocturia twice a night', 'Prostate volume of 50 mL'],
          why: 'These are the complications of obstruction that drugs cannot undo. Symptoms alone, however bothersome, and gland size alone are relative indications handled with medication first. TURP or holmium laser enucleation are the procedures.' },
        { type: 'recall', q: 'USPSTF recommendation on PSA screening for men aged 55 to 69?', a: 'Individual shared decision-making, grade C',
          why: 'The benefit is a small reduction in prostate cancer deaths against overdiagnosis, biopsy complications and treatment harms, so the decision is the patient\'s after discussion. Screening is recommended against at 70 and older, grade D.' },
        { type: 'number', q: 'Age at and above which the USPSTF recommends against PSA screening?', value: 70, unit: 'years',
          why: 'Beyond 70 the chance of dying of a screen-detected cancer within the remaining lifespan is small and the harms of overdiagnosis dominate. The grade D recommendation applies regardless of health status.' },
        { type: 'recall', q: 'Why does a transgender woman who has had vaginoplasty still need a prostate cancer screening discussion?', a: 'The prostate is not removed',
          why: 'Gender-affirming surgery leaves the prostate in place to avoid incontinence and stricture. Estrogen and antiandrogens shrink it and lower baseline PSA, so digital exam is insensitive and a PSA above 1.0 on estrogen warrants evaluation rather than the usual 4.0.' },
        { type: 'recall', q: 'Next step for an asymptomatic man with a normal rectal exam and a first PSA of 4.6?', a: 'Repeat the PSA in 4 to 8 weeks',
          why: 'A quarter to 40 percent of first elevations between 4 and 10 are normal on repeat, because subclinical prostatitis, recent ejaculation, cycling, retention or a rectal exam raised it. Repeat after 48 hours of abstinence from ejaculation and cycling. Empiric antibiotics for an asymptomatic man are not indicated.' },
        { type: 'truefalse', q: 'An asymptomatic man with a newly elevated PSA should receive a course of antibiotics before the PSA is repeated.', a: false,
          why: 'Treating presumed prostatitis in a man without symptoms exposes him to fluoroquinolone harms and does not improve the accuracy of the repeat test. Simply repeat the PSA in 4 to 8 weeks; if it stays elevated, proceed to multiparametric MRI and biopsy.' },
        { type: 'multi', q: 'Select the transient causes of a raised PSA.',
          answers: ['Ejaculation within 48 hours', 'Vigorous cycling', 'Retention or catheterization', 'Subclinical prostatitis'],
          distractors: ['Finasteride use', 'Low testosterone'],
          why: 'Anything that irritates or compresses the gland leaks PSA into the blood for days. Finasteride lowers PSA rather than raising it, and low testosterone lowers it too. The repeat test in 4 to 8 weeks lets these settle.' }
      ]
    },

    {
      id: 'nu-scrotum', subject: 'Nephrology & Urology', topic: 'Male Urology', name: 'SCROTUM & PRIAPISM',
      blurb: 'Scrotal masses by exam and transillumination, torsion versus epididymitis, testicular cancer and priapism.',
      cards: [
        { type: 'recall', q: 'Nontender bag of worms above the left testis that enlarges with standing and shrinks lying down. Diagnosis?', a: 'Varicocele',
          why: 'Dilated veins of the pampiniform plexus fill when upright and with Valsalva and empty when supine. Eighty-five to ninety percent are left-sided because the left gonadal vein drains at a right angle into the high-pressure renal vein. It does not transilluminate.' },
        { type: 'recall', q: 'Why does a new right-sided varicocele, or one that does not collapse when supine, need abdominal imaging?', a: 'A retroperitoneal mass may be blocking the vein',
          why: 'The right gonadal vein drains obliquely into the vena cava and rarely dilates on its own. A right varicocele or one that stays full lying down points to renal cell carcinoma with tumor thrombus in the renal vein or cava, or another retroperitoneal obstruction. Order CT or ultrasound of the abdomen.' },
        { type: 'recall', q: 'When does a varicocele need treatment rather than reassurance?', a: 'Infertility, adolescent atrophy or refractory pain',
          why: 'The warm venous blood raises scrotal temperature and impairs sperm count and motility, so repair is offered for infertility. An adolescent whose testis is shrinking on that side is also repaired. Otherwise it is benign and left alone.' },
        { type: 'recall', q: 'Smooth painless fluid collection surrounding the front of the testis that transilluminates. Diagnosis?', a: 'Hydrocele',
          why: 'Fluid in the tunica vaginalis glows evenly when a light is held against it, which a solid tumor or a varicocele does not. It is benign and observed; surgery is only for size and discomfort. In infants a communicating hydrocele usually closes by 12 months.' },
        { type: 'recall', q: 'Smooth painless cyst at the head of the epididymis, separate from the testis, that transilluminates. Diagnosis?', a: 'Spermatocele',
          why: 'An epididymal cyst sits above and behind the testis and can be felt apart from it, which is the point that separates it from an intratesticular mass. It is benign, confirmed by ultrasound if there is doubt, and removed only if large and uncomfortable.' },
        { type: 'recall', q: 'Abrupt severe scrotal pain with vomiting, a high-riding transverse testis and an absent cremasteric reflex. Diagnosis?', a: 'Testicular torsion',
          why: 'The spermatic cord twists and cuts off the blood supply, so the testis retracts and lies horizontally and the reflex that depends on an intact cord is lost. Elevating the scrotum does not relieve the pain. Salvage falls sharply after 6 hours.' },
        { type: 'recall', q: 'Why is surgical exploration not delayed for Doppler ultrasound when torsion is clinically likely?', a: 'The testis dies within about 6 hours',
          why: 'Every hour of ischemia lowers the salvage rate, and a scan that takes an hour to arrange can cost the organ. Exploration with detorsion and bilateral orchiopexy is done on clinical grounds. Ultrasound is for equivocal cases only.' },
        { type: 'recall', q: 'Why is the other testis fixed at the time of surgery for torsion?', a: 'The bell-clapper deformity is usually bilateral',
          why: 'The anatomic variant that lets the testis hang free and twist is present on both sides in most patients, so the contralateral testis is at the same risk. Bilateral orchiopexy prevents a second emergency.' },
        { type: 'recall', q: 'Gradual posterior scrotal pain with dysuria, intact cremasteric reflex and relief on lifting the scrotum. Diagnosis?', a: 'Epididymitis',
          why: 'Infection ascends to the epididymis over hours to days rather than minutes, the cord is intact so the reflex is kept, and elevation relieves the pain, the positive Prehn sign. Under 35 the cause is chlamydia or gonorrhea; over 35 it is usually enteric E. coli.' },
        { type: 'recall', q: 'Treatment for epididymitis in a sexually active 24-year-old?', a: 'IM ceftriaxone 500 mg plus doxycycline for 10 days',
          why: 'Chlamydia and gonorrhea are the organisms in younger men, and this combination covers both. Over 35, or after instrumentation, coliforms dominate and oral levofloxacin for 10 days is used instead. Partners of young men are treated too.' },
        { type: 'recall', q: 'Firm painless mass within the testis of a 25-year-old that does not transilluminate. Diagnosis until proven otherwise?', a: 'Testicular cancer',
          why: 'A solid intratesticular mass in a man of 15 to 35 is a germ cell tumor until ultrasound and markers say otherwise. Cryptorchidism is the main risk factor, even after orchiopexy. Order scrotal ultrasound, AFP, beta-hCG and LDH, then CT of the chest, abdomen and pelvis.' },
        { type: 'recall', q: 'Why is a suspected testicular cancer removed through the groin rather than biopsied through the scrotum?', a: 'A scrotal incision seeds the scrotal lymphatics',
          why: 'The testis drains to the retroperitoneal nodes, but the scrotal skin drains to the inguinal nodes. Cutting through the scrotum opens a second lymphatic pathway and changes the staging and treatment field. Radical inguinal orchiectomy is both diagnosis and treatment.' },
        { type: 'recall', q: 'Which testicular tumor marker is never raised by a pure seminoma?', a: 'Alpha-fetoprotein',
          why: 'AFP comes from yolk sac elements, which seminomas do not contain. An elevated AFP means a nonseminomatous component is present, whatever the pathology report says. Beta-hCG can be mildly raised in seminoma and LDH tracks tumor bulk.' },
        { type: 'recall', q: 'Painful erection over 4 hours, rigid corpora and a soft glans, in a patient with sickle cell disease. Diagnosis?', a: 'Ischemic priapism',
          why: 'Sickled cells sludge in the cavernosal sinusoids and block venous outflow, so the corpora cavernosa are rigid and tender while the spongiosum and glans stay soft. Sickle cell accounts for most pediatric cases. Trazodone, antipsychotics, prazosin and intracavernosal injections are the drug causes.' },
        { type: 'recall', q: 'Why is ischemic priapism a urologic emergency?', a: 'It is a compartment syndrome of the penis',
          why: 'Trapped blood becomes hypoxic and acidotic, and beyond 4 to 6 hours the cavernosal smooth muscle dies and fibroses. Over 90 percent of men untreated past 24 hours are left permanently impotent. Corporal blood gas shows dark blood with a low oxygen and a pH under 7.25.' },
        { type: 'recall', q: 'First-line treatment for ischemic priapism?', a: 'Corporal aspiration and intracavernosal phenylephrine',
          why: 'After a dorsal penile nerve block, stagnant blood is aspirated and diluted phenylephrine is injected to constrict the arterial inflow and let the corpora drain. This is first line even in sickle cell disease, alongside fluids and analgesia; exchange transfusion is ineffective and must not delay decompression.' },
        { type: 'recall', q: 'Painless partly rigid erection after a straddle injury, bright red blood on corporal aspiration. Diagnosis?', a: 'Nonischemic high-flow priapism',
          why: 'Perineal trauma tears a cavernosal artery and creates a fistula that floods the corpora with oxygenated blood. There is no ischemia, so it is not an emergency and often resolves on its own or with selective arterial embolization. The blood gas is arterial, with a pH near 7.40.' },
        { type: 'bucket', q: 'Sort each scrotal finding by the diagnosis it points to.', bins: ['Torsion', 'Epididymitis'],
          items: [
            { label: 'Pain began minutes ago', bin: 'Torsion' },
            { label: 'Pain built over two days', bin: 'Epididymitis' },
            { label: 'Absent cremasteric reflex', bin: 'Torsion' },
            { label: 'Relief with scrotal elevation', bin: 'Epididymitis' },
            { label: 'High transverse testis', bin: 'Torsion' },
            { label: 'Dysuria and discharge', bin: 'Epididymitis' }
          ],
          why: 'Speed of onset and the cremasteric reflex do most of the work. A twisted cord stops the reflex and lifts the testis within minutes; an infected epididymis keeps the reflex, comes on slowly and feels better when supported. One goes to the operating room and the other to the pharmacy.' },
        { type: 'bucket', q: 'Sort each scrotal mass by whether it transilluminates.', bins: ['Transilluminates', 'Does not'],
          items: [
            { label: 'Hydrocele', bin: 'Transilluminates' },
            { label: 'Testicular tumor', bin: 'Does not' },
            { label: 'Spermatocele', bin: 'Transilluminates' },
            { label: 'Varicocele', bin: 'Does not' }
          ],
          why: 'Light passes through fluid and not through solid tissue or blood. The two cysts glow; the tumor and the tangle of veins do not. A mass that fails to transilluminate and sits inside the testis gets an ultrasound the same day.' }
      ]
    },

    {
      id: 'afp-htn-def', collection: 'Journal Articles', subject: 'Hypertension', topic: 'Severe Hypertension · AFP 2026', name: 'DEFINITIONS & RISK',
      blurb: 'Gauer, Rifaat and Blankinship, Am Fam Physician 2026;113(5):459-468. What severe hypertension is, how common it is, and what it does and does not do.',
      cards: [
        { type: 'recall', q: 'Term the American Heart Association now uses instead of hypertensive urgency?', a: 'Severe hypertension',
          why: 'The old word implied something had to be done at once, and the evidence says it does not. Severe hypertension is a blood pressure of 180/110 to 120 or higher with no new or worsening target organ damage, and its short-term risk is low whatever you do.' },
        { type: 'recall', q: 'Finding that turns severe hypertension into a hypertensive emergency?', a: 'New or worsening target organ damage',
          why: 'The number is the same in both. What differs is a rising creatinine, new proteinuria, retinopathy, pulmonary edema, chest pain, neurologic change or encephalopathy. An emergency needs intravenous therapy in intensive care; severe hypertension needs an oral plan and follow-up.' },
        { type: 'number', q: 'Systolic blood pressure at or above which hypertension is called severe?', value: 180, unit: 'mm Hg',
          why: 'With a diastolic of 110 to 120 or more, depending on the guideline. The AHA and NICE use 180/120, the European societies 180/110, and the emergency physicians 160/100. In a previously normotensive patient, organ damage can appear below these numbers.' },
        { type: 'number', q: 'Share of adults with known hypertension who have had a reading of 180/120 or higher?', value: 13, unit: '%',
          why: 'In a cohort of over 200,000 patients, 13.1 percent reached that level at least once. Most of those readings were in the clinic (43 percent), then on the wards (31 percent) and in the emergency department (26 percent). It is a common event, not a rare crisis.' },
        { type: 'recall', q: 'Where were most severe blood pressure readings recorded in the large cohort study?', a: 'Outpatient clinic visits',
          why: 'Forty-three percent in clinic against 31 percent inpatient and 26 percent in the emergency department, which is why the outpatient approach matters most. Risk factors were age 45 to 64, Black race, self-pay or unknown insurance, multiple antihypertensive prescriptions and frequent visits.' },
        { type: 'number', q: 'Six-month rate of cardiovascular events after severe hypertension without target organ damage?', value: 0.9, unit: '%',
          why: 'Below one percent in both emergency department and office cohorts, and the same whether the patient was treated, referred or sent home. That figure is the basis for the whole article: the pressure is a chronic risk, not an acute threat.' },
        { type: 'number', q: 'Share of emergency department patients whose severe blood pressure fell to 160/89 after 30 minutes of seated rest?', value: 32, unit: '%',
          why: 'From a mean of 188/103, with no drug given. A third of severe readings are the stress of the visit. Rest and remeasure before any decision.' },
        { type: 'truefalse', q: 'Severe hypertension without target organ damage usually progresses to a hypertensive emergency during a hospital stay.', a: false,
          why: 'Studies of inpatients show it typically does not, and short admissions with persistently high pressure do not raise long-term cardiovascular risk. The fear of progression drives most reflexive treatment, and the data do not support it.' },
        { type: 'multi', q: 'Select the findings that count as target organ damage in severe hypertension.',
          answers: ['Rising creatinine', 'New proteinuria', 'Hypertensive retinopathy', 'Pulmonary edema', 'New neurologic symptoms'],
          distractors: ['Headache alone', 'Dizziness'],
          why: 'Organ damage means the kidney, eye, heart or brain is being injured now. Headache, dizziness, dyspnea and nonanginal chest pain are reported by a minority of patients with severe hypertension and do not by themselves mean damage; they call for an exam, not a drip.' },
        { type: 'number', ctx: 'Severe HTN · no organ damage', q: 'Share of patients who report dizziness, the commonest symptom?', value: 12, unit: '%',
          why: 'Dizziness leads at 12 percent, with headache and dyspnea at about 8 percent each and nonanginal chest pain at 5. These symptoms are common and nonspecific; what matters is whether examination and, when indicated, testing show organ injury.' },
        { type: 'number', ctx: 'Severe HTN · no organ damage', q: 'Share of patients who report headache?', value: 8, unit: '%',
          why: 'Headache is not a sign of target organ damage on its own. Encephalopathy, with confusion, seizures or visual change, is what would make a headache part of an emergency.' },
        { type: 'number', ctx: 'Severe HTN · no organ damage', q: 'Share of patients who report dyspnea?', value: 8, unit: '%',
          why: 'Dyspnea is a symptom to examine, not a verdict. Pulmonary edema on examination or chest film would make it organ damage; breathlessness from anxiety or deconditioning does not.' },
        { type: 'number', ctx: 'Severe HTN · no organ damage', q: 'Share of patients who report nonanginal chest pain?', value: 5, unit: '%',
          why: 'Chest pain that is not anginal in character is reported by one in twenty. Anginal pain or electrocardiographic change would move the patient into the emergency pathway.' }
      ]
    },

    {
      id: 'afp-htn-measure', collection: 'Journal Articles', subject: 'Hypertension', topic: 'Severe Hypertension · AFP 2026', name: 'MEASURING IT RIGHT',
      blurb: 'Before anything else: was the number real? Technique, devices, rest, and out-of-office monitoring.',
      cards: [
        { type: 'recall', q: 'Which office method tracks ambulatory blood pressure more closely, manual auscultation or an automated device?', a: 'Automated device',
          why: 'Automated office measurement removes observer bias and digit preference and comes closer to the ambulatory value, so the 2025 AHA/ACC guideline accepts it as a reasonable alternative. Manual auscultation stays the reference when an arrhythmia is suspected, because it follows beat-to-beat variation.' },
        { type: 'recall', q: 'When is manual auscultation preferred over an automated cuff?', a: 'When an arrhythmia is suspected',
          why: 'Oscillometric devices average irregular beats poorly. Palpate the pulse first; if it is irregular, auscultate and consider an electrocardiogram.' },
        { type: 'number', q: 'Minimum minutes of seated rest before a blood pressure is measured?', value: 5, unit: 'min',
          why: 'Back supported, legs uncrossed, bladder empty, arm supported at heart level, and no talking. No exercise, caffeine, energy drinks or nicotine for 30 minutes beforehand. Each omission adds a few millimeters, and together they manufacture severe readings.' },
        { type: 'number', q: 'Minimum number of readings to take, 1 to 2 minutes apart, averaging the last two?', value: 3, unit: 'readings',
          why: 'If readings differ by more than 10 mm Hg, take more. The first reading is usually the highest and is discarded from the average.' },
        { type: 'number', q: 'Recommended rest before remeasuring a markedly elevated reading in an asymptomatic patient?', value: 30, unit: 'min',
          why: 'Thirty minutes of quiet rest, or remeasurement at the end of the visit, settles a third of severe readings without any drug. Only the resting value should drive a decision.' },
        { type: 'recall', q: 'Why is the initial blood pressure measured in both arms?', a: 'A big gap means coarctation or subclavian stenosis',
          why: 'Use the higher arm thereafter. Avoid an arm with an arteriovenous fistula or prior axillary node dissection.' },
        { type: 'recall', q: 'Cuff bladder length as a share of arm circumference?', a: '75 to 100 percent',
          why: 'And a width of 37 to 50 percent. A cuff too small for the arm reads high, and large arms are the commonest reason for a falsely severe office pressure.' },
        { type: 'number', q: 'How much higher is systolic pressure measured supine than seated, at the top of the range?', value: 10, unit: 'mm Hg',
          why: 'Three to ten systolic and one to five diastolic. Inpatients are measured lying down for consistency, so a ward reading is not directly comparable with the clinic value that set the diagnosis.' },
        { type: 'recall', q: 'Recommended way to evaluate a patient with newly found severe hypertension for white coat effect?', a: 'Home or ambulatory blood pressure monitoring',
          why: 'White coat hypertension is present in about 13 percent of office patients, and masked hypertension hides in the other direction. Out-of-office readings decide whether the pressure is sustained before a drug is started or escalated. Both home and 24-hour ambulatory monitoring are accepted.' },
        { type: 'number', q: 'Prevalence of white coat hypertension in the office setting?', value: 13, unit: '%',
          why: 'One in eight severe office readings is not sustained outside the room. Treating it exposes the patient to hypotension and drug harm for no benefit, which is why out-of-office monitoring is a grade C recommendation in the article.' }
      ]
    },

    {
      id: 'afp-htn-causes', collection: 'Journal Articles', subject: 'Hypertension', topic: 'Severe Hypertension · AFP 2026', name: 'CAUSES & WORKUP',
      blurb: 'What pushes pressure up, when to look for a secondary cause, and why routine testing is not indicated.',
      cards: [
        { type: 'recall', q: 'Most common cause of severe hypertension in the outpatient setting?', a: 'Nonadherence to antihypertensive therapy',
          why: 'A meta-analysis found 37 percent of hypertensive patients nonadherent, and over half of those labeled resistant. Reinitiating or increasing the home regimen and asking about barriers fixes more severe hypertension than any new drug.' },
        { type: 'number', q: 'Share of patients with resistant hypertension who are nonadherent to their medications?', value: 50, unit: '%',
          why: 'More than half, against 37 percent of hypertensive patients overall. Before calling hypertension resistant, confirm the pills are being taken, by pill counts, pharmacy fills or directly observed dosing.' },
        { type: 'recall', q: 'Definition of resistant hypertension?', a: 'Uncontrolled on 3 drugs with a diuretic, or needing 4',
          why: 'The three must be at maximally tolerated doses. The outpatient algorithm adds a mineralocorticoid receptor antagonist at that point and screens for secondary causes.' },
        { type: 'multi', q: 'Select the transient triggers of severe blood pressure in a hospitalized patient.',
          answers: ['Pain', 'Anxiety', 'Urinary retention', 'Volume overload', 'Withheld home medications'],
          distractors: ['Pheochromocytoma', 'Renal artery stenosis'],
          why: 'Catecholamine and cortisol surges from pain, nausea, anxiety or a full bladder, hypervolemia from fluids or kidney failure, and a home regimen that was never restarted explain most inpatient spikes. Manage the trigger and remeasure before reaching for a drug. Secondary causes are chronic, not transient.' },
        { type: 'multi', q: 'Select the medications that raise blood pressure.',
          answers: ['NSAIDs', 'Decongestants', 'Oral contraceptives', 'Steroids', 'Erythropoietin'],
          distractors: ['Metformin', 'Atorvastatin'],
          why: 'Also stimulants, calcineurin inhibitors, tyrosine kinase inhibitors, bevacizumab, monoamine oxidase inhibitors and some antidepressants, and herbal products such as ma huang and St. John\'s wort. The inpatient algorithm asks whether any of these can be stopped before adding an antihypertensive.' },
        { type: 'multi', q: 'Select the drugs whose withdrawal causes rebound severe hypertension.',
          answers: ['Clonidine', 'Beta blockers', 'Alcohol', 'Tizanidine'],
          distractors: ['Amlodipine', 'Lisinopril', 'Hydrochlorothiazide'],
          why: 'Central alpha agonists, beta blockers, alpha-1 blockers such as prazosin, methyldopa, sedative hypnotics and alcohol all produce a sympathetic surge when stopped abruptly. Admission is when home doses get missed, so ask what was not given.' },
        { type: 'recall', q: 'Most common secondary cause of hypertension by prevalence?', a: 'Obstructive sleep apnea',
          why: 'Present in 25 to 50 percent of patients with secondary hypertension, ahead of primary aldosteronism at 8 to 20 percent and renovascular disease at 5 to 34 percent. Drugs and alcohol account for 2 to 4 percent and kidney parenchymal disease 1 to 2 percent.' },
        { type: 'recall', q: 'Second most common secondary cause of hypertension?', a: 'Primary aldosteronism',
          why: 'Eight to twenty percent, and it is the one most often missed because the potassium is usually normal. Screen with an aldosterone to renin ratio in resistant hypertension, hypokalemia, an adrenal mass or sleep apnea.' },
        { type: 'number', q: 'Prevalence of pheochromocytoma or paraganglioma among secondary causes of hypertension, at the top of the range?', value: 0.6, unit: '%',
          why: 'Zero point one to zero point six percent. Hyperthyroidism is under 1 percent, coarctation 0.1 percent and Cushing syndrome under 0.1 percent. The rare causes are the memorable ones, but sleep apnea, aldosteronism and renovascular disease are what you will actually find.' },
        { type: 'multi', q: 'Select the features that prompt screening for secondary hypertension.',
          answers: ['Onset before age 30', 'Resistant hypertension', 'Abrupt onset or worsening', 'Disproportionate organ damage', 'Abdominal bruit'],
          distractors: ['A single severe reading', 'Age over 65 with gradual onset'],
          why: 'Also a family history of early hypertension or stroke and features of sleep apnea. Severe hypertension on its own is not a trigger; most of it is essential hypertension off its medication.' },
        { type: 'truefalse', q: 'Asymptomatic severe hypertension needs a metabolic panel, ECG and urinalysis before disposition.', a: false,
          why: 'A grade C recommendation against routine testing. In an emergency department study, panels, electrocardiograms, troponins and urinalyses were ordered in a quarter of patients and changed neither management nor 30-day cardiovascular events. Test when there is suspicion of organ damage, a secondary cause, or for a new diagnosis per guideline.' },
        { type: 'multi', q: 'Select the evaluation when hypertensive emergency is a real consideration.',
          answers: ['Basic metabolic panel', 'Complete blood count', 'Chest radiograph', '12-lead electrocardiogram', 'Funduscopic examination'],
          distractors: ['Renal artery duplex', 'Plasma metanephrines'],
          why: 'These look for the organ damage that would change the disposition: kidney injury, hemolysis, pulmonary edema, ischemia, retinopathy. Funduscopy is recommended and done in only 21 to 45 percent of patients. The secondary-cause workup is a separate, later question.' }
      ]
    },

    {
      id: 'afp-htn-inpt', collection: 'Journal Articles', subject: 'Hypertension', topic: 'Severe Hypertension · AFP 2026', name: 'IN THE HOSPITAL',
      blurb: 'The evidence that treating asymptomatic severe hypertension on the ward does harm, and what to do instead.',
      cards: [
        { type: 'number', q: 'Share of hospitalized patients who have hypertension?', value: 50, unit: '%',
          why: 'Fifty to seventy-two percent, and about 10 percent of patients admitted for something else develop a severe reading during the stay. It is the most common abnormal vital sign on the ward, and most of it is the illness, the pain and the missed pills.' },
        { type: 'number', q: 'Share of untreated inpatients whose severe blood pressure fell below 140/90 within 3 hours on its own?', value: 44, unit: '%',
          why: 'In a cohort of nearly 13,000 patients given no antihypertensive. Another study found a spontaneous drop of about 20 mm Hg. Any drug given in that window gets the credit for a fall that was coming anyway, and adds its own dip on top.' },
        { type: 'multi', q: 'Select the harms associated with treating asymptomatic severe hypertension in inpatients.',
          answers: ['Acute kidney injury', 'Stroke', 'Myocardial infarction', 'Hypotension', 'Longer stay'],
          distractors: ['Fewer readmissions', 'Lower mortality'],
          why: 'Multiple cohorts, grade B. Treated patients had more kidney injury, more cardiovascular events, more hypotension, longer admissions, more readmissions and higher mortality, with no short-term benefit to set against them. Gradual reduction over days to weeks is the recommendation.' },
        { type: 'number', ctx: 'VA inpatient cohort', q: 'By what percent did as-needed blood pressure drugs raise acute kidney injury risk over scheduled dosing?', value: 23, unit: '%',
          why: 'Adjusted hazard ratio 1.23 against scheduled medication, with a 2.9-fold relative risk of myocardial infarction, 2-fold of stroke and 1.5-fold of death. As-needed orders are how the harm reaches the patient: the nurse treats a number at 3 a.m. with no one examining the patient.' },
        { type: 'number', q: 'Share of inpatients given IV antihypertensives whose blood pressure fell by 25 percent or more within 6 hours?', value: 33, unit: '%',
          why: 'A fall of that size in a patient whose vessels are adapted to high pressure is what causes the strokes and kidney injury. Labetalol, metoprolol and hydralazine boluses produced it, along with bradycardia and the need for fluid resuscitation.' },
        { type: 'recall', q: 'Why is lowering blood pressure during a short admission unlikely to achieve anything?', a: 'Onset in 24 to 48 hours, full effect in 2 to 4 weeks',
          why: 'Every major class behaves this way. A dose started on Tuesday has not done its work by discharge on Thursday, so the pressure at discharge says nothing about the regimen, and a dose titrated to it will overshoot at home.' },
        { type: 'recall', q: 'First thing to look for when a ward patient has a severe reading and no organ damage?', a: 'A contributing factor such as pain or missed home drugs',
          why: 'The algorithm goes: organ damage? contributing factor? offending inpatient drug? home medication withheld? Then monitor 2 to 6 hours. Only after all that does oral titration come up, and only for previous severe hypertension or high cardiovascular risk.' },
        { type: 'number', ctx: 'Inpatients given as-needed IV drugs', q: 'What share had their home blood pressure drugs stopped on admission?', value: 41, unit: '%',
          why: 'The commonest fixable cause. Home antihypertensives continue through admission unless there is an absolute contraindication such as bowel obstruction, intractable vomiting, altered mental status or gastrointestinal surgery. Nothing-by-mouth for a test still allows tablets with sips of water.' },
        { type: 'truefalse', q: 'A patient who is nothing-by-mouth for a morning procedure should have antihypertensives held.', a: false,
          why: 'Tablets with small sips of water are permitted for medical tests and minor procedures. Holding the regimen is one of the main reasons the pressure climbs and the as-needed order gets triggered.' },
        { type: 'recall', q: 'How many hours should blood pressure be monitored after contributing factors are managed before any drug decision?', a: '2 to 6 hours',
          why: 'Most severe readings settle in that window without treatment. If the pressure is 180/110 or less by then, no antihypertensive is required.' },
        { type: 'recall', q: 'Blood pressure target if oral medication is used for severe hypertension in hospital?', a: 'A 10 to 15 percent reduction in the first 24 hours',
          why: 'Then gradual further reduction over days to weeks. Even that is preferably deferred: if close follow-up is available, the article prefers not to titrate at all and to rely on home monitoring instead.' },
        { type: 'multi', q: 'Select the inpatient situations with their own, stricter blood pressure targets.',
          answers: ['After coronary artery bypass', 'After stroke fibrinolysis', 'Decompensated heart failure', 'After vascular or brain surgery', 'High-risk aortic aneurysm'],
          distractors: ['Pneumonia', 'Cellulitis'],
          why: 'These are the exceptions where severe pressure threatens a fresh graft, a suture line, a clot or an aneurysm wall, and where oral titration is reasonable. Evidence-based thresholds are thin even here. Everyone else gets the watch-and-correct approach.' },
        { type: 'recall', q: 'Why does discharging an older patient on a new or higher antihypertensive dose do harm?', a: 'More readmissions and harm, no better control',
          why: 'A 2019 cohort of patients 65 and older showed higher 30-day readmission and adverse events after discharge intensification, with no improvement in blood pressure control or major cardiovascular events. The ward pressure was never the right number to titrate to.' },
        { type: 'number', q: 'Follow-up interval after discharge with elevated blood pressure that reduces 30-day readmission?', value: 2, unit: 'weeks',
          why: 'Within one to two weeks. Best practice at discharge is to document the severe hypertension, continue the prehospital regimen, reinforce adherence, advise home monitoring and book the visit, rather than to change the drugs.' }
      ]
    },

    {
      id: 'afp-htn-outpt', collection: 'Journal Articles', subject: 'Hypertension', topic: 'Severe Hypertension · AFP 2026', name: 'IN THE OFFICE',
      blurb: 'The outpatient algorithm: do not send them to the emergency department, find the cause, treat chronically.',
      cards: [
        { type: 'truefalse', q: 'A patient at 190/115 with no sign of target organ damage should be referred to the emergency department.', a: false,
          why: 'Grade C against referral. In a cohort of 58,535 office patients at 180/110 or more, only 0.7 percent were referred, and propensity matching showed no difference in major adverse cardiovascular events at 7 days, 30 days or 6 months between those sent home and those sent in. Referral adds cost and a dose of something short-acting.' },
        { type: 'number', q: 'Share of office patients with severe hypertension who were referred to the hospital in the large cohort?', value: 0.7, unit: '%',
          why: 'Of 58,535 patients, 426 were referred and 61 admitted. Outcomes were the same as for the 58,109 sent home. The number says what experienced clinicians already do with asymptomatic severe pressure.' },
        { type: 'number', ctx: 'Severe HTN · outpatient', q: 'Share of clinic patients with a blood pressure of 180/110 or higher?', value: 4.6, unit: '%',
          why: 'Seventy-three percent of those patients already carried a diagnosis of hypertension. The rest are new diagnoses, which need out-of-office confirmation and guideline-directed baseline testing rather than urgent treatment.' },
        { type: 'number', q: 'Share of emergency department patients with severe hypertension still uncontrolled one month later?', value: 80, unit: '%',
          why: 'More than 80 percent, whether they were given a one-time dose, a new prescription or nothing. Fifty-nine percent got a dose in the department and 83 percent went home with no change to their regimen. The visit treats a number; control comes from what happens afterwards.' },
        { type: 'recall', q: 'First management step for asymptomatic severe hypertension in a patient already on treatment?', a: 'Ask about adherence',
          why: 'If nonadherent, address the barriers; if adherent, titrate toward goal. Either way, home monitoring follows, and review happens at one-month intervals until controlled, since each change takes two to four weeks to show its full effect.' },
        { type: 'recall', q: 'Follow-up interval for dose adjustments in outpatient severe hypertension?', a: 'Every month until controlled',
          why: 'Monthly visits check safety, effect and the need for the next step. Checking sooner titrates to a drug that has not finished working; checking later leaves months of uncontrolled pressure.' },
        { type: 'recall', q: 'How many antihypertensive agents does initial treatment of severe hypertension usually need?', a: 'At least two',
          why: 'Each class at standard dose lowers pressure by about 12 to 16 over 8 to 12 mm Hg, and the effects of different classes add. A patient at 180/110 is 50 mm Hg from goal, which no single agent reaches.' },
        { type: 'number', q: 'Expected systolic reduction from one antihypertensive class at standard dose, at the top of the range?', value: 16, unit: 'mm Hg',
          why: 'Twelve to sixteen systolic and eight to twelve diastolic. That arithmetic is why combination therapy is the rule in severe hypertension and why a single pill added in the emergency department changes nothing by the follow-up visit.' },
        { type: 'number', q: 'Systolic reduction from a healthy dietary pattern such as DASH?', value: 11, unit: 'mm Hg',
          why: 'The largest single lifestyle effect in the article. Sodium restriction to 1,500 mg a day gives about 5, 150 minutes of weekly activity about 5, limiting alcohol about 4, and weight loss about 1 mm Hg per kilogram.' },
        { type: 'number', q: 'Systolic reduction per kilogram of weight lost?', value: 1, unit: 'mm Hg',
          why: 'Ten kilograms is a drug\'s worth of reduction. Diet, sodium, activity and alcohol add to it, and together the lifestyle measures can rival a second agent.' },
        { type: 'number', q: 'Daily sodium limit that lowers systolic pressure by about 5 mm Hg?', value: 1500, unit: 'mg',
          why: 'Most patients eat two to three times that. Sodium restriction is listed alongside the drugs in the article because high intake is one of the contributing factors behind severe readings.' },
        { type: 'recall', q: 'Drug added when hypertension stays uncontrolled on three agents including a diuretic, with adherence confirmed?', a: 'Spironolactone',
          why: 'That is the resistant hypertension branch of the outpatient algorithm, and a mineralocorticoid receptor antagonist is the fourth drug with the best evidence. Confirm adherence first: more than half of patients labeled resistant are not taking their pills.' },
        { type: 'recall', q: 'Besides a fourth drug, what does confirmed resistant hypertension trigger in the outpatient algorithm?', a: 'Screening for secondary hypertension',
          why: 'Resistance sits alongside onset under 30, abrupt worsening, an abdominal bruit, features of sleep apnea and disproportionate organ damage as the reasons to look for sleep apnea, aldosteronism, renovascular disease and kidney disease.' },
        { type: 'recall', q: 'Why does the 2025 ACEP policy now allow starting antihypertensive therapy in the emergency department?', a: 'Most patients leave uncontrolled and stay that way',
          why: 'The policy supports considering initiation for asymptomatic elevated pressure, since 80 percent are uncontrolled a month later. It stops short of recommending it, because the trials to show which patients benefit and how follow-up should work have not been done.' }
      ]
    },

    {
      id: 'afp-htn23-dx', collection: 'Journal Articles', subject: 'Hypertension', topic: 'Hypertension in Adults · AFP 2023', name: 'SCREENING & DIAGNOSIS',
      blurb: 'Clarke, Am Fam Physician 2023;108:352-359 (October 2023). Who to screen, how to measure, and how the guidelines stage it.',
      cards: [
        { type: 'recall', q: 'USPSTF grade for screening adults 18 and older for hypertension with office blood pressure?', a: 'A',
          why: 'Screening is one of the best-supported preventive services because treatment reduces coronary disease, infarction, heart failure, stroke and kidney disease. The office reading starts the process; the diagnosis is confirmed outside the office.' },
        { type: 'number', q: 'Blood pressure above which cardiovascular risk begins rising in a straight line?', values: [110, 75], join: '/', unit: 'mm Hg',
          why: 'There is no threshold below the diagnostic cut-offs where risk flattens; it climbs with every increment above 110/75 and compounds with other risk factors. Diagnostic thresholds are where treatment pays, not where harm begins.' },
        { type: 'number', q: 'Minimum share of the arm circumference the cuff bladder should encircle?', value: 80, unit: '%',
          why: 'A cuff that is too small overestimates pressure, and large arms are the commonest reason a healthy patient leaves with a diagnosis. Feet on the floor, back supported, arm at heart level, five minutes of quiet rest, and two or three readings one to two minutes apart.' },
        { type: 'number', q: 'Minimum number of separate visits over which office readings are averaged to diagnose hypertension?', value: 3, unit: 'visits',
          why: 'Unless the pressure exceeds 180/110, or 160/100 with evidence of end-organ damage, in which case the diagnosis is made at once. Averaging across visits removes the day-to-day swing that a single reading cannot.' },
        { type: 'recall', q: 'What should confirm an office diagnosis of hypertension before medication is started?', a: 'Home or 24-hour ambulatory monitoring',
          why: 'A grade A recommendation. Out-of-office readings typically run 5 to 10 mm Hg lower than office readings, and up to a fifth of patients with high office pressure have normal pressure elsewhere.' },
        { type: 'number', q: 'Share of patients with high office blood pressure who have normal ambulatory pressure?', value: 20, unit: '%',
          why: 'Up to one in five has white coat hypertension. Treating them means years of medication, side effects and cost for a condition they do not have, which is why confirmation outside the office comes before the prescription.' },
        { type: 'number', q: 'Office blood pressure at or above which the 2017 ACC/AHA guideline diagnoses stage 1 hypertension?', values: [130, 80], join: '/', unit: 'mm Hg',
          why: 'Stage 2 is 140/90 or higher. The older JNC thresholds were 140/90 for stage 1 and 160/100 for stage 2, and the International Society of Hypertension kept 140/90 in the office with 135/85 at home. The lower ACC/AHA threshold reclassified millions as hypertensive overnight.' },
        { type: 'number', q: 'Office blood pressure at or above which the JNC and ISH guidelines diagnose stage 2 hypertension?', values: [160, 100], join: '/', unit: 'mm Hg',
          why: 'Against 140/90 for stage 2 under ACC/AHA. The same patient can be stage 1 by one guideline and stage 2 by another, which matters because stage 2 is where initial two-drug therapy is recommended.' },
        { type: 'number', q: 'Home blood pressure at or above which the ISH diagnoses hypertension?', values: [135, 85], join: '/', unit: 'mm Hg',
          why: 'Home readings are lower than office readings, so the home threshold is lower too. The 24-hour ambulatory threshold is 130/80 under ISH and 125/75 under ACC/AHA, with a daytime average of 135/85 or 130/80 respectively.' },
        { type: 'number', q: 'How much more often does hypertension affect Black adults than White adults in the United States, at least?', value: 30, unit: '%',
          why: 'The disparity is largest among women. Access to care and social determinants of health explain much of it. Overall prevalence runs 32 to 46 percent of adults depending on the threshold used, and rises with age.' }
      ]
    },

    {
      id: 'afp-htn23-eval', collection: 'Journal Articles', subject: 'Hypertension', topic: 'Hypertension in Adults · AFP 2023', name: 'INITIAL EVALUATION',
      blurb: 'What the first visit after diagnosis is for: complications, comorbid risk, secondary causes, and the baseline tests.',
      cards: [
        { type: 'recall', q: 'What is the first evaluation of a newly diagnosed hypertensive patient meant to find?', a: 'Complications and comorbid cardiovascular risk',
          why: 'The history covers personal and family cardiovascular disease, diabetes, lipids, prior treatment, diet, salt, exercise, sleep, alcohol, tobacco and stimulants. The examination looks for cardiac, pulmonary, neurologic, visual, renal and peripheral vascular signs.' },
        { type: 'multi', q: 'Select the recommended initial laboratory tests for a new diagnosis of hypertension.',
          answers: ['12-lead electrocardiogram', 'Lipid panel', 'Serum creatinine and GFR', 'Serum potassium', 'Urine albumin-creatinine ratio'],
          distractors: ['Echocardiogram', 'Aldosterone-to-renin ratio'],
          why: 'The full list is electrocardiogram, glucose, hematocrit, lipids, calcium, creatinine with GFR, potassium, and urine albumin or urinalysis. Together they find diabetes, kidney disease, hypertrophy and the low potassium or high calcium that hint at a secondary cause. Echocardiography and endocrine testing wait for a reason.' },
        { type: 'recall', q: 'Why is serum calcium on the initial hypertension panel?', a: 'To pick up primary hyperparathyroidism',
          why: 'Hypercalcemia is an uncommon but treatable contributor, and the test is cheap and already drawn with the metabolic panel. Potassium plays the same role for primary aldosteronism, though it is often normal.' },
        { type: 'multi', q: 'Select the common secondary causes of hypertension to consider at the initial evaluation.',
          answers: ['Obstructive sleep apnea', 'Primary aldosteronism', 'Renovascular disease', 'Renal parenchymal disease', 'Alcohol or illicit drug use'],
          distractors: ['Pheochromocytoma', 'Cushing syndrome'],
          why: 'These five account for nearly all secondary hypertension. Pheochromocytoma and Cushing syndrome are rare and are sought when the picture points to them. Suspicion is highest in patients under 30 and in those with markedly elevated pressure.' },
        { type: 'recall', q: 'Age range for which the ASCVD Risk Estimator applies in patients without known cardiovascular disease?', a: '20 to 79 years',
          why: 'The estimate feeds the ACC/AHA treatment threshold and target, since a 10-year risk of 10 percent or more lowers both. It is a starting point for shared decision-making rather than a verdict.' },
        { type: 'multi', q: 'Select the groups in which the ASCVD risk calculators overestimate risk.',
          answers: ['Predicted risk above 10 percent', 'Higher socioeconomic status', 'High users of preventive care'],
          distractors: ['Lower socioeconomic status', 'Chronic inflammatory disease'],
          why: 'The tools were derived from older cohorts with higher event rates, so they run high in well-resourced populations. They run low in some racial and ethnic groups, in lower socioeconomic status and in chronic inflammatory disease. Knowing the direction of the error is what makes the number usable.' },
        { type: 'truefalse', q: 'The ASCVD risk calculators underestimate risk in patients with chronic inflammatory disease.', a: true,
          why: 'Conditions such as rheumatoid arthritis, lupus and HIV carry cardiovascular risk the equations do not see. For these patients the calculated number is a floor, and the clinical judgment that follows should lean toward treatment.' }
      ]
    },

    {
      id: 'afp-htn23-life', collection: 'Journal Articles', subject: 'Hypertension', topic: 'Hypertension in Adults · AFP 2023', name: 'LIFESTYLE NUMBERS',
      blurb: 'What each lifestyle change is worth in millimeters of mercury, and the one combination that is proven to add up.',
      cards: [
        { type: 'number', q: 'Systolic reduction from the DASH diet combined with sodium restriction?', value: 11.5, unit: 'mm Hg',
          why: 'With a diastolic fall of 5.8. This is the largest lifestyle effect in the article and the only combination shown to be additive. DASH alone gives 5.9 and sodium restriction alone 6.7, so together they rival a first-line drug.' },
        { type: 'number', q: 'Systolic reduction from the DASH diet alone?', value: 5.9, unit: 'mm Hg',
          why: 'Fruits, vegetables and low-fat dairy with reduced saturated and total fat. Diastolic falls by about 2.9. The effect appears within weeks and is independent of weight loss.' },
        { type: 'number', q: 'Daily sodium intake below which blood pressure reduction from restriction is greatest?', value: 1200, unit: 'mg',
          why: 'Restriction to under 1,200 mg lowers systolic pressure by 6.7 and diastolic by 3.5. The guideline target is 1,500 mg or less, or a cut of at least 1,000 mg from usual intake, which still helps.' },
        { type: 'number', q: 'Systolic reduction from a potassium-based salt substitute?', value: 4.8, unit: 'mm Hg',
          why: 'Salt substitutes also reduced cardiovascular and all-cause mortality in trial data. The caveat is hyperkalemia in chronic kidney disease or with drugs that block potassium excretion, so check the creatinine and the medication list first.' },
        { type: 'recall', q: 'Why is dietary potassium enrichment used cautiously in a patient on an ACE inhibitor?', a: 'Risk of hyperkalemia',
          why: 'ACE inhibitors, ARBs, potassium-sparing diuretics and kidney disease all impair potassium excretion, and a salt substitute or supplement on top can push potassium to dangerous levels. The benefit is real in everyone else.' },
        { type: 'number', q: 'Minutes of aerobic activity per session, three or four times a week, advised to lower blood pressure?', value: 40, unit: 'min',
          why: 'That matches the general recommendation of 150 minutes a week of moderate activity such as brisk walking, 75 minutes of vigorous activity such as running, or a mix. Aerobic exercise lowers systolic pressure by 4 to 6 mm Hg.' },
        { type: 'number', q: 'Systolic reduction from losing 4 kg?', value: 4.5, unit: 'mm Hg',
          why: 'About 9 pounds, with a 3.2 diastolic fall. The effect is graded, so more loss gives more reduction. The effect of weight loss on mortality in hypertension is unknown.' },
        { type: 'number', q: 'Systolic reduction from moderating alcohol intake?', value: 5.5, unit: 'mm Hg',
          why: 'With a 4.0 diastolic fall. One or more standard drinks a day raises the risk of hypertension in a dose-dependent way. Cutting heavy intake to two drinks a day captures the benefit; going lower may not add more.' },
        { type: 'number', q: 'Daily drinks to which heavy drinkers should cut back to improve blood pressure?', value: 2, unit: 'drinks',
          why: 'Reducing heavy intake to two a day improves pressure; further reduction may not add blood pressure benefit, though light intake of under one a day is associated with lower cardiovascular and all-cause mortality.' },
        { type: 'truefalse', q: 'The blood pressure reductions from different lifestyle interventions are known to add together.', a: false,
          why: 'Only the combination of the DASH diet with sodium restriction has been shown to be additive. For the others, the additive effect is unknown, which is why each is counseled on its own merits rather than summed into a promise.' }
      ]
    },

    {
      id: 'afp-htn23-drugs', collection: 'Journal Articles', subject: 'Hypertension', topic: 'Hypertension in Adults · AFP 2023', name: 'FIRST-LINE DRUGS',
      blurb: 'When to start, which of the four classes, when two at once, the doses, and what to watch.',
      cards: [
        { type: 'multi', q: 'Select the four first-line antihypertensive classes.',
          answers: ['ACE inhibitors', 'Angiotensin receptor blockers', 'Dihydropyridine CCBs', 'Thiazide diuretics'],
          distractors: ['Beta blockers', 'Alpha blockers', 'Loop diuretics'],
          why: 'A grade A recommendation. Beta blockers are not first line for hypertension alone but belong in the regimen when ischemic heart disease or heart failure calls for them. Nonpreferred classes are used for the comorbidity, not for the pressure.' },
        { type: 'recall', q: 'Preferred first-line class for hypertension with proteinuric chronic kidney disease?', a: 'An ACE inhibitor or an ARB',
          why: 'Grade B. They slow progression of kidney disease, most clearly in diabetic nephropathy. The two are never combined, because together they raise hyperkalemia and acute kidney injury without added benefit, and both are contraindicated in pregnancy.' },
        { type: 'truefalse', q: 'An ACE inhibitor and an ARB may be combined when blood pressure is not at goal on one of them.', a: false,
          why: 'The combination increases hyperkalemia and acute kidney injury and does not improve outcomes. Add a different class, usually a calcium channel blocker or a thiazide, instead.' },
        { type: 'multi', q: 'Select the stage 1 patients who should start medication without a lifestyle trial first.',
          answers: ['Clinical ASCVD', '10-year ASCVD risk 10% or more', 'Diabetes', 'Chronic kidney disease', 'Hypertensive end-organ damage'],
          distractors: ['Family history of hypertension', 'Age over 50 alone'],
          why: 'For stage 1 hypertension with lower risk, lifestyle change comes first for three to six months, with medication considered alongside it when systolic pressure is more than 10 mm Hg above goal. Everyone with stage 2 starts medication.' },
        { type: 'number', q: 'Months of lifestyle modification before medication in low-risk stage 1 hypertension?', value: 3, unit: 'months',
          why: 'Three to six months. If goals are not met by then, medication is added. When systolic pressure is more than 10 mm Hg above goal at the outset, medication can be started together with the lifestyle work.' },
        { type: 'recall', q: 'Blood pressure gap above goal at which treatment starts with two drugs from different classes?', a: 'More than 20 systolic or 10 diastolic',
          why: 'Also for all stage 2 hypertension, across racial groups. Earlier guidance chose single agents by race; control rates stayed poor, and the article recommends initial combination therapy instead. Two drugs from different classes lower pressure more, with fewer side effects, than doubling one.' },
        { type: 'number', q: 'Typical daily dose range of chlorthalidone?', values: [12.5, 25], join: '–', unit: 'mg',
          why: 'Supplied only as an unscored 25 mg tablet, so the lower dose means splitting it. Hydrochlorothiazide uses the same range and indapamide 1.25 to 2.5 mg. Thiazides cause hypokalemia and hyponatremia.' },
        { type: 'number', q: 'Typical daily dose range of amlodipine?', values: [2.5, 10], join: '–', unit: 'mg',
          why: 'Extended-release felodipine shares the range and extended-release nifedipine runs 30 to 90 mg. Edema and headache are the common adverse effects of the dihydropyridines.' },
        { type: 'number', q: 'Typical daily dose range of lisinopril?', values: [5, 40], join: '–', unit: 'mg',
          why: 'Enalapril is the same; benazepril is 10 to 40 mg. ACE inhibitor adverse effects are cough, angioedema, dizziness, hyperkalemia and hypotension. Losartan runs 25 to 100 mg, valsartan 80 to 320 and olmesartan 20 to 40.' },
        { type: 'match', q: 'Match each first-line class to its characteristic adverse effect.',
          pairs: [
            { left: 'ACE inhibitor', right: 'Cough, angioedema' },
            { left: 'ARB', right: 'Hyperkalemia' },
            { left: 'Amlodipine', right: 'Ankle edema' },
            { left: 'Thiazide', right: 'Low potassium and sodium' }
          ] },
        { type: 'recall', q: 'Which two serum tests are rechecked soon after starting or increasing an ACE inhibitor, ARB or diuretic?', a: 'Creatinine and potassium',
          why: 'Once pressure is controlled, creatinine and electrolytes are repeated once or twice a year. A urine albumin-to-creatinine ratio every one to two years watches for microalbuminuria, though its value is uncertain once the patient is on an ACE inhibitor or ARB.' }
      ]
    },

    {
      id: 'afp-htn23-goals', collection: 'Journal Articles', subject: 'Hypertension', topic: 'Hypertension in Adults · AFP 2023', name: 'TARGETS & EVIDENCE',
      blurb: 'What goal to treat to, why the AAFP did not follow ACC/AHA, and the trial numbers behind both positions.',
      cards: [
        { type: 'number', q: 'Blood pressure goal the AAFP recommends for all adults with hypertension to reduce mortality?', values: [140, 90], join: '/', unit: 'mm Hg',
          why: 'A strong recommendation on high-quality evidence, grade A. Treating below 140/90 reduces all-cause and cardiovascular mortality. Lower targets reduce some events but not deaths, and bring more harm.' },
        { type: 'number', q: 'Lower blood pressure goal the AAFP says may be considered to reduce myocardial infarction?', values: [135, 85], join: '/', unit: 'mm Hg',
          why: 'A weak recommendation on moderate-quality evidence. Cochrane found a small reduction in infarction and heart failure at this target with no mortality benefit and more serious adverse events, so it is a shared decision rather than a rule.' },
        { type: 'recall', q: 'Why did the AAFP not endorse the 2017 ACC/AHA blood pressure guideline?', a: 'Lower targets help little and harm low-risk patients',
          why: 'The marginal benefit seen in high-risk trial populations may not outweigh hypotension, syncope, electrolyte disturbance and kidney injury when a 130/80 goal is applied to the large number of adults at low to moderate risk. A large cohort of low-risk mild hypertension showed no cardiovascular or mortality benefit from treatment at all.' },
        { type: 'number', q: 'Number needed to treat in SPRINT to prevent one major cardiovascular event with intensive control?', value: 61, unit: 'patients',
          why: 'Events fell from 2.2 to 1.7 percent, hazard ratio 0.75, in patients at increased cardiovascular risk treated to a systolic under 120 rather than under 140. Total mortality fell from 4.5 to 3.3 percent, number needed to treat 90.' },
        { type: 'number', q: 'Number needed to harm in SPRINT for hypotension, syncope, electrolyte abnormality or acute kidney injury?', value: 45, unit: 'patients',
          why: 'Serious adverse effects rose from 2.5 to 4.7 percent, hazard ratio 1.88. One harm for every 45 treated, against one event prevented for every 61: the two numbers are the whole argument about targets in one line.' },
        { type: 'recall', q: 'What happened to the mortality benefit of intensive control 4.5 years after SPRINT ended?', a: 'It was no longer evident',
          why: 'Mean systolic pressure drifted back up once trial support ended and the survival difference disappeared. The finding illustrates how hard trial-level control is to sustain in ordinary practice.' },
        { type: 'number', q: 'Number needed to treat for a major cardiovascular event in the nine-trial meta-analysis of intensive lowering?', value: 91, unit: 'patients',
          why: 'Events 6.2 versus 7.3 percent, relative risk 0.84. Stroke was the only other outcome reduced, 2.4 versus 2.9 percent, number needed to treat 200. Mortality was not reduced across the pooled trials.' },
        { type: 'number', q: 'Number needed to treat to prevent one myocardial infarction at a goal under 135/85 in the Cochrane review?', value: 250, unit: 'patients',
          why: 'Infarction 2.1 versus 2.5 percent over 3.7 years, and heart failure 1.9 versus 2.5 percent with a number needed to treat of 167. Against that, serious adverse events rose from 6.8 to 9.8 percent, number needed to harm 33, and mortality did not change.' },
        { type: 'number', q: 'Number needed to harm for serious adverse events at a goal under 135/85 in the Cochrane review?', value: 33, unit: 'patients',
          why: 'One serious adverse event for every 33 treated to the lower target, against one infarction prevented per 250. That ratio is why the lower goal is a weak recommendation and a conversation with the patient.' },
        { type: 'number', q: 'Number needed to harm for syncope when low-risk patients with mild hypertension are treated?', value: 35, unit: 'patients',
          why: 'In the large cohort of low-risk mild hypertension, treatment brought no cardiovascular or mortality benefit, but hypotension in 1 of 41, syncope in 1 of 35, electrolyte abnormality in 1 of 111 and acute kidney injury in 1 of 91. Clinical judgment and shared decision-making are the recommendation for this group.' },
        { type: 'number', q: 'JNC 8 blood pressure goal for most patients 60 and older?', values: [150, 90], join: '/', unit: 'mm Hg',
          why: 'JNC 8 relaxed the goal for older adults to under 150/90 and kept under 140/90 for those younger than 60 and for anyone with diabetes or kidney disease. It is the most permissive of the guidelines in the article.' },
        { type: 'number', q: 'NICE blood pressure goal for patients 80 and older?', values: [150, 90], join: '/', unit: 'mm Hg',
          why: 'Under 140/90 below 80. NICE and JNC 8 both loosen the goal at the top of the age range because of orthostasis, falls and kidney injury in frail older adults.' },
        { type: 'number', q: 'ISH blood pressure goal for patients 65 and older?', values: [140, 90], join: '/', unit: 'mm Hg',
          why: 'For younger patients the ISH asks for under 140/90 within three months and under 130/80 in the long term. The older threshold matches the AAFP goal for all ages.' },
        { type: 'number', q: 'ACC/AHA blood pressure goal when 10-year ASCVD risk is 10 percent or more?', values: [130, 80], join: '/', unit: 'mm Hg',
          why: 'Also for known cardiovascular disease. Below 10 percent risk the recommended goal is under 140/90, with under 130/80 called reasonable. These are the SPRINT-influenced targets the AAFP declined to adopt.' },
        { type: 'number', q: 'Follow-up interval once blood pressure is controlled on medication?', low: 3, high: 6, unit: 'months',
          why: 'Monthly visits until controlled, then every three to six months. Response is judged on office, home and ambulatory readings together, and lifestyle and medication are stepped up at each visit until target. Most patients need two or more agents. Simplified dosing, generics and team-based titration with health coaching and home monitoring all improve control.' }
      ]
    },

    {
      id: 'afp-le-overview', collection: 'Journal Articles', subject: 'Pediatric Orthopedics', topic: 'Lower Extremity Abnormalities · AFP 2025', name: 'OVERVIEW & HISTORY',
      blurb: 'Baird, Dickison and Spires, Am Fam Physician 2025;111(2):125-139. How common these are, why most need no referral, and what the history tells you.',
      cards: [
        { type: 'number', q: 'Share of children under 6 who have some form of intoeing?', value: 25, unit: '%',
          why: 'Twenty-five to thirty percent, and 80 to 95 percent of those cases are benign. Musculoskeletal concerns make up as much as a third of pediatric primary care visits, and rotational variation is a large part of that.' },
        { type: 'number', q: 'Share of intoeing cases in young children that are benign?', value: 90, unit: '%',
          why: 'Eighty to ninety-five percent. Even so, intoeing accounts for 10 to 15 percent of referrals to pediatric orthopedists, most driven by parental worry about long-term effects. Explaining the natural history is the treatment.' },
        { type: 'recall', q: 'Three conditions that make intoeing in a child 6 or younger safe to manage without referral?', a: 'Symmetrical, painless, and age 6 or under',
          why: 'All three together. Asymmetry, pain or persistence past the expected age of resolution each change the picture and call for measurement against the age norms and possibly referral.' },
        { type: 'recall', q: 'General rule for when a rotational or angular measurement warrants orthopedic referral?', a: 'More than 2 standard deviations outside normal for age',
          why: 'That line defines a deformity rather than a variation. The other triggers are pain and impaired function. Within the normal range, asymptomatic children need reassurance and follow-up, not consultation, orthotics or bracing.' },
        { type: 'match', q: 'Match each age of onset of intoeing to its usual cause.',
          pairs: [
            { left: 'Birth to 1 year', right: 'Metatarsus adductus' },
            { left: '1 to 3 years', right: 'Internal tibial torsion' },
            { left: '3 to 6 years', right: 'Femoral anteversion' },
            { left: 'Adolescence, new', right: 'Think SCFE' }
          ] },
        { type: 'recall', q: 'Cause of out-toeing that first appears at 4 to 7 years of age?', a: 'External tibial torsion',
          why: 'Out-toeing present from birth is femoral retroversion, which resolves by 1 to 2 years, or pes planus, which resolves by about 10. New out-toeing in an adolescent raises slipped capital femoral epiphysis.' },
        { type: 'recall', q: 'Age at which physiologic genu valgum is most noticeable?', a: '3 years',
          why: 'Knock knee appears at 13 to 18 months, peaks around 3 and resolves or nearly resolves by 8. Bowing, genu varum, is the newborn state, resolves by about 2, and may return later.' },
        { type: 'truefalse', q: 'W-sitting causes femoral anteversion and should be discouraged.', a: false,
          why: 'A grade B recommendation. Prospective cohorts show W-sitting is a position of comfort for children who already have anteversion, not a cause of it, and hip dysplasia is no more common in W-sitters. Parents can be told to leave it alone.' },
        { type: 'recall', q: 'Why does the history ask about calcium and vitamin D intake in a child with bowed or knock knees?', a: 'Deficiency causes rickets and abnormal long bone growth',
          why: 'Rickets is on the differential of both genu varum and genu valgum. Poor growth, obesity, malnutrition and renal osteodystrophy all point the same way, and laboratory testing is reserved for when history or examination raises the concern.' },
        { type: 'multi', q: 'Select the conditions that predispose to angular deformities of the legs.',
          answers: ['Rickets', 'Osteogenesis imperfecta', 'Renal osteodystrophy', 'Skeletal dysplasia', 'Cerebral palsy'],
          distractors: ['Asthma', 'Iron deficiency'],
          why: 'These distort bone growth or load it abnormally. Cerebral palsy with its contractures predisposes to most lower extremity abnormalities, Klinefelter syndrome to pes planus, and rheumatologic disease can distort the knee to look like genu valgum.' },
        { type: 'recall', q: 'Why does the birth history matter in a child with a rotational variation?', a: 'Breech presentation raises the risk of hip dysplasia',
          why: 'Breech delivery predisposes to femoral retroversion and to developmental dysplasia of the hip, and the latter needs imaging. Prematurity and birth weight under 1,500 g raise the risk of cerebral palsy, which warrants investigation when the legs are abnormal.' },
        { type: 'recall', q: 'Sport exposure the history asks about in a child with bowed legs?', a: 'Load-bearing sports',
          why: 'Genu varum is associated with high-impact load-bearing sport in adolescents. It is one of the few modifiable associations in the history, alongside obesity, which is linked to genu valgum.' }
      ]
    },

    {
      id: 'afp-le-profile', collection: 'Journal Articles', subject: 'Pediatric Orthopedics', topic: 'Lower Extremity Abnormalities · AFP 2025', name: 'TORSIONAL PROFILE',
      blurb: 'The examination: what to look at, the four rotational measurements, and the screening findings that point beyond a variation.',
      cards: [
        { type: 'recall', q: 'How is the foot progression angle measured?', a: 'Angle of the foot axis to the walking line',
          why: 'Chalk or hand sanitizer on bare feet and a walk down examination paper leave the footprints. Internal rotation is intoeing, external is out-toeing. The normal range changes with age until 10 to 15 years, and more than 2 standard deviations from the mean is abnormal.' },
        { type: 'recall', q: 'Position of the child for measuring internal and external hip rotation?', a: 'Prone with the knees bent to 90 degrees',
          why: 'Swinging the tibia outward measures internal hip rotation and swinging it inward measures external rotation, each as the angle from a line perpendicular to the table. Increased internal rotation with reduced external rotation is femoral anteversion; the reverse is retroversion.' },
        { type: 'recall', q: 'What does the thigh-foot angle measure?', a: 'Tibial torsion',
          why: 'With the child prone and the knee at 90 degrees, the angle between the long axis of the thigh and the long axis of the foot shows which way the tibia is turned. More than 10 degrees internal is internal tibial torsion; more than 30 degrees external is external tibial torsion.' },
        { type: 'recall', q: 'What does the heel bisector line assess?', a: 'Metatarsus adductus',
          why: 'With the child prone and the knee flexed, a line through the middle of the heel normally reaches the second toe. Falling on the third toe is mild, between the third and fourth moderate, and between the fourth and fifth severe adductus.' },
        { type: 'number', q: 'Age by which the rotational angles stop changing?', value: 15, unit: 'years',
          why: 'Ten to fifteen. Bones keep growing and derotating on their long axes until then, which is why every measurement is read against an age-specific normal range and why most variations are given time.' },
        { type: 'multi', q: 'Select the findings that count as joint laxity on examination.',
          answers: ['Elbow hyperextends past neutral', 'Thumb touches the forearm', 'Fingers lie flat on the forearm', 'Ankle dorsiflexes over 45°'],
          distractors: ['Ankle dorsiflexes 20 degrees', 'Plantar flexes 50 degrees'],
          why: 'Normal dorsiflexion is 20 degrees and plantar flexion 50. Laxity can induce or worsen angular deformity, flat feet, hip dysplasia and patellar dislocation, and marked laxity suggests a connective tissue disorder such as Ehlers-Danlos.' },
        { type: 'number', q: 'Leg length difference above which a discrepancy is diagnosed?', value: 2, unit: 'cm',
          why: 'Measured from the anterior superior iliac spine to the medial malleolus, confirmed on at least two measurements and then by radiography. A true discrepancy may be femoral length or a hip distorted by dysplasia or arthritis.' },
        { type: 'recall', q: 'Supine child, hips and knees flexed to 90 degrees, one knee sits higher than the other. Sign and meaning?', a: 'Galeazzi sign, hip dysplasia or a short femur',
          why: 'A positive Galeazzi sign warrants hip imaging. Limited hip abduction with the knee flexed and a positive Trendelenburg sign point the same way, and the Ortolani and Barlow maneuvers make the diagnosis in newborns.' },
        { type: 'recall', q: 'Standing on one leg, the pelvis drops toward the lifted side. Sign and what it suggests in a child?', a: 'Trendelenburg sign, hip dysplasia or unequal leg length',
          why: 'Weak or mechanically disadvantaged abductors on the stance side let the opposite hemipelvis sag. In a child with a rotational complaint it redirects the workup to the hip.' },
        { type: 'multi', q: 'Select the skin findings that change a lower extremity visit into a workup for something else.',
          answers: ['Warmth or redness over a joint', 'Ecchymosis', 'Café au lait spots', 'Sacral dimple or hair tuft'],
          distractors: ['Mongolian spot', 'Dry skin'],
          why: 'Warmth and redness mean possible septic arthritis or inflammation and urgent testing. Bruising suggests fracture or nonaccidental trauma. Café au lait spots suggest neurofibromatosis or McCune-Albright. Midline sacral signs suggest spina bifida and need imaging.' },
        { type: 'recall', q: 'Why are height, weight and body mass index plotted at the start of the examination?', a: 'Poor growth or obesity point to a systemic cause',
          why: 'Poor growth suggests malnutrition, hypocalcemia, hypophosphatemia or vitamin D deficiency, all of which impair bone growth. Obesity contributes to angular deformity, particularly genu valgum.' }
      ]
    },

    {
      id: 'afp-le-femur', collection: 'Journal Articles', subject: 'Pediatric Orthopedics', topic: 'Lower Extremity Abnormalities · AFP 2025', name: 'FEMORAL ROTATION',
      blurb: 'Femoral anteversion, the intoeing of the preschool child, and femoral retroversion, the out-toeing of the infant.',
      cards: [
        { type: 'recall', q: 'Most common cause of intoeing in a 3- to 6-year-old?', a: 'Femoral anteversion',
          why: 'The distal femur is rotated inward relative to the femoral neck. It is a normal finding in newborns, more common in girls, usually symmetrical, and intrauterine positioning is the suspected cause.' },
        { type: 'number', q: 'Degrees of femoral anteversion present at birth, at the top of the normal range?', value: 60, unit: 'degrees',
          why: 'Thirty to sixty degrees in the newborn, derotating gradually to about 15 degrees by adulthood. The child who intoes at 4 is on that curve, not off it.' },
        { type: 'number', q: 'Degrees of femoral anteversion in a typical adult?', value: 15, unit: 'degrees',
          why: 'Derotation from the newborn 30 to 60 degrees is the natural history that makes anteversion a watch-and-wait diagnosis. Persistent excess beyond 11 years is the exception.' },
        { type: 'number', q: 'Internal hip rotation above which femoral anteversion is diagnosed?', value: 60, unit: 'degrees',
          why: 'Increased internal rotation with reduced external rotation under 10 to 15 degrees is the pattern. The measurements are taken prone with the knees at 90 degrees and compared with the age norms.' },
        { type: 'number', q: 'Age by which femoral anteversion typically resolves?', value: 8, unit: 'years',
          why: 'It can persist to 11. Radiography is rarely indicated and referral is generally not recommended before then, because nonsurgical treatments have minimal benefit and the condition improves on its own.' },
        { type: 'number', q: 'Internal hip rotation beyond 11 years of age that warrants orthopedic referral for anteversion?', value: 80, unit: 'degrees',
          why: 'Persistent rotation of more than 80 degrees past 11 may predispose to dysfunction. Functional difficulty after 8, pain and asymmetry are the other referral triggers. Surgery is reserved for persistent anteversion with recalcitrant pain or poor quality of life.' },
        { type: 'truefalse', q: 'Femoral anteversion in childhood leads to osteoarthritis of the hip in adulthood.', a: false,
          why: 'No association with adult osteoarthritis has been shown, for anteversion, internal tibial torsion or metatarsus adductus. That is the fact that makes reassurance honest and surgery for appearance unjustified.' },
        { type: 'recall', q: 'Sitting position children with femoral anteversion often prefer?', a: 'W-sitting',
          why: 'It is comfortable because the hips rotate inward easily. It does not cause or worsen the anteversion and does not need to be discouraged, a grade B recommendation.' },
        { type: 'recall', q: 'Out-toeing in an infant who is not yet walking, with increased external and decreased internal hip rotation. Diagnosis?', a: 'Femoral retroversion',
          why: 'The femoral shaft is rotated outward. It is part of normal development, is more common after breech positioning, and resolves during the first year of walking.' },
        { type: 'number', q: 'Age beyond which persistent femoral retroversion is considered pathologic?', value: 3, unit: 'years',
          why: 'Retroversion that persists past 3, or that is diagnosed for the first time later in childhood, gets radiography and orthopedic referral, because it can be a sign of slipped capital femoral epiphysis or Legg-Calvé-Perthes disease.' },
        { type: 'recall', q: 'Diagnosis to consider when femoral retroversion appears for the first time in an older child or adolescent?', a: 'Slipped capital femoral epiphysis',
          why: 'The slipped epiphysis forces the leg into external rotation. Legg-Calvé-Perthes disease is the other concern in the younger child. New out-toeing late in childhood is never a physiologic variation.' }
      ]
    },

    {
      id: 'afp-le-tibia', collection: 'Journal Articles', subject: 'Pediatric Orthopedics', topic: 'Lower Extremity Abnormalities · AFP 2025', name: 'TIBIAL TORSION',
      blurb: 'Internal tibial torsion, the intoeing of the toddler, and external tibial torsion, the out-toeing of the school-age child.',
      cards: [
        { type: 'recall', q: 'Most common cause of intoeing in a 1- to 3-year-old?', a: 'Internal tibial torsion',
          why: 'Excess internal rotation of the tibia relative to the knee and the malleolar axis. It is usually bilateral but unilateral in up to a third, and intrauterine positioning is the suspected cause.' },
        { type: 'number', q: 'Thigh-foot angle, internally rotated, above which internal tibial torsion is diagnosed?', value: 10, unit: 'degrees',
          why: 'The angle is measured prone with the knee at 90 degrees. Anything within 10 degrees internal is normal for a toddler and needs no more than reassurance and remeasurement at follow-up.' },
        { type: 'number', q: 'Age by which internal tibial torsion usually resolves?', value: 4, unit: 'years',
          why: 'Three to four, and rarely persisting beyond 6. Parents of children in the usual age range are reassured and the measurement is repeated at later visits rather than imaged or referred.' },
        { type: 'number', q: 'Age at which a thigh-foot angle still more than 10 degrees internal warrants pediatric orthopedic consultation?', value: 8, unit: 'years',
          why: 'A grade C recommendation. Pain, asymmetry and unequal leg lengths are the other referral triggers at any age. Radiography is rarely indicated unless a referral is being made.' },
        { type: 'number', q: 'Share of internal tibial torsion cases that are unilateral, at most?', value: 33, unit: '%',
          why: 'Up to one third. Asymmetry on its own is a referral consideration in the tables, so a one-sided case is examined with more care, but unilateral torsion is still within the condition\'s normal behavior.' },
        { type: 'truefalse', q: 'Surgery for persistent internal tibial torsion is justified by its prevention of knee osteoarthritis.', a: false,
          why: 'Multiple studies have found no correlation between internal tibial torsion and later osteoarthritis, which is why surgery is controversial and reserved for persistent rotation with severe pain affecting quality of life.' },
        { type: 'recall', q: 'Out-toeing in a 5-year-old with patellae pointing forward and a thigh-foot angle over 30 degrees external. Diagnosis?', a: 'External tibial torsion',
          why: 'Forward-facing patellae mean the femur is normally rotated; the tibia alone is turned out. Onset is 4 to 7 years, and it is usually asymptomatic and resolves without intervention by adulthood.' },
        { type: 'number', q: 'Thigh-foot angle, externally rotated, above which external tibial torsion is diagnosed?', value: 30, unit: 'degrees',
          why: 'With an out-toeing foot progression angle. The torsion may keep rotating until 4 to 7 years, and the altered gait can contribute to patellofemoral syndrome and knee instability.' },
        { type: 'recall', q: 'Knee problem that external tibial torsion predisposes to?', a: 'Patellofemoral pain syndrome',
          why: 'The outward-turned tibia changes the pull on the patella and loads the patellofemoral joint abnormally, and it also contributes to knee instability. That is the reason symptomatic severe cases are considered for correction.' },
        { type: 'number', q: 'Earliest age at which surgical correction of external tibial torsion is performed?', value: 10, unit: 'years',
          why: 'A thigh-foot angle over 20 to 30 degrees has been suggested as a threshold for surgical consideration in severe symptomatic cases, but the decision is individualized and the operation is done after 10, often in adolescence or adulthood.' }
      ]
    },

    {
      id: 'afp-le-ma', collection: 'Journal Articles', subject: 'Pediatric Orthopedics', topic: 'Lower Extremity Abnormalities · AFP 2025', name: 'METATARSUS ADDUCTUS',
      blurb: 'The intoeing of the infant: how it is graded, what resolves, and what is referred.',
      cards: [
        { type: 'recall', q: 'Cause of intoeing that is present at birth or in the first year of life?', a: 'Metatarsus adductus',
          why: 'The forefoot is adducted relative to the hindfoot, usually at the tarsometatarsal joint. It occurs in about 1 in 1,000 births, equally in boys and girls, and more often in first, late-term and twin pregnancies.' },
        { type: 'number', q: 'Incidence of metatarsus adductus per 1,000 births?', value: 1, unit: 'per 1,000',
          why: 'Theories of cause include intrauterine positioning, muscle imbalance, prone sleeping with hips and knees flexed and feet abducted, and abnormal bone structure. None is established.' },
        { type: 'recall', q: 'Classification of metatarsus adductus that best predicts prognosis?', a: 'Flexibility: flexible, semi-flexible or rigid',
          why: 'Flexibility is tested by abducting the forefoot. Flexible resolves in most cases and is reassured; semi-flexible is watched and referred if unresolved by 1 to 2 years; rigid is referred at diagnosis.' },
        { type: 'recall', q: 'How far can the forefoot be abducted in flexible metatarsus adductus?', a: 'Past the midline of the heel bisector',
          why: 'Flexible feet correct beyond neutral. Resolution is the rule, and even a residual deformity is usually asymptomatic, so treatment is reassurance alone.' },
        { type: 'recall', q: 'Forefoot abducts only to the heel bisector midline and the child is 18 months old. Next step?', a: 'Consider pediatric orthopedic referral',
          why: 'Semi-flexible adductus is given until 1 to 2 years to resolve. If it has not, it is managed like rigid adductus, with manipulation, serial casting or surgery as the orthopedist judges.' },
        { type: 'recall', q: 'Management of rigid metatarsus adductus?', a: 'Refer to pediatric orthopedics',
          why: 'A rigid forefoot cannot be brought to the midline. Treatment may involve manipulation, serial casting and, rarely, surgery. Radiography is rarely needed before referral.' },
        { type: 'recall', q: 'Where does the heel bisector line fall in moderate metatarsus adductus?', a: 'Between the third and fourth toes',
          why: 'Normal is the second toe, mild the third toe, moderate between third and fourth, and severe between fourth and fifth. The child is examined prone with the knee flexed to 90 degrees.' },
        { type: 'number', q: 'Foot progression angle above which metatarsus adductus produces measurable intoeing?', value: 5, unit: 'degrees',
          why: 'The intoeing comes from the forefoot rather than the tibia or femur, so hip rotation and the thigh-foot angle are normal while the foot itself points in. The heel bisector line confirms the source.' },
        { type: 'truefalse', q: 'Metatarsus adductus that persists leads to osteoarthritis in adulthood.', a: false,
          why: 'No association with adult osteoarthritis has been shown. The reasons to treat are a rigid foot and failure of a semi-flexible foot to resolve, not future joint disease.' }
      ]
    },

    {
      id: 'afp-le-flat', collection: 'Journal Articles', subject: 'Pediatric Orthopedics', topic: 'Lower Extremity Abnormalities · AFP 2025', name: 'PES PLANUS',
      blurb: 'Flexible flat feet need nothing; rigid ones need a reason. The test that separates them and the evidence on orthotics.',
      cards: [
        { type: 'recall', q: 'Most common cause of out-toeing in children?', a: 'Pes planus',
          why: 'A low medial longitudinal arch lets the foot roll into eversion and point outward. It appears at about 11 months with walking, peaks in prevalence at 3 to 4 years, typically resolves by 10, and can persist into adulthood without harm.' },
        { type: 'recall', q: 'Bedside test that separates flexible from rigid pes planus?', a: 'Standing on the toes',
          why: 'In flexible flatfoot the arch reappears on toe standing. In rigid flatfoot it stays flat. Flexible and painless is the common form and needs observation only; rigid points to tarsal coalition or arthropathy and needs imaging and referral.' },
        { type: 'number', q: 'Age by which physiologic flexible pes planus typically resolves?', value: 10, unit: 'years',
          why: 'Peak prevalence is at 3 to 4 years. Imaging and referral are not indicated for painless flexible flatfoot at any age; persistent pain is the only reason to look further.' },
        { type: 'truefalse', q: 'Custom orthoses relieve pain in pediatric pes planus better than over-the-counter inserts.', a: false,
          why: 'Randomized trials and a Cochrane review show no advantage of custom over prefabricated orthoses, and no clear benefit of any orthosis in painless flat feet. Painful flexible flatfoot gets stretching, supportive footwear, strengthening and an inexpensive insert if anything.' },
        { type: 'recall', q: 'When does a painful flexible flatfoot go to orthopedics?', a: 'When conservative management fails',
          why: 'Stretching, arch-supporting footwear, strengthening and orthoses are tried first, though the evidence for them is low quality. Surgical evaluation is rare and reserved for persistent pain or an inflexible foot.' },
        { type: 'recall', q: 'Underlying cause to suspect when a rigid flatfoot develops in adolescence?', a: 'Tarsal coalition',
          why: 'Two tarsal bones joined by bone, cartilage or fibrous tissue limit subtalar motion and keep the arch flat on toe standing. Radiography or CT shows it. Rigid flatfoot from birth is a severe congenital deformity and is rarer.' },
        { type: 'recall', q: 'Examination finding that accompanies rigid pes planus besides the flat arch?', a: 'Limited subtalar joint motion',
          why: 'The coalition or arthropathy stiffens the hindfoot. Radiography or CT is indicated to identify the cause, and orthopedic referral manages it.' },
        { type: 'recall', q: 'Why check wrist laxity in a child with flat feet?', a: 'Pes planus accompanies connective tissue disorders',
          why: 'Generalized ligamentous laxity lets the arch collapse. A thumb that touches the forearm or fingers that extend parallel to it suggest a connective tissue disorder behind the feet.' },
        { type: 'recall', q: 'Chromosomal condition that predisposes boys to pes planus?', a: 'Klinefelter syndrome',
          why: 'An extra X chromosome, with tall stature and small testes, and flat feet among its skeletal features. It also predisposes to other lower extremity abnormalities.' },
        { type: 'recall', q: 'Imaging for suspected rigid pes planus?', a: 'Radiography or CT of the foot',
          why: 'To find the tarsal coalition or arthropathy underneath. Flexible painless flatfoot gets no imaging at all, which is the commoner decision.' }
      ]
    },

    {
      id: 'afp-le-varum', collection: 'Journal Articles', subject: 'Pediatric Orthopedics', topic: 'Lower Extremity Abnormalities · AFP 2025', name: 'GENU VARUM',
      blurb: 'Bowlegs: the newborn norm, when it should be gone, and the Blount disease and rickets that mimic it.',
      cards: [
        { type: 'recall', q: 'Knee alignment of a normal newborn?', a: 'Genu varum, bowlegs',
          why: 'Medial ankles touch but medial knees do not. Alignment moves to neutral by 13 to 18 months, usually with walking, then into physiologic valgus that peaks at 3 and settles to neutral or slight valgus by 8.' },
        { type: 'number', q: 'Intercondylar distance at the top of the normal range for a neonate?', value: 5, unit: 'cm',
          why: 'Zero to five, averaging 3 cm, measured with the medial malleoli together. It falls steadily to 0 to 3 cm by 13 to 18 months and 0 to 2 cm from 8 years on.' },
        { type: 'number', q: 'Age by which physiologic genu varum should have resolved to neutral?', value: 2, unit: 'years',
          why: 'Thirteen to eighteen months is typical. Persistence beyond 2 years, or bowing that is asymmetrical or beyond the normal range, is the indication for orthopedic referral and consideration of surgery.' },
        { type: 'recall', q: 'Two-year-old with bowing that is worse on one side and has not improved since walking began. Diagnosis to exclude?', a: 'Blount disease',
          why: 'A growth plate abnormality of the proximal medial tibia that slows or stops its growth while the lateral side continues, bowing the knee outward. Asymmetry and persistence past 2 are its calling cards, and anteroposterior radiography of the legs shows it.' },
        { type: 'multi', q: 'Select the nonphysiologic causes of genu varum.',
          answers: ['Blount disease', 'Rickets', 'Growth plate injury', 'Osteogenesis imperfecta', 'Skeletal dysplasia'],
          distractors: ['Femoral anteversion', 'Flexible pes planus'],
          why: 'Also renal osteodystrophy and asymmetrical femoral growth. Rotational variations and flat feet do not bow the knees. Laboratory studies are added when history or examination suggests a metabolic or endocrine cause.' },
        { type: 'recall', q: 'Imaging when genu varum is asymmetrical, painful or outside the normal range?', a: 'Anteroposterior radiography of the lower extremities',
          why: 'It measures the degree of angulation and can show Blount disease, rickets or a prior fracture. Two-view films are used when the visual examination or the intercondylar distance is abnormal.' },
        { type: 'recall', q: 'Why might bowlegs return in a school-age child after resolving as a toddler?', a: 'Load-bearing sports',
          why: 'Genu varum is associated with high-impact sport in adolescents, and the history asks about it. Obesity is linked to the opposite deformity, genu valgum.' },
        { type: 'number', q: 'Intercondylar distance at the top of the normal range from 8 years of age onward?', value: 2, unit: 'cm',
          why: 'Zero to two, averaging zero. Intermalleolar distance at that age runs 0 to 3 cm. Alignment changes little after 8, so a measurement outside these ranges in an older child is a deformity, not a phase.' },
        { type: 'recall', q: 'Bowlegs in a toddler with poor growth, low dairy intake and little sun exposure. Cause to test for?', a: 'Rickets from vitamin D deficiency',
          why: 'Low vitamin D and calcium intake are associated with high rates of both varum and valgum in European children. Check calcium, phosphate, alkaline phosphatase and 25-hydroxyvitamin D when the history points this way.' }
      ]
    },

    {
      id: 'afp-le-valgum', collection: 'Journal Articles', subject: 'Pediatric Orthopedics', topic: 'Lower Extremity Abnormalities · AFP 2025', name: 'GENU VALGUM',
      blurb: 'Knock knees: the preschool peak, the measurements, obesity, and the Cozen fracture that causes it.',
      cards: [
        { type: 'recall', q: 'Age at which physiologic genu valgum first appears?', a: '13 to 18 months',
          why: 'Knock knee follows the resolution of newborn bowing, is most prominent at about 3 years and returns to neutral or slight valgus by 8. Medial knees touch while medial ankles do not.' },
        { type: 'number', q: 'Intermalleolar distance at the top of the normal range at 3 years of age?', value: 5, unit: 'cm',
          why: 'Zero to five, averaging 2.8 cm, measured with the femoral condyles together. It is zero at birth, peaks at 3 and falls to 0 to 3 cm by 8 years and after.' },
        { type: 'number', q: 'Age by which physiologic genu valgum resolves or nearly resolves?', value: 8, unit: 'years',
          why: 'A mild valgus can persist as a normal finding. Referral is for intermalleolar distances outside the age range, asymmetry, or associated syndromic or musculoskeletal findings.' },
        { type: 'recall', q: 'Genu valgum developing after a healed fracture of the proximal tibial metaphysis. Name of the deformity?', a: 'Cozen deformity',
          why: 'A grade C recommendation: children who have had this fracture are watched at routine examinations for valgus angulation and leg length disparity. It is a posttraumatic growth phenomenon rather than a malunion.' },
        { type: 'multi', q: 'Select the nonphysiologic causes of genu valgum.',
          answers: ['Rickets', 'Renal osteodystrophy', 'Growth plate injury', 'Cozen fracture', 'Skeletal dysplasia'],
          distractors: ['Internal tibial torsion', 'Metatarsus adductus'],
          why: 'Osteogenesis imperfecta and rheumatologic disease of the knee are the others. Idiopathic valgum is the commonest pathologic form, and obesity is increasingly recognized as a contributor.' },
        { type: 'recall', q: 'Modifiable factor increasingly associated with idiopathic genu valgum?', a: 'Obesity',
          why: 'Growing evidence links higher body mass index with knock knee in children and adolescents, and valgus alignment is in turn associated with patellofemoral instability. Growth parameters are plotted at every visit for this reason.' },
        { type: 'recall', q: 'Rheumatologic reason a child\'s knee can look like genu valgum?', a: 'Juvenile arthritis distorting the knee',
          why: 'Synovitis and asymmetric growth at the knee produce an apparent valgus. Warmth, effusion or morning stiffness point to it, and the referral goes to rheumatology rather than orthopedics.' },
        { type: 'multi', q: 'Select the indications for orthopedic referral in genu valgum.',
          answers: ['Asymmetry', 'Distance outside the age range', 'Syndromic features'],
          distractors: ['Intermalleolar 3 cm at age 3', 'Mild valgus at age 9'],
          why: 'Physiologic valgum within the age norms gets reassurance and follow-up. Anteroposterior radiography measures the angle and looks for a cause when any of the three triggers is present.' }
      ]
    },

  ];

  global.Decks = { BUILTIN: BUILTIN };
})(window);
