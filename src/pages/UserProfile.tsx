
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import UserHeader from '@/components/user/UserHeader';
import TabNavigation from '@/components/user/TabNavigation';
import { User, Wallet, CreditCard, Users, Settings, Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const { walletBalance, walletTransactions, addWalletCredit } = useBooking();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');

  const handleAddCredit = () => {
    const amount = parseFloat(creditAmount);
    if (amount > 0) {
      addWalletCredit(amount, 'Manual credit addition');
      setCreditAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 pb-20">
      <UserHeader />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Info */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-800">{user?.name}</h3>
                <p className="text-purple-600">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Section */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Wallet className="h-5 w-5" />
              Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-100">Available Balance</p>
                  <p className="text-2xl font-bold">₹{walletBalance.toFixed(2)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Add Credits
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Credits to Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 500, 1000].map(amount => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => setCreditAmount(amount.toString())}
                        className="border-purple-200 text-purple-600"
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>
                  <Button onClick={handleAddCredit} className="w-full">
                    Add Credits
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Recent Transactions */}
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-800">Recent Transactions</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {walletTransactions.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span>Dark Mode</span>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Teams (Future Feature) */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Users className="h-5 w-5" />
              My Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center py-4">
              Team management feature coming soon!
            </p>
            <Button variant="outline" className="w-full" disabled>
              Create Team
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          onClick={logout}
          variant="destructive" 
          className="w-full"
        >
          Logout
        </Button>
      </main>

      <TabNavigation />
    </div>
  );
};

export default UserProfile;
