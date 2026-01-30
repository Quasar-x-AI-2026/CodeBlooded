import {useState, useEffect} from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Share2, TrendingUp, Heart, Users, Clock} from 'lucide-react';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import {toast} from 'sonner';

const donors = [
    {name: 'Tim Houldey', amount: 30, recent: true, avatar: '/avatars/tim.png'},
    {
        name: 'Clive Forrester',
        amount: 10000,
        top: true,
        avatar: '/avatars/clive.png',
    },
    {
        name: 'Michael Angus',
        amount: 100,
        time: '11 mins',
        avatar: '/avatars/michael.png',
    },
    {name: 'Anonymous', amount: 100, time: '6 mins', avatar: ''},
    {
        name: 'Adel Khalil',
        amount: 93,
        time: '29 mins',
        avatar: '/avatars/adel.png',
    },
];

export default function DonationPanel() {
    const [progress, setProgress] = useState(0);
    const [imageError, setImageError] = useState({});
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [liveCount, setLiveCount] = useState(774);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState('');

    const targetProgress = 51;
    const quickAmounts = [500, 1000, 2500, 5000];

    // Load Razorpay
    useEffect(() => {
        if (window.Razorpay) return;
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    // Animate progress
    useEffect(() => {
        const t = setTimeout(() => setProgress(targetProgress), 100);
        return () => clearTimeout(t);
    }, []);

    // Live donation count
    useEffect(() => {
        const i = setInterval(() => {
            setLiveCount((p) => p + Math.floor(Math.random() * 3));
        }, 5000);
        return () => clearInterval(i);
    }, []);

    const handleDonate = async () => {
        const amount = selectedAmount || Number(customAmount);
        if (!amount) return;

        const ngoId = '697c65a36cb5f015d52bd246'; //Todo: Fix this

        try {
            // 1. Create order
            const res = await fetch(
                import.meta.env.VITE_SERVER_URL +
                    '/api/v1/payment/create-order',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({
                        amount,
                        campaign: selectedCampaign,
                        ngoId: ngoId
                    }),
                }
            );

            const data = await res.json();
            if (!data?.data?.id) {
                toast.error('Unable to initiate payment');
                return;
            }

            // 2. Open Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.data.amount,
                currency: 'INR',
                order_id: data?.data?.id,
                name: 'NGO Donation',
                description: 'Thank you for making a difference',

                handler: async (response) => {
                    const verify = await fetch(
                        import.meta.env.VITE_SERVER_URL +
                            '/api/v1/payment/verify-payment',
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            credentials: 'include',
                            body: JSON.stringify(response),
                        }
                    );

                    const result = await verify.json();
                    if (result.success) {
                        toast.success('Payment successful 💚');
                    } else {
                        toast.error('Payment verification failed');
                    }
                },

                modal: {
                    ondismiss: () => console.log('Checkout closed'),
                },

                theme: {color: '#7c3aed'},
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            toast.error('Payment failed');
        }
    };

    return (
        <Card className="p-6 rounded-3xl shadow-xl bg-[var(--card)] min-h-[600px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--primary)]/5 pointer-events-none" />

            <div className="relative z-10">
                {/* HEADER */}
                <div className="flex items-start gap-6 mb-6">
                    <div className="w-24 h-24">
                        <CircularProgressbar
                            value={progress}
                            text={`${Math.round(progress)}%`}
                            strokeWidth={12}
                            styles={buildStyles({
                                pathColor: 'var(--primary)',
                                trailColor: 'var(--muted)',
                                textColor: 'var(--foreground)',
                                strokeLinecap: 'round',
                            })}
                        />
                    </div>

                    <div className="flex-1 pt-2">
                        <p className="text-2xl font-bold">₹101,945 raised</p>
                        <p className="text-sm text-muted-foreground">
                            of ₹200,000 goal
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" /> 1.5K donations
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> 15 days left
                            </span>
                        </div>
                    </div>
                </div>

                {/* CAMPAIGN */}
                <Select
                    value={selectedCampaign}
                    onValueChange={setSelectedCampaign}
                >
                    <SelectTrigger className="rounded-full py-6">
                        <SelectValue placeholder="Choose a cause" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="disaster">
                            🌊 Disaster Relief
                        </SelectItem>
                        <SelectItem value="education">📚 Education</SelectItem>
                        <SelectItem value="health">🏥 Health Care</SelectItem>
                        <SelectItem value="ngo">🤝 NGO Support</SelectItem>
                    </SelectContent>
                </Select>

                {/* AMOUNTS */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                    {quickAmounts.map((amt) => (
                        <Button
                            key={amt}
                            variant={
                                selectedAmount === amt ? 'default' : 'outline'
                            }
                            onClick={() => {
                                setSelectedAmount(amt);
                                setCustomAmount('');
                            }}
                            className="rounded-full py-5"
                        >
                            ₹{amt}
                        </Button>
                    ))}
                </div>

                <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                    }}
                    className="w-full mt-3 px-4 py-3 rounded-full border"
                />

                {/* DONATE */}
                <Button
                    disabled={!selectedAmount && !customAmount}
                    onClick={handleDonate}
                    className="w-full mt-4 rounded-full py-6 flex gap-2"
                >
                    <Heart className="h-5 w-5" />
                    Donate ₹{selectedAmount || customAmount}
                </Button>

                {/* LIVE */}
                <div className="mt-6 flex gap-2 text-green-600 bg-green-500/10 px-4 py-3 rounded-full animate-pulse">
                    <TrendingUp className="h-4 w-4" />
                    {liveCount} people donated recently
                </div>
            </div>
        </Card>
    );
}
