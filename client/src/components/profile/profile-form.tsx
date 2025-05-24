import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { User } from '../../types/user';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from '../ui/use-toast';
import { AvatarUpload } from './avatar-upload';

export function ProfileForm() {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUserProfile(formData);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AvatarUpload />
      
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="text-sm font-medium">Username</label>
          <Input
            id="username"
            value={formData.username || ''}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label htmlFor="name" className="text-sm font-medium">Display Name</label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your display name"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="bio" className="text-sm font-medium">Bio</label>
          <Textarea
            id="bio"
            value={formData.bio || ''}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="website" className="text-sm font-medium">Website</label>
          <Input
            id="website"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://your-website.com"
          />
        </div>

        <div>
          <label htmlFor="github" className="text-sm font-medium">GitHub</label>
          <Input
            id="github"
            value={formData.github || ''}
            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
            placeholder="Your GitHub username"
          />
        </div>

        <div>
          <label htmlFor="twitter" className="text-sm font-medium">Twitter</label>
          <Input
            id="twitter"
            value={formData.twitter || ''}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            placeholder="Your Twitter handle"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
