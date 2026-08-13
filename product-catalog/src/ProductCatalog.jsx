import { useEffect, useMemo, useState } from 'react';
import './ProductCatalog.css';

const productList = 'https://fakestoreapi.com/products';

function ProductCatalog() {
  // full product list 
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(productList);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!isCancelled) {
          setProducts(data);
        }
      } catch {
        if (!isCancelled) {
          setError(true);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
  }

  function handleClearSearch() {
    setSearchQuery('');
  }

  function handleRetry() {
  
    setError(false);
    setLoading(true);
    setProducts([]);

    fetch(productList)
      .then((response) => {
        if (!response.ok) throw new Error('Request failed');
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  return (
    <div className="catalog">
      <header className="catalog__header">
        <p className="catalog__eyebrow">The Ledger</p>
        <h1 className="catalog__title">Product Catalog</h1>
        <p className="catalog__subtitle">
          Search the full stock list below — every entry updates live as you
          type.
        </p>

        <div className="search-bar">
          <svg
            className="search-bar__icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="16.5"
              y1="16.5"
              x2="21"
              y2="21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search products by name…"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search products by name"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-bar__clear"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      <main className="catalog__body">
        {loading && (
          <div className="status status--loading" role="status">
            <span className="status__spinner" aria-hidden="true" />
            Loading products…
          </div>
        )}

        {!loading && error && (
          <div className="status status--error" role="alert">
            <p>Failed to load products. Please check your connection.</p>
            <button type="button" className="status__retry" onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="status status--empty" role="status">
           No results.
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <p className="catalog__count">
              Showing {filteredProducts.length} of {products.length} items
            </p>
            <ul className="product-list">
              {filteredProducts.map((product) => (
                <li className="product-card" key={product.id}>
                  <div className="product-card__image-wrap">
                    <img
                      className="product-card__image"
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                    />
                  </div>
                  <span className="product-card__category">
                    {product.category}
                  </span>
                  <h2 className="product-card__title">{product.title}</h2>
                  <p className="product-card__price">
                    R{product.price.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default ProductCatalog;
