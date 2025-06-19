module model

import rand
import time

@[table: 'products']
pub struct Product {
pub:
	product_id string @[primary]
	created_at time.Time
pub mut:
	product string
	price   string
}

pub fn new_product(product string, price string) Product {
	return Product{
		product_id: rand.uuid_v4()
		created_at: time.now()
		product:    product
		price:      price
	}
}
