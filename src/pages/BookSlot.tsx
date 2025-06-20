
import React from 'react';
import UserBooking from './UserBooking';
import TabNavigation from '@/components/user/TabNavigation';

const BookSlot = () => {
  return (
    <div className="pb-20">
      <UserBooking />
      <TabNavigation />
    </div>
  );
};

export default BookSlot;
