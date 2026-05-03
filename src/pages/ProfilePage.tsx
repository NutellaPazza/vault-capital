import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut, Shield, Bell } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAppStore();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!currentUser) return null;

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Profile & Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label className="text-muted-foreground">Name</Label><p className="font-medium">{currentUser.name}</p></div>
            <div><Label className="text-muted-foreground">Email</Label><p className="font-medium">{currentUser.email}</p></div>
            <div><Label className="text-muted-foreground">Risk Profile</Label><p className="font-medium capitalize">{currentUser.risk_profile}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> KYC Status</CardTitle></CardHeader>
          <CardContent>
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${currentUser.kyc_status === 'verified' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
              {currentUser.kyc_status === 'verified' ? '✓ Verified' : currentUser.kyc_status === 'pending' ? '⏳ Pending' : '○ Not Started'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'new_pools', label: 'New Pool Alerts' },
              { key: 'portfolio_updates', label: 'Portfolio Updates' },
              { key: 'marketplace_activity', label: 'Marketplace Activity' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <Label>{item.label}</Label>
                <Switch 
                  checked={currentUser.notification_preferences[item.key as keyof typeof currentUser.notification_preferences]} 
                  onCheckedChange={(checked) => updateUserProfile({ notification_preferences: { ...currentUser.notification_preferences, [item.key]: checked } })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button variant="destructive" onClick={handleLogout} className="w-full gap-2"><LogOut className="h-4 w-4" /> Sign Out</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
