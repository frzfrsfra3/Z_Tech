// context/RatingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Rating {
    id: number;
    score: number;
    comment: string;
}

interface RatingsContextType {
    ratings: Rating[];
    fetchRatings: () => void;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

export const RatingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ratings, setRatings] = useState<Rating[]>([]);

    const fetchRatings = async () => {
        try {
            const response = await axios.get('http://your-laravel-domain.com/api/ratings');
            setRatings(response.data);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, []);

    return (
        <RatingsContext.Provider value={{ ratings, fetchRatings }}>
            {children}
        </RatingsContext.Provider>
    );
};

export const useRatings = () => {
    const context = useContext(RatingsContext);
    if (!context) {
        throw new Error('useRatings must be used within a RatingsProvider');
    }
    return context;
};
