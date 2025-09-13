"use client"
import React from 'react';
import CustomCard from "@/components/custom-card"



interface CardsLayerProps {
    data: any;
}


export default function CardsLayer({ data }: CardsLayerProps) {


    return (
        <div className="space-y-4 nb-8">
            {data.map((item: any, index: number) => (
                <CustomCard key={index} data={item} />
            ))}
        </div>
    );
}


