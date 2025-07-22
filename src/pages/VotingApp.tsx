import { useState, useEffect } from 'react';
import { VoterRegistration } from '@/components/VoterRegistration';
import { VoterLogin } from '@/components/VoterLogin';
import { VotingInterface } from '@/components/VotingInterface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Voter, Election, Candidate } from '@/types/voting';
import { Vote, LogOut, Shield, Users } from 'lucide-react';

export const VotingApp = () => {
  const [currentView, setCurrentView] = useState<'welcome' | 'login' | 'register' | 'voting'>('welcome');
  const [authenticatedVoter, setAuthenticatedVoter] = useState<Voter | null>(null);

  useEffect(() => {
    // Initialize demo data
    initializeDemoData();
  }, []);

  const initializeDemoData = () => {
    // Create demo elections if they don't exist
    const existingElections = localStorage.getItem('elections');
    if (!existingElections) {
      const demoElections: Election[] = [
        {
          id: 'election_1',
          title: '2024 Presidential Election',
          description: 'Choose the next President of the United States',
          startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Started yesterday
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 7 days
          isActive: true,
          candidates: [
            {
              id: 'candidate_1',
              name: 'John Smith',
              party: 'Democratic Party',
              description: 'Experienced leader focused on healthcare and education reform',
              electionId: 'election_1'
            },
            {
              id: 'candidate_2',
              name: 'Sarah Johnson',
              party: 'Republican Party',
              description: 'Business leader committed to economic growth and security',
              electionId: 'election_1'
            },
            {
              id: 'candidate_3',
              name: 'Michael Brown',
              party: 'Independent',
              description: 'Progressive advocate for environmental and social justice',
              electionId: 'election_1'
            }
          ],
          totalVotes: 0
        },
        {
          id: 'election_2',
          title: 'City Mayor Election',
          description: 'Select the mayor for the next 4-year term',
          startDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // Started 12 hours ago
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 3 days
          isActive: true,
          candidates: [
            {
              id: 'candidate_4',
              name: 'Emily Davis',
              party: 'Progressive Coalition',
              description: 'Community organizer focused on affordable housing and transit',
              electionId: 'election_2'
            },
            {
              id: 'candidate_5',
              name: 'Robert Wilson',
              party: 'Civic Alliance',
              description: 'Former city council member with 15 years of public service',
              electionId: 'election_2'
            }
          ],
          totalVotes: 0
        }
      ];
      localStorage.setItem('elections', JSON.stringify(demoElections));
    }

    // Create demo approved voter if it doesn't exist
    const existingVoters = JSON.parse(localStorage.getItem('voters') || '[]');
    const demoVoterExists = existingVoters.find((v: Voter) => v.email === 'demo@voter.com');
    
    if (!demoVoterExists) {
      const demoVoter: Voter = {
        id: 'demo_voter_1',
        email: 'demo@voter.com',
        firstName: 'Demo',
        lastName: 'Voter',
        phoneNumber: '+1 (555) 123-4567',
        isVerified: true,
        isApproved: true,
        registrationDate: new Date().toISOString(),
        hasVoted: {}
      };
      
      existingVoters.push(demoVoter);
      localStorage.setItem('voters', JSON.stringify(existingVoters));
    }
  };

  const handleRegistrationComplete = (voter: Voter) => {
    setCurrentView('login');
  };

  const handleLoginSuccess = (voter: Voter) => {
    setAuthenticatedVoter(voter);
    setCurrentView('voting');
  };

  const handleLogout = () => {
    setAuthenticatedVoter(null);
    setCurrentView('welcome');
  };

  const handleVoteCast = () => {
    // Refresh voter data to update voting status
    if (authenticatedVoter) {
      const voters = JSON.parse(localStorage.getItem('voters') || '[]');
      const updatedVoter = voters.find((v: Voter) => v.id === authenticatedVoter.id);
      if (updatedVoter) {
        setAuthenticatedVoter(updatedVoter);
      }
    }
  };

  if (currentView === 'voting' && authenticatedVoter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Vote className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                SecureVote
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Welcome, {authenticatedVoter.firstName} {authenticatedVoter.lastName}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <VotingInterface 
            voter={authenticatedVoter} 
            onVoteCast={handleVoteCast}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2">
            <Vote className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SecureVote
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'welcome' && (
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold mb-4">
                Secure Online Voting Platform
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Participate in democratic elections with confidence using our secure, 
                transparent, and user-friendly voting system.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Secure & Encrypted</h3>
                  <p className="text-sm text-muted-foreground">
                    Your vote is protected with end-to-end encryption and multi-factor authentication
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Verified Voters</h3>
                  <p className="text-sm text-muted-foreground">
                    All voters are verified and approved to ensure election integrity
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Vote className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple, guided voting process accessible from any device
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setCurrentView('login')}
                  className="px-8"
                >
                  Login to Vote
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setCurrentView('register')}
                  className="px-8"
                >
                  Register to Vote
                </Button>
              </div>
              
              <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Demo Access</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Try the platform with demo credentials:
                  </p>
                  <p className="text-sm font-mono text-blue-800">
                    Email: demo@voter.com<br />
                    OTP Code: 123456
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'login' && (
          <div className="max-w-md mx-auto">
            <VoterLogin 
              onLoginSuccess={handleLoginSuccess}
              onRegisterClick={() => setCurrentView('register')}
            />
            <div className="text-center mt-4">
              <Button 
                variant="link" 
                onClick={() => setCurrentView('welcome')}
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        )}

        {currentView === 'register' && (
          <div className="max-w-md mx-auto">
            <VoterRegistration onRegistrationComplete={handleRegistrationComplete} />
            <div className="text-center mt-4">
              <Button 
                variant="link" 
                onClick={() => setCurrentView('welcome')}
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};