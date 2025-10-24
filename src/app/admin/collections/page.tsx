'use client';

import { format } from 'date-fns';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  Package,
  X,
} from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import CreateCollectionDialog from '@/components/admin/collections/CreateCollectionDialog';
import EditCollectionDialog from '@/components/admin/collections/EditCollectionDialog';
import ManageProductsDialog from '@/components/admin/collections/ManageProductsDialog';
import { PageLoader } from '@/components/PageLoader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

interface CollectionsResponse {
  collections: Collection[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

const AdminCollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [manageProductsDialogOpen, setManageProductsDialogOpen] =
    useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        admin: 'true',
        page: pagination.currentPage.toString(),
        pageSize: pagination.pageSize.toString(),
        search: searchQuery,
        status: statusFilter,
        season: seasonFilter,
        sortBy,
        sortOrder,
      });

      if (featuredFilter !== '') {
        params.set('isFeatured', featuredFilter);
      }

      const response = await fetch(`/api/collections?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const data: CollectionsResponse = await response.json();
      setCollections(data.collections);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast('Error', {
        description: 'Failed to fetch collections. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    searchQuery,
    statusFilter,
    seasonFilter,
    featuredFilter,
    sortBy,
    sortOrder,
    toast,
  ]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleDelete = async (collection: Collection) => {
    try {
      const response = await fetch(
        `/api/collections/${collection.id}?admin=true`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete collection');
      }

      fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast('Error', {
        description: 'Failed to delete collection. Please try again.',
      });
    }
  };

  const handleEdit = (collection: Collection) => {
    setSelectedCollection(collection);
    setEditDialogOpen(true);
  };

  const handleManageProducts = (collection: Collection) => {
    setSelectedCollection(collection);
    setManageProductsDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setSeasonFilter('');
    setFeaturedFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'DRAFT':
        return 'secondary';
      case 'ARCHIVED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getSeasonBadgeColor = (season: string) => {
    switch (season) {
      case 'SPRING':
        return 'bg-green-100 text-green-800';
      case 'SUMMER':
        return 'bg-yellow-100 text-yellow-800';
      case 'FALL':
        return 'bg-orange-100 text-orange-800';
      case 'WINTER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-600 mt-2">
            Manage curated collections of luxury products
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <CreateCollectionDialog
              onSuccess={() => {
                setCreateDialogOpen(false);
                fetchCollections();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Collections
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Collections
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collections.filter(c => c.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Collections
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collections.filter(c => c.isFeatured).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Draft Collections
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collections.filter(c => c.status === 'DRAFT').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Seasons</SelectItem>
                  <SelectItem value="SPRING">Spring</SelectItem>
                  <SelectItem value="SUMMER">Summer</SelectItem>
                  <SelectItem value="FALL">Fall</SelectItem>
                  <SelectItem value="WINTER">Winter</SelectItem>
                  <SelectItem value="ALL_SEASON">All Season</SelectItem>
                </SelectContent>
              </Select>

              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="true">Featured</SelectItem>
                  <SelectItem value="false">Not Featured</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={value => {
                  const [field, order] = value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="displayOrder-asc">
                    Order (Low-High)
                  </SelectItem>
                  <SelectItem value="displayOrder-desc">
                    Order (High-Low)
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collections Table */}
      {loading ? (
        <PageLoader isLoading={loading} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Collection</TableHead>
                  <TableHead>Season</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map(collection => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                          {collection.image && (
                            <img
                              src={collection.image}
                              alt={collection.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{collection.name}</div>
                          <div className="text-sm text-gray-500">
                            {collection.year} • {collection.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getSeasonBadgeColor(collection.season)}
                      >
                        {collection.season.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(collection.status)}>
                        {collection.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{collection.productCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {collection.isFeatured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(collection.createdAt), 'MMM dd, yyyy')}
                      </div>
                      {collection.creatorName && (
                        <div className="text-xs text-gray-500">
                          by {collection.creatorName}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageProducts(collection)}
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(collection)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Collection
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "
                                {collection.name}"? This action cannot be undone
                                and will remove all products from this
                                collection.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(collection)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {collections.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No collections found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ||
                  statusFilter ||
                  seasonFilter ||
                  featuredFilter !== ''
                    ? 'Try adjusting your search criteria or clear the filters.'
                    : 'Get started by creating your first collection.'}
                </p>
                {!searchQuery &&
                  !statusFilter &&
                  !seasonFilter &&
                  featuredFilter === '' && (
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Collection
                    </Button>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() =>
              setPagination(prev => ({
                ...prev,
                currentPage: prev.currentPage - 1,
              }))
            }
            disabled={!pagination.hasPrevious}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() =>
              setPagination(prev => ({
                ...prev,
                currentPage: prev.currentPage + 1,
              }))
            }
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}

      {/* Dialogs */}
      {selectedCollection && (
        <>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-4xl">
              <EditCollectionDialog
                collection={selectedCollection}
                onSuccess={() => {
                  setEditDialogOpen(false);
                  setSelectedCollection(null);
                  fetchCollections();
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            open={manageProductsDialogOpen}
            onOpenChange={setManageProductsDialogOpen}
          >
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <ManageProductsDialog
                collection={selectedCollection}
                onSuccess={() => {
                  setManageProductsDialogOpen(false);
                  setSelectedCollection(null);
                  fetchCollections();
                }}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default AdminCollectionsPage;
