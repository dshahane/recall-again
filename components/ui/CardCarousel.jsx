import {Card} from "@/components/ui/card";

/**
 * Renders a horizontally scrollable carousel of cards.
 * @param {Array<Object>} cards - Array of card objects to display.
 */
export default function CardCarousel({ cards }) {
    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex space-x-4 p-2 overflow-x-auto scrollbar-hide">
                {cards.map((card, index) => (
                    <div key={index} className="flex-none w-64 md:w-80">
                        <Card {...card} />
                    </div>
                ))}
            </div>
        </div>
    );
};