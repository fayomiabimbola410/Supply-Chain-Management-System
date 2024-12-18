;; Product Quality Management Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-unauthorized (err u403))
(define-constant err-not-found (err u404))
(define-constant err-invalid-rating (err u400))

;; Define data variables
(define-map product-ratings
  uint
  {total-rating: uint,
   rating-count: uint})

;; Define public functions
(define-public (add-rating (product-id uint) (rating uint))
  (let ((current-ratings (default-to {total-rating: u0, rating-count: u0} 
                                     (map-get? product-ratings product-id))))
    (asserts! (and (>= rating u1) (<= rating u5)) err-invalid-rating)
    (map-set product-ratings product-id
      {total-rating: (+ (get total-rating current-ratings) rating),
       rating-count: (+ (get rating-count current-ratings) u1)})
    (ok true)))

;; Define read-only functions
(define-read-only (get-average-rating (product-id uint))
  (let ((ratings (default-to {total-rating: u0, rating-count: u0} 
                             (map-get? product-ratings product-id))))
    (if (is-eq (get rating-count ratings) u0)
        u0
        (/ (get total-rating ratings) (get rating-count ratings)))))

(define-read-only (get-rating-count (product-id uint))
  (default-to u0 
    (get rating-count (map-get? product-ratings product-id))))