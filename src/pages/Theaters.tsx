
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TheaterCard from '@/components/theaters/TheaterCard';
import AddTheaterForm from '@/components/theaters/AddTheaterForm';
import { useAppContext } from '@/context/AppContext';
import { Theater } from '@/types/theater';
import { PlusCircle } from 'lucide-react';
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

const Theaters = () => {
  const { theaters, addTheater, updateTheater, deleteTheater } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);

  const handleAddTheater = (theater: Theater) => {
    addTheater(theater);
    setIsAddDialogOpen(false);
  };

  const handleUpdateTheater = (theater: Theater) => {
    updateTheater(theater);
    setIsEditDialogOpen(false);
  };

  const handleEditClick = (theater: Theater) => {
    setSelectedTheater(theater);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (theater: Theater) => {
    setSelectedTheater(theater);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTheater) {
      deleteTheater(selectedTheater.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Theaters</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Theater
          </Button>
        </div>

        {theaters.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium mb-2">No theaters yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first theater.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Theater
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {theaters.map((theater) => (
              <TheaterCard
                key={theater.id}
                theater={theater}
                onDelete={(id) => handleDeleteClick(theater)}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Theater Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Theater</DialogTitle>
          </DialogHeader>
          <AddTheaterForm onSubmit={handleAddTheater} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Theater Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Theater</DialogTitle>
          </DialogHeader>
          {selectedTheater && (
            <AddTheaterForm
              initialData={selectedTheater}
              onSubmit={handleUpdateTheater}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the theater "{selectedTheater?.name}" and all associated time slots.
              This action cannot be undone.
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

export default Theaters;
