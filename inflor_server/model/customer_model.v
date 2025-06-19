module model

import rand
import time

@[table: 'customers']
pub struct Customer {
pub:
	customer_id string @[primary]
	created_at  time.Time
pub mut:
	customer string
	insta    string
	phone    string
	city     string
	post     string
}

pub fn new_customer(customer string, insta string, phone string, city string, post string) Customer {
	return Customer{
		customer_id: rand.uuid_v4()
		created_at:  time.now()
		customer:    customer
		insta:       insta
		phone:       phone
		city:        city
		post:        post
	}
}
