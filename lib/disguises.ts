// W1 fix: derive DisguiseId from a single const tuple so adding a new
// regulation only requires updating DISGUISE_IDS + the DISGUISES entry.
// Exhaustive switch statements on DisguiseId catch new entries at compile time.
export const DISGUISE_IDS = [
  'hipaa',
  'pci',
  'glba',
  'gdpr',
  'ccpa',
  'ferpa',
  'sox',
  'default',
] as const

export type DisguiseId = (typeof DISGUISE_IDS)[number]

export interface DisguiseIdentifier {
  label: string
  detector?: string
  strategy: string
}

export interface SampleRow {
  column: string
  input: string
  output: string
}

export interface Disguise {
  id: DisguiseId
  name: string
  regulation: string
  citation: string
  primaryBuyer: string
  summary: string
  triggerDescription: string
  identifiers: DisguiseIdentifier[]
  yamlSample: string
  sampleRows: SampleRow[]
  honesty: string[]
  metaDescription: string
}

export const DISGUISES: Disguise[] = [
  {
    id: 'hipaa',
    name: 'HIPAA Disguise',
    regulation: 'HIPAA Privacy Rule',
    citation: '45 CFR Section 164.514(b)(2)  --  Safe Harbor de-identification',
    primaryBuyer: 'Healthcare data engineers',
    summary:
      'Starts from the HIPAA Safe Harbor identifier categories, with additional healthcare-oriented detector examples such as ICD-10, MRN, and NPI. ' +
      'FORECAST may recommend this template when STORM detects those signals or a PHI-style co-occurrence such as date + ZIP + name.',
    triggerDescription:
      'SSN, MRN, NPI, or ICD-10 detected anywhere  --  or date + ZIP + name appearing together',
    metaDescription:
      'HIPAA-oriented masking template for reviewable Decoy YAML workflows. Includes Safe Harbor field patterns, healthcare identifiers, and explicit strategy defaults.',
    identifiers: [
      { label: 'Names', detector: 'person_name', strategy: 'faker  --  realistic replacement' },
      { label: 'Geographic data (ZIP code)', detector: 'us_zip', strategy: 'truncate  --  keep first 3 digits' },
      { label: 'Dates (except year)', detector: 'iso_date / us_date / eu_date', strategy: 'date_shift +/-30 days' },
      { label: 'Telephone numbers', detector: 'us_phone', strategy: 'faker  --  realistic phone' },
      { label: 'Fax numbers', detector: 'fax_number', strategy: 'faker  --  realistic phone' },
      { label: 'Email addresses', detector: 'email', strategy: 'faker  --  realistic email' },
      { label: 'Social security numbers', detector: 'ssn', strategy: 'hash sha256' },
      { label: 'Medical record numbers', detector: 'mrn', strategy: 'hash sha256, truncated to 12 chars' },
      { label: 'Health plan beneficiary numbers', detector: 'health_plan_id', strategy: 'hash sha256, truncated to 12 chars' },
      { label: 'Account numbers', detector: 'iban', strategy: 'hash sha256' },
      { label: 'Certificate / license numbers', detector: 'license_num', strategy: 'hash sha256, truncated to 12 chars' },
      { label: 'Vehicle identifiers (VINs)', detector: 'vehicle_id', strategy: 'hash sha256, truncated to 17 chars' },
      { label: 'Device identifiers', detector: 'device_id', strategy: 'hash sha256, truncated to 12 chars' },
      { label: 'Web URLs', detector: 'url', strategy: 'redact  --  [URL REDACTED]' },
      { label: 'IP addresses', detector: 'ipv4', strategy: 'faker  --  realistic IP' },
      { label: 'Biometric identifiers', detector: 'biometric_id', strategy: 'redact  --  [BIOMETRIC REDACTED]' },
      { label: 'Ages 90+', strategy: 'bucketize  --  cap at 89' },
      { label: 'ICD-10-CM diagnosis codes', detector: 'icd10', strategy: 'truncate  --  keep 3-char category only' },
      { label: 'National Provider Identifiers (NPI)', detector: 'npi', strategy: 'hash sha256, truncated to 10 chars' },
    ],
    yamlSample: `id: hipaa
name: HIPAA Disguise
regulation: "HIPAA Privacy Rule  --  Safe Harbor (45 CFR Section 164.514(b)(2))"

rules:
  - match:
      detectors: ["ssn"]
    mask: hash
    params: { algorithm: sha256 }

  - match:
      detectors: ["us_zip"]
    mask: truncate
    params: { length: 3 }

  - match:
      detectors: ["iso_date", "us_date", "eu_date"]
    mask: date_shift
    params: { jitter_days: 30 }

  - match:
      detectors: ["mrn"]
    mask: hash
    # W2 fix: truncate is measured in output CHARACTERS, not bytes.
    # truncate: 12 means a 12-character hex output (6 bytes of hash).
    params: { algorithm: sha256, truncate: 12 }

  - match:
      detectors: ["icd10"]
    mask: truncate
    params: { length: 3 }

triggers:
  any_detectors: ["ssn", "mrn", "npi", "icd10"]
  co_occurrence:
    - ["iso_date", "us_zip", "person_name"]`,
    sampleRows: [
      { column: 'patient_name', input: 'Jane Doe', output: 'Maria Rodriguez' },
      { column: 'ssn', input: '321-54-9876', output: 'a3f2e8c1d4b5...' },
      { column: 'dob', input: '1985-03-14', output: '1985-02-11' },
      { column: 'zip_code', input: '97401', output: '974' },
      { column: 'mrn', input: 'MR-20847', output: '8a4f2c1b3d5e' },
    ],
    honesty: [
      'Safe Harbor only. Expert Determination (Section 164.514(b)(1))  --  the statistical method for de-identification  --  is not in scope. If a regulator requires Expert Determination, you need a qualified statistician; a masking tool alone is insufficient.',
      'Age generalisation caps at 89 but does not run a k-anonymity check. A dataset with rare combinations of age + ZIP + gender can still be re-identifiable even after Safe Harbor masking.',
      'Free-text clinical notes are not covered. Unstructured fields (physician comments, discharge summaries) need an NLP extraction step before this Disguise applies.',
    ],
  },
  {
    id: 'pci',
    name: 'PCI DSS Disguise',
    regulation: 'PCI DSS',
    citation: 'PCI DSS v4.0 Section 3.4  --  rendering PAN unreadable',
    primaryBuyer: 'Fintech and e-commerce engineers',
    summary:
      'Starts with payment-card fields such as PAN, CVV, account numbers, and standard contact fields. ' +
      'Uses explicit defaults such as hashing, redaction, and faker replacements that should be reviewed before use.',
    triggerDescription: 'PAN or CVV detected anywhere, or the retail co-occurrence (PAN + name + contact)',
    metaDescription:
      'PCI-oriented masking template for Decoy YAML workflows, with starter handling for PAN, CVV, account numbers, and contact fields.',
    identifiers: [
      { label: 'Primary Account Number (PAN)', detector: 'pan', strategy: 'hash sha256, truncated to 16 chars  --  preserves FK joins' },
      { label: 'Card Verification Value (CVV/CVC)', detector: 'cvv', strategy: 'redact  --  hard-required by PCI Section 3.3' },
      { label: 'IBAN / account numbers', detector: 'iban', strategy: 'hash sha256' },
      { label: 'Cardholder names', detector: 'person_name', strategy: 'faker  --  realistic name' },
      { label: 'Email addresses', detector: 'email', strategy: 'faker  --  realistic email' },
      { label: 'Phone numbers', detector: 'us_phone', strategy: 'faker  --  realistic phone' },
    ],
    yamlSample: `id: pci
name: PCI DSS Disguise
regulation: "PCI DSS v4.0 Section 3.4  --  rendering PAN unreadable"

rules:
  - match:
      detectors: ["pan"]
    mask: hash
    params: { algorithm: sha256, truncate: 16 }
    notes: "Hash length matches PAN length  --  FK joins across tables survive."

  - match:
      detectors: ["cvv"]
    mask: redact
    params: { redact_with: "[REDACTED]" }
    notes: "PCI Section 3.3: CVV must not be stored post-authorization."

  - match:
      detectors: ["iban"]
    mask: hash
    params: { algorithm: sha256 }

triggers:
  any_detectors: ["pan", "cvv"]
  co_occurrence:
    - ["pan", "person_name", "email"]`,
    sampleRows: [
      { column: 'card_number', input: '4532015112830366', output: '3e8d2a1f4c9b7e2a' },
      { column: 'cvv', input: '847', output: '[REDACTED]' },
      { column: 'account_iban', input: 'GB29NWBK60161331926819', output: '7c3e9a2f1b4d...' },
      { column: 'cardholder_name', input: 'Jane Doe', output: 'Maria Santos' },
    ],
    honesty: [
      'Not a tokenization vault. The masked PAN is a deterministic hash  --  it preserves referential integrity across joins but cannot be reversed to the original. If you need reversible tokenization for customer service lookups, see the tokenization item on the roadmap.',
      'BIN preservation is not automatic. The hash changes the first 6 digits (BIN range). If downstream systems rely on BIN routing, add a custom rule that preserves BIN digits and hashes only digits 7-15.',
      'This Disguise covers dev/test data masking, not live transaction processing. PCI scoping for production cardholder data environments requires a Qualified Security Assessor (QSA).',
    ],
  },
  {
    id: 'glba',
    name: 'GLBA Disguise',
    regulation: 'Gramm-Leach-Bliley Act',
    citation: 'GLBA Section 501(b)  --  safeguards for customer financial information',
    primaryBuyer: 'Banking and insurance engineers',
    summary:
      'Groups common financial customer fields such as SSNs, account numbers, balances, and contact details. ' +
      'Financial amounts default to bucketized ranges so reviewers can decide whether precision should be kept, generalized, or removed.',
    triggerDescription: 'SSN or IBAN detected, or SSN + IBAN + name together',
    metaDescription:
      'GLBA-oriented starter template for financial customer data, including SSNs, account numbers, balances, contact fields, and dates.',
    identifiers: [
      { label: 'Social security numbers', detector: 'ssn', strategy: 'hash sha256' },
      { label: 'Account / IBAN numbers', detector: 'iban', strategy: 'hash sha256' },
      { label: 'Account balances and amounts', strategy: 'bucketize  --  coarsened to decade ranges' },
      { label: 'Customer names', detector: 'person_name', strategy: 'faker  --  realistic name' },
      { label: 'Email addresses', detector: 'email', strategy: 'faker  --  realistic email' },
      { label: 'Phone numbers', detector: 'us_phone', strategy: 'faker  --  realistic phone' },
      { label: 'Dates', detector: 'iso_date / us_date', strategy: 'date_shift +/-30 days' },
    ],
    yamlSample: `id: glba
name: GLBA Disguise
regulation: "GLBA Section 501(b)  --  safeguards for customer financial information"

rules:
  - match:
      detectors: ["ssn"]
    mask: hash
    params: { algorithm: sha256 }

  - match:
      detectors: ["iban"]
    mask: hash
    params: { algorithm: sha256 }

  - match:
      name_regex: "(?i)^(balance|amount|salary|income|revenue)"
    mask: bucketize
    params: { preset: by_decade, format: range }

triggers:
  any_detectors: ["ssn", "iban"]
  co_occurrence:
    - ["ssn", "iban", "person_name"]`,
    sampleRows: [
      { column: 'customer_ssn', input: '321-54-9876', output: 'a3f2e8c1d4b5...' },
      { column: 'account_iban', input: 'GB29NWBK60161331926819', output: '7c3e9a2f1b4d...' },
      { column: 'balance', input: '47832.50', output: '[40000-50000)' },
    ],
    honesty: [
      'Balance bucketization loses precision. Range output is useful for testing distribution logic but cannot reproduce exact transaction amounts. If exact values matter in tests, use a synthetic approximation instead.',
      'GLBA\'s Safeguards Rule covers financial institutions. If your organisation is not a bank, broker, or insurer, GLBA may not formally apply  --  but the masking pattern is still appropriate for any dataset holding SSNs and account numbers.',
      'Does not cover the full Safeguards Rule. GLBA Section 501(b) also covers physical, administrative, and technical safeguards beyond data masking. This Disguise handles the masking layer only.',
    ],
  },
  {
    id: 'gdpr',
    name: 'GDPR Disguise',
    regulation: 'EU General Data Protection Regulation',
    citation: 'GDPR Art. 4(5) + Recital 26  --  pseudonymisation',
    primaryBuyer: 'EU-facing product engineers',
    summary:
      'A pseudonymisation-oriented starter template for direct identifiers such as names, emails, phones, IBANs, and IP addresses, plus quasi-identifiers such as ZIP codes and dates. ' +
      'Pseudonymised data may still be personal data, so this remains a review workflow rather than anonymisation.',
    triggerDescription: 'IBAN or EU-format date detected (US-only email+name excluded to prevent false positives)',
    metaDescription:
      'GDPR-oriented pseudonymisation starter template for Decoy YAML workflows. Includes direct identifiers, quasi-identifiers, and explicit strategy defaults.',
    identifiers: [
      { label: 'Names', detector: 'person_name', strategy: 'faker  --  realistic name' },
      { label: 'Email addresses', detector: 'email', strategy: 'faker  --  realistic email' },
      { label: 'Phone numbers', detector: 'us_phone', strategy: 'faker  --  realistic phone' },
      { label: 'IBAN / account numbers', detector: 'iban', strategy: 'hash sha256' },
      { label: 'IP addresses', detector: 'ipv4', strategy: 'faker  --  realistic IP' },
      { label: 'ZIP / postal codes', detector: 'us_zip', strategy: 'truncate  --  keep first 3 digits' },
      { label: 'Dates', detector: 'iso_date / eu_date', strategy: 'date_shift +/-30 days' },
    ],
    yamlSample: `id: gdpr
name: GDPR Disguise
regulation: "GDPR Art. 4(5) + Recital 26  --  pseudonymisation"

rules:
  - match:
      detectors: ["email"]
    mask: faker
    params: { provider: email }

  - match:
      detectors: ["ipv4"]
    mask: faker
    params: { provider: ipv4 }

  - match:
      detectors: ["iban"]
    mask: hash
    params: { algorithm: sha256 }

  - match:
      detectors: ["iso_date", "eu_date"]
    mask: date_shift
    params: { jitter_days: 30 }

triggers:
  any_detectors: ["iban", "eu_date"]`,
    sampleRows: [
      { column: 'email', input: 'hans.mueller@example.de', output: 'lisa.brown@example.com' },
      { column: 'ip_address', input: '192.168.1.42', output: '10.24.183.7' },
      { column: 'iban', input: 'DE89370400440532013000', output: '5b9f1c3a8e4d...' },
    ],
    honesty: [
      'Pseudonymisation != anonymisation under GDPR. Pseudonymised data remains personal data (Recital 26). It reduces risk but does not eliminate GDPR obligations if re-identification is possible from other data the controller holds.',
      'Does not cover consent management, data subject rights, or DPIAs. GDPR compliance requires a broader programme. This Disguise covers the pseudonymisation layer for dev/test environments.',
      'Locale defaults to en_US. Faker-generated names will look American by default. Pass locale: de_DE / fr_FR / etc. in a field rule to generate locale-appropriate pseudonyms.',
    ],
  },
  {
    id: 'ccpa',
    name: 'CCPA Disguise',
    regulation: 'California Consumer Privacy Act',
    citation: 'CCPA Section 1798.140  --  personal information categories',
    primaryBuyer: 'US consumer tech engineers',
    summary:
      "Starts from common consumer-data fields that can appear in CCPA/CPRA reviews: identifiers, contact data, internet activity signals, device IDs, and ZIP codes. " +
      'It is a practical masking template, not a replacement for consumer-rights workflows.',
    triggerDescription: 'Name + (email or phone) + (device_id or IPv4 or ZIP) appearing together',
    metaDescription:
      'CCPA-oriented starter template for common consumer-data fields such as names, emails, IPs, device IDs, ZIP codes, SSNs, and dates.',
    identifiers: [
      { label: 'Names', detector: 'person_name', strategy: 'faker  --  realistic name' },
      { label: 'Email addresses', detector: 'email', strategy: 'faker  --  realistic email' },
      { label: 'Phone numbers', detector: 'us_phone', strategy: 'faker  --  realistic phone' },
      { label: 'IP addresses', detector: 'ipv4', strategy: 'faker  --  realistic IP' },
      { label: 'Device identifiers', detector: 'device_id', strategy: 'hash sha256, truncated to 12 chars' },
      { label: 'ZIP / postal codes', detector: 'us_zip', strategy: 'truncate  --  keep first 3 digits' },
      { label: 'SSNs', detector: 'ssn', strategy: 'hash sha256' },
      { label: 'Dates (DOB, purchase dates)', detector: 'iso_date / us_date', strategy: 'date_shift +/-30 days' },
    ],
    yamlSample: `id: ccpa
name: CCPA Disguise
regulation: "CCPA Section 1798.140  --  personal information categories"

rules:
  - match:
      detectors: ["email"]
    mask: faker
    params: { provider: email }

  - match:
      detectors: ["ipv4"]
    mask: faker
    params: { provider: ipv4 }

  - match:
      detectors: ["device_id"]
    mask: hash
    params: { algorithm: sha256, truncate: 12 }

  - match:
      detectors: ["us_zip"]
    mask: truncate
    params: { length: 3 }

triggers:
  co_occurrence:
    - ["person_name", "email", "ipv4"]
    - ["person_name", "us_phone", "device_id"]`,
    sampleRows: [
      { column: 'email', input: 'alice@example.com', output: 'bob.jones@example.org' },
      { column: 'ip_address', input: '203.0.113.42', output: '198.51.100.7' },
      { column: 'device_id', input: 'IMEI-359012345678901', output: '3c8a1f4e9b2d' },
    ],
    honesty: [
      "CCPA opt-out rights are not in scope. The regulation includes consumer rights (access, delete, opt-out of sale) that require application-level changes, not just data masking.",
      "Commercial information is covered by name-hint rules only. Oddly-named columns (e.g. 'tx_amt_usd') may not be detected without a column remap in STORM.",
      'CPRA amendments (enforceable 2023) added sensitive personal information (SPI) categories including race/ethnicity, health, precise geolocation. These need additional custom rules beyond this base Disguise.',
    ],
  },
  {
    id: 'ferpa',
    name: 'FERPA Disguise',
    regulation: 'Family Educational Rights and Privacy Act',
    citation: 'FERPA 20 U.S.C. Section 1232g  --  education records',
    primaryBuyer: 'EdTech and university data engineers',
    summary:
      'Starts with common education-record fields such as student names, SSNs, student IDs, dates of birth, emails, grades, and GPA bands. ' +
      'The defaults are meant to be reviewed against the dataset and institutional policy.',
    triggerDescription: 'SSN detected, or SSN + name + date appearing together (student record pattern)',
    metaDescription:
      'FERPA-oriented starter template for education records, including student names, IDs, dates, emails, and grade/GPA handling.',
    identifiers: [
      { label: 'Student names', detector: 'person_name', strategy: 'faker  --  realistic name' },
      { label: 'Social security numbers', detector: 'ssn', strategy: 'hash sha256' },
      { label: 'Student ID numbers', strategy: 'hash sha256, truncated to 10 chars (name-hint: student_id)' },
      { label: 'Date of birth', detector: 'iso_date / us_date', strategy: 'date_shift +/-30 days' },
      { label: 'Email addresses', detector: 'email', strategy: 'faker  --  realistic email' },
      { label: 'Grades and GPA', strategy: 'bucketize  --  coarsened to letter-grade bands' },
    ],
    yamlSample: `id: ferpa
name: FERPA Disguise
regulation: "FERPA 20 U.S.C. Section 1232g  --  education records"

rules:
  - match:
      detectors: ["ssn"]
    mask: hash
    params: { algorithm: sha256 }

  - match:
      name_regex: "(?i)^(student_id|stu_id|sid|learner_id)"
    mask: hash
    params: { algorithm: sha256, truncate: 10 }

  - match:
      name_regex: "(?i)^(gpa|grade|score|marks)"
    mask: bucketize
    params: { preset: by_5_years, format: range }

triggers:
  any_detectors: ["ssn"]
  co_occurrence:
    - ["ssn", "person_name", "iso_date"]`,
    sampleRows: [
      { column: 'student_name', input: 'Alex Kim', output: 'Jordan Rivera' },
      { column: 'ssn', input: '321-54-9876', output: 'a3f2e8c1d4b5...' },
      { column: 'gpa', input: '3.72', output: '[3.5-4.0)' },
    ],
    honesty: [
      'Directory information opt-outs are not in scope. FERPA allows institutions to publish directory information unless a student opts out; this is an application-level control.',
      'Disciplinary records are covered only if column names are recognised. Non-standard column names may not be detected without a column remap in STORM.',
      'FERPA applies to institutions that receive federal funding. Private companies processing student records as school officials may also be subject to FERPA; consult legal counsel.',
    ],
  },
  {
    id: 'sox',
    name: 'SOX Disguise',
    regulation: 'Sarbanes-Oxley Act',
    citation: 'SOX Section 302 / Section 404  --  accuracy of financial reporting',
    primaryBuyer: 'Public company data engineers',
    summary:
      'Groups sensitive finance and employee fields often used in reporting test sets, including forecasts, salaries, revenue projections, account numbers, names, emails, dates, and SSNs. ' +
      'Financial amounts default to coarser ranges for review.',
    triggerDescription: 'Financial co-occurrence: IBAN + email + date in the same table',
    metaDescription:
      'SOX-oriented starter template for sensitive reporting test data, including financial figures, account numbers, employee names, emails, dates, and SSNs.',
    identifiers: [
      { label: 'Earnings / revenue forecasts', strategy: 'bucketize  --  coarsened to ranges' },
      { label: 'Salary and compensation', strategy: 'bucketize  --  coarsened to ranges' },
      { label: 'IBAN / account numbers', detector: 'iban', strategy: 'hash sha256' },
      { label: 'Employee / executive names', detector: 'person_name', strategy: 'faker  --  realistic name' },
      { label: 'Email addresses', detector: 'email', strategy: 'faker  --  realistic email' },
      { label: 'Financial dates', detector: 'iso_date', strategy: 'date_shift +/-30 days' },
      { label: 'SSNs (employee records)', detector: 'ssn', strategy: 'hash sha256' },
    ],
    yamlSample: `id: sox
name: SOX Disguise
regulation: "SOX Section 302/Section 404  --  accuracy of financial reporting"

rules:
  - match:
      name_regex: "(?i)^(forecast|revenue|earnings|ebitda|salary|compensation|bonus)"
    mask: bucketize
    params: { preset: by_decade, format: range }
    notes: "Coarsen MNPI figures to ranges."

  - match:
      detectors: ["iban"]
    mask: hash
    params: { algorithm: sha256 }

  - match:
      detectors: ["email"]
    mask: faker
    params: { provider: email }

triggers:
  co_occurrence:
    - ["iban", "email", "iso_date"]`,
    sampleRows: [
      { column: 'revenue_forecast', input: '4250000', output: '[4000000-5000000)' },
      { column: 'exec_email', input: 'cfo@company.com', output: 'r.johnson@example.com' },
      { column: 'bank_iban', input: 'GB29NWBK60161331926819', output: '7c3e9a2f1b4d...' },
    ],
    honesty: [
      'MNPI rules are contextual. Whether a financial figure is material depends on the company, timing, and regulatory context  --  not just the column name. Treat any forecast or unreleased earnings figure as MNPI regardless of whether this Disguise fires.',
      'SOX compliance centres on internal controls and audit trails, not just data masking. Decoy produces a downloadable compliance report per run; that report is one evidence artefact among many in a SOX audit.',
      'Does not cover insider trading policies. Access controls for who may query unmasked data fall under the organisation\'s acceptable-use and insider-trading programme.',
    ],
  },
  {
    id: 'default',
    name: 'Default Disguise',
    regulation: 'Generic PII',
    citation: 'OECD Privacy Principles  --  general data minimisation',
    primaryBuyer: 'Any engineering team working with user data',
    summary:
      'A starter pack for any dataset containing common PII: names, emails, phones, SSNs, ZIP codes, and dates. ' +
      'Good for teams without a specific regulatory requirement. If your data is subject to HIPAA, PCI, GDPR, or ' +
      'another regulation, use the matching Disguise instead.',
    triggerDescription: 'Name + email anywhere, or SSN anywhere  --  the broadest trigger',
    metaDescription:
      'General PII starter template for reviewable Decoy YAML workflows with names, emails, phones, SSNs, ZIP codes, and dates.',
    identifiers: [
      { label: 'Names', detector: 'person_name', strategy: 'faker  --  realistic name' },
      { label: 'Email addresses', detector: 'email', strategy: 'faker  --  realistic email' },
      { label: 'Phone numbers', detector: 'us_phone', strategy: 'faker  --  realistic phone' },
      { label: 'Social security numbers', detector: 'ssn', strategy: 'hash sha256' },
      { label: 'ZIP / postal codes', detector: 'us_zip', strategy: 'truncate  --  keep first 3 digits' },
      { label: 'Dates', detector: 'iso_date / us_date', strategy: 'date_shift +/-30 days' },
    ],
    yamlSample: `id: default
name: Default Disguise
regulation: "Generic PII  --  OECD data minimisation principles"

rules:
  - match:
      detectors: ["email"]
    mask: faker
    params: { provider: email }

  - match:
      detectors: ["us_phone"]
    mask: faker
    params: { provider: phone_number }

  - match:
      detectors: ["ssn"]
    mask: hash
    params: { algorithm: sha256 }

  - match:
      detectors: ["us_zip"]
    mask: truncate
    params: { length: 3 }

triggers:
  any_detectors: ["ssn"]
  co_occurrence:
    - ["person_name", "email"]`,
    sampleRows: [
      { column: 'full_name', input: 'Jane Doe', output: 'Maria Rodriguez' },
      { column: 'email', input: 'jane.doe@example.com', output: 'm.santos@example.org' },
      { column: 'phone', input: '(503) 555-0123', output: '(212) 555-8847' },
      { column: 'ssn', input: '321-54-9876', output: 'a3f2e8c1d4b5...' },
    ],
    honesty: [
      'No specific regulation is cited. The Default Disguise is a starting point, not a compliance artefact. If your data is subject to HIPAA, PCI, GDPR, or another regulation, use the matching Disguise instead.',
      'Coverage depends on column naming. The Default Disguise relies on name-hint and pattern detectors. Oddly-named PII columns may not be detected without a column remap in STORM.',
      'Not a substitute for a privacy impact assessment. A Disguise tells you what to mask; a PIA tells you whether you should hold the data at all.',
    ],
  },
]

export function getDisguise(id: string): Disguise | undefined {
  return DISGUISES.find((d) => d.id === id)
}

// The DISGUISE_IDS const is declared at the top of the file (line 4) as the
// single source of truth for the DisguiseId union type. A second declaration
// here as `DISGUISES.map((d) => d.id)` is a duplicate that broke `next build`
// with TS "name defined multiple times". Removed 2026-06-02 as part of the
// decoy-web content-accuracy pass. The top-of-file tuple is the canonical
// declaration; do not re-introduce the derived form.
