
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { TimeSlot } from '@/types/timeSlot';
import TimeSlotCard from '@/components/time-slots/TimeSlotCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { groupSlotsByDay } from '@/utils/timeSlotUtils';
import EditTimeSlotDialog from '@/components/time-slots/EditTimeSlotDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TimeSlotForm from '@/components/time-slots/TimeSlotForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TimeSlots = () => {
  const { theaterId } = useParams<{ theaterId: string }>();
  const { 
    getTheaterById, 
    getTimeSlotsByTheaterId, 
    addTimeSlots, 
    updateTimeSlot, 
    deleteTimeSlot 
  } = useAppContext();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  
  if (!theaterId) {
    return <div>Invalid theater ID</div>;
  }
  
  const theater = getTheaterById(theaterId);
  const slots = getTimeSlotsByTheaterId(theaterId);
  const groupedSlots = groupSlotsByDay(slots);
  
  const dayNames = [
    'monday', 'tuesday', 'wednesday', 
    'thursday', 'friday', 'saturday', 'sunday'
  ];
  
  const handleAddTimeSlots = (newSlots: TimeSlot[]) => {
    addTimeSlots(newSlots);
    setIsAddDialogOpen(false);
  };
  
  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEdit = (updatedSlot: TimeSlot) => {
    updateTimeSlot(updatedSlot);
    setIsEditDialogOpen(false);
    setEditingSlot(null);
  };
  
  const handleDeleteClick = (slotId: string) => {
    setSlotToDelete(slotId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (slotToDelete) {
      deleteTimeSlot(slotToDelete);
      setIsDeleteDialogOpen(false);
      setSlotToDelete(null);
    }
  };
  
  if (!theater) {
    return (
      <Layout>
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Theater not found</h1>
          <Button asChild>
            <Link to="/theaters">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Theaters
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link 
              to="/theaters" 
              className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Theaters
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {theater.name} - Time Slots
            </h1>
            <p className="text-muted-foreground">{theater.location}</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Time Slots
          </Button>
        </div>

        {slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium mb-2">No time slots yet</h3>
            <p className="text-muted-foreground mb-4">Add time slots for this theater.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Time Slots
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Days</TabsTrigger>
              <TabsTrigger value="weekdays">Weekdays</TabsTrigger>
              <TabsTrigger value="weekend">Weekend</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {dayNames.map((day) => {
                const daySlots = groupedSlots[day] || [];
                if (daySlots.length === 0) return null;
                
                return (
                  <div key={day} className="mb-8">
                    <h3 className="text-lg font-medium capitalize mb-4">{day}</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {daySlots.map((slot) => (
                        <TimeSlotCard
                          key={slot.id}
                          slot={slot}
                          onDelete={handleDeleteClick}
                          onEdit={handleEditSlot}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            
            <TabsContent value="weekdays">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => {
                const daySlots = groupedSlots[day] || [];
                if (daySlots.length === 0) return null;
                
                return (
                  <div key={day} className="mb-8">
                    <h3 className="text-lg font-medium capitalize mb-4">{day}</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {daySlots.map((slot) => (
                        <TimeSlotCard
                          key={slot.id}
                          slot={slot}
                          onDelete={handleDeleteClick}
                          onEdit={handleEditSlot}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            
            <TabsContent value="weekend">
              {['saturday', 'sunday'].map((day) => {
                const daySlots = groupedSlots[day] || [];
                if (daySlots.length === 0) return null;
                
                return (
                  <div key={day} className="mb-8">
                    <h3 className="text-lg font-medium capitalize mb-4">{day}</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {daySlots.map((slot) => (
                        <TimeSlotCard
                          key={slot.id}
                          slot={slot}
                          onDelete={handleDeleteClick}
                          onEdit={handleEditSlot}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      {/* Add Time Slots Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Add Time Slots</DialogTitle>
          </DialogHeader>
          <TimeSlotForm
            theaterId={theaterId}
            onSubmit={handleAddTimeSlots}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Time Slot Dialog */}
      <EditTimeSlotDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingSlot(null);
        }}
        slot={editingSlot}
        onSave={handleSaveEdit}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete this time slot. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default TimeSlots;
