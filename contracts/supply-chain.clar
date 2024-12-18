;; Supply Chain Management Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-unauthorized (err u403))
(define-constant err-not-found (err u404))

;; Define data variables
(define-map products 
  uint 
  {name: (string-ascii 50), 
   status: (string-ascii 20), 
   current-owner: principal})

(define-data-var product-counter uint u0)

;; Define public functions
(define-public (add-product (name (string-ascii 50)))
  (let ((new-id (+ (var-get product-counter) u1)))
    (map-set products new-id 
      {name: name, 
       status: "created", 
       current-owner: contract-owner})
    (var-set product-counter new-id)
    (ok new-id)))

(define-public (update-status (product-id uint) (new-status (string-ascii 20)))
  (let ((product (unwrap! (map-get? products product-id) err-not-found)))
    (asserts! (is-eq tx-sender (get current-owner product)) err-unauthorized)
    (map-set products product-id 
      (merge product {status: new-status}))
    (ok true)))

(define-public (transfer-ownership (product-id uint) (new-owner principal))
  (let ((product (unwrap! (map-get? products product-id) err-not-found)))
    (asserts! (is-eq tx-sender (get current-owner product)) err-unauthorized)
    (map-set products product-id 
      (merge product {current-owner: new-owner}))
    (ok true)))

;; Define read-only functions
(define-read-only (get-product (product-id uint))
  (map-get? products product-id))

(define-read-only (get-product-count)
  (var-get product-counter))