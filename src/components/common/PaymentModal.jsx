
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { CreditCard, Wallet, Banknote, Loader2, CheckCircle2, Lock, Smartphone, ShieldCheck, Timer, Zap, Building2, Plus, RefreshCw, History as HistoryIcon } from 'lucide-react';
import { formatPrice } from '../../utils/currency';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const BANKS = [
    { id: 'sbi', name: 'State Bank of India', color: 'bg-blue-600' },
    { id: 'hdfc', name: 'HDFC Bank', color: 'bg-red-600' },
    { id: 'icici', name: 'ICICI Bank', color: 'bg-orange-600' },
    { id: 'axis', name: 'Axis Bank', color: 'bg-purple-700' },
    { id: 'kotak', name: 'Kotak Mahindra', color: 'bg-red-500' },
    { id: 'bob', name: 'Bank of Baroda', color: 'bg-orange-500' },
];

export const PaymentModal = ({ isOpen, onClose, totalAmount, items = [], onSuccess }) => {
    const navigate = useNavigate();
    // Steps: 'select' -> 'processing' -> 'verify_upi' | 'verify_card' | 'link_bank' | 'enter_pin' -> 'success'
    const [step, setStep] = useState('select');
    const [selectedMethod, setSelectedMethod] = useState('upi');

    // Form States
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolder, setCardHolder] = useState('');

    // Wallet State
    const [walletBalance, setWalletBalance] = useState(5000);

    // Bank Linking State
    const [linkedBank, setLinkedBank] = useState(null); // { id, name, accountNo: '**** 1234' }
    const [linkingStatus, setLinkingStatus] = useState('idle'); // idle, verifying, fetching, success
    const [upiPin, setUpiPin] = useState('');
    const [transactionId, setTransactionId] = useState('');

    // OTP State
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(300); // 5 minutes

    useEffect(() => {
        let interval;
        if ((step === 'verify_upi' || step === 'verify_card') && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs} `;
    };

    const resetModal = () => {
        if (step === 'success' || step === 'select') {
            setStep('select');
            setUpiId('');
            setCardNumber('');
            setExpiry('');
            setCvv('');
            setCardHolder('');
            setOtp('');
            setUpiPin('');
            setTimer(300);
            onClose();
        }
    };

    // Bank Linking Logic
    const startLinking = () => {
        setStep('link_bank');
        setLinkingStatus('idle');
    }

    const selectBank = async (bank) => {
        setLinkingStatus('verifying');
        // Simulate "Sending SMS"
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLinkingStatus('fetching');
        // Simulate "Fetching Accounts"
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLinkedBank({
            ...bank,
            accountNo: '**** ' + Math.floor(1000 + Math.random() * 9000)
        });
        setLinkingStatus('success');

        setTimeout(() => {
            setStep('select');
            toast.success('Bank Account Linked Successfully!');
        }, 1500);
    }

    const initiatePayment = async () => {
        // Validation logic
        if (selectedMethod === 'upi') {
            // Check if user wants to pay via Linked Bank
            if (linkedBank && !upiId) {
                setStep('enter_pin');
                return;
            }
            // Otherwise check plain UPI ID
            if (upiId && !upiId.includes('@')) {
                toast.error('Please enter a valid UPI ID');
                return;
            }
        } else if (selectedMethod === 'card') {
            if (cardNumber.length < 16 || expiry.length < 5 || cvv.length < 3 || !cardHolder) {
                toast.error('Please enter valid card details');
                return;
            }
        } else if (selectedMethod === 'wallet') {
            if (walletBalance < totalAmount) {
                toast.error('Insufficient wallet balance');
                return;
            }
        }

        setStep('processing');

        // Fast processing for Wallet
        if (selectedMethod === 'wallet') {
            await new Promise(resolve => setTimeout(resolve, 800));
            setWalletBalance(prev => prev - totalAmount);
            completePayment();
            return;
        }

        // Simulate contacting bank
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (selectedMethod === 'upi') {
            // If we are here, it means we are using manual UPI ID or QR flow (not linked bank)
            setStep('verify_upi');
            setTimer(300);
        } else if (selectedMethod === 'card') {
            setStep('verify_card');
            setTimer(120);
        } else {
            completePayment();
        }
    };

    const verifyPin = async () => {
        if (upiPin.length < 4) {
            toast.error('Please enter 4-digit UPI PIN');
            return;
        }
        setStep('processing');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate verifying PIN
        completePayment();
    }

    const verifyOtp = async () => {
        if (otp.length < 4) {
            toast.error('Please enter a valid OTP');
            return;
        }
        setStep('processing');
        await new Promise(resolve => setTimeout(resolve, 1500));
        completePayment();
    };

    const completePayment = async () => {
        setStep('processing');

        try {
            // Create Order in Backend
            const orderData = {
                items: items.map(item => ({
                    productId: item.id || item.productId,
                    vendorId: item.vendor?.id || item.vendor?._id || item.vendor,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity || 1,
                    image: item.imageUrl || item.image
                })),
                totalAmount,
                paymentMethod: selectedMethod === 'wallet' ? 'Wallet' :
                    selectedMethod === 'upi' ? 'UPI' :
                        selectedMethod === 'card' ? 'Card' : 'COD'
            };

            const { data } = await axios.post('/orders', orderData);

            setStep('success');
            setTimer(5); // 5 Seconds
            // Generate stable transaction ID
            const newTxnId = 'TXN' + Math.floor(Math.random() * 1000000);
            setTransactionId(newTxnId);
            toast.success('Ordered Successfully!');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Payment Error", error);
            toast.error("Payment failed. Please try again.");
            setStep('select');
        }
    };

    // Timer Effect for Success Step
    useEffect(() => {
        let interval;
        if (step === 'success' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    // Card formatting helpers
    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
        setCardNumber(value);
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        setExpiry(value);
    };

    return (
        <Dialog open={isOpen} onOpenChange={resetModal}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden min-h-[450px]">
                <AnimatePresence mode="wait">
                    {/* ... (Previous Steps remain same) ... */}
                    {/* STEP 1: SELECT METHOD */}
                    {step === 'select' && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col h-full"
                        >
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl">
                                    <Lock className="h-5 w-5 text-green-600" />
                                    Secure Checkout
                                </DialogTitle>
                                <DialogDescription className="text-base">
                                    Total to Pay: <strong className="text-primary text-lg">{formatPrice(totalAmount)}</strong>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4 flex-1 overflow-y-auto max-h-[60vh] px-1">
                                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="grid grid-cols-1 gap-3">
                                    {/* Capstone Wallet Option */}
                                    <div className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${selectedMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-muted hover:border-gray-300'}`}>
                                        <RadioGroupItem value="wallet" id="wallet" className="peer sr-only" />
                                        <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer w-full">
                                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full shadow-sm">
                                                <Zap className="h-5 w-5 text-orange-600 fill-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold flex items-center gap-2">
                                                    Capstone Wallet
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">FASTEST</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">Balance: <strong>{formatPrice(walletBalance)}</strong></div>
                                            </div>
                                        </Label>
                                    </div>

                                    {/* UPI Option */}
                                    <div className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${selectedMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-muted hover:border-gray-300'}`}>
                                        <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                                        <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer w-full">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                                                <Wallet className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">UPI / Linked Bank</div>
                                                <div className="text-xs text-muted-foreground">GooglePay, PhonePe, Paytm</div>
                                            </div>
                                        </Label>

                                        <AnimatePresence>
                                            {selectedMethod === 'upi' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden mt-3"
                                                >
                                                    {linkedBank ? (
                                                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${linkedBank.color}`}>
                                                                    {linkedBank.name[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold">{linkedBank.name}</p>
                                                                    <p className="text-xs text-muted-foreground">Savings A/c {linkedBank.accountNo}</p>
                                                                </div>
                                                            </div>
                                                            <div className="h-3 w-3 bg-green-500 rounded-full" title="Active"></div>
                                                        </div>
                                                    ) : (
                                                        <Button variant="outline" onClick={startLinking} className="w-full mb-4 border-dashed border-2 flex items-center gap-2 text-primary">
                                                            <Plus className="h-4 w-4" /> Link Bank Account
                                                        </Button>
                                                    )}

                                                    {!linkedBank && (
                                                        <div className="flex flex-col gap-4">
                                                            <div className="p-3 bg-white rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center">
                                                                <p className="text-xs text-muted-foreground mb-2">Scan to Pay with any App</p>
                                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=capstone@upi&pn=CapstoneShop&cu=INR&am=${totalAmount}`} alt="Payment QR" className="h-32 w-32 rounded-md shadow-sm" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="relative my-3">
                                                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">OR Enter UPI ID</span></div>
                                                    </div>

                                                    <Input placeholder="Enter UPI ID (e.g., 9876543210@ybl)" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="bg-white dark:bg-gray-800" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Card Option */}
                                    <div className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-primary bg-primary/5' : 'border-muted hover:border-gray-300'}`}>
                                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer w-full">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                                                <CreditCard className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">Credit / Debit Card</div>
                                                <div className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</div>
                                            </div>
                                        </Label>
                                        <AnimatePresence>
                                            {selectedMethod === 'card' && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3 space-y-3">
                                                    <Input placeholder="Card Number" value={cardNumber} onChange={handleCardNumberChange} maxLength={16} className="bg-white dark:bg-gray-800 font-mono" />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Input placeholder="MM/YY" value={expiry} onChange={handleExpiryChange} maxLength={5} className="bg-white dark:bg-gray-800 font-mono text-center" />
                                                        <Input placeholder="CVV" type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} maxLength={3} className="bg-white dark:bg-gray-800 font-mono text-center" />
                                                    </div>
                                                    <Input placeholder="Card Holder Name" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} className="bg-white dark:bg-gray-800" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* COD Option */}
                                    <div className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${selectedMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-muted hover:border-gray-300'}`}>
                                        <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                                        <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer w-full">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                                                <Banknote className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">Cash on Delivery</div>
                                                <div className="text-xs text-muted-foreground">Pay when your order arrives</div>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <DialogFooter>
                                <Button variant="ghost" onClick={resetModal}>Cancel</Button>
                                <Button onClick={initiatePayment} className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
                                    {selectedMethod === 'wallet' ? 'Pay Instantly' : (selectedMethod === 'upi' && linkedBank && !upiId) ? 'Pay Securely' : 'Proceed to Pay'}
                                </Button>
                            </DialogFooter>
                        </motion.div>
                    )}

                    {/* Step: LINK BANK */}
                    {step === 'link_bank' && (
                        <motion.div key="link_bank" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                            <DialogHeader>
                                <DialogTitle>Select Your Bank</DialogTitle>
                                <DialogDescription>We will link your bank account to your profile number (+91 98765 43210)</DialogDescription>
                            </DialogHeader>
                            {linkingStatus === 'idle' && (
                                <div className="grid grid-cols-2 gap-3 py-4 overflow-y-auto">
                                    {BANKS.map(bank => (
                                        <div key={bank.id} onClick={() => selectBank(bank)} className="border rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-muted cursor-pointer transition-colors">
                                            <div className={`w-10 h-10 rounded-full ${bank.color} flex items-center justify-center text-white font-bold`}>{bank.name[0]}</div>
                                            <span className="text-xs font-medium text-center">{bank.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {(linkingStatus === 'verifying' || linkingStatus === 'fetching') && (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                                    <RefreshCw className="h-10 w-10 animate-spin text-primary" />
                                    <div className="text-center">
                                        <h3 className="font-semibold">{linkingStatus === 'verifying' ? 'Verifying Mobile Number...' : 'Fetching Accounts...'}</h3>
                                        <p className="text-xs text-muted-foreground">Do not press back</p>
                                    </div>
                                </div>
                            )}
                            {linkingStatus === 'success' && (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                                    <h3 className="font-bold text-lg">Account Linked!</h3>
                                </div>
                            )}
                            {linkingStatus === 'idle' && (
                                <Button variant="ghost" onClick={() => setStep('select')} className="mt-auto">Back</Button>
                            )}
                        </motion.div>
                    )}

                    {/* Step: ENTER PIN */}
                    {step === 'enter_pin' && (
                        <motion.div key="enter_pin" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col h-full bg-blue-600 text-white rounded-lg -m-6 p-6">
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="mb-6 flex flex-col items-center">
                                    <div className="bg-white/20 p-3 rounded-full mb-3"><Building2 className="h-8 w-8 text-white" /></div>
                                    <h3 className="font-bold text-lg">{linkedBank?.name}</h3>
                                    <p className="text-sm opacity-80">Sending {formatPrice(totalAmount)}</p>
                                </div>
                                <p className="mb-4 font-semibold">ENTER 4-DIGIT UPI PIN</p>
                                <div className="flex gap-4 mb-8">
                                    <Input type="password" maxLength={4} value={upiPin} onChange={(e) => setUpiPin(e.target.value.replace(/\D/g, '').slice(0, 4))} className="bg-white text-black text-center text-3xl h-16 w-40 tracking-[1em] font-bold" autoFocus />
                                </div>
                            </div>
                            <Button onClick={verifyPin} className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold">SUBMIT</Button>
                            <Button variant="link" onClick={() => setStep('select')} className="text-white/80 mt-2">Cancel</Button>
                        </motion.div>
                    )}

                    {/* STEP 2: PROCESSING LOADER */}
                    {step === 'processing' && (
                        <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-12 h-full">
                            <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                            <h3 className="text-xl font-semibold">Processing Payment...</h3>
                            <p className="text-muted-foreground">Please do not close this window</p>
                        </motion.div>
                    )}

                    {/* STEP 3A: UPI VERIFICATION */}
                    {step === 'verify_upi' && (
                        <motion.div key="verify_upi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center justify-center py-6 h-full text-center">
                            <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse"><Smartphone className="h-10 w-10 text-blue-600" /></div>
                            <div className="flex items-center gap-2 text-orange-600 font-mono text-lg font-bold mb-6 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-md"><Timer className="h-5 w-5" /> {formatTime(timer)}</div>
                            <div className="space-y-3 w-full">
                                <Button onClick={completePayment} className="w-full bg-green-600 hover:bg-green-700 text-white">I have paid on my Phone</Button>
                                <p className="text-xs text-muted-foreground">If you can't scan, click above to simulate success.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3B: CARD OTP */}
                    {step === 'verify_card' && (
                        <motion.div key="verify_card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-green-600" /> Bank Verification</DialogTitle>
                                <DialogDescription>Enter the OTP sent to your registered mobile</DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 flex flex-col items-center justify-center py-6">
                                <p className="text-sm text-muted-foreground mb-4">Merchant: <strong>Capstone Shop</strong></p>
                                <p className="text-lg font-bold mb-6">Amount: {formatPrice(totalAmount)}</p>
                                <Input className="text-center text-2xl tracking-[1em] font-bold h-14 mb-4" maxLength={6} placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} />
                                <div className="text-sm text-muted-foreground flex justify-between w-full px-1"><span>Resend OTP in {formatTime(timer)}</span></div>
                            </div>
                            <Button onClick={verifyOtp} className="w-full h-12 text-lg">Verify & Pay</Button>
                        </motion.div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 'success' && (
                        <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}>
                                <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                                </div>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ordered Successfully!</h2>
                            <p className="text-muted-foreground mb-4">Transaction ID: {transactionId}</p>

                            {/* 10 Minute Timer Visualization */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6 w-full">
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Order visibility in History</p>

                                {timer > 0 ? (
                                    <>
                                        <div className="flex items-center justify-center gap-2 text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                                            <Timer className="h-6 w-6" />
                                            {formatTime(timer)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Your order will appear in the <strong>Order History</strong> page after this timer ends.
                                        </p>
                                    </>
                                ) : (
                                    <div className="animate-in fade-in zoom-in duration-300">
                                        <div className="flex items-center justify-center gap-2 text-xl font-bold text-green-600 mb-2">
                                            <CheckCircle2 className="h-6 w-6" />
                                            Visible Now!
                                        </div>
                                        <Button
                                            onClick={() => {
                                                resetModal();
                                                navigate('/orders');
                                            }}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                        >
                                            <HistoryIcon className="h-4 w-4" />
                                            View Order History
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {timer > 0 && (
                                <Button onClick={resetModal} className="w-full" size="lg">Continue Shopping</Button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );

    // Removed older render return to replace with this one.
    // Ensure all imports are present.
};

export default PaymentModal;
