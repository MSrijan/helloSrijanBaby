import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import Container from "../../components/Container";
import cardBG from "../../assets/Card/CardBG.jpg";

const Home = () => {
  const [deck, setDeck] = useState<any>(null);
  const [count, setCount] = useState<number>(0);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]); // Track flipped status per card
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]); // Track indices of flipped cards

  // Fetch a new shuffled deck on component mount
  const fetchNewDeck = () => {
    setLoading(true);
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
      .then((response) => response.json())
      .then((data) => {
        setDeck(data);
        console.log("Deck Shuffled:", data);
      })
      .catch((error) => {
        console.error("Error fetching the deck:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNewDeck();
  }, []);

  // Fetch all 52 cards after the deck is shuffled
  const drawAllCards = () => {
    if (!deck) return;

    setLoading(true);
    fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=52`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cards) {
          const allCards = data.cards.map((card: any) => ({
            ...card,
            bg: cardBG, // Assign the card back image
          }));
          setCards(allCards);
          setFlippedCards(new Array(allCards.length).fill(false)); // Initialize flipped state
        } else {
          console.error("Error: No cards found in response:", data);
        }
      })
      .catch((error) => {
        console.error("Error drawing cards:", error);
      })
      .finally(() => setLoading(false));
  };

  // Automatically draw all cards when deck is fetched
  useEffect(() => {
    if (deck) {
      drawAllCards();
    }
  }, [deck]);

  // Handle card click to toggle flip state
  const handleCardClick = (index: number) => {
    if (flippedCards[index] || flippedIndices.length === 2) return; // Prevent flipping more than 2 cards or already flipped cards

    setFlippedIndices((prev) => [...prev, index]); // Track the indices of flipped cards
    setFlippedCards((prevFlippedCards) => {
      const newFlippedCards = [...prevFlippedCards];
      newFlippedCards[index] = true;
      return newFlippedCards;
    });
  };

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.value === secondCard.value) {
        // Cards match, update score
        setCount((prev) => prev + 2);
        setFlippedIndices([]); // Reset flipped indices
      } else {
        // Cards don't match, flip them back after 1 second
        setTimeout(() => {
          setFlippedCards((prevFlippedCards) => {
            const newFlippedCards = [...prevFlippedCards];
            newFlippedCards[firstIndex] = false;
            newFlippedCards[secondIndex] = false;
            return newFlippedCards;
          });
          setFlippedIndices([]); // Reset flipped indices
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  // Reset the game when the score reaches 52
  useEffect(() => {
    if (count === 52) {
      toast.success("🎉 Congratulations! You've completed the game!");
      // Reset the game
      setCount(0);
      setCards([]);
      setFlippedCards([]);
      setFlippedIndices([]);
      fetchNewDeck();
    }
  }, [count]);

  return (
    <div className="min-h-screen max-h-screen bg-gray-50">
      <Container>
        {/* Toast Container for Notifications */}
        <ToastContainer />

        {/* Header */}
        <section>
          <h1 className="text-heading font-bold text-center">
            <span className="text-red-600">Card Memory </span>
            <span className="text-yellow-500">Game</span>
          </h1>
          <p className="italic text-center text-sm text-gray-600 max-w-2xl mx-auto">
            Below is a deck of cards. Flip two matching cards to earn points.
            The game ends when you get all matches!
          </p>
        </section>

        {/* Game Section */}
        <section>
          <h1 className="text-center font-bold text-xl mt-4">Points: {count}</h1>
          {loading ? (
            <p>Loading Cards...</p>
          ) : cards.length > 0 ? (
            <div className="grid grid-cols-13 mt-5">
              {cards.map((card: any, index: number) => (
                <div key={index} className="p-1 mx-auto">
                  {flippedCards[index] ? (
                    <img
                      src={card.image}
                      alt={`${card.value} of ${card.suit}`}
                      className="cursor-pointer"
                    />
                  ) : (
                    <div
                      className="relative cursor-pointer"
                      onClick={() => handleCardClick(index)}
                    >
                      <img src={card.bg} alt="Card Back" className="cursor-pointer" />
                      <h1 className="absolute top-2 left-4 text-white font-bold text-xl">
                        {index + 1}
                      </h1>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No cards available.</p>
          )}
        </section>
      </Container>
    </div>
  );
};

export default Home;
