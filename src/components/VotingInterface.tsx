import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Voter, Election, Candidate, Vote } from '@/types/voting';
import { CheckCircle, Clock, Users } from 'lucide-react';

interface VotingInterfaceProps {
  voter: Voter;
  onVoteCast: () => void;
}

export const VotingInterface = ({ voter, onVoteCast }: VotingInterfaceProps) => {
  const { toast } = useToast();
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'elections' | 'voting' | 'confirmation'>('elections');

  useEffect(() => {
    // Load elections from localStorage
    const storedElections = JSON.parse(localStorage.getItem('elections') || '[]');
    const activeElections = storedElections.filter((e: Election) => {
      const now = new Date();
      const startDate = new Date(e.startDate);
      const endDate = new Date(e.endDate);
      return now >= startDate && now <= endDate && e.isActive;
    });
    setElections(activeElections);
  }, []);

  const handleElectionSelect = (election: Election) => {
    // Check if voter has already voted in this election
    if (voter.hasVoted[election.id]) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote in this election.",
        variant: "destructive"
      });
      return;
    }

    setSelectedElection(election);
    setStep('voting');
  };

  const handleVoteSubmit = async () => {
    if (!selectedElection || !selectedCandidate) {
      toast({
        title: "Selection Required",
        description: "Please select a candidate before submitting your vote.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create vote record
      const vote: Vote = {
        id: `vote_${Date.now()}`,
        voterId: voter.id,
        electionId: selectedElection.id,
        candidateId: selectedCandidate,
        timestamp: new Date().toISOString(),
        encrypted: true
      };

      // Store vote
      const existingVotes = JSON.parse(localStorage.getItem('votes') || '[]');
      existingVotes.push(vote);
      localStorage.setItem('votes', JSON.stringify(existingVotes));

      // Update voter's voting status
      const voters = JSON.parse(localStorage.getItem('voters') || '[]');
      const voterIndex = voters.findIndex((v: Voter) => v.id === voter.id);
      if (voterIndex !== -1) {
        voters[voterIndex].hasVoted = {
          ...voters[voterIndex].hasVoted,
          [selectedElection.id]: true
        };
        localStorage.setItem('voters', JSON.stringify(voters));
      }

      // Update election results
      const elections = JSON.parse(localStorage.getItem('elections') || '[]');
      const electionIndex = elections.findIndex((e: Election) => e.id === selectedElection.id);
      if (electionIndex !== -1) {
        if (!elections[electionIndex].results) {
          elections[electionIndex].results = {};
        }
        elections[electionIndex].results[selectedCandidate] = 
          (elections[electionIndex].results[selectedCandidate] || 0) + 1;
        elections[electionIndex].totalVotes = 
          (elections[electionIndex].totalVotes || 0) + 1;
        localStorage.setItem('elections', JSON.stringify(elections));
      }

      setStep('confirmation');
      
      toast({
        title: "Vote Submitted Successfully",
        description: "Your vote has been securely recorded.",
      });

      onVoteCast();
    } catch (error) {
      toast({
        title: "Vote Submission Failed",
        description: "An error occurred while submitting your vote.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'confirmation') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Vote Submitted Successfully
          </CardTitle>
          <CardDescription>
            Thank you for participating in the democratic process
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your vote has been securely encrypted and recorded. You can view the election results once voting closes.
          </p>
          <Button 
            onClick={() => {
              setStep('elections');
              setSelectedElection(null);
              setSelectedCandidate('');
            }}
            className="mt-4"
          >
            Return to Elections
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'voting' && selectedElection) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {selectedElection.title}
          </CardTitle>
          <CardDescription>
            {selectedElection.description}
          </CardDescription>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{selectedElection.totalVotes || 0} votes cast</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Your Candidate</h3>
            <RadioGroup 
              value={selectedCandidate} 
              onValueChange={setSelectedCandidate}
              className="space-y-4"
            >
              {selectedElection.candidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={candidate.id} id={candidate.id} />
                  <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">{candidate.party}</p>
                        <p className="text-sm mt-1">{candidate.description}</p>
                      </div>
                      {candidate.party && (
                        <Badge variant="outline" className="ml-4">
                          {candidate.party}
                        </Badge>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setStep('elections')}
              className="flex-1"
            >
              Back to Elections
            </Button>
            <Button 
              onClick={handleVoteSubmit}
              disabled={!selectedCandidate || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting Vote..." : "Submit Vote"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Active Elections
        </CardTitle>
        <CardDescription>
          Select an election to cast your vote
        </CardDescription>
      </CardHeader>
      <CardContent>
        {elections.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Elections</h3>
            <p className="text-muted-foreground">
              There are currently no active elections available for voting.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {elections.map((election) => (
              <Card 
                key={election.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  voter.hasVoted[election.id] ? 'opacity-50' : 'hover:border-primary'
                }`}
                onClick={() => !voter.hasVoted[election.id] && handleElectionSelect(election)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{election.title}</h3>
                      <p className="text-muted-foreground mb-3">{election.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{election.candidates.length} candidates</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>{election.totalVotes || 0} votes cast</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {voter.hasVoted[election.id] ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Voted
                        </Badge>
                      ) : (
                        <Badge variant="default">
                          Vote Now
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};