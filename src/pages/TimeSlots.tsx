
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

const TimeSlots = () => {
  const { centerId } = useParams<{ centerId: string }>();
  const navigate = useNavigate();
  const { 
    getCenterById, 
    getTimeSlotsByCenterId, 
    addTimeSlots, 
    updateTimeSlot, 
    deleteTimeSlot,
    centers
  } = useAppContext();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  
  // Redirect to centers page if no center ID or invalid ID
  useEffect(() => {
    if (!centerId) {
      toast({
        title: "Error",
        description: "No center selected. Please choose a center.",
        variant: "destructive",
      });
      navigate('/centers');
      return;
    }

    const center = getCenterById(centerId);
    if (!center) {
      toast({
        title: "Error",
        description: "Invalid center ID. Please select a valid center.",
        variant: "destructive",
      });
      navigate('/centers');
    }
  }, [centerId, getCenterById, navigate]);
  
  if (!centerId) {
    return null; // Will redirect in useEffect
  }
  
  const center = getCenterById(centerId);
  const slots = getTimeSlotsByCenterId(centerId);
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
  
  if (!center) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <Link 
              to="/centers" 
              className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Centers
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {center.name}
              </h1>
              <span className="text-muted-foreground">Time Slots</span>
            </div>
            <p className="text-muted-foreground">{center.location} • {center.courts} Courts • {center.capacity} Capacity</p>
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
            <p className="text-muted-foreground mb-4 text-center">Time slots help you manage cricket schedules and pricing.</p>
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
      
      {/* Add Time Slots Dialog - Made scrollable */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Time Slots for {center.name}</DialogTitle>
          </DialogHeader>
          <TimeSlotForm
            centerId={centerId}
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
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete this time slot. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="w-full sm:w-auto bg-destructive text-destructive-foreground"
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
