
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserHeader from '@/components/user/UserHeader';
import TabNavigation from '@/components/user/TabNavigation';
import { Bell, Calendar, CreditCard, Star, Users } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'reminder' | 'update';
  title: string;
  message: string;
  time: Date;
  read: boolean;
  icon: any;
}

const UserNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your slot for tomorrow at SportZone has been confirmed',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      icon: Calendar,
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Booking Reminder',
      message: 'You have a cricket slot booked for today at 6:00 PM',
      time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: false,
      icon: Bell,
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Successful',
      message: '₹500 has been added to your wallet',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      icon: CreditCard,
    },
    {
      id: '4',
      type: 'update',
      title: 'New Feature Available',
      message: 'You can now rate your booking experience',
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      icon: Star,
    },
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-green-100 text-green-800';
      case 'payment': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-orange-100 text-orange-800';
      case 'update': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 pb-20">
      <UserHeader />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-purple-800">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-purple-600">You have {unreadCount} unread notifications</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              className="border-purple-200 text-purple-600"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card className="text-center py-12 border-purple-200">
            <CardContent>
              <Bell className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                No notifications yet
              </h3>
              <p className="text-purple-600">
                We'll notify you about bookings, payments, and updates here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              
              return (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.read 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-purple-200 bg-white'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${
                            !notification.read ? 'text-purple-900' : 'text-purple-800'
                          }`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {getTimeAgo(notification.time)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className={`text-sm ${
                          !notification.read ? 'text-purple-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <Badge 
                          variant="secondary" 
                          className={`mt-2 text-xs ${getTypeColor(notification.type)}`}
                        >
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <TabNavigation />
    </div>
  );
};

export default UserNotifications;
