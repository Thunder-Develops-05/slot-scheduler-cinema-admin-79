
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Center } from '@/types/center';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AddCenterFormProps {
  onSubmit: (center: Center) => void;
  onCancel: () => void;
  initialData?: Center;
}

const AddCenterForm = ({ onSubmit, onCancel, initialData }: AddCenterFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    address: initialData?.address || '',
    contactNumber: initialData?.contactNumber || '',
    capacity: initialData?.capacity || 12,
    courts: initialData?.courts || 1,
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    isActive: initialData?.isActive ?? true,
  });

  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
  const [newAmenity, setNewAmenity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const center: Center = {
      id: initialData?.id || Date.now().toString(),
      ...formData,
      amenities,
    };

    onSubmit(center);
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter(a => a !== amenity));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Center Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Champions Cricket Center"
            required
            className="border-green-200 focus:border-green-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Mumbai, Maharashtra"
            required
            className="border-green-200 focus:border-green-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Full Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Complete address with landmarks"
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          value={formData.contactNumber}
          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          placeholder="e.g., +91 9876543210"
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Max Capacity (People) *</Label>
          <Input
            id="capacity"
            type="number"
            min="6"
            max="50"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            required
            className="border-green-200 focus:border-green-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="courts">Number of Courts *</Label>
          <Input
            id="courts"
            type="number"
            min="1"
            max="10"
            value={formData.courts}
            onChange={(e) => setFormData({ ...formData, courts: parseInt(e.target.value) })}
            required
            className="border-green-200 focus:border-green-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your cricket center, facilities, and special features..."
          rows={3}
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/cricket-center-image.jpg"
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-4">
        <Label>Amenities</Label>
        <div className="flex gap-2">
          <Input
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="Add amenity (e.g., Parking, Canteen, etc.)"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
            className="border-green-200 focus:border-green-400"
          />
          <Button type="button" onClick={addAmenity} variant="outline" className="border-green-200">
            Add
          </Button>
        </div>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {amenity}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => removeAmenity(amenity)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Center is active and accepting bookings</Label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          {initialData ? 'Update Center' : 'Add Center'}
        </Button>
      </div>
    </form>
  );
};

export default AddCenterForm;
