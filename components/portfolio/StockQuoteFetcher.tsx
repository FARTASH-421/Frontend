import { useState } from "react";
import axios from "axios";

const StockQuoteModule = () => {
  const [showInput, setShowInput] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<any>(null);

  const fetchStockQuote = async () => {
    if (!symbol.trim()) {
      setError("Please enter a stock symbol");
      return;
    }

    setLoading(true);
    setError("");
    setQuote(null);

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.trim()}&apikey=1B1N9VVRMDLA4ICN`
      );

      if (response.data["Global Quote"]) {
        setQuote(response.data["Global Quote"]);
      } else if (response.data.Note) {
        setError("API rate limit reached. Please try again later.");
      } else {
        setError("No data found for this symbol");
      }
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.");
      console.error("Error fetching stock quote:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetModule = () => {
    setShowInput(false);
    setSymbol("");
    setQuote(null);
    setError("");
  };

  return (
    <div className="max-w-md mx-auto">
      {!showInput && !quote && (
        <button
          onClick={() => setShowInput(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Get Stock Quote
        </button>
      )}

      {showInput && !quote && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Enter Stock Symbol
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchStockQuote}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? (
                <span className="flex items-center gap-1">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Fetching...
                </span>
              ) : (
                "Get Quote"
              )}
            </button>
          </div>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          <button
            onClick={resetModule}
            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      )}

      {quote && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {quote["01. symbol"]} - Stock Quote
            </h2>
            <button
              onClick={resetModule}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Current Price</span>
              <span className="font-medium">${quote["05. price"]}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Change</span>
              <span
                className={`font-medium ${
                  parseFloat(quote["09. change"]) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {quote["09. change"]} ({quote["10. change percent"]})
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Open</span>
              <span className="font-medium">${quote["02. open"]}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">High</span>
              <span className="font-medium">${quote["03. high"]}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Low</span>
              <span className="font-medium">${quote["04. low"]}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Volume</span>
              <span className="font-medium">{quote["06. volume"]}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Previous Close</span>
              <span className="font-medium">
                ${quote["08. previous close"]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Latest Trading Day</span>
              <span className="font-medium">
                {quote["07. latest trading day"]}
              </span>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>Data provided by Alpha Vantage API</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockQuoteModule;
