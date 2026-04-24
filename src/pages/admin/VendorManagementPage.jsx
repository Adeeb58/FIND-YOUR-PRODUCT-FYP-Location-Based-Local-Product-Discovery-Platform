// src/pages/admin/VendorManagementPage.jsx - Enhanced with consistent colors
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Check, X, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockVendors } from '../../utils/mockData';

const vendorData = mockVendors.map((vendor, index) => ({
    ...vendor,
    status: index % 3 === 0 ? 'Pending' : 'Approved',
    email: `vendor${vendor.id.slice(5)}@farmyard.com`,
    joinedDate: `2024-0${Math.floor(Math.random() * 5) + 1}-15`,
}));

const VendorManagementPage = () => {
    const [vendors, setVendors] = useState(vendorData);
    const [loadingId, setLoadingId] = useState(null);

    const handleAction = async (vendorId, action) => {
        setLoadingId(vendorId);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            setVendors(prevVendors => prevVendors.map(vendor => 
                vendor.id === vendorId ? { ...vendor, status: action === 'approve' ? 'Approved' : 'Rejected' } : vendor
            ));

            toast.success(`Vendor ${vendorId} ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
        } catch (error) {
            toast.error(`Failed to perform action on vendor ${vendorId}.`);
        } finally {
            setLoadingId(null);
        }
    };

    const pendingVendors = vendors.filter(v => v.status === 'Pending');
    const approvedVendors = vendors.filter(v => v.status === 'Approved');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div className="bg-gradient-primary rounded-2xl p-8 text-white">
                <h1 className="text-4xl font-poppins font-bold mb-2 flex items-center">
                    <Users className="h-8 w-8 mr-3" /> Vendor Management
                </h1>
                <p className="text-xl text-white/90">
                    Review and manage vendor registrations
                </p>
            </div>

            {/* Pending Vendors Section */}
            <Card className="border-2 dark:bg-gray-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-red-500 dark:text-red-400">
                        Pending Approvals ({pendingVendors.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {pendingVendors.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">No vendors currently pending approval.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-gray-900 dark:text-white">Vendor Name</TableHead>
                                        <TableHead className="text-gray-900 dark:text-white">Email</TableHead>
                                        <TableHead className="text-gray-900 dark:text-white">Joined</TableHead>
                                        <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingVendors.map((vendor) => (
                                        <TableRow key={vendor.id}>
                                            <TableCell className="font-medium text-gray-900 dark:text-white">{vendor.name}</TableCell>
                                            <TableCell className="text-gray-600 dark:text-gray-400">{vendor.email}</TableCell>
                                            <TableCell className="text-gray-600 dark:text-gray-400">{vendor.joinedDate}</TableCell>
                                            <TableCell className="flex space-x-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="fypPrimary" 
                                                    onClick={() => handleAction(vendor.id, 'approve')}
                                                    disabled={loadingId === vendor.id}
                                                >
                                                    {loadingId === vendor.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                    <span className="hidden sm:inline ml-1">Approve</span>
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleAction(vendor.id, 'reject')}
                                                    disabled={loadingId === vendor.id}
                                                >
                                                    <X className="h-4 w-4" />
                                                    <span className="hidden sm:inline ml-1">Reject</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Approved Vendors Section */}
            <Card className="border-2 dark:bg-gray-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-fypGreen dark:text-fypGreen">
                        Approved Vendors ({approvedVendors.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-gray-900 dark:text-white">Vendor Name</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Email</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                                    <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {approvedVendors.map((vendor) => (
                                    <TableRow key={vendor.id}>
                                        <TableCell className="font-medium text-gray-900 dark:text-white">{vendor.name}</TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-400">{vendor.email}</TableCell>
                                        <TableCell>
                                            <span className="text-fypGreen dark:text-fypGreen font-semibold">{vendor.status}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" variant="outline">View/Suspend</Button>
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

export default VendorManagementPage;
