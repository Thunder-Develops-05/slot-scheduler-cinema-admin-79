import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { TimeSlot } from '@/types/timeSlot';
import TimeSlotCard from '@/components/time-slots/TimeSlotCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { groupSlotsByDay } from '@/utils/timeSlotUtils';
import EditTimeSlotDialog from '@/components/time-slots/EditTimeSlotDialog';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import TimeSlotForm from '@/components/time-slots/TimeSlotForm';
import { useIsMobile } from '@/hooks/use-mobile';

const TimeSlots = () => {
  const { theaterId } = useParams<{ theaterId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    getTheaterById, 
    getTimeSlotsByTheaterId, 
    addTimeSlots, 
    updateTimeSlot, 
    deleteTimeSlot,
    theaters
  } = useAppContext();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  
  // Redirect to theaters page if no theater ID or invalid ID
  useEffect(() => {
    if (!theaterId) {
      toast({
        title: "Error",
        description: "No theater selected. Please choose a theater.",
        variant: "destructive",
      });
      navigate('/theaters');
      return;
    }

    const theater = getTheaterById(theaterId);
    if (!theater) {
      toast({
        title: "Error",
        description: "Invalid theater ID. Please select a valid theater.",
        variant: "destructive",
      });
      navigate('/theaters');
    }
  }, [theaterId, getTheaterById, navigate]);
  
  if (!theaterId) {
    return null; // Will redirect in useEffect
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
    toast({
      title: "Success",
      description: `${newSlots.length} time slots added successfully.`,
    });
  };
  
  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEdit = (updatedSlot: TimeSlot) => {
    updateTimeSlot(updatedSlot);
    setIsEditDialogOpen(false);
    setEditingSlot(null);
    toast({
      title: "Success",
      description: "Time slot updated successfully.",
    });
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
      toast({
        title: "Success",
        description: "Time slot deleted successfully.",
      });
    }
  };
  
  if (!theater) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <Link 
              to="/theaters" 
              className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Theaters
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {theater.name}
              </h1>
              <span className="text-muted-foreground">Time Slots</span>
            </div>
            <p className="text-muted-foreground">{theater.location} • {theater.screens} Screens • {theater.capacity} Seats</p>
          </div>
          
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full lg:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Time Slots
          </Button>
        </div>

        {slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
            <Info className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No time slots yet</h3>
            <p className="text-muted-foreground mb-4 text-center">Time slots help you manage movie schedules and ticket pricing.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Time Slots
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="mb-4 flex flex-nowrap min-w-max">
                <TabsTrigger value="all">All Days</TabsTrigger>
                <TabsTrigger value="weekdays">Weekdays</TabsTrigger>
                <TabsTrigger value="weekend">Weekend</TabsTrigger>
                {dayNames.map((day) => (
                  <TabsTrigger key={day} value={day} className="hidden md:flex capitalize">
                    {day.substring(0, 3)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-6 mt-2">
              {dayNames.map((day) => {
                const daySlots = groupedSlots[day] || [];
                if (daySlots.length === 0) return null;
                
                return (
                  <div key={day} className="mb-6">
                    <h3 className="text-lg font-medium capitalize mb-4 px-1">
                      {day}
                      <span className="text-muted-foreground ml-2 text-sm font-normal">
                        ({daySlots.length} slots)
                      </span>
                    </h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            
            <TabsContent value="weekdays" className="space-y-8">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => {
                const daySlots = groupedSlots[day] || [];
                if (daySlots.length === 0) return null;
                
                return (
                  <div key={day} className="mb-8">
                    <h3 className="text-lg font-medium capitalize mb-4 px-1">
                      {day}
                      <span className="text-muted-foreground ml-2 text-sm font-normal">
                        ({daySlots.length} slots)
                      </span>
                    </h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            
            <TabsContent value="weekend" className="space-y-8">
              {['saturday', 'sunday'].map((day) => {
                const daySlots = groupedSlots[day] || [];
                if (daySlots.length === 0) return null;
                
                return (
                  <div key={day} className="mb-8">
                    <h3 className="text-lg font-medium capitalize mb-4 px-1">
                      {day}
                      <span className="text-muted-foreground ml-2 text-sm font-normal">
                        ({daySlots.length} slots)
                      </span>
                    </h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            
            {dayNames.map((day) => (
              <TabsContent key={day} value={day} className="space-y-8">
                {(() => {
                  const daySlots = groupedSlots[day] || [];
                  if (daySlots.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground mb-4">No time slots for {day}.</p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                          Add Time Slots
                        </Button>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {daySlots.map((slot) => (
                        <TimeSlotCard
                          key={slot.id}
                          slot={slot}
                          onDelete={handleDeleteClick}
                          onEdit={handleEditSlot}
                        />
                      ))}
                    </div>
                  );
                })()}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
      
      {/* Add Time Slots Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className={isMobile ? "max-w-[95vw] h-[90vh] overflow-y-auto" : "max-w-[650px] max-h-[90vh] overflow-y-auto"}>
          <DialogHeader>
            <DialogTitle>Add Time Slots for {theater.name}</DialogTitle>
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
        <AlertDialogContent className={isMobile ? "max-w-[90vw]" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete this time slot. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
            <AlertDialogCancel className={isMobile ? "w-full mt-2" : ""}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className={`bg-destructive text-destructive-foreground ${isMobile ? "w-full" : ""}`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default TimeSlots;
