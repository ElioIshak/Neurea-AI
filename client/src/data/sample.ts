import type { CaseRec, Paper, Patient, Study } from '../types'
// DEMONSTRATION DATA ONLY. Not real patients, studies, or literature.
export const user = { name: 'Demo User', email: 'demo.user@example.com' }
export const samplePatients: Patient[] = [
  { id: 'p1', name: 'Sample Patient A', dob: '1968-04-12', sex: 'Female', note: 'Demonstration note.' },
  { id: 'p2', name: 'Sample Patient B', dob: '1975-09-30', sex: 'Male', note: '' },
]
export const sampleStudies: Study[] = [
  { id: 's1', title: 'Sample brain MRI, T1 post-contrast', patientId: 'p1', date: '2026-09-14', modality: 'MR', slices: 24 },
  { id: 's2', title: 'Sample brain MRI, FLAIR', patientId: 'p2', date: '2026-09-20', modality: 'MR', slices: 30 },
]
export const sampleCases: CaseRec[] = [
  { id: 'c1', name: 'Sample case 1', patientId: 'p1', studyId: 's1', created: '2026-09-15', modified: '2026-10-02', status: 'In review', symptoms: 'Recurrent headaches (demonstration entry).', notes: '' },
  { id: 'c2', name: 'Sample case 2', patientId: 'p2', studyId: 's2', created: '2026-09-21', modified: '2026-09-21', status: 'Open', symptoms: '', notes: '' },
]
export const samplePapers: Paper[] = [1, 2, 3].map((n) => ({ id: `r${n}`, title: `Demonstration record ${n}: placeholder paper title`, authors: 'Placeholder Author(s)', venue: 'Placeholder Journal', date: '2026', abstract: 'Placeholder abstract text shown only to demonstrate the layout. This is not a real publication.' }))
