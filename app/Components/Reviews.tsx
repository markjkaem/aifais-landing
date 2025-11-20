import { FaStar, FaRegStar } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const reviews = [
  // {
  //   name: "Zack B",
  //   rating: 5,
  //   text: "De workflows zijn goed ingesteld en besparen nu veel tijd. Heren bedankt!",
  // },
  {
    name: "Dekker Rotterdam",
    rating: 5,
    text: "Binnen 3 weken hadden we onze offerteflow volledig geautomatiseerd. We besparen nu 10 tallen uren per week.",
  },
  // Je kunt hier meer reviews toevoegen
];

export default function GoogleReviews() {
  return (
    <section className="mt-12 p-4 bg-gray-100 rounded-2xl shadow-lg w-80 mx-auto">
      <div className="flex items-center mb-6">
        <FcGoogle className="w-8 h-8 mr-2" />
        <h2 className=" text-xs font-bold text-gray-800">
          4.9/5 sterren op Google
        </h2>
      </div>

      <div className="space-y-6 text-xs">
        {reviews.map((review, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900">{review.name}</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) =>
                  i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                )}
              </div>
            </div>
            <p className="text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-2 text-right text-xs">
        <a
          href="https://www.google.com/search?sca_esv=d8140a1b87a5a1ad&hl=nl-NL&sxsrf=AE3TifP2NyEPAQ_nc1j-C7K7f1oYq35THw:1763496756982&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E5vBGIwaBGWd9QfpeKQ5ssd-dIj2eD7X3_dWw_vaTu-KQTU1jKzmrq6k4LxA9kyVpsR81u7Sz00Cyzwv9hsK6yHabStD&q=Ai+Fais+Reviews&sa=X&ved=2ahUKEwjtxoyuwfyQAxU0hf0HHdxWM2MQ0bkNegQIIhAD&cshid=1763496806830378&biw=1536&bih=695&dpr=1.25"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-medium text-blue-600 hover:underline"
        >
          Bekijk alle Google reviews
          <FcGoogle className="ml-2 w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
