export type Sex = 'Female' | 'Male' | 'Other' | ''
export interface Patient { id: string; name: string; dob: string; sex: Sex; note: string }
export interface Study { id: string; title: string; patientId: string; date: string; modality: string; slices: number }
export interface CaseRec { id: string; name: string; patientId: string; studyId: string | null; created: string; modified: string; status: 'Open' | 'In review' | 'Closed'; symptoms: string; notes: string }
export interface Paper { id: string; title: string; authors: string; venue: string; date: string; abstract: string }
export type Section = 'patients' | 'cases' | 'mri' | 'research'
export interface Overlay { section: Section; detail?: { kind: 'patient' | 'study' | 'paper'; id: string } }
export interface NewCaseDraft { pMode: 'existing' | 'new'; pid: string; np: { name: string; dob: string; sex: Sex; note: string }; name: string; symptoms: string; notes: string; mMode: 'existing' | 'upload'; sid: string; file: string }
