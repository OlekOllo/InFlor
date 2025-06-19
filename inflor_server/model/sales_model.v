module model

import time

@[table: 'sales']
pub struct Sale {
pub:
	created_at time.Time
pub mut:
	customer_id string @[fkey: 'customer_id'; ref: 'customers.customer_id']
	product_id  string @[fkey: 'product_id'; ref: 'products.product_id']
	quantity    string
	note        string
}

pub fn new_sale(customer_id string, product_id string, quantity string, note string) Sale {
	return Sale{
		created_at:  time.now()
		customer_id: customer_id
		product_id:  product_id
		quantity:    quantity
		note:        note
	}
}

