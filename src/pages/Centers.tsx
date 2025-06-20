
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CenterCard from '@/components/centers/CenterCard';
import AddCenterForm from '@/components/centers/AddCenterForm';
import { useAppContext } from '@/context/AppContext';
import { Center } from '@/types/center';
import { PlusCircle, Target } from 'lucide-react';
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

const Centers = () => {
  const { centers, addCenter, updateCenter, deleteCenter } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

  const handleAddCenter = (center: Center) => {
    addCenter(center);
    setIsAddDialogOpen(false);
  };

  const handleUpdateCenter = (center: Center) => {
    updateCenter(center);
    setIsEditDialogOpen(false);
  };

  const handleEditClick = (center: Center) => {
    setSelectedCenter(center);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (center: Center) => {
    setSelectedCenter(center);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCenter) {
      deleteCenter(selectedCenter.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Cricket Centers
            </h1>
            <p className="text-gray-600 mt-2">Manage your box cricket venues and facilities</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Center
          </Button>
        </div>

        {centers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-dashed border-green-200">
            <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Target className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No cricket centers yet</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Get started by adding your first box cricket center. You can manage time slots, bookings, and pricing for each venue.
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Your First Center
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {centers.map((center) => (
              <CenterCard
                key={center.id}
                center={center}
                onDelete={() => handleDeleteClick(center)}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Center Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-700">Add New Cricket Center</DialogTitle>
          </DialogHeader>
          <AddCenterForm onSubmit={handleAddCenter} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Center Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-700">Edit Cricket Center</DialogTitle>
          </DialogHeader>
          {selectedCenter && (
            <AddCenterForm
              initialData={selectedCenter}
              onSubmit={handleUpdateCenter}
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
              This will delete the cricket center "{selectedCenter?.name}" and all associated time slots and bookings.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Centers;
