import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Voter } from '@/types/voting';

interface VoterRegistrationProps {
  onRegistrationComplete: (voter: Voter) => void;
}

export const VoterRegistration = ({ onRegistrationComplete }: VoterRegistrationProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    confirmEmail: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.email !== formData.confirmEmail) {
      toast({
        title: "Email Mismatch",
        description: "Email addresses do not match.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Simulate registration API call
      const newVoter: Voter = {
        id: `voter_${Date.now()}`,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        isVerified: false,
        isApproved: false,
        registrationDate: new Date().toISOString(),
        hasVoted: {}
      };

      // Store in localStorage for demo
      const existingVoters = JSON.parse(localStorage.getItem('voters') || '[]');
      
      // Check if email already exists
      if (existingVoters.find((v: Voter) => v.email === formData.email)) {
        toast({
          title: "Email Already Registered",
          description: "This email address is already registered.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      existingVoters.push(newVoter);
      localStorage.setItem('voters', JSON.stringify(existingVoters));

      toast({
        title: "Registration Successful",
        description: "Your registration has been submitted for approval.",
      });

      onRegistrationComplete(newVoter);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Voter Registration
        </CardTitle>
        <CardDescription>
          Register to participate in upcoming elections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="john.doe@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmEmail">Confirm Email</Label>
            <Input
              id="confirmEmail"
              name="confirmEmail"
              type="email"
              value={formData.confirmEmail}
              onChange={handleInputChange}
              required
              placeholder="john.doe@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register to Vote"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};