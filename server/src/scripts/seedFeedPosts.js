import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FeedPost from '../model/FeedPost.model.js';
import NGO from '../model/Ngo.model.js';

dotenv.config();

const mockPosts = [
    {
        headline: "1000 Families Receive Relief Kits in Flood-Affected Assam",
        content: "Our team successfully distributed essential relief kits including food, clean water, medicines, and hygiene supplies to over 1000 families affected by the devastating floods in Assam. The operation was carried out in collaboration with local volunteers and district administration. We are grateful to all our donors who made this possible.",
        category: "relief",
        location: "Assam, India",
        likeCount: 234,
    },
    {
        headline: "Emergency Rescue Operation Saves 47 Villagers in Uttarakhand",
        content: "Our disaster response team conducted a critical rescue operation in Chamoli district after a landslide blocked the only road access. Using helicopters and rope rescue techniques, we successfully evacuated 47 villagers including 12 children and 8 elderly persons to safety. All are now receiving medical care at temporary shelters.",
        category: "rescue",
        location: "Uttarakhand, India",
        likeCount: 567,
    },
    {
        headline: "₹25 Lakhs Raised for Cyclone Michaung Victims",
        content: "Thanks to the incredible generosity of our donors, we have raised ₹25 Lakhs for the victims of Cyclone Michaung in Tamil Nadu and Andhra Pradesh. These funds are being used to rebuild homes, provide livelihood support, and ensure children can continue their education. Every contribution makes a difference!",
        category: "donation",
        location: "Chennai, India",
        likeCount: 892,
    },
    {
        headline: "5000 Students Trained in Earthquake Preparedness",
        content: "We completed our school safety program across 50 schools in Delhi-NCR, training over 5000 students in earthquake preparedness and first aid. The program included mock drills, safety kit distribution, and teacher training sessions. Building resilience starts with education!",
        category: "awareness",
        location: "Delhi-NCR, India",
        likeCount: 156,
    },
    {
        headline: "300 Volunteers Join Flood Relief Efforts in Bihar",
        content: "An overwhelming response from the community! 300 volunteers registered for our flood relief mission in Bihar's Darbhanga district. Together, we set up 5 relief camps, distributed 2000 food packets daily, and provided medical assistance to over 800 people. The spirit of humanity shines bright!",
        category: "volunteer",
        location: "Bihar, India",
        likeCount: 423,
    },
    {
        headline: "Mobile Medical Camp Serves 1200 Patients in Remote Odisha",
        content: "Our mobile medical unit reached 8 remote villages in Koraput district, providing free healthcare services to 1200 patients. Services included general checkups, eye care, dental care, and distribution of essential medicines. Healthcare should reach everyone, everywhere.",
        category: "relief",
        location: "Odisha, India",
        likeCount: 345,
    },
    {
        headline: "Solar-Powered Water Purifiers Installed in 20 Villages",
        content: "Clean water for all! We installed solar-powered water purification systems in 20 villages across drought-prone regions of Rajasthan. Each system can provide clean drinking water to 500 families daily, reducing waterborne diseases and improving community health significantly.",
        category: "other",
        location: "Rajasthan, India",
        likeCount: 278,
    },
    {
        headline: "Disaster Response Training for 150 Local Leaders",
        content: "Building local capacity for disaster resilience! We conducted a 5-day intensive training program for 150 village leaders, teaching them first responder skills, search and rescue basics, and community coordination during emergencies. Empowered communities are resilient communities.",
        category: "awareness",
        location: "Maharashtra, India",
        likeCount: 189,
    },
];

async function seedFeedPosts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all NGOs
        const ngos = await NGO.find().limit(5);
        
        if (ngos.length === 0) {
            console.log('No NGOs found. Creating mock NGO...');
            // Create a mock NGO if none exists
            const mockNgo = await NGO.create({
                name: 'Hope Foundation India',
                type: 'Disaster',
                email: 'hope@foundation.org',
                password: 'hashedpassword123',
                address: 'Mumbai, Maharashtra',
                NGOcode: 'NGO-HOPE-001',
                currentFund: 500000,
            });
            ngos.push(mockNgo);
        }

        // Clear existing feed posts
        await FeedPost.deleteMany({});
        console.log('Cleared existing feed posts');

        // Create feed posts with random NGO assignments
        const postsToCreate = mockPosts.map((post, index) => ({
            ...post,
            ngoId: ngos[index % ngos.length]._id,
            likes: [],
            isActive: true,
            createdAt: new Date(Date.now() - (index * 3600000 * Math.random() * 48)), // Random times in last 48 hours
        }));

        await FeedPost.insertMany(postsToCreate);
        console.log(`Created ${postsToCreate.length} mock feed posts`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding feed posts:', error);
        process.exit(1);
    }
}

seedFeedPosts();
