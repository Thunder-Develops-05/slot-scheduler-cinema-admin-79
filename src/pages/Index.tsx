
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, Clock, DollarSign, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon,
  className = "" 
}: { 
  title: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const Index = () => {
  const { theaters, timeSlots } = useAppContext();
  
  // Calculate some stats
  const totalTheaters = theaters.length;
  const totalTimeSlots = timeSlots.length;
  const totalRevenue = timeSlots.reduce((sum, slot) => sum + slot.price, 0);
  const totalScreens = theaters.reduce((sum, theater) => sum + theater.screens, 0);

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button asChild>
            <Link to="/theaters">Manage Theaters</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Total Theaters" 
            value={totalTheaters} 
            icon={Film}
          />
          <DashboardCard 
            title="Total Time Slots" 
            value={totalTimeSlots} 
            icon={Clock}
          />
          <DashboardCard 
            title="Potential Revenue" 
            value={`$${totalRevenue.toFixed(2)}`} 
            icon={DollarSign}
          />
          <DashboardCard 
            title="Total Screens" 
            value={totalScreens} 
            icon={Clapperboard}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Welcome to Theater Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Manage your theaters and time slots efficiently with our admin dashboard.</p>
              
              <div className="flex flex-col space-y-2">
                {theaters.length === 0 ? (
                  <p>No theaters added yet. Get started by adding your first theater.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {theaters.slice(0, 3).map((theater) => (
                      <Card key={theater.id} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="font-medium">{theater.name}</div>
                          <div className="text-sm text-muted-foreground">{theater.location}</div>
                          <div className="text-sm mt-2">
                            {timeSlots.filter(s => s.theaterId === theater.id).length} time slots
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
