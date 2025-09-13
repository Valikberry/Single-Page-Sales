"use client"

import ProductCard from "@/components/product-card"


interface CardsLayerProps {
    data: any;
    category:string
}

export default function ProductCardLayer({ data,category,openModal }: any) {


    return (
        <div className="">
            {data.map((product: any, index: number) => (
                <ProductCard key={index} product={product} category={category} openModal={openModal}/>
            ))}
        </div>
    )
}