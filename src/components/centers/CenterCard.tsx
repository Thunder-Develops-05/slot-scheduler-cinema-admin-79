
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Center } from '@/types/center';
import { Edit, Trash2, MapPin, Users, Target, Phone, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CenterCardProps {
  center: Center;
  onEdit: (center: Center) => void;
  onDelete: (center: Center) => void;
}

const CenterCard = ({ center, onEdit, onDelete }: CenterCardProps) => {
  return (
    <Card className="overflow-hidden card-hover bg-white border-2 border-green-100 hover:border-green-300 rounded-2xl">
      <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 relative overflow-hidden">
        {center.imageUrl ? (
          <img 
            src={center.imageUrl} 
            alt={center.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Target className="h-16 w-16 text-white opacity-50" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge 
            variant={center.isActive ? "default" : "secondary"}
            className={center.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}
          >
            {center.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{center.name}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">{center.location}</span>
            </div>
            {center.contactNumber && (
              <div className="flex items-center text-gray-600 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">{center.contactNumber}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Users className="h-3 w-3 mr-1" />
              {center.capacity} people
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Target className="h-3 w-3 mr-1" />
              {center.courts} courts
            </Badge>
          </div>

          {center.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{center.description}</p>
          )}

          {center.amenities && center.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {center.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {center.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{center.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <Link to={`/centers/${center.id}`}>
          <Button 
            variant="outline" 
            size="sm"
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(center)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(center)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CenterCard;
