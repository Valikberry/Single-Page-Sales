import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"

import Image from "next/image";
import AiRecommendation from "@/components/ai-recommendation"

export default function AboutPage() {
    return (
        <main className="flex min-h-screen flex-col">
            <Header />

            {/* Hero */}
            <section className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-8">
                <div className="container mx-auto max-w-md px-4">
                    <h1 className="text-3xl font-bold text-green-800 mb-2 ">Apply fast</h1>

                    <p className="text-green-700">
                        CnRooms is a community based Shopping space
                    </p>

                </div>
            </section>

            <section className="px-4 py-6">
                <div className="container mx-auto max-w-md px-4">
                    {/*<h2 className="text-lg font-semibold mb-3">About the founder</h2>*/}
                    <div className="flex flex-row justify-around items-start">
                        <div className="">
                            <p className="text-gray-800 text-base">It was created by Valentine, a curious entrepreneur and shipping enthusiast who wanted to make product discovery and shopping from China easier and faster.</p>
                            <br/>
                            <p className="text-gray-800 text-base">As a small team of IT pros and experienced Chinese suppliers, our sole mission is building a transparent community that gives users direct access to real products and real sellers</p>
                            <br/>
                            <p className="text-gray-800 text-base">Inside our community, you can post a product you’re interested in, along with your shipping destination, and a verified suppliers will respond with accurate pricing, shipping details, and timelines.</p>
                            <br/>
                            <p className="text-gray-800 text-base">The idea is simple: a live product catalog your messaging apps like WhatsApp or Telegram. See what’s hot today, ask questions in real time, and get fast, honest answers — it’s sourcing, right in your pocket.</p>
                            <br/>
                            {/*<p className="text-gray-700 text-sm">*/}
                            {/*    You’ll see what products others in the community are exploring, compare prices, and interact directly with suppliers. No middlemen. No unnecessary delays. Our secure chat spaces on WhatsApp and Telegram are moderated to remove spam, and an AI-powered system helps protect and streamline conversations for a safer, more focused experience.*/}
                            {/*</p>*/}
                            {/*<br/>*/}
                            {/*<p className="text-gray-700 text-sm">*/}
                            {/*    CnRooms isn’t just about finding suppliers. It’s about being part of a smarter sourcing network where people share knowledge, avoid bad deals, and shop with confidence.*/}
                            {/*</p>*/}
                        </div>
                    </div>
                    {/*<h2 className="text-lg font-semibold mb-3">Our Mission</h2>*/}
                    {/*<div className="">*/}
                    {/*    <p className="text-gray-700 text-sm">At Eating Vancouver, our mission is to connect food lovers with the best dining experiences Vancouver has to offer. We strive to provide accurate, up-to-date information about restaurants across the city, making it easier for you to discover new places to eat and enjoy.</p>*/}
                    {/*    <br/>*/}
                    {/*</div>*/}
                    {/*<h2 className="text-lg font-semibold mb-3">Contact Us</h2>*/}
                    {/*<div className="">List of contacts</div>*/}
                </div>
            </section>

            {/* Quick Links */}
            {/*<section className="px-4 py-6">*/}
            {/*    <div className="container mx-auto max-w-md">*/}
            {/*        <div className="grid grid-cols-3 gap-3">*/}
            {/*            <Link href="/products" className="bg-green-50 rounded-lg p-3 text-center">*/}
            {/*                <h3 className="text-sm font-medium text-green-800">All Products</h3>*/}
            {/*            </Link>*/}
            {/*            <Link href="/recipes" className="bg-green-50 rounded-lg p-3 text-center">*/}
            {/*                <h3 className="text-sm font-medium text-green-800">Recipes</h3>*/}
            {/*            </Link>*/}
            {/*            /!*you dont ask it, but this is unused route, so I have to ask what i need to do with it*!/*/}
            {/*            <Link href="/sale" className="bg-green-50 rounded-lg p-3 text-center">*/}
            {/*                <h3 className="text-sm font-medium text-green-800">On Sale</h3>*/}
            {/*            </Link>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            <Footer/>

        </main>
    )
}