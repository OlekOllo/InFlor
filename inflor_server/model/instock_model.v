module model

import rand
import time

@[table: 'instocks']
pub struct Instock {
pub:
	instock_id string @[primary]
pub mut:
	product_id string @[fkey: 'product_id'; ref: 'products.product_id']
	updated_at time.Time
	quantity   string
	note       string
}

pub fn new_instock(product_id string, quantity string, note string) Instock {
	return Instock{
		instock_id: rand.uuid_v4()
		updated_at: time.now()
		product_id: product_id
		quantity:   quantity
		note:       note
	}
}
