Product Catalog — DSW02B1 Graded Lab 3
A React app (built with Vite) that fetches products from the Fake Store API and lets the user filter them by name in real time.

Features
Fetches the product list on mount with useEffect.
Shows a loading state while the request is in flight.
Shows an error state (with a Retry button) if the request fails.
Case-insensitive, substring search filter with a Clear button.
Shows a "no results" message when nothing matches the search.
Responsive grid of product cards (image, category, title, price).
Notes
State is split into products (raw API data, source of truth), searchQuery, loading, and error. filteredProducts is derived with useMemo from products + searchQuery on every render instead of being stored separately, so filtering always runs against the original list and typing quickly never compounds stale filters.
The useEffect fetch has an empty dependency array so it runs exactly once, on mount, with a cleanup flag (isCancelled) to avoid setting state after unmount.
