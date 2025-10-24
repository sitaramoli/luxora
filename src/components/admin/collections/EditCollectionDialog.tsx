'use client';

import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  image: string;
  coverImage: string | null;
  season: string;
  year: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  isFeatured: boolean;
  isNew: boolean;
  displayOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  tags: string[] | null;
  priceRangeMin: string | null;
  priceRangeMax: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  creatorName: string | null;
}

interface Props {
  collection: Collection;
  onSuccess: () => void;
}

const EditCollectionDialog: React.FC<Props> = ({ collection, onSuccess }) => {
  // TODO: Implement edit collection dialog similar to create dialog
  // but pre-populated with existing collection data
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Collection: {collection.name}</DialogTitle>
      </DialogHeader>
      
      <div className="p-6">
        <p className="text-gray-600">
          Edit collection dialog - Coming soon...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Collection ID: {collection.id}
        </p>
      </div>
    </>
  );
};

export default EditCollectionDialog;