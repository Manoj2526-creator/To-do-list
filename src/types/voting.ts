export interface Voter {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isVerified: boolean;
  isApproved: boolean;
  registrationDate: string;
  hasVoted: { [electionId: string]: boolean };
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
  imageUrl?: string;
  electionId: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  candidates: Candidate[];
  totalVotes: number;
  results?: { [candidateId: string]: number };
}

export interface Vote {
  id: string;
  voterId: string;
  electionId: string;
  candidateId: string;
  timestamp: string;
  encrypted: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  voter: Voter | null;
  isAdmin: boolean;
  token?: string;
}