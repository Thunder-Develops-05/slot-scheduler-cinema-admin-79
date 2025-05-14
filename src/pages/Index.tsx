
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, Clock, DollarSign, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import DashboardCalendar from '@/components/calendar/DashboardCalendar';

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
  <Card className={`${className} card-hover`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
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
      <div className="flex flex-col space-y-6 animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back to your theater management system</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
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
        
        {/* Calendar Section */}
        <Card className="col-span-2 overflow-hidden">
          <CardHeader className="bg-secondary/40 pb-3">
            <CardTitle>Theater Calendar</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <DashboardCalendar />
          </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader className="bg-secondary/40 pb-3">
              <CardTitle>Theater Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-muted-foreground">Manage your theaters and time slots efficiently with our admin dashboard.</p>
              
              <div className="flex flex-col space-y-2">
                {theaters.length === 0 ? (
                  <div className="p-8 text-center bg-secondary/30 rounded-lg">
                    <p className="text-muted-foreground">No theaters added yet. Get started by adding your first theater.</p>
                    <Button asChild className="mt-4">
                      <Link to="/theaters">Add Theater</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {theaters.slice(0, 3).map((theater) => (
                      <Card key={theater.id} className="bg-secondary/30 card-hover">
                        <CardContent className="p-4">
                          <div className="font-medium text-lg">{theater.name}</div>
                          <div className="text-sm text-muted-foreground">{theater.location}</div>
                          <div className="text-sm mt-2 flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-primary" />
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
