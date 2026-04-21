export function ProductSkeleton() {
  return (
    <div className="product-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text-sm" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}
