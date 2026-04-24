// src/pages/admin/CategoryManagementPage.jsx - Enhanced with consistent colors
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Tag, PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import toast from 'react-hot-toast';
import { mockCategories } from '../../utils/mockData';

const initialCategories = mockCategories.filter(c => c !== 'All').map((name, index) => ({
    id: `cat${index + 1}`,
    name,
    productCount: Math.floor(Math.random() * 100) + 10,
    isPopular: index < 3,
}));

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState(initialCategories);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });
    const [loading, setLoading] = useState(false);

    const handleOpenDialog = (category = null) => {
        if (category) {
            setIsEditing(true);
            setCurrentCategory({ id: category.id, name: category.name });
        } else {
            setIsEditing(false);
            setCurrentCategory({ id: null, name: '' });
        }
        setOpenDialog(true);
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newName = currentCategory.name.trim();

        if (newName === '') {
            toast.error('Category name cannot be empty.');
            setLoading(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (isEditing) {
                setCategories(prev => prev.map(c =>
                    c.id === currentCategory.id ? { ...c, name: newName } : c
                ));
                toast.success(`Category "${newName}" updated.`);
            } else {
                const newId = `cat${categories.length + 1}`;
                setCategories(prev => [...prev, { id: newId, name: newName, productCount: 0, isPopular: false }]);
                toast.success(`Category "${newName}" added.`);
            }

            setOpenDialog(false);
        } catch (error) {
            toast.error('Failed to save category.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (categoryId, categoryName) => {
        if (!window.confirm(`Are you sure you want to delete the category: ${categoryName}?`)) {
            return;
        }
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCategories(prev => prev.filter(c => c.id !== categoryId));
            toast.success(`Category "${categoryName}" deleted.`);
        } catch (error) {
            toast.error('Failed to delete category.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div className="bg-gradient-primary rounded-2xl p-8 text-white">
                <h1 className="text-4xl font-poppins font-bold mb-2 flex items-center">
                    <Tag className="h-8 w-8 mr-3" /> Category Management
                </h1>
                <p className="text-xl text-white/90">
                    Organize and manage product categories
                </p>
            </div>

            <div className="flex justify-end">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} variant="fypPrimary">
                            <PlusCircle className="h-4 w-4 mr-2" /> Add New Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 border-2">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-white">
                                {isEditing ? 'Edit Category' : 'Add New Category'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveCategory} className="grid gap-4 py-4">
                            <Input
                                id="name"
                                value={currentCategory.name}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                placeholder="e.g., Seasonal Fruits"
                                className="col-span-3 dark:bg-gray-700 dark:border-gray-600"
                                disabled={loading}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={loading} variant="fypPrimary">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEditing ? 'Update Category' : 'Create Category'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-2 dark:bg-gray-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                        Existing Categories ({categories.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-gray-900 dark:text-white">Category Name</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Product Count</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Popular</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium text-gray-900 dark:text-white">{category.name}</TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-400">{category.productCount}</TableCell>
                                        <TableCell>
                                            {category.isPopular ? (
                                                <span className="text-yellow-500 dark:text-yellow-400 font-semibold">Yes</span>
                                            ) : (
                                                <span className="text-gray-600 dark:text-gray-400">No</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOpenDialog(category)}
                                                disabled={loading}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(category.id, category.name)}
                                                disabled={loading}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CategoryManagementPage;
