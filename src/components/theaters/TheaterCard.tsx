
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FolderOpen, Edit, Trash, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Theater } from '@/types/theater';

interface TheaterCardProps {
  theater: Theater;
  onDelete: (id: string) => void;
  onEdit: (theater: Theater) => void;
}

const TheaterCard = ({ theater, onDelete, onEdit }: TheaterCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FolderOpen className="h-5 w-5 text-theater-accent" />
          {theater.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-sm text-muted-foreground">
          <p>Location: {theater.location}</p>
          <p>Capacity: {theater.capacity} seats</p>
          <p>Screens: {theater.screens}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/theaters/${theater.id}/time-slots`}>
            <Clock className="h-4 w-4 mr-2" />
            Time Slots
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(theater)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(theater.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TheaterCard;
