import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Voter } from '@/types/voting';

interface VoterLoginProps {
  onLoginSuccess: (voter: Voter) => void;
  onRegisterClick: () => void;
}

export const VoterLogin = ({ onLoginSuccess, onRegisterClick }: VoterLoginProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if voter exists and is approved
      const voters = JSON.parse(localStorage.getItem('voters') || '[]');
      const voter = voters.find((v: Voter) => v.email === credentials.email);

      if (!voter) {
        toast({
          title: "Voter Not Found",
          description: "No voter found with this email address.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (!voter.isApproved) {
        toast({
          title: "Registration Pending",
          description: "Your registration is pending approval from the election administrator.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Simulate OTP sending
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email.",
      });

      setShowOTP(true);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate OTP verification (accept 123456 for demo)
      if (credentials.otp !== '123456') {
        toast({
          title: "Invalid OTP",
          description: "The verification code is incorrect.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const voters = JSON.parse(localStorage.getItem('voters') || '[]');
      const voter = voters.find((v: Voter) => v.email === credentials.email);

      toast({
        title: "Login Successful",
        description: "Welcome to the voting platform!",
      });

      onLoginSuccess(voter);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "An error occurred during verification.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (showOTP) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Verify Your Identity
          </CardTitle>
          <CardDescription>
            Enter the verification code sent to {credentials.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                name="otp"
                value={credentials.otp}
                onChange={handleInputChange}
                required
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              <p className="text-sm text-muted-foreground text-center">
                Demo: Use <strong>123456</strong> as the verification code
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify & Login"}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => setShowOTP(false)}
            >
              Back to Email
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Voter Login
        </CardTitle>
        <CardDescription>
          Access your voting dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Sending Code..." : "Send Verification Code"}
          </Button>

          <div className="text-center">
            <Button 
              type="button" 
              variant="link" 
              onClick={onRegisterClick}
              className="text-sm"
            >
              Don't have an account? Register here
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};